import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Share2, 
  Bookmark, 
  Heart, 
  Radio, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { useAudio } from '../context/AudioContext';
import { AudioCard } from '../components/AudioCard';

export const AudioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spots } = useSpots();
  const { 
    currentSpot, 
    isPlaying, 
    currentTime, 
    duration, 
    playbackSpeed, 
    volume, 
    isMuted, 
    playSpot, 
    togglePlay, 
    seek, 
    skipForward, 
    skipBackward, 
    setPlaybackSpeed, 
    setVolume, 
    toggleMute 
  } = useAudio();

  // Find the requested spot or default to City Palace
  const spot = spots.find((s) => s.id === id) || spots[0];

  const [activeGalleryImg, setActiveGalleryImg] = useState(spot?.image || '');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(spot?.likes || 412);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (spot) {
      setActiveGalleryImg(spot.image);
      setLikesCount(spot.likes || 412);
      window.scrollTo(0, 0);
    }
  }, [spot]);

  if (!spot) {
    return (
      <div className="container py-5 text-center">
        <h2>Audio Story Not Found</h2>
        <Link to="/explore" className="btn btn-primary mt-3">Back to Explore</Link>
      </div>
    );
  }

  const isCurrentPlaying = currentSpot?.id === spot.id && isPlaying;
  const progressPercent = (currentSpot?.id === spot.id && duration > 0)
    ? (currentTime / duration) * 100
    : 0;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayToggle = () => {
    playSpot(spot);
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related spots (excluding current)
  const relatedSpots = spots.filter((s) => s.id !== spot.id).slice(0, 4);

  return (
    <div className="page-audio-details">
      <div className="container details-container">
        {/* Back Link */}
        <div className="details-nav-row">
          <Link to="/explore" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Explore</span>
          </Link>

          <div className="details-header-actions">
            <button 
              type="button" 
              className={`action-pill-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart size={16} fill={isLiked ? '#F04452' : 'none'} color={isLiked ? '#F04452' : 'currentColor'} />
              <span>{likesCount}</span>
            </button>
            <button 
              type="button" 
              className={`action-pill-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark size={16} fill={isBookmarked ? '#583BFF' : 'none'} color={isBookmarked ? '#583BFF' : 'currentColor'} />
              <span>Save</span>
            </button>
            <button 
              type="button" 
              className="action-pill-btn"
              onClick={handleShare}
            >
              {copiedLink ? <Check size={16} color="#20A66A" /> : <Share2 size={16} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Hero & Audio Player Area */}
        <div className="details-main-grid">
          {/* Left Column: Landmark Imagery & Gallery */}
          <div className="details-visual-column">
            <div className="main-landmark-photo-wrap">
              <img 
                src={activeGalleryImg || spot.image} 
                alt={spot.title} 
                className="main-landmark-photo" 
              />
              <span className={`badge badge-${spot.category.toLowerCase()} photo-category-badge`}>
                {spot.category}
              </span>
              <div className="photo-proximity-pill">
                <Radio size={14} className="proximity-icon-pulse" />
                <span>Geotagged Audio Zone</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {spot.gallery && spot.gallery.length > 1 && (
              <div className="details-gallery-row">
                {spot.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gallery-thumb-btn ${activeGalleryImg === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveGalleryImg(imgUrl)}
                  >
                    <img src={imgUrl} alt={`${spot.title} photo ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Metadata, Narration text */}
          <div className="details-info-column">
            <div className="details-metadata-badges">
              <span className="meta-badge location-badge">
                <MapPin size={13} />
                {spot.location}
              </span>
              <span className="meta-badge distance-badge">
                {spot.distance}
              </span>
              <span className="meta-badge rating-badge">
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <strong>{spot.rating}</strong> ({spot.reviewsCount} reviews)
              </span>
            </div>

            <h1 className="details-title">{spot.title}</h1>

            <div className="narrator-author-box">
              <div className="narrator-avatar">
                {spot.author?.charAt(0) || 'D'}
              </div>
              <div className="narrator-info">
                <span className="narrator-name">{spot.author}</span>
                <span className="narrator-role">{spot.authorRole}</span>
              </div>
            </div>

            <div className="details-description-box">
              <h3 className="section-sub-title">Historical Background</h3>
              <p className="details-body-text">{spot.description}</p>
            </div>

            {/* Tags */}
            <div className="details-tags-section">
              <h4 className="tags-label">Tags & Topics</h4>
              <div className="tags-list">
                {spot.tags && spot.tags.map((tag, i) => (
                  <span key={i} className="detail-tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Audio Experience Player Card */}
        <section className="dedicated-player-card">
          <div className="player-card-header">
            <div className="player-card-title-group">
              <span className="player-eyebrow">Audio Narration</span>
              <h3>Listen to "{spot.title}"</h3>
            </div>
            <div className="player-gps-proximity-status">
              <span className="radar-status-dot" />
              <span>Proximity Match: In Zone (350m)</span>
            </div>
          </div>

          {/* Scrubber Progress Bar */}
          <div className="dedicated-scrubber-area">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => {
                if (currentSpot?.id === spot.id) {
                  seek((parseFloat(e.target.value) / 100) * duration);
                }
              }}
              className="dedicated-slider"
            />
            <div className="dedicated-timestamps-row">
              <span>{currentSpot?.id === spot.id ? formatTime(currentTime) : '00:00'}</span>
              <span>{spot.duration}</span>
            </div>
          </div>

          {/* Dynamic Waveform Visualizer */}
          <div className="dedicated-waveform-display">
            {[45, 70, 95, 60, 85, 40, 65, 90, 75, 50, 80, 100, 55, 75, 90, 60, 40, 85, 70, 95, 50, 80, 65, 45, 90, 75, 60].map((barHeight, i) => (
              <span
                key={i}
                className={`dedicated-wave-bar ${isCurrentPlaying ? 'anim' : ''}`}
                style={{
                  height: isCurrentPlaying ? `${Math.max(25, barHeight * (0.5 + Math.random() * 0.5))}%` : '25%',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Player Action Buttons Bar */}
          <div className="dedicated-player-controls-bar">
            {/* Playback speed buttons */}
            <div className="speed-buttons-group">
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  className={`spd-pill ${playbackSpeed === spd ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Central Controls */}
            <div className="central-playback-controls">
              <button
                type="button"
                className="btn-round-ctrl"
                onClick={() => skipBackward(10)}
                title="Rewind 10s"
              >
                <RotateCcw size={18} />
              </button>

              <button
                type="button"
                className="btn-primary-play"
                onClick={handlePlayToggle}
                aria-label={isCurrentPlaying ? 'Pause story' : 'Play story'}
              >
                {isCurrentPlaying ? (
                  <Pause size={24} fill="#ffffff" />
                ) : (
                  <Play size={24} fill="#ffffff" />
                )}
              </button>

              <button
                type="button"
                className="btn-round-ctrl"
                onClick={() => skipForward(10)}
                title="Forward 10s"
              >
                <RotateCw size={18} />
              </button>
            </div>

            {/* Volume & Mute */}
            <div className="volume-control-group">
              <button
                type="button"
                className="vol-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="vol-slider"
              />
            </div>
          </div>
        </section>

        {/* Related Audio Spots Section */}
        <section className="related-spots-section">
          <div className="section-header-split">
            <div>
              <span className="section-eyebrow">Nearby Discoveries</span>
              <h2 className="section-heading">Related Audio Spots in Jaipur</h2>
            </div>
            <Link to="/explore" className="view-more-link">
              <span>View All on Map</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="related-spots-grid">
            {relatedSpots.map((relSpot) => (
              <AudioCard key={relSpot.id} spot={relSpot} compact={true} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
