import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Check, Dumbbell, Code, Mic, BookOpen, 
  Flame, Award, Sparkles, ChevronRight, Zap, Clock, Smile, 
  Meh, Frown, ThumbsUp, Star, ShieldCheck, ArrowRight, Play
} from 'lucide-react';
import { useDailyStore } from '../../stores/dailyStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { soundService } from '../../services/soundService';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface DailyBattleBoardProps {
  dsaFocusProblem: any;
  bottleneckTopic: any;
  nextSyllabusItem: any;
  syllabusPace: any;
  todayRoutine: any;
  currentLevelData: any;
  onOpenDsaModal: (problem: any) => void;
}

export const DailyBattleBoard: React.FC<DailyBattleBoardProps> = ({
  dsaFocusProblem,
  bottleneckTopic,
  nextSyllabusItem,
  syllabusPace,
  todayRoutine,
  currentLevelData,
  onOpenDsaModal,
}) => {
  const navigate = useNavigate();
  const dailyStore = useDailyStore();
  const dsaStore = useDsaStore();
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  const syllabusStore = useSyllabusStore();

  const todayDate = new Date().toISOString().split('T')[0];

  // Completion statuses
  const solvedDsaToday = dsaStore.attempts.some(a => a.attemptedAt && a.attemptedAt.startsWith(todayDate));
  const loggedJournalToday = dailyStore.journals.some(j => j.date === todayDate);
  const loggedTechToday = sprintStore.logs.some(l => l.date === todayDate);
  const loggedCommToday = dailyStore.communications.some(c => c.date === todayDate);
  const loggedGymToday = dailyStore.gymSessions.some(g => g.date === todayDate && g.completed);

  const completedCount = 
    (solvedDsaToday ? 1 : 0) + 
    (loggedJournalToday ? 1 : 0) + 
    (loggedTechToday ? 1 : 0) + 
    (loggedCommToday ? 1 : 0) + 
    (loggedGymToday ? 1 : 0);

  const percentComplete = Math.round((completedCount / 5) * 100);

  // Quick Action Modal States
  const [gymModalOpen, setGymModalOpen] = useState(false);
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [speechModalOpen, setSpeechModalOpen] = useState(false);

  // Quick Gym Form
  const [gymDuration, setGymDuration] = useState(todayRoutine?.estimatedMinutes || 45);
  const [gymType, setGymType] = useState(todayRoutine?.title || 'Daily Workout');
  const [gymNotes, setGymNotes] = useState('Crushed morning routine');

  // Quick Journal Form
  const [journalBuilt, setJournalBuilt] = useState('');
  const [journalLearned, setJournalLearned] = useState('');
  const [journalConfused, setJournalConfused] = useState('');
  const [journalMood, setJournalMood] = useState<'GREAT' | 'GOOD' | 'OKAY' | 'LOW' | 'BAD'>('GREAT');
  const [journalEnergy, setJournalEnergy] = useState(5);

  // Quick Tech Form
  const [techTopic, setTechTopic] = useState(
    nextSyllabusItem ? `${nextSyllabusItem.subtopic} (${nextSyllabusItem.topic})` : 'Architecture & Concurrency Study'
  );
  const [techMinutes, setTechMinutes] = useState(45);
  const [techNotes, setTechNotes] = useState('');

  // Quick Speech Form
  const [speechTopic, setSpeechTopic] = useState(`Verbal Walkthrough: ${dsaFocusProblem?.name || 'Algorithm'}`);
  const [speechDuration, setSpeechDuration] = useState(15);
  const [speechRating, setSpeechRating] = useState(4);
  const [speechNotes, setSpeechNotes] = useState('');

  // Audio trigger helper
  const checkVictorySound = (nextCount: number) => {
    if (nextCount === 5) {
      soundService.playSuccessChime();
    } else {
      soundService.playCheckSound();
    }
  };

  // 1-Tap Handlers
  const handleInstantGym = () => {
    dailyStore.saveGymSession({
      date: todayDate,
      type: todayRoutine?.title || 'Workout',
      completed: true,
      durationMinutes: todayRoutine?.estimatedMinutes || 45,
      notes: 'Logged via Quick Battle Board',
    });
    dashboardStore.updateStreak('gym');
    checkVictorySound(completedCount + (loggedGymToday ? 0 : 1));
  };

  const handleSaveGymModal = (e: React.FormEvent) => {
    e.preventDefault();
    dailyStore.saveGymSession({
      date: todayDate,
      type: gymType,
      completed: true,
      durationMinutes: Number(gymDuration),
      notes: gymNotes,
    });
    dashboardStore.updateStreak('gym');
    checkVictorySound(completedCount + (loggedGymToday ? 0 : 1));
    setGymModalOpen(false);
  };

  const handleInstantTech = () => {
    const topicTitle = nextSyllabusItem ? nextSyllabusItem.subtopic : 'Deep Tech Study';
    sprintStore.createLog({
      sprintId: null,
      date: todayDate,
      topic: topicTitle,
      plannedMinutes: 45,
      actualMinutes: 45,
      understanding: 4,
      notes: 'Completed deep session via Quick Battle Board',
      resourcesUsed: 'Internal Curriculum',
    });
    if (nextSyllabusItem) {
      syllabusStore.toggleItem(nextSyllabusItem.id);
    }
    dashboardStore.updateStreak('learning');
    checkVictorySound(completedCount + (loggedTechToday ? 0 : 1));
  };

  const handleSaveTechModal = (e: React.FormEvent) => {
    e.preventDefault();
    sprintStore.createLog({
      sprintId: null,
      date: todayDate,
      topic: techTopic,
      plannedMinutes: Number(techMinutes),
      actualMinutes: Number(techMinutes),
      understanding: 4,
      notes: techNotes,
      resourcesUsed: 'Docs & System Design Specs',
    });
    if (nextSyllabusItem) {
      syllabusStore.toggleItem(nextSyllabusItem.id);
    }
    dashboardStore.updateStreak('learning');
    checkVictorySound(completedCount + (loggedTechToday ? 0 : 1));
    setTechModalOpen(false);
  };

  const handleInstantSpeech = () => {
    dailyStore.saveCommunication({
      date: todayDate,
      type: 'TECHNICAL_EXPLANATION',
      topic: `Explaining ${dsaFocusProblem?.name || 'Algorithm Pattern'}`,
      durationMinutes: 15,
      notes: '15m verbal clarity practice',
      rating: 4,
    });
    dashboardStore.updateStreak('communication');
    checkVictorySound(completedCount + (loggedCommToday ? 0 : 1));
  };

  const handleSaveSpeechModal = (e: React.FormEvent) => {
    e.preventDefault();
    dailyStore.saveCommunication({
      date: todayDate,
      type: 'TECHNICAL_EXPLANATION',
      topic: speechTopic,
      durationMinutes: Number(speechDuration),
      notes: speechNotes,
      rating: speechRating,
    });
    dashboardStore.updateStreak('communication');
    checkVictorySound(completedCount + (loggedCommToday ? 0 : 1));
    setSpeechModalOpen(false);
  };

  const handleSaveJournalModal = (e: React.FormEvent) => {
    e.preventDefault();
    dailyStore.saveJournal({
      date: todayDate,
      whatBuilt: journalBuilt || 'Shipped production engineering progress',
      whatLearned: journalLearned || 'Deepened algorithmic and systems intuition',
      whatConfused: journalConfused,
      bugEncountered: '',
      revisitTopic: bottleneckTopic?.name || '',
      mood: journalMood,
      energyLevel: journalEnergy,
    });
    dashboardStore.updateStreak('journal');
    checkVictorySound(completedCount + (loggedJournalToday ? 0 : 1));
    setJournalModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* 1. Main Battle Board Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-xl ${
        completedCount === 5
          ? 'bg-gradient-to-br from-emerald-950/40 via-amber-950/20 to-black/80 border-emerald-500/40 shadow-emerald-500/10'
          : 'glass-panel border-white/10'
      }`}>
        {/* Glow Accent Top */}
        <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${
          completedCount === 5 ? 'via-emerald-400' : 'via-blue-500'
        } to-transparent opacity-75`} />

        {/* Header & Progress Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-transform ${
              completedCount === 5
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 scale-105'
                : 'bg-blue-600/15 text-blue-400 border-blue-500/30'
            }`}>
              {completedCount === 5 ? '🏆' : <Zap size={18} className="text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] font-mono uppercase tracking-wide">
                  Daily Battle Board
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  5 Disciplines
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                {completedCount === 5 
                  ? 'All 5 disciplines completed! Day streak extended 🔥' 
                  : `${5 - completedCount} disciplines remaining for a 100% Day Victory`}
              </p>
            </div>
          </div>

          {/* Progress Bar & Velocity Badge */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className={`text-xs sm:text-sm font-black font-mono ${
                completedCount === 5 ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {completedCount}/5 DONE ({percentComplete}%)
              </span>
              <div className="w-28 sm:w-36 h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    completedCount === 5 
                      ? 'bg-gradient-to-r from-emerald-400 to-amber-300' 
                      : 'bg-gradient-to-r from-blue-500 to-emerald-400'
                  }`}
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5 Discipline Rows */}
        <div className="space-y-2 pt-3">
          
          {/* Discipline 1: Morning Gym (06:00) */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedGymToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 hover:border-orange-500/40 border-white/5'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleInstantGym}
                title={loggedGymToday ? 'Gym already logged today' : '1-Tap: Mark 45m Gym Complete'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform active:scale-95 ${
                  loggedGymToday 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-orange-500/20 text-orange-400 border border-white/10 hover:border-orange-500/30'
                }`}
              >
                {loggedGymToday ? <Check size={14} /> : <Dumbbell size={13} />}
              </button>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>06:00 Gym: {todayRoutine?.title || 'Workout Session'}</span>
                  {loggedGymToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">✓ Logged</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  {todayRoutine?.estimatedMinutes || 45} mins • {todayRoutine?.description?.split('.')[0] || 'Physical discipline'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {!loggedGymToday && (
                <button
                  onClick={handleInstantGym}
                  className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-mono font-bold border border-orange-500/20 transition-colors"
                  title="1-Tap Mark Complete"
                >
                  Quick Done (45m)
                </button>
              )}
              <button
                onClick={() => setGymModalOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  loggedGymToday
                    ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    : 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border-orange-500/30'
                }`}
              >
                {loggedGymToday ? 'Edit Log' : 'Custom Track'}
              </button>
            </div>
          </div>

          {/* Discipline 2: Morning DSA Problem (07:45) */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            solvedDsaToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 hover:border-blue-500/40 border-white/5'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => onOpenDsaModal(dsaFocusProblem)}
                title="Solve and Log DSA Problem"
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform active:scale-95 ${
                  solvedDsaToday 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-blue-500/20 text-blue-400 border border-white/10 hover:border-blue-500/30'
                }`}
              >
                {solvedDsaToday ? <Check size={14} /> : <Code size={13} />}
              </button>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>07:45 DSA: {dsaFocusProblem?.name || 'Two Sum'}</span>
                  {solvedDsaToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">✓ Solved</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  {dsaFocusProblem?.difficulty || 'EASY'} • {dsaFocusProblem?.pattern || 'Pattern'} • {bottleneckTopic?.name || 'Weakest Focus'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => onOpenDsaModal(dsaFocusProblem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  solvedDsaToday
                    ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
                }`}
              >
                {solvedDsaToday ? 'Log Another' : 'Solve & Log'}
              </button>
            </div>
          </div>

          {/* Discipline 3: Deep Tech Sprint / Syllabus (19:45) */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedTechToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 hover:border-purple-500/40 border-white/5'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleInstantTech}
                title={loggedTechToday ? 'Tech study logged today' : '1-Tap: Mark 45m Tech Complete'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform active:scale-95 ${
                  loggedTechToday 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-purple-500/20 text-purple-400 border border-white/10 hover:border-purple-500/30'
                }`}
              >
                {loggedTechToday ? <Check size={14} /> : <Zap size={13} />}
              </button>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>19:45 Tech: {nextSyllabusItem ? `W${nextSyllabusItem.weekNumber}D${nextSyllabusItem.dayNumber} ${nextSyllabusItem.subtopic}` : 'Deep Architecture Study'}</span>
                  {loggedTechToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">✓ Logged</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  Pace: {syllabusPace?.statusLabel || 'On Track'} • 45m Architecture & Concurrency Deep Work
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {!loggedTechToday && (
                <button
                  onClick={handleInstantTech}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/20 transition-colors"
                  title="1-Tap Mark 45m Complete"
                >
                  Quick Done (45m)
                </button>
              )}
              <button
                onClick={() => setTechModalOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  loggedTechToday
                    ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
                }`}
              >
                {loggedTechToday ? 'Add Notes' : 'Study & Log'}
              </button>
            </div>
          </div>

          {/* Discipline 4: Speech Studio / Verbal Practice (21:15) */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedCommToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 hover:border-teal-500/40 border-white/5'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleInstantSpeech}
                title={loggedCommToday ? 'Speech practice logged today' : '1-Tap: Mark 15m Speech Complete'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform active:scale-95 ${
                  loggedCommToday 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-teal-500/20 text-teal-400 border border-white/10 hover:border-teal-500/30'
                }`}
              >
                {loggedCommToday ? <Check size={14} /> : <Mic size={13} />}
              </button>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>21:15 Speech: Explain {dsaFocusProblem?.name || 'Solution'} Out Loud</span>
                  {loggedCommToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">✓ Practiced</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  15 min verbal clarity • Mock Tier-1 interview communication
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {!loggedCommToday && (
                <button
                  onClick={handleInstantSpeech}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/20 transition-colors"
                  title="1-Tap Mark 15m Complete"
                >
                  Quick Done (15m)
                </button>
              )}
              <button
                onClick={() => navigate('/communication')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  loggedCommToday
                    ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    : 'bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border-teal-500/30'
                }`}
              >
                Speech Studio
              </button>
            </div>
          </div>

          {/* Discipline 5: Night Reflection & Journal (21:30) */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedJournalToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 hover:border-sky-500/40 border-white/5'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setJournalModalOpen(true)}
                title="Write Night Reflection"
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform active:scale-95 ${
                  loggedJournalToday 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-white/10 hover:bg-sky-500/20 text-sky-400 border border-white/10 hover:border-sky-500/30'
                }`}
              >
                {loggedJournalToday ? <Check size={14} /> : <BookOpen size={13} />}
              </button>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>21:30 Reflection: Night Journal & Lessons</span>
                  {loggedJournalToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">✓ Logged</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  What built, what confused, mood rating & lessons learned
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setJournalModalOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  loggedJournalToday
                    ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    : 'bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border-sky-500/30'
                }`}
              >
                {loggedJournalToday ? 'View/Edit' : 'Quick Journal'}
              </button>
            </div>
          </div>

        </div>

        {/* 100% Victory Banner */}
        {completedCount === 5 && (
          <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/40 text-center animate-fade-in">
            <span className="text-sm font-black text-emerald-300 font-mono flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-amber-400 animate-spin" />
              PERFECT DAY ACHIEVED! +250 XP AWARDED & ALL STREAKS EXTENDED
              <Sparkles size={16} className="text-amber-400 animate-spin" />
            </span>
          </div>
        )}
      </div>

      {/* QUICK LOG MODALS */}
      {/* 1. Quick Gym Modal */}
      <Modal isOpen={gymModalOpen} onClose={() => setGymModalOpen(false)} title="Quick Log Gym Workout">
        <form onSubmit={handleSaveGymModal} className="space-y-4">
          <Input 
            label="Workout Routine / Focus"
            value={gymType}
            onChange={(e) => setGymType(e.target.value)}
            placeholder="e.g. Upper Body Hypertrophy"
          />
          <Input 
            label="Duration (Minutes)"
            type="number"
            value={gymDuration}
            onChange={(e) => setGymDuration(Number(e.target.value))}
          />
          <Textarea 
            label="Workout Notes / Personal Records"
            value={gymNotes}
            onChange={(e) => setGymNotes(e.target.value)}
            rows={3}
            placeholder="How did the session feel? Any heavy sets?"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setGymModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Workout</Button>
          </div>
        </form>
      </Modal>

      {/* 2. Quick Tech Modal */}
      <Modal isOpen={techModalOpen} onClose={() => setTechModalOpen(false)} title="Log Deep Tech Study">
        <form onSubmit={handleSaveTechModal} className="space-y-4">
          <Input 
            label="Topic / Architecture Concept"
            value={techTopic}
            onChange={(e) => setTechTopic(e.target.value)}
          />
          <Input 
            label="Duration (Minutes)"
            type="number"
            value={techMinutes}
            onChange={(e) => setTechMinutes(Number(e.target.value))}
          />
          <Textarea 
            label="Key Insight / Takeaway"
            value={techNotes}
            onChange={(e) => setTechNotes(e.target.value)}
            rows={3}
            placeholder="What clicked today? Any trade-off learned?"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setTechModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Study Log</Button>
          </div>
        </form>
      </Modal>

      {/* 3. Quick Journal Modal */}
      <Modal isOpen={journalModalOpen} onClose={() => setJournalModalOpen(false)} title="Night Reflection & Journal">
        <form onSubmit={handleSaveJournalModal} className="space-y-3.5">
          <Textarea 
            label="1. What did I build / ship today?"
            value={journalBuilt}
            onChange={(e) => setJournalBuilt(e.target.value)}
            rows={2}
            placeholder="Specific features or code written..."
          />
          <Textarea 
            label="2. What did I learn today?"
            value={journalLearned}
            onChange={(e) => setJournalLearned(e.target.value)}
            rows={2}
            placeholder="Mental models, system design insights, algorithms..."
          />
          <Textarea 
            label="3. What confused me / need to revisit?"
            value={journalConfused}
            onChange={(e) => setJournalConfused(e.target.value)}
            rows={2}
            placeholder="Tricky questions or concepts..."
          />

          <div>
            <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1">
              Daily Mood Rating
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'GREAT', icon: '🔥' },
                { label: 'GOOD', icon: '😊' },
                { label: 'OKAY', icon: '😐' },
                { label: 'LOW', icon: '😔' },
                { label: 'BAD', icon: '😩' },
              ].map(m => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setJournalMood(m.label as any)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    journalMood === m.label 
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xl">{m.icon}</div>
                  <div className="text-[10px] mt-1">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setJournalModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Night Journal</Button>
          </div>
        </form>
      </Modal>

      {/* 4. Quick Speech Modal */}
      <Modal isOpen={speechModalOpen} onClose={() => setSpeechModalOpen(false)} title="Log Speech & Communication">
        <form onSubmit={handleSaveSpeechModal} className="space-y-4">
          <Input 
            label="Speaking Topic"
            value={speechTopic}
            onChange={(e) => setSpeechTopic(e.target.value)}
          />
          <Input 
            label="Duration (Minutes)"
            type="number"
            value={speechDuration}
            onChange={(e) => setSpeechDuration(Number(e.target.value))}
          />
          <Textarea 
            label="Self-Review / Notes"
            value={speechNotes}
            onChange={(e) => setSpeechNotes(e.target.value)}
            rows={3}
            placeholder="Did you use STAR technique? Any filler words?"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setSpeechModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Speech</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
