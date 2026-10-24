import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Code, Calendar, Target, Clock, ArrowRight, 
  Sparkles, ShieldCheck, Briefcase, Award, Building2, 
  Flame, CheckCircle2, RefreshCw, Volume2, VolumeX, Zap, BookOpen, Layers
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCareerStore } from '../../stores/careerStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { useDailyStore } from '../../stores/dailyStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FocusTimerModal } from '../../components/shared/FocusTimerModal';
import { soundService } from '../../services/soundService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const { profile, roadmap } = useCareerStore();
  const dsaStore = useDsaStore();
  const syllabusStore = useSyllabusStore();
  const dailyStore = useDailyStore();

  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState('Daily Focus Block');
  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    soundService.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundService.playCheckSound();
  };

  // Next Pending DSA Focus Problem
  const pendingDsaProblem = useMemo(() => {
    const due = dsaStore.getDueRevisions();
    if (due.length > 0) {
      const match = dsaStore.problems.find(p => p.id === due[0].problemId);
      if (match) return { problem: match, isRevision: true };
    }
    const unsolved = dsaStore.problems.find(p => !dsaStore.attempts.some(a => a.problemId === p.id));
    return { problem: unsolved || dsaStore.problems[0], isRevision: false };
  }, [dsaStore.problems, dsaStore.attempts]);

  // Next Pending Backend Topic
  const nextBackendTopic = useMemo(() => {
    return syllabusStore.getNextPendingItem();
  }, [syllabusStore]);

  // Current Roadmap Phase (Phase 1: Oct - Dec 2026)
  const currentPhase = roadmap.find(p => p.id === 1) || roadmap[0];

  const handleStartFocus = (task: string) => {
    setTimerTaskTitle(task);
    setTimerModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in font-sans">
      
      {/* 1. Clean, Friendly Welcome Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1017] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {userName || 'Sanjeev'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Product SDE-1 Goal: <span className="text-emerald-400 font-bold font-mono">₹25–45 LPA CTC</span> by <span className="text-purple-300 font-medium">May–June 2027</span>.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
            TCS Office: 11 AM – 8 PM
          </div>
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Today's Two Core Focus Tasks (Clean & Simple) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" />
            <span>Today's Two Priority Tasks (Doable in 1.5 Hours Outside Work)</span>
          </h2>
          <span className="text-xs text-gray-500">Morning & Evening Blocks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Focus Task A: DSA */}
          <Card className="p-5 bg-gradient-to-br from-purple-950/20 via-[#0d1017] to-transparent border-purple-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300">
                  {pendingDsaProblem.isRevision ? '🔁 Spaced Revision' : '🧠 Algorithmic Problem'}
                </span>
                <span className="text-gray-400 font-mono">Est. 45 mins</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mt-2">
                {pendingDsaProblem.problem.name}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-mono">
                <span className="text-purple-400 font-semibold">{pendingDsaProblem.problem.pattern}</span>
                <span>•</span>
                <span className={`font-bold ${
                  pendingDsaProblem.problem.difficulty === 'EASY' ? 'text-emerald-400' :
                  pendingDsaProblem.problem.difficulty === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {pendingDsaProblem.problem.difficulty}
                </span>
                <span>•</span>
                <span>{pendingDsaProblem.problem.source}</span>
              </div>

              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Solve independently in under 30 minutes. Focus on time and space complexity explanation.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Button
                variant="primary"
                onClick={() => navigate('/dsa')}
                className="flex-1 text-xs justify-center min-h-[42px]"
              >
                <span>Open DSA Tracker</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
              <button
                onClick={() => handleStartFocus(`DSA: ${pendingDsaProblem.problem.name}`)}
                className="px-3 py-2 min-h-[42px] rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Start 45m Focus Timer"
              >
                <Clock size={14} />
                <span>Timer</span>
              </button>
            </div>
          </Card>

          {/* Focus Task B: Backend Topic */}
          <Card className="p-5 bg-gradient-to-br from-blue-950/20 via-[#0d1017] to-transparent border-blue-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300">
                  ☕ Java & Spring Boot Topic
                </span>
                <span className="text-gray-400 font-mono">Est. 45 mins</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mt-2">
                {nextBackendTopic ? nextBackendTopic.subtopic : 'Spring Boot Global Exception Handling'}
              </h3>
              
              <div className="text-xs text-blue-400 mt-1 font-mono font-semibold">
                {nextBackendTopic ? `Week ${nextBackendTopic.weekNumber} • ${nextBackendTopic.topic}` : 'Spring Boot & Database Transactions'}
              </div>

              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                {nextBackendTopic ? nextBackendTopic.keyTakeaway : 'Understand key annotations, test edge cases, and attach evidence to your portfolio.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Button
                variant="primary"
                onClick={() => navigate('/sprint')}
                className="flex-1 text-xs justify-center min-h-[42px]"
              >
                <span>Open Backend Syllabus</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
              <button
                onClick={() => handleStartFocus(`Backend: ${nextBackendTopic?.subtopic || 'Spring Boot'}`)}
                className="px-3 py-2 min-h-[42px] rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Start 45m Focus Timer"
              >
                <Clock size={14} />
                <span>Timer</span>
              </button>
            </div>
          </Card>

        </div>
      </div>

      {/* 3. Your Timeline at a Glance */}
      <Card className="p-5 bg-[#0d1017] border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" />
              <span>Career Roadmap Timeline (Oct 2026 – June 2027)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Current Active Stage: <strong className="text-blue-300">{currentPhase?.title}</strong> ({currentPhase?.timeRange})
            </p>
          </div>

          <button
            onClick={() => navigate('/timeline')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Timeline & Topics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 6 Step Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roadmap.map((phase) => {
            const isCurrent = phase.id === 1;
            const isCompleted = phase.milestones.every(m => m.status === 'COMPLETED');
            return (
              <div 
                key={phase.id}
                onClick={() => navigate('/timeline')}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-300'
                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase text-blue-400">Phase {phase.id}</div>
                <div className="font-semibold text-white truncate mt-0.5">{phase.title}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-1">{phase.timeRange}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Dedicated Sections Hub (Clear Buttons to Each Dedicated Page) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Dedicated Practice & Career Pages
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Hub Item 1: DSA Sheet */}
          <div 
            onClick={() => navigate('/dsa')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Brain size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">DSA Practice Sheet</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Categorized problems, pattern recognition, and adaptive revision intervals.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <span>Open DSA Page</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 2: Backend Syllabus */}
          <div 
            onClick={() => navigate('/sprint')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-blue-500/40 hover:bg-blue-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Code size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Backend Topics Checklist</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Step-by-step topics across Core Java, Spring Boot, SQL, and Docker.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <span>Open Syllabus</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 3: System Design */}
          <div 
            onClick={() => navigate('/system-design')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-sky-500/40 hover:bg-sky-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">System Design Studio</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                High-Level Design (HLD), LLD patterns, and capacity estimation calculators.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-400 flex items-center gap-1">
              <span>Open System Design</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 4: Career Timeline */}
          <div 
            onClick={() => navigate('/timeline')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Career Timeline</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Month-by-month roadmap with deliverables and target CTC goals.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Open Timeline</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 5: Interview Readiness */}
          <div 
            onClick={() => navigate('/interview-readiness')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Interview Readiness</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Objective scoring across 11 dimensions & mock interview logger.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <span>Open Readiness</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 6: Target Jobs */}
          <div 
            onClick={() => navigate('/job-pipeline')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-amber-500/40 hover:bg-amber-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Target Job Pipeline</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Track product companies, CTC packages, and skill gap closing actions.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Open Job Pipeline</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 7: Evidence Vault */}
          <div 
            onClick={() => navigate('/skills-tree')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Skills & Evidence Vault</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                10 skill branches with verified GitHub PRs, test suites, and schemas.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
              <span>Open Vault</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub Item 8: Timetable & Routine */}
          <div 
            onClick={() => navigate('/schedule')}
            className="p-4 rounded-xl bg-[#0d1017] border border-white/10 hover:border-rose-500/40 hover:bg-rose-950/10 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">Daily Timetable</h3>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                11am–8pm office hours, morning study block, and sleep preservation.
              </p>
            </div>
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <span>Open Schedule</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Focus Timer Modal */}
      <FocusTimerModal
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        taskTitle={timerTaskTitle}
      />
    </div>
  );
};
