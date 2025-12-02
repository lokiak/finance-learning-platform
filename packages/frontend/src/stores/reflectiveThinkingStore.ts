import { create } from 'zustand';
import {
  ReflectiveThinkingProcess,
  ReflectiveHypothesis,
  HabitsOfMind,
  LanguageActivity,
} from '@finance-platform/shared';
import { api } from '@/services/api';

interface ReflectiveThinkingState {
  currentProcess: ReflectiveThinkingProcess | null;
  hypotheses: ReflectiveHypothesis[];
  habitsOfMind: HabitsOfMind | null;
  languageActivities: LanguageActivity[];
  isLoading: boolean;
  error: string | null;

  // Actions
  startReflection: (moduleId: string, sectionId?: string) => Promise<void>;
  updateProblemDefinition: (processId: string, data: any) => Promise<void>;
  generateHypotheses: (processId: string, userHypotheses: string[]) => Promise<void>;
  evaluateHypothesis: (processId: string, hypothesisId: string, data: any) => Promise<void>;
  testHypothesis: (processId: string, data: any) => Promise<void>;
  getProcessStatus: (processId: string) => Promise<void>;
  assessHabitsOfMind: (moduleId: string, data: any) => Promise<void>;
  submitLanguageActivity: (data: any) => Promise<void>;
  clearError: () => void;
}

export const useReflectiveThinkingStore = create<ReflectiveThinkingState>((set) => ({
  currentProcess: null,
  hypotheses: [],
  habitsOfMind: null,
  languageActivities: [],
  isLoading: false,
  error: null,

  startReflection: async (moduleId: string, sectionId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.startReflection({ module_id: moduleId, section_id: sectionId });
      set({
        currentProcess: {
          id: response.process_id,
          user_id: '',
          module_id: moduleId,
          section_id: sectionId,
          problematic_situation: response.step_1.problematic_situation,
          current_step: response.current_step,
          completed: false,
          problem_definition_complete: false,
          user_hypotheses: [],
          real_world_applied: false,
          created_at: new Date(),
          updated_at: new Date(),
        } as ReflectiveThinkingProcess,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to start reflection';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateProblemDefinition: async (processId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateReflectionStep(processId, 2, data);
      set((state) => ({
        currentProcess: state.currentProcess
          ? {
              ...state.currentProcess,
              refined_problem: response.refined_problem,
              current_step: response.next_step,
              problem_definition_complete: true,
            }
          : null,
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update problem definition';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  generateHypotheses: async (processId: string, userHypotheses: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.generateHypotheses(processId, userHypotheses);
      set((state) => ({
        hypotheses: response.hypotheses,
        currentProcess: state.currentProcess
          ? {
              ...state.currentProcess,
              user_hypotheses: userHypotheses,
              current_step: 4,
            }
          : null,
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to generate hypotheses';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  evaluateHypothesis: async (processId: string, hypothesisId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await api.evaluateHypothesis(processId, hypothesisId, data);
      set((state) => ({
        hypotheses: state.hypotheses.map((h) =>
          h.id === hypothesisId ? { ...h, status: 'evaluated' as const } : h
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to evaluate hypothesis';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  testHypothesis: async (processId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.testHypothesis(processId, data);
      set((state) => ({
        currentProcess: state.currentProcess
          ? {
              ...state.currentProcess,
              completed: response.process_complete,
              current_step: 5,
              action_plan: data.action_plan,
              real_world_applied: data.real_world_applied,
              reflection_on_results: data.reflection_on_results,
            }
          : null,
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to test hypothesis';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getProcessStatus: async (processId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getReflectionProcess(processId);
      set({
        currentProcess: response as any,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get process status';
      set({ error: message, isLoading: false });
    }
  },

  assessHabitsOfMind: async (moduleId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.assessHabitsOfMind(moduleId, data);
      set({
        habitsOfMind: response as any,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to assess habits of mind';
      set({ error: message, isLoading: false });
    }
  },

  submitLanguageActivity: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.submitLanguageActivity(data);
      set((state) => ({
        languageActivities: [...state.languageActivities, response as any],
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to submit language activity';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

