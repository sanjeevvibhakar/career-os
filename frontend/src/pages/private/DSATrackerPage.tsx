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
import { Search, ExternalLink, Filter, CheckCircle2, RotateCw, PlusCircle, Check } from 'lucide-react';

export const DSATrackerPage: React.FC = () => {
  const dsaStore = useDsaStore();
  const dashboardStore = useDashboardStore();
  
  const [activeTab, setActiveTab] = useState<'topics' | 'revisions' | 'stats'>('topics');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(1); // Default open first topic
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  
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
    setLogModalOpen(false);
  };

  const handleCompleteRevision = () => {
    if (!selectedRevision) return;
    dsaStore.completeRevision(selectedRevision.id, revisionTime, revisionConfidence);
    dashboardStore.updateStreak('dsa');
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

        {/* Global Stats Summary */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass-panel text-center">
            <span className="text-xs text-[var(--text-secondary)] block">Solved</span>
            <span className="text-lg font-bold text-sky-400">{stats.totalSolved} / {stats.totalProblems}</span>
          </div>
          <div className="px-4 py-2 rounded-xl glass-panel text-center">
            <span className="text-xs text-[var(--text-secondary)] block">Mastery</span>
            <span className="text-lg font-bold text-emerald-400">
              {stats.totalProblems > 0 ? Math.round((stats.totalSolved / stats.totalProblems) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button 
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'topics' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('topics')}
        >
          Curriculum by Pattern ({topicStats.length} Topics)
        </button>
        <button 
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'revisions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
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
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'stats' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
          onClick={() => setActiveTab('stats')}
        >
          Mastery Analytics
        </button>
      </div>

      {/* Search & Filters (Shown on Topics Tab) */}
      {activeTab === 'topics' && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search problems, patterns, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1118] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedDifficulty === diff ? 'bg-white/10 text-white border border-white/20' : 'text-gray-400 hover:text-white'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      )}

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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};
