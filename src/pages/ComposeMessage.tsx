import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { useForm } from 'react-hook-form';
import { searchUsers, sendMessage } from '../lib/db';
import { storeFile } from '../lib/storage';
import { Mail, Send, ArrowLeft, X, Search, AlertCircle, CheckCircle, User as UserIcon, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import FileUpload from '../components/FileUpload';

interface ComposeFormData {
  recipient: string;
  subject: string;
  content: string;
}

interface LocationState {
  recipient?: string;
  recipientName?: string;
  subject?: string;
  content?: string;
}

const ComposeMessage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ComposeFormData>();
  
  useEffect(() => {
    if (locationState) {
      if (locationState.recipient) {
        setValue('recipient', locationState.recipient);
        
        if (locationState.recipientName) {
          setSelectedRecipient({
            id: locationState.recipient,
            first_name: locationState.recipientName.split(' ')[0] || '',
            last_name: locationState.recipientName.split(' ')[1] || '',
            email: '',
            role: 'user',
            birth_date: '',
            created_at: ''
          });
        }
      }
      
      if (locationState.subject) {
        setValue('subject', locationState.subject);
      }
      
      if (locationState.content) {
        setValue('content', locationState.content);
      }
    }
  }, [locationState, setValue]);
  
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const { data } = searchUsers(searchQuery);
      const filteredResults = data.filter(u => u.id !== user?.id);
      setSearchResults(filteredResults);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, user]);
  
  const selectRecipient = (recipient: User) => {
    setSelectedRecipient(recipient);
    setValue('recipient', recipient.id);
    setSearchQuery('');
    setShowResults(false);
  };
  
  const removeRecipient = () => {
    setSelectedRecipient(null);
    setValue('recipient', '');
  };
  
  const onSubmit = async (data: ComposeFormData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!data.recipient) {
        setError('יש לבחור נמען');
        setLoading(false);
        return;
      }
      
      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;
      
      if (attachment) {
        attachmentUrl = await storeFile(attachment);
        attachmentName = attachment.name;
      }
      
      const { data: message, error: sendError } = sendMessage(
        user.id,
        data.recipient,
        data.subject,
        data.content,
        attachmentUrl,
        attachmentName
      );
      
      if (sendError) throw sendError;
      
      if (message) {
        setSuccess('ההודעה נשלחה בהצלחה');
        reset();
        setSelectedRecipient(null);
        setAttachment(null);
        
        setTimeout(() => {
          navigate('/inbox');
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('אירעה שגיאה בשליחת ההודעה');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 py-8 animate-fadeIn relative overflow-hidden">
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Mail className="h-8 w-8 mr-3 text-primary-600" />
            הודעה חדשה
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
          <div className="px-4 py-5 sm:px-6 bg-primary-50">
            <h2 className="text-lg font-medium text-primary-900">כתיבת הודעה חדשה</h2>
            <p className="mt-1 text-sm text-primary-700">מלא את הפרטים ולחץ על שלח</p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                  אל
                </label>
                <div className="mt-1 relative">
                  {selectedRecipient ? (
                    <div className="flex items-center bg-primary-50 border border-primary-300 rounded-md p-2">
                      <UserIcon className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-primary-700">{selectedRecipient.first_name} {selectedRecipient.last_name} ({selectedRecipient.email})</span>
                      <button
                        type="button"
                        onClick={removeRecipient}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="חפש לפי שם או אימייל..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                      {showResults && searchResults.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base overflow-auto max-h-60">
                          <ul className="divide-y divide-gray-200">
                            {searchResults.map((result) => (
                              <li
                                key={result.id}
                                onClick={() => selectRecipient(result)}
                                className="cursor-pointer hover:bg-primary-50 px-4 py-2 flex items-center"
                              >
                                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {result.first_name} {result.last_name}
                                  </p>
                                  <p className="text-sm text-gray-500">{result.email}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-4 text-center">
                          <p className="text-gray-500">לא נמצאו משתמשים</p>
                        </div>
                      )}
                    </>
                  )}
                  <input
                    type="hidden"
                    id="recipient"
                    {...register('recipient', { required: 'יש לבחור נמען' })}
                  />
                  {errors.recipient && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipient.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  נושא
                </label>
                <div className="mt-1">
                  <input
                    id="subject"
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    {...register('subject', { required: 'יש למלא נושא' })}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  תוכן ההודעה
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    rows={8}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    {...register('content', { required: 'יש למלא תוכן' })}
                  ></textarea>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <FileUpload
                  onFileSelect={(file) => setAttachment(file)}
                  onClear={() => setAttachment(null)}
                  accept="*/*"
                  label="צרף קובץ"
                  selectedFile={attachment}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? (
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
                      שלח
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessage;