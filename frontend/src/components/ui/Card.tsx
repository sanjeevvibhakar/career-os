import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden ${hover ? 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
