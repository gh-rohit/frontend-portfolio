// src/components/ProjectCard.jsx
import { useState } from 'react';
import { urlFor } from '../sanityClient';
import './ProjectCard.css';

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageUrl = project.coverImage 
    ? urlFor(project.coverImage)?.width(800)?.height(1000)?.url()
    : null;
  
  const projectType = project.type === 'design' ? '🎨 Product Design' : '📸 Photography';
  const gradientClass = project.type === 'design' ? 'gradient-purple' : 'gradient-cyan';

  return (
    <div 
      className={`project-card ${isHovered ? 'hovered' : ''} ${gradientClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-image-wrapper">
        {!imageLoaded && <div className="image-skeleton"></div>}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={project.title}
            className={`card-image ${imageLoaded ? 'loaded' : ''}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <div className="card-overlay">
          <div className="overlay-gradient"></div>
          <div className="overlay-content">
            <span className="project-type">{projectType}</span>
            <h3 className="card-title">{project.title}</h3>
            <div className="card-actions">
              <button className="view-btn">
                Explore <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-glow"></div>
    </div>
  );
};

export default ProjectCard;