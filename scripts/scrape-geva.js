import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GEVA_URL = 'https://www.geva.co.il/';
const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// Create downloads directory if it doesn't exist
await fs.mkdir(DOWNLOAD_DIR, { recursive: true });

async function getSubjectId(subjectName) {
  const { data, error } = await supabase
    .from('subjects')
    .select('id')
    .eq('name', subjectName)
    .single();

  if (error) throw error;
  return data.id;
}

async function getFormId(subjectId, formName) {
  const { data, error } = await supabase
    .from('exam_forms')
    .select('id')
    .eq('subject_id', subjectId)
    .eq('name', formName)
    .single();

  if (error) throw error;
  return data.id;
}

async function uploadExam(subjectId, formId, year, season, fileUrl) {
  try {
    // Download the file
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'arraybuffer'
    });

    // Generate unique filename
    const filename = `exam_${subjectId}_${formId}_${year}_${season}.pdf`;
    const filepath = path.join(DOWNLOAD_DIR, filename);

    // Save file locally
    await fs.writeFile(filepath, response.data);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('exams')
      .upload(filename, response.data, {
        contentType: 'application/pdf'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('exams')
      .getPublicUrl(filename);

    // Add exam to database
    const { error: insertError } = await supabase
      .from('exams')
      .insert({
        subject: subjectId,
        form: formId,
        year: year,
        season: season,
        exam_file_url: publicUrl,
        solution_file_url: '', // Empty for now
        solution_video_url: '' // Empty for now
      });

    if (insertError) throw insertError;

    console.log(`Successfully uploaded exam: ${filename}`);
  } catch (error) {
    console.error(`Error uploading exam:`, error);
  }
}

async function scrapeGeva() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    // Get subject IDs
    const mathId = await getSubjectId('מתמטיקה 5 יח\'');
    const physicsId = await getSubjectId('פיזיקה 5 יח\'');

    // Get form IDs
    const form581Id = await getFormId(mathId, '581');
    const form582Id = await getFormId(mathId, '582');
    const mechanicsId = await getFormId(physicsId, 'מכניקה');
    const electricityId = await getFormId(physicsId, 'חשמל');

    // Navigate to math section
    await page.goto(`${GEVA_URL}/bagrut/math`);
    await page.waitForSelector('.exam-list');

    // Extract math exams
    const mathExams = await page.evaluate(() => {
      const exams = [];
      document.querySelectorAll('.exam-item').forEach(item => {
        const url = item.querySelector('a.download-exam')?.href;
        const title = item.querySelector('.exam-title')?.textContent;
        if (url && title) {
          // Parse year and season from title
          const yearMatch = title.match(/\d{4}/);
          const seasonMatch = title.match(/חורף|קיץ/);
          if (yearMatch && seasonMatch) {
            exams.push({
              url,
              year: parseInt(yearMatch[0]),
              season: seasonMatch[0] === 'חורף' ? 'winter' : 'summer',
              form: title.includes('581') ? '581' : title.includes('582') ? '582' : null
            });
          }
        }
      });
      return exams;
    });

    // Upload math exams
    for (const exam of mathExams) {
      if (exam.form === '581') {
        await uploadExam(mathId, form581Id, exam.year, exam.season, exam.url);
      } else if (exam.form === '582') {
        await uploadExam(mathId, form582Id, exam.year, exam.season, exam.url);
      }
    }

    // Navigate to physics section
    await page.goto(`${GEVA_URL}/bagrut/physics`);
    await page.waitForSelector('.exam-list');

    // Extract physics exams
    const physicsExams = await page.evaluate(() => {
      const exams = [];
      document.querySelectorAll('.exam-item').forEach(item => {
        const url = item.querySelector('a.download-exam')?.href;
        const title = item.querySelector('.exam-title')?.textContent;
        if (url && title) {
          const yearMatch = title.match(/\d{4}/);
          const seasonMatch = title.match(/חורף|קיץ/);
          if (yearMatch && seasonMatch) {
            exams.push({
              url,
              year: parseInt(yearMatch[0]),
              season: seasonMatch[0] === 'חורף' ? 'winter' : 'summer',
              form: title.includes('מכניקה') ? 'mechanics' : title.includes('חשמל') ? 'electricity' : null
            });
          }
        }
      });
      return exams;
    });

    // Upload physics exams
    for (const exam of physicsExams) {
      if (exam.form === 'mechanics') {
        await uploadExam(physicsId, mechanicsId, exam.year, exam.season, exam.url);
      } else if (exam.form === 'electricity') {
        await uploadExam(physicsId, electricityId, exam.year, exam.season, exam.url);
      }
    }

  } catch (error) {
    console.error('Error scraping Geva:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeGeva().catch(console.error);