import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = "תמונה", onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute top-4 right-4 flex space-x-2 rtl:space-x-reverse">
        <button 
          onClick={zoomIn}
          className="bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button 
          onClick={zoomOut}
          className="bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button 
          onClick={rotate}
          className="bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
        >
          <RotateCw className="h-5 w-5" />
        </button>
        <button 
          onClick={onClose}
          className="bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="w-full h-full flex items-center justify-center animate-zoomIn">
        <img 
          src={src} 
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ 
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        />
      </div>
    </div>
  );
};

export default ImageViewer;