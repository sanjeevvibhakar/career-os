import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Brain, Code, BookOpen, Mic, Calendar, 
  BarChart, Edit, ExternalLink, LogOut, Menu, X, ChevronRight, Dumbbell, Sparkles, Building2,
  Layers, FolderGit2, Briefcase, Award
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { ThemeToggle } from '../shared/ThemeToggle';
import { AiCoachModal } from '../shared/AiCoachModal';

export const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile drawer when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Section 1: Core Navigation
  const coreNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Career Timeline (Oct-Jun)', path: '/timeline', icon: <Calendar size={18} /> },
  ];

  // Section 2: Study Topics & Practice (Dedicated pages)
  const studyNavItems = [
    { name: 'DSA Practice Sheet', path: '/dsa', icon: <Brain size={18} /> },
    { name: 'Backend Syllabus & Topics', path: '/sprint', icon: <Code size={18} /> },
    { name: 'System Design Studio', path: '/system-design', icon: <Building2 size={18} /> },
    { name: 'Speech Studio', path: '/communication', icon: <Mic size={18} /> },
    { name: 'Pocket Flashcards', path: '/flashcards', icon: <Sparkles size={18} className="text-purple-400" /> },
  ];

  // Section 3: Job Search, Mocks & Evidence (Dedicated pages)
  const careerNavItems = [
    { name: 'Interview Readiness', path: '/interview-readiness', icon: <Award size={18} /> },
    { name: 'Target Job Pipeline', path: '/job-pipeline', icon: <Briefcase size={18} /> },
    { name: 'Skills & Evidence Vault', path: '/skills-tree', icon: <Layers size={18} /> },
    { name: 'Flagship Backend Project', path: '/project-tracker', icon: <FolderGit2 size={18} /> },
  ];

  // Section 4: Routine & Habits
  const routineNavItems = [
    { name: 'Daily Timetable', path: '/schedule', icon: <Calendar size={18} /> },
    { name: 'Weekly Review', path: '/review', icon: <BarChart size={18} /> },
    { name: 'Gym Tracker', path: '/gym', icon: <Dumbbell size={18} /> },
    { name: 'Reflections Journal', path: '/journal', icon: <BookOpen size={18} /> },
  ];

  const bottomItems = [
    { name: 'Edit Portfolio', path: '/profile', icon: <Edit size={18} /> },
    { name: 'ATS Resume (PDF)', path: '/resume', icon: <ExternalLink size={18} /> },
    { name: 'Public Site', path: '/', icon: <ExternalLink size={18} /> },
  ];

  // Mobile Bottom Navigation Bar (5 thumb-accessible core tools)
  const mobileQuickItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Timeline', path: '/timeline', icon: <Calendar size={18} /> },
    { name: 'DSA', path: '/dsa', icon: <Brain size={18} /> },
    { name: 'Topics', path: '/sprint', icon: <Code size={18} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#090b10] border-r border-white/10 w-64 text-sm select-none">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-extrabold text-lg text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Career OS
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="lg:hidden text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5"
          aria-label="Close Navigation Drawer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        
        {/* MentorAI Assistant Banner */}
        <div className="px-1">
          <button
            onClick={() => { setAiCoachOpen(true); setSidebarOpen(false); }}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-purple-500/30 flex items-center justify-between text-left transition-all group shadow-sm min-h-[44px]"
            aria-label="Open MentorAI Coach"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles size={14} className="text-amber-300" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>MentorAI</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/30 text-purple-200">Coach</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  DSA & System Design
                </div>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Section 1: Core Navigation */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Overview
          </div>
          <nav className="space-y-1" aria-label="Core Navigation">
            {coreNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs min-h-[40px] ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Study Topics & Practice */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Study Topics & Practice
          </div>
          <nav className="space-y-1" aria-label="Study Topics Navigation">
            {studyNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs min-h-[40px] ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={`mr-3 ${isActive ? 'text-purple-400' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Job Search, Mocks & Evidence */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Job Search & Readiness
          </div>
          <nav className="space-y-1" aria-label="Job Search Navigation">
            {careerNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs min-h-[40px] ${
                    isActive 
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={`mr-3 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 4: Routine & Habits */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Routine & Review
          </div>
          <nav className="space-y-1" aria-label="Routine Navigation">
            {routineNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs min-h-[40px] ${
                    isActive 
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={`mr-3 ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-colors min-h-[38px]"
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 min-h-[38px]"
        >
          <span className="mr-3"><LogOut size={16} /></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#07090e]">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static lg:block transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#090b10] z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-extrabold text-sm text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Career OS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiCoachOpen(true)}
              className="p-2 rounded-lg text-amber-300 hover:bg-white/5 flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Open AI Coach"
              title="MentorAI Coach"
            >
              <Sparkles size={18} />
            </button>
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open Navigation Menu"
              aria-expanded={sidebarOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 pb-28 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (5-Button Thumb Ergonomics Bar) */}
        <nav 
          aria-label="Mobile Navigation" 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090b10]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-40"
        >
          {mobileQuickItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
                  isActive ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.name}</span>
              </Link>
            );
          })}
          {/* Thumb-Accessible Menu Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Full Navigation Menu"
            aria-expanded={sidebarOpen}
            className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Menu size={18} />
            </div>
            <span className="mt-0.5">Menu</span>
          </button>
        </nav>

        {/* Floating Theme Toggle */}
        <ThemeToggle />

        {/* Global AI Coach Modal */}
        <AiCoachModal isOpen={aiCoachOpen} onClose={() => setAiCoachOpen(false)} />
      </div>
    </div>
  );
};
