import React, { useState, useRef } from 'react';
import { Upload, X, Youtube, Video, Link as LinkIcon } from 'lucide-react';
import { storeFile } from '../lib/storage';

interface VideoUploadProps {
  onVideoSelect: (url: string) => void;
  onClear: () => void;
  initialUrl?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoSelect,
  onClear,
  initialUrl
}) => {
  const [uploadType, setUploadType] = useState<'file' | 'youtube'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState(initialUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Check if the initial URL is a YouTube URL
  React.useEffect(() => {
    if (initialUrl) {
      if (initialUrl.includes('youtube.com') || initialUrl.includes('youtu.be')) {
        setUploadType('youtube');
        setYoutubeUrl(initialUrl);
      } else {
        setUploadType('file');
        // We can't set the file from a URL, but we can indicate that there's a file
      }
    }
  }, [initialUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        setError('יש להעלות קובץ וידאו בלבד');
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('גודל הקובץ חייב להיות קטן מ-100MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Upload the file
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);
      
      // Upload the file
      const fileUrl = await storeFile(file);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Pass the URL to the parent component
      onVideoSelect(fileUrl);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('אירעה שגיאה בהעלאת הקובץ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setError(null);
  };

  const handleYoutubeUrlSubmit = () => {
    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      setError('יש להזין קישור תקין של YouTube');
      return;
    }
    
    // Pass the URL to the parent component
    onVideoSelect(youtubeUrl);
    setError(null);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    setYoutubeUrl('');
    setUploadProgress(0);
    setError(null);
    onClear();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        setError('יש להעלות קובץ וידאו בלבד');
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('גודל הקובץ חייב להיות קטן מ-100MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Upload the file
      await uploadFile(file);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          סרטון פתרון
        </label>
        {(selectedFile || youtubeUrl) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 text-sm flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            נקה
          </button>
        )}
      </div>
      
      {/* Upload Type Selection */}
      <div className="flex border border-gray-300 rounded-md overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => setUploadType('youtube')}
          className={`flex-1 py-2 px-4 flex items-center justify-center ${
            uploadType === 'youtube'
              ? 'bg-primary-100 text-primary-700 font-medium'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Youtube className="h-5 w-5 mr-2" />
          קישור YouTube
        </button>
        <button
          type="button"
          onClick={() => setUploadType('file')}
          className={`flex-1 py-2 px-4 flex items-center justify-center ${
            uploadType === 'file'
              ? 'bg-primary-100 text-primary-700 font-medium'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Video className="h-5 w-5 mr-2" />
          העלאת קובץ
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {uploadType === 'youtube' ? (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="הזן קישור YouTube"
              className="block w-full pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={handleYoutubeUrlSubmit}
            disabled={!youtubeUrl}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <Youtube className="h-4 w-4 mr-2" />
            אשר קישור
          </button>
        </div>
      ) : (
        <div 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'} border-dashed rounded-md hover:border-primary-400 transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="video-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
              >
                <span>העלה סרטון</span>
                <input
                  id="video-upload"
                  name="video-upload"
                  type="file"
                  className="sr-only"
                  accept="video/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pr-1">או גרור לכאן</p>
            </div>
            <p className="text-xs text-gray-500">
              MP4, WebM, MOV עד 100MB
            </p>
            
            {selectedFile && (
              <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-300 text-sm">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {uploadProgress < 100 ? 'מעלה...' : 'הועלה בהצלחה!'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;