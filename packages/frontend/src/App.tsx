import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useAuthStore } from '@/stores/authStore';

// Layout
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Welcome from '@/pages/Welcome';
import Dashboard from '@/pages/Dashboard';
import Modules from '@/pages/Modules';
import ModuleView from '@/pages/ModuleView';
import Calculators from '@/pages/Calculators';
import Goals from '@/pages/Goals';
import Profile from '@/pages/Profile';
import Journal from '@/pages/Journal';
import JournalNew from '@/pages/JournalNew';
import JournalPrompts from '@/pages/JournalPrompts';
import Mood from '@/pages/Mood';
import AdminDashboard from '@/pages/AdminDashboard';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import NotificationContainer from '@/components/shared/NotificationContainer';
import ToastContainer from '@/components/shared/Toast';
import { useToastStore } from '@/stores/toastStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Default redirect component that uses hooks directly
function DefaultRedirect() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Debug logging
  useEffect(() => {
    console.log('DefaultRedirect - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  }, [isLoading, isAuthenticated]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="breathing-circle mx-auto mb-4"></div>
          <p className="text-earth-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('DefaultRedirect - Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has seen welcome page
  const hasSeenWelcome = localStorage.getItem('has_seen_welcome') === 'true';
  console.log('DefaultRedirect - hasSeenWelcome:', hasSeenWelcome);

  if (hasSeenWelcome) {
    console.log('DefaultRedirect - Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('DefaultRedirect - Redirecting to /welcome');
  return <Navigate to="/welcome" replace />;
}

// Auth route redirect component
function AuthRedirect({ children }: { children: ReactElement }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="breathing-circle mx-auto mb-4"></div>
          <p className="text-earth-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const hasSeenWelcome = localStorage.getItem('has_seen_welcome') === 'true';
    return <Navigate to={hasSeenWelcome ? '/dashboard' : '/welcome'} replace />;
  }

  return children;
}

function App() {
  const { loadUser, isLoading } = useAuthStore();
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    loadUser().catch((error) => {
      console.error('Failed to load user:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Debug logging
  useEffect(() => {
    console.log('App render - isLoading:', isLoading);
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationContainer />
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              }
            />
          </Route>

          {/* Welcome page - no layout, full screen */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/modules/:moduleId" element={<ModuleView />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/new" element={<JournalNew />} />
            <Route path="/journal/prompts" element={<JournalPrompts />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<DefaultRedirect />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
