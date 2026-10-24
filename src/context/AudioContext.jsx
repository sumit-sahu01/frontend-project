import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [currentSpot, setCurrentSpot] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const audioRef = useRef(new Audio());
  const synthIntervalRef = useRef(null);

  // Play audio for a specific spot
  const playSpot = (spot) => {
    if (currentSpot?.id === spot.id) {
      togglePlay();
      return;
    }

    setCurrentSpot(spot);
    setCurrentTime(0);
    setDuration(spot.durationSeconds || 240);

    const audio = audioRef.current;
    audio.src = spot.audioUrl || '';
    audio.playbackRate = playbackSpeed;
    audio.volume = isMuted ? 0 : volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser blocks audio or file fails, run simulated playback timer
          setIsPlaying(true);
          simulatePlayback(spot.durationSeconds || 240);
        });
    }
  };

  const togglePlay = () => {
    if (!currentSpot) return;

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(true);
            simulatePlayback(duration);
          });
      }
    }
  };

  const pause = () => {
    audioRef.current.pause();
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    setIsPlaying(false);
  };

  const seek = (time) => {
    const clampedTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(clampedTime);
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = clampedTime;
    }
  };

  const skipForward = (seconds = 10) => {
    seek(currentTime + seconds);
  };

  const skipBackward = (seconds = 10) => {
    seek(currentTime - seconds);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const changeVolume = (newVol) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      audioRef.current.volume = 0;
    }
  };

  // Helper timer fallback
  const simulatePlayback = (maxDuration) => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    synthIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= maxDuration) {
          clearInterval(synthIntervalRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [playbackSpeed]);

  return (
    <AudioContext.Provider
      value={{
        currentSpot,
        isPlaying,
        currentTime,
        duration,
        playbackSpeed,
        volume,
        isMuted,
        playSpot,
        togglePlay,
        pause,
        seek,
        skipForward,
        skipBackward,
        setPlaybackSpeed: changeSpeed,
        setVolume: changeVolume,
        toggleMute
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
