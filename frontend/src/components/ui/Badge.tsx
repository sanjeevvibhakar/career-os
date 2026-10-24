import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '', ...props }) => {
  const variants = {
    default: 'bg-slate-200/70 text-slate-700 border-slate-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
