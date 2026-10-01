import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDailyStore } from '../../stores/dailyStore';

export const WeeklyReviewPage: React.FC = () => {
  const dashboardStore = useDashboardStore();
  const dsaStore = useDsaStore();
  const sprintStore = useSprintStore();
  const dailyStore = useDailyStore();

  const getMonday = (d: Date) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6: 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  const weekStartDate = getMonday(new Date());
  const existingReview = dashboardStore.getReviewByWeek(weekStartDate);

  // Auto-calculated approx stats for this week
  const logs = sprintStore.logs.filter(l => l.date >= weekStartDate);
  const techHours = logs.reduce((sum, l) => sum + l.actualMinutes, 0) / 60;
  
  const dsaAttempts = dsaStore.attempts.filter(a => a.attemptedAt.startsWith(weekStartDate));
  const dsaSolved = new Set(dsaAttempts.map(a => a.problemId)).size;
  
  const gymSessions = dailyStore.gymSessions.filter(s => s.date >= weekStartDate).length;

  const [formData, setFormData] = useState({
    weekStartDate,
    dsaProblemsSolved: existingReview?.dsaProblemsSolved ?? dsaSolved,
    dsaAccuracy: existingReview?.dsaAccuracy ?? 80,
    techHours: existingReview?.techHours ?? techHours,
    projectHours: existingReview?.projectHours ?? 0,
    gymSessions: existingReview?.gymSessions ?? gymSessions,
    sleepAvg: existingReview?.sleepAvg ?? 7.5,
    biggestWin: existingReview?.biggestWin ?? '',
    biggestStruggle: existingReview?.biggestStruggle ?? '',
    nextWeekFocus: existingReview?.nextWeekFocus ?? '',
    nextWeekDsaTheme: existingReview?.nextWeekDsaTheme ?? '',
    nextWeekTechTheme: existingReview?.nextWeekTechTheme ?? '',
    notes: existingReview?.notes ?? '',
  });

  const handleSave = () => {
    dashboardStore.saveReview(formData);
    alert('Weekly review saved successfully!');
  };

  const reviews = dashboardStore.reviews;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Weekly Review</h1>
      <p className="text-[var(--text-secondary)]">Week of {weekStartDate}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quantitative Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Input type="number" label="DSA Solved" value={formData.dsaProblemsSolved} onChange={e => setFormData({...formData, dsaProblemsSolved: parseInt(e.target.value)})} />
              <Input type="number" label="DSA Acc %" value={formData.dsaAccuracy} onChange={e => setFormData({...formData, dsaAccuracy: parseInt(e.target.value)})} />
              <Input type="number" label="Tech Hours" value={formData.techHours} onChange={e => setFormData({...formData, techHours: parseFloat(e.target.value)})} />
              <Input type="number" label="Project Hours" value={formData.projectHours} onChange={e => setFormData({...formData, projectHours: parseFloat(e.target.value)})} />
              <Input type="number" label="Gym Sessions" value={formData.gymSessions} onChange={e => setFormData({...formData, gymSessions: parseInt(e.target.value)})} />
              <Input type="number" label="Avg Sleep (h)" value={formData.sleepAvg} onChange={e => setFormData({...formData, sleepAvg: parseFloat(e.target.value)})} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Qualitative Reflection</h2>
            <div className="space-y-4">
              <Textarea label="Biggest Win" value={formData.biggestWin} onChange={e => setFormData({...formData, biggestWin: e.target.value})} rows={2} />
              <Textarea label="Biggest Struggle" value={formData.biggestStruggle} onChange={e => setFormData({...formData, biggestStruggle: e.target.value})} rows={2} />
              <Textarea label="General Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-4">Next Week Plan</h2>
            <div className="space-y-4">
              <Input label="Main Focus" value={formData.nextWeekFocus} onChange={e => setFormData({...formData, nextWeekFocus: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="DSA Theme" value={formData.nextWeekDsaTheme} onChange={e => setFormData({...formData, nextWeekDsaTheme: e.target.value})} placeholder="e.g. Dynamic Programming" />
                <Input label="Tech Theme" value={formData.nextWeekTechTheme} onChange={e => setFormData({...formData, nextWeekTechTheme: e.target.value})} placeholder="e.g. React Performance" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>Save Review</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Previous Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-[var(--text-secondary)] text-sm">No previous reviews.</p>
          ) : (
            reviews.map(rev => (
              <Card key={rev.id} className="p-4">
                <div className="font-bold text-lg">{rev.weekStartDate}</div>
                <div className="text-sm mt-2">
                  <span className="text-[var(--text-secondary)]">Win:</span> {rev.biggestWin || 'None'}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                  <div>DSA: {rev.dsaProblemsSolved}</div>
                  <div>Tech: {rev.techHours}h</div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
