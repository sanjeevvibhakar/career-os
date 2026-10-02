import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Code, Database, Server, Terminal, Cpu, Layers, 
  CheckCircle, ShieldCheck, Sparkles, Activity, Lock, Zap, 
  Flame, Clock, BarChart3, Cloud, GitBranch, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSprintStore } from '../../stores/sprintStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { usePortfolioStore } from '../../stores/portfolioStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { problems, topics, attempts, getStats } = useDsaStore();
  const { getActiveSprint } = useSprintStore();
  const { getStreaks } = useDashboardStore();
  const { profile } = usePortfolioStore();

  const [activeTab, setActiveTab] = useState<'stack' | 'architecture' | 'mission'>('stack');

  // Computed live telemetry stats
  const stats = getStats ? getStats() : { 
    totalSolved: attempts ? new Set(attempts.map(a => a.problemId)).size : 1, 
    totalProblems: problems.length || 80, 
    easy: 1, 
    medium: 0, 
    hard: 0, 
    streakDays: 1 
  };
  
  const activeSprint = getActiveSprint ? getActiveSprint() : undefined;
  const streaks = getStreaks ? getStreaks() : [];
  const dsaStreak = streaks.find(s => s.type === 'dsa')?.currentCount || 1;
  const progressPercent = Math.min(100, Math.round((stats.totalSolved / (stats.totalProblems || 80)) * 100));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-36 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-[var(--accent-blue)] mb-8 border border-blue-500/25 shadow-lg shadow-blue-500/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-200">Winter Arc Active</span>
          <span className="text-gray-500">•</span>
          <span className="text-sky-400 font-semibold">Target: Product Engineer 2027</span>
        </div>

        {/* Bold Modern Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-5 max-w-5xl leading-tight">
          Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500">{profile.name}</span>
          <br />
          <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-200">
            {profile.title}
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-normal max-w-3xl mb-10 leading-relaxed">
          Architecting concurrent, high-throughput JVM services with <span className="text-white font-medium">Java 21 LTS, Spring Boot 3</span>, and distributed data pipelines. Bridging disciplined algorithmic problem-solving with scalable system design.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link 
            to="/projects" 
            className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2.5 group"
          >
            <span>Explore System Architectures</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="px-7 py-3.5 rounded-xl glass-panel text-white font-medium hover:border-purple-500/40 hover:bg-purple-500/10 transition-all flex items-center gap-2.5 shadow-md"
          >
            <Lock size={16} className="text-purple-400" />
            <span>Launch Career OS</span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">PIN: 1234</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* OVERALL ANALYTICS & PREPARATION TELEMETRY SECTION (NEW) */}
        {/* ========================================================================= */}
        <div className="w-full max-w-5xl mb-16 text-left">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Preparation & System Telemetry</span>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dynamic Readout
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: DSA Mastery */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-blue-400">
                  <BarChart3 size={15} /> Algorithmic Mastery
                </span>
                <span className="font-mono text-white font-bold">{progressPercent}%</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mb-2">
                {stats.totalSolved} <span className="text-xs text-gray-400 font-normal">/ {stats.totalProblems || 96} Solved</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5 font-mono">
                <span>{stats.totalProblems || 96} Problems</span>
                <span className="text-emerald-400">{topics.length || 20} Categories</span>
              </div>
            </div>

            {/* Metric 2: Active Tech Sprint */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-purple-400">
                  <Cpu size={15} /> Tech Sprint Focus
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono font-semibold">Active</span>
              </div>
              <div className="text-lg font-bold text-white truncate mb-1">
                {activeSprint?.technology || 'Java 21 LTS'}
              </div>
              <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                {activeSprint?.weeks?.find(w => !w.completed)?.focus || 'Virtual Threads & Concurrency'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5 font-mono">
                <span>Week {activeSprint?.currentWeek || 1} of {activeSprint?.totalWeeks || 4}</span>
                <span className="text-purple-400">Deep Work</span>
              </div>
            </div>

            {/* Metric 3: Cloud Database & State */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-sky-500/30 transition-all">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-sky-400">
                  <Cloud size={15} /> Cloud State Engine
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-semibold">0ms Cold</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                Supabase Postgres
              </div>
              <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                Instant sync across Laptop & Mobile
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5 font-mono">
                <span className="text-sky-300">Cloudflare Edge</span>
                <span className="text-emerald-400">Connected</span>
              </div>
            </div>

            {/* Metric 4: Discipline & Momentum */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <Flame size={15} /> Execution Momentum
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-mono font-semibold">Winter Arc</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mb-1">
                {dsaStreak} <span className="text-xs text-gray-400 font-normal">Day Streak</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                3 Daily Non-Negotiables Routine
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5 font-mono">
                <span>Timetable Active</span>
                <span className="text-amber-400">180d Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Terminal Showcase */}
        <div className="w-full max-w-4xl rounded-2xl glass-panel overflow-hidden border border-white/10 shadow-2xl text-left font-mono text-sm">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="text-xs text-[var(--text-secondary)] ml-2">sanjeev@careeros: ~/profile</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('stack')}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'stack' ? 'bg-blue-500/20 text-blue-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                stack.sh
              </button>
              <button 
                onClick={() => setActiveTab('architecture')}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'architecture' ? 'bg-blue-500/20 text-blue-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                systems.json
              </button>
              <button 
                onClick={() => setActiveTab('mission')}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'mission' ? 'bg-blue-500/20 text-blue-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                protocol.env
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 bg-[#07090e]/95 text-gray-300 leading-relaxed overflow-x-auto min-h-[220px]">
            {activeTab === 'stack' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ ./inspect-core-stack.sh</p>
                <p className="text-gray-400"># Primary Backend & Distributed Layer</p>
                <p><span className="text-sky-400">Backend Core:</span> Java 21 LTS, Spring Boot 3, Hibernate JPA, RESTful APIs, JWT Auth</p>
                <p><span className="text-purple-400">Data & Queues:</span> PostgreSQL, Redis (Sliding Window & Redlock), Apache Kafka, Flyway</p>
                <p><span className="text-amber-400">Frontend Client:</span> TypeScript, React 18, Tailwind CSS, Zustand Engine</p>
                <p><span className="text-emerald-400">Edge & Infra:</span> Cloudflare Workers Edge, Docker, Linux, Git / GitHub Actions</p>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ cat systems.json</p>
                <pre className="text-xs text-blue-300">
{`{
  "focus": "High-Throughput & Fault-Tolerant Distributed Architectures",
  "architectural_pillars": [
    "ACID Transactions & Distributed Locking (Redlock)",
    "Asynchronous Event-Driven Pipelines with Kafka Partitions",
    "Spaced Repetition Mastery (${stats.totalProblems || 80} Curated Patterns across ${topics.length || 20} Categories)",
    "0ms Edge Sync & Resilient Local-First Offline Cache"
  ]
}`}
                </pre>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ cat protocol.env</p>
                <p><span className="text-purple-400">TARGET_TRANSITION:</span> Service-Based → Tier-1 Product Engineer (2027)</p>
                <p><span className="text-sky-400">DAILY_NON_NEGOTIABLE_1:</span> 1 Curated Problem in Weakest Pattern (Striver + NeetCode)</p>
                <p><span className="text-amber-400">DAILY_NON_NEGOTIABLE_2:</span> 90-min Deep Engineering Sprint (Systems / Concurrency)</p>
                <p><span className="text-green-400">DAILY_NON_NEGOTIABLE_3:</span> 15-min Technical Articulation & Gym Routine</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED ARCHITECTURE PROJECTS (BENTO SYSTEM FLOWS) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-bold">Featured Systems</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span className="text-xs text-gray-400 font-mono">Architectural Case Studies</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered for Scale & Resilience</h2>
          </div>
          <Link to="/projects" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 mt-4 md:mt-0 transition-colors">
            <span>View All Engineering Work</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1: Distributed Rate Limiter & Message Service */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  Distributed System
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Distributed Task & Rate Limiting Service
              </h3>
              
              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                High-throughput distributed API rate limiter applying the sliding window counter algorithm with Redis cluster. Handles asynchronous queueing via Kafka with idempotent consumer retries.
              </p>

              {/* Visual Pipeline Flow */}
              <div className="mb-5 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GitBranch size={12} className="text-purple-400" /> Architectural Dataflow
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-300 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-white/5">API Client</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">Redis Token Bucket</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-200">Kafka Topic</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">JVM Workers</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Java 21', 'Spring Boot 3', 'Redis', 'Kafka', 'Docker', 'PostgreSQL'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 font-mono">{t}</span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <Link to="/projects" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1.5">
                <span>View System Architecture</span>
                <ChevronRight size={15} />
              </Link>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Source Code">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Project 2: Career OS */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group hover:border-blue-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cpu size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Production V2
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Career Operating System & Spaced Repetition Engine
              </h3>

              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                Full-stack personal engineering OS combining a recruiter portfolio with a private intelligence dashboard. Implements an automated 5-stage Leitner spaced repetition algorithm with 0ms Supabase cloud sync.
              </p>

              {/* Visual Pipeline Flow */}
              <div className="mb-5 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GitBranch size={12} className="text-blue-400" /> State & Cloud Flow
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-300 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-white/5">React 18 SPA</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200">Zustand Cache</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">0ms Supabase DB</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">Edge Worker</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {['React 18', 'TypeScript', 'Tailwind', 'Zustand', 'Supabase', 'Cloudflare Edge'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 font-mono">{t}</span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
              >
                <span>Launch Dashboard</span>
                <ChevronRight size={15} />
              </button>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Source Code">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Project 3: Production SaaS Manager */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group hover:border-amber-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Database size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  Enterprise Platform
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Enterprise Multi-Tenant SaaS Platform
              </h3>

              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                Multi-tenant project execution SaaS featuring strict RBAC, audit logging, PostgreSQL row-level isolation (RLS), and database schema lifecycle management with Flyway.
              </p>

              {/* Visual Pipeline Flow */}
              <div className="mb-5 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <GitBranch size={12} className="text-amber-400" /> Security Flow
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-300 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-white/5">JWT Bearer</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">Spring Security 6</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">Tenant Context</span>
                  <span className="text-gray-400">➔</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">PostgreSQL RLS</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Spring Security', 'JWT Auth', 'PostgreSQL RLS', 'Flyway', 'REST APIs', 'Docker'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 font-mono">{t}</span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <Link to="/projects" className="text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5">
                <span>View Security Spec</span>
                <ChevronRight size={15} />
              </Link>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Source Code">
                <Code size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORE ENGINEERING DISCIPLINES BENTO */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-bold">Engineering Disciplines</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Durable Fundamentals</h2>
          <p className="text-[var(--text-secondary)] mt-3">Architected around durable systems principles rather than ephemeral framework trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-sky-500/40 hover:bg-sky-500/5 transition-all">
            <Server className="text-sky-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Backend & JVM Internals</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Java 21 LTS, Virtual Threads, Spring Boot 3, REST APIs, Microservices, Spring Security, and JVM memory tuning.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
            <Database className="text-purple-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Databases & Distributed</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              PostgreSQL relational modeling, ACID transactions, B-Tree indexes, Redis caching & Redlock, and Kafka queues.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all">
            <Activity className="text-emerald-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Algorithmic Patterns</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Sliding Window, Monotonic Stacks, 2D Dynamic Programming, Graphs (BFS/DFS, Topological Sort), and Heaps.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all">
            <ShieldCheck className="text-amber-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">DevOps & Edge Delivery</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Docker containerization, Linux systems, Git workflows, CI/CD pipelines, and Cloudflare Edge deployment.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CAREER OS INTERACTIVE CALLOUT BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl glass-panel p-8 md:p-14 border border-blue-500/25 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
              <Zap size={14} /> Personal Intelligence Dashboard
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Enter Sanjeev's Private Career OS
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
              Track today's 3 non-negotiables, inspect daily timetable schedules, review 80 algorithmic patterns via spaced repetition, and manage cross-device Supabase cloud sync.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              <span>Launch Dashboard (PIN: 1234)</span>
            </button>
            <Link
              to="/projects"
              className="px-6 py-4 rounded-xl glass-panel text-gray-300 hover:text-white font-medium hover:border-white/20 transition-all flex items-center justify-center"
            >
              View System Specs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
