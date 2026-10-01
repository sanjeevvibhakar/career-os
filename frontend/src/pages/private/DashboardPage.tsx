import React, { useEffect, useState } from 'react';
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
import { 
  Brain, Code, Mic, Activity, CheckCircle2, Clock, 
  Calendar, Download, Upload, ArrowRight, ShieldCheck, Flame, PlusCircle,
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

  const handleSaveDsaAttempt = () => {
    if (!dsaFocusProblem) return;
    dsaStore.logAttempt(dsaFocusProblem.id, attemptForm);
    dashboardStore.updateStreak('dsa');
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Executive Briefing Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl glass-panel relative overflow-hidden border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
            <Flame size={13} className="text-amber-400" />
            <span>Winter Arc Protocol • Target: Product Engineer 2027</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Backup & Actions Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => { setSyncModalOpen(true); setSyncMessage(null); }}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs border flex items-center gap-2 transition-all shadow-sm ${
              supabaseUrl && supabaseKey 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${supabaseUrl && supabaseKey ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
            <span>{supabaseUrl && supabaseKey ? 'Cloud Sync Active' : 'Phone & Laptop Sync'}</span>
          </button>

          <button 
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
            title="Download full database snapshot"
          >
            <Download size={14} className="text-sky-400" />
            <span>Export Backup</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl glass-panel text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5 cursor-pointer">
            <Upload size={14} className="text-purple-400" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Streaks Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {streaks.map(streak => (
          <div key={streak.type} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {streak.type}
            </span>
            <StreakBadge 
              count={streak.currentCount} 
              bestCount={streak.bestCount} 
              label="days" 
            />
          </div>
        ))}
      </div>

      {/* The 3 Daily Non-Negotiables */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>Today's 3 Non-Negotiables</span>
          <span className="text-xs text-gray-400 font-normal">• 9-hr job + high leverage prep</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 1 DSA Problem */}
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-blue-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Brain size={16} /> 1 DSA Problem
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Pattern Focus
                </span>
              </div>

              {dsaFocusProblem ? (
                <>
                  <h3 className="text-xl font-extrabold text-white mb-1.5">{dsaFocusProblem.name}</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Topic: <strong className="text-gray-200">{bottleneckTopic?.name}</strong> • Pattern: <strong className="text-blue-300 font-mono">{dsaFocusProblem.pattern}</strong>
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 my-4">All problems in current pattern solved!</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <button 
                onClick={() => setLogModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={14} />
                <span>Log Today's Attempt</span>
              </button>
            </div>
          </div>

          {/* Card 2: Tech Deep Work */}
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-purple-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Code size={16} /> 90-Min Engineering
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Sprint Deep Dive
                </span>
              </div>

              {activeSprint ? (
                <>
                  <h3 className="text-xl font-extrabold text-white mb-1.5">{activeSprint.technology}</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Week {activeSprint.currentWeek} of {activeSprint.totalWeeks} • <strong className="text-purple-300">{activeSprint.weeks.find(w => w.weekNumber === activeSprint.currentWeek)?.focus || 'Core Architecture'}</strong>
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-1.5">Distributed Systems & Java 21</h3>
                  <p className="text-xs text-gray-400 mb-4">No custom sprint created. Use the sprint manager to track your 2-week blocks.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => navigate('/sprint')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Open Sprint Manager</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3: 15-Min Communication */}
          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-emerald-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Mic size={16} /> 15-Min Articulation
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  System Speaking
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1.5">Verbal System Walkthrough</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Explain today's DSA pattern or Kafka partitioning aloud as if speaking to a Principal Engineer at Google or Atlassian.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => navigate('/communication')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Record Session Notes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Due Revisions Alert Strip */}
      {dueRevisions.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {dueRevisions.length} Spaced Repetition {dueRevisions.length === 1 ? 'Revision' : 'Revisions'} Due Today
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Next scheduled review: <strong>{dueRevisions[0]?.problemName}</strong> ({dueRevisions[0]?.pattern}). Review now to cement long-term memory.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dsa')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0 shadow-lg shadow-purple-500/25"
          >
            <span>Review Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Today's Timetable Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-sky-400" />
              <span>Today's Time Block Blueprint ({todayName})</span>
            </h3>
            <button 
              onClick={() => navigate('/schedule')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Edit Timetable
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
            {todaySchedule.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No blocks defined for {todayName}. Click Edit to configure.</p>
            ) : (
              todaySchedule.map((block, idx) => {
                const badgeColor = 
                  block.category === 'study' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                  block.category === 'gym' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  block.category === 'work' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-gray-400 bg-white/5 border-white/10';

                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#090b10] border border-white/5">
                    <span className="font-mono text-xs font-semibold text-gray-300">{block.time}</span>
                    <span className="text-sm font-medium text-white flex-1 px-4">{block.activity}</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border capitalize ${badgeColor}`}>
                      {block.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Log Shortcuts */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white mb-4">Quick Habit Check-In</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/journal')}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-sm text-gray-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-400" />
                  <span>Log Engineering Journal</span>
                </span>
                <ArrowRight size={14} className="text-gray-500" />
              </button>

              <button 
                onClick={() => navigate('/gym')}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-sm text-gray-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <span>Check In Gym Session</span>
                </span>
                <ArrowRight size={14} className="text-gray-500" />
              </button>

              <button 
                onClick={() => navigate('/review')}
                className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-sm text-gray-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <span>Weekly Review & Planning</span>
                </span>
                <ArrowRight size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <span className="text-xs text-gray-500">
              "Every metric must produce a deliberate action."
            </span>
          </div>
        </div>
      </div>

      {/* Log Problem Modal */}
      <Modal 
        isOpen={logModalOpen} 
        onClose={() => setLogModalOpen(false)} 
        title={`Log Solution: ${dsaFocusProblem?.name}`}
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
