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

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('auth_token');
  return {
    user: null,
    profile: null,
    token,
    // Assume authenticated if token exists - will be verified by loadUser()
    // This prevents logout on refresh before loadUser() completes
    isAuthenticated: !!token,
    isLoading: !!token, // Start as loading if we have a token to verify
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
      set({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        token: null,
      });
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
    } catch (error: any) {
      // Only clear token if it's actually invalid (401/403), not for network errors
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      if (isAuthError) {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          profile: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        // For network errors, keep the token and assume still authenticated
        // This prevents logout on temporary network issues
        console.error('Failed to load user:', error);
        set({
          isLoading: false,
          isAuthenticated: true, // Keep authenticated state if token exists
          error: 'Failed to load user. Please refresh the page.',
        });
      }
    }
  },

  clearError: () => set({ error: null }),
  };
});
