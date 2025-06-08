import React, { useState, useEffect } from 'react';
import { Exam, Subject, ExamForm, QuestionSolution } from '../types';
import { FileText, Search, Filter, X, RefreshCw, MessageSquare, ChevronDown, ChevronUp, Download, Video, Eye, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText as FileTextIcon, Compass, Clock } from 'lucide-react';
import { getExams, getSubjects, getExamForms, getQuestionSolutions } from '../lib/db';
import { getFileData } from '../lib/storage';
import ExamForum from '../components/ExamForum';
import VideoPlayerModal from '../components/VideoPlayerModal';
import PDFViewer from '../components/PDFViewer';
import PDFViewerFallback from '../components/PDFViewerFallback';

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examForms, setExamForms] = useState<ExamForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Expanded exam
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
  const [examQuestionSolutions, setExamQuestionSolutions] = useState<Record<string, QuestionSolution[]>>({});
  
  // Forum
  const [activeForumExamId, setActiveForumExamId] = useState<string | null>(null);
  
  // Video Player
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  
  // PDF Viewer
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>('');
  const [activePdfType, setActivePdfType] = useState<'exam' | 'solution' | null>(null);
  const [selectedExamForPdf, setSelectedExamForPdf] = useState<Exam | null>(null);
  
  // Get unique years from exams - ensure they're unique and use a stable key
  const uniqueYears = React.useMemo(() => {
    return [...new Set(exams.map(exam => exam.year))].sort((a, b) => b - a);
  }, [exams]);

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  // Get form name by ID
  const getFormName = (formId: string) => {
    const form = examForms.find(f => f.id === formId);
    return form ? form.name : '';
  };

  // Get season name
  const getSeasonName = (season?: 'winter' | 'summer') => {
    if (!season) return '';
    return season === 'winter' ? 'חורף' : 'קיץ';
  };

  useEffect(() => {
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
        console.error('Error fetching exams:', err);
        setError('אירעה שגיאה בטעינת הבגרויות');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter exams based on selected filters and search query
  const filteredExams = React.useMemo(() => {
    return exams.filter(exam => {
      const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;
      const matchesYear = selectedYear === 'all' || exam.year.toString() === selectedYear;
      const matchesForm = selectedForm === 'all' || exam.form === selectedForm;
      const matchesSeason = selectedSeason === 'all' || exam.season === selectedSeason;
      
      // Search in subject name and form name
      const subjectName = getSubjectName(exam.subject).toLowerCase();
      const formName = exam.form ? getFormName(exam.form).toLowerCase() : '';
      const matchesSearch = searchQuery === '' || 
        subjectName.includes(searchQuery.toLowerCase()) ||
        formName.includes(searchQuery.toLowerCase()) ||
        exam.year.toString().includes(searchQuery);
      
      return matchesSubject && matchesYear && matchesForm && matchesSeason && matchesSearch;
    });
  }, [exams, selectedSubject, selectedYear, selectedForm, selectedSeason, searchQuery]);
  
  // Group exams by subject
  const groupedBySubject = React.useMemo(() => {
    const grouped: Record<string, Exam[]> = {};
    
    filteredExams.forEach(exam => {
      if (!grouped[exam.subject]) {
        grouped[exam.subject] = [];
      }
      
      grouped[exam.subject].push(exam);
    });
    
    return grouped;
  }, [filteredExams]);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedSubject('all');
    setSelectedYear('all');
    setSelectedForm('all');
    setSelectedSeason('all');
    setSearchQuery('');
  };

  const toggleExamExpand = async (examId: string) => {
    // If already expanded, collapse it
    if (expandedExamId === examId) {
      setExpandedExamId(null);
      return;
    }
    
    // Otherwise, expand it
    setExpandedExamId(examId);
    
    // Fetch question solutions if not already fetched
    if (!examQuestionSolutions[examId]) {
      try {
        const { data, error } = getQuestionSolutions(examId);
        
        if (error) throw error;
        
        setExamQuestionSolutions(prev => ({
          ...prev,
          [examId]: data
        }));
      } catch (err) {
        console.error('Error fetching question solutions:', err);
      }
    }
  };

  const openForum = (examId: string) => {
    setActiveForumExamId(examId);
  };

  const closeForum = () => {
    setActiveForumExamId(null);
  };
  
  const openVideoPlayer = (videoUrl: string, title: string) => {
    setActiveVideoUrl(videoUrl);
    setActiveVideoTitle(title);
  };
  
  const closeVideoPlayer = () => {
    setActiveVideoUrl(null);
    setActiveVideoTitle('');
  };
  
  const openPdfViewer = (exam: Exam, type: 'exam' | 'solution') => {
    const url = type === 'exam' ? exam.exam_file_url : exam.solution_file_url;
    const title = type === 'exam' 
      ? `בחינת בגרות - ${getSubjectName(exam.subject)} ${exam.year}`
      : `פתרון בגרות - ${getSubjectName(exam.subject)} ${exam.year}`;
    
    setSelectedExamForPdf(exam);
    
    // If it's a local file, get the data URL
    if (url.startsWith('local://')) {
      const fileData = getFileData(url);
      if (fileData) {
        setActivePdfUrl(fileData);
        setActivePdfTitle(title);
        setActivePdfType(type);
      } else {
        alert('הקובץ לא נמצא');
      }
    } else {
      // External URL
      setActivePdfUrl(url);
      setActivePdfTitle(title);
      setActivePdfType(type);
    }
  };
  
  const closePdfViewer = () => {
    setActivePdfUrl(null);
    setActivePdfTitle('');
    setActivePdfType(null);
    setSelectedExamForPdf(null);
  };

  // Find active exam for forum
  const activeExam = activeForumExamId 
    ? exams.find(exam => exam.id === activeForumExamId) 
    : null;

  // Handle file download for local files
  const handleFileDownload = (url: string, fileName: string) => {
    if (url.startsWith('local://')) {
      const fileData = getFileData(url);
      if (fileData) {
        // Create a download link
        const link = document.createElement('a');
        link.href = fileData;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('הקובץ לא נמצא');
      }
    } else {
      // External URL - open in new tab
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex justify-center items-center relative">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex justify-center items-center relative">
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
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md relative z-10">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 relative">
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
        <h1 className="text-3xl font-bold text-primary-800 mb-8">בגרויות</h1>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 animate-fadeIn hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-lg font-medium text-primary-900 mb-2 md:mb-0">חיפוש וסינון</h2>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">כל המקצועות</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Form filter - allow selection regardless of subject */}
            <div>
              <label htmlFor="form" className="block text-sm font-medium text-gray-700 mb-1">
                שאלון
              </label>
              <select
                id="form"
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">כל השאלונים</option>
                {examForms.map((form) => (
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">כל המועדים</option>
                <option value="winter">חורף</option>
                <option value="summer">קיץ</option>
              </select>
            </div>
          </div>
          
          {/* Filter Status */}
          {(selectedSubject !== 'all' || selectedYear !== 'all' || selectedForm !== 'all' || selectedSeason !== 'all' || searchQuery) && (
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
                
                {searchQuery && (
                  <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs flex items-center">
                    <span>חיפוש: {searchQuery}</span>
                    <button 
                      onClick={() => setSearchQuery('')}
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
        
        {/* Exams List */}
        {Object.keys(groupedBySubject).length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">לא נמצאו בגרויות התואמות את הסינון שבחרת</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {Object.keys(groupedBySubject).map(subjectId => {
              const subjectExams = groupedBySubject[subjectId];
              
              // Group by form
              const formGroups: Record<string, Exam[]> = {};
              subjectExams.forEach(exam => {
                const formKey = exam.form || 'no-form';
                if (!formGroups[formKey]) {
                  formGroups[formKey] = [];
                }
                formGroups[formKey].push(exam);
              });
              
              return (
                <div key={subjectId} className="mb-8">
                  <h2 className="text-2xl font-bold text-primary-800 mb-4">{getSubjectName(subjectId)}</h2>
                  
                  {Object.keys(formGroups).map(formKey => {
                    const formExams = formGroups[formKey];
                    
                    // Group by year
                    const yearGroups: Record<number, Exam[]> = {};
                    formExams.forEach(exam => {
                      if (!yearGroups[exam.year]) {
                        yearGroups[exam.year] = [];
                      }
                      yearGroups[exam.year].push(exam);
                    });
                    
                    return (
                      <div key={`${subjectId}-${formKey}`} className="mb-6">
                        {formKey !== 'no-form' && (
                          <h3 className="text-xl font-semibold text-primary-700 mb-3">
                            שאלון {getFormName(formKey)}
                          </h3>
                        )}
                        
                        <div className="space-y-4">
                          {Object.keys(yearGroups)
                            .map(Number)
                            .sort((a, b) => b - a)
                            .map(year => {
                              const yearExams = yearGroups[year];
                              
                              // Group by season
                              const seasonGroups: Record<string, Exam[]> = {};
                              yearExams.forEach(exam => {
                                const seasonKey = exam.season || 'no-season';
                                if (!seasonGroups[seasonKey]) {
                                  seasonGroups[seasonKey] = [];
                                }
                                seasonGroups[seasonKey].push(exam);
                              });
                              
                              return (
                                <div key={`${subjectId}-${formKey}-${year}`} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
                                  <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
                                    <h4 className="text-lg font-medium text-primary-900">
                                      שנת {year}
                                    </h4>
                                  </div>
                                  
                                  <div className="divide-y divide-gray-200">
                                    {Object.keys(seasonGroups).map(seasonKey => {
                                      const seasonExams = seasonGroups[seasonKey];
                                      const seasonName = seasonKey !== 'no-season' ? getSeasonName(seasonKey as 'winter' | 'summer') : '';
                                      
                                      return (
                                        <div key={`${subjectId}-${formKey}-${year}-${seasonKey}`} className="px-4 py-4 sm:px-6">
                                          {seasonKey !== 'no-season' && (
                                            <h5 className="text-md font-medium text-gray-700 mb-3">
                                              מועד {seasonName}
                                            </h5>
                                          )}
                                          
                                          <div className="space-y-4">
                                            {seasonExams.map(exam => (
                                              <div key={exam.id} className="border border-gray-200 rounded-md overflow-hidden">
                                                {/* Exam Header - Always visible */}
                                                <div 
                                                  className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                                  onClick={() => toggleExamExpand(exam.id)}
                                                >
                                                  <div className="flex items-center">
                                                    <div className="mr-2">
                                                      {expandedExamId === exam.id ? (
                                                        <ChevronUp className="h-5 w-5 text-primary-600" />
                                                      ) : (
                                                        <ChevronDown className="h-5 w-5 text-primary-600" />
                                                      )}
                                                    </div>
                                                    <h6 className="text-md font-medium text-gray-900">
                                                      בגרות {getSubjectName(exam.subject)}
                                                      {exam.form ? ` - שאלון ${getFormName(exam.form)}` : ''}
                                                      {' - '}{exam.year}
                                                      {exam.season ? ` (${getSeasonName(exam.season)})` : ''}
                                                    </h6>
                                                  </div>
                                                  
                                                  {/* Quick actions that are always visible */}
                                                  <div className="flex space-x-2 rtl:space-x-reverse">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        openForum(exam.id);
                                                      }}
                                                      className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                                                    >
                                                      <MessageSquare className="h-4 w-4 mr-1" />
                                                      פורום דיון
                                                    </button>
                                                  </div>
                                                </div>
                                                
                                                {/* Expanded Content */}
                                                {expandedExamId === exam.id && (
                                                  <div className="p-4 border-t border-gray-200 animate-fadeIn">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      {/* Exam Files Section */}
                                                      <div className="space-y-4">
                                                        <h6 className="font-medium text-gray-900">קבצי בחינה ופתרון</h6>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                          {/* Exam File */}
                                                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                                            <h6 className="text-sm font-medium text-gray-700 mb-2">קובץ בחינה</h6>
                                                            <div className="flex flex-col space-y-2">
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  openPdfViewer(exam, 'exam');
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                              >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                צפה בבחינה
                                                              </button>
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  handleFileDownload(
                                                                    exam.exam_file_url, 
                                                                    `בגרות_${getSubjectName(exam.subject)}_${exam.year}.pdf`
                                                                  );
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                              >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                הורד בחינה
                                                              </button>
                                                            </div>
                                                          </div>
                                                          
                                                          {/* Solution File */}
                                                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                                            <h6 className="text-sm font-medium text-gray-700 mb-2">קובץ פתרון</h6>
                                                            <div className="flex flex-col space-y-2">
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  openPdfViewer(exam, 'solution');
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                              >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                צפה בפתרון
                                                              </button>
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  handleFileDownload(
                                                                    exam.solution_file_url, 
                                                                    `פתרון_${getSubjectName(exam.subject)}_${exam.year}.pdf`
                                                                  );
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                              >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                הורד פתרון
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      
                                                      {/* Question Solutions Section */}
                                                      <div>
                                                        <h6 className="font-medium text-gray-900 mb-3">סרטוני פתרונות לשאלות</h6>
                                                        
                                                        {examQuestionSolutions[exam.id]?.length > 0 ? (
                                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {examQuestionSolutions[exam.id]
                                                              .sort((a, b) => a.question_number - b.question_number)
                                                              .map(solution => (
                                                                <div 
                                                                  key={solution.id}
                                                                  className="bg-gray-50 p-2 rounded-md border border-gray-200"
                                                                >
                                                                  <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium">שאלה {solution.question_number}</span>
                                                                    {solution.solution_video_url && (
                                                                      <button
                                                                        onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          openVideoPlayer(
                                                                            solution.solution_video_url!,
                                                                            `פתרון לשאלה ${solution.question_number} - ${getSubjectName(exam.subject)} ${exam.year}`
                                                                          );
                                                                        }}
                                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                                                                      >
                                                                        <Video className="h-3 w-3 mr-1" />
                                                                        צפה בפתרון
                                                                      </button>
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              ))
                                                            }
                                                          </div>
                                                        ) : (
                                                          <div className="text-center py-3 bg-gray-50 rounded-md border border-gray-200">
                                                            <p className="text-sm text-gray-500">אין סרטוני פתרונות לשאלות בבגרות זו</p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
       {/* Forum Modal */}
      {activeForumExamId && activeExam && (
        <ExamForum 
          examId={activeExam.id} 
          examName={`${getSubjectName(activeExam.subject)}${activeExam.form ? ` - שאלון ${getFormName(activeExam.form)}` : ''} - ${activeExam.year}${activeExam.season ? ` (${getSeasonName(activeExam.season)})` : ''}`}
          onClose={closeForum}
        />
      )}
      
      {/* Video Player Modal */}
      {activeVideoUrl && (
        <VideoPlayerModal
          videoUrl={activeVideoUrl}
          title={activeVideoTitle}
          onClose={closeVideoPlayer}
        />
      )}
      
      {/* PDF Viewer Modal */}
      {activePdfUrl && activePdfType && (
        activePdfUrl.startsWith('data:application/pdf') ? (
          <PDFViewer
            pdfUrl={activePdfUrl}
            title={activePdfTitle}
            onClose={closePdfViewer}
            onDownload={() => {
              if (activePdfType === 'exam' && selectedExamForPdf) {
                handleFileDownload(
                  selectedExamForPdf.exam_file_url,
                  `בגרות_${getSubjectName(selectedExamForPdf.subject)}_${selectedExamForPdf.year}.pdf`
                );
              } else if (activePdfType === 'solution' && selectedExamForPdf) {
                handleFileDownload(
                  selectedExamForPdf.solution_file_url,
                  `פתרון_${getSubjectName(selectedExamForPdf.subject)}_${selectedExamForPdf.year}.pdf`
                );
              }
            }}
          />
        ) : (
          <PDFViewerFallback
            pdfUrl={activePdfUrl}
            title={activePdfTitle}
            onClose={closePdfViewer}
            onDownload={() => {
              if (activePdfType === 'exam' && selectedExamForPdf) {
                handleFileDownload(
                  selectedExamForPdf.exam_file_url,
                  `בגרות_${getSubjectName(selectedExamForPdf.subject)}_${selectedExamForPdf.year}.pdf`
                );
              } else if (activePdfType === 'solution' && selectedExamForPdf) {
                handleFileDownload(
                  selectedExamForPdf.solution_file_url,
                  `פתרון_${getSubjectName(selectedExamForPdf.subject)}_${selectedExamForPdf.year}.pdf`
                );
              }
            }}
          />
        )
      )}
    </div>
  );
};

export default Exams;