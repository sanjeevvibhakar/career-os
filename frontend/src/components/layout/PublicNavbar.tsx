import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const PublicNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">SV</span>
              <span className="font-semibold hidden sm:block">Sanjeev Vibhakar</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-[var(--text-secondary)] hover:text-white transition-colors">Home</Link>
            <Link to="/projects" className="text-[var(--text-secondary)] hover:text-white transition-colors">Projects</Link>
            <Link to="/skills" className="text-[var(--text-secondary)] hover:text-white transition-colors">Skills</Link>
            <Link to="/experience" className="text-[var(--text-secondary)] hover:text-white transition-colors">Experience</Link>
            <Link to="/resume" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Resume</Link>
            <Link to="/contact" className="text-[var(--text-secondary)] hover:text-white transition-colors">Contact</Link>
            
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Dashboard
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[var(--bg-card)]">Home</Link>
            <Link to="/projects" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[var(--bg-card)]">Projects</Link>
            <Link to="/skills" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[var(--bg-card)]">Skills</Link>
            <Link to="/experience" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[var(--bg-card)]">Experience</Link>
            <Link to="/resume" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-[var(--bg-card)]">Resume (ATS Print/PDF)</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[var(--bg-card)]">Contact</Link>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="w-full text-left px-3 py-2 mt-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
