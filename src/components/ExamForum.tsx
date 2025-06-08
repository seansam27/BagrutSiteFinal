import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { getComments, addComment, deleteComment } from '../lib/db';
import { storeFile, deleteFile, getFileData } from '../lib/storage';
import { format } from 'date-fns';
import { MessageSquare, Send, Image, X, Trash2, AlertCircle, ZoomIn } from 'lucide-react';
import FileUpload from './FileUpload';
import ImageViewer from './ImageViewer';
import DeleteConfirmation from './DeleteConfirmation';

interface ExamForumProps {
  examId: string;
  examName: string;
  onClose: () => void;
}

const ExamForum: React.FC<ExamForumProps> = ({ examId, examName, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<{id: string, imageUrl?: string} | null>(null);

  useEffect(() => {
    fetchComments();
  }, [examId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = getComments(examId);
      
      if (error) throw error;
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('אירעה שגיאה בטעינת התגובות');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('עליך להתחבר כדי להוסיף תגובה');
      return;
    }
    
    if (!newComment.trim() && !selectedImage) {
      setError('לא ניתן לשלוח תגובה ריקה');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload image if selected
      let imageUrl: string | undefined;
      if (selectedImage) {
        imageUrl = await storeFile(selectedImage);
      }
      
      const { data, error } = addComment(
        examId,
        user.id,
        newComment.trim(),
        imageUrl
      );
      
      if (error) throw error;
      
      if (data) {
        setComments([...comments, data]);
        setNewComment('');
        setSelectedImage(null);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('אירעה שגיאה בהוספת התגובה');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteComment = (commentId: string, imageUrl?: string) => {
    setCommentToDelete({ id: commentId, imageUrl });
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = deleteComment(commentToDelete.id);
      
      if (error) throw error;
      
      if (success) {
        // Delete the image if it exists
        if (commentToDelete.imageUrl && commentToDelete.imageUrl.startsWith('local://')) {
          deleteFile(commentToDelete.imageUrl);
        }
        
        setComments(comments.filter(comment => comment.id !== commentToDelete.id));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('אירעה שגיאה במחיקת התגובה');
    } finally {
      setLoading(false);
      setCommentToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const openImageViewer = (imageUrl: string) => {
    setViewingImage(imageUrl);
  };

  const closeImageViewer = () => {
    setViewingImage(null);
  };

  const getImageSrc = (imageUrl: string) => {
    if (imageUrl.startsWith('local://')) {
      return getFileData(imageUrl) || '';
    }
    return imageUrl;
  };

  // Handle modal click to prevent event propagation
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle escape key to close the forum
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-zoomIn" onClick={handleModalClick}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">פורום דיון: {examName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {loading && comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">טוען תגובות...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>אין תגובות עדיין. היה הראשון להגיב!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div 
                  key={comment.id} 
                  className="bg-gray-50 rounded-lg p-4 animate-slideUp" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{comment.user_name}</span>
                        {comment.user_role === 'admin' && (
                          <span className="mr-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full">
                            מנהל
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    
                    {user && (user.id === comment.user_id || user.role === 'admin') && (
                      <button
                        onClick={() => confirmDeleteComment(comment.id, comment.image_url)}
                        className="text-red-500 hover:text-red-700"
                        title="מחק תגובה"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                  
                  {comment.image_url && (
                    <div className="mt-3 relative group">
                      <img 
                        src={getImageSrc(comment.image_url)} 
                        alt="תמונה מצורפת" 
                        className="max-w-full max-h-64 rounded-lg border border-gray-200 cursor-pointer"
                        onClick={() => openImageViewer(comment.image_url!)}
                      />
                      <button
                        onClick={() => openImageViewer(comment.image_url!)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="הגדל תמונה"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4">
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="כתוב תגובה..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
                
                <div className="mt-3">
                  <FileUpload
                    onFileSelect={(file) => setSelectedImage(file)}
                    onClear={() => setSelectedImage(null)}
                    accept="image/*"
                    label="צרף תמונה"
                    selectedFile={selectedImage}
                  />
                </div>
                
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={loading || (!newComment.trim() && !selectedImage)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              </div>
            </form>
          ) : (
            <div className="text-center py-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600">עליך <a href="/login" className="text-primary-600 hover:underline">להתחבר</a> כדי להשתתף בדיון</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Viewer */}
      {viewingImage && (
        <ImageViewer 
          src={getImageSrc(viewingImage)} 
          onClose={closeImageViewer} 
        />
      )}

      {/* Delete Confirmation */}
      {commentToDelete && (
        <DeleteConfirmation
          title="מחיקת תגובה"
          message="האם אתה בטוח שברצונך למחוק את התגובה?"
          confirmText="מחק"
          cancelText="ביטול"
          onConfirm={handleDeleteComment}
          onCancel={() => setCommentToDelete(null)}
        />
      )}
    </div>
  );
};

export default ExamForum;