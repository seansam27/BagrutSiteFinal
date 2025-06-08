/*
  # Add sample data to existing tables

  1. Changes
    - Adds sample subject data
    - Adds sample exam data
  
  This migration assumes the tables and policies are already created by previous migrations.
  It only adds sample data to the existing tables.
*/

-- Insert sample subjects (only if they don't exist)
INSERT INTO subjects (name)
SELECT 'מתמטיקה 5 יח'''
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'מתמטיקה 5 יח''');

INSERT INTO subjects (name)
SELECT 'מתמטיקה 4 יח'''
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'מתמטיקה 4 יח''');

INSERT INTO subjects (name)
SELECT 'פיזיקה 5 יח'''
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'פיזיקה 5 יח''');

INSERT INTO subjects (name)
SELECT 'כימיה 5 יח'''
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'כימיה 5 יח''');

INSERT INTO subjects (name)
SELECT 'אנגלית 5 יח'''
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'אנגלית 5 יח''');

INSERT INTO subjects (name)
SELECT 'לשון'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'לשון');

INSERT INTO subjects (name)
SELECT 'היסטוריה'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'היסטוריה');

INSERT INTO subjects (name)
SELECT 'תנ"ך'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'תנ"ך');

INSERT INTO subjects (name)
SELECT 'אזרחות'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'אזרחות');

INSERT INTO subjects (name)
SELECT 'ספרות'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = 'ספרות');

-- Insert sample exams
DO $$
DECLARE
  math5_id uuid;
  physics_id uuid;
  english_id uuid;
BEGIN
  -- Get subject IDs
  SELECT id INTO math5_id FROM subjects WHERE name = 'מתמטיקה 5 יח''';
  SELECT id INTO physics_id FROM subjects WHERE name = 'פיזיקה 5 יח''';
  SELECT id INTO english_id FROM subjects WHERE name = 'אנגלית 5 יח''';
  
  -- Insert sample exams if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM exams 
    WHERE subject = math5_id AND year = 2023
  ) THEN
    INSERT INTO exams (subject, year, exam_file_url, solution_file_url, solution_video_url)
    VALUES (
      math5_id, 
      2023, 
      'https://example.com/math5_2023.pdf', 
      'https://example.com/math5_2023_solution.pdf', 
      'https://www.youtube.com/watch?v=example1'
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM exams 
    WHERE subject = math5_id AND year = 2022
  ) THEN
    INSERT INTO exams (subject, year, exam_file_url, solution_file_url, solution_video_url)
    VALUES (
      math5_id, 
      2022, 
      'https://example.com/math5_2022.pdf', 
      'https://example.com/math5_2022_solution.pdf', 
      'https://www.youtube.com/watch?v=example2'
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM exams 
    WHERE subject = physics_id AND year = 2023
  ) THEN
    INSERT INTO exams (subject, year, exam_file_url, solution_file_url, solution_video_url)
    VALUES (
      physics_id, 
      2023, 
      'https://example.com/physics_2023.pdf', 
      'https://example.com/physics_2023_solution.pdf', 
      'https://www.youtube.com/watch?v=example3'
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM exams 
    WHERE subject = english_id AND year = 2023
  ) THEN
    INSERT INTO exams (subject, year, exam_file_url, solution_file_url, solution_video_url)
    VALUES (
      english_id, 
      2023, 
      'https://example.com/english_2023.pdf', 
      'https://example.com/english_2023_solution.pdf', 
      'https://www.youtube.com/watch?v=example4'
    );
  END IF;
END $$;