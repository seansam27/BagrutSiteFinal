import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject, ExamForm } from '../../types';
import { useForm } from 'react-hook-form';
import { FileUp, Upload, Plus, X, BookOpen } from 'lucide-react';
import { getSubjects, getExamFormsBySubject, addExam, addQuestionSolution } from '../../lib/db';
import { storeFile } from '../../lib/storage';
import FileUpload from '../../components/FileUpload';
import VideoUpload from '../../components/VideoUpload';

interface AddExamFormData {
  subject: string;
  form: string;
  year: number;
  season: 'winter' | 'summer' | '';
}

interface QuestionSolution {
  questionNumber: number;
  videoUrl: string;
}

const AdminAddExam: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [examFile, setExamFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [questionSolutions, setQuestionSolutions] = useState<QuestionSolution[]>([]);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [questionVideoUrl, setQuestionVideoUrl] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<AddExamFormData>();
  const selectedSubject = watch('subject');

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchExamForms(selectedSubject);
    } else {
      setExamForms([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = getSubjects();
      if (error) throw error;
      setSubjects(data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('אירעה שגיאה בטעינת המקצועות');
    }
  };

  const fetchExamForms = async (subjectId: string) => {
    try {
      const { data, error } = getExamFormsBySubject(subjectId);
      if (error) throw error;
      setExamForms(data);
      setValue('form', '');
    } catch (err) {
      console.error('Error fetching exam forms:', err);
      setError('אירעה שגיאה בטעינת שאלוני הבגרות');
    }
  };

  const handleAddQuestionSolution = () => {
    if (!questionVideoUrl || !questionNumber) return;
    
    const existingSolution = questionSolutions.find(
      sol => sol.questionNumber === questionNumber
    );
    
    if (existingSolution) {
      setError(`כבר קיים פתרון לשאלה ${questionNumber}`);
      return;
    }
    
    setQuestionSolutions([
      ...questionSolutions,
      { questionNumber, videoUrl: questionVideoUrl }
    ]);
    
    setQuestionNumber(1);
    setQuestionVideoUrl('');
    setShowAddQuestionForm(false);
  };

  const removeQuestionSolution = (questionNumber: number) => {
    setQuestionSolutions(questionSolutions.filter(
      sol => sol.questionNumber !== questionNumber
    ));
  };

  const onSubmit = async (data: AddExamFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (!examFile) {
        setError('נדרש להעלות קובץ בחינה');
        setLoading(false);
        return;
      }
      
      if (!solutionFile) {
        setError('נדרש להעלות קובץ פתרון');
        setLoading(false);
        return;
      }
      
      const examFileUrl = await storeFile(examFile);
      const solutionFileUrl = await storeFile(solutionFile);
      
      const { data: newExam, error: insertError } = addExam(
        data.subject,
        data.year,
        examFileUrl,
        solutionFileUrl,
        "",
        data.form || undefined,
        data.season || undefined
      );
        
      if (insertError) throw insertError;
      
      if (newExam && questionSolutions.length > 0) {
        for (const solution of questionSolutions) {
          await addQuestionSolution(
            newExam.id,
            solution.questionNumber,
            solution.videoUrl
          );
        }
      }
      
      setSuccess('הבגרות נוספה בהצלחה!');
      reset();
      setExamFile(null);
      setSolutionFile(null);
      setQuestionSolutions([]);
      
      setTimeout(() => {
        navigate('/admin/exams');
      }, 2000);
    } catch (err) {
      console.error('Error adding exam:', err);
      setError('אירעה שגיאה בהוספת הבגרות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <FileUp className="h-6 w-6 text-primary-600 mr-2" />
          <h1 className="text-xl font-semibold">הוספת בגרות חדשה</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">מקצוע</label>
              <select
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary-500 transition-shadow"
                {...register('subject', { required: 'נדרש לבחור מקצוע' })}
              >
                <option value="">בחר מקצוע</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            {examForms.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">שאלון</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary-500 transition-shadow"
                  {...register('form')}
                >
                  <option value="">בחר שאלון</option>
                  {examForms.map((form) => (
                    <option key={form.id} value={form.id}>{form.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">שנה</label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary-500 transition-shadow"
                {...register('year', { 
                  required: 'נדרש למלא שנה',
                  min: {
                    value: 2000,
                    message: 'השנה חייבת להיות לפחות 2000'
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: `השנה לא יכולה להיות גדולה מ-${new Date().getFullYear()}`
                  }
                })}
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">מועד</label>
              <select
                className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary-500 transition-shadow"
                {...register('season')}
              >
                <option value="">בחר מועד</option>
                <option value="winter">חורף</option>
                <option value="summer">קיץ</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <FileUpload
              onFileSelect={(file) => setExamFile(file)}
              onClear={() => setExamFile(null)}
              accept=".pdf"
              label="קובץ בחינה"
              selectedFile={examFile}
            />

            <FileUpload
              onFileSelect={(file) => setSolutionFile(file)}
              onClear={() => setSolutionFile(null)}
              accept=".pdf"
              label="קובץ פתרון"
              selectedFile={solutionFile}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">פתרונות לשאלות</h3>
              <button
                type="button"
                onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showAddQuestionForm ? (
                  <span className="flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    ביטול
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    הוסף פתרון
                  </span>
                )}
              </button>
            </div>

            {showAddQuestionForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">מספר שאלה</label>
                    <input
                      type="number"
                      min="1"
                      value={questionNumber}
                      onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">קישור לסרטון</label>
                    <input
                      type="text"
                      value={questionVideoUrl}
                      onChange={(e) => setQuestionVideoUrl(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="הזן קישור YouTube"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestionSolution}
                  className="w-full p-2 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100"
                >
                  הוסף פתרון
                </button>
              </div>
            )}

            {questionSolutions.length > 0 ? (
              <div className="space-y-2">
                {questionSolutions
                  .sort((a, b) => a.questionNumber - b.questionNumber)
                  .map((solution) => (
                    <div 
                      key={solution.questionNumber}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span>שאלה {solution.questionNumber}</span>
                      <button
                        type="button"
                        onClick={() => removeQuestionSolution(solution.questionNumber)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">אין פתרונות לשאלות</p>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <Upload className="animate-spin h-4 w-4 mr-2" />
                  מעלה...
                </span>
              ) : (
                'הוסף בגרות'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddExam;