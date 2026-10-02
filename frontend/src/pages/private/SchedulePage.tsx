import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useDailyStore, DEFAULT_SCHEDULE, type ScheduleBlock } from '../../stores/dailyStore';
import { soundService } from '../../services/soundService';
import { 
  Calendar, Clock, Plus, Edit2, Trash2, RotateCcw, Copy, 
  Sparkles, CheckCircle2, Zap, Brain, Coffee, Dumbbell, Briefcase, User,
  Flame, Sun, Moon, AlertCircle
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORY_STYLES = {
  study: {
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: Brain,
    label: 'Deep Study',
  },
  work: {
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Briefcase,
    label: 'Office Work',
  },
  gym: {
    border: 'border-orange-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-300',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: Dumbbell,
    label: 'Fitness & Gym',
  },
  rest: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: Coffee,
    label: 'Recovery & Rest',
  },
  personal: {
    border: 'border-gray-500',
    bg: 'bg-white/5',
    text: 'text-gray-300',
    badge: 'bg-white/10 text-gray-300 border-white/10',
    icon: User,
    label: 'Personal Routine',
  },
};

export const SchedulePage: React.FC = () => {
  const dailyStore = useDailyStore();
  const daysByJs = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysByJs[new Date().getDay()];
  const [activeDay, setActiveDay] = useState(todayName);

  // Time detection for "Happening Now"
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const blocks = dailyStore.getScheduleForDay(activeDay);

  // Parse time helper (e.g. "07:45-08:15" -> startMin: 465, endMin: 495)
  const parseBlockTime = (timeStr: string): { startMin: number; endMin: number } | null => {
    try {
      const parts = timeStr.trim().split('-');
      if (parts.length === 1) {
        // Point in time (e.g. "05:45" or "22:30")
        const [h, m] = parts[0].split(':').map(Number);
        const start = h * 60 + (m || 0);
        return { startMin: start, endMin: start + 30 };
      } else if (parts.length === 2) {
        const [h1, m1] = parts[0].trim().split(':').map(Number);
        const [h2, m2] = parts[1].trim().split(':').map(Number);
        return {
          startMin: h1 * 60 + (m1 || 0),
          endMin: h2 * 60 + (m2 || 0)
        };
      }
    } catch {
      return null;
    }
    return null;
  };

  const isBlockCurrent = (block: ScheduleBlock): boolean => {
    if (activeDay !== todayName) return false;
    const parsed = parseBlockTime(block.time);
    if (!parsed) return false;
    return currentTimeMinutes >= parsed.startMin && currentTimeMinutes < parsed.endMin;
  };

  // Block Modal State (Add or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [blockForm, setBlockForm] = useState<ScheduleBlock>({
    time: '19:45-21:15',
    activity: 'Deep Preparation',
    category: 'study',
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setBlockForm({
      time: '19:00-20:00',
      activity: '',
      category: 'study',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setBlockForm({ ...blocks[index] });
    setModalOpen(true);
  };

  const handleSaveBlock = () => {
    if (!blockForm.time.trim() || !blockForm.activity.trim()) {
      alert('Please enter both time range and activity name.');
      return;
    }

    const updated = [...blocks];
    if (editingIndex !== null) {
      updated[editingIndex] = blockForm;
    } else {
      updated.push(blockForm);
    }

    // Sort blocks chronologically
    updated.sort((a, b) => {
      const pA = parseBlockTime(a.time);
      const pB = parseBlockTime(b.time);
      return (pA?.startMin || 0) - (pB?.startMin || 0);
    });

    dailyStore.updateSchedule(activeDay, updated);
    soundService.playCheckSound();
    setModalOpen(false);
  };

  const handleDeleteBlock = (indexToDelete: number) => {
    if (window.confirm('Delete this schedule block?')) {
      const updated = blocks.filter((_, idx) => idx !== indexToDelete);
      dailyStore.updateSchedule(activeDay, updated);
      soundService.playCheckSound();
      setModalOpen(false);
    }
  };

  // Reset to Career OS Defaults
  const handleResetToDefaults = () => {
    if (window.confirm(`Reset ${activeDay}'s schedule to Career OS blueprint defaults?`)) {
      const defaultBlocks = (DEFAULT_SCHEDULE as any)[activeDay] || [];
      dailyStore.updateSchedule(activeDay, [...defaultBlocks]);
      soundService.playCheckSound();
      alert(`✓ ${activeDay} reset to default timetable!`);
    }
  };

  // Copy active day's timetable to all weekdays (Monday-Friday)
  const handleCopyToWeekdays = () => {
    if (window.confirm(`Copy ${activeDay}'s timetable to all weekdays (Monday through Friday)?`)) {
      const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      weekdays.forEach(day => {
        dailyStore.updateSchedule(day, [...blocks]);
      });
      soundService.playCheckSound();
      alert(`✓ Timetable successfully replicated to all 5 weekdays!`);
    }
  };

  // Calculate day summary metrics
  const daySummary = useMemo(() => {
    let studyMins = 0;
    let workMins = 0;
    let gymMins = 0;

    blocks.forEach(b => {
      const parsed = parseBlockTime(b.time);
      if (parsed) {
        const diff = Math.max(0, parsed.endMin - parsed.startMin);
        if (b.category === 'study') studyMins += diff;
        else if (b.category === 'work') workMins += diff;
        else if (b.category === 'gym') gymMins += diff;
      }
    });

    return {
      studyHours: (studyMins / 60).toFixed(1),
      workHours: (workMins / 60).toFixed(1),
      gymMins,
      totalBlocks: blocks.length,
    };
  }, [blocks]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-0">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-1.5 border border-blue-500/20">
            <Clock size={12} className="text-blue-400" />
            <span>Circadian & Ultradian Planner</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">Daily Timetable & Routine</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Synchronized with peak prefrontal cortex cognitive performance and recovery windows.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={handleCopyToWeekdays}
            className="text-xs border-white/10 text-gray-300 hover:text-white"
            title="Copy current day blocks to Monday-Friday"
          >
            <Copy size={13} className="mr-1.5 text-blue-400" />
            <span>Copy Mon–Fri</span>
          </Button>

          <Button
            variant="secondary"
            onClick={handleResetToDefaults}
            className="text-xs border-white/10 text-gray-400 hover:text-white"
            title="Restore default blueprint"
          >
            <RotateCcw size={13} className="mr-1.5 text-gray-400" />
            <span>Reset Blueprint</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-500 text-xs shadow-md shadow-blue-600/20"
          >
            <Plus size={14} className="mr-1" />
            <span>Add Block</span>
          </Button>
        </div>
      </div>

      {/* 2. Days Selector Strip */}
      <div className="flex overflow-x-auto pb-2 gap-1.5 hide-scrollbar">
        {DAYS.map(day => {
          const isToday = day === todayName;
          const isActive = activeDay === day;

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3.5 py-2 font-medium text-xs whitespace-nowrap rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} title="Today" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Daily Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="glass-panel p-3 rounded-xl border border-white/10">
          <div className="text-[10px] text-purple-400 uppercase font-mono font-bold flex items-center gap-1">
            <Brain size={12} /> Deep Study
          </div>
          <div className="text-lg font-black text-white font-mono mt-0.5">{daySummary.studyHours}h</div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-white/10">
          <div className="text-[10px] text-blue-400 uppercase font-mono font-bold flex items-center gap-1">
            <Briefcase size={12} /> Office Work
          </div>
          <div className="text-lg font-black text-white font-mono mt-0.5">{daySummary.workHours}h</div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-white/10">
          <div className="text-[10px] text-orange-400 uppercase font-mono font-bold flex items-center gap-1">
            <Dumbbell size={12} /> Fitness
          </div>
          <div className="text-lg font-black text-white font-mono mt-0.5">{daySummary.gymMins}m</div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-white/10">
          <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold flex items-center gap-1">
            <Clock size={12} /> Total Blocks
          </div>
          <div className="text-lg font-black text-white font-mono mt-0.5">{daySummary.totalBlocks}</div>
        </div>
      </div>

      {/* 4. Schedule Timeline & Circadian Energy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Schedule Blocks Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Timeline ({activeDay})
            </h2>
            <span className="text-[11px] text-gray-500">Tap any block to edit</span>
          </div>

          <div className="space-y-2.5">
            {blocks.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 space-y-3">
                <Calendar size={28} className="mx-auto text-gray-500" />
                <p className="text-xs text-gray-400">No time blocks set for {activeDay}.</p>
                <Button onClick={handleResetToDefaults} variant="secondary" className="text-xs">
                  Restore Blueprint Blocks
                </Button>
              </div>
            ) : (
              blocks.map((block, idx) => {
                const style = CATEGORY_STYLES[block.category] || CATEGORY_STYLES.personal;
                const isCurrent = isBlockCurrent(block);
                const Icon = style.icon;

                return (
                  <div
                    key={idx}
                    onClick={() => handleOpenEdit(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                        : 'bg-[#090b10] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Time & Activity */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-24 sm:w-28 text-xs font-bold font-mono text-gray-400 shrink-0 flex items-center gap-1.5">
                        <Clock size={12} className={isCurrent ? 'text-blue-400 animate-pulse' : 'text-gray-500'} />
                        <span className={isCurrent ? 'text-white' : ''}>{block.time}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                            {block.activity}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-black font-extrabold text-[9px] uppercase tracking-wider animate-pulse font-mono">
                              <Zap size={9} /> Live Now
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${style.badge}`}>
                            {style.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Category Icon & Edit Trigger */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Circadian Rhythm Science & Category Legend (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Circadian Energy Optimization Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sun size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Circadian Prime Windows
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Based on cognitive neurobiology, the Career OS timetable separates problem-solving from fatigue:
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                <div className="font-bold text-purple-300 flex items-center gap-1">
                  <Brain size={12} /> 07:45 – 08:15 (Morning DSA)
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Peak working memory before workplace slack messages drain prefrontal bandwidth.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-500/20">
                <div className="font-bold text-orange-300 flex items-center gap-1">
                  <Dumbbell size={12} /> 06:00 – 07:00 (Physical Engine)
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Releases BDNF and dopamine, priming the brain for long-term algorithmic recall.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20">
                <div className="font-bold text-blue-300 flex items-center gap-1">
                  <Zap size={12} /> 19:45 – 21:15 (Ultradian Cycle)
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  90-minute uninterrupted deep work block dedicated to System Design & Technology Syllabus.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <Moon size={12} /> 22:30 (Sleep Hard Stop)
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  REM sleep consolidates memory patterns. Studying past 11 PM creates diminishing returns.
                </div>
              </div>
            </div>
          </div>

          {/* Category Guide */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Category Breakdown
            </h3>
            <div className="space-y-2">
              {Object.entries(CATEGORY_STYLES).map(([key, style]) => {
                const Icon = style.icon;
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${style.bg} ${style.text}`}>
                        <Icon size={12} />
                      </div>
                      <span className="text-gray-300 font-medium">{style.label}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Block Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? `Edit Block (${activeDay})` : `Add Time Block (${activeDay})`}
      >
        <div className="space-y-4 py-2">
          {/* Time Range Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Time Range (24h format, e.g. 07:45-08:15 or 22:30)
            </label>
            <Input
              value={blockForm.time}
              onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}
              placeholder="e.g. 19:45-21:15"
            />
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Activity Description
            </label>
            <Input
              value={blockForm.activity}
              onChange={(e) => setBlockForm({ ...blockForm, activity: e.target.value })}
              placeholder="e.g. Deep Preparation (Kafka & Redis)"
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Category Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_STYLES) as Array<keyof typeof CATEGORY_STYLES>).map((catKey) => {
                const item = CATEGORY_STYLES[catKey];
                const Icon = item.icon;
                const isSelected = blockForm.category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setBlockForm({ ...blockForm, category: catKey as any })}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10 gap-2">
            {editingIndex !== null ? (
              <button
                type="button"
                onClick={() => handleDeleteBlock(editingIndex)}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveBlock}
                className="bg-blue-600 hover:bg-blue-500 text-xs font-bold"
              >
                Save Block
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
