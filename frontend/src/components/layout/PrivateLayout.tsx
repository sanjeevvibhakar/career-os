import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Map, Brain, Code, Building2, Dumbbell, Clock, 
  Menu, X, LogOut, ExternalLink, User
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { ThemeToggle } from '../shared/ThemeToggle';

export const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userName } = useAuthStore();

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

  // EXACTLY SEVEN MAIN DESTINATIONS
  const mainNavItems = [
    { 
      name: 'Home — What to Do Today', 
      shortName: 'Home', 
      path: '/dashboard', 
      icon: <Home size={18} />,
      aliases: ['/home', '/dashboard']
    },
    { 
      name: 'Career Roadmap', 
      shortName: 'Roadmap', 
      path: '/roadmap', 
      icon: <Map size={18} />,
      aliases: ['/roadmap', '/timeline']
    },
    { 
      name: 'DSA', 
      shortName: 'DSA', 
      path: '/dsa', 
      icon: <Brain size={18} />,
      aliases: ['/dsa']
    },
    { 
      name: 'Backend Engineering', 
      shortName: 'Backend', 
      path: '/backend', 
      icon: <Code size={18} />,
      aliases: ['/backend', '/sprint']
    },
    { 
      name: 'System Design', 
      shortName: 'System Design', 
      path: '/system-design', 
      icon: <Building2 size={18} />,
      aliases: ['/system-design']
    },
    { 
      name: 'Gym & Workout', 
      shortName: 'Gym', 
      path: '/gym', 
      icon: <Dumbbell size={18} />,
      aliases: ['/gym']
    },
    { 
      name: 'Timetable', 
      shortName: 'Timetable', 
      path: '/timetable', 
      icon: <Clock size={18} />,
      aliases: ['/timetable', '/schedule']
    },
  ];

  const bottomItems = [
    { name: 'Profile & Settings', path: '/profile', icon: <User size={16} /> },
    { name: 'Public Site', path: '/', icon: <ExternalLink size={16} /> },
  ];

  // Mobile Bottom Navigation Bar (Thumb ergonomic access)
  const mobileQuickItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={18} />, aliases: ['/dashboard', '/home'] },
    { name: 'Roadmap', path: '/roadmap', icon: <Map size={18} />, aliases: ['/roadmap', '/timeline'] },
    { name: 'DSA', path: '/dsa', icon: <Brain size={18} />, aliases: ['/dsa'] },
    { name: 'Backend', path: '/backend', icon: <Code size={18} />, aliases: ['/backend', '/sprint'] },
  ];

  const isItemActive = (item: { path: string; aliases?: string[] }) => {
    if (location.pathname === item.path) return true;
    if (item.aliases && item.aliases.some(a => location.pathname.startsWith(a))) return true;
    return false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] w-64 text-sm select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
        <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            Career OS
          </span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="lg:hidden text-gray-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
          aria-label="Close Navigation Drawer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main 7 Destinations Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          Core Destinations
        </div>

        <nav className="space-y-1" aria-label="Primary Career OS Navigation">
          {mainNavItems.map((item, index) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all text-xs min-h-[42px] ${
                  active 
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm font-semibold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={`mr-3 ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className="truncate flex-1">{item.name}</span>
                <span className="text-[10px] font-mono text-gray-600 ml-1">
                  0{index + 1}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-[var(--border)] space-y-1 bg-[var(--bg-secondary)]">
        <div className="px-3 py-1.5 text-xs text-gray-400 font-medium truncate">
          Logged in as <span className="text-gray-200">{userName || 'Sanjeev'}</span>
        </div>
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
          className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 min-h-[38px] cursor-pointer"
        >
          <span className="mr-3"><LogOut size={16} /></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
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
        <header className="lg:hidden h-14 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--bg-secondary)]/95 backdrop-blur-md z-30 shrink-0 transition-colors duration-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-extrabold text-sm text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Career OS
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Menu"
              aria-expanded={sidebarOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Thumb Ergonomics) */}
        <nav 
          aria-label="Mobile Navigation" 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-t border-[var(--border)] flex items-center justify-around px-2 z-40 transition-colors duration-200 shadow-lg"
        >
          {mobileQuickItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-label={item.name}
                aria-current={active ? 'page' : undefined}
                className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
                  active ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.name}</span>
              </Link>
            );
          })}
          {/* Menu Trigger for Gym, Timetable, System Design & Settings */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Navigation Drawer"
            aria-expanded={sidebarOpen}
            className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Menu size={18} />
            </div>
            <span className="mt-0.5">More</span>
          </button>
        </nav>

        {/* Floating Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
};
