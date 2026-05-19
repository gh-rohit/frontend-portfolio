// src/components/VideoPlayer.jsx - CLEAN & SIMPLE VERSION
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = ({ video, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 400,
          duration: 0.3
        }}
        className="relative w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Simple */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Container */}
        <div className="relative w-full bg-black">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            {video.videoFileUrl ? (
              <video
                src={video.videoFileUrl}
                className="absolute top-0 left-0 w-full h-full"
                controls
                autoPlay
                controlsList="nodownload"
                poster={video.coverImageUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black">
                <p className="text-gray-500">Video not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Info - Simple */}
        <div className="p-5 bg-black">
          <h3 className="text-xl font-semibold text-white mb-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-400 text-sm leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoPlayer;