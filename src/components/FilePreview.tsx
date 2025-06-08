import React from 'react';
import { FileText, Image, File } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, className = "h-24" }) => {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  
  if (isImage) {
    return (
      <div className={`relative ${className} rounded border border-gray-300 overflow-hidden`}>
        <img 
          src={URL.createObjectURL(file)} 
          alt={file.name}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }
  
  if (isPdf) {
    return (
      <div className={`flex items-center justify-center ${className} bg-gray-100 rounded border border-gray-300`}>
        <div className="text-center">
          <FileText className="h-10 w-10 mx-auto text-red-500" />
          <p className="text-xs mt-1 text-gray-700 truncate max-w-[120px] mx-auto">{file.name}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className} bg-gray-100 rounded border border-gray-300`}>
      <div className="text-center">
        <File className="h-10 w-10 mx-auto text-blue-500" />
        <p className="text-xs mt-1 text-gray-700 truncate max-w-[120px] mx-auto">{file.name}</p>
      </div>
    </div>
  );
};

export default FilePreview;