import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  MapPin,
  X
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const AudioPlayer = () => {
  const { 
    currentSpot, 
    isPlaying, 
    currentTime, 
    duration, 
    playbackSpeed, 
    volume, 
    isMuted, 
    togglePlay, 
    seek, 
    skipForward, 
    skipBackward, 
    setPlaybackSpeed, 
    setVolume, 
    toggleMute,
    pause
  } = useAudio();

  if (!currentSpot) return null;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const newPercent = parseFloat(e.target.value);
    seek((newPercent / 100) * duration);
  };

  return (
    <div className="global-audio-player">
      {/* Top slim progress bar */}
      <div className="player-progress-bar-container">
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercent || 0}
          onChange={handleSeekChange}
          className="player-progress-slider"
        />
        <div 
          className="player-progress-fill" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      <div className="player-inner-content">
        {/* Left: Spot info */}
        <div className="player-spot-info">
          <Link to={`/stories/${currentSpot.id}`} className="player-thumb-link">
            <img 
              src={currentSpot.image} 
              alt={currentSpot.title} 
              className="player-thumb" 
            />
          </Link>
          <div className="player-text-meta">
            <div className="player-title-row">
              <Link to={`/stories/${currentSpot.id}`} className="player-title">
                {currentSpot.title}
              </Link>
              <span className={`badge badge-${currentSpot.category.toLowerCase()}`}>
                {currentSpot.category}
              </span>
            </div>
            <div className="player-sub-row">
              <span className="player-location">
                <MapPin size={12} /> {currentSpot.location}
              </span>
              <span className="player-dot">•</span>
              <span className="player-distance">{currentSpot.distance}</span>
            </div>
          </div>
        </div>

        {/* Center: Controls & Time */}
        <div className="player-center-controls">
          <div className="player-buttons-group">
            <button 
              type="button" 
              className="player-ctrl-btn" 
              onClick={() => skipBackward(10)} 
              title="Rewind 10 seconds"
            >
              <RotateCcw size={16} />
              <span className="btn-time-sub">10</span>
            </button>

            <button 
              type="button" 
              className="player-main-play-btn" 
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" />}
            </button>

            <button 
              type="button" 
              className="player-ctrl-btn" 
              onClick={() => skipForward(10)} 
              title="Forward 10 seconds"
            >
              <RotateCw size={16} />
              <span className="btn-time-sub">10</span>
            </button>
          </div>

          <div className="player-timestamps">
            <span>{formatTime(currentTime)}</span>
            <span className="player-time-slash">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Animated Waveform Bars */}
          <div className={`player-mini-waveform ${isPlaying ? 'animating' : ''}`}>
            {[40, 75, 55, 95, 60, 80, 45, 90, 65, 30, 85, 50].map((h, i) => (
              <span 
                key={i} 
                className="wave-bar" 
                style={{ 
                  height: isPlaying ? `${Math.max(20, (h * (0.6 + Math.random() * 0.4)))}%` : '30%',
                  animationDelay: `${i * 0.08}s` 
                }} 
              />
            ))}
          </div>
        </div>

        {/* Right: Tools, Volume, Speed */}
        <div className="player-right-actions">
          {/* Speed Selector */}
          <div className="player-speed-select">
            {[1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                onClick={() => setPlaybackSpeed(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="player-volume-control">
            <button type="button" onClick={toggleMute} className="volume-icon-btn">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>

          <Link 
            to={`/stories/${currentSpot.id}`} 
            className="player-view-details-btn" 
            title="Open Story Details"
          >
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
