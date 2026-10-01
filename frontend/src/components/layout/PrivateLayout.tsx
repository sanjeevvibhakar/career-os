import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Brain, Code, BookOpen, Mic, Calendar, 
  Activity, BarChart, Edit, ExternalLink, LogOut, Menu, X, MoreHorizontal
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

  // Mobile Bottom Quick Bar Items
  const mobileQuickItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'DSA', path: '/dsa', icon: <Brain size={20} /> },
    { name: 'Journal', path: '/journal', icon: <BookOpen size={20} /> },
    { name: 'Gym', path: '/gym', icon: <Activity size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-[var(--border)] w-64 text-sm select-none">
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
        <span className="font-extrabold text-lg text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Career OS
        </span>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
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
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3.5 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
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
        <div className="lg:hidden h-14 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[#0d1117]">
          <span className="font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Career OS
          </span>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Phone First) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090b10]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-40">
          {mobileQuickItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-blue-500/20' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 text-gray-400 hover:text-gray-200 text-[10px] font-medium"
          >
            <div className="p-1">
              <MoreHorizontal size={20} />
            </div>
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
