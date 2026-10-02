import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { RoadmapModal } from '../../components/dashboard/RoadmapModal';
import { FocusTimerModal } from '../../components/shared/FocusTimerModal';
import { InterviewReadinessModal } from '../../components/shared/InterviewReadinessModal';
import { useDsaStore } from '../../stores/dsaStore';
import { useDailyStore } from '../../stores/dailyStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { computeGodMode } from '../../engine/godModeEngine';
import { CURRICULUM_LEVELS } from '../../data/curriculumData';
import { getRoutineForToday } from '../../data/gymData';
import { 
  Brain, Code, Mic, CheckCircle2, Clock, 
  Calendar, Download, Upload, ArrowRight, ShieldCheck, Flame, Dumbbell,
  Check, Smartphone, Settings, Sparkles, Map, Target, Briefcase, ExternalLink, Share2, Copy,
  Volume2, VolumeX, Zap, RefreshCw, Cloud, Wifi, WifiOff
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import { 
  getSavedCloudUrl, setSavedCloudUrl, testCloudHealth, 
  syncPushToCloud, syncPullFromCloud, getExportSnapshot, importSnapshotString
} from '../../services/cloudSync';
import { 
  getSupabaseConfig, setSupabaseConfig, testSupabaseConnection, 
  pushToSupabase, pullFromSupabase 
} from '../../services/supabase';
import { populateDayOneEfforts } from '../../data/dayOneData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const dsaStore = useDsaStore();
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  const dailyStore = useDailyStore();
  const syllabusStore = useSyllabusStore();

  const [greeting, setGreeting] = useState('Good Morning');
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [readinessHubOpen, setReadinessHubOpen] = useState(false);
  const [selectedModalProblem, setSelectedModalProblem] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    soundService.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundService.playCheckSound();
  };

  const [attemptForm, setAttemptForm] = useState({
    timeTakenMin: 30,
    solvedIndependently: true,
    approach: '',
    mistake: '',
    complexityTime: 'O(n)',
    complexitySpace: 'O(1)',
    lesson: '',
    confidence: 4,
  });

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(getSupabaseConfig().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSettings, setShowSettings] = useState(!getSupabaseConfig().url || !getSupabaseConfig().anonKey);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [quickSyncing, setQuickSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    return localStorage.getItem('career-os-last-synced') || null;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Auto-configure from Magic Link if present
    const params = new URLSearchParams(window.location.search);
    const qUrl = params.get('supaUrl');
    const qKey = params.get('supaKey');
    if (qUrl && qKey) {
      setSupabaseConfig(qUrl, qKey);
      setSupabaseUrl(qUrl);
      setSupabaseKey(qKey);
      window.history.replaceState({}, document.title, window.location.pathname);
      setSyncModalOpen(true);
      setSyncMessage('🚀 Mobile Link paired! Pulling latest cloud data...');
      pullFromSupabase().then((res) => {
        if (res.success && res.data) {
          importSnapshotString(JSON.stringify(res.data));
          setSyncMessage('✓ Phone successfully paired and synced! Reloading...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setSyncMessage(res.message);
        }
      });
    }
  }, []);

  // Compute Core Metrics & Master Roadmap
  const solvedProblemIds = useMemo(() => new Set(dsaStore.attempts.map(a => a.problemId)), [dsaStore.attempts]);
  const godMode = useMemo(() => {
    return computeGodMode({
      attempts: dsaStore.attempts,
      revisions: dsaStore.revisions,
      sprintLogs: sprintStore.logs,
      commCount: dailyStore.communications.length,
      gymCount: dailyStore.gymSessions.length,
      syllabusCompletedCount: syllabusStore.completedItemIds.length,
    });
  }, [dsaStore.attempts, dsaStore.revisions, sprintStore.logs, dailyStore.communications.length, dailyStore.gymSessions.length, syllabusStore.completedItemIds.length]);

  const currentLevel = godMode.currentLevel;
  const currentLevelData = CURRICULUM_LEVELS.find(l => l.levelNumber === currentLevel) || CURRICULUM_LEVELS[0];

  const dueRevisions = dsaStore.getDueRevisions();
  const topicStats = dsaStore.getTopicStats();
  const bottleneckTopic = topicStats.length > 0 
    ? [...topicStats].sort((a, b) => a.avgConfidence - b.avgConfidence)[0]
    : null;

  const dsaStats = dsaStore.getStats();
  const streaks = dashboardStore.getStreaks();
  const dsaStreak = streaks.find(s => s.type === 'dsa')?.currentCount || 1;
  const activeSprint = sprintStore.getActiveSprint();
  const todayRoutine = getRoutineForToday();

  // Find next unsolved problem for today
  const randomUnsolvedProblem = () => {
    if (godMode.nextRecommendedProblem) return godMode.nextRecommendedProblem;
    if (!bottleneckTopic) return dsaStore.problems[0] || null;
    const problems = dsaStore.getProblemsByTopic(bottleneckTopic.topicId);
    const unsolved = problems.filter(p => p.attemptCount === 0);
    if (unsolved.length === 0) return problems[0] || null;
    return unsolved[0];
  };
  const dsaFocusProblem = randomUnsolvedProblem();

  // Daily Status Checking (YYYY-MM-DD)
  const todayDate = new Date().toISOString().split('T')[0];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const todaySchedule = dailyStore.getScheduleForDay(todayName) || [];

  const solvedDsaToday = dsaStore.attempts.some(a => a.attemptedAt.startsWith(todayDate));
  const loggedJournalToday = dailyStore.journals.some(j => j.date === todayDate);
  const syllabusPace = syllabusStore.getPaceAnalysis();
  const nextSyllabusItem = syllabusStore.getNextPendingItem();
  const completedSyllabusToday = Object.values(syllabusStore.completionDates).includes(todayDate);
  const loggedTechToday = completedSyllabusToday || sprintStore.logs.some(l => l.date === todayDate);
  const loggedCommToday = dailyStore.communications.some(c => c.date === todayDate);
  const loggedGymToday = dailyStore.gymSessions.some(g => g.date === todayDate && g.completed);

  const completedGoalsCount = 
    (solvedDsaToday ? 1 : 0) + 
    (loggedJournalToday ? 1 : 0) + 
    (loggedTechToday ? 1 : 0) + 
    (loggedCommToday ? 1 : 0) + 
    (loggedGymToday ? 1 : 0);

  // Cloud Actions
  const handleCopyMobileLink = () => {
    if (!supabaseUrl || !supabaseKey) {
      setSyncMessage('⚠️ Please configure Supabase URL & Key first.');
      return;
    }
    const currentOrigin = window.location.origin;
    const link = `${currentOrigin}/dashboard?supaUrl=${encodeURIComponent(supabaseUrl.trim())}&supaKey=${encodeURIComponent(supabaseKey.trim())}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleQuickSync = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setSyncModalOpen(true);
      setSyncMessage('💡 Supabase not configured yet. Add your URL & Key below to enable 1-Click Cloud Sync across devices.');
      return;
    }
    setQuickSyncing(true);
    try {
      setSupabaseConfig(supabaseUrl, supabaseKey);
      const snapshot = getExportSnapshot();
      const res = await pushToSupabase(snapshot);
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedTime(timeStr);
        localStorage.setItem('career-os-last-synced', timeStr);
        soundService.playCheckSound();
      } else {
        setSyncModalOpen(true);
        setSyncMessage(`Sync warning: ${res.message}`);
      }
    } catch (e: any) {
      setSyncModalOpen(true);
      setSyncMessage(`Sync error: ${e?.message || 'Network request failed'}`);
    } finally {
      setQuickSyncing(false);
    }
  };

  const handlePushSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Saving local progress to Supabase Cloud...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const snapshot = getExportSnapshot();
    const res = await pushToSupabase(snapshot);
    setSyncLoading(false);
    setSyncMessage(res.message);
    if (res.success) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(timeStr);
      localStorage.setItem('career-os-last-synced', timeStr);
      soundService.playCheckSound();
    }
  };

  const handlePullSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Syncing latest cloud progress...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const res = await pullFromSupabase();
    setSyncLoading(false);
    setSyncMessage(res.message);
    if (res.success && res.data) {
      importSnapshotString(JSON.stringify(res.data));
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  const handleTestSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Connecting to Supabase...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const res = await testSupabaseConnection();
    setSyncLoading(false);
    setSyncMessage(res.message);
  };

  const handleCopySql = () => {
    const sql = `-- Run this in Supabase SQL Editor:
create table if not exists career_os_sync (
  id text primary key default 'primary',
  payload jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table career_os_sync enable row level security;
create policy "Allow public access" on career_os_sync for all using (true) with check (true);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      dsa: localStorage.getItem('career-os-dsa'),
      daily: localStorage.getItem('career-os-daily'),
      sprint: localStorage.getItem('career-os-sprint'),
      syllabus: localStorage.getItem('career-os-syllabus'),
      portfolio: localStorage.getItem('career-os-portfolio'),
      dashboard: localStorage.getItem('career-os-dashboard'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careeros-backup-${todayDate}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.dsa) localStorage.setItem('career-os-dsa', data.dsa);
        if (data.daily) localStorage.setItem('career-os-daily', data.daily);
        if (data.sprint) localStorage.setItem('career-os-sprint', data.sprint);
        if (data.syllabus) localStorage.setItem('career-os-syllabus', data.syllabus);
        if (data.portfolio) localStorage.setItem('career-os-portfolio', data.portfolio);
        if (data.dashboard) localStorage.setItem('career-os-dashboard', data.dashboard);
        alert('Backup successfully restored! Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveDsaAttempt = () => {
    const targetProblem = selectedModalProblem || dsaFocusProblem;
    if (!targetProblem) return;
    dsaStore.logAttempt(targetProblem.id, attemptForm);
    dashboardStore.updateStreak('dsa');
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-panel relative border border-white/10 shadow-sm gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <span>{greeting}, {userName}</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto justify-start sm:justify-end flex-nowrap">
          {/* Tier-1 Interview Hub */}
          <button
            onClick={() => setReadinessHubOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
            title="Open Tier-1 Interview Readiness & Pattern Matrix"
          >
            <Zap size={13} className="text-amber-400" />
            <span className="inline">Interview Hub</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 font-mono">{godMode.readinessScore}%</span>
          </button>

          {/* Master Roadmap Button */}
          <button
            onClick={() => setRoadmapOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
            title="View 6-Level Master Roadmap"
          >
            <Map size={13} />
            <span className="inline">Roadmap</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20">L{currentLevel}</span>
          </button>

          {/* 90/20 Focus Timer */}
          <button
            onClick={() => setTimerOpen(true)}
            className="shrink-0 px-2.5 py-1.5 rounded-xl font-mono text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 flex items-center gap-1.5 transition-all"
            title="Start 90/20 Deep Work Focus Session"
          >
            <Clock size={13} />
            <span className="hidden md:inline">Focus</span>
          </button>

          {/* Tactile Audio Toggle */}
          <button
            onClick={toggleSound}
            className={`shrink-0 p-1.5 rounded-xl border flex items-center justify-center transition-all ${
              soundEnabled
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/30 hover:bg-blue-600/25'
                : 'bg-white/5 text-gray-500 border-white/10 hover:text-gray-300'
            }`}
            title={soundEnabled ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Ambient Auto-Save & 1-Click Cloud Sync Pill */}
          <div className="shrink-0 flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-0.5 shadow-sm">
            <button 
              onClick={handleQuickSync}
              disabled={quickSyncing}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
                quickSyncing
                  ? 'bg-blue-500/20 text-blue-300 animate-pulse'
                  : supabaseUrl && supabaseKey
                    ? 'text-emerald-400 hover:bg-emerald-500/10'
                    : 'text-gray-300 hover:bg-white/10'
              }`}
              title={
                !isOnline 
                  ? 'Offline: Changes auto-saved locally' 
                  : supabaseUrl && supabaseKey 
                    ? `Click to 1-Click Cloud Sync (Last sync: ${lastSyncedTime || 'Never'})` 
                    : 'Auto-Saved locally. Click to pair Supabase Cloud'
              }
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                !isOnline 
                  ? 'bg-amber-400' 
                  : quickSyncing 
                    ? 'bg-blue-400 animate-ping' 
                    : supabaseUrl && supabaseKey 
                      ? 'bg-emerald-400 animate-pulse' 
                      : 'bg-emerald-500'
              }`} />
              <RefreshCw size={12} className={`shrink-0 ${quickSyncing ? 'animate-spin text-blue-400' : 'text-gray-400'}`} />
              <span className="hidden sm:inline font-sans font-medium text-[11px] whitespace-nowrap">
                {quickSyncing 
                  ? 'Syncing...' 
                  : supabaseUrl && supabaseKey 
                    ? (lastSyncedTime ? `Synced ${lastSyncedTime}` : 'Cloud Synced') 
                    : 'Saved Locally'}
              </span>
            </button>
            <button
              onClick={() => { setSyncModalOpen(true); setSyncMessage(null); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Cloud Sync Settings & Phone Pairing"
            >
              <Settings size={13} />
            </button>
          </div>

          {/* Backup Buttons */}
          <button 
            onClick={handleExportBackup}
            className="shrink-0 p-1.5 rounded-xl glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-white/10"
            title="Export JSON snapshot"
          >
            <Download size={14} className="text-sky-400" />
          </button>

          <label className="shrink-0 p-1.5 rounded-xl glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-white/10 cursor-pointer" title="Restore JSON snapshot">
            <Upload size={14} className="text-purple-400" />
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* 2. Top Telemetry Row (4 Micro-KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* KPI 1: Master Level & Readiness */}
        <div 
          onClick={() => setReadinessHubOpen(true)}
          className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
          title="Click to view Tier-1 Interview Readiness & Pattern Matrix"
        >
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Sparkles size={13} /> INTERVIEW READINESS</span>
            <span>{godMode.readinessScore}% Ready</span>
          </div>
          <div className="text-base sm:text-lg font-black text-[var(--text-primary)] font-mono mt-1 truncate">
            Level {currentLevel}: {currentLevelData.title.split('&')[0]}
          </div>
          <div className="text-[10px] text-purple-400/80 mt-0.5 font-mono truncate">
            15 Patterns & Tech Traps ↗
          </div>
        </div>

        {/* KPI 2: DSA Mastery */}
        <div 
          onClick={() => navigate('/dsa')}
          className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Brain size={13} /> DSA SHEET</span>
            <span>{Math.round((dsaStats.totalSolved / (dsaStats.totalProblems || 94)) * 100)}%</span>
          </div>
          <div className="text-base sm:text-lg font-black text-[var(--text-primary)] font-mono mt-1">
            {dsaStats.totalSolved} <span className="text-xs text-[var(--text-secondary)] font-normal">/ {dsaStats.totalProblems}</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-mono">
            <span className="text-emerald-400">{dsaStats.easy}E</span> • <span className="text-amber-400">{dsaStats.medium}M</span> • <span className="text-rose-400">{dsaStats.hard}H</span>
          </div>
        </div>

        {/* KPI 3: Today's Gym Split */}
        <div 
          onClick={() => navigate('/gym')}
          className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-orange-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between text-[11px] text-orange-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Dumbbell size={13} /> TODAY'S SPLIT</span>
            <span>{todayRoutine.estimatedMinutes}m</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-[var(--text-primary)] truncate mt-1">
            {todayRoutine.title.split('(')[0]}
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] truncate mt-0.5 font-mono">
            {loggedGymToday ? '✓ Session Completed' : 'Scheduled for today'}
          </div>
        </div>

        {/* KPI 4: Momentum Streak */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Flame size={13} /> MOMENTUM</span>
            <span>🔥</span>
          </div>
          <div className="text-base sm:text-lg font-black text-[var(--text-primary)] font-mono mt-1">
            {dsaStreak} <span className="text-xs text-[var(--text-secondary)] font-normal">Days Active</span>
          </div>
          <div className="text-[10px] text-amber-400/80 mt-0.5 font-mono">
            {godMode.playerRank}
          </div>
        </div>
      </div>

      {/* 3. TODAY'S MISSION: The 5 Non-Negotiable Goals */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-black text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Today's Mission (What To Do Today)
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {completedGoalsCount}/5 Completed
            </span>
            <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" 
                style={{ width: `${(completedGoalsCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5 Distinct Goal Rows */}
        <div className="space-y-2 pt-1">
          {/* Goal 1: Morning DSA Problem */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            solvedDsaToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 dark:bg-black/30 border-white/5 hover:border-blue-500/30'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                solvedDsaToday ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-[var(--text-secondary)]'
              }`}>
                {solvedDsaToday ? <Check size={13} /> : '1'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>DSA: {dsaFocusProblem?.name || 'Two Sum'}</span>
                  {solvedDsaToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Solved</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  {dsaFocusProblem?.difficulty || 'EASY'} • {dsaFocusProblem?.pattern || 'Hash Map'} • {bottleneckTopic?.name || 'Arrays'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedModalProblem(dsaFocusProblem);
                setLogModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-xs border border-blue-500/30 flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              {solvedDsaToday ? 'Log Another' : 'Solve & Log'}
            </button>
          </div>

          {/* Goal 2: Workday Synergy Goal */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedJournalToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 dark:bg-black/30 border-white/5 hover:border-sky-500/30'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                loggedJournalToday ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-[var(--text-secondary)]'
              }`}>
                {loggedJournalToday ? <Check size={13} /> : '2'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>Workday: {currentLevelData.practicalWorkAction.split(';')[0]}</span>
                  {loggedJournalToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Logged</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  Current Company Growth • Apply to your job codebase & log reflections
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/journal')}
              className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 font-bold text-xs border border-sky-500/30 flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              {loggedJournalToday ? 'View Entry' : 'Log Journal'}
            </button>
          </div>

          {/* Goal 3: Evening Tech Syllabus */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedTechToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 dark:bg-black/30 border-white/5 hover:border-purple-500/30'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                loggedTechToday ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-[var(--text-secondary)]'
              }`}>
                {loggedTechToday ? <Check size={13} /> : '3'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>Tech: {nextSyllabusItem ? `W${nextSyllabusItem.weekNumber}D${nextSyllabusItem.dayNumber} — ${nextSyllabusItem.subtopic}` : 'All 8 Weeks Completed!'}</span>
                  {loggedTechToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Completed</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  Pace: {syllabusPace.statusLabel} • {syllabusPace.completedCount}/40 Done • 45m deep architecture study
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/sprint')}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              {loggedTechToday ? 'View Syllabus' : 'Study & Mark Done'}
            </button>
          </div>

          {/* Goal 4: Speech Studio Practice */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedCommToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 dark:bg-black/30 border-white/5 hover:border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                loggedCommToday ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-[var(--text-secondary)]'
              }`}>
                {loggedCommToday ? <Check size={13} /> : '4'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>Speech: Explain {dsaFocusProblem?.name || 'Two Sum'}</span>
                  {loggedCommToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Recorded</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  5 min verbal walkthrough out loud • Simulating Tier-1 interview dialogue
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/communication')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              {loggedCommToday ? 'Practice More' : 'Record Speech'}
            </button>
          </div>

          {/* Goal 5: Daily Gym Workout */}
          <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            loggedGymToday 
              ? 'bg-emerald-500/5 border-emerald-500/30' 
              : 'bg-black/20 dark:bg-black/30 border-white/5 hover:border-orange-500/30'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                loggedGymToday ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white/10 text-[var(--text-secondary)]'
              }`}>
                {loggedGymToday ? <Check size={13} /> : '5'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate flex items-center gap-2">
                  <span>Gym: {todayRoutine.title}</span>
                  {loggedGymToday && (
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Finished</span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                  {todayRoutine.estimatedMinutes} mins • {todayRoutine.description.split('.')[0]}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/gym')}
              className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 font-bold text-xs border border-orange-500/30 flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              {loggedGymToday ? 'View Workout' : 'Track Gym'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Spaced Repetition Due Alert (Conditional) */}
      {dueRevisions.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock size={16} className="text-purple-400 flex-shrink-0" />
            <div className="truncate text-xs">
              <span className="font-bold text-[var(--text-primary)]">{dueRevisions.length} Spaced Repetition Due Today</span>
              <span className="text-[var(--text-secondary)] ml-1.5 hidden sm:inline">({dueRevisions[0]?.problemName})</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dsa')}
            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex-shrink-0 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
          >
            Review Now
          </button>
        </div>
      )}

      {/* 5. Today's Schedule Glance (Showing current day blocks) */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-sky-400" />
            <h3 className="font-bold text-[var(--text-primary)] text-xs sm:text-sm font-mono uppercase tracking-wider">
              Today's Schedule ({todayName})
            </h3>
          </div>
          <button 
            onClick={() => navigate('/schedule')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-colors"
          >
            Full Timetable
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
          {todaySchedule.length === 0 ? (
            <p className="col-span-full text-xs text-gray-500 py-3 text-center">No blocks set for {todayName}.</p>
          ) : (
            todaySchedule.map((block, idx) => {
              const badgeColor = 
                block.category === 'study' ? 'text-blue-400 bg-blue-500/10' :
                block.category === 'gym' ? 'text-orange-400 bg-orange-500/10' :
                block.category === 'work' ? 'text-amber-400 bg-amber-500/10' :
                'text-gray-400 bg-white/5';

              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5 text-xs">
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span className="font-mono text-[10px] text-[var(--text-secondary)] flex-shrink-0">{block.time}</span>
                    <span className="font-medium text-[var(--text-primary)] truncate">{block.activity}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase flex-shrink-0 ${badgeColor}`}>
                    {block.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. Quick Habit Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <button 
          onClick={() => navigate('/journal')}
          className="p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/10 hover:border-sky-500/30 flex items-center justify-center gap-2 text-xs text-[var(--text-primary)] font-semibold transition-all"
        >
          <CheckCircle2 size={15} className="text-sky-400" />
          <span className="truncate">Journal</span>
        </button>

        <button 
          onClick={() => navigate('/gym')}
          className="p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/10 hover:border-orange-500/30 flex items-center justify-center gap-2 text-xs text-[var(--text-primary)] font-semibold transition-all"
        >
          <Dumbbell size={15} className="text-orange-400" />
          <span className="truncate">Gym Tracker</span>
        </button>

        <button 
          onClick={() => navigate('/review')}
          className="p-3 rounded-xl bg-black/30 hover:bg-white/5 border border-white/10 hover:border-purple-500/30 flex items-center justify-center gap-2 text-xs text-[var(--text-primary)] font-semibold transition-all"
        >
          <ShieldCheck size={15} className="text-purple-400" />
          <span className="truncate">Weekly Review</span>
        </button>
      </div>

      {/* Log Problem Modal */}
      <Modal 
        isOpen={logModalOpen} 
        onClose={() => { setLogModalOpen(false); setSelectedModalProblem(null); }} 
        title={`Log Solution: ${selectedModalProblem?.name || dsaFocusProblem?.name || 'Problem'}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="Time Taken (Minutes)" 
              value={attemptForm.timeTakenMin} 
              onChange={(e) => setAttemptForm({...attemptForm, timeTakenMin: parseInt(e.target.value) || 0})} 
            />
            <div className="flex items-center gap-2 pt-6">
              <input 
                type="checkbox" 
                id="dash-indep" 
                checked={attemptForm.solvedIndependently} 
                onChange={(e) => setAttemptForm({...attemptForm, solvedIndependently: e.target.checked})} 
                className="w-4 h-4 rounded text-blue-600"
              />
              <label htmlFor="dash-indep" className="text-sm text-gray-300 font-medium">Solved without hints?</label>
            </div>
          </div>

          <Textarea 
            label="Approach & Core Logic" 
            placeholder="Key data structure or pointer pattern used..." 
            value={attemptForm.approach} 
            onChange={(e) => setAttemptForm({...attemptForm, approach: e.target.value})} 
            rows={2} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Time Complexity" 
              value={attemptForm.complexityTime} 
              onChange={(e) => setAttemptForm({...attemptForm, complexityTime: e.target.value})} 
              placeholder="O(N)" 
            />
            <Input 
              label="Space Complexity" 
              value={attemptForm.complexitySpace} 
              onChange={(e) => setAttemptForm({...attemptForm, complexitySpace: e.target.value})} 
              placeholder="O(1)" 
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)] font-medium">Recall Confidence</label>
            <ConfidenceStars value={attemptForm.confidence} onChange={(v) => setAttemptForm({...attemptForm, confidence: v})} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDsaAttempt}>Save Solution & Schedule Revisions</Button>
          </div>
        </div>
      </Modal>

      {/* Master 6-Level Roadmap Modal */}
      <RoadmapModal
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
        currentLevel={currentLevel}
        solvedProblemIds={solvedProblemIds}
        onSelectProblem={(probId) => {
          const prob = dsaStore.problems.find(p => p.id === probId);
          if (prob) {
            setSelectedModalProblem(prob);
            setRoadmapOpen(false);
            setLogModalOpen(true);
          }
        }}
      />

      {/* Tier-1 Interview Readiness & Practice Hub */}
      <InterviewReadinessModal
        isOpen={readinessHubOpen}
        onClose={() => setReadinessHubOpen(false)}
        onSelectProblemForLog={(prob) => {
          setSelectedModalProblem(prob);
          setLogModalOpen(true);
        }}
      />

      {/* 90/20 Ultradian Focus Timer */}
      <FocusTimerModal
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
        taskTitle={`90m Deep Focus: Level ${currentLevel} Engineering`}
      />

      {/* Cloud Sync & Phone Pairing Modal */}
      <Modal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        title="Sync Phone & Laptop"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">Cloud Sync Ready</div>
                <div className="text-[11px] text-emerald-300">Instant Sync • Laptop & Phone</div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 transition-colors"
            >
              <Settings size={12} />
              <span>{showSettings ? 'Hide Settings' : 'Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handlePushSupabase}
              disabled={syncLoading}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center gap-2 text-center active:scale-[0.98]"
            >
              <Upload size={22} className="text-white" />
              <div>
                <div className="text-xs font-extrabold tracking-wide">Save to Cloud</div>
                <div className="text-[10px] text-blue-200 font-normal mt-0.5">Upload progress from this device</div>
              </div>
            </button>

            <button
              onClick={handlePullSupabase}
              disabled={syncLoading}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center gap-2 text-center active:scale-[0.98]"
            >
              <Download size={22} className="text-white" />
              <div>
                <div className="text-xs font-extrabold tracking-wide">Sync to Device</div>
                <div className="text-[10px] text-emerald-200 font-normal mt-0.5">Download progress to this device</div>
              </div>
            </button>
          </div>

          {syncMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              syncMessage.includes('✓') 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                : syncMessage.includes('⚠️') || syncMessage.includes('Error') || syncMessage.includes('failed')
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
            }`}>
              <CheckCircle2 size={14} className="flex-shrink-0 text-emerald-400" />
              <span>{syncMessage}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#090b10] border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Smartphone size={15} className="text-sky-400" />
                <span>Open on Your Phone</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">1-Click Pair</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Send this link to yourself on WhatsApp or Notes. Opening it on your phone connects it and syncs your progress automatically with no typing!
            </p>
            <button
              onClick={handleCopyMobileLink}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              {copiedLink ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} />}
              <span>{copiedLink ? '✓ Link Copied! Send to your phone' : 'Copy Phone Sync Link'}</span>
            </button>
          </div>

          {showSettings && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#090b10] border border-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">Connection Settings</span>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-[11px] text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => {
                    setSupabaseUrl(e.target.value);
                    setSupabaseConfig(e.target.value, supabaseKey);
                  }}
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Anon Public Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => {
                    setSupabaseKey(e.target.value);
                    setSupabaseConfig(supabaseUrl, e.target.value);
                  }}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleTestSupabase}
                  disabled={syncLoading}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Test Connection</span>
                </button>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors flex items-center gap-1"
                  title="Copy table SQL snippet if needed"
                >
                  {copiedSql ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedSql ? 'SQL Copied' : 'Copy Table SQL'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span className="text-[11px]">Offline JSON backup:</span>
            <div className="flex items-center gap-2">
              <button onClick={handleExportBackup} className="text-sky-400 hover:underline text-[11px]">
                Download
              </button>
              <span>•</span>
              <label className="text-purple-400 hover:underline cursor-pointer text-[11px]">
                Restore
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
              <span>•</span>
              <button 
                onClick={() => {
                  populateDayOneEfforts();
                  setSyncMessage('✓ Day 1 efforts loaded!');
                  setTimeout(() => window.location.reload(), 800);
                }} 
                className="text-emerald-400 hover:underline text-[11px]"
              >
                Pre-fill Day 1
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
