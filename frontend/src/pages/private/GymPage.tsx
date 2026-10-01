import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';

export const GymPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();
  
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);
  const monthSessions = dailyStore.getGymByMonth(currentMonth);
  const hasWorkedOutToday = monthSessions.some(s => s.date === today);

  const [isLogging, setIsLogging] = useState(false);
  const [formData, setFormData] = useState({
    date: today,
    type: 'UPPER',
    completed: true,
    durationMinutes: 60,
    notes: '',
  });

  const handleSave = () => {
    dailyStore.saveGymSession(formData as any);
    dashboardStore.updateStreak('gym');
    setIsLogging(false);
  };

  const streak = dashboardStore.getStreaks().find(s => s.type === 'gym');

  // Simple calendar grid for the month
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayDate = `${currentMonth}-${String(i + 1).padStart(2, '0')}`;
    const session = monthSessions.find(s => s.date === dayDate);
    return { date: dayDate, session };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gym Log</h1>
        {streak && (
          <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full font-bold">
            🔥 {streak.currentCount} Day Streak
          </div>
        )}
      </div>

      {!hasWorkedOutToday && !isLogging && (
        <Card className="p-8 text-center flex flex-col items-center border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <h2 className="text-2xl font-bold mb-6">Did you work out today?</h2>
          <Button size="lg" className="w-full max-w-sm text-lg py-6 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setIsLogging(true)}>
            Yes, Log Session
          </Button>
        </Card>
      )}

      {isLogging && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Log Today's Session</h2>
          <div className="space-y-4 max-w-lg">
            <Select 
              label="Workout Type" 
              options={[
                { label: 'Upper Body', value: 'UPPER' },
                { label: 'Lower Body', value: 'LOWER' },
                { label: 'Cardio', value: 'CARDIO' },
                { label: 'Sport', value: 'SPORT' },
                { label: 'Rest Day', value: 'REST' },
              ]}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            />
            <Input type="number" label="Duration (minutes)" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})} />
            <Textarea label="Notes (Exercises, weights, feelings)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setIsLogging(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Session</Button>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">This Month</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-sm font-medium text-[var(--text-secondary)] py-2">{d}</div>
          ))}
          {/* Pad the start of month */}
          {Array.from({ length: new Date(currentMonth + '-01').getDay() }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          
          {days.map(day => (
            <div 
              key={day.date} 
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 border 
                ${day.date === today ? 'border-orange-500' : 'border-[var(--border)]'}
                ${day.session ? 'bg-orange-500/10' : 'bg-[var(--bg-secondary)]'}
              `}
            >
              <span className="text-sm">{parseInt(day.date.split('-')[2])}</span>
              {day.session && (
                <span className="text-xs text-orange-500 font-bold mt-1">{day.session.type.substring(0, 3)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
