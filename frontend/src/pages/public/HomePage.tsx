import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Code, Database, Server, Terminal, Cpu, Layers, 
  ExternalLink, CheckCircle, ShieldCheck, Sparkles, Activity, Lock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useDsaStore } from '../../stores/dsaStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { problems, topics } = useDsaStore();
  const [activeTab, setActiveTab] = useState<'stack' | 'architecture' | 'mission'>('stack');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-28 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Ambient Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-[var(--accent-blue)] mb-8 border border-blue-500/20 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Winter Arc 2026 Active • Target: Product Engineer 2027</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
          Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500">Sanjeev Vibhakar</span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-normal max-w-3xl mb-10 leading-relaxed">
          Software Engineer specializing in <span className="text-white font-medium">Java, Spring Boot, Distributed Systems</span> and modern full-stack web applications.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link 
            to="/projects" 
            className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2.5 group"
          >
            <span>Explore Engineering Work</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="px-7 py-3.5 rounded-xl glass-panel text-white font-medium hover:border-purple-500/40 transition-all flex items-center gap-2.5"
          >
            <Lock size={16} className="text-purple-400" />
            <span>Launch Career OS</span>
          </button>
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
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'stack' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                stack.sh
              </button>
              <button 
                onClick={() => setActiveTab('architecture')}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'architecture' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                architecture.json
              </button>
              <button 
                onClick={() => setActiveTab('mission')}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${activeTab === 'mission' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
              >
                winter_arc.env
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 bg-[#07090e]/90 text-gray-300 leading-relaxed overflow-x-auto min-h-[220px]">
            {activeTab === 'stack' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ ./inspect-core-stack.sh</p>
                <p className="text-gray-400"># Primary Backend & Distributed Layer</p>
                <p><span className="text-sky-400">Backend:</span> Java 21 LTS, Spring Boot 3, Hibernate JPA, RESTful APIs, JWT Auth</p>
                <p><span className="text-purple-400">Data & Queues:</span> PostgreSQL, Redis (Caching / Token Bucket), Apache Kafka, Flyway</p>
                <p><span className="text-amber-400">Frontend:</span> TypeScript, React 18, Tailwind CSS, Zustand Engine</p>
                <p><span className="text-emerald-400">Cloud & Infra:</span> Docker, Linux, Git / GitHub CI, Cloudflare Edge</p>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ cat system-design-focus.json</p>
                <pre className="text-xs text-blue-300">
{`{
  "focus": "High-Throughput & Fault-Tolerant Distributed Systems",
  "durable_principles": [
    "ACID Transactions & Distributed Locking (Redlock)",
    "Event-Driven Architecture with Kafka Partitions",
    "Spaced Repetition Mastery (${problems.length} Curated Patterns across ${topics.length} Categories)",
    "Zero-Latency Client-Side Persistence via Reactive Stores"
  ]
}`}
                </pre>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ cat winter_arc.env</p>
                <p><span className="text-purple-400">TARGET_TRANSITION:</span> Service-Based → Tier-A/B Product Engineer (2027)</p>
                <p><span className="text-sky-400">DAILY_NON_NEGOTIABLE_1:</span> 1 Curated Problem in Weakest Pattern (Striver + NeetCode)</p>
                <p><span className="text-amber-400">DAILY_NON_NEGOTIABLE_2:</span> 90-min Deep Engineering Sprint (Systems / Concurrency)</p>
                <p><span className="text-green-400">DAILY_NON_NEGOTIABLE_3:</span> 15-min Technical Articulation & Gym Routine</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Architecture Projects */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-bold">Featured Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Engineered for Scale</h2>
          </div>
          <Link to="/projects" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5 mt-4 md:mt-0 transition-colors">
            <span>View All Projects</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1: Career OS */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cpu size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active V1
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Personal Career Operating System
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                Full-stack personal career engine combining recruiter portfolio with a private intelligence dashboard. Implements an automated 5-stage spaced repetition algorithm for algorithmic mastery.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['React 18', 'TypeScript', 'Tailwind', 'Zustand', 'Spaced Repetition', 'Cloudflare'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">{t}</span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
              >
                <span>Open Dashboard</span>
                <ArrowRight size={14} />
              </button>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Project 2: High-Scale Rate Limiter */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Distributed System
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Distributed Task & Rate Limiting Service
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                High-throughput distributed API limiter applying the sliding window counter algorithm with Redis cluster. Handles asynchronous queueing via Kafka with idempotent retries.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Java 21', 'Spring Boot 3', 'Redis', 'Kafka', 'Docker', 'PostgreSQL'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">{t}</span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <Link to="/projects" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1.5">
                <span>View Architecture</span>
                <ArrowRight size={14} />
              </Link>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <Code size={18} />
              </a>
            </div>
          </div>

          {/* Project 3: Production SaaS Manager */}
          <div className="glass-panel p-7 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Database size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Full Stack
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Enterprise Multi-Tenant Project Platform
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                Multi-tenant project execution SaaS with strict RBAC, audit logging, PostgreSQL row-level isolation, and real-time event publishing for team workflows.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Spring Security', 'JWT', 'PostgreSQL', 'React', 'TypeScript', 'Flyway'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">{t}</span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <Link to="/projects" className="text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5">
                <span>Architecture Breakdown</span>
                <ArrowRight size={14} />
              </Link>
              <a href="https://github.com/sanjeevvibhakar/career-os" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                <Code size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competencies Bento */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-bold">Engineering Disciplines</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Durable Fundamentals</h2>
          <p className="text-[var(--text-secondary)] mt-3">Architected around durable systems principles rather than ephemeral framework trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <Server className="text-sky-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Backend & APIs</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Java 21, Spring Boot 3, REST APIs, Microservices, Spring Security, Hibernate ORM, and JVM memory tuning.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <Database className="text-purple-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Data & Storage</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              PostgreSQL relational modeling, ACID isolation, indexing (B-Tree), Redis caching, and Kafka streaming.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <Activity className="text-emerald-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Algorithmic Patterns</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Sliding Window, Monotonic Stacks, 2D Dynamic Programming, Graphs (BFS/DFS, Topological Sort), and Heaps.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <ShieldCheck className="text-amber-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Systems & DevOps</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Docker containerization, Linux internals, Git workflows, CI/CD pipelines, and Cloudflare Edge hosting.
            </p>
          </div>
        </div>
      </section>

      {/* Career OS Interactive Callout */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl glass-panel p-8 md:p-14 border border-blue-500/20 overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">Your Personal Engine</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2 mb-4">
              Enter the Private Preparation Dashboard
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Review today's 3 non-negotiables, track DSA spaced revisions, log daily engineering learnings, and manage your weekly timetable.
            </p>
          </div>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-xl shadow-blue-500/20 flex-shrink-0"
          >
            Launch Dashboard (PIN: 1234)
          </button>
        </div>
      </section>
    </div>
  );
};
