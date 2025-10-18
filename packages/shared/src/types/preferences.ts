// User preferences types

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
}

import { SoundscapeType } from './soundscape';

export enum ContentPacing {
  GENTLE = 'gentle',
  MEDIUM = 'medium',
  FAST = 'fast',
}

export enum ReminderFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface UserPreferences {
  id: string;
  user_id: string;

  // Theme
  theme: Theme;
  seasonal_theme: boolean;
  time_based_theme: boolean;
  preferred_season: Season | null;

  // Sound
  soundscape_enabled: boolean;
  soundscape_type: SoundscapeType | null;
  soundscape_volume: number; // 0-1
  sound_effects_enabled: boolean;

  // Notifications
  journal_reminders: boolean;
  reminder_time: string | null; // "HH:MM" format
  reminder_frequency: ReminderFrequency;

  // Content
  show_stress_exercises: boolean;
  content_pacing: ContentPacing;

  // Accessibility
  reduce_motion: boolean;
  high_contrast: boolean;
  font_size_adjust: number; // -2 to +2

  updated_at: string;
}

export interface UpdatePreferencesRequest {
  // Theme
  theme?: Theme;
  seasonal_theme?: boolean;
  time_based_theme?: boolean;
  preferred_season?: Season | null;

  // Sound
  soundscape_enabled?: boolean;
  soundscape_type?: SoundscapeType | null;
  soundscape_volume?: number;
  sound_effects_enabled?: boolean;

  // Notifications
  journal_reminders?: boolean;
  reminder_time?: string | null;
  reminder_frequency?: ReminderFrequency;

  // Content
  show_stress_exercises?: boolean;
  content_pacing?: ContentPacing;

  // Accessibility
  reduce_motion?: boolean;
  high_contrast?: boolean;
  font_size_adjust?: number;
}

export interface PreferencesResponse {
  preferences: UserPreferences;
}
