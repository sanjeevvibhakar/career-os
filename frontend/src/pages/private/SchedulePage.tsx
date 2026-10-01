import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useDailyStore } from '../../stores/dailyStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_COLORS = {
  work: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  study: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  gym: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  rest: 'bg-green-500/20 text-green-400 border-green-500/30',
  personal: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const SchedulePage: React.FC = () => {
  const dailyStore = useDailyStore();
  const [activeDay, setActiveDay] = useState('Monday');

  const blocks = dailyStore.getScheduleForDay(activeDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Career OS Schedule</h1>
      </div>

      <div className="flex overflow-x-auto border-b border-[var(--border)] pb-2 hide-scrollbar">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
              activeDay === day 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 relative">
          <div className="absolute left-16 top-0 bottom-0 w-px bg-[var(--border)] z-0"></div>
          {blocks.map((block, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-4 group cursor-pointer hover:-translate-y-0.5 transition-transform">
              <div className="w-16 pt-3 text-xs font-medium text-[var(--text-secondary)] text-right">
                {block.time.split('-')[0]}
              </div>
              <Card className={`flex-1 p-3 border-l-4 ${CATEGORY_COLORS[block.category]}`}>
                <div className="font-medium text-[var(--text-primary)]">{block.activity}</div>
                <div className="text-xs opacity-80 mt-1 uppercase tracking-wider">{block.category}</div>
              </Card>
            </div>
          ))}
        </div>

        <Card className="p-6 h-fit sticky top-6">
          <h3 className="font-bold text-lg mb-4">Category Legend</h3>
          <div className="space-y-3">
            {Object.entries(CATEGORY_COLORS).map(([cat, colorClass]) => (
              <div key={cat} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border ${colorClass}`}></div>
                <span className="capitalize text-sm font-medium">{cat}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)]">
              This schedule is designed for maximum efficiency while maintaining balance.
              Editing blocks is currently supported via settings.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
