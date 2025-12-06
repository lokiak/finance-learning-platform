import { create } from 'zustand';
import {
  LearningStyle,
  AdaptedContent,
  LearningPath,
  RemediationPath,
} from '@finance-platform/shared';
import { api } from '@/services/api';

interface AdaptiveLearningState {
  learningStyle: LearningStyle | null;
  currentPath: LearningPath | null;
  masteryLevels: Record<string, number>;
  performanceHistory: any[];
  isLoading: boolean;
  error: string | null;

  // Actions
  detectLearningStyle: () => Promise<void>;
  adaptContent: (moduleId: string, sectionId: string) => Promise<AdaptedContent>;
  trackPerformance: (metrics: any) => Promise<void>;
  calculateMastery: (conceptId: string) => Promise<number>;
  getLearningPath: (currentModule: string) => Promise<void>;
  getRemediationPath: (conceptId: string) => Promise<RemediationPath>;
  clearError: () => void;
}

export const useAdaptiveLearningStore = create<AdaptiveLearningState>((set) => ({
  learningStyle: null,
  currentPath: null,
  masteryLevels: {},
  performanceHistory: [],
  isLoading: false,
  error: null,

  detectLearningStyle: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getLearningStyle();
      set({ learningStyle: response.learning_style, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to detect learning style';
      set({ error: message, isLoading: false });
    }
  },

  adaptContent: async (moduleId: string, sectionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getAdaptedContent(moduleId, sectionId);
      set({ isLoading: false });
      return response.adapted_content;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to adapt content';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  trackPerformance: async (metrics: any) => {
    try {
      await api.trackPerformance(metrics);
      // Update local state if needed
      set((state) => ({
        performanceHistory: [...state.performanceHistory, metrics],
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to track performance';
      set({ error: message });
    }
  },

  calculateMastery: async (conceptId: string) => {
    try {
      const response = await api.getConceptMastery(conceptId);
      const masteryLevel = response.mastery_level;
      set((state) => ({
        masteryLevels: {
          ...state.masteryLevels,
          [conceptId]: masteryLevel,
        },
      }));
      return masteryLevel;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to calculate mastery';
      set({ error: message });
      throw error;
    }
  },

  getLearningPath: async (currentModule: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getLearningPath(currentModule);
      set({ currentPath: response, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get learning path';
      set({ error: message, isLoading: false });
    }
  },

  getRemediationPath: async (conceptId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getRemediationPath(conceptId);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get remediation path';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

