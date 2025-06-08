import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  onDownload?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, onClose, onDownload }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle escape key to close the viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle modal click to prevent event propagation
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Create a blob URL for data URLs to ensure proper display in iframe
  useEffect(() => {
    let blobUrl: string | null = null;
    
    if (pdfUrl.startsWith('data:')) {
      // Convert data URL to Blob
      const byteString = atob(pdfUrl.split(',')[1]);
      const mimeString = pdfUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      blobUrl = URL.createObjectURL(blob);
      
      // Update iframe src
      if (iframeRef.current) {
        iframeRef.current.src = blobUrl;
      }
    }
    
    return () => {
      // Clean up blob URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-zoomIn" onClick={handleModalClick}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
          <h2 className="text-xl font-semibold text-gray-900 truncate">{title}</h2>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button 
              onClick={zoomIn}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="הגדל"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button 
              onClick={zoomOut}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="הקטן"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button 
              onClick={rotate}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="סובב"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            {onDownload && (
              <button 
                onClick={onDownload}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                title="הורד"
              >
                <Download className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden bg-gray-800 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center overflow-auto">
            <div 
              style={{ 
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                width: '100%',
                height: '100%'
              }}
            >
              {pdfUrl.startsWith('data:') ? (
                <iframe 
                  ref={iframeRef}
                  className="w-full h-full"
                  title={title}
                  onLoad={() => setLoading(false)}
                />
              ) : (
                <iframe 
                  src={pdfUrl}
                  className="w-full h-full"
                  title={title}
                  onLoad={() => setLoading(false)}
                />
              )}
            </div>
          </div>
          
          {/* Page navigation controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 rounded-full px-4 py-2 flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={prevPage}
              className="text-gray-700 hover:text-primary-600 disabled:text-gray-400"
              disabled={currentPage <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span className="text-sm font-medium">
              עמוד {currentPage} מתוך {totalPages || '?'}
            </span>
            <button 
              onClick={nextPage}
              className="text-gray-700 hover:text-primary-600 disabled:text-gray-400"
              disabled={currentPage >= totalPages}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;