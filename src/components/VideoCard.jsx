// src/components/VideoCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { urlFor } from '../sanityClient';

const VideoCard = ({ video, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const videoUrl = video.videoFile?.asset 
    ? urlFor(video.videoFile).url() 
    : null;
  
  const thumbnailUrl = video.coverImage 
    ? urlFor(video.coverImage).width(600).height(400).url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={() => onClick?.(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-purple-500/50 hover:shadow-2xl">
        
        {/* Video Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🎬</span>
            </div>
          )}
          
          {/* Play Button Overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white/20 backdrop-blur-xl rounded-full p-4"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </motion.div>
          
          {/* Video Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs flex items-center gap-1">
            🎥 Video
          </div>
          
          {/* Duration Badge (optional - if you want to add duration field) */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
              {video.duration}
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-purple-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Internal Video
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;