// src/components/Home.jsx - WITH FILTER BUTTONS
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { client, urlFor } from '../sanityClient';
import AboutSection from '../components/AboutSection';
import ProductShowcase from '../components/ProductShowcase';
import VideoPlayer from '../components/VideoPlayer';

const Home = () => {
  const [projects, setProjects] = useState([]);  // Photos & Design
  const [videos, setVideos] = useState([]);      // Videos
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'design', 'photography', 'videos'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [author, setAuthor] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch photos & design projects
        const photosQuery = `*[_type == "project" && (type == "design" || type == "photography")] | order(_createdAt desc) {
          _id,
          title,
          type,
          coverImage,
          images[] {
            asset->,
            alt
          },
          description
        }`;
        const photosData = await client.fetch(photosQuery);
        
        const transformedPhotos = photosData.map(project => ({
          ...project,
          images: project.images?.map(img => ({
            url: urlFor(img).width(800).url(),
            alt: img.alt || project.title
          })) || []
        }));
        
        // Fetch video projects
        const videosQuery = `*[_type == "project" && type == "video"] | order(_createdAt desc) {
          _id,
          title,
          type,
          coverImage,
          "videoFileUrl": videoFile.asset->url,
          description
        }`;
        const videosData = await client.fetch(videosQuery);
        
        const transformedVideos = videosData.map(video => ({
          ...video,
          isVideo: true,
          coverImageUrl: video.coverImage ? urlFor(video.coverImage).width(400).height(300).url() : null,
        }));
        
        setProjects(transformedPhotos);
        setVideos(transformedVideos);

        // Fetch author
        const authorQuery = `*[_type == "author"][0] {
          instagramUrl,
          instagramUsername
        }`;
        const authorData = await client.fetch(authorQuery);
        setAuthor(authorData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-play videos when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = videoRefs.current[entry.target.dataset.id];
          if (videoElement) {
            if (entry.isIntersecting) {
              videoElement.play().catch(e => console.log('Auto-play prevented:', e));
            } else {
              videoElement.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Counts
  const designCount = projects.filter(p => p?.type === 'design').length;
  const photoCount = projects.filter(p => p?.type === 'photography').length;
  const videoCount = videos.length;
  
  // Get filtered items based on active tab
  const getFilteredItems = () => {
    if (activeTab === 'all') {
      return [...projects, ...videos];
    }
    if (activeTab === 'design') {
      return projects.filter(p => p?.type === 'design');
    }
    if (activeTab === 'photography') {
      return projects.filter(p => p?.type === 'photography');
    }
    if (activeTab === 'videos') {
      return videos;
    }
    return [];
  };
  
  const filteredItems = getFilteredItems();

  const instagramLink = author?.instagramUrl || 
    (author?.instagramUsername ? `https://instagram.com/${author.instagramUsername}` : null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Handle card click
  const handleCardClick = (item) => {
    if (item.isVideo) {
      setSelectedVideo(item);
    } else {
      setSelectedProject(item);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-orange-400 mb-6">
              ✨ Alka Raj — Product Designer & Photographer
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 bg-300% bg-clip-text text-transparent animate-gradient">
              Transforming Ideas
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-300% bg-clip-text text-transparent animate-gradient">
              Into Visual Reality
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed"
          >
            Where design meets photography — crafting unforgettable product stories that captivate, 
            inspire, and leave a lasting impression.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 mb-12 flex-wrap"
          >
            <button 
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full font-medium overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10">✨ View Portfolio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
            
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 border border-white/30 rounded-full font-medium hover:bg-white/10 transition hover:scale-105"
            >
              💬 Get in Touch
            </button>

            {instagramLink && (
              <motion.a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
                Instagram
              </motion.a>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-6 sm:gap-8 flex-wrap"
          >
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition">
                {projects.length + videos.length}+
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Projects</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition">
                {designCount}+
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Designs</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent group-hover:scale-110 transition">
                {photoCount}+
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Photos</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition">
                {videoCount}+
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Videos</div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutSection />

      {/* WORK SECTION WITH FILTER BUTTONS */}
      <section id="work" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-400 mb-4">
              🎨 My Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              My <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Creative Work</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Click on any image or video to view larger
            </p>
          </motion.div>

          {/* FILTER BUTTONS */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-12 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Work ({projects.length + videos.length})
            </button>
            
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'design'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Design ({designCount})
            </button>
            
            <button
              onClick={() => setActiveTab('photography')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'photography'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Photography ({photoCount})
            </button>
            
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              🎥 Videos ({videoCount})
            </button>
          </div>

          {/* FILTERED PROJECTS GRID */}
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredId(item._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ease-out hover:border-orange-500/40 hover:shadow-2xl">
                    
                    {/* Media Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                      
                      {item.isVideo ? (
                        // VIDEO
                        <video
                          ref={el => {
                            if (el) videoRefs.current[item._id] = el;
                          }}
                          data-id={item._id}
                          src={item.videoFileUrl}
                          className="w-full h-full object-cover"
                          poster={item.coverImageUrl}
                          loop
                          muted
                          playsInline
                          autoPlay
                        />
                      ) : (
                        // IMAGE
                        item.images?.[0] ? (
                          <motion.img
                            src={item.images[0].url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">📸</span>
                          </div>
                        )
                      )}
                      
                      {/* Gradient Overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === item._id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Video Badge */}
                      {item.isVideo && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs flex items-center gap-1 z-10">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Video
                        </div>
                      )}
                      
                      {/* Multiple Images Badge */}
                      {!item.isVideo && item.images?.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs flex items-center gap-1 z-10">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          {item.images.length}
                        </div>
                      )}
                      
                      {/* Hover Content */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center z-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: hoveredId === item._id ? 1 : 0, scale: hoveredId === item._id ? 1 : 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="text-center">
                          <div className="bg-white/20 backdrop-blur-xl rounded-full p-3 mb-2 inline-block">
                            {item.isVideo ? (
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-white font-medium text-sm sm:text-base">
                            {item.isVideo ? 'Click to play' : 'Click to view'}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-2">
                        <motion.span 
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.isVideo 
                              ? 'bg-purple-500/20 text-purple-300'
                              : item.type === 'design' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-pink-500/20 text-pink-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.isVideo 
                            ? '🎥 Video' 
                            : item.type === 'design' 
                              ? '🎨 Design' 
                              : '📸 Photography'}
                        </motion.span>
                      </div>
                      <motion.h3 
                        className="text-base sm:text-lg font-semibold text-white"
                        whileHover={{ 
                          background: "linear-gradient(135deg, #f97316, #ec4899)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent"
                        }}
                      >
                        {item.title}
                      </motion.h3>
                      {item.description && (
                        <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Bottom Glow */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredId === item._id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-gray-400">No items found in this category</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-orange-900/20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-white/10"
          >
            <div className="text-5xl sm:text-6xl mb-4 animate-bounce">✨</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Let's Create Something{' '}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Amazing</span>
            </h2>
            <p className="text-gray-300 mb-8 text-sm sm:text-base">Have a project in mind? I'd love to bring your vision to life.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full font-medium hover:shadow-2xl hover:shadow-orange-500/25 transition-all hover:scale-105 text-sm sm:text-base">
                Start a Project →
              </button>
              
              {instagramLink && (
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-medium hover:shadow-2xl hover:shadow-pink-500/25 transition-all hover:scale-105 inline-flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                  </svg>
                  Follow on Instagram
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODALS */}
      <AnimatePresence>
        {selectedProject && (
          <ProductShowcase
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVideo && (
          <VideoPlayer
            video={selectedVideo}
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;