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
        // Only auto-redirect on 401 if NOT on initial auth check endpoints
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          // Don't auto-redirect for auth validation endpoints - let the auth store handle it
          if (!url.includes('/auth/me') && !url.includes('/auth/profile')) {
            localStorage.removeItem('auth_token');
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
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

  // Journal endpoints
  async getJournalEntries(params?: {
    entry_type?: string;
    limit?: number;
    offset?: number;
    mood?: number;
    stress_level?: number;
    tags?: string[];
    start_date?: string;
    end_date?: string;
    search?: string;
  }) {
    const response = await this.client.get('/journal', { params });
    return response.data;
  }

  async getJournalEntry(id: string) {
    const response = await this.client.get(`/journal/${id}`);
    return response.data;
  }

  async getJournalStats() {
    const response = await this.client.get('/journal/stats');
    return response.data;
  }

  async getJournalPrompts(params?: {
    category?: string;
    trigger_type?: string;
    limit?: number;
  }) {
    const response = await this.client.get('/journal/prompts', { params });
    return response.data;
  }

  async getTodaysPrompt() {
    const response = await this.client.get('/journal/prompts/today');
    return response.data;
  }

  async createJournalEntry(data: any) {
    const response = await this.client.post('/journal', data);
    return response.data;
  }

  async updateJournalEntry(id: string, data: any) {
    const response = await this.client.put(`/journal/${id}`, data);
    return response.data;
  }

  async deleteJournalEntry(id: string) {
    await this.client.delete(`/journal/${id}`);
  }

  // Mood endpoints
  async createMoodEntry(data: {
    overall_mood: number;
    financial_stress: number;
    journaled_today: boolean;
    completed_module: boolean;
    completed_goal?: boolean;
    meditation?: boolean;
    exercise?: boolean;
    notes?: string;
  }) {
    const response = await this.client.post('/mood', data);
    return response.data;
  }

  async getMoodHistory(params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  }) {
    const response = await this.client.get('/mood/history', { params });
    return response.data;
  }

  async getMoodInsights(params?: {
    start_date?: string;
    end_date?: string;
  }) {
    const response = await this.client.get('/mood/insights', { params });
    return response.data;
  }

  // Preferences endpoints
  async getPreferences() {
    const response = await this.client.get('/preferences');
    return response.data;
  }

  async updatePreferences(data: any) {
    const response = await this.client.put('/preferences', data);
    return response.data;
  }

  // Adaptive Learning endpoints
  async trackPerformance(data: {
    module_id: string;
    section_id?: string;
    concept_id?: string;
    time_spent_seconds: number;
    assessment_score?: number;
    error_count?: number;
    error_patterns?: string[];
    completion_status: 'completed' | 'abandoned' | 'in_progress';
    notes_taken?: boolean;
    content_reviewed?: number;
    interactive_engaged?: boolean;
  }) {
    const response = await this.client.post('/learning/performance', data);
    return response.data;
  }

  async getLearningStyle() {
    const response = await this.client.get('/learning/style');
    return response.data;
  }

  async getAdaptedContent(moduleId: string, sectionId: string) {
    const response = await this.client.get('/learning/adapt-content', {
      params: { module_id: moduleId, section_id: sectionId },
    });
    return response.data;
  }

  async getConceptMastery(conceptId: string) {
    const response = await this.client.get('/learning/mastery', {
      params: { concept_id: conceptId },
    });
    return response.data;
  }

  async getLearningPath(currentModule: string) {
    const response = await this.client.get('/learning/path', {
      params: { current_module: currentModule },
    });
    return response.data;
  }

  async getRemediationPath(conceptId: string) {
    const response = await this.client.get('/learning/remediation', {
      params: { concept_id: conceptId },
    });
    return response.data;
  }

  // Reflective Thinking endpoints
  async startReflection(data: { module_id: string; section_id?: string }) {
    const response = await this.client.post('/reflection/start', data);
    return response.data;
  }

  async updateReflectionStep(processId: string, stepNumber: number, data: any) {
    const response = await this.client.put(`/reflection/${processId}/step/${stepNumber}`, data);
    return response.data;
  }

  async generateHypotheses(processId: string, userHypotheses: string[]) {
    const response = await this.client.post(`/reflection/${processId}/hypotheses`, {
      user_hypotheses: userHypotheses,
    });
    return response.data;
  }

  async evaluateHypothesis(processId: string, hypothesisId: string, data: {
    feasibility_score: number;
    impact_score: number;
    sustainability_score: number;
    supporting_evidence?: string[];
    opposing_evidence?: string[];
    consequences_if_true?: string[];
    consequences_if_false?: string[];
  }) {
    const response = await this.client.post(
      `/reflection/${processId}/hypotheses/${hypothesisId}/evaluate`,
      data
    );
    return response.data;
  }

  async testHypothesis(processId: string, data: {
    selected_hypothesis_id: string;
    action_plan: string;
    calculator_used?: string;
    calculator_results?: any;
    real_world_applied: boolean;
    test_results?: any;
    reflection_on_results: string;
  }) {
    const response = await this.client.post(`/reflection/${processId}/test`, data);
    return response.data;
  }

  async getReflectionProcess(processId: string) {
    const response = await this.client.get(`/reflection/${processId}`);
    return response.data;
  }

  async assessHabitsOfMind(moduleId: string, data: any) {
    const response = await this.client.post('/reflection/habits-of-mind', {
      module_id: moduleId,
      ...data,
    });
    return response.data;
  }

  async submitLanguageActivity(data: {
    module_id: string;
    section_id?: string;
    activity_type: 'articulation' | 'hypothesis_writing' | 'reflection' | 'concept_mapping' | 'explanation';
    user_response: string;
    required_elements: {
      use_own_words: boolean;
      provide_examples: boolean;
      explain_reasoning: boolean;
      connect_to_experience: boolean;
    };
  }) {
    const response = await this.client.post('/reflection/language-activity', data);
    return response.data;
  }

  // Predictive Wellness endpoints
  async predictStress(moduleId?: string) {
    const response = await this.client.get('/wellness/predict-stress', {
      params: moduleId ? { module_id: moduleId } : {},
    });
    return response.data;
  }

  async getOptimalTime() {
    const response = await this.client.get('/wellness/optimal-time');
    return response.data;
  }

  async predictEngagement() {
    const response = await this.client.get('/wellness/predict-engagement');
    return response.data;
  }

  async getSuccessProbability(moduleId: string) {
    const response = await this.client.get('/wellness/success-probability', {
      params: { module_id: moduleId },
    });
    return response.data;
  }

  // Proactive Support endpoints
  async generateHint(data: {
    module_id: string;
    section_id?: string;
    condition: 'first_visit' | 'time_spent' | 'error_pattern' | 'hesitation';
    time_spent?: number;
    error_count?: number;
  }) {
    const response = await this.client.post('/support/hint', data);
    return response.data;
  }

  async triggerEncouragement(data: {
    moment_type: 'struggling' | 'progressing' | 'stuck' | 'breakthrough' | 'milestone';
    module_id?: string;
    progress_percentage?: number;
    recent_achievements?: string[];
  }) {
    const response = await this.client.post('/support/encouragement', data);
    return response.data;
  }

  async getBreakSuggestion() {
    const response = await this.client.get('/support/break-suggestion');
    return response.data;
  }

  async celebrateProgress(data: {
    achievement_type: 'section_complete' | 'module_complete' | 'phase_complete' | 'streak' | 'mastery';
    module_id?: string;
    module_title?: string;
    significance?: 'micro' | 'minor' | 'major' | 'milestone';
  }) {
    const response = await this.client.post('/support/celebrate', data);
    return response.data;
  }

  // Holistic Education endpoints
  async getEmotionalState(moduleId?: string) {
    const response = await this.client.get('/holistic/emotional-state', {
      params: moduleId ? { module_id: moduleId } : {},
    });
    return response.data;
  }

  async getBehavioralPatterns() {
    const response = await this.client.get('/holistic/behavioral-patterns');
    return response.data;
  }

  async getRealWorldApplication(moduleId: string) {
    const response = await this.client.get('/holistic/real-world-application', {
      params: { module_id: moduleId },
    });
    return response.data;
  }

  async getModuleConnections(moduleId: string) {
    const response = await this.client.get('/holistic/module-connections', {
      params: { module_id: moduleId },
    });
    return response.data;
  }

  // Admin endpoints
  async getAdminAnalytics() {
    const response = await this.client.get('/admin/analytics');
    return response.data;
  }

  async getAdminOverview() {
    const response = await this.client.get('/admin/analytics/overview');
    return response.data;
  }

  async getAdminPredictions() {
    const response = await this.client.get('/admin/analytics/predictions');
    return response.data;
  }

  async getAdminAdaptations() {
    const response = await this.client.get('/admin/analytics/adaptations');
    return response.data;
  }

  async getAdminSupport() {
    const response = await this.client.get('/admin/analytics/support');
    return response.data;
  }

  async getAdminEngagement() {
    const response = await this.client.get('/admin/analytics/engagement');
    return response.data;
  }

  async getAdminReflection() {
    const response = await this.client.get('/admin/analytics/reflection');
    return response.data;
  }

  async getAdminPerformance() {
    const response = await this.client.get('/admin/analytics/performance');
    return response.data;
  }
}

export const api = new ApiClient();
