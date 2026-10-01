import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';

export const JournalPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();
  
  const todayDate = new Date().toISOString().split('T')[0];
  const existingEntry = dailyStore.getJournalByDate(todayDate);
  const recentEntries = dailyStore.getRecentJournals(7);

  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [formData, setFormData] = useState({
    date: todayDate,
    whatBuilt: existingEntry?.whatBuilt || '',
    whatLearned: existingEntry?.whatLearned || '',
    whatConfused: existingEntry?.whatConfused || '',
    bugEncountered: existingEntry?.bugEncountered || '',
    revisitTopic: existingEntry?.revisitTopic || '',
    mood: existingEntry?.mood || 'OKAY',
    energyLevel: existingEntry?.energyLevel || 3,
  });

  const handleSave = () => {
    dailyStore.saveJournal(formData as any);
    dashboardStore.updateStreak('journal');
    setIsEditing(false);
  };

  const moods = [
    { value: 'GREAT' as const, emoji: '🔥' },
    { value: 'GOOD' as const, emoji: '😊' },
    { value: 'OKAY' as const, emoji: '😐' },
    { value: 'LOW' as const, emoji: '😔' },
    { value: 'BAD' as const, emoji: '😩' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Daily Journal</h1>
        <div className="text-lg font-medium text-[var(--text-secondary)]">{new Date().toDateString()}</div>
      </div>

      <Card className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            <Textarea label="What did I build today?" value={formData.whatBuilt} onChange={e => setFormData({...formData, whatBuilt: e.target.value})} rows={2} />
            <Textarea label="What did I learn?" value={formData.whatLearned} onChange={e => setFormData({...formData, whatLearned: e.target.value})} rows={2} />
            <Textarea label="What confused me?" value={formData.whatConfused} onChange={e => setFormData({...formData, whatConfused: e.target.value})} rows={2} />
            <Textarea label="Bug encountered (and fix)" value={formData.bugEncountered} onChange={e => setFormData({...formData, bugEncountered: e.target.value})} rows={2} />
            <Textarea label="Topic to revisit" value={formData.revisitTopic} onChange={e => setFormData({...formData, revisitTopic: e.target.value})} rows={1} />
            
            <div className="flex flex-wrap gap-8">
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">Mood</label>
                <div className="flex gap-2">
                  {moods.map(m => (
                    <button 
                      key={m.value}
                      onClick={() => setFormData({...formData, mood: m.value})}
                      className={`text-2xl p-2 rounded-lg border ${formData.mood === m.value ? 'bg-blue-500/20 border-blue-500' : 'border-transparent hover:bg-[var(--bg-secondary)]'}`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">Energy Level (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => setFormData({...formData, energyLevel: v})}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border ${formData.energyLevel === v ? 'bg-blue-500 text-white' : 'border-[var(--border)] hover:bg-[var(--bg-secondary)]'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <Button onClick={handleSave}>Save Journal</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <span className="text-4xl">{moods.find(m => m.value === existingEntry?.mood)?.emoji}</span>
                <div>
                  <div className="text-sm text-[var(--text-secondary)]">Energy: {existingEntry?.energyLevel}/5</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">Logged today</div>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
            
            {existingEntry?.whatBuilt && <div><h4 className="font-medium text-sm text-[var(--text-secondary)] uppercase">Built</h4><p className="mt-1 whitespace-pre-wrap">{existingEntry.whatBuilt}</p></div>}
            {existingEntry?.whatLearned && <div><h4 className="font-medium text-sm text-[var(--text-secondary)] uppercase">Learned</h4><p className="mt-1 whitespace-pre-wrap">{existingEntry.whatLearned}</p></div>}
            {existingEntry?.whatConfused && <div><h4 className="font-medium text-sm text-[var(--text-secondary)] uppercase">Confused By</h4><p className="mt-1 whitespace-pre-wrap">{existingEntry.whatConfused}</p></div>}
            {existingEntry?.bugEncountered && <div><h4 className="font-medium text-sm text-[var(--text-secondary)] uppercase">Bug</h4><p className="mt-1 whitespace-pre-wrap">{existingEntry.bugEncountered}</p></div>}
            {existingEntry?.revisitTopic && <div><h4 className="font-medium text-sm text-[var(--text-secondary)] uppercase">Revisit</h4><p className="mt-1 whitespace-pre-wrap">{existingEntry.revisitTopic}</p></div>}
          </div>
        )}
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
        <div className="space-y-4">
          {recentEntries.filter(r => r.date !== todayDate).map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{entry.date}</div>
                <div className="text-2xl">{moods.find(m => m.value === entry.mood)?.emoji}</div>
              </div>
              <div className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {entry.whatLearned || entry.whatBuilt || 'No notes.'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
