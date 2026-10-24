import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Volume2, Heart, Globe, Compass, Share2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top-grid">
          {/* Brand info */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-brand">
              <div className="brand-icon-wrapper small">
                <MapPin className="brand-pin-icon" size={18} />
                <Volume2 className="brand-wave-icon" size={10} />
              </div>
              <span className="brand-name">ProxiSpeak</span>
            </Link>
            <p className="footer-brand-desc">
              Geospatial proximity audio for travelers, heritage seekers, and local communities. Discover stories where history happened.
            </p>
            <div className="footer-socials">
              <a href="#globe" aria-label="Website"><Globe size={18} /></a>
              <a href="#compass" aria-label="Explore"><Compass size={18} /></a>
              <a href="#share" aria-label="Share"><Share2 size={18} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-links-column">
            <h4 className="footer-column-title">Explore</h4>
            <ul>
              <li><Link to="/explore">Explore Nearby</Link></li>
              <li><Link to="/explore?category=History">Historical Sites</Link></li>
              <li><Link to="/explore?category=Culture">Cultural Walks</Link></li>
              <li><Link to="/explore?category=Food">Street Food Trails</Link></li>
              <li><Link to="/explore?category=Nature">Parks & Lakes</Link></li>
            </ul>
          </div>

          {/* Creators */}
          <div className="footer-links-column">
            <h4 className="footer-column-title">Community</h4>
            <ul>
              <li><Link to="/create">Create Audio Spot</Link></li>
              <li><Link to="/dashboard">Creator Dashboard</Link></li>
              <li><Link to="/stories/city-palace-history">Featured Stories</Link></li>
              <li><a href="#guidelines">Narrator Guidelines</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>

          {/* Technology */}
          <div className="footer-links-column">
            <h4 className="footer-column-title">Platform</h4>
            <ul>
              <li><a href="#geospatial">Geofencing Tech</a></li>
              <li><a href="#audio">Spatial Audio</a></li>
              <li><a href="#privacy">Location Privacy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} ProxiSpeak — Geospatial Proximity Audio. All rights reserved.</p>
          <p className="footer-credits">
            Crafted for immersive location-based listening in Jaipur & beyond.
          </p>
        </div>
      </div>
    </footer>
  );
};
