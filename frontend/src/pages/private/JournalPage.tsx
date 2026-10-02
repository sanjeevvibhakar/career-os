import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, Sparkles, Zap, Flame, CheckCircle2, 
  Calendar, Edit2, ArrowRight, Tag, Smile, BatteryCharging, Clock
} from 'lucide-react';

const QUICK_TAGS = [
  'Fixed Production Bug',
  'Solved DSA Pattern',
  'Mastered Java 21 / JMM',
  'Cleaned Controller & DTOs',
  'Optimized SQL Index',
  'Reviewed PRs at Work',
  'Pushed Event to Kafka',
  'Gym Session Complete',
  'Spoke Aloud in English',
  'High Energy Day',
];

export const JournalPage: React.FC = () => {
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();
  
  const todayDate = new Date().toISOString().split('T')[0];
  const existingEntry = dailyStore.getJournalByDate(todayDate);
  const recentEntries = dailyStore.getRecentJournals(14);

  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [logMode, setLogMode] = useState<'QUICK' | 'DEEP'>('QUICK');

  const [formData, setFormData] = useState({
    date: todayDate,
    whatBuilt: existingEntry?.whatBuilt || '',
    whatLearned: existingEntry?.whatLearned || '',
    whatConfused: existingEntry?.whatConfused || '',
    bugEncountered: existingEntry?.bugEncountered || '',
    revisitTopic: existingEntry?.revisitTopic || '',
    mood: existingEntry?.mood || 'GOOD',
    energyLevel: existingEntry?.energyLevel || 4,
  });

  const moods = [
    { value: 'GREAT' as const, emoji: '🔥', label: 'Unstoppable' },
    { value: 'GOOD' as const, emoji: '😊', label: 'Solid & Focused' },
    { value: 'OKAY' as const, emoji: '😐', label: 'Steady / Average' },
    { value: 'LOW' as const, emoji: '😔', label: 'Tired / Drained' },
    { value: 'BAD' as const, emoji: '😩', label: 'High Friction' },
  ];

  const handleAddQuickTag = (tag: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    soundService.playTapClick();
    if (logMode === 'QUICK') {
      const current = formData.whatBuilt ? `${formData.whatBuilt}, ${tag}` : tag;
      setFormData({ ...formData, whatBuilt: current });
    } else {
      const current = formData.whatLearned ? `${formData.whatLearned}, ${tag}` : tag;
      setFormData({ ...formData, whatLearned: current });
    }
  };

  const handleSave = () => {
    dailyStore.saveJournal(formData as any);
    dashboardStore.updateStreak('journal');
    soundService.playCheckSound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
              Circadian Close-Out
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
            Daily Engineering Journal
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {existingEntry && !isEditing && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Completed Today
            </span>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
              <Edit2 size={13} /> Edit Entry
            </Button>
          </div>
        )}
      </div>

      {/* 2. Main Entry Form or Saved Card */}
      <Card className="p-5 sm:p-6 space-y-5 border-white/10 shadow-lg">
        {isEditing ? (
          <div className="space-y-5">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogMode('QUICK')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    logMode === 'QUICK'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Zap size={13} />
                  <span>30-Second Micro Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLogMode('DEEP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    logMode === 'DEEP'
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Deep Engineering Log</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
                {logMode === 'QUICK' ? 'Fast reflection for busy evenings' : 'Comprehensive architecture notes'}
              </span>
            </div>

            {/* Quick 1-Click Action Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Tap to Add Quick Wins:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddQuickTag(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-300 hover:text-white border border-white/5 hover:border-blue-500/30 transition-all flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields Based on Mode */}
            {logMode === 'QUICK' ? (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-mono">
                    1 Core Win Today (What did you build or finish?)
                  </label>
                  <Input
                    value={formData.whatBuilt}
                    onChange={(e) => setFormData({ ...formData, whatBuilt: e.target.value })}
                    placeholder="e.g. Solved 3Sum with Two Pointers and refactored DTOs at work"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-mono">
                    1 Key Takeaway or Bug Resolved
                  </label>
                  <Input
                    value={formData.whatLearned}
                    onChange={(e) => setFormData({ ...formData, whatLearned: e.target.value })}
                    placeholder="e.g. Remembered volatile only guarantees visibility, not compound atomicity"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <Textarea 
                  label="What did I build today?" 
                  value={formData.whatBuilt} 
                  onChange={(e) => setFormData({ ...formData, whatBuilt: e.target.value })} 
                  rows={2} 
                  placeholder="Modules implemented, PRs merged, problems coded..."
                />
                <Textarea 
                  label="What did I learn?" 
                  value={formData.whatLearned} 
                  onChange={(e) => setFormData({ ...formData, whatLearned: e.target.value })} 
                  rows={2} 
                  placeholder="Key concepts, architecture decisions, documentation read..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Textarea 
                    label="What confused me or bug encountered?" 
                    value={formData.bugEncountered} 
                    onChange={(e) => setFormData({ ...formData, bugEncountered: e.target.value })} 
                    rows={2} 
                    placeholder="Edge cases missed, errors debugged..."
                  />
                  <Textarea 
                    label="Topic to revisit later" 
                    value={formData.revisitTopic} 
                    onChange={(e) => setFormData({ ...formData, revisitTopic: e.target.value })} 
                    rows={2} 
                    placeholder="e.g. Redlock clock drift or Kahn's algorithm"
                  />
                </div>
              </div>
            )}

            {/* Mood & Energy Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/10">
              {/* Mood */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 font-mono">
                  Evening State / Mood
                </label>
                <div className="flex gap-2 flex-wrap">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: m.value })}
                      className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-mono ${
                        formData.mood === m.value
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-sm'
                          : 'bg-black/20 border-white/5 hover:border-white/15 text-gray-400 hover:text-white'
                      }`}
                      title={m.label}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span className="hidden sm:inline">{m.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 font-mono">
                  Energy Level: <span className="text-emerald-400 font-bold">{formData.energyLevel} / 5</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, energyLevel: lvl })}
                      className={`flex-1 py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                        formData.energyLevel === lvl
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm'
                          : 'bg-black/20 border-white/5 hover:border-white/15 text-gray-500 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <Button onClick={handleSave} variant="primary" className="gap-2 w-full sm:w-auto">
                <CheckCircle2 size={16} /> Save Daily Entry
              </Button>
            </div>
          </div>
        ) : (
          /* View Saved Entry */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-white/5 border border-white/10">
                  {moods.find((m) => m.value === existingEntry?.mood)?.emoji || '😊'}
                </span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{moods.find((m) => m.value === existingEntry?.mood)?.label || 'Completed'}</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Energy: {existingEntry?.energyLevel}/5
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">Logged for {existingEntry?.date}</div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                <Edit2 size={13} /> Edit
              </Button>
            </div>

            {existingEntry?.whatBuilt && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider">
                  What Was Built / Finished
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{existingEntry.whatBuilt}</p>
              </div>
            )}

            {existingEntry?.whatLearned && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                  Core Learnings & Patterns
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{existingEntry.whatLearned}</p>
              </div>
            )}

            {existingEntry?.bugEncountered && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Bug / Confusion Debugged
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{existingEntry.bugEncountered}</p>
              </div>
            )}

            {existingEntry?.revisitTopic && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                  Topic To Revisit
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{existingEntry.revisitTopic}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 3. Consistency History / Recent Logged Entries */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Calendar size={15} className="text-blue-400" />
            <span>Consistency Log (Past 14 Days)</span>
          </h2>
          <span className="text-xs font-mono text-gray-500">
            {recentEntries.length} Total Entries
          </span>
        </div>

        {recentEntries.length === 0 ? (
          <p className="text-xs text-gray-500 font-mono py-4 text-center">No past journal entries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentEntries.map((entry) => {
              const moodItem = moods.find((m) => m.value === entry.mood);
              const isToday = entry.date === todayDate;

              return (
                <div 
                  key={entry.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    isToday ? 'bg-blue-950/15 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono">
                      <span className="text-white">{entry.date}</span>
                      {isToday && <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">Today</span>}
                    </div>
                    <span className="text-base" title={moodItem?.label}>{moodItem?.emoji || '😊'}</span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {entry.whatBuilt || entry.whatLearned || 'Quick entry logged.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
