import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SpotsProvider } from './context/SpotsContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { AudioDetails } from './pages/AudioDetails';
import { CreateAudio } from './pages/CreateAudio';
import { Dashboard } from './pages/Dashboard';

import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

// Layout wrapper to conditionally hide the standard footer on the full-height map page
const AppLayout = () => {
  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/explore');

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/stories/:id" element={<AudioDetails />} />
          <Route path="/create" element={<CreateAudio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isMapPage && <Footer />}
      <AudioPlayer />
    </div>
  );
};

export default function App() {
  return (
    <SpotsProvider>
      <AudioProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AudioProvider>
    </SpotsProvider>
  );
}
