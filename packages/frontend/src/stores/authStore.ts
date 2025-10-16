import { create } from 'zustand';
import { User, UserProfile } from '@finance-platform/shared';
import { api } from '@/services/api';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
      // Load profile after login
      const profileData = await api.getProfile();
      set({ profile: profileData.profile });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register({ email, password, name });
      localStorage.setItem('auth_token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
      // Load profile after registration
      const profileData = await api.getProfile();
      set({ profile: profileData.profile });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      set({
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const userData = await api.getCurrentUser();
      const profileData = await api.getProfile();
      set({
        user: userData.user,
        profile: profileData.profile,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('auth_token');
      set({
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
