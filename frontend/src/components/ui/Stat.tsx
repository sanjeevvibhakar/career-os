import React from 'react';
import { Card } from './Card';

interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string; isPositive: boolean };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export const Stat: React.FC<StatProps> = ({ label, value, icon, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    red: 'text-red-500 bg-red-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
  };

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        {icon && (
          <div className={`p-2 rounded-md ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
    </Card>
  );
};
