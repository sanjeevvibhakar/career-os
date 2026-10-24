import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, ArrowRight, Clock, Map, CheckCircle2, Circle, 
  AlertCircle, ChevronDown, ChevronUp, RotateCcw, BookOpen, 
  ExternalLink, Calendar, HelpCircle, MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { 
  useDailyPlannerStore, 
  type DailyTaskItem 
} from '../../stores/dailyPlannerStore';
import { MASTER_ROADMAP_TOPICS, type RoadmapTrack, type TopicStatus } from '../../data/masterRoadmapData';
import { soundService } from '../../services/soundService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const dailyPlannerStore = useDailyPlannerStore();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Fetch or generate plan for today
  const plan = dailyPlannerStore.getOrCreatePlanForDate(todayStr);
  const summary = dailyPlannerStore.getCompletionSummary(todayStr);

  // UI state for notes and swapping topics
  const [activeNoteTaskId, setActiveNoteTaskId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [swapTrack, setSwapTrack] = useState<RoadmapTrack | null>(null);

  const handleToggleComplete = (taskId: string) => {
    dailyPlannerStore.toggleTaskComplete(todayStr, taskId);
    soundService.playCheckSound();
  };

  const handleStatusChange = (taskId: string, status: TopicStatus) => {
    dailyPlannerStore.updateTaskStatus(todayStr, taskId, status);
  };

  const handleSaveNote = (taskId: string) => {
    dailyPlannerStore.updateTaskStatus(todayStr, taskId, plan.tasks.find(t => t.id === taskId)?.status || 'IN_PROGRESS', noteText);
    setActiveNoteTaskId(null);
    setNoteText('');
  };

  const pastHistory = useMemo(() => {
    return dailyPlannerStore.getPastHistory(7).filter(p => p.date !== todayStr);
  }, [dailyPlannerStore, todayStr]);

  const candidateSwapTopics = useMemo(() => {
    if (!swapTrack) return [];
    return MASTER_ROADMAP_TOPICS
      .filter(t => t.track === swapTrack)
      .slice(0, 15);
  }, [swapTrack]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans text-gray-100">
      
      {/* ========================================================= */}
      {/* A. COMPACT HEADER */}
      {/* ========================================================= */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {greeting}, {userName || 'Sanjeev'}
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {todayFormatted} • TCS Shift: 11:00 AM – 8:00 PM
          </p>
        </div>

        <Link
          to="/roadmap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors self-start sm:self-center bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
        >
          <Map size={14} />
          <span>View Master Roadmap</span>
          <ArrowRight size={12} />
        </Link>
      </header>

      {/* ========================================================= */}
      {/* C. SIMPLE COMPLETION TRACKER */}
      {/* ========================================================= */}
      <section aria-label="Today's Completion Tracker">
        <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-300 uppercase tracking-wider">
              Today's Execution Tracker
            </span>
            <span className="font-mono font-bold text-sm text-white">
              <span className={summary.completedCount === summary.totalCount && summary.totalCount > 0 ? 'text-emerald-400' : 'text-blue-400'}>
                {summary.completedCount}
              </span>
              <span className="text-gray-500"> of {summary.totalCount} tasks complete</span>
            </span>
          </div>

          {/* Simple Clean Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                summary.completedCount === summary.totalCount && summary.totalCount > 0 
                  ? 'bg-emerald-500' 
                  : 'bg-blue-500'
              }`}
              style={{ width: `${summary.totalCount > 0 ? (summary.completedCount / summary.totalCount) * 100 : 0}%` }}
            />
          </div>

          {/* 3 Explicit Categories Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono">
            <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              summary.dsaCompleted 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/5 text-gray-400'
            }`}>
              <span className="font-medium">1. DSA</span>
              <span className="font-bold flex items-center gap-1">
                {summary.dsaCompleted ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Not completed</span>
                )}
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              summary.backendCompleted 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/5 text-gray-400'
            }`}>
              <span className="font-medium">2. Backend</span>
              <span className="font-bold flex items-center gap-1">
                {summary.backendCompleted ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Not completed</span>
                )}
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              summary.systemDesignCompleted 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/[0.02] border-white/5 text-gray-400'
            }`}>
              <span className="font-medium">3. System Design</span>
              <span className="font-bold flex items-center gap-1">
                {summary.systemDesignCompleted ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <span>Not completed</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* B. TODAY'S TASKS (3 CLEAR LEARNING CATEGORIES) */}
      {/* ========================================================= */}
      <section aria-label="Today's Selected Tasks" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <span>Today's Learning Tasks</span>
            <span className="text-xs text-gray-500 font-mono font-normal">
              (Exactly 1 task per track)
            </span>
          </h2>

          <button
            onClick={() => dailyPlannerStore.resetPlanForDate(todayStr)}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Recalculate tasks based on latest roadmap position"
          >
            <RotateCcw size={12} />
            <span>Reset Today</span>
          </button>
        </div>

        <div className="space-y-4">
          {plan.tasks.map((task, index) => {
            const isCompleted = task.status === 'COMPLETED';
            const isBlocked = task.status === 'BLOCKED';
            const isInProgress = task.status === 'IN_PROGRESS';

            return (
              <article
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#0a1118]/80 border-emerald-500/30 shadow-sm'
                    : isBlocked
                    ? 'bg-[#180e0e]/80 border-rose-500/30'
                    : 'bg-[#0d1017] border-white/10 hover:border-white/20 shadow-md'
                }`}
              >
                {/* Header row: Category Badge, Duration, Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold border ${
                      task.track === 'DSA'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                        : task.track === 'BACKEND'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                    }`}>
                      {index + 1}. {task.trackLabel}
                    </span>

                    {task.isCarriedOver && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <AlertCircle size={10} />
                        <span>Carried over from yesterday</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded">
                      <Clock size={12} className="text-blue-400" />
                      <span>{task.duration}</span>
                    </span>

                    {/* Quick Topic Swap Button */}
                    <button
                      onClick={() => setSwapTrack(swapTrack === task.track ? null : task.track)}
                      className="text-[11px] text-gray-400 hover:text-blue-300 underline transition-colors cursor-pointer"
                      title="Select another topic from this track"
                    >
                      Swap topic
                    </button>
                  </div>
                </div>

                {/* Main Content: Title, Subtitle, What to Learn */}
                <div className="pt-3 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className={`text-base sm:text-lg font-bold leading-snug ${isCompleted ? 'text-gray-300 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {task.subtitle}
                      </div>
                    </div>

                    {/* Primary Completion Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/30'
                          : 'border-white/20 hover:border-white/40 text-transparent hover:bg-white/5'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      aria-label={`Mark task ${task.title} as ${isCompleted ? 'incomplete' : 'completed'}`}
                    >
                      <Check size={16} className={isCompleted ? 'stroke-[2.5]' : ''} />
                    </button>
                  </div>

                  {/* Why this task was selected */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 flex items-start gap-2">
                    <HelpCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-300">Why selected today: </strong>
                      <span>{task.selectionReason}</span>
                    </div>
                  </div>

                  {/* What to learn */}
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <strong className="text-gray-200">What to learn: </strong>
                    <span>{task.whatToLearn}</span>
                  </div>

                  {/* Why it matters */}
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <strong className="text-gray-200">Why this matters: </strong>
                    <span>{task.whyItMatters}</span>
                  </div>

                  {/* Lesson, Resource or Practice Exercise */}
                  <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-blue-300">
                      <BookOpen size={13} />
                      <span>Lesson, Resource & Practice:</span>
                    </div>
                    <div className="text-gray-300">
                      {task.resourceOrExercise}
                    </div>
                  </div>

                  {/* Clear completion criteria */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 space-y-1">
                    <div className="font-bold text-gray-200 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Completion Criteria:</span>
                    </div>
                    <div className="text-gray-400 text-[11px] leading-relaxed">
                      {task.completionCriteria}
                    </div>
                  </div>

                  {/* Existing Task Note */}
                  {task.note && (
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 flex items-start gap-2">
                      <MessageSquare size={13} className="text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-purple-300">Note: </strong>
                        <span>{task.note}</span>
                      </div>
                    </div>
                  )}

                  {/* Note Editing Form */}
                  {activeNoteTaskId === task.id && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">
                        Add Blocker / Progress Note:
                      </label>
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="e.g. Stuck on edge case with negative numbers, continuing tomorrow"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveNote(task.id);
                        }}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveNoteTaskId(null)}
                          className="px-2.5 py-1 text-xs text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(task.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer action bar: Status selector, notes trigger, and deep-dive link */}
                <div className="pt-3 mt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TopicStatus)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono font-medium bg-[#090b10] cursor-pointer ${
                        isCompleted 
                          ? 'border-emerald-500/40 text-emerald-300' 
                          : isBlocked 
                          ? 'border-rose-500/40 text-rose-300' 
                          : isInProgress 
                          ? 'border-amber-500/40 text-amber-300' 
                          : 'border-white/10 text-gray-400'
                      }`}
                      aria-label="Change task status"
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>

                    {/* Add note button */}
                    <button
                      onClick={() => {
                        setActiveNoteTaskId(activeNoteTaskId === task.id ? null : task.id);
                        setNoteText(task.note || '');
                      }}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {task.note ? 'Edit note' : '+ Add note'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : 'Mark Complete'}
                    </button>

                    <button
                      onClick={() => navigate(task.actionRoute)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open {task.trackLabel}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Topic Swapper Drawer */}
                {swapTrack === task.track && (
                  <div className="mt-3 p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-300">
                      <span>Choose another topic for {task.trackLabel}:</span>
                      <button 
                        onClick={() => setSwapTrack(null)}
                        className="text-gray-400 hover:text-white text-[11px]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                      {candidateSwapTopics.map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => {
                            dailyPlannerStore.manuallySetTrackTopic(todayStr, task.track, topic.id);
                            setSwapTrack(null);
                          }}
                          className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                            topic.id === task.topicId
                              ? 'bg-blue-600/30 border border-blue-500/40 text-blue-200'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">{topic.order}. {topic.title}</span>
                          <span className="text-[10px] font-mono text-gray-400 shrink-0">{topic.estimatedEffort}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* D. INCOMPLETE TASK HANDLING & SIMPLE HISTORY */}
      {/* ========================================================= */}
      <section aria-label="Recent Execution History" className="pt-2">
        <div className="p-4 rounded-xl bg-[#0d1017] border border-white/10 space-y-2">
          <button
            onClick={() => setShowHistory(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-400" />
              <span>Past Daily Execution History ({pastHistory.length} recorded days)</span>
            </div>
            {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showHistory && (
            <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
              {pastHistory.length === 0 ? (
                <div className="text-gray-500 text-[11px] py-1 font-mono">
                  No previous recorded days yet. Your daily completion records will appear here as you progress.
                </div>
              ) : (
                pastHistory.map(record => (
                  <div
                    key={record.date}
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-300">{record.date}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">
                        {record.tasks.map(t => t.track).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={record.isComplete ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                        {record.overallCompletedCount} of {record.totalCount} completed
                      </span>
                      {record.isComplete ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Circle size={12} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
