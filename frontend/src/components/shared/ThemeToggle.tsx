import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('career-os-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('career-os-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light/dark mode"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 p-2.5 rounded-full glass-panel shadow-2xl border border-white/15 hover:border-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center bg-black/60 dark:bg-black/60 text-amber-300 dark:text-amber-400 group cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400 transition-transform group-hover:rotate-45" />
      ) : (
        <Moon size={18} className="text-indigo-600 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
};
