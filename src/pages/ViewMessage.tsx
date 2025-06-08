import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { getMessage, markMessageAsRead, deleteMessage, sendMessage } from '../lib/db';
import { getFileData } from '../lib/storage';
import { format } from 'date-fns';
import { Mail, ArrowLeft, Trash2, Reply, Download, AlertCircle, Send, X, CheckCircle, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import DeleteConfirmation from '../components/DeleteConfirmation';

const ViewMessage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  useEffect(() => {
    if (id && user) {
      fetchMessage();
    }
  }, [id, user]);
  
  const fetchMessage = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = getMessage(id);
      
      if (error) throw error;
      
      if (data) {
        setMessage(data);
        
        // Mark as read if the user is the recipient and the message is unread
        if (user && data.recipient_id === user.id && !data.is_read) {
          const { success, error: markError } = markMessageAsRead(id);
          if (markError) throw markError;
        }
      } else {
        setError('ההודעה לא נמצאה');
      }
    } catch (err) {
      console.error('Error fetching message:', err);
      setError('אירעה שגיאה בטעינת ההודעה');
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { success, error } = deleteMessage(id);
      
      if (error) throw error;
      
      if (success) {
        navigate('/inbox');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('אירעה שגיאה במחיקת ההודעה');
      setLoading(false);
    }
  };
  
  const toggleReplyForm = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      setReplyContent('');
      setReplySuccess(false);
    }
  };
  
  const handleSendReply = async () => {
    if (!message || !user || !replyContent.trim()) return;
    
    try {
      setSendingReply(true);
      
      // Determine recipient (the other person in the conversation)
      const recipientId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      const recipientName = message.sender_id === user.id ? message.recipient_name : message.sender_name;
      
      // Create reply subject with Re: prefix if not already there
      let replySubject = message.subject;
      if (!replySubject.startsWith('Re:')) {
        replySubject = `Re: ${replySubject}`;
      }
      
      // Add original message quote to the reply content
      const formattedDate = format(new Date(message.created_at), 'dd/MM/yyyy HH:mm');
      const replyWithQuote = `${replyContent}\n\n-------- הודעה מקורית --------\nמאת: ${message.sender_name}\nתאריך: ${formattedDate}\nנושא: ${message.subject}\n\n${message.content}`;
      
      // Send the reply
      const { data, error } = sendMessage(
        user.id,
        recipientId,
        replySubject,
        replyWithQuote
      );
      
      if (error) throw error;
      
      if (data) {
        setReplySuccess(true);
        setReplyContent('');
        setTimeout(() => {
          setIsReplying(false);
          setReplySuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('אירעה שגיאה בשליחת התגובה');
    } finally {
      setSendingReply(false);
    }
  };
  
  const handleDownloadAttachment = () => {
    if (!message || !message.attachment_url) return;
    
    const fileData = getFileData(message.attachment_url);
    if (fileData) {
      // Create a download link
      const link = document.createElement('a');
      link.href = fileData;
      link.download = message.attachment_name || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('הקובץ לא נמצא');
    }
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הודעה...</p>
        </div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">שגיאה</h2>
          <p className="text-gray-600 text-center mb-6">{error || 'ההודעה לא נמצאה'}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/inbox')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              חזרה לתיבת הדואר
            </button>
          </div>
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
        <FileText className="absolute h-24 w-24 text-primary-600 bottom-[10%] left-[20%] transform rotate-12" />
        <Compass className="absolute h-32 w-32 text-blue-500 bottom-[20%] right-[25%] transform -rotate-12" />
        <Clock className="absolute h-28 w-28 text-indigo-500 bottom-[15%] left-[40%] transform rotate-6" />
      </div>

      {/* Main content - add relative positioning and z-index */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Mail className="h-8 w-8 mr-3 text-primary-600" />
            צפייה בהודעה
          </h1>
          <button
            onClick={() => navigate('/inbox')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזרה לתיבת הדואר
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Message Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-primary-50">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={toggleReplyForm}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  title="השב"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  title="מחק"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">מאת:</span> {message.sender_name}
                </div>
                <div>
                  <span className="font-medium">תאריך:</span> {formatDateTime(message.created_at)}
                </div>
              </div>
              <div className="mt-1">
                <span className="font-medium">אל:</span> {message.recipient_name}
              </div>
            </div>
          </div>
          
          {/* Message Content */}
          <div className="px-6 py-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {/* Attachment */}
            {message.attachment_url && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">קבצים מצורפים:</h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{message.attachment_name}</span>
                  </div>
                  <button
                    onClick={handleDownloadAttachment}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    הורד
                  </button>
                </div>
              </div>
            )}
            
            {/* Reply Form */}
            {isReplying && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">השב להודעה</h3>
                  <button
                    onClick={toggleReplyForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {replySuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 animate-fadeIn flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>התגובה נשלחה בהצלחה!</span>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="כתוב את תגובתך כאן..."
                      rows={6}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
                    />
                    
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleSendReply}
                        disabled={sendingReply || !replyContent.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {sendingReply ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            שולח...
                          </span>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            שלח תגובה
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="מחיקת הודעה"
          message="האם אתה בטוח שברצונך למחוק הודעה זו?"
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ViewMessage;