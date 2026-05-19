// src/components/ProductShowcase.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ProductShowcase = ({ project, isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle escape key and browser back
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    
    // Push state to handle back button
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalImages = project.images?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl mx-4 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Back Button - Top Left */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image Counter */}
        {totalImages > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
            {activeIndex + 1} / {totalImages}
          </div>
        )}

        {/* Main Swiper - Perfect Image Size */}
        <div className="p-8 pb-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            className="product-swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '70vh'
            }}
          >
            {project.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                  <img
                    src={image.url}
                    alt={`${project.title} - ${index + 1}`}
                    className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg"
                    style={{ maxHeight: '60vh', width: 'auto' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {project.description || 'No description available.'}
          </p>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
              {project.type === 'design' ? '🎨 Product Design' : '📸 Product Photography'}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
              {totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductShowcase;