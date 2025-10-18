export type SoundscapeType = 'rain' | 'forest' | 'ocean' | 'cafe' | 'fireplace' | 'whitenoise';

export interface SoundscapeTrack {
  id: SoundscapeType;
  name: string;
  description: string;
  icon: string;
  audioUrl: string; // URL to the audio file
  color: string; // For UI theming
}

export interface SoundscapeState {
  activeTrack: SoundscapeType | null;
  volume: number; // 0-100
  isPlaying: boolean;
}

export const SOUNDSCAPE_TRACKS: Record<SoundscapeType, SoundscapeTrack> = {
  rain: {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Calming rainfall with distant thunder',
    icon: '🌧️',
    audioUrl: '/audio/rain.mp3', // Placeholder
    color: 'sky',
  },
  forest: {
    id: 'forest',
    name: 'Forest Ambience',
    description: 'Birds chirping in a peaceful forest',
    icon: '🌲',
    audioUrl: '/audio/forest.mp3', // Placeholder
    color: 'moss',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Gentle waves lapping on the shore',
    icon: '🌊',
    audioUrl: '/audio/ocean.mp3', // Placeholder
    color: 'sky',
  },
  cafe: {
    id: 'cafe',
    name: 'Coffee Shop',
    description: 'Cozy café ambience with light chatter',
    icon: '☕',
    audioUrl: '/audio/cafe.mp3', // Placeholder
    color: 'earth',
  },
  fireplace: {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire with warm ambience',
    icon: '🔥',
    audioUrl: '/audio/fireplace.mp3', // Placeholder
    color: 'cream',
  },
  whitenoise: {
    id: 'whitenoise',
    name: 'White Noise',
    description: 'Smooth white noise for focus',
    icon: '〰️',
    audioUrl: '/audio/white-noise.mp3', // Placeholder
    color: 'sage',
  },
};
