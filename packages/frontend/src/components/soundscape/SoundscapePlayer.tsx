import React, { useState, useEffect } from 'react';
import { soundscapeService } from '@/services/soundscapeService';
import { motion, AnimatePresence } from 'framer-motion';

// Temporary local definitions until shared package import is fixed
type SoundscapeType = 'rain' | 'forest' | 'ocean' | 'cafe' | 'fireplace' | 'whitenoise';

const SOUNDSCAPE_TRACKS: Record<SoundscapeType, any> = {
  rain: {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Calming rainfall with distant thunder',
    icon: '🌧️',
    audioUrl: '/audio/rain.mp3',
    color: 'sky',
  },
  forest: {
    id: 'forest',
    name: 'Forest Ambience',
    description: 'Birds chirping in a peaceful forest',
    icon: '🌲',
    audioUrl: '/audio/forest.mp3',
    color: 'moss',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Gentle waves lapping on the shore',
    icon: '🌊',
    audioUrl: '/audio/ocean.mp3',
    color: 'sky',
  },
  cafe: {
    id: 'cafe',
    name: 'Coffee Shop',
    description: 'Cozy café ambience with light chatter',
    icon: '☕',
    audioUrl: '/audio/cafe.mp3',
    color: 'earth',
  },
  fireplace: {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire with warm ambience',
    icon: '🔥',
    audioUrl: '/audio/fireplace.mp3',
    color: 'cream',
  },
  whitenoise: {
    id: 'whitenoise',
    name: 'White Noise',
    description: 'Smooth white noise for focus',
    icon: '〰️',
    audioUrl: '/audio/white-noise.mp3',
    color: 'sage',
  },
};

interface SoundscapePlayerProps {
  className?: string;
  onSoundscapeChange?: (type: SoundscapeType | null, volume: number) => void;
}

const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({
  className = '',
  onSoundscapeChange,
}) => {
  const [activeTrack, setActiveTrack] = useState<SoundscapeType | null>(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      soundscapeService.cleanup();
    };
  }, []);

  const handleTrackSelect = (type: SoundscapeType) => {
    if (activeTrack === type) {
      // Toggle play/pause
      if (isPlaying) {
        soundscapeService.pause();
        setIsPlaying(false);
      } else {
        soundscapeService.resume();
        setIsPlaying(true);
      }
    } else {
      // Play new track
      soundscapeService.fadeIn(type, 1500);
      setActiveTrack(type);
      setIsPlaying(true);

      if (onSoundscapeChange) {
        onSoundscapeChange(type, volume);
      }
    }
  };

  const handleStop = () => {
    soundscapeService.fadeOut(1000, () => {
      setActiveTrack(null);
      setIsPlaying(false);

      if (onSoundscapeChange) {
        onSoundscapeChange(null, volume);
      }
    });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    soundscapeService.setVolume(newVolume);

    if (onSoundscapeChange && activeTrack) {
      onSoundscapeChange(activeTrack, newVolume);
    }
  };

  const getTrackColorClass = (type: SoundscapeType, isActive: boolean): string => {
    const track = SOUNDSCAPE_TRACKS[type];
    if (isActive) {
      return `bg-${track.color}-100 border-${track.color}-400 shadow-soft`;
    }
    return 'bg-white border-sage-200 hover:border-sage-300 hover:shadow-soft';
  };

  const tracks = Object.values(SOUNDSCAPE_TRACKS);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-earth-900">Ambient Soundscapes</h3>
          <p className="text-sm text-earth-600 mt-1">
            Choose a calming background sound to enhance focus
          </p>
        </div>

        {activeTrack && (
          <button
            type="button"
            onClick={handleStop}
            className="btn-ghost px-3 py-2 text-sm"
          >
            <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
            Stop
          </button>
        )}
      </div>

      {/* Soundscape Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tracks.map((track) => {
          const isActive = activeTrack === track.id;

          return (
            <motion.button
              key={track.id}
              type="button"
              onClick={() => handleTrackSelect(track.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-gentle border-2 transition-all duration-200
                ${getTrackColorClass(track.id, isActive)}
                focus:outline-none focus:ring-2 focus:ring-sage-300
              `}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">{track.icon}</div>
                <div>
                  <div className="font-semibold text-earth-900 text-sm">
                    {track.name}
                  </div>
                  <div className="text-xs text-earth-600 mt-1">
                    {track.description}
                  </div>
                </div>

                {/* Playing indicator */}
                {isActive && isPlaying && (
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <div className="w-2 h-2 bg-sage-600 rounded-full"></div>
                  </motion.div>
                )}

                {/* Paused indicator */}
                {isActive && !isPlaying && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-earth-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Volume Control */}
      <AnimatePresence>
        {activeTrack && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-peaceful p-4"
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
                className="flex-shrink-0 p-2 rounded-soft hover:bg-sage-50 transition-colors"
                aria-label={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? (
                  <svg className="w-5 h-5 text-earth-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 50 ? (
                  <svg className="w-5 h-5 text-earth-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-earth-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-2 appearance-none bg-sage-100 rounded-full cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #5a925a 0%, #5a925a ${volume}%, #f6f8f6 ${volume}%, #f6f8f6 100%)`,
                  }}
                  aria-label="Volume"
                />
              </div>

              <span className="text-sm font-medium text-earth-700 w-12 text-right">
                {volume}%
              </span>
            </div>

            <div className="mt-2 text-xs text-earth-600 text-center">
              Now playing: <span className="font-semibold">{SOUNDSCAPE_TRACKS[activeTrack].name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      {!activeTrack && (
        <div className="text-center text-sm text-earth-500">
          Select a soundscape to begin
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5a925a;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #5a925a;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        input[type='range']:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(90, 146, 90, 0.2);
        }

        input[type='range']:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(90, 146, 90, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SoundscapePlayer;
