import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

// Layout
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
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

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

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
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
            />
          </Route>

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
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
