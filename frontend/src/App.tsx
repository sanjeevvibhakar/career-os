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

// The 7 Main Private Pages
import { DashboardPage } from './pages/private/DashboardPage';
import { CareerTimelinePage } from './pages/private/CareerTimelinePage';
import { DSATrackerPage } from './pages/private/DSATrackerPage';
import { BackendEngineeringPage } from './pages/private/BackendEngineeringPage';
import { SystemDesignPage } from './pages/private/SystemDesignPage';
import { GymPage } from './pages/private/GymPage';
import { SchedulePage } from './pages/private/SchedulePage';

// Secondary / Deferred Pages (preserved for user data safety)
import { JournalPage } from './pages/private/JournalPage';
import { CommunicationPage } from './pages/private/CommunicationPage';
import { WeeklyReviewPage } from './pages/private/WeeklyReviewPage';
import { ProfileEditPage } from './pages/private/ProfileEditPage';
import { FlashcardsPage } from './pages/private/FlashcardsPage';
import { CareerSkillTreePage } from './pages/private/CareerSkillTreePage';
import { ProjectMilestonesPage } from './pages/private/ProjectMilestonesPage';
import { JobPipelinePage } from './pages/private/JobPipelinePage';
import { InterviewReadinessPage } from './pages/private/InterviewReadinessPage';

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

        {/* Private Routes: Strictly Seven Main Destinations + Backward-Compatible Aliases */}
        <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
          {/* 1. Home — What to Do Today */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />

          {/* 2. Career Roadmap */}
          <Route path="/roadmap" element={<CareerTimelinePage />} />
          <Route path="/timeline" element={<Navigate to="/roadmap" replace />} />

          {/* 3. DSA */}
          <Route path="/dsa" element={<DSATrackerPage />} />

          {/* 4. Backend Engineering */}
          <Route path="/backend" element={<BackendEngineeringPage />} />
          <Route path="/sprint" element={<Navigate to="/backend" replace />} />

          {/* 5. System Design */}
          <Route path="/system-design" element={<SystemDesignPage />} />

          {/* 6. Gym & Workout */}
          <Route path="/gym" element={<GymPage />} />

          {/* 7. Timetable */}
          <Route path="/timetable" element={<SchedulePage />} />
          <Route path="/schedule" element={<Navigate to="/timetable" replace />} />

          {/* Sub-features preserved for complete data safety */}
          <Route path="/skills-tree" element={<CareerSkillTreePage />} />
          <Route path="/project-tracker" element={<ProjectMilestonesPage />} />
          <Route path="/job-pipeline" element={<JobPipelinePage />} />
          <Route path="/interview-readiness" element={<InterviewReadinessPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/review" element={<WeeklyReviewPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/profile" element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
