import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UpdateProfileRequest,
  UserProfile,
  ModuleWithProgress,
  ModuleWithContent,
  UserProgress,
  ProgressSummary,
  CalculatorData,
  UserGoal,
  CreateGoalRequest,
  UpdateGoalRequest,
  Achievement,
  DashboardData,
} from '@finance-platform/shared';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  // User endpoints
  async getProfile(): Promise<{ profile: UserProfile }> {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ profile: UserProfile }> {
    const response = await this.client.put('/users/profile', data);
    return response.data;
  }

  async getDashboard(): Promise<DashboardData> {
    const response = await this.client.get('/users/dashboard');
    return response.data;
  }

  // Module endpoints
  async getModules(phase?: number): Promise<{ modules: ModuleWithProgress[] }> {
    const response = await this.client.get('/modules', {
      params: phase ? { phase } : {},
    });
    return response.data;
  }

  async getModule(moduleId: string): Promise<{ module: ModuleWithContent; progress: UserProgress | null }> {
    const response = await this.client.get(`/modules/${moduleId}`);
    return response.data;
  }

  // Progress endpoints
  async startModule(moduleId: string): Promise<{ progress: UserProgress }> {
    const response = await this.client.post(`/progress/module/${moduleId}/start`);
    return response.data;
  }

  async updateModuleProgress(
    moduleId: string,
    data: { progress_percentage?: number; time_spent_minutes?: number }
  ): Promise<{ progress: UserProgress }> {
    const response = await this.client.put(`/progress/module/${moduleId}`, data);
    return response.data;
  }

  async completeSection(sectionId: string, notes?: string) {
    const response = await this.client.post(`/progress/section/${sectionId}/complete`, {
      notes,
    });
    return response.data;
  }

  async getProgressSummary(): Promise<ProgressSummary> {
    const response = await this.client.get('/progress/summary');
    return response.data;
  }

  // Calculator endpoints
  async getCalculatorTypes() {
    const response = await this.client.get('/calculators');
    return response.data;
  }

  async saveCalculator(
    calculatorType: string,
    data: {
      calculator_name: string;
      input_data: Record<string, any>;
      module_id?: string;
    }
  ): Promise<{ calculator_data: CalculatorData; output_data: Record<string, any> }> {
    const response = await this.client.post(`/calculators/${calculatorType}`, data);
    return response.data;
  }

  async getSavedCalculators(calculatorType?: string): Promise<{ saved_calculators: CalculatorData[] }> {
    const response = await this.client.get('/calculators/saved', {
      params: calculatorType ? { calculator_type: calculatorType } : {},
    });
    return response.data;
  }

  async getCalculator(calculatorId: string): Promise<{ calculator_data: CalculatorData }> {
    const response = await this.client.get(`/calculators/${calculatorId}`);
    return response.data;
  }

  async updateCalculator(
    calculatorId: string,
    inputData: Record<string, any>
  ): Promise<{ calculator_data: CalculatorData; output_data: Record<string, any> }> {
    const response = await this.client.put(`/calculators/${calculatorId}`, {
      input_data: inputData,
    });
    return response.data;
  }

  async deleteCalculator(calculatorId: string): Promise<void> {
    await this.client.delete(`/calculators/${calculatorId}`);
  }

  // Goal endpoints
  async getGoals(): Promise<{ goals: UserGoal[] }> {
    const response = await this.client.get('/goals');
    return response.data;
  }

  async createGoal(data: CreateGoalRequest): Promise<{ goal: UserGoal }> {
    const response = await this.client.post('/goals', data);
    return response.data;
  }

  async updateGoal(goalId: string, data: UpdateGoalRequest): Promise<{ goal: UserGoal }> {
    const response = await this.client.put(`/goals/${goalId}`, data);
    return response.data;
  }

  async deleteGoal(goalId: string): Promise<void> {
    await this.client.delete(`/goals/${goalId}`);
  }

  // Achievement endpoints
  async getAchievements(): Promise<{ achievements: Achievement[]; available: any[] }> {
    const response = await this.client.get('/achievements');
    return response.data;
  }

  // AI endpoints
  async sendChatMessage(data: {
    message: string;
    conversation_id?: string;
    module_id?: string;
    context?: string;
  }): Promise<{ response: string; conversation_id: string }> {
    const response = await this.client.post('/ai/chat', data);
    return response.data;
  }

  async getConversations() {
    const response = await this.client.get('/ai/conversations');
    return response.data;
  }

  async getPromptTemplates(moduleId?: string) {
    const response = await this.client.get('/ai/prompt-templates', {
      params: moduleId ? { module_id: moduleId } : {},
    });
    return response.data;
  }
}

export const api = new ApiClient();
