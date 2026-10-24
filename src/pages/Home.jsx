import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Play, 
  Pause, 
  MapPin, 
  Volume2, 
  Radio, 
  Headphones, 
  Mic, 
  Users, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { useAudio } from '../context/AudioContext';
import { STATS, HOW_IT_WORKS_STEPS } from '../data/sampleAudio';
import { AudioCard } from '../components/AudioCard';

export const Home = () => {
  const { spots } = useSpots();
  const { currentSpot, isPlaying, playSpot, togglePlay } = useAudio();
  const navigate = useNavigate();

  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Spotlight featured spot for the floating hero card
  const heroFeaturedSpot = spots.find((s) => s.id === 'hawa-mahal-whispers') || spots[0];
  const isHeroSpotPlaying = currentSpot?.id === heroFeaturedSpot?.id && isPlaying;

  const handleHeroCardPlay = (e) => {
    e.stopPropagation();
    if (heroFeaturedSpot) {
      playSpot(heroFeaturedSpot);
    }
  };

  return (
    <div className="page-home">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        {/* Background Image with Deep Navy Gradient Overlay */}
        <div className="hero-background-media">
          <img 
            src="https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1920&q=85" 
            alt="Jaipur Heritage at Sunset" 
            className="hero-bg-img"
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-content-grid">
            {/* Left: Headline, Subtitle, CTAs */}
            <div className="hero-text-column">
              <div className="hero-badge">
                <span className="hero-badge-pulse" />
                <Radio size={14} className="hero-badge-icon" />
                <span>Geospatial Proximity Audio</span>
              </div>

              <h1 className="hero-headline">
                Discover Stories <br />
                <span className="hero-highlight-text">Around You</span>
              </h1>

              <p className="hero-description">
                ProxiSpeak connects real-world heritage, cultural secrets, and local lore directly to where you stand. Put on your headphones, step outside, and hear historical cities come alive.
              </p>

              <div className="hero-cta-group">
                <Link to="/explore" className="btn btn-primary hero-btn-primary">
                  <Compass size={18} />
                  <span>Explore Nearby</span>
                </Link>

                <button 
                  type="button" 
                  className="btn btn-outline hero-btn-secondary"
                  onClick={() => setVideoModalOpen(true)}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Statistics Row */}
              <div className="hero-stats-row">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="hero-stat-item">
                    <span className="hero-stat-value">{stat.value}</span>
                    <span className="hero-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating Visual Composition */}
            <div className="hero-visual-column">
              {/* Floating Story Card */}
              <div 
                className={`floating-audio-card ${isHeroSpotPlaying ? 'playing' : ''}`}
                onClick={() => heroFeaturedSpot && navigate(`/stories/${heroFeaturedSpot.id}`)}
              >
                <div className="floating-card-thumb-wrap">
                  <img 
                    src={heroFeaturedSpot.image} 
                    alt={heroFeaturedSpot.title} 
                    className="floating-card-thumb" 
                  />
                  <div className="floating-live-badge">
                    <span className="dot" />
                    <span>Nearby Trigger</span>
                  </div>
                </div>

                <div className="floating-card-content">
                  <div className="floating-card-header">
                    <span className="floating-tag">Featured Landmark</span>
                    <span className="floating-distance">150m away</span>
                  </div>

                  <h3 className="floating-card-title">{heroFeaturedSpot.title}</h3>
                  <div className="floating-location">
                    <MapPin size={13} />
                    <span>{heroFeaturedSpot.location}</span>
                  </div>

                  {/* Waveform graphic */}
                  <div className="floating-waveform-wrapper">
                    <div className="floating-waveform-bars">
                      {[30, 60, 45, 90, 75, 40, 85, 95, 60, 80, 50, 70, 35, 65, 40].map((h, i) => (
                        <span 
                          key={i} 
                          className={`wave-col ${isHeroSpotPlaying ? 'anim' : ''}`}
                          style={{ 
                            height: isHeroSpotPlaying ? `${h}%` : '40%',
                            animationDelay: `${i * 0.07}s`
                          }} 
                        />
                      ))}
                    </div>
                    <span className="floating-duration">{heroFeaturedSpot.duration}</span>
                  </div>

                  <div className="floating-card-actions">
                    <button 
                      type="button" 
                      className="floating-play-btn"
                      onClick={handleHeroCardPlay}
                    >
                      {isHeroSpotPlaying ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#ffffff" />}
                      <span>{isHeroSpotPlaying ? 'Pause Audio' : 'Listen Now'}</span>
                    </button>
                    <span className="floating-author">By {heroFeaturedSpot.author}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Location Pin Graphics */}
              <div className="hero-decorative-pin pin-1">
                <div className="pin-circle">
                  <MapPin size={18} />
                </div>
                <div className="pin-card-preview">
                  <span className="pin-title">City Palace</span>
                  <span className="pin-dist">350m</span>
                </div>
              </div>

              <div className="hero-decorative-pin pin-2">
                <div className="pin-circle">
                  <MapPin size={18} />
                </div>
                <div className="pin-card-preview">
                  <span className="pin-title">Jantar Mantar</span>
                  <span className="pin-dist">420m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Seamless Proximity Listening</span>
            <h2 className="section-heading">How ProxiSpeak Works</h2>
            <p className="section-subheading">
              Four simple steps connecting real-world coordinates with captivating human narrations.
            </p>
          </div>

          <div className="how-it-works-grid">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const IconComp = 
                step.icon === 'MapPin' ? MapPin :
                step.icon === 'Headphones' ? Headphones :
                step.icon === 'Mic' ? Mic : Users;

              return (
                <div key={idx} className="how-it-works-card">
                  <div className="step-number-badge">{step.step}</div>
                  <div className="step-icon-wrapper">
                    <IconComp size={26} className="step-icon" />
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= POPULAR NEARBY SPOTS PREVIEW ================= */}
      <section className="nearby-preview-section">
        <div className="container">
          <div className="section-header-split">
            <div>
              <span className="section-eyebrow">Trending Recordings</span>
              <h2 className="section-heading">Stories Around Old Jaipur</h2>
              <p className="section-subheading">
                Step inside the historic walled Pink City and hear centuries of royal tales.
              </p>
            </div>
            <Link to="/explore" className="btn btn-secondary">
              <span>View All on Map</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="nearby-cards-grid">
            {spots.slice(0, 3).map((spot) => (
              <AudioCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CREATOR CTA BANNER ================= */}
      <section className="creator-banner-section">
        <div className="container">
          <div className="creator-banner-box">
            <div className="creator-banner-content">
              <span className="creator-banner-tag">Become a Voice for Your City</span>
              <h2 className="creator-banner-heading">Know a Hidden Story or Ancient Legend?</h2>
              <p className="creator-banner-text">
                Record an audio guide for your neighborhood, college campus, local food street, or historical monument. Upload and pin it to exact GPS coordinates in minutes.
              </p>
              <div className="creator-banner-actions">
                <Link to="/create" className="btn btn-primary">
                  <Mic size={18} />
                  <span>Create an Audio Spot</span>
                </Link>
                <Link to="/dashboard" className="btn btn-outline-white">
                  <span>View Dashboard</span>
                </Link>
              </div>
            </div>
            <div className="creator-banner-graphic">
              <div className="radar-circle-outer">
                <div className="radar-circle-inner" />
                <MapPin size={36} className="radar-pin-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="modal-overlay" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Experience ProxiSpeak Geospatial Audio</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setVideoModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="video-embed-container">
              <iframe
                title="ProxiSpeak Intro Video"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
