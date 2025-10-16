export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  profile_completed: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  age: number | null;
  current_income: number | null;
  financial_goals: string[];
  risk_tolerance: RiskTolerance | null;
  has_debt: boolean;
  has_emergency_fund: boolean;
  created_at: Date;
  updated_at: Date;
}

export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

export interface UserWithProfile extends User {
  profile: UserProfile | null;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  age?: number;
  current_income?: number;
  financial_goals?: string[];
  risk_tolerance?: RiskTolerance;
  has_debt?: boolean;
  has_emergency_fund?: boolean;
}
