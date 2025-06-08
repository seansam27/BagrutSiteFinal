import React, { useState, useEffect } from 'react';
import { Subject, ExamForm } from '../../types';
import { useForm } from 'react-hook-form';
import { BookOpen, Plus, Trash, Tag, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import { getSubjects, getExamFormsBySubject, addExamForm, deleteExamForm } from '../../lib/db';
import DeleteConfirmation from '../../components/DeleteConfirmation';

interface ExamFormFormData {
  subject: string;
  name: string;
}

const AdminExamForms: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formToDelete, setFormToDelete] = useState<ExamForm | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ExamFormFormData>();
  
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
      setLoading(true);
      
      const { data, error } = getSubjects();
          
      if (error) throw error;
      setSubjects(data);
      
      // If there are subjects, select the first one by default
      if (data.length > 0) {
        setSelectedSubject(data[0].id);
        setValue('subject', data[0].id);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('אירעה שגיאה בטעינת המקצועות');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExamForms = async (subjectId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = getExamFormsBySubject(subjectId);
          
      if (error) throw error;
      setExamForms(data);
    } catch (err) {
      console.error('Error fetching exam forms:', err);
      setError('אירעה שגיאה בטעינת שאלוני הבגרות');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data: ExamFormFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const { data: newForm, error } = addExamForm(data.subject, data.name);
      
      if (error) throw error;
      
      if (newForm) {
        setExamForms([...examForms, newForm]);
        setSuccess('שאלון הבגרות נוסף בהצלחה');
        reset();
        setValue('subject', selectedSubject);
      }
    } catch (err) {
      console.error('Error adding exam form:', err);
      setError('אירעה שגיאה בהוספת שאלון הבגרות');
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDeleteForm = (form: ExamForm) => {
    setFormToDelete(form);
    setShowDeleteConfirmation(true);
  };
  
  const handleDeleteForm = async () => {
    if (!formToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const { success, error } = deleteExamForm(formToDelete.id);
      
      if (error) throw error;
      
      if (success) {
        setExamForms(examForms.filter(form => form.id !== formToDelete.id));
        setSuccess('שאלון הבגרות נמחק בהצלחה');
      }
    } catch (err) {
      console.error('Error deleting exam form:', err);
      setError('אירעה שגיאה במחיקת שאלון הבגרות');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setFormToDelete(null);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : '';
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען מקצועות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 relative overflow-hidden animate-fadeIn">
      {/* Background Icons */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <BookOpen className="absolute h-32 w-32 text-primary-600 top-[10%] left-[15%] transform -rotate-12" />
        <Calculator className="absolute h-24 w-24 text-indigo-600 top-[25%] left-[35%] transform rotate-6" />
        <GraduationCap className="absolute h-40 w-40 text-purple-600 top-[15%] right-[20%] transform rotate-12" />
        <PenTool className="absolute h-28 w-28 text-blue-600 top-[40%] left-[10%] transform -rotate-6" />
        <Brain className="absolute h-36 w-36 text-primary-700 top-[60%] left-[25%] transform rotate-12" />
        <Lightbulb className="absolute h-24 w-24 text-yellow-500 top-[20%] right-[10%] transform -rotate-12" />
        <School className="absolute h-32 w-32 text-indigo-700 top-[70%] right-[15%] transform rotate-6" />
        <Award className="absolute h-28 w-28 text-green-600 top-[50%] right-[30%] transform -rotate-6" />
        <FileText className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
        <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
        <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <Tag className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">ניהול שאלוני בגרות</h1>
        </div>
        
        {/* Subject Selection */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 hover:shadow-lg transition-shadow">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-900">בחירת מקצוע</h2>
            <p className="mt-1 text-sm text-blue-700">בחר מקצוע כדי לנהל את שאלוני הבגרות שלו</p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setValue('subject', e.target.value);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>בחר מקצוע</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Add Exam Form */}
        {selectedSubject && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 hover:shadow-lg transition-shadow">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-blue-900">הוספת שאלון בגרות חדש</h2>
              <p className="mt-1 text-sm text-blue-700">הוסף שאלון בגרות חדש למקצוע הנבחר</p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="hidden"
                    {...register('subject', { required: true })}
                    value={selectedSubject}
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    מספר שאלון
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="לדוגמה: 581"
                      {...register('name', { required: 'נדרש למלא מספר שאלון' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    הוסף שאלון
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Exam Forms List */}
        {selectedSubject && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-blue-900">רשימת שאלוני בגרות</h2>
              <p className="mt-1 text-sm text-blue-700">
                שאלוני בגרות עבור {getSubjectName(selectedSubject)}
              </p>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-4 py-5 sm:px-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">טוען שאלוני בגרות...</p>
                </li>
              ) : examForms.length === 0 ? (
                <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  אין שאלוני בגרות להצגה
                </li>
              ) : (
                examForms.map((form) => (
                  <li key={form.id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="text-gray-900 font-medium">{form.name}</span>
                    <button
                      onClick={() => confirmDeleteForm(form)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && formToDelete && (
        <DeleteConfirmation
          title="מחיקת שאלון בגרות"
          message={`האם אתה בטוח שברצונך למחוק את שאלון הבגרות "${formToDelete.name}"?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteForm}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setFormToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminExamForms;