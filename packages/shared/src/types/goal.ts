export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description: string | null;
  target_amount: number | null;
  target_date: Date | null;
  current_progress: number;
  status: GoalStatus;
  created_at: Date;
  updated_at: Date;
}

export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface CreateGoalRequest {
  goal_type: string;
  title: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
  current_progress?: number;
  status?: GoalStatus;
}
