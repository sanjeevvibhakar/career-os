import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Brain, Code, BookOpen, Mic, Calendar, 
  Activity, BarChart, Edit, ExternalLink, LogOut, Menu, X, ChevronRight, Dumbbell, Sparkles
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

  // The 5 Core Daily Items
  const primaryNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'DSA Tracker', path: '/dsa', icon: <Brain size={18} /> },
    { name: 'Tech Syllabus', path: '/sprint', icon: <Code size={18} /> },
    { name: 'Speech Studio', path: '/communication', icon: <Mic size={18} /> },
    { name: 'Timetable', path: '/schedule', icon: <Calendar size={18} /> },
  ];

  // Habits & Review
  const secondaryNavItems = [
    { name: 'Pocket Flashcards', path: '/flashcards', icon: <Sparkles size={18} className="text-purple-400" /> },
    { name: 'Journal', path: '/journal', icon: <BookOpen size={18} /> },
    { name: 'Gym Tracker', path: '/gym', icon: <Dumbbell size={18} /> },
    { name: 'Weekly Review', path: '/review', icon: <BarChart size={18} /> },
  ];

  const bottomItems = [
    { name: 'Edit Portfolio', path: '/profile', icon: <Edit size={18} /> },
    { name: 'ATS Resume (PDF)', path: '/resume', icon: <ExternalLink size={18} /> },
    { name: 'Public Site', path: '/', icon: <ExternalLink size={18} /> },
  ];

  // Mobile Bottom 5-Button Bar (Core Daily Tools)
  const mobileQuickItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'DSA', path: '/dsa', icon: <Brain size={18} /> },
    { name: 'Tech', path: '/sprint', icon: <Code size={18} /> },
    { name: 'Speech', path: '/communication', icon: <Mic size={18} /> },
    { name: 'Timetable', path: '/schedule', icon: <Calendar size={18} /> },
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
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* MentorAI Assistant Banner */}
        <div className="px-1">
          <button
            onClick={() => { setAiCoachOpen(true); setSidebarOpen(false); }}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-purple-500/30 flex items-center justify-between text-left transition-all group shadow-sm"
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

        {/* Master System Navigation */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Master System
          </div>
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Habits & Review Section */}
        <div>
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Habits & Review
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2 rounded-xl font-medium transition-all text-xs ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm font-semibold' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-purple-400' : 'text-gray-400'}`}>{item.icon}</span>
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
            className="flex items-center px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static lg:block transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header */}
        <div className="lg:hidden h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#090b10]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-extrabold text-sm text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Career OS
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-3.5 md:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (5-Button Core Bar) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090b10]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-1 z-40">
          {mobileQuickItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        {/* Floating Theme Toggle (Bottom-Left) */}
        <ThemeToggle />

        {/* Global AI Coach Modal */}
        <AiCoachModal isOpen={aiCoachOpen} onClose={() => setAiCoachOpen(false)} />
      </div>
    </div>
  );
};
