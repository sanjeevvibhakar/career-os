import React, { useState, useMemo } from 'react';
import { 
  Brain, Search, ExternalLink, Check, CheckCircle2, Clock, 
  RotateCw, PlusCircle, Filter, BookOpen, AlertTriangle, 
  HelpCircle, ChevronRight, Sparkles, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useDsaStore, type DsaAttempt } from '../../stores/dsaStore';
import { MASTER_ROADMAP_TOPICS, type MasterRoadmapTopic } from '../../data/masterRoadmapData';
import { DSA_PROBLEMS, type DsaProblemSeed } from '../../data/dsaProblems';
import { soundService } from '../../services/soundService';

export const DSATrackerPage: React.FC = () => {
  const dsaStore = useDsaStore();

  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'PROBLEMS' | 'REVISIONS'>('ROADMAP');
  const [selectedTopicOrder, setSelectedTopicOrder] = useState<number>(4); // Default to Hashing (Topic 4)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedProblemForLog, setSelectedProblemForLog] = useState<DsaProblemSeed | null>(null);

  // Form state for logging problem attempt
  const [timeTaken, setTimeTaken] = useState(25);
  const [solvedIndependently, setSolvedIndependently] = useState(true);
  const [approach, setApproach] = useState('');
  const [mistakeNote, setMistakeNote] = useState('');
  const [complexityTime, setComplexityTime] = useState('O(N)');
  const [complexitySpace, setComplexitySpace] = useState('O(N)');
  const [confidence, setConfidence] = useState(4);

  // 17 DSA Roadmap Topics from MASTER_ROADMAP_TOPICS
  const dsaRoadmapTopics = useMemo(() => {
    return MASTER_ROADMAP_TOPICS
      .filter(t => t.track === 'DSA')
      .sort((a, b) => a.order - b.order);
  }, []);

  const activeTopic = useMemo(() => {
    return dsaRoadmapTopics.find(t => t.order === selectedTopicOrder) || dsaRoadmapTopics[0];
  }, [dsaRoadmapTopics, selectedTopicOrder]);

  // Problems mapped to solved status
  const solvedProblemIds = useMemo(() => {
    return new Set(dsaStore.attempts.map(a => a.problemId));
  }, [dsaStore.attempts]);

  const dueRevisions = dsaStore.getDueRevisions();

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    let list = DSA_PROBLEMS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.pattern.toLowerCase().includes(q));
    }
    if (selectedDifficulty !== 'ALL') {
      list = list.filter(p => p.difficulty === selectedDifficulty);
    }
    return list;
  }, [searchQuery, selectedDifficulty]);

  const stats = useMemo(() => {
    const totalSolved = solvedProblemIds.size;
    const independentSolves = dsaStore.attempts.filter(a => a.solvedIndependently).length;
    const independentRate = dsaStore.attempts.length > 0
      ? Math.round((independentSolves / dsaStore.attempts.length) * 100)
      : 100;

    return {
      totalSolved,
      totalProblems: DSA_PROBLEMS.length,
      independentRate,
      dueRevisionsCount: dueRevisions.length,
    };
  }, [solvedProblemIds, dsaStore.attempts, dueRevisions]);

  const [isCustomLog, setIsCustomLog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSource, setCustomSource] = useState('LEETCODE');
  const [customPattern, setCustomPattern] = useState('Hash Map Lookup');
  const [customDifficulty, setCustomDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [attemptOutcome, setAttemptOutcome] = useState<'PASS_FIRST_TRY' | 'STRUGGLED' | 'FAILED'>('PASS_FIRST_TRY');

  const handleOpenLogModal = (problem: DsaProblemSeed) => {
    setIsCustomLog(false);
    setSelectedProblemForLog(problem);
    setTimeTaken(25);
    setSolvedIndependently(true);
    setApproach('');
    setMistakeNote('');
    setConfidence(4);
    setAttemptOutcome('PASS_FIRST_TRY');
    setLogModalOpen(true);
  };

  const handleOpenCustomLogModal = () => {
    setIsCustomLog(true);
    setSelectedProblemForLog(null);
    setCustomName('');
    setCustomSource('LEETCODE');
    setCustomPattern('Hash Map Lookup');
    setCustomDifficulty('MEDIUM');
    setTimeTaken(25);
    setSolvedIndependently(true);
    setApproach('');
    setMistakeNote('');
    setConfidence(4);
    setAttemptOutcome('PASS_FIRST_TRY');
    setLogModalOpen(true);
  };

  const handleSaveAttempt = (e: React.FormEvent) => {
    e.preventDefault();

    let targetProblemId: number;

    if (isCustomLog) {
      if (!customName.trim()) return;
      targetProblemId = dsaStore.addCustomProblem({
        name: customName.trim(),
        difficulty: customDifficulty,
        source: customSource as any,
        sourceUrl: '',
        pattern: customPattern.trim() || 'General Algorithmic Pattern',
        topicId: selectedTopicOrder || 1,
      });
    } else {
      if (!selectedProblemForLog) return;
      targetProblemId = selectedProblemForLog.id;
    }

    dsaStore.logAttempt(targetProblemId, {
      timeTakenMin: Number(timeTaken),
      solvedIndependently,
      approach: approach || 'Standard optimal pattern approach',
      mistake: mistakeNote || 'None',
      complexityTime: complexityTime || 'O(N)',
      complexitySpace: complexitySpace || 'O(1)',
      lesson: 'Good pattern recognition practice',
      confidence: Number(confidence),
      reSolvePerformance: attemptOutcome,
    });

    soundService.playCheckSound();
    setLogModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans text-gray-100">
      
      {/* 1. Header */}
      <header className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0d1017] to-blue-950/30 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Brain size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                DSA Roadmap & Practice Tracker
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              17-step industry learning sequence from Diagnostic Assessment to Timed Mock Interviews.
            </p>
          </div>

          {/* Simple Stats Pill (No XP, streaks or gamification) */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">Logged Solved: </span>
              <strong className="text-white">{stats.totalSolved}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">Independent Rate: </span>
              <strong className="text-emerald-400">{stats.independentRate}%</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('ROADMAP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'ROADMAP'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            1. 17-Topic Master Sequence
          </button>

          <button
            onClick={() => setActiveTab('PROBLEMS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'PROBLEMS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            2. Problem Bank ({DSA_PROBLEMS.length})
          </button>

          <button
            onClick={() => setActiveTab('REVISIONS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REVISIONS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>3. Revisions Due</span>
            {dueRevisions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-bold">
                {dueRevisions.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ======================================================= */}
      {/* TAB 1: 17-TOPIC MASTER ROADMAP SEQUENCE */}
      {/* ======================================================= */}
      {activeTab === 'ROADMAP' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* 17 Topics List (Left Column) */}
            <div className="lg:col-span-5 space-y-1.5 max-h-[650px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Curriculum Sequence (1–17)
              </div>

              {dsaRoadmapTopics.map((topic) => {
                const isSelected = topic.order === selectedTopicOrder;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicOrder(topic.order)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-md text-white'
                        : 'bg-[#0d1017] border-white/5 hover:border-white/15 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 font-bold ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'
                      }`}>
                        {topic.order}
                      </span>
                      <span className="text-xs font-bold truncate">
                        {topic.stage.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400 shrink-0">
                      {topic.estimatedEffort}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Topic Deep Dive Details (Right Column) */}
            <div className="lg:col-span-7 bg-[#0d1017] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                  <span>Topic #{activeTopic.order} of 17</span>
                  <span className="text-gray-400">{activeTopic.estimatedEffort}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeTopic.title}
                </h2>
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
                <span className="font-bold text-gray-200">Detailed Explanation:</span>
                <p>{activeTopic.shortExplanation}</p>
                <p className="text-purple-300 pt-1">
                  <strong>Why it matters in interviews: </strong>
                  {activeTopic.whyItMatters}
                </p>
              </div>

              {/* Time and Space Complexity Guidelines */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1 font-mono">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>Time & Space Complexity Standard:</span>
                </span>
                <div className="text-gray-300">
                  {activeTopic.timeSpaceComplexity || 'Standard optimal complexity expected.'}
                </div>
              </div>

              {/* Common Mistakes */}
              {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle size={13} />
                    <span>Common Candidate Mistakes:</span>
                  </span>
                  <ul className="text-gray-300 text-[11px] list-disc list-inside space-y-0.5">
                    {activeTopic.commonMistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Questions & Examples */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-gray-200 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-purple-400" />
                  <span>Example Problems & Recommended Resources:</span>
                </span>

                <div className="space-y-1.5">
                  {activeTopic.practiceExercises.map((ex, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{ex.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{ex.description}</div>
                      </div>
                      {ex.practiceUrl && (
                        <a
                          href={ex.practiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono shrink-0 ml-2"
                        >
                          <span>Solve</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Completion Criteria */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 size={13} />
                  <span>Topic Completion Criteria:</span>
                </span>
                <ul className="text-gray-300 text-[11px] list-disc list-inside space-y-0.5">
                  {activeTopic.completionCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Interview-level follow-up questions */}
              {activeTopic.interviewFollowUps && activeTopic.interviewFollowUps.length > 0 && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-purple-300">
                    <HelpCircle size={13} />
                    <span>Interview Follow-Up Questions:</span>
                  </span>
                  <ul className="text-gray-300 text-[11px] list-disc list-inside space-y-0.5">
                    {activeTopic.interviewFollowUps.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* ======================================================= */}
      {/* TAB 2: PROBLEM BANK & SIMPLE ATTEMPT TRACKER */}
      {/* ======================================================= */}
      {activeTab === 'PROBLEMS' && (
        <section className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-[#0d1017] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem name or algorithmic pattern..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-mono">Difficulty:</span>
              {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenCustomLogModal}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle size={14} />
              <span>+ Log Problem</span>
            </button>
          </div>

          {/* Problem Table */}
          <div className="rounded-2xl bg-[#0d1017] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-12 text-center">Status</th>
                    <th className="p-3">Problem Name</th>
                    <th className="p-3">Pattern</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Source</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProblems.map((problem) => {
                    const isSolved = solvedProblemIds.has(problem.id);
                    const lastAttempt = dsaStore.attempts.find(a => a.problemId === problem.id);

                    return (
                      <tr key={problem.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 text-center">
                          {isSolved ? (
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto" title="Solved">
                              <Check size={12} />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-md border border-white/20 inline-block" title="Unsolved" />
                          )}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{problem.name}</span>
                            {problem.sourceUrl && (
                              <a
                                href={problem.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-blue-400"
                              >
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                          {lastAttempt && lastAttempt.mistake && lastAttempt.mistake !== 'None' && (
                            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                              Mistake note: {lastAttempt.mistake}
                            </div>
                          )}
                        </td>

                        <td className="p-3 font-mono text-gray-300 text-[11px]">
                          {problem.pattern}
                        </td>

                        <td className="p-3 font-mono text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            problem.difficulty === 'EASY'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : problem.difficulty === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-300'
                              : 'bg-rose-500/10 text-rose-300'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>

                        <td className="p-3 text-gray-400 font-mono text-[11px]">
                          {problem.source.replace('_', ' ')}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenLogModal(problem)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                          >
                            {isSolved ? 'Log Re-Attempt' : 'Log Attempt'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================= */}
      {/* TAB 3: DUE REVISIONS */}
      {/* ======================================================= */}
      {activeTab === 'REVISIONS' && (
        <section className="space-y-3">
          <div className="p-4 rounded-xl bg-[#0d1017] border border-white/10 text-xs text-gray-300 space-y-1">
            <h3 className="font-bold text-white text-sm">Spaced Repetition Queue</h3>
            <p className="text-gray-400">
              Problems automatically scheduled for revision based on past confidence and mistake notes.
            </p>
          </div>

          {dueRevisions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0d1017] border border-white/10 text-center text-xs text-gray-400 font-mono">
              ✓ No revisions currently due. Keep practicing new problems from the roadmap!
            </div>
          ) : (
            <div className="space-y-2">
              {dueRevisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl bg-[#0d1017] border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{rev.problemName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                        {rev.pattern}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Revision #{rev.revisionNumber} • Scheduled: {rev.scheduledDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        dsaStore.completeRevision(rev.id, 20, 5, 'PASS_FIRST_TRY');
                        soundService.playCheckSound();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ======================================================= */}
      {/* MODAL: LOG PROBLEM ATTEMPT */}
      {/* ======================================================= */}
      {/* ======================================================= */}
      {/* MODAL: LOG PROBLEM ATTEMPT */}
      {/* ======================================================= */}
      {logModalOpen && (selectedProblemForLog || isCustomLog) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1219] border border-white/15 rounded-2xl max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {isCustomLog ? 'Log Problem Attempt' : selectedProblemForLog?.name}
                </h3>
                <span className="text-[11px] font-mono text-purple-300">
                  {isCustomLog ? 'Custom Problem Log' : selectedProblemForLog?.pattern}
                </span>
              </div>
              <button onClick={() => setLogModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAttempt} className="space-y-3">
              {isCustomLog && (
                <>
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Problem Name:</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Subarray Sum Equals K"
                      required
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Source:</label>
                      <select
                        value={customSource}
                        onChange={(e) => setCustomSource(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1219] border border-white/10 text-white font-mono cursor-pointer"
                      >
                        <option value="LEETCODE">LeetCode</option>
                        <option value="STRIVER_A2Z">Striver A2Z</option>
                        <option value="NEETCODE_150">NeetCode 150</option>
                        <option value="GRIND_75">Grind 75</option>
                        <option value="GEEKSFORGEEKS">GeeksforGeeks</option>
                        <option value="CODEFORCES">Codeforces</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Difficulty:</label>
                      <select
                        value={customDifficulty}
                        onChange={(e) => setCustomDifficulty(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1219] border border-white/10 text-white font-mono cursor-pointer"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Algorithmic Pattern / Topic:</label>
                    <input
                      type="text"
                      value={customPattern}
                      onChange={(e) => setCustomPattern(e.target.value)}
                      placeholder="e.g. Prefix Sum + Hash Map"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-300 font-medium mb-1">Attempt Outcome:</label>
                <select
                  value={attemptOutcome}
                  onChange={(e) => setAttemptOutcome(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1219] border border-white/10 text-white font-mono cursor-pointer"
                >
                  <option value="PASS_FIRST_TRY">✓ Solved independently on first attempt</option>
                  <option value="STRUGGLED">⚠️ Solved with minor hint / struggle</option>
                  <option value="FAILED">✗ Needed editorial / solution lookup</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Time Taken (minutes):</label>
                <input
                  type="number"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(Number(e.target.value))}
                  min={1}
                  max={120}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="solvedIndependently"
                  checked={solvedIndependently}
                  onChange={(e) => setSolvedIndependently(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-white/5 border-white/10 cursor-pointer"
                />
                <label htmlFor="solvedIndependently" className="text-gray-200 cursor-pointer">
                  Solved independently (zero editorial hints)
                </label>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Mistake Notes (if any):</label>
                <input
                  type="text"
                  value={mistakeNote}
                  onChange={(e) => setMistakeNote(e.target.value)}
                  placeholder="e.g. Missed edge case where all numbers are negative"
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Time Complexity:</label>
                  <input
                    type="text"
                    value={complexityTime}
                    onChange={(e) => setComplexityTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Space Complexity:</label>
                  <input
                    type="text"
                    value={complexitySpace}
                    onChange={(e) => setComplexitySpace(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Confidence (1–5):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidence(lvl)}
                      className={`flex-1 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                        confidence === lvl ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-3 py-1.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
