import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerModalProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, title, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLocalVideo, setIsLocalVideo] = useState(false);

  useEffect(() => {
    // Extract YouTube video ID from URL
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let id = null;
      
      if (videoUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        id = urlParams.get('v');
      } else if (videoUrl.includes('youtu.be/')) {
        id = videoUrl.split('youtu.be/')[1].split('?')[0];
      } else if (videoUrl.includes('youtube.com/embed/')) {
        id = videoUrl.split('youtube.com/embed/')[1].split('?')[0];
      }
      
      setVideoId(id);
      setIsLocalVideo(false);
    } else {
      // Handle local video
      setIsLocalVideo(true);
    }

    // Add event listener for escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [videoUrl, onClose]);

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    
    if (!videoContainer) return;
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // If it's a local video, find the video element and mute/unmute it
    if (isLocalVideo) {
      const videoElement = document.getElementById('local-video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.muted = !isMuted;
      }
    }
  };

  // Handle modal click to prevent event propagation
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl animate-zoomIn" onClick={handleModalClick}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-primary-50">
          <h2 className="text-xl font-semibold text-gray-900 truncate">{title}</h2>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button 
              onClick={toggleMute}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title={isMuted ? "הפעל שמע" : "השתק"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title={isFullscreen ? "צא ממסך מלא" : "מסך מלא"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              title="סגור"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div id="video-container" className="relative bg-black aspect-video w-full">
          {isLocalVideo ? (
            <video
              id="local-video"
              src={videoUrl}
              className="w-full h-full"
              controls
              autoPlay
              muted={isMuted}
            />
          ) : videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              לא ניתן לטעון את הסרטון
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;