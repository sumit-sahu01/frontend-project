import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_AUDIO_SPOTS } from '../data/sampleAudio';

const SpotsContext = createContext(null);

export const SpotsProvider = ({ children }) => {
  const [spots, setSpots] = useState(() => {
    const saved = localStorage.getItem('proxispeak_spots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_AUDIO_SPOTS;
      }
    }
    return SAMPLE_AUDIO_SPOTS;
  });

  // User simulated/real location (Defaults near Jaipur Old City)
  const [userLocation, setUserLocation] = useState({
    lat: 26.9240,
    lng: 75.8230,
    accuracy: 35,
    isReal: false
  });

  const [selectedSpotId, setSelectedSpotId] = useState('city-palace-history');

  useEffect(() => {
    localStorage.setItem('proxispeak_spots', JSON.stringify(spots));
  }, [spots]);

  // Request real GPS location
  const requestUserLocation = () => {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLoc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy || 25,
              isReal: true
            };
            setUserLocation(newLoc);
            resolve(newLoc);
          },
          (err) => {
            console.warn('Geolocation permission denied or error:', err);
            // Default to Jaipur center
            resolve(userLocation);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        resolve(userLocation);
      }
    });
  };

  // Add a new spot from CreateAudio page
  const addSpot = (newSpotData) => {
    const id = (newSpotData.title || 'spot')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const fullSpot = {
      id,
      title: newSpotData.title || 'Untitled Spot',
      category: newSpotData.category || 'History',
      location: newSpotData.location || 'Jaipur, Rajasthan',
      coordinates: [parseFloat(newSpotData.lat) || 26.9250, parseFloat(newSpotData.lng) || 75.8240],
      distance: '250 m away',
      distanceMeters: 250,
      rating: 5.0,
      reviewsCount: 1,
      duration: newSpotData.duration || '3:30',
      durationSeconds: 210,
      author: 'Aarav Sharma',
      authorRole: 'Community Contributor',
      status: 'Published',
      visibility: 'Public',
      plays: 0,
      likes: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      image: newSpotData.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      description: newSpotData.description || '',
      tags: newSpotData.tags ? newSpotData.tags.split(',').map((t) => t.trim()) : ['Community', 'AudioSpot'],
      gallery: [newSpotData.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'],
      audioUrl: newSpotData.audioUrl || 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg'
    };

    setSpots((prev) => [fullSpot, ...prev]);
    return fullSpot;
  };

  const updateSpot = (id, updatedFields) => {
    setSpots((prev) =>
      prev.map((spot) => (spot.id === id ? { ...spot, ...updatedFields } : spot))
    );
  };

  const deleteSpot = (id) => {
    setSpots((prev) => prev.filter((spot) => spot.id !== id));
  };

  const toggleVisibility = (id) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id === id) {
          const nextVis = spot.visibility === 'Public' ? 'Private' : 'Public';
          const nextStatus = nextVis === 'Public' ? 'Published' : 'Draft';
          return { ...spot, visibility: nextVis, status: nextStatus };
        }
        return spot;
      })
    );
  };

  return (
    <SpotsContext.Provider
      value={{
        spots,
        userLocation,
        selectedSpotId,
        setSelectedSpotId,
        requestUserLocation,
        addSpot,
        updateSpot,
        deleteSpot,
        toggleVisibility
      }}
    >
      {children}
    </SpotsContext.Provider>
  );
};

export const useSpots = () => {
  const context = useContext(SpotsContext);
  if (!context) {
    throw new Error('useSpots must be used within a SpotsProvider');
  }
  return context;
};
