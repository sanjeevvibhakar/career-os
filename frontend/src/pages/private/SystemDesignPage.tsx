import React, { useState } from 'react';
import { 
  Building2, Calculator, Layers, ShieldCheck, ChevronRight, 
  Sparkles, CheckCircle2, ArrowRight, Database, Server, Cpu, 
  Network, Flame, HelpCircle, HardDrive
} from 'lucide-react';
import { SYSTEM_DESIGN_BLUEPRINTS } from '../../data/systemDesignData';
import type { SystemDesignBlueprint } from '../../data/systemDesignData';
import { CapacityCalculator } from '../../components/system-design/CapacityCalculator';
import { soundService } from '../../services/soundService';

export const SystemDesignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BLUEPRINTS' | 'CALCULATOR' | 'TRADEOFFS'>('BLUEPRINTS');
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(SYSTEM_DESIGN_BLUEPRINTS[0].id);

  const selectedBlueprint = SYSTEM_DESIGN_BLUEPRINTS.find(b => b.id === selectedBlueprintId) || SYSTEM_DESIGN_BLUEPRINTS[0];

  const handleTabChange = (tab: 'BLUEPRINTS' | 'CALCULATOR' | 'TRADEOFFS') => {
    setActiveTab(tab);
    soundService.playCheckSound();
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 animate-fade-in font-sans">
      
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              System Design Studio & Blueprints
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Tier-1 High-Level Architecture (HLD), Trade-Offs & Back-of-the-Envelope Capacity Estimator
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-center">
          <button
            onClick={() => handleTabChange('BLUEPRINTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'BLUEPRINTS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Blueprints</span>
          </button>

          <button
            onClick={() => handleTabChange('CALCULATOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CALCULATOR'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calculator size={13} />
            <span>Capacity Calculator</span>
          </button>

          <button
            onClick={() => handleTabChange('TRADEOFFS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'TRADEOFFS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={13} />
            <span>Trade-Offs</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: BLUEPRINTS */}
      {activeTab === 'BLUEPRINTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Blueprint Selector (Left Column) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono font-bold text-gray-400 px-1 uppercase tracking-wider">
              Curated Tier-1 Systems:
            </div>
            {SYSTEM_DESIGN_BLUEPRINTS.map(b => (
              <div
                key={b.id}
                onClick={() => { setSelectedBlueprintId(b.id); soundService.playCheckSound(); }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedBlueprintId === b.id
                    ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/20 border-purple-500/40 shadow-sm'
                    : 'glass-panel border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-400 font-bold">{b.category}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    b.difficulty === 'HARD' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {b.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {b.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.targetCompanies.map(c => (
                    <span key={c} className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-gray-300 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Blueprint Detail View (Right Column) */}
          <div className="lg:col-span-8 glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-5">
            
            {/* Blueprint Header */}
            <div className="border-b border-white/10 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                  {selectedBlueprint.category} • {selectedBlueprint.difficulty}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Target: {selectedBlueprint.targetCompanies.join(', ')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {selectedBlueprint.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {selectedBlueprint.summary}
              </p>
            </div>

            {/* Requirements Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> FUNCTIONAL REQUIREMENTS
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  {selectedBlueprint.functionalReqs.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <Flame size={13} /> NON-FUNCTIONAL REQUIREMENTS
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  {selectedBlueprint.nonFunctionalReqs.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Architectural Components */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                CORE SYSTEM COMPONENTS:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedBlueprint.keyComponents.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <strong className="text-white">{comp.name}</strong>
                      <span className="text-[10px] text-purple-300 bg-purple-500/15 px-1.5 py-0.2 rounded">
                        {comp.technology}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {comp.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Back-of-the-Envelope Baseline */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-purple-950/20 border border-blue-500/20 space-y-2 font-mono text-xs">
              <span className="text-sky-300 font-bold block">
                ⚡ ESTIMATION BASELINE:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">DAU</span>
                  <strong className="text-white">{selectedBlueprint.estimationBaseline.dau}</strong>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">READ QPS</span>
                  <strong className="text-white">{selectedBlueprint.estimationBaseline.readQps}</strong>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">WRITE QPS</span>
                  <strong className="text-white">{selectedBlueprint.estimationBaseline.writeQps}</strong>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">STORAGE</span>
                  <strong className="text-white">{selectedBlueprint.estimationBaseline.storagePerYear}</strong>
                </div>
              </div>
            </div>

            {/* Deep-Dive Trade-offs & Failure Modes */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                BAR-RAISER TRADE-OFFS & FAILURE MODES:
              </h4>
              <div className="space-y-2.5">
                {selectedBlueprint.tradeOffs.map((to, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-purple-950/15 border border-purple-500/25 space-y-1.5 text-xs">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <span>⚠️ Challenge:</span>
                      <span>{to.challenge}</span>
                    </div>
                    <div className="text-gray-300 flex items-start gap-1.5 pl-2 border-l-2 border-emerald-500/40">
                      <span>✅ <strong>Architecture Solution:</strong> {to.solution}</span>
                    </div>
                    <div className="text-purple-300/80 text-[11px] font-mono pl-2">
                      ⚖️ <em>Trade-off:</em> {to.tradeoff}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. TAB 2: CAPACITY CALCULATOR */}
      {activeTab === 'CALCULATOR' && (
        <CapacityCalculator />
      )}

      {/* 4. TAB 3: SENIOR TRADE-OFF MATRIX */}
      {activeTab === 'TRADEOFFS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: B-Tree vs LSM-Tree */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database size={16} className="text-sky-400" />
                  B-Tree vs LSM-Tree Storage Engines
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Storage</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>B-Tree (PostgreSQL, MySQL):</strong> In-place updates on disk pages. Provides $O(\log N)$ point reads and range scans. Downside: heavy random I/O writes.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>LSM-Tree (Cassandra, RocksDB):</strong> Append-only writes to memory MemTable, flushed sequentially to immutable SSTables. Downside: Read amplification (mitigated by Bloom filters).
              </p>
              <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] font-mono text-blue-300">
                ⚡ Rule: Read-heavy transactional $\rightarrow$ B-Tree. High write velocity (IoT, logs, chats) $\rightarrow$ LSM-Tree.
              </div>
            </div>

            {/* Card 2: 2PC vs Saga Pattern */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu size={16} className="text-purple-400" />
                  2-Phase Commit (2PC) vs Saga Pattern
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Transactions</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>2-Phase Commit (2PC):</strong> Synchronous coordinator locks all DB resources across services. Strong consistency, but blocks on coordinator failure and scales poorly across networks.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Saga Pattern:</strong> Sequence of local transactions coordinated via events or an orchestrator. If step 3 fails, steps 2 and 1 execute compensating undo actions.
              </p>
              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                ⚡ Rule: Microservices use Saga (Eventual Consistency). Monolith single DB uses ACID transactions.
              </div>
            </div>

            {/* Card 3: Cache Strategies */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server size={16} className="text-amber-400" />
                  Cache-Aside vs Write-Through vs Write-Behind
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Caching</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Cache-Aside:</strong> App reads cache; on miss, reads DB and populates cache. App writes directly to DB and invalidates cache key. Standard and resilient.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Write-Through:</strong> App writes to cache; cache synchronously writes to DB. No stale data, but write latency is sum of cache + DB.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Write-Behind (Write-Back):</strong> App writes to cache; cache batches writes to DB asynchronously. Extreme write speed, but data loss risk if cache crashes before flush.
              </p>
            </div>

            {/* Card 4: CAP vs PACELC */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Network size={16} className="text-emerald-400" />
                  CAP Theorem & PACELC Trade-Off
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Distributed Theory</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>CAP Theorem:</strong> During network Partition (P), choose between Availability (A) and Consistency (C). You cannot choose "No Partition" because network cables will break.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>PACELC:</strong> If Partition (P), trade Availability (A) vs Consistency (C); Else (E) in normal operation, trade Latency (L) vs Consistency (C).
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                ⚡ Examples: Cassandra is PA/EL. PostgreSQL/MongoDB is PC/EC.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
