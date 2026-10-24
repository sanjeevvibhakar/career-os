import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useCareerStore } from '../../stores/careerStore';
import { useDsaStore } from '../../stores/dsaStore';
import { computeInterviewReadiness } from '../../engine/interviewReadinessEngine';
import type { InterviewDimension, MockInterviewLog } from '../../types/career';
import { 
  Brain, ShieldCheck, CheckCircle2, AlertTriangle, 
  Plus, Calendar, Award, Mic, Layers, Code, Database, ChevronRight 
} from 'lucide-react';

export const InterviewReadinessPage: React.FC = () => {
  const { skills, evidence, mockSessions, logMockSession } = useCareerStore();
  const { attempts } = useDsaStore();

  const readiness = computeInterviewReadiness({
    skills,
    attempts,
    mocks: mockSessions,
    evidence,
  });

  const [logMockModalOpen, setLogMockModalOpen] = useState(false);
  const [mockDim, setMockDim] = useState<InterviewDimension>('JAVA');
  const [mockRole, setMockRole] = useState('Senior Engineer / Peer Mock');
  const [mockScore, setMockScore] = useState<number>(7);
  const [mockFeedback, setMockFeedback] = useState('');
  const [mockWeaknesses, setMockWeaknesses] = useState('');

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    logMockSession({
      date: new Date().toISOString().split('T')[0],
      dimension: mockDim,
      interviewerRole: mockRole,
      overallRating: mockScore,
      feedbackNotes: mockFeedback,
      weaknessesNoted: mockWeaknesses.split(',').map(w => w.trim()).filter(Boolean),
      actionItemTasks: ['Targeted practice based on mock review feedback'],
    });

    setLogMockModalOpen(false);
    setMockFeedback('');
    setMockWeaknesses('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
              Evidence-Derived Readiness
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Target CTC: ₹25–45 LPA
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Interview Readiness Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Derived directly from logged problem solves, code artifacts, and mock assessments.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setLogMockModalOpen(true)}
          className="text-xs flex items-center justify-center min-h-[44px] w-full sm:w-auto gap-1.5"
        >
          <Plus size={14} />
          <span>Log Mock Interview Feedback</span>
        </Button>
      </div>

      {/* Composite Readiness Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-900/30 via-[#0d1017] to-purple-900/30 border-blue-500/30 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Overall Interview Readiness Score
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                readiness.readinessRating === 'INTERVIEW_READY'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : readiness.readinessRating === 'COMPETITIVE_CANDIDATE'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {readiness.readinessRating.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-4xl font-black text-white">
                {readiness.compositeScorePct}%
              </span>
              <span className="text-xs text-gray-400">
                weighted across core Tier-1 engineering & CS fundamentals
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-300 flex items-center justify-between">
            <span>Recommended Mock Pace:</span>
            <span className="font-mono font-bold text-blue-300">
              {readiness.recommendedMockFrequency.replace(/_/g, ' ')}
            </span>
          </div>
        </Card>

        {/* Strongest */}
        <Card className="p-4 bg-[#0d1017] border-white/10 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>Top Strengths</span>
          </div>
          <div className="space-y-1.5">
            {readiness.strongestDimensions.map((d) => (
              <div key={d.dimension} className="text-xs flex items-center justify-between p-1.5 rounded bg-white/5">
                <span className="text-gray-200 truncate">{d.title}</span>
                <span className="font-mono text-emerald-400 font-bold ml-2">{d.scorePct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weakest */}
        <Card className="p-4 bg-[#0d1017] border-white/10 space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>Targeted Gaps</span>
          </div>
          <div className="space-y-1.5">
            {readiness.weakestDimensions.map((d) => (
              <div key={d.dimension} className="text-xs flex items-center justify-between p-1.5 rounded bg-white/5">
                <span className="text-gray-200 truncate">{d.title}</span>
                <span className="font-mono text-amber-400 font-bold ml-2">{d.scorePct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* The 11 Dimensions Detailed Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            All 11 Interview Competency Dimensions
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            Derived from attempts, mocks & evidence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readiness.dimensionScores.map((dim) => (
            <Card key={dim.dimension} className="p-4 bg-[#0d1017] border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{dim.title}</h3>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Assessed Level: <span className="text-white font-semibold">Lv {dim.assessedLevel}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-blue-400 font-mono">
                    {dim.scorePct}%
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    Confidence: {dim.confidenceRating}/5
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${dim.scorePct}%` }}
                />
              </div>

              {/* Next Improvement Task */}
              <div className="p-2.5 rounded bg-black/30 border border-white/5 text-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400">Next Priority Action</div>
                <div className="text-gray-200 leading-snug">
                  {dim.nextImprovementTask}
                </div>
              </div>

              {/* Missing Evidence / Recurring Mistakes */}
              <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                <span>Missing Evidence:</span>
                <span className={`font-mono font-semibold ${dim.missingEvidenceCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {dim.missingEvidenceCount === 0 ? 'Verified' : `${dim.missingEvidenceCount} required`}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mock Interview Log History */}
      {mockSessions.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            Mock Interview Feedback History ({mockSessions.length})
          </h2>
          <div className="space-y-2">
            {mockSessions.map((m) => (
              <Card key={m.id} className="p-3.5 bg-[#0d1017] border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{m.dimension}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                      Rating: {m.overallRating}/10
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{m.date}</span>
                  </div>
                  <div className="text-xs text-gray-300">{m.feedbackNotes}</div>
                  {m.weaknessesNoted.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center pt-1">
                      <span className="text-[10px] text-amber-400">Weaknesses:</span>
                      {m.weaknessesNoted.map((w, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Log Mock Modal */}
      <Modal isOpen={logMockModalOpen} onClose={() => setLogMockModalOpen(false)} title="Log Technical Mock Interview Feedback">
        <form onSubmit={handleSaveMock} className="space-y-4 max-h-[75vh] overflow-y-auto text-sm pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Dimension Evaluated</label>
              <select
                value={mockDim}
                onChange={(e) => setMockDim(e.target.value as InterviewDimension)}
                className="w-full bg-[#12151e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="JAVA">Java Core, Concurrency & JVM</option>
                <option value="SPRING_BOOT">Spring Boot & Security</option>
                <option value="SQL_DBMS">SQL, DBMS & Indexing</option>
                <option value="LLD">Low-Level Design (LLD)</option>
                <option value="HLD">High-Level System Design (HLD)</option>
                <option value="OS_NETWORKS">OS & Computer Networks</option>
                <option value="TECHNICAL_COMMUNICATION">Technical Communication</option>
                <option value="BEHAVIORAL">Behavioral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Interviewer Context</label>
              <Input
                value={mockRole}
                onChange={(e) => setMockRole(e.target.value)}
                placeholder="e.g. Senior SDE Peer / Mock Platform"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Overall Rating (1 - 10)</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={mockScore}
              onChange={(e) => setMockScore(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Feedback Notes & Discussion Points</label>
            <Textarea
              value={mockFeedback}
              onChange={(e) => setMockFeedback(e.target.value)}
              rows={3}
              placeholder="What questions were asked? How did you respond? What was the interviewer's critique?"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Weaknesses Noted (Comma separated)</label>
            <Input
              value={mockWeaknesses}
              onChange={(e) => setMockWeaknesses(e.target.value)}
              placeholder="e.g. Incomplete volatile explanation, slow binary search invariant formulation"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setLogMockModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Mock Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
