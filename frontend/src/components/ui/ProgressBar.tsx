import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  color = 'bg-blue-500', 
  label, 
  showPercentage = false 
}) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full flex flex-col gap-1">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)] mb-1">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};
