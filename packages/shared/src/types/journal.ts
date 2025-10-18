// Journal entry types and interfaces

export enum EntryType {
  FREE_FORM = 'free_form',
  MODULE_REFLECTION = 'module_reflection',
  GOAL = 'goal',
  DAILY_CHECKIN = 'daily_checkin',
  PROMPTED = 'prompted',
}

export enum PromptCategory {
  MONEY_MINDSET = 'money_mindset',
  GOAL_SETTING = 'goal_setting',
  CHALLENGES = 'challenges',
  GRATITUDE = 'gratitude',
  FUTURE_VISION = 'future_vision',
  REFLECTION = 'reflection',
  CELEBRATION = 'celebration',
}

export enum TriggerType {
  MODULE_COMPLETE = 'module_complete',
  GOAL_CREATED = 'goal_created',
  GOAL_MILESTONE = 'goal_milestone',
  MOOD_LOW = 'mood_low',
  STREAK = 'streak',
  TIME_BASED = 'time_based',
  RANDOM = 'random',
  ONBOARDING = 'onboarding',
}

// Rich text content structure (TipTap JSON format)
export interface RichTextContent {
  type: string;
  content?: RichTextContent[];
  attrs?: Record<string, any>;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
  text?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_type: EntryType;
  title: string | null;
  content: RichTextContent; // TipTap JSON structure
  mood: number | null; // 1-5 scale
  stress_level: number | null; // 1-10 scale
  energy_level: number | null; // 1-5 scale
  word_count: number;

  // Associations
  module_id: string | null;
  goal_id: string | null;
  prompt_id: string | null;

  // Metadata
  tags: string[];
  is_favorite: boolean;
  is_private: boolean;
  share_token: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface JournalEntryWithRelations extends JournalEntry {
  module?: {
    id: string;
    title: string;
  };
  goal?: {
    id: string;
    title: string;
    current_progress: number;
  };
  prompt?: {
    id: string;
    prompt_text: string;
    category: PromptCategory;
  };
}

export interface CreateJournalEntryRequest {
  entry_type: EntryType;
  title?: string;
  content: RichTextContent;
  mood?: number;
  stress_level?: number;
  energy_level?: number;
  word_count: number;
  tags?: string[];
  module_id?: string;
  goal_id?: string;
  prompt_id?: string;
  is_favorite?: boolean;
  is_private?: boolean;
}

export interface UpdateJournalEntryRequest {
  title?: string;
  content?: RichTextContent;
  mood?: number;
  stress_level?: number;
  energy_level?: number;
  word_count?: number;
  tags?: string[];
  is_favorite?: boolean;
  is_private?: boolean;
}

export interface JournalPrompt {
  id: string;
  prompt_text: string;
  category: PromptCategory;
  subcategory: string | null;
  trigger_type: TriggerType;
  trigger_config: Record<string, any> | null;
  uses_name: boolean;
  uses_goal_data: boolean;
  min_engagement: number | null;
  is_active: boolean;
  priority: number;
  created_at: string;
}

export interface PersonalizedPrompt extends JournalPrompt {
  personalized_text: string;
  trigger_reason?: string;
}

export interface JournalStreak {
  current_streak: number;
  longest_streak: number;
  total_entries: number;
  last_entry_date: string | null;
  streak_started: string | null;
}

export interface JournalStats {
  total_entries: number;
  word_count_total: number;
  current_streak: number;
  longest_streak: number;
  entries_by_type: Record<EntryType, number>;
  mood_average: number | null;
  entries_this_week: number;
  entries_this_month: number;
  favorite_tags: string[];
  most_active_day: string | null;
  most_active_time: string | null;
}

export interface JournalFilters {
  entry_type?: EntryType | 'all';
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest' | 'most_edited' | 'favorites';
  mood?: number;
  stress_level?: number;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  module_id?: string;
  goal_id?: string;
  search?: string;
}

export interface JournalEntriesResponse {
  entries: JournalEntryWithRelations[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface CreateJournalEntryResponse {
  entry: JournalEntry;
  streak: {
    current: number;
    longest: number;
  };
}
