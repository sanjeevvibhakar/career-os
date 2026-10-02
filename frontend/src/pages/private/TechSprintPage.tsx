import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, ExternalLink, Calendar, 
  ArrowRight, Sparkles, BookOpen, Clock, AlertTriangle, 
  Check, RefreshCw, Filter, ShieldCheck, ChevronRight
} from 'lucide-react';
import { SYLLABUS_WEEKS, SYLLABUS_DATA, type SyllabusDayItem } from '../../data/syllabusData';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TechSprintPage: React.FC = () => {
  const syllabusStore = useSyllabusStore();
  const dashboardStore = useDashboardStore();

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const pace = syllabusStore.getPaceAnalysis();
  const nextItem = syllabusStore.getNextPendingItem();

  // Handle 1-click toggle with vibration and streak update
  const handleToggle = (itemId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    const wasCompleted = syllabusStore.isCompleted(itemId);
    syllabusStore.toggleItem(itemId);
    if (!wasCompleted) {
      dashboardStore.updateStreak('learning');
    }
  };

  const handleResetBaseline = () => {
    if (confirm('Reset study schedule start date to today? This clears past lag and resets your timeline from Day 1.')) {
      syllabusStore.setStartDate(new Date().toISOString().split('T')[0]);
    }
  };

  // Filter items for selected week
  const weekItems = SYLLABUS_DATA.filter((item) => item.weekNumber === selectedWeek);
  const displayedItems = weekItems.filter((item) => {
    const isDone = syllabusStore.isCompleted(item.id);
    if (filterMode === 'PENDING') return !isDone;
    if (filterMode === 'COMPLETED') return isDone;
    return true;
  });

  const currentWeekMeta = SYLLABUS_WEEKS.find((w) => w.weekNumber === selectedWeek) || SYLLABUS_WEEKS[0];
  const weekCompletedCount = weekItems.filter((i) => syllabusStore.isCompleted(i.id)).length;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-14 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 shadow-sm gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
              Core Tech Study Syllabus
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-0.5 tracking-tight">
            Curriculum & Pace Tracker
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            8 Weeks • 40 High-Yield Subtopics • 1-Click Progress
          </p>
        </div>

        <button
          onClick={handleResetBaseline}
          className="px-3 py-2 rounded-xl text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto w-full sm:w-auto"
          title="Recalibrate expected pace to today"
        >
          <RefreshCw size={13} />
          Reset Baseline to Today
        </button>
      </div>

      {/* 2. Pace & Lag Strategy Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        pace.status === 'SIGNIFICANT_LAG' 
          ? 'bg-rose-950/20 border-rose-500/30' 
          : pace.status === 'MILD_LAG'
          ? 'bg-amber-950/20 border-amber-500/30'
          : 'bg-emerald-950/20 border-emerald-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Progress & Status */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-black font-mono flex items-center gap-1.5 ${
                pace.status === 'SIGNIFICANT_LAG'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : pace.status === 'MILD_LAG'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {pace.statusLabel}
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                {pace.completedCount} of {pace.totalCount} Subtopics Completed ({pace.progressPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  pace.status === 'SIGNIFICANT_LAG'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : pace.status === 'MILD_LAG'
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${Math.max(5, pace.progressPct)}%` }}
              />
            </div>
          </div>

          {/* Quick Target / Next Up */}
          {nextItem && (
            <div className="md:border-l md:border-white/10 md:pl-5 flex items-center justify-between md:justify-start gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                  Next To Study:
                </span>
                <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[260px] block">
                  W{nextItem.weekNumber}D{nextItem.dayNumber}: {nextItem.subtopic}
                </span>
              </div>
              <button
                onClick={() => setSelectedWeek(nextItem.weekNumber)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold font-mono border border-blue-500/30 flex items-center gap-1 flex-shrink-0"
              >
                Jump <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Actionable Pace Recovery Strategy */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-start gap-2.5">
          <Sparkles size={16} className={`flex-shrink-0 mt-0.5 ${
            pace.status === 'SIGNIFICANT_LAG' ? 'text-rose-400' : pace.status === 'MILD_LAG' ? 'text-amber-400' : 'text-emerald-400'
          }`} />
          <div className="text-xs">
            <span className="font-bold text-[var(--text-primary)] mr-1.5">
              {pace.strategyTitle}:
            </span>
            <span className="text-[var(--text-secondary)] leading-relaxed">
              {pace.strategyAdvice}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Week Selector Horizontal Scroll */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold font-mono text-[var(--text-secondary)] uppercase tracking-wider">
            Select Week (1–8):
          </span>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  filterMode === mode 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' 
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {mode === 'ALL' ? 'All' : mode === 'PENDING' ? 'To-Do' : 'Done'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {SYLLABUS_WEEKS.map((w) => {
            const isSelected = selectedWeek === w.weekNumber;
            const itemsInWeek = SYLLABUS_DATA.filter((i) => i.weekNumber === w.weekNumber);
            const doneInWeek = itemsInWeek.filter((i) => syllabusStore.isCompleted(i.id)).length;
            const isWeekDone = doneInWeek === itemsInWeek.length;

            return (
              <button
                key={w.weekNumber}
                onClick={() => setSelectedWeek(w.weekNumber)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-black/20 hover:bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-blue-400' : 'text-[var(--text-secondary)]'}`}>
                    Week {w.weekNumber}
                  </span>
                  {isWeekDone && <Check size={12} className="text-emerald-400" />}
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] truncate mt-1">
                  {w.title.split('&')[0].trim()}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
                  {doneInWeek}/5 Done
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Week Details Card */}
      <div className="p-3.5 sm:p-4 rounded-xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
            Week {selectedWeek} Curriculum Focus
          </span>
          <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
            {currentWeekMeta.title}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {currentWeekMeta.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
            {weekCompletedCount} of 5 Completed
          </span>
        </div>
      </div>

      {/* 5. Day-by-Day Syllabus Checklist (Ultra-Simple, No Forms) */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {displayedItems.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
              <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-60" />
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {filterMode === 'PENDING' ? 'All subtopics in this week are completed!' : 'No subtopics match this filter.'}
              </p>
              <button
                onClick={() => setFilterMode('ALL')}
                className="mt-2 text-xs text-blue-400 hover:underline font-mono"
              >
                Show all subtopics
              </button>
            </div>
          ) : (
            displayedItems.map((item) => {
              const isDone = syllabusStore.isCompleted(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-emerald-500/5 border-emerald-500/25 shadow-sm' 
                      : 'bg-black/25 dark:bg-black/35 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 1-Click Checkbox */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                        isDone 
                          ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                          : 'bg-white/10 text-transparent hover:bg-white/20 border border-white/10'
                      }`}
                      title={isDone ? 'Click to mark uncompleted' : 'Click to mark completed'}
                    >
                      <Check size={14} className={isDone ? 'opacity-100' : 'opacity-0'} />
                    </button>

                    {/* Content Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                          Day {item.dayNumber}
                        </span>
                        <h3 className={`text-xs sm:text-sm font-bold tracking-tight ${
                          isDone ? 'text-[var(--text-secondary)] line-through' : 'text-[var(--text-primary)]'
                        }`}>
                          {item.subtopic}
                        </h3>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                            ✓ Done
                          </span>
                        )}
                      </div>

                      {/* Topic & Takeaway */}
                      <div className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        <span className="font-semibold text-white/80">{item.topic}:</span> {item.keyTakeaway}
                      </div>

                      {/* Why At Work vs Why In Interview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <div className="text-sky-400/80">
                          <span className="font-bold text-sky-400">💼 Work Value:</span> {item.whyAtWork}
                        </div>
                        <div className="text-purple-400/80">
                          <span className="font-bold text-purple-400">🎯 Interview:</span> {item.whyInInterview}
                        </div>
                      </div>
                    </div>

                    {/* Curated Resource Button */}
                    <a
                      href={item.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white border border-white/10 text-[11px] font-mono font-bold flex items-center gap-1 transition-all flex-shrink-0 self-start mt-0.5"
                      title={item.resourceTitle}
                    >
                      <span className="hidden sm:inline">Guide</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
