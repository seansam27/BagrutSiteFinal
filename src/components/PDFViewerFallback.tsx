import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface PDFViewerFallbackProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  onDownload?: () => void;
}

const PDFViewerFallback: React.FC<PDFViewerFallbackProps> = ({ pdfUrl, title, onClose, onDownload }) => {
  // Handle modal click to prevent event propagation
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Open PDF in a new tab
  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-zoomIn" onClick={handleModalClick}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
          <h2 className="text-xl font-semibold text-gray-900 truncate">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">לא ניתן להציג את ה-PDF</h3>
            <p className="text-gray-600 mb-6">
              לא ניתן להציג את קובץ ה-PDF ישירות באתר. אנא בחר אחת מהאפשרויות הבאות:
            </p>
            
            <div className="flex flex-col space-y-3">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-5 w-5 mr-2" />
                  הורד את הקובץ
                </button>
              )}
              
              <button
                onClick={openInNewTab}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                פתח בכרטיסייה חדשה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerFallback;