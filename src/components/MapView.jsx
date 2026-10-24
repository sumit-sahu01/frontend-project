import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Crosshair, Navigation, Volume2, Info } from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { useAudio } from '../context/AudioContext';

export const MapView = ({ 
  spots = [], 
  selectedSpot = null, 
  onSelectSpot,
  selectable = false,
  selectedLocation = null,
  onLocationSelect
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const proximityCircleRef = useRef(null);
  const clickMarkerRef = useRef(null);

  const [mapType, setMapType] = useState('streets'); // 'streets' or 'satellite'
  const tileLayerRef = useRef(null);

  const { userLocation, requestUserLocation } = useSpots();
  const { playSpot } = useAudio();

  // Street vs Satellite Tile URLs
  const streetTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around Jaipur
      const initialLat = selectedLocation?.lat || userLocation?.lat || 26.9240;
      const initialLng = selectedLocation?.lng || userLocation?.lng || 75.8230;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false // custom controls
      });

      tileLayerRef.current = L.tileLayer(streetTileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom zoom control in bottom right or top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Handle click on map for coordinate selection (Create page)
      if (selectable && onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mapType toggles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const url = mapType === 'satellite' ? satelliteTileUrl : streetTileUrl;
    const attribution = mapType === 'satellite' 
      ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      : '&copy; OpenStreetMap contributors';

    tileLayerRef.current.setUrl(url);
  }, [mapType]);

  // Update User Location Marker & Proximity Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation?.lat) return;

    const userLatLng = [userLocation.lat, userLocation.lng];

    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="user-pulse-marker">
            <div class="user-pulse-dot"></div>
            <div class="user-pulse-ring"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(userLatLng);
    }

    // Proximity trigger radius (500 meters)
    if (!proximityCircleRef.current) {
      proximityCircleRef.current = L.circle(userLatLng, {
        radius: 450,
        color: '#583BFF',
        fillColor: '#583BFF',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 6'
      }).addTo(map);
    } else {
      proximityCircleRef.current.setLatLng(userLatLng);
    }
  }, [userLocation]);

  // Render Spots Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    spots.forEach((spot) => {
      if (!spot.coordinates || spot.coordinates.length < 2) return;

      const isSelected = selectedSpot?.id === spot.id;
      
      const customIcon = L.divIcon({
        className: `custom-spot-marker ${isSelected ? 'is-selected' : ''}`,
        html: `
          <div class="spot-marker-pin ${isSelected ? 'active' : ''}">
            <div class="spot-marker-img-wrap">
              <img src="${spot.image}" alt="${spot.title}" />
            </div>
            <div class="spot-marker-badge">${spot.distance}</div>
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 50],
        popupAnchor: [0, -45]
      });

      const marker = L.marker(spot.coordinates, { icon: customIcon }).addTo(map);

      // Popup card content
      const popupHtml = `
        <div class="map-popup-card">
          <div class="popup-thumb-wrap">
            <img src="${spot.image}" alt="${spot.title}" class="popup-thumb" />
            <span class="popup-category">${spot.category}</span>
          </div>
          <div class="popup-body">
            <h4 class="popup-title">${spot.title}</h4>
            <div class="popup-meta">
              <span>📍 ${spot.location}</span>
              <span>• ${spot.distance}</span>
            </div>
            <p class="popup-desc">${spot.description.slice(0, 100)}...</p>
            <div class="popup-actions">
              <button class="popup-play-btn" id="play-spot-${spot.id}">
                ▶ Play Story
              </button>
              <a href="/stories/${spot.id}" class="popup-link">
                View →
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, minWidth: 260 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`play-spot-${spot.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            playSpot(spot);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectSpot) onSelectSpot(spot);
      });

      markersRef.current[spot.id] = marker;
    });
  }, [spots, selectedSpot]);

  // Handle selectedLocation in Create Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectable || !selectedLocation?.lat) return;

    const latLng = [parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lng)];

    if (!clickMarkerRef.current) {
      const pinIcon = L.divIcon({
        className: 'picker-pin-marker',
        html: `
          <div class="picker-pin-bounce">
            <div class="picker-dot"></div>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 40]
      });

      clickMarkerRef.current = L.marker(latLng, { icon: pinIcon }).addTo(map);
    } else {
      clickMarkerRef.current.setLatLng(latLng);
    }

    map.panTo(latLng);
  }, [selectedLocation, selectable]);

  // Center on user location
  const handleLocateMe = async () => {
    const loc = await requestUserLocation();
    if (mapInstanceRef.current && loc?.lat) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="map-view-wrapper">
      <div ref={mapContainerRef} className="leaflet-map-root" />

      {/* Floating Map Controls */}
      <div className="map-controls-panel">
        <div className="map-layer-toggle">
          <button
            type="button"
            className={`map-ctrl-btn ${mapType === 'streets' ? 'active' : ''}`}
            onClick={() => setMapType('streets')}
            title="Standard Streets Map"
          >
            Map
          </button>
          <button
            type="button"
            className={`map-ctrl-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
            title="Satellite Imagery"
          >
            Satellite
          </button>
        </div>

        <button
          type="button"
          className="map-locate-btn"
          onClick={handleLocateMe}
          title="Recenter on my location"
        >
          <Navigation size={18} />
        </button>
      </div>

      {selectable && (
        <div className="map-picker-banner">
          <Info size={16} />
          <span>Click anywhere on the map to set coordinates</span>
        </div>
      )}
    </div>
  );
};
