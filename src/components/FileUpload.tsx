import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  accept?: string;
  label: string;
  selectedFile?: File | null;
  preview?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onClear,
  accept = "image/*",
  label,
  selectedFile,
  preview
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onFileSelect(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check if the file type matches the accept attribute
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        // Check if the file type is accepted
        const isAccepted = acceptTypes.some(type => {
          if (type === '*/*') return true;
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return fileType.startsWith(`${category}/`);
          }
          return type === fileType;
        });
        
        if (!isAccepted) {
          alert(`סוג הקובץ אינו נתמך. אנא העלה קובץ מסוג ${accept}`);
          return;
        }
      }
      
      onFileSelect(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {(selectedFile || previewUrl) && (
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
      
      {previewUrl && (
        <div className="mb-2 relative inline-block">
          <img 
            src={previewUrl} 
            alt="תצוגה מקדימה" 
            className="h-24 rounded border border-gray-300 object-contain"
          />
        </div>
      )}
      
      {selectedFile && !previewUrl && (
        <div className="mb-2 p-2 bg-gray-100 rounded border border-gray-300 text-sm">
          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
        </div>
      )}
      
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
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
            >
              <span>העלה קובץ</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <p className="pr-1">או גרור לכאן</p>
          </div>
          <p className="text-xs text-gray-500">
            {accept === "image/*" ? "PNG, JPG, GIF עד 10MB" : "PDF עד 10MB"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;