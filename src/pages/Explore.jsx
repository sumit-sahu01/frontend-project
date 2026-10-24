import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Volume2, 
  Bell, 
  X, 
  Play, 
  Navigation,
  Compass
} from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { useAudio } from '../context/AudioContext';
import { CategoryFilters } from '../components/CategoryFilters';
import { AudioCard } from '../components/AudioCard';
import { MapView } from '../components/MapView';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const { spots, userLocation, requestUserLocation } = useSpots();
  const { playSpot, currentSpot, isPlaying } = useAudio();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpot, setSelectedSpot] = useState(spots[0] || null);
  const [showNotification, setShowNotification] = useState(true);

  // Sync params with state
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filtered spots list
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchCategory = 
        activeCategory === 'All' || 
        spot.category.toLowerCase() === activeCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = 
        !q ||
        spot.title.toLowerCase().includes(q) ||
        spot.location.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q) ||
        (spot.tags && spot.tags.some((t) => t.toLowerCase().includes(q)));

      return matchCategory && matchSearch;
    });
  }, [spots, activeCategory, searchQuery]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Nearby proactive trigger story (e.g., closest spot)
  const nearbyTriggerSpot = spots.find((s) => s.id === 'hawa-mahal-whispers') || spots[1];

  return (
    <div className="page-explore">
      <div className="explore-layout-container">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="explore-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Explore Nearby</h1>
            <p className="sidebar-subtitle">
              Discover audio stories within walking distance of your current position.
            </p>

            {/* Search Input */}
            <div className="sidebar-search-box">
              <Search size={16} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search nearby places or landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <CategoryFilters
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Audio Spots List */}
          <div className="sidebar-spots-list">
            <div className="spots-list-count-row">
              <span className="count-label">
                <strong>{filteredSpots.length}</strong> Audio Spots Found
              </span>
              <span className="location-pill">
                <MapPin size={12} /> Jaipur, Old City
              </span>
            </div>

            {filteredSpots.length === 0 ? (
              <div className="sidebar-empty-state">
                <Compass size={36} className="empty-icon" />
                <h3>No Audio Spots Found</h3>
                <p>Try searching for a different keyword or select "All" categories.</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="spots-cards-wrapper">
                {filteredSpots.map((spot) => (
                  <AudioCard
                    key={spot.id}
                    spot={spot}
                    onSelect={(s) => setSelectedSpot(s)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT MAP VIEW ================= */}
        <main className="explore-map-container">
          <MapView
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            onSelectSpot={(spot) => setSelectedSpot(spot)}
          />

          {/* Proactive Nearby Audio Trigger Notification */}
          {showNotification && nearbyTriggerSpot && (
            <div className="nearby-audio-notification">
              <div className="notification-icon-wrap">
                <Volume2 size={18} className="notification-icon" />
                <span className="notification-ping" />
              </div>
              <div className="notification-text">
                <span className="notif-title">Nearby story detected</span>
                <span className="notif-desc">
                  <strong>{nearbyTriggerSpot.title}</strong> is {nearbyTriggerSpot.distance}
                </span>
              </div>
              <div className="notification-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm notif-play-btn"
                  onClick={() => playSpot(nearbyTriggerSpot)}
                >
                  <Play size={14} fill="#ffffff" />
                  <span>Listen Now</span>
                </button>
                <button
                  type="button"
                  className="notif-close-btn"
                  onClick={() => setShowNotification(false)}
                  title="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
