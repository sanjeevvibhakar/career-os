import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';

export const CommunicationPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'SPEAKING',
    topic: '',
    durationMinutes: 15,
    notes: '',
    rating: 3,
  });

  const handleSave = () => {
    dailyStore.saveCommunication(formData as any);
    dashboardStore.updateStreak('communication');
    setFormData({ ...formData, topic: '', notes: '', rating: 3, durationMinutes: 15 });
  };

  const recentLogs = dailyStore.getRecentCommunications(10);
  
  // Stats
  const thisWeekLogs = recentLogs; // rough approx for now
  const totalMins = thisWeekLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const avgRating = thisWeekLogs.length > 0 
    ? (thisWeekLogs.reduce((sum, log) => sum + log.rating, 0) / thisWeekLogs.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Communication Practice</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm text-[var(--text-secondary)]">Sessions Logged</div>
          <div className="text-2xl font-bold">{thisWeekLogs.length}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-[var(--text-secondary)]">Total Minutes</div>
          <div className="text-2xl font-bold">{totalMins}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-[var(--text-secondary)]">Avg Rating</div>
          <div className="text-2xl font-bold text-yellow-500">{avgRating} / 5</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Log Session</h2>
          <div className="space-y-4">
            <Select 
              label="Type" 
              options={[
                { label: 'Speaking', value: 'SPEAKING' },
                { label: 'Writing', value: 'WRITING' },
                { label: 'Technical Explanation', value: 'TECHNICAL_EXPLANATION' },
                { label: 'Workplace', value: 'WORKPLACE' },
              ]}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            />
            <Input label="Topic" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder="e.g. System Design Mock" />
            <Input type="number" label="Duration (minutes)" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})} />
            <Textarea label="Notes & Feedback" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} />
            <div>
              <label className="block text-sm mb-1 text-[var(--text-secondary)]">Self Rating</label>
              <ConfidenceStars value={formData.rating} onChange={v => setFormData({...formData, rating: v})} />
            </div>
            <Button className="w-full mt-4" onClick={handleSave}>Save Session</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent History</h2>
          {recentLogs.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-secondary)]">No sessions logged yet.</div>
          ) : (
            recentLogs.map(log => (
              <Card key={log.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">{log.type}</span>
                    <h3 className="font-medium text-lg mt-2">{log.topic || 'Untitled'}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{log.date}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{log.durationMinutes} mins</div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2 whitespace-pre-wrap">{log.notes}</p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-yellow-500 text-sm">{'★'.repeat(log.rating)}{'☆'.repeat(5-log.rating)}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
