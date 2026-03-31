import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GeneralObjectivesPage from './pages/GeneralObjectivesPage';
import DetailedObjectivesPage from './pages/DetailedObjectivesPage';
import CalendarPage from './pages/CalendarPage';
import ScenarioPage from './pages/ScenarioPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import AssessmentPage from './pages/AssessmentPage';
import MaterialsPage from './pages/MaterialsPage';
import TipsPage from './pages/TipsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminContentPage from './pages/admin/AdminContentPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (!isSupabaseConfigured()) return children; // No auth in offline mode

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl animate-pulse">أ</div>
          <p className="text-gray-500">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  // Show login page if Supabase is configured and user not authenticated
  if (isSupabaseConfigured() && !loading && !isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/objectives/general" element={<ProtectedRoute><GeneralObjectivesPage /></ProtectedRoute>} />
          <Route path="/objectives/detailed" element={<ProtectedRoute><DetailedObjectivesPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/scenario/:level/:week/:session" element={<ProtectedRoute><ScenarioPage /></ProtectedRoute>} />
          <Route path="/activities" element={<ProtectedRoute><ActivitiesPage /></ProtectedRoute>} />
          <Route path="/activities/:id" element={<ProtectedRoute><ActivityDetailPage /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
          <Route path="/materials" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
          <Route path="/tips" element={<ProtectedRoute><TipsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute adminOnly><AdminContentPage /></ProtectedRoute>} />
          <Route path="/admin/content/:section" element={<ProtectedRoute adminOnly><AdminContentPage /></ProtectedRoute>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </AppProvider>
  );
}
