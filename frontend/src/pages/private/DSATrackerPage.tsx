import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { DifficultyBadge } from '../../components/shared/DifficultyBadge';
import { ConfidenceStars } from '../../components/shared/ConfidenceStars';
import { useDsaStore } from '../../stores/dsaStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { CURRICULUM_LEVELS } from '../../data/curriculumData';
import { DSA_PROBLEMS, DSA_TOPICS } from '../../data/dsaProblems';
import { soundService } from '../../services/soundService';
import { InterviewReadinessModal } from '../../components/shared/InterviewReadinessModal';
import { 
  Search, ExternalLink, Filter, CheckCircle2, RotateCw, PlusCircle, Check,
  Sparkles, Building2, Target, Award, Lock, BookOpen, Layers, X, SlidersHorizontal, Zap
} from 'lucide-react';

export const DSATrackerPage: React.FC = () => {
  const dsaStore = useDsaStore();
  const dashboardStore = useDashboardStore();
  
  const [readinessHubOpen, setReadinessHubOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'levels' | 'topics' | 'revisions' | 'stats'>('levels');
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(0);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(1); // Default open first topic
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNSOLVED' | 'SOLVED'>('ALL');
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  const solvedProblemIds = useMemo(() => new Set(dsaStore.attempts.map(a => a.problemId)), [dsaStore.attempts]);

  // Extract unique patterns
  const allPatterns = useMemo(() => {
    const set = new Set<string>();
    DSA_PROBLEMS.forEach(p => {
      if (p.pattern) set.add(p.pattern);
    });
    return Array.from(set).sort();
  }, []);

  const isFilterActive = 
    searchQuery.trim() !== '' || 
    selectedDifficulty !== 'ALL' || 
    selectedStatus !== 'ALL' || 
    selectedPattern !== 'ALL' || 
    selectedSource !== 'ALL';

  const searchResults = useMemo(() => {
    if (!isFilterActive) return [];
    const q = searchQuery.toLowerCase().trim();

    return DSA_PROBLEMS.filter(p => {
      const topic = DSA_TOPICS.find(t => t.id === p.topicId)?.name || '';
      const isSolved = solvedProblemIds.has(p.id);

      if (q) {
        const matchName = p.name.toLowerCase().includes(q);
        const matchPattern = p.pattern.toLowerCase().includes(q);
        const matchTopic = topic.toLowerCase().includes(q);
        if (!matchName && !matchPattern && !matchTopic) return false;
      }

      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
      if (selectedStatus === 'UNSOLVED' && isSolved) return false;
      if (selectedStatus === 'SOLVED' && !isSolved) return false;
      if (selectedPattern !== 'ALL' && p.pattern !== selectedPattern) return false;
      if (selectedSource !== 'ALL' && p.source !== selectedSource) return false;

      return true;
    });
  }, [isFilterActive, searchQuery, selectedDifficulty, selectedStatus, selectedPattern, selectedSource, solvedProblemIds]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('ALL');
    setSelectedStatus('ALL');
    setSelectedPattern('ALL');
    setSelectedSource('ALL');
  };
  
  // Attempt Logging Modal State
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [formData, setFormData] = useState({
    timeTakenMin: 25,
    solvedIndependently: true,
    approach: '',
    mistake: '',
    complexityTime: 'O(n)',
    complexitySpace: 'O(1)',
    lesson: '',
    confidence: 4
  });

  // Complete Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<any>(null);
  const [revisionTime, setRevisionTime] = useState(15);
  const [revisionConfidence, setRevisionConfidence] = useState(4);

  const handleOpenLogModal = (problem: any) => {
    setSelectedProblem(problem);
    setFormData({
      timeTakenMin: 25,
      solvedIndependently: true,
      approach: '',
      mistake: '',
      complexityTime: 'O(n)',
      complexitySpace: 'O(1)',
      lesson: '',
      confidence: 4
    });
    setLogModalOpen(true);
  };

  const handleLogAttempt = () => {
    if (!selectedProblem) return;
    dsaStore.logAttempt(selectedProblem.id, formData);
    dashboardStore.updateStreak('dsa');
    soundService.playSuccessChime();
    setLogModalOpen(false);
  };

  const handleCompleteRevision = () => {
    if (!selectedRevision) return;
    dsaStore.completeRevision(selectedRevision.id, revisionTime, revisionConfidence);
    dashboardStore.updateStreak('dsa');
    soundService.playCheckSound();
    setRevisionModalOpen(false);
  };

  const topicStats = dsaStore.getTopicStats();
  const dueRevisions = dsaStore.getDueRevisions();
  const stats = dsaStore.getStats();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Algorithmic Pattern Tracker</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Master durable patterns across Striver A2Z & NeetCode 150 with automated spaced repetition.
          </p>
        </div>

        {/* Global Stats Summary & Pattern Hub */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setReadinessHubOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            title="Open 15-Pattern Matrix & Interview Traps"
          >
            <Zap size={14} className="text-amber-400" />
            <span>Pattern Hub</span>
          </button>

          <div className="px-3 sm:px-4 py-2 rounded-xl glass-panel text-center">
            <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] block">Solved</span>
            <span className="text-base sm:text-lg font-bold text-sky-400">{stats.totalSolved} / {stats.totalProblems}</span>
          </div>
          <div className="px-3 sm:px-4 py-2 rounded-xl glass-panel text-center">
            <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] block">Mastery</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              {stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button 
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'levels' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('levels')}
        >
          <Sparkles size={15} />
          <span>Syllabus Levels (0 to 5)</span>
        </button>
        <button 
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'topics' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('topics')}
        >
          <Layers size={15} />
          <span>20 Topics View</span>
        </button>
        <button 
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'revisions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('revisions')}
        >
          <span>Spaced Revisions</span>
          {dueRevisions.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/80 text-white animate-pulse">
              {dueRevisions.length} due
            </span>
          )}
        </button>
        <button 
          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${activeTab === 'stats' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('stats')}
        >
          Mastery Analytics
        </button>
      </div>

      {/* 2. Global Problem Search & Pattern Filters */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/10 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input 
              type="text"
              placeholder="Search problems by name, pattern (e.g. Sliding Window), or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 font-mono focus:outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Status</option>
              <option value="UNSOLVED">Unsolved Only</option>
              <option value="SOLVED">Solved Only</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 font-mono focus:outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Pattern Filter Dropdown */}
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 font-mono focus:outline-none focus:border-blue-500/50 max-w-[160px] truncate"
            >
              <option value="ALL">All Patterns ({allPatterns.length})</option>
              {allPatterns.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 font-mono focus:outline-none focus:border-blue-500/50"
            >
              <option value="ALL">All Sheets</option>
              <option value="NEETCODE_150">NeetCode 150</option>
              <option value="STRIVER_A2Z">Striver A2Z</option>
            </select>

            {/* Clear All Button if active */}
            {isFilterActive && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1 transition-all"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {isFilterActive ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 gap-2 text-xs">
            <div className="flex items-center gap-2 text-white">
              <span className="font-bold text-blue-400 font-mono">
                {searchResults.length} of {DSA_PROBLEMS.length} Problems Matching
              </span>
              <span className="text-gray-400 hidden sm:inline">
                ({selectedStatus !== 'ALL' ? selectedStatus : ''} {selectedDifficulty !== 'ALL' ? selectedDifficulty : ''} {selectedPattern !== 'ALL' ? `• ${selectedPattern}` : ''})
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-400 hover:text-white font-mono underline self-start sm:self-auto"
            >
              Clear All Filters
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 space-y-3">
              <Search size={32} className="mx-auto text-gray-500" />
              <p className="text-sm font-bold text-white">No problems found matching your filters.</p>
              <p className="text-xs text-gray-400 font-mono">Try searching for a different pattern name or resetting difficulty.</p>
              <Button onClick={clearAllFilters} variant="secondary" size="sm" className="mt-2">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map(prob => {
                const isSolved = solvedProblemIds.has(prob.id);
                const attemptData = dsaStore.attempts.filter(a => a.problemId === prob.id);
                const lastAttempt = attemptData[attemptData.length - 1];
                const topic = DSA_TOPICS.find(t => t.id === prob.topicId);

                return (
                  <div 
                    key={prob.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSolved 
                        ? 'bg-emerald-950/15 border-emerald-500/25' 
                        : 'bg-[#090b10] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isSolved ? (
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                          )}
                          <a
                            href={prob.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate text-sm"
                          >
                            <span className="truncate">{prob.name}</span>
                            <ExternalLink size={12} className="text-gray-500 flex-shrink-0" />
                          </a>
                          <DifficultyBadge difficulty={prob.difficulty as any} />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs font-mono">
                          {topic && (
                            <span className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                              {topic.icon} {topic.name}
                            </span>
                          )}
                          <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                            {prob.pattern}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {prob.source.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenLogModal(prob)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0 ${
                          isSolved 
                            ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'
                        }`}
                      >
                        <PlusCircle size={13} />
                        <span>{isSolved ? 'Log Again' : 'Solve & Log'}</span>
                      </button>
                    </div>

                    {isSolved && lastAttempt && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                        <span>Solved in {lastAttempt.timeTakenMin}m</span>
                        <div className="flex items-center gap-1.5">
                          <span>Confidence:</span>
                          <ConfidenceStars value={lastAttempt.confidence} size={11} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 1. LEVELS TAB (BEGINNER TO ADVANCED ZERO-OVERWHELM SYLLABUS) */}
          {activeTab === 'levels' && (() => {
        const curLevel = CURRICULUM_LEVELS.find(l => l.levelNumber === selectedLevelNum) || CURRICULUM_LEVELS[0];
        const solvedCountInLevel = curLevel.recommendedProblemIds.filter(id => solvedProblemIds.has(id)).length;
        const totalInLevel = curLevel.recommendedProblemIds.length;
        const levelPct = Math.min(100, Math.round((solvedCountInLevel / totalInLevel) * 100));

        return (
          <div className="space-y-5">
            {/* 6 Level Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CURRICULUM_LEVELS.map(level => {
                const isSelected = selectedLevelNum === level.levelNumber;
                const solvedInThis = level.recommendedProblemIds.filter(id => solvedProblemIds.has(id)).length;
                const totalInThis = level.recommendedProblemIds.length;
                const isCompleted = solvedInThis >= Math.max(1, Math.floor(totalInThis * 0.6));

                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevelNum(level.levelNumber)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-blue-600/20 border-blue-500/40 shadow-lg text-white' 
                        : 'bg-black/30 border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>{level.icon} L{level.levelNumber}</span>
                      {isCompleted && <span className="text-emerald-400 text-xs">✓</span>}
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-1">
                      {level.title}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {solvedInThis}/{totalInThis} Solved
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(solvedInThis / totalInThis) * 100}%` }} 
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Level Header & Synergy Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 bg-gradient-to-br from-blue-950/20 via-black/40 to-black/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{curLevel.icon}</span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      Level {curLevel.levelNumber}: {curLevel.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 font-mono mt-0.5">
                    {curLevel.weeks} • {curLevel.theme}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-xs text-gray-400">Level Progress</div>
                    <div className="text-base font-bold text-blue-400">{solvedCountInLevel} / {totalInLevel} ({levelPct}%)</div>
                  </div>
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${levelPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Dual Synergy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold font-mono text-[11px]">
                    <Building2 size={14} />
                    <span>HOW THIS HELPS AT YOUR CURRENT JOB</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {curLevel.whyAtWork}
                  </p>
                  <div className="text-[11px] text-blue-300 font-mono pt-1.5 border-t border-blue-500/15">
                    Action: {curLevel.practicalWorkAction}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold font-mono text-[11px]">
                    <Target size={14} />
                    <span>HOW THIS HELPS IN TIER-1 INTERVIEWS (2027)</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {curLevel.whyInInterview}
                  </p>
                  <div className="text-[11px] text-purple-300 font-mono pt-1.5 border-t border-purple-500/15">
                    Prep: {curLevel.interviewPrepAction}
                  </div>
                </div>
              </div>

              {/* Pass Rule Alert */}
              <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/25 flex items-start gap-2.5 text-xs">
                <Award size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 font-mono text-xs">PASS RULE TO ADVANCE:</span>
                  <p className="text-gray-300 text-xs mt-0.5">{curLevel.passRule}</p>
                </div>
              </div>
            </div>

            {/* Level Problems List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase font-mono tracking-wider text-gray-300">
                  Target Problems for Level {curLevel.levelNumber} ({curLevel.recommendedProblemIds.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Master one pattern at a time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {curLevel.recommendedProblemIds.map(probId => {
                  const prob = DSA_PROBLEMS.find(p => p.id === probId);
                  if (!prob) return null;
                  const isSolved = solvedProblemIds.has(probId);
                  const attemptData = dsaStore.attempts.filter(a => a.problemId === probId);
                  const lastAttempt = attemptData[attemptData.length - 1];

                  return (
                    <div 
                      key={probId}
                      className={`p-4 rounded-xl border transition-all ${
                        isSolved 
                          ? 'bg-emerald-950/15 border-emerald-500/25' 
                          : 'bg-[#090b10] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isSolved ? (
                              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                            )}
                            <a
                              href={prob.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate text-sm"
                            >
                              <span className="truncate">{prob.name}</span>
                              <ExternalLink size={12} className="text-gray-500 flex-shrink-0" />
                            </a>
                            <DifficultyBadge difficulty={prob.difficulty as any} />
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-mono">
                            <span className="text-blue-300">Pattern: {prob.pattern}</span>
                            <span>•</span>
                            <span className="text-gray-500">{prob.source.replace('_', ' ')}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenLogModal(prob)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0 ${
                            isSolved 
                              ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
                              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'
                          }`}
                        >
                          <PlusCircle size={13} />
                          <span>{isSolved ? 'Log Again' : 'Solve'}</span>
                        </button>
                      </div>

                      {isSolved && lastAttempt && (
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                          <span>Solved in {lastAttempt.timeTakenMin}m</span>
                          <div className="flex items-center gap-1.5">
                            <span>Confidence:</span>
                            <ConfidenceStars value={lastAttempt.confidence} size={11} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Topics View */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topicStats.map(topic => {
            const topicProblems = dsaStore.getProblemsByTopic(topic.topicId);
            const filteredProblems = topicProblems.filter(p => {
              const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    p.pattern.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
              return matchesSearch && matchesDiff;
            });

            const isExpanded = expandedTopic === topic.topicId;

            return (
              <div 
                key={topic.topicId} 
                className={`glass-panel rounded-2xl p-6 transition-all ${isExpanded ? 'border-blue-500/40' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.topicId)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-white/5">{topic.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg text-white">{topic.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{topic.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">{topic.solved} / {topic.total}</span>
                    <span className="text-xs text-gray-500 block">solved</span>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar 
                    value={topic.total > 0 ? (topic.solved / topic.total) * 100 : 0} 
                    color="bg-gradient-to-r from-blue-500 to-indigo-500" 
                  />
                </div>

                {/* Collapsible Problems List */}
                {isExpanded && (
                  <div className="mt-6 space-y-3 pt-5 border-t border-white/5">
                    {filteredProblems.length === 0 ? (
                      <p className="text-xs text-gray-500 py-3 text-center">No problems match your search criteria.</p>
                    ) : (
                      filteredProblems.map(problem => {
                        const isSolved = problem.attemptCount > 0;
                        return (
                          <div 
                            key={problem.id} 
                            className={`p-4 rounded-xl transition-all border ${isSolved ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-[#090b10] border-white/5 hover:border-white/10'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  {isSolved ? (
                                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                                  )}
                                  <a 
                                    href={problem.sourceUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="font-medium text-white hover:text-blue-400 transition-colors flex items-center gap-1.5"
                                  >
                                    <span>{problem.name}</span>
                                    <ExternalLink size={13} className="text-gray-500" />
                                  </a>
                                  <DifficultyBadge difficulty={problem.difficulty as any} />
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
                                  <span className="text-blue-300 font-mono">Pattern: {problem.pattern}</span>
                                  <span>•</span>
                                  <span className="text-gray-500">{problem.source.replace('_', ' ')}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleOpenLogModal(problem)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${isSolved ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20'}`}
                              >
                                <PlusCircle size={13} />
                                <span>{isSolved ? 'Log Again' : 'Solve'}</span>
                              </button>
                            </div>

                            {isSolved && (
                              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                                <span>Attempts: <strong className="text-white">{problem.attemptCount}</strong></span>
                                <div className="flex items-center gap-1.5">
                                  <span>Confidence:</span>
                                  <ConfidenceStars value={problem.confidence} size={12} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Due Revisions View */}
      {activeTab === 'revisions' && (
        <div className="space-y-4">
          {dueRevisions.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Zero Revisions Pending!</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                You are fully caught up with your spaced repetition intervals. Solve a new problem today to trigger the next 5-stage retention cycle.
              </p>
            </div>
          ) : (
            dueRevisions.map(rev => (
              <div key={rev.id} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-purple-500">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300">
                      Revision Stage #{rev.revisionNumber}
                    </span>
                    <h4 className="font-bold text-white text-base">{rev.problemName}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Topic: <strong className="text-gray-300">{rev.topicName}</strong> • Pattern: <strong className="text-blue-300 font-mono">{rev.pattern}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => dsaStore.skipRevision(rev.id)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRevision(rev);
                      setRevisionTime(15);
                      setRevisionConfidence(4);
                      setRevisionModalOpen(true);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Complete Review</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Analytics View */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-semibold text-gray-400 block mb-1">Total Unique Solved</span>
              <span className="text-4xl font-extrabold text-white">{stats.totalSolved}</span>
              <span className="text-xs text-gray-500 block mt-2">Target: 220–250 core patterns</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-semibold text-emerald-400 block mb-1">Easy Problems</span>
              <span className="text-4xl font-extrabold text-emerald-400">{stats.easy}</span>
              <span className="text-xs text-gray-500 block mt-2">Foundational pattern identification</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-semibold text-amber-400 block mb-1">Medium Problems</span>
              <span className="text-4xl font-extrabold text-amber-400">{stats.medium}</span>
              <span className="text-xs text-gray-500 block mt-2">Primary interview focus (70%)</span>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-semibold text-rose-400 block mb-1">Hard Problems</span>
              <span className="text-4xl font-extrabold text-rose-400">{stats.hard}</span>
              <span className="text-xs text-gray-500 block mt-2">Deep edge cases & multi-pattern</span>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Attempt Logger Modal */}
      <Modal 
        isOpen={logModalOpen} 
        onClose={() => setLogModalOpen(false)} 
        title={`Log Solution: ${selectedProblem?.name}`}
      >
        <div className="space-y-5">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            Pattern: <strong>{selectedProblem?.pattern}</strong> • Saving this attempt will automatically schedule 5 spaced retention checkpoints (+1, +3, +7, +21, +60 days).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="Time Taken (Minutes)" 
              value={formData.timeTakenMin} 
              onChange={(e) => setFormData({...formData, timeTakenMin: parseInt(e.target.value) || 0})} 
            />
            <div className="flex items-center gap-3 pt-6">
              <input 
                type="checkbox" 
                id="indep" 
                checked={formData.solvedIndependently} 
                onChange={(e) => setFormData({...formData, solvedIndependently: e.target.checked})} 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="indep" className="text-sm text-gray-300 font-medium">Solved without hints?</label>
            </div>
          </div>

          <Textarea 
            label="Approach & Core Intuition" 
            placeholder="e.g. Used monotonic stack to track next greater element in O(n)..."
            value={formData.approach} 
            onChange={(e) => setFormData({...formData, approach: e.target.value})} 
            rows={3} 
          />

          <Textarea 
            label="Mistakes / Pitfalls Encountered" 
            placeholder="e.g. Forgot edge case when array has duplicate values..."
            value={formData.mistake} 
            onChange={(e) => setFormData({...formData, mistake: e.target.value})} 
            rows={2} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Time Complexity" 
              value={formData.complexityTime} 
              onChange={(e) => setFormData({...formData, complexityTime: e.target.value})} 
              placeholder="O(N)" 
            />
            <Input 
              label="Space Complexity" 
              value={formData.complexitySpace} 
              onChange={(e) => setFormData({...formData, complexitySpace: e.target.value})} 
              placeholder="O(1)" 
            />
          </div>

          <Textarea 
            label="Key Takeaway / Lesson" 
            placeholder="Always consider prefix sums when sub-array ranges are queried..."
            value={formData.lesson} 
            onChange={(e) => setFormData({...formData, lesson: e.target.value})} 
            rows={2} 
          />

          <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)] font-medium">Pattern Confidence</label>
            <ConfidenceStars value={formData.confidence} onChange={(v) => setFormData({...formData, confidence: v})} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleLogAttempt}>Save Attempt & Start Spaced Revision</Button>
          </div>
        </div>
      </Modal>

      {/* Revision Modal */}
      <Modal 
        isOpen={revisionModalOpen} 
        onClose={() => setRevisionModalOpen(false)} 
        title={`Complete Revision: ${selectedRevision?.problemName}`}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--text-secondary)]">
            Stage #{selectedRevision?.revisionNumber} Checkpoint for <strong>{selectedRevision?.problemName}</strong> ({selectedRevision?.pattern}).
          </p>

          <Input 
            type="number" 
            label="Time Taken to Re-solve (Minutes)" 
            value={revisionTime} 
            onChange={(e) => setRevisionTime(parseInt(e.target.value) || 0)} 
          />

          <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)] font-medium">Current Pattern Recall Confidence</label>
            <ConfidenceStars value={revisionConfidence} onChange={(v) => setRevisionConfidence(v)} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setRevisionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteRevision}>Confirm Revision Complete</Button>
          </div>
        </div>
      </Modal>

      {/* Tier-1 Pattern Mastery & Interview Readiness Hub */}
      <InterviewReadinessModal
        isOpen={readinessHubOpen}
        onClose={() => setReadinessHubOpen(false)}
        onSelectProblemForLog={(prob) => handleOpenLogModal(prob)}
      />
    </div>
  );
};
