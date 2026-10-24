import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, MapPin, Clock, Star } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const AudioCard = ({ spot, compact = false, horizontal = false, onSelect }) => {
  const { currentSpot, isPlaying, playSpot } = useAudio();

  const isCurrentPlaying = currentSpot?.id === spot.id && isPlaying;
  const isSelected = currentSpot?.id === spot.id;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    playSpot(spot);
  };

  return (
    <div 
      className={`audio-card ${compact ? 'compact' : ''} ${horizontal ? 'horizontal' : ''} ${isSelected ? 'active-spot' : ''}`}
      onClick={() => onSelect && onSelect(spot)}
    >
      <div className="audio-card-image-wrap">
        <img src={spot.image} alt={spot.title} className="audio-card-thumb" loading="lazy" />
        <span className={`badge badge-${spot.category.toLowerCase()} audio-card-badge`}>
          {spot.category}
        </span>
        <button 
          type="button" 
          className={`audio-card-play-btn ${isCurrentPlaying ? 'playing' : ''}`}
          onClick={handlePlayClick}
          aria-label={isCurrentPlaying ? 'Pause story' : 'Play story'}
        >
          {isCurrentPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" />}
        </button>
      </div>

      <div className="audio-card-content">
        <div className="audio-card-header">
          <div className="audio-card-location">
            <MapPin size={12} />
            <span>{spot.location}</span>
          </div>
          <span className="audio-card-distance">{spot.distance}</span>
        </div>

        <h3 className="audio-card-title">
          <Link to={`/stories/${spot.id}`}>
            {spot.title}
          </Link>
        </h3>

        {!compact && (
          <p className="audio-card-desc">
            {spot.description}
          </p>
        )}

        <div className="audio-card-footer">
          <div className="audio-card-meta">
            <span className="audio-card-rating">
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <strong>{spot.rating}</strong>
              <span className="rating-count">({spot.reviewsCount})</span>
            </span>
            <span className="audio-card-duration">
              <Clock size={12} />
              {spot.duration}
            </span>
          </div>

          <Link to={`/stories/${spot.id}`} className="audio-card-link">
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
