import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Radio, 
  Search, 
  Menu, 
  X, 
  Compass, 
  PlusCircle, 
  Headphones, 
  User, 
  Volume2
} from 'lucide-react';
import { USER_PROFILE } from '../data/sampleAudio';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <MapPin className="brand-pin-icon" size={22} />
            <Volume2 className="brand-wave-icon" size={13} />
          </div>
          <div className="brand-text">
            <span className="brand-name">ProxiSpeak</span>
            <span className="brand-tagline">Proximity Audio</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/explore" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Explore
          </NavLink>
          <NavLink 
            to="/create" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Create
          </NavLink>
          <NavLink 
            to="/stories/city-palace-history" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Stories
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Quick Search */}
          <div className={`navbar-search ${searchOpen ? 'expanded' : ''}`}>
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="search-form">
                <Search size={16} className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search spots, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                />
                <button type="button" className="search-close-btn" onClick={() => setSearchOpen(false)}>
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="search-toggle-btn"
                onClick={() => setSearchOpen(true)}
                title="Search nearby audio spots"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          <div className="auth-buttons">
            <button 
              type="button" 
              className="btn btn-ghost login-btn"
              onClick={() => navigate('/dashboard')}
            >
              Log In
            </button>
            <Link to="/create" className="btn btn-primary signup-btn">
              Get Started
            </Link>
          </div>

          {/* Profile mini avatar link */}
          <Link to="/dashboard" className="navbar-profile-avatar" title="My Dashboard">
            <img src={USER_PROFILE.avatar} alt={USER_PROFILE.name} />
          </Link>

          {/* Mobile hamburger toggle */}
          <button 
            type="button" 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search audio stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <nav className="mobile-nav-links">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/explore" onClick={() => setMobileMenuOpen(false)}>Explore Nearby</NavLink>
            <NavLink to="/create" onClick={() => setMobileMenuOpen(false)}>Create Audio Spot</NavLink>
            <NavLink to="/stories/city-palace-history" onClick={() => setMobileMenuOpen(false)}>Story Details</NavLink>
            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Dashboard</NavLink>
          </nav>

          <div className="mobile-auth-actions">
            <Link to="/dashboard" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>
              Log In
            </Link>
            <Link to="/create" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
