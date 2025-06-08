import React, { useState, useEffect } from 'react';
import { Exam, QuestionSolution } from '../types';
import { ArrowLeft, Download, FileText, Video, MessageSquare, Edit } from 'lucide-react';
import { getQuestionSolutions } from '../lib/db';
import { getFileData } from '../lib/storage';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';

interface ExamDetailPageProps {
  exam: Exam;
  onClose: () => void;
  onOpenForum: (examId: string) => void;
  onOpenPdfViewer?: (url: string, title: string, type: 'exam' | 'solution') => void;
  getSubjectName: (subjectId: string) => string;
  getFormName: (formId: string) => string;
  getSeasonName: (season?: 'winter' | 'summer') => string;
}

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({
  exam,
  onClose,
  onOpenForum,
  onOpenPdfViewer,
  getSubjectName,
  getFormName,
  getSeasonName
}) => {
  const { user } = useAuth();
  const [questionSolutions, setQuestionSolutions] = useState<QuestionSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>('');
  const [activePdfType, setActivePdfType] = useState<'exam' | 'solution' | null>(null);

  useEffect(() => {
    const fetchQuestionSolutions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = getQuestionSolutions(exam.id);
        
        if (error) throw error;
        setQuestionSolutions(data);
      } catch (err) {
        console.error('Error fetching question solutions:', err);
        setError('אירעה שגיאה בטעינת פתרונות השאלות');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionSolutions();
  }, [exam.id]);

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

  const openVideoPlayer = (videoUrl: string, title: string) => {
    setActiveVideoUrl(videoUrl);
    setActiveVideoTitle(title);
  };
  
  const closeVideoPlayer = () => {
    setActiveVideoUrl(null);
    setActiveVideoTitle('');
  };
  
  const openPdfViewer = (url: string, title: string, type: 'exam' | 'solution') => {
    // If external function is provided, use it
    if (onOpenPdfViewer) {
      onOpenPdfViewer(url, title, type);
      return;
    }
    
    // Otherwise handle locally
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
  };

  // Handle forum button click - prevent event propagation
  const handleForumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenForum(exam.id);
  };

  const examTitle = `בגרות ${getSubjectName(exam.subject)}${exam.form ? ` - שאלון ${getFormName(exam.form)}` : ''} - ${exam.year}${exam.season ? ` (${getSeasonName(exam.season)})` : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{examTitle}</h1>
          <div className="flex space-x-2 rtl:space-x-reverse">
            {user?.role === 'admin' && (
              <Link
                to={`/admin/exams/edit/${exam.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                ערוך בגרות
              </Link>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              חזרה לרשימת הבגרויות
            </button>
          </div>
        </div>
        
        {/* Exam Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">קבצים וחומרי עזר</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">קובץ בחינה</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openPdfViewer(
                    exam.exam_file_url, 
                    `בחינת בגרות - ${getSubjectName(exam.subject)} ${exam.year}`,
                    'exam'
                  )}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full justify-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  צפה בבחינה
                </button>
                <button
                  onClick={() => handleFileDownload(
                    exam.exam_file_url, 
                    `בגרות_${getSubjectName(exam.subject)}_${exam.year}.pdf`
                  )}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  הורד בחינה
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">קובץ פתרון</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openPdfViewer(
                    exam.solution_file_url, 
                    `פתרון בגרות - ${getSubjectName(exam.subject)} ${exam.year}`,
                    'solution'
                  )}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full justify-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  צפה בפתרון
                </button>
                <button
                  onClick={() => handleFileDownload(
                    exam.solution_file_url, 
                    `פתרון_${getSubjectName(exam.subject)}_${exam.year}.pdf`
                  )}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  הורד פתרון
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">פורום דיון</h3>
              <button
                onClick={handleForumClick}
                className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors w-full justify-center"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                פורום דיון
              </button>
              <p className="mt-2 text-sm text-gray-500">
                שאל שאלות, קבל עזרה ושתף פתרונות עם תלמידים אחרים
              </p>
            </div>
          </div>
        </div>
        
        {/* Question Solutions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">סרטוני פתרונות לשאלות</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען פתרונות...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : questionSolutions.length === 0  ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">אין סרטוני פתרונות לשאלות בבגרות זו</p>
              <p className="text-gray-500 mt-2">ניתן לצפות בפתרון המלא באמצעות הקובץ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questionSolutions.map((solution) => (
                <div key={solution.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">שאלה {solution.question_number}</h3>
                  
                  {solution.solution_video_url && (
                    <button
                      onClick={() => openVideoPlayer(
                        solution.solution_video_url!,
                        `שאלה ${solution.question_number}`
                      )}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors w-full justify-center"
                    >
                      <Video className="h-5 w-5 mr-2" />
                      צפה בפתרון לשאלה
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
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
        <PDFViewer
          pdfUrl={activePdfUrl}
          title={activePdfTitle}
          onClose={closePdfViewer}
          onDownload={() => {
            if (activePdfType === 'exam') {
              handleFileDownload(
                exam.exam_file_url, 
                `בגרות_${getSubjectName(exam.subject)}_${exam.year}.pdf`
              );
            } else if (activePdfType === 'solution') {
              handleFileDownload(
                exam.solution_file_url, 
                `פתרון_${getSubjectName(exam.subject)}_${exam.year}.pdf`
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default ExamDetailPage;