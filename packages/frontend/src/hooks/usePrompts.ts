import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

// Temporary local definitions until shared package import is fixed
type PromptCategory = 'money_mindset' | 'goal_setting' | 'challenges' | 'gratitude' | 'future_vision' | 'reflection' | 'celebration';

interface JournalPrompt {
  id: string;
  prompt_text: string;
  category: PromptCategory;
  subcategory?: string | null;
  personalized_text?: string;
  trigger_reason?: string;
}

interface UsePromptsOptions {
  category?: PromptCategory | 'all';
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook for fetching and managing journal prompts
 */
export function usePrompts(options: UsePromptsOptions = {}) {
  const { category = 'all', limit = 10, enabled = true } = options;

  return useQuery({
    queryKey: ['prompts', category, limit],
    queryFn: async () => {
      const response = await api.getJournalPrompts({
        category: category === 'all' ? undefined : category,
        limit,
      });
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

/**
 * Hook for fetching today's personalized prompt
 */
export function useTodaysPrompt() {
  return useQuery({
    queryKey: ['prompts', 'today'],
    queryFn: async () => {
      // Try to get today's prompt first
      try {
        const response = await api.getTodaysPrompt();
        return response.prompt as JournalPrompt;
      } catch (_error) {
        // Fallback to random prompt if no "today's prompt" available
        const response = await api.getJournalPrompts({ limit: 1 });
        const prompts = response.prompts || [];
        return prompts[0] || null;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook for getting a random prompt
 */
export function useRandomPrompt() {
  return useMutation({
    mutationFn: async (options?: { category?: PromptCategory; exclude?: string[] }) => {
      // Get prompts with optional filtering
      const response = await api.getJournalPrompts({
        category: options?.category,
        limit: 20, // Get more to have variety
      });

      const prompts = response.prompts || [];

      // Filter out excluded prompts
      let availablePrompts = prompts;
      if (options?.exclude && options.exclude.length > 0) {
        availablePrompts = prompts.filter((p: JournalPrompt) => !options.exclude!.includes(p.id));
      }

      // Return random prompt
      if (availablePrompts.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * availablePrompts.length);
      return availablePrompts[randomIndex] as JournalPrompt;
    },
  });
}

/**
 * Hook for getting mood-based prompts
 * Returns prompts appropriate for the user's current emotional state
 */
export function useMoodBasedPrompts(mood: number | null) {
  return useQuery({
    queryKey: ['prompts', 'mood-based', mood],
    queryFn: async () => {
      if (mood === null) {
        // No mood data, return general prompts
        const response = await api.getJournalPrompts({ limit: 5 });
        return response.prompts || [];
      }

      // Mood-based category selection
      let category: PromptCategory;

      if (mood <= 2) {
        // Low mood: focus on challenges, gratitude, reflection
        const categories: PromptCategory[] = ['challenges', 'gratitude', 'reflection'];
        category = categories[Math.floor(Math.random() * categories.length)];
      } else if (mood >= 4) {
        // High mood: focus on goal setting, future vision, celebration
        const categories: PromptCategory[] = ['goal_setting', 'future_vision', 'celebration'];
        category = categories[Math.floor(Math.random() * categories.length)];
      } else {
        // Neutral mood: any category
        const categories: PromptCategory[] = ['money_mindset', 'reflection', 'goal_setting'];
        category = categories[Math.floor(Math.random() * categories.length)];
      }

      const response = await api.getJournalPrompts({ category, limit: 5 });
      return response.prompts || [];
    },
    enabled: mood !== null,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}

/**
 * Hook for getting module-related prompts
 * Used when a user completes a module
 */
export function useModulePrompts(moduleId?: string) {
  return useQuery({
    queryKey: ['prompts', 'module', moduleId],
    queryFn: async () => {
      // Get reflection-type prompts for module completion
      const response = await api.getJournalPrompts({
        category: 'reflection',
        limit: 3,
      });
      return response.prompts || [];
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Utility to get category color for UI styling
 */
export function getCategoryColor(category: PromptCategory): string {
  const colors: Record<PromptCategory, string> = {
    money_mindset: 'sage',
    goal_setting: 'sky',
    challenges: 'earth',
    gratitude: 'moss',
    future_vision: 'cream',
    reflection: 'sage',
    celebration: 'sky',
  };
  return colors[category] || 'sage';
}

/**
 * Utility to get category icon for UI
 */
export function getCategoryIcon(category: PromptCategory): string {
  const icons: Record<PromptCategory, string> = {
    money_mindset: '💭',
    goal_setting: '🎯',
    challenges: '💪',
    gratitude: '🙏',
    future_vision: '✨',
    reflection: '🪞',
    celebration: '🎉',
  };
  return icons[category] || '💭';
}

/**
 * Utility to get category display name
 */
export function getCategoryName(category: PromptCategory): string {
  const names: Record<PromptCategory, string> = {
    money_mindset: 'Money Mindset',
    goal_setting: 'Goal Setting',
    challenges: 'Challenges',
    gratitude: 'Gratitude',
    future_vision: 'Future Vision',
    reflection: 'Reflection',
    celebration: 'Celebration',
  };
  return names[category] || category;
}
