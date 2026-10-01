import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  count: number;
  label: string;
  bestCount?: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ count, label, bestCount }) => {
  const isActive = count > 0;
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isActive ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 'bg-gray-800/50 border-gray-700 text-gray-500'}`}>
      <Flame size={14} className={isActive ? 'animate-pulse' : ''} />
      <span className="font-bold text-sm">{count}</span>
      <span className="text-xs opacity-80">{label}</span>
      {bestCount !== undefined && (
        <span className="text-[10px] ml-1 opacity-60">(Best: {bestCount})</span>
      )}
    </div>
  );
};
