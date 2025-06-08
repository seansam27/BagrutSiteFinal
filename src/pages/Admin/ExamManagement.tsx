import React, { useState, useEffect } from 'react';
import { Subject, ExamForm } from '../../types';
import { useForm } from 'react-hook-form';
import { BookOpen, Plus, Trash, Tag, FileUp, TabletSmartphone, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import { getSubjects, addSubject, deleteSubject, getExamForms, addExamForm, deleteExamForm } from '../../lib/db';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { Link } from 'react-router-dom';

interface SubjectFormData {
  name: string;
}

interface ExamFormFormData {
  subject: string;
  name: string;
}

const ExamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'forms' | 'add'>('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'subject' | 'form'} | null>(null);

  const { register: registerSubject, handleSubmit: handleSubmitSubject, formState: { errors: subjectErrors }, reset: resetSubject } = useForm<SubjectFormData>();
  const { register: registerForm, handleSubmit: handleSubmitForm, formState: { errors: formErrors }, reset: resetForm } = useForm<ExamFormFormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: subjectsData, error: subjectsError } = getSubjects();
      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData);
      
      const { data: formsData, error: formsError } = getExamForms();
      if (formsError) throw formsError;
      setExamForms(formsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('אירעה שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSubject = async (data: SubjectFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const { data: newSubject, error } = addSubject(data.name);
      
      if (error) throw error;
      
      if (newSubject) {
        setSubjects([...subjects, newSubject]);
        setSuccess('המקצוע נוסף בהצלחה');
        resetSubject();
      }
    } catch (err) {
      console.error('Error adding subject:', err);
      setError('אירעה שגיאה בהוספת המקצוע');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForm = async (data: ExamFormFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const { data: newForm, error } = addExamForm(data.subject, data.name);
      
      if (error) throw error;
      
      if (newForm) {
        setExamForms([...examForms, newForm]);
        setSuccess('השאלון נוסף בהצלחה');
        resetForm();
      }
    } catch (err) {
      console.error('Error adding form:', err);
      setError('אירעה שגיאה בהוספת השאלון');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, type: 'subject' | 'form') => {
    setItemToDelete({ id, type });
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setLoading(true);
      
      if (itemToDelete.type === 'subject') {
        const { success, error } = deleteSubject(itemToDelete.id);
        if (error) throw error;
        
        if (success) {
          setSubjects(subjects.filter(s => s.id !== itemToDelete.id));
          setSuccess('המקצוע נמחק בהצלחה');
        }
      } else {
        const { success, error } = deleteExamForm(itemToDelete.id);
        if (error) throw error;
        
        if (success) {
          setExamForms(examForms.filter(f => f.id !== itemToDelete.id));
          setSuccess('השאלון נמחק בהצלחה');
        }
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('אירעה שגיאה במחיקת הפריט');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 animate-fadeIn relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ניהול בגרויות</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/admin/exams/add"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <h3 className="text-lg font-medium mb-2">הוספת בגרות</h3>
            <p className="text-blue-100">הוסף בגרות חדשה למאגר</p>
          </Link>
          
          <button
            onClick={() => setActiveTab('subjects')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all text-right"
          >
            <h3 className="text-lg font-medium mb-2">ניהול מקצועות</h3>
            <p className="text-purple-100">הוסף או ערוך מקצועות לימוד</p>
          </button>
          
          <button
            onClick={() => setActiveTab('forms')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all text-right"
          >
            <h3 className="text-lg font-medium mb-2">ניהול שאלונים</h3>
            <p className="text-green-100">הוסף או ערוך שאלוני בגרות</p>
          </button>
        </div>

        {/* Tabs Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'subjects'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>ניהול מקצועות</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'forms'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <Tag className="h-5 w-5 mr-2" />
                <span>ניהול שאלונים</span>
              </div>
            </button>
          </div>

          {/* Content */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <form onSubmit={handleSubmitSubject} className="mb-8">
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="שם המקצוע"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      {...registerSubject('name', { required: 'נדרש למלא שם מקצוע' })}
                    />
                    {subjectErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{subjectErrors.name.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                  {subjects.map((subject) => (
                    <li key={subject.id} className="flex items-center justify-between p-4">
                      <span>{subject.name}</span>
                      <button
                        onClick={() => confirmDelete(subject.id, 'subject')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <form onSubmit={handleSubmitForm} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    {...registerForm('subject', { required: 'נדרש לבחור מקצוע' })}
                  >
                    <option value="">בחר מקצוע</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <input
                      type="text"
                      placeholder="מספר שאלון"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                      {...registerForm('name', { required: 'נדרש למלא מספר שאלון' })}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </form>

              <div className="bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                  {examForms.map((form) => (
                    <li key={form.id} className="flex items-center justify-between p-4">
                      <div>
                        <span className="font-medium">
                          {subjects.find(s => s.id === form.subject_id)?.name}
                        </span>
                        <span className="mx-2">-</span>
                        <span>{form.name}</span>
                      </div>
                      <button
                        onClick={() => confirmDelete(form.id, 'form')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && itemToDelete && (
        <DeleteConfirmation
          title={`מחיקת ${itemToDelete.type === 'subject' ? 'מקצוע' : 'שאלון'}`}
          message={`האם אתה בטוח שברצונך למחוק ${itemToDelete.type === 'subject' ? 'מקצוע' : 'שאלון'} זה?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setItemToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamManagement;