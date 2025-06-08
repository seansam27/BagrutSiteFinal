import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Subject, Exam, ExamForm, QuestionSolution } from '../../types';
import { useForm } from 'react-hook-form';
import { Edit, Save, ArrowLeft, AlertCircle, CheckCircle, Plus, X, Trash } from 'lucide-react';
import { getSubjects, getExam, updateExam, getExamFormsBySubject, getQuestionSolutions, addQuestionSolution, updateQuestionSolution, deleteQuestionSolution } from '../../lib/db';
import { storeFile, getFileData, deleteFile } from '../../lib/storage';
import FileUpload from '../../components/FileUpload';
import VideoUpload from '../../components/VideoUpload';
import DeleteConfirmation from '../../components/DeleteConfirmation';

interface EditExamFormData {
  subject: string;
  form: string;
  year: number;
  season: 'winter' | 'summer' | '';
}

const AdminEditExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [examFile, setExamFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [examFileUrl, setExamFileUrl] = useState<string>('');
  const [solutionFileUrl, setSolutionFileUrl] = useState<string>('');
  
  const [questionSolutions, setQuestionSolutions] = useState<QuestionSolution[]>([]);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [questionVideoUrl, setQuestionVideoUrl] = useState<string>('');
  const [editingSolutionId, setEditingSolutionId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState<QuestionSolution | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EditExamFormData>();
  const selectedSubject = watch('subject');

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedSubject) {
      fetchExamForms(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: subjectsData } = getSubjects();
      setSubjects(subjectsData);
      
      if (id) {
        const { data: examData } = getExam(id);
        if (examData) {
          setValue('subject', examData.subject);
          setValue('year', examData.year);
          if (examData.form) setValue('form', examData.form);
          if (examData.season) setValue('season', examData.season);
          
          setExamFileUrl(examData.exam_file_url);
          setSolutionFileUrl(examData.solution_file_url);
          
          fetchExamForms(examData.subject);
          fetchQuestionSolutions(examData.id);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('אירעה שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamForms = async (subjectId: string) => {
    const { data } = getExamFormsBySubject(subjectId);
    setExamForms(data);
  };

  const fetchQuestionSolutions = async (examId: string) => {
    const { data } = getQuestionSolutions(examId);
    setQuestionSolutions(data);
  };

  const handleAddQuestionSolution = async () => {
    if (!id || !questionVideoUrl || !questionNumber) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (editingSolutionId) {
        const { data } = updateQuestionSolution(editingSolutionId, {
          solution_video_url: questionVideoUrl
        });
        
        if (data) {
          setQuestionSolutions(questionSolutions.map(s => 
            s.id === editingSolutionId ? data : s
          ));
          setSuccess('הפתרון עודכן בהצלחה');
        }
      } else {
        const existingSolution = questionSolutions.find(
          sol => sol.question_number === questionNumber
        );
        
        if (existingSolution) {
          setError(`כבר קיים פתרון לשאלה ${questionNumber}`);
          return;
        }
        
        const { data } = addQuestionSolution(
          id,
          questionNumber,
          questionVideoUrl
        );
        
        if (data) {
          setQuestionSolutions([...questionSolutions, data]);
          setSuccess('הפתרון נוסף בהצלחה');
        }
      }
      
      setQuestionNumber(1);
      setQuestionVideoUrl('');
      setShowAddQuestionForm(false);
      setEditingSolutionId(null);
    } catch (err) {
      console.error('Error adding/updating question solution:', err);
      setError('אירעה שגיאה בהוספת/עדכון הפתרון');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EditExamFormData) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const updates: Partial<Exam> = {
        subject: data.subject,
        year: data.year,
        solution_video_url: "",
        form: data.form || undefined,
        season: data.season || undefined
      };
      
      if (examFile) {
        if (examFileUrl.startsWith('local://')) {
          deleteFile(examFileUrl);
        }
        updates.exam_file_url = await storeFile(examFile);
      }
      
      if (solutionFile) {
        if (solutionFileUrl.startsWith('local://')) {
          deleteFile(solutionFileUrl);
        }
        updates.solution_file_url = await storeFile(solutionFile);
      }
      
      const { data: updatedExam } = updateExam(id, updates);
      
      if (updatedExam) {
        setExamFileUrl(updatedExam.exam_file_url);
        setSolutionFileUrl(updatedExam.solution_file_url);
        setSuccess('הבגרות עודכנה בהצלחה');
        
        setTimeout(() => {
          navigate('/admin/exams');
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating exam:', err);
      setError('אירעה שגיאה בעדכון הבגרות');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSolution = async () => {
    if (!solutionToDelete) return;
    
    try {
      setLoading(true);
      
      const { success } = deleteQuestionSolution(solutionToDelete.id);
      
      if (success) {
        setQuestionSolutions(questionSolutions.filter(s => s.id !== solutionToDelete.id));
        setSuccess('הפתרון נמחק בהצלחה');
      }
    } catch (err) {
      console.error('Error deleting solution:', err);
      setError('אירעה שגיאה במחיקת הפתרון');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setSolutionToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Edit className="h-6 w-6 text-primary-600 mr-2" />
            <h1 className="text-xl font-semibold">עריכת בגרות</h1>
          </div>
          <button
            onClick={() => navigate('/admin/exams')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
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
              preview={examFileUrl}
            />

            <FileUpload
              onFileSelect={(file) => setSolutionFile(file)}
              onClear={() => setSolutionFile(null)}
              accept=".pdf"
              label="קובץ פתרון"
              selectedFile={solutionFile}
              preview={solutionFileUrl}
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
                      disabled={!!editingSolutionId}
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
                  {editingSolutionId ? 'עדכן פתרון' : 'הוסף פתרון'}
                </button>
              </div>
            )}

            {questionSolutions.length > 0 ? (
              <div className="space-y-2">
                {questionSolutions
                  .sort((a, b) => a.question_number - b.question_number)
                  .map((solution) => (
                    <div 
                      key={solution.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span>שאלה {solution.question_number}</span>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          type="button"
                          onClick={() => {
                            setQuestionNumber(solution.question_number);
                            setQuestionVideoUrl(solution.solution_video_url || '');
                            setEditingSolutionId(solution.id);
                            setShowAddQuestionForm(true);
                          }}
                          className="text-primary-500 hover:text-primary-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSolutionToDelete(solution);
                            setShowDeleteConfirmation(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
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
                  <Save className="animate-spin h-4 w-4 mr-2" />
                  מעדכן...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  שמור שינויים
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {showDeleteConfirmation && solutionToDelete && (
        <DeleteConfirmation
          title="מחיקת פתרון"
          message={`האם אתה בטוח שברצונך למחוק את הפתרון לשאלה ${solutionToDelete.question_number}?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteSolution}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setSolutionToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminEditExam;