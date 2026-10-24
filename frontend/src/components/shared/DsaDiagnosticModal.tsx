import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCareerStore } from '../../stores/careerStore';
import { useDsaStore } from '../../stores/dsaStore';
import { CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Brain, Check } from 'lucide-react';

interface DsaDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DsaDiagnosticModal: React.FC<DsaDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const { problems, topics } = useDsaStore();
  const { dsaDiagnostic, recordDiagnosticResult, batchRecordDiagnostic } = useCareerStore();

  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [markedCount, setMarkedCount] = useState<number>(Object.keys(dsaDiagnostic).length);

  const topicProblems = problems.filter(p => p.topicId === selectedTopicId);
  const currentTopic = topics.find(t => t.id === selectedTopicId);

  const handleSetStatus = (problemId: number, pattern: string, known: boolean, confidence: number) => {
    recordDiagnosticResult(problemId, known, pattern, confidence);
    setMarkedCount(prev => prev + 1);
  };

  const handleMarkAllInTopic = (known: boolean) => {
    const batch: Record<number, { known: boolean; pattern: string; confidence: number }> = {};
    topicProblems.forEach(p => {
      batch[p.id] = {
        known,
        pattern: p.pattern || 'General',
        confidence: known ? 4 : 2,
      };
    });
    batchRecordDiagnostic(batch);
    setMarkedCount(Object.keys({ ...dsaDiagnostic, ...batch }).length);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Diagnostic DSA Self-Assessment">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto text-sm pr-1">
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
              <Brain size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Account for Your Prior Problem-Solving Experience</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-mono">
                  {markedCount} problems assessed
                </span>
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                You have already solved hundreds of DSA problems. Rather than starting as a beginner, quickly mark problems you have already solved comfortably so the system immediately focuses your revision on weak patterns and advanced problem types.
              </p>
            </div>
          </div>
        </div>

        {/* Topic Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {topics.map(t => {
            const isSelected = t.id === selectedTopicId;
            const topicProbs = problems.filter(p => p.topicId === t.id);
            const assessedProbs = topicProbs.filter(p => dsaDiagnostic[p.id]?.known);
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
                {assessedProbs.length > 0 && (
                  <span className="text-[10px] opacity-75 font-mono">
                    ({assessedProbs.length}/{topicProbs.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Bar for Current Topic */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
          <div className="text-xs text-gray-300">
            Topic: <span className="font-semibold text-white">{currentTopic?.name}</span> ({topicProblems.length} problems)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAllInTopic(true)}
              className="text-[11px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-medium transition-colors"
            >
              Mark All as Solved & Known
            </button>
            <button
              onClick={() => handleMarkAllInTopic(false)}
              className="text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-medium transition-colors"
            >
              Mark All for Revision
            </button>
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {topicProblems.map((prob) => {
            const diag = dsaDiagnostic[prob.id];
            const isKnown = diag?.known === true;
            const needsRevision = diag?.known === false;

            return (
              <div
                key={prob.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-xs truncate">{prob.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      prob.difficulty === 'EASY' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : prob.difficulty === 'MEDIUM' 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                    <span className="text-purple-300">{prob.pattern}</span>
                    <span>•</span>
                    <span className="text-gray-500">{prob.source.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSetStatus(prob.id, prob.pattern, true, 4)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                      isKnown 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300'
                    }`}
                  >
                    <Check size={12} />
                    <span>Solved Before</span>
                  </button>

                  <button
                    onClick={() => handleSetStatus(prob.id, prob.pattern, false, 2)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                      needsRevision 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-300'
                    }`}
                  >
                    <AlertTriangle size={12} />
                    <span>Need Revision</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={onClose} className="w-full sm:w-auto min-h-[44px] justify-center">
            Done Self-Assessing ({markedCount} marked)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
