import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-[var(--text-secondary)] text-sm mb-4 md:mb-0">
          Built with React + Spring Boot
        </div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">GitHub</a>
          <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">LinkedIn</a>
        </div>
        <div className="text-[var(--text-secondary)] text-sm">
          © 2026 Sanjeev Vibhakar
        </div>
      </div>
    </footer>
  );
};
