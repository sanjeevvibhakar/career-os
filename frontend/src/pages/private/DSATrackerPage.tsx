import React, { useState } from 'react';
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

export const DSATrackerPage: React.FC = () => {
  const dsaStore = useDsaStore();
  const dashboardStore = useDashboardStore();
  
  const [activeTab, setActiveTab] = useState<'topics' | 'revisions' | 'stats'>('topics');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [formData, setFormData] = useState({
    timeTakenMin: 0,
    solvedIndependently: true,
    approach: '',
    mistake: '',
    complexityTime: '',
    complexitySpace: '',
    lesson: '',
    confidence: 3
  });

  const handleLogAttempt = () => {
    if (!selectedProblem) return;
    dsaStore.logAttempt(selectedProblem.id, formData);
    dashboardStore.updateStreak('dsa');
    setLogModalOpen(false);
  };

  const topicStats = dsaStore.getTopicStats();
  const dueRevisions = dsaStore.getDueRevisions();
  const stats = dsaStore.getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">DSA Tracker</h1>
      </div>

      <div className="flex gap-4 border-b border-[var(--border)] pb-2">
        <button className={`px-4 py-2 font-medium ${activeTab === 'topics' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('topics')}>Topics</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'revisions' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('revisions')}>
          Due Revisions {dueRevisions.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{dueRevisions.length}</span>}
        </button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-[var(--text-secondary)]'}`} onClick={() => setActiveTab('stats')}>Stats</button>
      </div>

      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicStats.map(topic => (
            <Card key={topic.topicId} className="p-4 cursor-pointer" onClick={() => setExpandedTopic(expandedTopic === topic.topicId ? null : topic.topicId)}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{topic.icon}</span>
                  <h3 className="font-semibold text-lg">{topic.name}</h3>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{topic.solved}/{topic.total}</div>
              </div>
              <ProgressBar value={topic.total > 0 ? (topic.solved / topic.total) * 100 : 0} color="bg-blue-500" />
              
              {expandedTopic === topic.topicId && (
                <div className="mt-4 space-y-3 pt-4 border-t border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
                  {dsaStore.getProblemsByTopic(topic.topicId).map(problem => (
                    <div key={problem.id} className="flex flex-col bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {problem.name}
                            <DifficultyBadge difficulty={problem.difficulty as any} />
                          </div>
                          <div className="text-xs text-[var(--text-secondary)] mt-1">Pattern: {problem.pattern}</div>
                        </div>
                        <Button size="sm" onClick={() => { setSelectedProblem(problem); setLogModalOpen(true); }}>Log Attempt</Button>
                      </div>
                      {problem.attemptCount > 0 && (
                        <div className="mt-2 text-xs flex gap-4 text-[var(--text-secondary)]">
                          <span>Attempts: {problem.attemptCount}</span>
                          <span>Last Conf: {problem.confidence}/5</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'revisions' && (
        <div className="space-y-4">
          {dueRevisions.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-secondary)]">No revisions due today! Great job.</div>
          ) : (
            dueRevisions.map(rev => (
              <Card key={rev.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{rev.problemName}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{rev.topicName} - {rev.pattern}</div>
                  <div className="text-xs text-purple-400 mt-1">Revision #{rev.revisionNumber}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => dsaStore.skipRevision(rev.id)}>Skip</Button>
                  <Button onClick={() => {
                    const time = parseInt(prompt('Time taken (minutes):') || '15');
                    const conf = parseInt(prompt('Confidence (1-5):') || '3');
                    dsaStore.completeRevision(rev.id, time, conf);
                  }}>Complete</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Total Solved</div>
            <div className="text-3xl font-bold">{stats.totalSolved}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Easy</div>
            <div className="text-3xl font-bold text-green-500">{stats.easy}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Medium</div>
            <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Hard</div>
            <div className="text-3xl font-bold text-red-500">{stats.hard}</div>
          </Card>
        </div>
      )}

      <Modal isOpen={logModalOpen} onClose={() => setLogModalOpen(false)} title={`Log Attempt: ${selectedProblem?.name}`}>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input type="number" label="Time Taken (min)" value={formData.timeTakenMin} onChange={(e) => setFormData({...formData, timeTakenMin: parseInt(e.target.value) || 0})} />
            </div>
            <div className="flex-1 flex items-center gap-2 pt-6">
              <input type="checkbox" id="indep" checked={formData.solvedIndependently} onChange={(e) => setFormData({...formData, solvedIndependently: e.target.checked})} />
              <label htmlFor="indep" className="text-sm">Solved Independently</label>
            </div>
          </div>
          <Textarea label="Approach" value={formData.approach} onChange={(e) => setFormData({...formData, approach: e.target.value})} rows={2} />
          <Textarea label="Mistakes / Bugs" value={formData.mistake} onChange={(e) => setFormData({...formData, mistake: e.target.value})} rows={2} />
          <div className="flex gap-4">
            <Input label="Time Complexity" value={formData.complexityTime} onChange={(e) => setFormData({...formData, complexityTime: e.target.value})} placeholder="O(n)" />
            <Input label="Space Complexity" value={formData.complexitySpace} onChange={(e) => setFormData({...formData, complexitySpace: e.target.value})} placeholder="O(1)" />
          </div>
          <Textarea label="Key Lesson" value={formData.lesson} onChange={(e) => setFormData({...formData, lesson: e.target.value})} rows={2} />
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Confidence</label>
            <ConfidenceStars value={formData.confidence} onChange={(v) => setFormData({...formData, confidence: v})} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleLogAttempt}>Save Log</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
