import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';
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

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/objectives/general" element={<GeneralObjectivesPage />} />
          <Route path="/objectives/detailed" element={<DetailedObjectivesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/scenario/:level/:week/:session" element={<ScenarioPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/tips" element={<TipsPage />} />
        </Routes>
      </AppShell>
    </AppProvider>
  );
}
