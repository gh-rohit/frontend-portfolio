// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { getInstagramUrl } from '../sanityClient';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch Instagram URL from Sanity
    const fetchInstagram = async () => {
      const url = await getInstagramUrl();
      setInstagramUrl(url);
    };
    fetchInstagram();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div onClick={() => scrollTo('home')} className="text-2xl font-bold cursor-pointer">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Alka Raj
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => scrollTo('home')} className="text-white hover:text-orange-400 transition">
              Home
            </button>
            <button onClick={() => scrollTo('about')} className="text-white hover:text-orange-400 transition">
              About
            </button>
            <button onClick={() => scrollTo('work')} className="text-white hover:text-orange-400 transition">
              Work
            </button>
            <button onClick={() => scrollTo('contact')} className="text-white hover:text-orange-400 transition">
              Contact
            </button>
            
            {/* ✅ Instagram Button - Sanity se manage */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-sm font-medium hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
                Instagram
              </a>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-xl z-40 transform transition-all duration-500 ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } p-6 pt-24`}>
        <div className="flex flex-col gap-6">
          <button onClick={() => scrollTo('home')} className="text-white text-left text-lg py-2">Home</button>
          <button onClick={() => scrollTo('about')} className="text-white text-left text-lg py-2">About</button>
          <button onClick={() => scrollTo('work')} className="text-white text-left text-lg py-2">Work</button>
          <button onClick={() => scrollTo('contact')} className="text-white text-left text-lg py-2">Contact</button>
          
          {/* ✅ Mobile Instagram Button */}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-center mt-4"
            >
              📷 Instagram
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;