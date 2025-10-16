export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string | null;
  earned_at: Date;
  metadata: Record<string, any> | null;
}

export interface AchievementDefinition {
  type: string;
  title: string;
  description: string;
  criteria: (userId: string) => Promise<boolean>;
}

export interface AchievementResponse {
  achievements: Achievement[];
  available: AvailableAchievement[];
}

export interface AvailableAchievement {
  type: string;
  title: string;
  description: string;
  progress?: number;
  total?: number;
}
