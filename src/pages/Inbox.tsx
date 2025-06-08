import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { getMessages, deleteMessage, markMessageAsRead } from '../lib/db';
import { format } from 'date-fns';
import { Mail as MailIcon, Inbox as InboxIcon, Send, Trash2, Edit, Search, AlertCircle, RefreshCw, Eye, BookOpen, Calculator, GraduationCap, PenTool, Brain, Lightbulb, School, Award, FileText, Compass, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteConfirmation from '../components/DeleteConfirmation';

const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      filterMessages();
    }
  }, [activeTab, searchQuery, messages]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = getMessages(user.id);
      
      if (error) throw error;
      
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('אירעה שגיאה בטעינת ההודעות');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    if (!messages.length) return;

    let filtered = [...messages];
    
    // Filter by tab
    if (activeTab === 'inbox') {
      filtered = filtered.filter(message => message.recipient_id === user?.id);
    } else {
      filtered = filtered.filter(message => message.sender_id === user?.id);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        message =>
          message.subject.toLowerCase().includes(query) ||
          message.content.toLowerCase().includes(query) ||
          (activeTab === 'inbox' 
            ? message.sender_name.toLowerCase().includes(query)
            : message.recipient_name.toLowerCase().includes(query))
      );
    }
    
    setFilteredMessages(filtered);
  };

  const handleViewMessage = (messageId: string) => {
    // Mark as read if it's an incoming message
    const message = messages.find(m => m.id === messageId);
    if (message && message.recipient_id === user?.id && !message.is_read) {
      markMessageAsRead(messageId);
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === messageId ? { ...m, is_read: true } : m
        )
      );
    }
    
    // Navigate to message view
    navigate(`/inbox/view/${messageId}`);
  };

  const confirmDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSelected = () => {
    setMessageToDelete(null);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      setLoading(true);
      
      if (messageToDelete) {
        // Delete single message
        const { success, error } = deleteMessage(messageToDelete);
        if (error) throw error;
        
        if (success) {
          setMessages(prevMessages => 
            prevMessages.filter(message => message.id !== messageToDelete)
          );
        }
      } else if (selectedMessages.length > 0) {
        // Delete multiple messages
        for (const messageId of selectedMessages) {
          const { success, error } = deleteMessage(messageId);
          if (error) throw error;
        }
        
        // Update local state
        setMessages(prevMessages => 
          prevMessages.filter(message => !selectedMessages.includes(message.id))
        );
        
        // Clear selection
        setSelectedMessages([]);
      }
    } catch (err) {
      console.error('Error deleting messages:', err);
      setError('אירעה שגיאה במחיקת ההודעות');
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setMessageToDelete(null);
    }
  };

  const toggleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredMessages.length) {
      // Deselect all
      setSelectedMessages([]);
    } else {
      // Select all
      setSelectedMessages(filteredMessages.map(message => message.id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If it's today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm');
    }
    
    // If it's this year, show day and month
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'dd/MM');
    }
    
    // Otherwise show full date
    return format(date, 'dd/MM/yyyy');
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">תיבת הודעות</h1>
          <Link
            to="/inbox/compose"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            הודעה חדשה
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'inbox'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <InboxIcon className="h-5 w-5 mr-2" />
                <span>נכנס</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'sent'
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" />
                <span>נשלח</span>
              </div>
            </button>
          </div>
          
          {/* Toolbar */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={selectAllMessages}
                  className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-200"
                >
                  {selectedMessages.length === filteredMessages.length && filteredMessages.length > 0
                    ? 'בטל בחירה'
                    : 'בחר הכל'}
                </button>
                {selectedMessages.length > 0 && (
                  <button
                    onClick={confirmDeleteSelected}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    מחק
                  </button>
                )}
                <button
                  onClick={fetchMessages}
                  className="text-primary-600 hover:text-primary-800 px-2 py-1 rounded hover:bg-primary-100 flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  רענן
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="חפש בהודעות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
          
          {/* Messages List */}
          <div className="divide-y divide-gray-200">
            {loading && messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">טוען הודעות...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center text-red-500 mb-2">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchMessages}
                  className="mt-4 text-primary-600 hover:text-primary-800"
                >
                  נסה שוב
                </button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MailIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {activeTab === 'inbox'
                    ? 'אין הודעות בתיבת הדואר הנכנס'
                    : 'אין הודעות בתיבת הדואר היוצא'}
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    activeTab === 'inbox' && !message.is_read ? 'bg-blue-50' : ''
                  } ${selectedMessages.includes(message.id) ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => toggleSelectMessage(message.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div 
                        className="min-w-0 flex-1 px-4 cursor-pointer"
                        onClick={() => handleViewMessage(message.id)}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            activeTab === 'inbox' && !message.is_read ? 'text-gray-900 font-bold' : 'text-gray-700'
                          } truncate`}>
                            {activeTab === 'inbox' ? message.sender_name : message.recipient_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p className={`text-sm ${
                            activeTab === 'inbox' && !message.is_read ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          } truncate`}>
                            {message.subject}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {message.content.substring(0, 100)}
                            {message.content.length > 100 ? '...' : ''}
                          </p>
                        </div>
                        {message.attachment_url && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <svg className="mr-1.5 h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              קובץ מצורף
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleViewMessage(message.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="מחיקת הודעות"
          message={messageToDelete 
            ? "האם אתה בטוח שברצונך למחוק הודעה זו?" 
            : `האם אתה בטוח שברצונך למחוק ${selectedMessages.length} הודעות?`}
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setMessageToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default InboxPage;