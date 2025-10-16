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

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotificationContainer from '@/components/shared/NotificationContainer';

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

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationContainer />
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
