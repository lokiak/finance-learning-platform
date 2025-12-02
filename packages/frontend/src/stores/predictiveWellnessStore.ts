import { create } from 'zustand';
import {
  StressPrediction,
  OptimalLearningTime,
  EngagementPrediction,
  SuccessProbability,
} from '@finance-platform/shared';
import { api } from '@/services/api';

interface PredictiveWellnessState {
  stressPrediction: StressPrediction | null;
  optimalTime: OptimalLearningTime | null;
  engagementPrediction: EngagementPrediction | null;
  successProbability: SuccessProbability | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  predictStress: (moduleId?: string) => Promise<void>;
  detectOptimalTime: () => Promise<void>;
  predictEngagement: () => Promise<void>;
  modelSuccess: (moduleId: string) => Promise<void>;
  clearError: () => void;
}

export const usePredictiveWellnessStore = create<PredictiveWellnessState>((set) => ({
  stressPrediction: null,
  optimalTime: null,
  engagementPrediction: null,
  successProbability: null,
  isLoading: false,
  error: null,

  predictStress: async (moduleId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const prediction = await api.predictStress(moduleId);
      set({ stressPrediction: prediction, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to predict stress';
      set({ error: message, isLoading: false });
    }
  },

  detectOptimalTime: async () => {
    set({ isLoading: true, error: null });
    try {
      const optimalTime = await api.getOptimalTime();
      set({ optimalTime, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to detect optimal time';
      set({ error: message, isLoading: false });
    }
  },

  predictEngagement: async () => {
    set({ isLoading: true, error: null });
    try {
      const prediction = await api.predictEngagement();
      set({ engagementPrediction: prediction, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to predict engagement';
      set({ error: message, isLoading: false });
    }
  },

  modelSuccess: async (moduleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const probability = await api.getSuccessProbability(moduleId);
      set({ successProbability: probability, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to model success probability';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

