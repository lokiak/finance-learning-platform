import { Howl } from 'howler';

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

class SoundscapeService {
  private currentSound: Howl | null = null;
  private currentType: SoundscapeType | null = null;
  private volume: number = 50; // 0-100

  play(type: SoundscapeType, volume?: number): void {
    // Stop current sound if playing
    if (this.currentSound) {
      this.stop();
    }

    const track = SOUNDSCAPE_TRACKS[type];

    // Set volume if provided
    if (volume !== undefined) {
      this.volume = Math.max(0, Math.min(100, volume));
    }

    // Create new Howl instance
    this.currentSound = new Howl({
      src: [track.audioUrl],
      loop: true,
      volume: this.volume / 100,
      html5: true, // Enable streaming for large audio files
      onloaderror: (_id, error) => {
        console.error(`Failed to load soundscape: ${type}`, error);
      },
      onplayerror: (_id, error) => {
        console.error(`Failed to play soundscape: ${type}`, error);
      },
    });

    this.currentSound.play();
    this.currentType = type;
  }

  pause(): void {
    if (this.currentSound && this.currentSound.playing()) {
      this.currentSound.pause();
    }
  }

  resume(): void {
    if (this.currentSound && !this.currentSound.playing()) {
      this.currentSound.play();
    }
  }

  stop(): void {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.unload();
      this.currentSound = null;
      this.currentType = null;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.currentSound) {
      this.currentSound.volume(this.volume / 100);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getCurrentType(): SoundscapeType | null {
    return this.currentType;
  }

  isPlaying(): boolean {
    return this.currentSound?.playing() || false;
  }

  fadeIn(type: SoundscapeType, duration: number = 2000): void {
    this.play(type, 0);
    if (this.currentSound) {
      this.currentSound.fade(0, this.volume / 100, duration);
    }
  }

  fadeOut(duration: number = 2000, callback?: () => void): void {
    if (this.currentSound) {
      const targetVolume = this.volume / 100;
      this.currentSound.fade(targetVolume, 0, duration);

      setTimeout(() => {
        this.stop();
        if (callback) {
          callback();
        }
      }, duration);
    }
  }

  // Clean up all resources
  cleanup(): void {
    this.stop();
  }
}

// Export singleton instance
export const soundscapeService = new SoundscapeService();
