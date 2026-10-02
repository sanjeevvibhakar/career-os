import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StreakBadge } from '../../components/shared/StreakBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { useDsaStore } from '../../stores/dsaStore';
import { useDailyStore } from '../../stores/dailyStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { computeGodMode } from '../../engine/godModeEngine';
import { GodModeIntelligenceCard } from '../../components/dashboard/GodModeIntelligenceCard';
import { 
  Brain, Code, Mic, Activity, CheckCircle2, Clock, 
  Calendar, Download, Upload, ArrowRight, ShieldCheck, Flame, PlusCircle, Dumbbell,
  Cloud, Smartphone, Laptop, RefreshCw, Check, Database, Copy, Zap, ExternalLink, Share2, Settings
} from 'lucide-react';
import { 
  getSavedCloudUrl, setSavedCloudUrl, testCloudHealth, 
  syncPushToCloud, syncPullFromCloud, getExportSnapshot, importSnapshotString
} from '../../services/cloudSync';
import { 
  getSupabaseConfig, setSupabaseConfig, testSupabaseConnection, 
  pushToSupabase, pullFromSupabase 
} from '../../services/supabase';
import { populateDayOneEfforts } from '../../data/dayOneData.ts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const dsaStore = useDsaStore();
  const sprintStore = useSprintStore();
  const dashboardStore = useDashboardStore();
  const dailyStore = useDailyStore();

  const [greeting, setGreeting] = useState('Good Morning');
  const [logModalOpen, setLogModalOpen] = useState(false);
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
  const [syncTab, setSyncTab] = useState<'supabase' | 'backup'>('supabase');
  const [cloudUrl, setCloudUrl] = useState(getSavedCloudUrl());
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(getSupabaseConfig().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSettings, setShowSettings] = useState(!getSupabaseConfig().url || !getSupabaseConfig().anonKey);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleCopyMobileLink = () => {
    if (!supabaseUrl || !supabaseKey) {
      setSyncMessage('⚠️ Please enter your Supabase Project URL and Anon Key first.');
      return;
    }
    const currentOrigin = window.location.origin;
    const link = `${currentOrigin}/dashboard?supaUrl=${encodeURIComponent(supabaseUrl.trim())}&supaKey=${encodeURIComponent(supabaseKey.trim())}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleTestSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Connecting to Supabase PostgreSQL...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const res = await testSupabaseConnection();
    setSyncLoading(false);
    setSyncMessage(res.message);
  };

  const handlePushSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Uploading to Supabase PostgreSQL...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const snapshot = getExportSnapshot();
    const res = await pushToSupabase(snapshot);
    setSyncLoading(false);
    setSyncMessage(res.message);
  };

  const handlePullSupabase = async () => {
    setSyncLoading(true);
    setSyncMessage('Pulling from Supabase PostgreSQL to this device...');
    setSupabaseConfig(supabaseUrl, supabaseKey);
    const res = await pullFromSupabase();
    setSyncLoading(false);
    setSyncMessage(res.message);
    if (res.success && res.data) {
      importSnapshotString(JSON.stringify(res.data));
      setTimeout(() => window.location.reload(), 1200);
    }
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

  const handleTestCloud = async () => {
    setSyncLoading(true);
    setSyncMessage('Pinging backend server...');
    const ok = await testCloudHealth(cloudUrl);
    setSyncLoading(false);
    if (ok) {
      setSyncMessage('✓ Cloud Backend is ONLINE and responding!');
    } else {
      setSyncMessage('⚠️ Cloud Backend is asleep or unreachable. Render wakes up in ~30s if sleeping.');
    }
  };

  const handlePush = async () => {
    setSyncLoading(true);
    setSyncMessage('Uploading local data to cloud database...');
    setSavedCloudUrl(cloudUrl);
    const res = await syncPushToCloud(cloudUrl);
    setSyncLoading(false);
    setSyncMessage(res.message);
  };

  const handlePull = async () => {
    setSyncLoading(true);
    setSyncMessage('Downloading latest cloud data to this device...');
    setSavedCloudUrl(cloudUrl);
    const res = await syncPullFromCloud(cloudUrl);
    setSyncLoading(false);
    setSyncMessage(res.message);
    if (res.success) {
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Auto-configure from Magic Link if present (e.g. opened from phone)
    const params = new URLSearchParams(window.location.search);
    const qUrl = params.get('supaUrl');
    const qKey = params.get('supaKey');
    if (qUrl && qKey) {
      setSupabaseConfig(qUrl, qKey);
      setSupabaseUrl(qUrl);
      setSupabaseKey(qKey);
      window.history.replaceState({}, document.title, window.location.pathname);
      setSyncModalOpen(true);
      setSyncMessage('🚀 Magic Mobile Link detected! Pulling latest cloud data...');
      pullFromSupabase().then((res) => {
        if (res.success && res.data) {
          importSnapshotString(JSON.stringify(res.data));
          setSyncMessage('✓ Phone successfully paired and synced from Supabase! Reloading...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setSyncMessage(res.message);
        }
      });
    }
  }, []);

  const dueRevisions = dsaStore.getDueRevisions();
  const topicStats = dsaStore.getTopicStats();
  const bottleneckTopic = topicStats.length > 0 
    ? [...topicStats].sort((a, b) => a.avgConfidence - b.avgConfidence)[0]
    : null;

  const randomUnsolvedProblem = () => {
    if (!bottleneckTopic) return null;
    const problems = dsaStore.getProblemsByTopic(bottleneckTopic.topicId);
    const unsolved = problems.filter(p => p.attemptCount === 0);
    if (unsolved.length === 0) return problems[0] || null;
    return unsolved[0];
  };

  const dsaFocusProblem = randomUnsolvedProblem();
  const activeSprint = sprintStore.getActiveSprint();
  const streaks = dashboardStore.getStreaks();

  // KPI Metrics Calculation
  const dsaStats = dsaStore.getStats();
  const totalSolved = dsaStats.totalSolved;
  const commLogs = dailyStore.getRecentCommunications(10);
  const commCount = commLogs.length;
  const dsaStreak = streaks.find(s => s.type === 'dsa')?.currentCount || 1;

  // Today's non-negotiable status
  const todayDate = new Date().toISOString().split('T')[0];
  const solvedDsaToday = dsaStore.attempts.some(a => a.attemptedAt.startsWith(todayDate));
  const loggedTechToday = sprintStore.logs.some(l => l.date === todayDate);
  const loggedCommToday = dailyStore.communications.some(c => c.date === todayDate);
  const completedTodayCount = (solvedDsaToday ? 1 : 0) + (loggedTechToday ? 1 : 0) + (loggedCommToday ? 1 : 0);

  // Get current day schedule
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[new Date().getDay()].toUpperCase();
  const todaySchedule = dailyStore.getScheduleForDay(todayName) || [];

  // Backup & Restore
  const handleExportBackup = () => {
    const backupData = {
      dsa: localStorage.getItem('career-os-dsa'),
      daily: localStorage.getItem('career-os-daily'),
      sprint: localStorage.getItem('career-os-sprint'),
      dashboard: localStorage.getItem('career-os-dashboard'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careeros-backup-${new Date().toISOString().split('T')[0]}.json`;
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
        if (data.dashboard) localStorage.setItem('career-os-dashboard', data.dashboard);
        alert('Backup successfully restored! Reloading dashboard...');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const solvedProblemIds = useMemo(() => new Set(dsaStore.attempts.map(a => a.problemId)), [dsaStore.attempts]);
  const godMode = useMemo(() => {
    return computeGodMode({
      attempts: dsaStore.attempts,
      revisions: dsaStore.revisions,
      sprintLogs: sprintStore.logs,
      commCount: dailyStore.communications.length,
      gymCount: dailyStore.gymSessions.length,
    });
  }, [dsaStore.attempts, dsaStore.revisions, sprintStore.logs, dailyStore.communications.length, dailyStore.gymSessions.length]);

  const [selectedModalProblem, setSelectedModalProblem] = useState<any>(null);

  const handleSaveDsaAttempt = () => {
    const targetProblem = selectedModalProblem || dsaFocusProblem;
    if (!targetProblem) return;
    dsaStore.logAttempt(targetProblem.id, attemptForm);
    dashboardStore.updateStreak('dsa');
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Slim Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-5 rounded-2xl glass-panel relative border border-white/10">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, {userName}</span>
          </h1>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Sync & Backup Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => { setSyncModalOpen(true); setSyncMessage(null); }}
            className={`px-2.5 py-1.5 rounded-xl font-semibold text-xs border flex items-center gap-1.5 transition-all shadow-sm ${
              supabaseUrl && supabaseKey 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${supabaseUrl && supabaseKey ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
            <span className="text-xs font-semibold">{supabaseUrl && supabaseKey ? 'Cloud Active' : 'Sync'}</span>
          </button>

          <button 
            onClick={handleExportBackup}
            className="p-1.5 rounded-xl glass-panel text-gray-300 hover:text-white border border-white/10"
            title="Export JSON snapshot"
          >
            <Download size={14} className="text-sky-400" />
          </button>

          <label className="p-1.5 rounded-xl glass-panel text-gray-300 hover:text-white border border-white/10 cursor-pointer" title="Restore JSON snapshot">
            <Upload size={14} className="text-purple-400" />
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* God Mode Cognitive Advisor & Adaptive Intelligence */}
      <GodModeIntelligenceCard
        godMode={godMode}
        solvedProblemIds={solvedProblemIds}
        onOpenSolveModal={(prob) => {
          setSelectedModalProblem(prob);
          setLogModalOpen(true);
        }}
      />

      {/* Top 4 Micro-KPIs Strip (Zero Fluff Text) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* KPI 1: DSA */}
        <div 
          onClick={() => navigate('/dsa')}
          className="glass-panel p-3 rounded-xl border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Brain size={13} /> DSA</span>
            <span>{((totalSolved / 80) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
            {totalSolved} <span className="text-xs text-gray-400 font-normal">/ 80</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
            <span className="text-emerald-400">{dsaStats.easy}E</span> • <span className="text-amber-400">{dsaStats.medium}M</span> • <span className="text-rose-400">{dsaStats.hard}H</span>
          </div>
        </div>

        {/* KPI 2: Tech Sprint */}
        <div 
          onClick={() => navigate('/sprint')}
          className="glass-panel p-3 rounded-xl border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Code size={13} /> TECH</span>
            <span>W{activeSprint?.currentWeek || 1}</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate mt-1">
            {activeSprint?.technology || 'Java 21'}
          </div>
          <div className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
            {activeSprint?.weeks.find(w => w.weekNumber === activeSprint.currentWeek)?.focus || 'Concurrency'}
          </div>
        </div>

        {/* KPI 3: Speech Practice */}
        <div 
          onClick={() => navigate('/communication')}
          className="glass-panel p-3 rounded-xl border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Mic size={13} /> SPEECH</span>
            <span className="text-[10px] text-emerald-300 font-semibold">Ready</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
            {commCount} <span className="text-xs text-gray-400 font-normal">Sess</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
            Articulation Logs
          </div>
        </div>

        {/* KPI 4: Momentum Streak */}
        <div 
          className="glass-panel p-3 rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold font-mono">
            <span className="flex items-center gap-1"><Flame size={13} /> STREAK</span>
            <span>🔥</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
            {dsaStreak} <span className="text-xs text-gray-400 font-normal">Days</span>
          </div>
          <div className="text-[10px] text-amber-400/80 mt-0.5 font-mono">
            Winter Arc Active
          </div>
        </div>
      </div>

      {/* Today's 3 Non-Negotiables: Sleek 1-Line Interactive Rows */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              Today's 3 Non-Negotiables
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {completedTodayCount}/3 Done
            </span>
            <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                style={{ width: `${(completedTodayCount / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {/* 1. DSA Problem */}
          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
            solvedDsaToday 
              ? 'bg-emerald-500/5 border-emerald-500/25' 
              : 'bg-black/30 border-white/5 hover:border-blue-500/30'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                solvedDsaToday ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {solvedDsaToday ? <Check size={12} /> : '1'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                  <span>DSA: {dsaFocusProblem?.name || 'Two Sum'}</span>
                  {solvedDsaToday && <span className="text-[10px] text-emerald-400 font-mono">✓ Solved</span>}
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  {dsaFocusProblem?.pattern || 'Pattern'} • {bottleneckTopic?.name || 'Topic'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setLogModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs border border-blue-500/30 flex-shrink-0 transition-colors"
            >
              {solvedDsaToday ? 'Log Another' : 'Solve & Log'}
            </button>
          </div>

          {/* 2. Tech Focus */}
          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
            loggedTechToday 
              ? 'bg-emerald-500/5 border-emerald-500/25' 
              : 'bg-black/30 border-white/5 hover:border-purple-500/30'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                loggedTechToday ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {loggedTechToday ? <Check size={12} /> : '2'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                  <span>Tech: {activeSprint?.weeks.find(w => w.weekNumber === activeSprint.currentWeek)?.focus || 'Java 21 Concurrency'}</span>
                  {loggedTechToday && <span className="text-[10px] text-emerald-400 font-mono">✓ Logged</span>}
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  {activeSprint?.technology || 'Java 21'} • 45m deep focus
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/sprint')}
              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs border border-purple-500/30 flex-shrink-0 transition-colors"
            >
              {loggedTechToday ? 'View' : 'Open'}
            </button>
          </div>

          {/* 3. Speech Studio */}
          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
            loggedCommToday 
              ? 'bg-emerald-500/5 border-emerald-500/25' 
              : 'bg-black/30 border-white/5 hover:border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                loggedCommToday ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {loggedCommToday ? <Check size={12} /> : '3'}
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                  <span>Speech: Explain {dsaFocusProblem?.name || 'Two Sum'}</span>
                  {loggedCommToday && <span className="text-[10px] text-emerald-400 font-mono">✓ Spoken</span>}
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  5 min verbal intuition practice
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/communication')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex-shrink-0 transition-colors"
            >
              {loggedCommToday ? 'Practice More' : 'Speak'}
            </button>
          </div>
        </div>
      </div>

      {/* Due Revisions Alert (If Any) */}
      {dueRevisions.length > 0 && (
        <div className="p-3 sm:p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock size={16} className="text-purple-400 flex-shrink-0" />
            <div className="truncate text-xs">
              <span className="font-bold text-white">{dueRevisions.length} Revision Due Today</span>
              <span className="text-gray-400 ml-1.5 hidden sm:inline">({dueRevisions[0]?.problemName})</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dsa')}
            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex-shrink-0"
          >
            Review
          </button>
        </div>
      )}

      {/* Compact Timetable Glance */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-sky-400" />
            <h3 className="font-bold text-white text-xs sm:text-sm font-mono uppercase tracking-wider">
              Today's Schedule ({todayName})
            </h3>
          </div>
          <button 
            onClick={() => navigate('/schedule')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20"
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
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-xs">
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span className="font-mono text-[10px] text-gray-400 flex-shrink-0">{block.time}</span>
                    <span className="font-medium text-white truncate">{block.activity}</span>
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

      {/* Habit 1-Tap Shortcuts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button 
          onClick={() => navigate('/journal')}
          className="p-2.5 sm:p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-sky-500/30 flex items-center justify-center gap-1.5 text-xs text-gray-300 font-medium transition-all"
        >
          <CheckCircle2 size={14} className="text-sky-400" />
          <span className="truncate">Journal</span>
        </button>

        <button 
          onClick={() => navigate('/gym')}
          className="p-2.5 sm:p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-orange-500/30 flex items-center justify-center gap-1.5 text-xs text-gray-300 font-medium transition-all"
        >
          <Dumbbell size={14} className="text-orange-400" />
          <span className="truncate">Gym Log</span>
        </button>

        <button 
          onClick={() => navigate('/review')}
          className="p-2.5 sm:p-3 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-purple-500/30 flex items-center justify-center gap-1.5 text-xs text-gray-300 font-medium transition-all"
        >
          <ShieldCheck size={14} className="text-purple-400" />
          <span className="truncate">Review</span>
        </button>
      </div>

      {/* Log Problem Modal */}
      <Modal 
        isOpen={logModalOpen} 
        onClose={() => { setLogModalOpen(false); setSelectedModalProblem(null); }} 
        title={`Log Solution: ${selectedModalProblem?.name || dsaFocusProblem?.name || 'Problem'}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            placeholder="Key data structure or pointer trick used..." 
            value={attemptForm.approach} 
            onChange={(e) => setAttemptForm({...attemptForm, approach: e.target.value})} 
            rows={2} 
          />

          <div className="grid grid-cols-2 gap-4">
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

      {/* Cloud Sync & Phone Pairing Modal */}
      <Modal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        title="Sync Phone & Laptop"
      >
        <div className="space-y-4">
          {/* Reassuring Status Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white">Cloud Sync Connected</div>
                <div className="text-[11px] text-emerald-300">Instant 0ms Sync • Ready on All Devices</div>
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

          {/* Main 2 Actions */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Feedback Banner */}
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

          {/* Mobile One-Tap Link */}
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

          {/* Collapsible Connection Settings */}
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

          {/* Subtle Offline Backup Links */}
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
