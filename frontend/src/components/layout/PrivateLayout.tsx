import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Brain, Code, BookOpen, Mic, Calendar, 
  Activity, BarChart, Edit, ExternalLink, LogOut, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'DSA Tracker', path: '/dsa', icon: <Brain size={20} /> },
    { name: 'Tech Sprint', path: '/sprint', icon: <Code size={20} /> },
    { name: 'Journal', path: '/journal', icon: <BookOpen size={20} /> },
    { name: 'Communication', path: '/communication', icon: <Mic size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Gym', path: '/gym', icon: <Activity size={20} /> },
    { name: 'Weekly Review', path: '/review', icon: <BarChart size={20} /> },
  ];

  const bottomItems = [
    { name: 'Edit Portfolio', path: '/profile', icon: <Edit size={20} /> },
    { name: 'Back to Site', path: '/', icon: <ExternalLink size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] w-64 text-sm">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <span className="font-bold text-lg text-white">Career OS</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-500' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-[var(--border)]">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="mr-3"><LogOut size={20} /></span>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static lg:block transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden h-14 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--bg-secondary)]">
          <span className="font-bold text-white">Career OS</span>
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--text-secondary)]">
            <Menu size={24} />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
