import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { PrivateLayout } from './components/layout/PrivateLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { SkillsPage } from './pages/public/SkillsPage';
import { ExperiencePage } from './pages/public/ExperiencePage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { ResumePage } from './pages/public/ResumePage';

// Private Pages
import { DashboardPage } from './pages/private/DashboardPage';
import { DSATrackerPage } from './pages/private/DSATrackerPage';
import { TechSprintPage } from './pages/private/TechSprintPage';
import { JournalPage } from './pages/private/JournalPage';
import { CommunicationPage } from './pages/private/CommunicationPage';
import { SchedulePage } from './pages/private/SchedulePage';
import { GymPage } from './pages/private/GymPage';
import { WeeklyReviewPage } from './pages/private/WeeklyReviewPage';
import { ProfileEditPage } from './pages/private/ProfileEditPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* ATS Resume View */}
        <Route path="/resume" element={<ResumePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dsa" element={<DSATrackerPage />} />
          <Route path="/sprint" element={<TechSprintPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/gym" element={<GymPage />} />
          <Route path="/review" element={<WeeklyReviewPage />} />
          <Route path="/profile" element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
