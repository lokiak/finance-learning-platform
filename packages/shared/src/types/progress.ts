import { ProgressStatus } from './module';

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ProgressStatus;
  progress_percentage: number;
  started_at: Date | null;
  completed_at: Date | null;
  last_accessed: Date | null;
  time_spent_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface SectionProgress {
  id: string;
  user_id: string;
  module_content_id: string;
  completed: boolean;
  completed_at: Date | null;
  notes: string | null;
  created_at: Date;
}

export interface ProgressSummary {
  phases: PhaseProgress[];
  total_progress: number;
  time_invested: number;
  modules_completed: number;
  total_modules: number;
}

export interface PhaseProgress {
  phase_number: number;
  phase_title: string;
  modules_completed: number;
  total_modules: number;
  progress_percentage: number;
}

export interface UpdateProgressRequest {
  progress_percentage?: number;
  time_spent_minutes?: number;
}

export interface CompleteSectionRequest {
  notes?: string;
}

export interface DashboardData {
  overview: {
    total_progress: number;
    modules_completed: number;
    total_modules: number;
    time_invested: number;
    current_phase: number;
  };
  recent_activity: RecentActivity[];
  next_steps: NextStep[];
  achievements: AchievementSummary[];
}

export interface RecentActivity {
  type: 'module_started' | 'module_completed' | 'calculator_saved' | 'goal_created';
  title: string;
  timestamp: Date;
  module_id?: string;
}

export interface NextStep {
  type: 'continue_module' | 'start_module' | 'complete_calculator' | 'update_goal';
  title: string;
  description: string;
  module_id?: string;
  link: string;
}

export interface AchievementSummary {
  id: string;
  title: string;
  description: string;
  earned_at: Date;
}
