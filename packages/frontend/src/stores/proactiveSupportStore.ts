import { create } from 'zustand';
import {
  ContextualHint,
  Encouragement,
  BreakSuggestion,
  ProgressCelebration,
} from '@finance-platform/shared';
import { api } from '@/services/api';

interface ProactiveSupportState {
  activeHints: ContextualHint[];
  recentEncouragements: Encouragement[];
  breakSuggestion: BreakSuggestion | null;
  recentCelebrations: ProgressCelebration[];
  isLoading: boolean;
  error: string | null;

  // Actions
  generateHint: (data: {
    module_id: string;
    section_id?: string;
    condition: 'first_visit' | 'time_spent' | 'error_pattern' | 'hesitation';
    time_spent?: number;
    error_count?: number;
  }) => Promise<ContextualHint>;
  triggerEncouragement: (data: {
    moment_type: 'struggling' | 'progressing' | 'stuck' | 'breakthrough' | 'milestone';
    module_id?: string;
    progress_percentage?: number;
    recent_achievements?: string[];
  }) => Promise<void>;
  suggestBreak: () => Promise<void>;
  celebrateProgress: (data: {
    achievement_type: 'section_complete' | 'module_complete' | 'phase_complete' | 'streak' | 'mastery';
    module_id?: string;
    module_title?: string;
    significance?: 'micro' | 'minor' | 'major' | 'milestone';
  }) => Promise<void>;
  clearError: () => void;
}

export const useProactiveSupportStore = create<ProactiveSupportState>((set) => ({
  activeHints: [],
  recentEncouragements: [],
  breakSuggestion: null,
  recentCelebrations: [],
  isLoading: false,
  error: null,

  generateHint: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.generateHint(data);
      const hint = response.hint;
      set((state) => ({
        activeHints: [...state.activeHints, hint],
        isLoading: false,
      }));
      return hint;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to generate hint';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  triggerEncouragement: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.triggerEncouragement(data);
      const encouragement = response.encouragement;
      set((state) => ({
        recentEncouragements: [encouragement, ...state.recentEncouragements].slice(0, 5),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to trigger encouragement';
      set({ error: message, isLoading: false });
    }
  },

  suggestBreak: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getBreakSuggestion();
      set({ breakSuggestion: response.suggestion, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get break suggestion';
      set({ error: message, isLoading: false });
    }
  },

  celebrateProgress: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.celebrateProgress(data);
      const celebration = response.celebration;
      set((state) => ({
        recentCelebrations: [celebration, ...state.recentCelebrations].slice(0, 5),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to celebrate progress';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

