import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Exam, Subject, ExamForm } from '../../types';
import { getExams, getSubjects, deleteExam, getExamForms } from '../../lib/db';
import { deleteFile } from '../../lib/storage';
import { FileText, Edit, Trash2, Plus, Search, Filter, RefreshCw, X, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText as FileTextIcon, Compass, Clock } from 'lucide-react';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const AdminExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  // Get unique years from exams
  const uniqueYears = React.useMemo(() => {
    return [...new Set(exams.map(exam => exam.year))].sort((a, b) => b - a);
  }, [exams]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = getSubjects();
      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData);
      
      // Fetch exam forms
      const { data: formsData, error: formsError } = getExamForms();
      if (formsError) throw formsError;
      setExamForms(formsData);
      
      // Fetch exams
      const { data: examsData, error: examsError } = getExams();
      if (examsError) throw examsError;
      setExams(examsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('אירעה שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    
    try {
      // Delete files if they are local
      if (examToDelete.exam_file_url.startsWith('local://')) {
        deleteFile(examToDelete.exam_file_url);
      }
      
      if (examToDelete.solution_file_url.startsWith('local://')) {
        deleteFile(examToDelete.solution_file_url);
      }
      
      // Delete exam from database
      const { success, error } = deleteExam(examToDelete.id);
      
      if (error) throw error;
      
      if (success) {
        setExams(exams.filter(e => e.id !== examToDelete.id));
      }
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert('אירעה שגיאה במחיקת הבגרות');
    } finally {
      setShowDeleteConfirmation(false);
      setExamToDelete(null);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  const getFormName = (formId: string) => {
    const form = examForms.find(f => f.id === formId);
    return form ? form.name : '';
  };

  const getSeasonName = (season?: 'winter' | 'summer') => {
    if (!season) return '';
    return season === 'winter' ? 'חורף' : 'קיץ';
  };

  // Get forms for the selected subject
  const getFormsForSubject = (subjectId: string) => {
    if (subjectId === 'all') return examForms;
    return examForms.filter(form => form.subject_id === subjectId);
  };

  // Filter exams based on search term and selected filters
  const filteredExams = exams.filter(exam => {
    const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;
    const matchesForm = selectedForm === 'all' || exam.form === selectedForm;
    const matchesYear = selectedYear === 'all' || exam.year.toString() === selectedYear;
    const matchesSeason = selectedSeason === 'all' || exam.season === selectedSeason;
    
    const subjectName = getSubjectName(exam.subject).toLowerCase();
    const formName = exam.form ? getFormName(exam.form).toLowerCase() : '';
    
    const matchesSearch = searchTerm === '' || 
      subjectName.includes(searchTerm.toLowerCase()) ||
      formName.includes(searchTerm.toLowerCase()) ||
      exam.year.toString().includes(searchTerm);
    
    return matchesSubject && matchesForm && matchesYear && matchesSeason && matchesSearch;
  });

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedSubject('all');
    setSelectedForm('all');
    setSelectedYear('all');
    setSelectedSeason('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex justify-center items-center relative overflow-hidden">
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
          <FileTextIcon className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
          <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
          <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען בגרויות...</p>
        </div>
      </div>
    );
  }

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
        <FileTextIcon className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
        <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
        <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול בגרויות</h1>
          <Link
            to="/admin/exams/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            הוסף בגרות
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-primary-900">חיפוש וסינון</h2>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button 
                onClick={toggleFilters}
                className="flex items-center text-primary-600 md:hidden"
              >
                <Filter className="h-5 w-5 mr-1" />
                {isFilterOpen ? 'הסתר סינון' : 'הצג סינון'}
              </button>
              <button 
                onClick={resetFilters}
                className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-1" />
                נקה סינון
              </button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="חפש לפי מקצוע, שאלון או שנה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isFilterOpen || window.innerWidth >= 768 ? 'block' : 'hidden'}`}>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                מקצוע
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedForm('all'); // Reset form selection when subject changes
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">כל המקצועות</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Form filter - only show if a subject is selected */}
            <div>
              <label htmlFor="form" className="block text-sm font-medium text-gray-700 mb-1">
                שאלון
              </label>
              <select
                id="form"
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">כל השאלונים</option>
                {getFormsForSubject(selectedSubject).map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                שנה
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">כל השנים</option>
                {uniqueYears.map((year) => (
                  <option key={`year-${year}`} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
                מועד
              </label>
              <select
                id="season"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">כל המועדים</option>
                <option value="winter">חורף</option>
                <option value="summer">קיץ</option>
              </select>
            </div>
          </div>
          
          {/* Filter Status */}
          {(selectedSubject !== 'all' || selectedYear !== 'all' || selectedForm !== 'all' || selectedSeason !== 'all' || searchTerm) && (
            <div className="mt-4 bg-primary-50 p-3 rounded-md">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-primary-700">סינון פעיל:</span>
                
                {selectedSubject !== 'all' && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>מקצוע: {getSubjectName(selectedSubject)}</span>
                    <button 
                      onClick={() => setSelectedSubject('all')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedForm !== 'all' && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>שאלון: {getFormName(selectedForm)}</span>
                    <button 
                      onClick={() => setSelectedForm('all')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedYear !== 'all' && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>שנה: {selectedYear}</span>
                    <button 
                      onClick={() => setSelectedYear('all')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedSeason !== 'all' && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>מועד: {getSeasonName(selectedSeason as 'winter' | 'summer')}</span>
                    <button 
                      onClick={() => setSelectedSeason('all')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {searchTerm && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>חיפוש: {searchTerm}</span>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Exams Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מקצוע
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שאלון
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שנה
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מועד
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      לא נמצאו בגרויות
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getSubjectName(exam.subject)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.form ? getFormName(exam.form) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.season ? getSeasonName(exam.season) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => navigate(`/admin/exams/edit/${exam.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="ערוך"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteExam(exam)}
                            className="text-red-600 hover:text-red-900"
                            title="מחק"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && examToDelete && (
        <DeleteConfirmation
          title="מחיקת בגרות"
          message={`האם אתה בטוח שברצונך למחוק את הבגרות ${getSubjectName(examToDelete.subject)}${examToDelete.form ? ` - שאלון ${getFormName(examToDelete.form)}` : ''} - ${examToDelete.year}?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteExam}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setExamToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminExams;