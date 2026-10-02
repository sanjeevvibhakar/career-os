import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { useDsaStore } from '../../stores/dsaStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { soundService } from '../../services/soundService';
import { INTERVIEW_TRAP_CARDS, type InterviewTrapCard } from '../../data/interviewTrapData';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import { 
  Target, Sparkles, Brain, CheckCircle2, Award, Zap, 
  ExternalLink, ArrowRight, ShieldCheck, Flame, BookOpen, 
  RotateCcw, Eye, EyeOff, Layers, Code, AlertTriangle, ChevronRight
} from 'lucide-react';

interface InterviewReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProblemForLog?: (problem: any) => void;
}

export const InterviewReadinessModal: React.FC<InterviewReadinessModalProps> = ({
  isOpen,
  onClose,
  onSelectProblemForLog,
}) => {
  const dsaStore = useDsaStore();
  const syllabusStore = useSyllabusStore();
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();

  const [activeTab, setActiveTab] = useState<'patterns' | 'traps' | 'action_plan'>('patterns');
  const [trapCategory, setTrapCategory] = useState<string>('All');
  const [revealedTrapIds, setRevealedTrapIds] = useState<Set<string>>(new Set());
  
  // Mastered trap IDs in local storage
  const [masteredTrapIds, setMasteredTrapIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('career_os_mastered_traps');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleRevealTrap = (id: string) => {
    setRevealedTrapIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMasterTrap = (id: string) => {
    soundService.playCheckSound();
    setMasteredTrapIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('career_os_mastered_traps', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // 1. Compute Solved Problems Set
  const solvedProblemIds = useMemo(() => {
    return new Set(dsaStore.attempts.map(a => a.problemId));
  }, [dsaStore.attempts]);

  // 2. Group All DSA Problems by Algorithm Pattern
  const patternMasteryList = useMemo(() => {
    const patternMap: Record<string, { total: number; solved: number; problems: typeof DSA_PROBLEMS }> = {};

    DSA_PROBLEMS.forEach(prob => {
      const p = prob.pattern || 'General';
      if (!patternMap[p]) {
        patternMap[p] = { total: 0, solved: 0, problems: [] };
      }
      patternMap[p].total += 1;
      patternMap[p].problems.push(prob);
      if (solvedProblemIds.has(prob.id)) {
        patternMap[p].solved += 1;
      }
    });

    return Object.entries(patternMap).map(([patternName, data]) => {
      const pct = Math.round((data.solved / data.total) * 100);
      const nextUnsolved = data.problems.find(p => !solvedProblemIds.has(p.id));
      return {
        name: patternName,
        total: data.total,
        solved: data.solved,
        pct,
        nextUnsolved,
        problems: data.problems,
      };
    }).sort((a, b) => b.total - a.total); // Sorted by prominence
  }, [solvedProblemIds]);

  // 3. Composite Readiness Calculation
  const readinessMetrics = useMemo(() => {
    // Pattern breadth (% of patterns with at least 1 solved)
    const patternsTouched = patternMasteryList.filter(p => p.solved > 0).length;
    const patternBreadthPct = patternMasteryList.length > 0 
      ? Math.round((patternsTouched / patternMasteryList.length) * 100) 
      : 0;

    // Syllabus completion
    const syllabusPace = syllabusStore.getPaceAnalysis();
    const syllabusPct = syllabusPace.progressPct;

    // Traps mastered
    const trapsPct = Math.round((masteredTrapIds.size / INTERVIEW_TRAP_CARDS.length) * 100);

    // Total readiness weighted (40% DSA Patterns, 30% Tech Syllabus, 20% Traps, 10% Consistency)
    const dsaStreak = dashboardStore.getStreaks().find(s => s.type === 'dsa')?.currentCount || 0;
    const consistencyScore = Math.min(100, dsaStreak * 10);

    const composite = Math.round(
      (patternBreadthPct * 0.40) + 
      (syllabusPct * 0.30) + 
      (trapsPct * 0.20) + 
      (consistencyScore * 0.10)
    );

    return {
      composite: Math.min(100, composite),
      patternBreadthPct,
      syllabusPct,
      trapsPct,
      masteredTrapCount: masteredTrapIds.size,
      totalTraps: INTERVIEW_TRAP_CARDS.length,
    };
  }, [patternMasteryList, syllabusStore, masteredTrapIds, dashboardStore]);

  // Trap Categories
  const trapCategories = ['All', 'Java & Concurrency', 'Spring & APIs', 'Databases & SQL', 'Distributed Systems & Redis'];
  const filteredTraps = trapCategory === 'All'
    ? INTERVIEW_TRAP_CARDS
    : INTERVIEW_TRAP_CARDS.filter(t => t.category === trapCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tier-1 Interview Readiness Hub">
      <div className="space-y-4 max-h-[82vh] overflow-y-auto pr-1">
        
        {/* 1. Header Barometer Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 border border-blue-500/30 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-black text-blue-300 font-mono">{readinessMetrics.composite}%</span>
                <span className="text-[8px] uppercase tracking-wider text-blue-400 font-bold">Readiness</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-white">
                    {readinessMetrics.composite >= 80 ? '⭐ Tier-1 Bar Cleared (Swiggy / Uber / Google)' : readinessMetrics.composite >= 50 ? '⚡ Strong Mid-Senior Track (Scaling Phase)' : '🌱 Foundation & Pattern Building'}
                  </h2>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Algorithmic pattern breadth + production concurrency & system design depth.
                </p>
              </div>
            </div>

            {/* Micro Breakdown Strip */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300 self-start sm:self-auto">
              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                <span className="text-blue-400 font-bold">{readinessMetrics.patternBreadthPct}%</span> Patterns
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                <span className="text-emerald-400 font-bold">{readinessMetrics.syllabusPct}%</span> Syllabus
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                <span className="text-purple-400 font-bold">{readinessMetrics.trapsPct}%</span> Traps
              </div>
            </div>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 gap-1">
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'patterns'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain size={13} />
            <span>Pattern Matrix ({patternMasteryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'traps'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap size={13} />
            <span>Interview Traps ({readinessMetrics.masteredTrapCount}/{readinessMetrics.totalTraps})</span>
          </button>

          <button
            onClick={() => setActiveTab('action_plan')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'action_plan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target size={13} />
            <span>Daily Action Plan</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: Pattern Mastery Matrix */}
        {activeTab === 'patterns' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1 text-gray-400">
              <span>15 Core Algorithmic Patterns (NeetCode & Striver A2Z)</span>
              <span className="font-mono text-[11px] text-blue-400">
                {patternMasteryList.filter(p => p.solved > 0).length} of {patternMasteryList.length} Touched
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {patternMasteryList.map(pat => {
                const isMastered = pat.pct >= 80;
                const isStarted = pat.solved > 0;

                return (
                  <div 
                    key={pat.name} 
                    className={`p-3.5 rounded-xl border transition-all ${
                      isMastered 
                        ? 'bg-emerald-950/20 border-emerald-500/30' 
                        : isStarted 
                        ? 'bg-blue-950/20 border-blue-500/30' 
                        : 'bg-[#090b10] border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <span>{pat.name}</span>
                          {isMastered && <span className="text-[10px] text-emerald-400">⭐</span>}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {pat.solved} of {pat.total} problems solved ({pat.pct}%)
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        isMastered 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : isStarted 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-white/5 text-gray-400'
                      }`}>
                        {isMastered ? 'Mastered' : isStarted ? 'In Progress' : 'Untouched'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isMastered ? 'bg-emerald-400' : isStarted ? 'bg-blue-400' : 'bg-gray-600'
                        }`}
                        style={{ width: `${pat.pct}%` }}
                      />
                    </div>

                    {/* Next Unsolved Action Button */}
                    {pat.nextUnsolved ? (
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-gray-300 truncate max-w-[170px]" title={pat.nextUnsolved.name}>
                          Next: <strong className="text-white">{pat.nextUnsolved.name}</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={pat.nextUnsolved.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Open on LeetCode"
                          >
                            <ExternalLink size={12} />
                          </a>
                          {onSelectProblemForLog && (
                            <button
                              onClick={() => {
                                onClose();
                                onSelectProblemForLog(pat.nextUnsolved);
                              }}
                              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-colors"
                            >
                              Solve
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] text-emerald-400 font-mono">
                        ✓ All pattern problems completed!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Rapid Interview Traps */}
        {activeTab === 'traps' && (
          <div className="space-y-3">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {trapCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTrapCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    trapCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Trap Cards Deck */}
            <div className="space-y-3">
              {filteredTraps.map(trap => {
                const isRevealed = revealedTrapIds.has(trap.id);
                const isMastered = masteredTrapIds.has(trap.id);

                return (
                  <div
                    key={trap.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isMastered
                        ? 'bg-purple-950/20 border-purple-500/40'
                        : 'bg-[#090b10] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-purple-300 font-bold">
                          {trap.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-1.5 leading-snug">
                          {trap.question}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleMasterTrap(trap.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors shrink-0 flex items-center gap-1 ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                        title="Mark mastered or needs review"
                      >
                        <CheckCircle2 size={11} className={isMastered ? 'text-emerald-400' : ''} />
                        <span>{isMastered ? 'Mastered' : 'Got It?'}</span>
                      </button>
                    </div>

                    {/* Common Rookie Trap Alert */}
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-1.5">
                      <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Rookie Trap:</strong> {trap.commonTrap}</span>
                    </div>

                    {/* Senior Architect Answer Reveal */}
                    {isRevealed ? (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs text-gray-200 animate-in fade-in leading-relaxed">
                        <div className="text-[11px] font-bold text-emerald-400 font-mono">
                          ★ Tier-1 Senior Architect Answer:
                        </div>
                        <p>{trap.executiveAnswer}</p>

                        {trap.codeSnippet && (
                          <pre className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-blue-300 overflow-x-auto">
                            <code>{trap.codeSnippet}</code>
                          </pre>
                        )}

                        <div className="text-[11px] font-mono text-purple-400 font-bold bg-purple-500/10 p-1.5 rounded border border-purple-500/20">
                          {trap.keyRule}
                        </div>
                      </div>
                    ) : null}

                    {/* Reveal Toggle Button */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleRevealTrap(trap.id)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff size={12} />
                            <span>Hide Answer</span>
                          </>
                        ) : (
                          <>
                            <Eye size={12} />
                            <span>Reveal Senior Answer & Code</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-gray-500 font-mono">
                        {trap.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Daily Action Plan */}
        {activeTab === 'action_plan' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#090b10] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <Target size={14} />
                <span>TODAY'S HIGHEST-LEVERAGE RECOVERY & PRACTICE MOVES</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Based on your current curriculum velocity and weakest DSA patterns, here are your top 3 prioritized actions for today:
              </p>

              {/* Action 1: Weakest Pattern Problem */}
              {(() => {
                const weakestPattern = patternMasteryList.find(p => p.solved === 0 && p.nextUnsolved) || patternMasteryList[0];
                return (
                  <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-blue-500 text-black font-extrabold text-[10px]">1</span>
                        <span>Solve 1 Unpracticed Pattern: {weakestPattern.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-300 mt-0.5">
                        Recommended Problem: <strong>{weakestPattern.nextUnsolved?.name || 'Two Sum'}</strong> ({weakestPattern.nextUnsolved?.difficulty})
                      </div>
                    </div>
                    {weakestPattern.nextUnsolved && (
                      <a
                        href={weakestPattern.nextUnsolved.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
                      >
                        <span>Open LeetCode</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                );
              })()}

              {/* Action 2: Next Syllabus Subtopic */}
              {(() => {
                const nextItem = syllabusStore.getNextPendingItem();
                return (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black font-extrabold text-[10px]">2</span>
                        <span>Today's Curriculum Subtopic: {nextItem?.subtopic || 'Java 21 Concurrency'}</span>
                      </div>
                      <div className="text-[11px] text-gray-300 mt-0.5">
                        Key Focus: {nextItem?.keyTakeaway || 'Virtual Threads and Non-blocking IO'}
                      </div>
                    </div>
                    {nextItem && (
                      <a
                        href={nextItem.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
                      >
                        <span>View Guide</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                );
              })()}

              {/* Action 3: Review 1 Unmastered Trap */}
              {(() => {
                const unmasteredTrap = INTERVIEW_TRAP_CARDS.find(t => !masteredTrapIds.has(t.id)) || INTERVIEW_TRAP_CARDS[0];
                return (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-purple-500 text-white font-extrabold text-[10px]">3</span>
                        <span>Master 1 System Architecture Trap</span>
                      </div>
                      <div className="text-[11px] text-gray-300 mt-0.5">
                        {unmasteredTrap.title} ({unmasteredTrap.category})
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('traps');
                        setTrapCategory(unmasteredTrap.category);
                        toggleRevealTrap(unmasteredTrap.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
                    >
                      <span>Drill Flashcard</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
