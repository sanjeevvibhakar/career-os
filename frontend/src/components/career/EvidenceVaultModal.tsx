import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useCareerStore } from '../../stores/careerStore';
import type { EvidenceType } from '../../types/career';
import { ShieldCheck, Plus, FileText, Lock, Globe, ExternalLink, CheckCircle } from 'lucide-react';

interface EvidenceVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSkillId?: string;
}

export const EvidenceVaultModal: React.FC<EvidenceVaultModalProps> = ({
  isOpen,
  onClose,
  preselectedSkillId,
}) => {
  const { skills, addEvidence } = useCareerStore();

  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('ARCHITECTURE_DIAGRAM');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    preselectedSkillId ? [preselectedSkillId] : ['spring-rest-apis']
  );
  const [context, setContext] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [measurableResult, setMeasurableResult] = useState('');
  const [relevantProject, setRelevantProject] = useState('Career OS Backend');
  const [linkOrRef, setLinkOrRef] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedSkillIds.length === 0) return;

    addEvidence({
      title,
      evidenceType,
      demonstratedSkillIds: selectedSkillIds,
      context,
      actionTaken,
      measurableResult,
      relevantProject,
      verificationStatus: 'VERIFIED',
      isPublic,
      linkOrRef,
    });

    onClose();
    // Reset form
    setTitle('');
    setContext('');
    setActionTaken('');
    setMeasurableResult('');
    setLinkOrRef('');
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Proof to Career Evidence Vault">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto text-sm pr-1">
        <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-start gap-3">
          <ShieldCheck size={20} className="text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-300">
            <span className="font-semibold text-white">Credible Evidence Model: </span>
            Proof is required to advance a skill to Level 4 (Engineering Competence) or Level 5 (Advanced Application).
            <span className="block mt-1 text-amber-300">
              Note: Never upload proprietary TCS source code, customer records, or internal credentials. Mark workplace achievements as non-public.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Evidence Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Idempotent REST API & Global Exception Handler"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Evidence Artifact Type</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
              className="w-full bg-[#12151e] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ARCHITECTURE_DIAGRAM">Architecture Diagram</option>
              <option value="GITHUB_COMMIT">GitHub Commit / Pull Request</option>
              <option value="TEST_RESULTS">Automated Test Results</option>
              <option value="API_DOCUMENTATION">API Documentation / OpenAPI Spec</option>
              <option value="PERFORMANCE_BENCHMARK">Performance Benchmark (EXPLAIN / p99)</option>
              <option value="DEBUGGING_CASE_STUDY">Debugging Case Study / Postmortem</option>
              <option value="WORKPLACE_ACHIEVEMENT">Workplace Achievement (Non-confidential)</option>
              <option value="MOCK_EVALUATION">Mock Interview Evaluation</option>
              <option value="TECHNICAL_EXPLANATION">Written Technical Explanation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Associated Project / Context</label>
            <Input
              value={relevantProject}
              onChange={(e) => setRelevantProject(e.target.value)}
              placeholder="e.g. Career OS Backend / TCS Client Module"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Demonstrated Skills (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-white/5 border border-white/5">
            {skills.map((s) => {
              const selected = selectedSkillIds.includes(s.id);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    selected 
                      ? 'bg-blue-600 text-white font-medium shadow-sm' 
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {selected && <CheckCircle size={10} />}
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Context / Problem Statement</label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            placeholder="What was the problem or engineering requirement?"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Action Taken / Architectural Decision</label>
          <Textarea
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            rows={2}
            placeholder="What solution did you engineer? What libraries, patterns, or trade-offs were applied?"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Measurable Result / Verification</label>
          <Input
            value={measurableResult}
            onChange={(e) => setMeasurableResult(e.target.value)}
            placeholder="e.g. 0 unhandled 500s; sub-15ms query execution; 94% branch coverage"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Link or File Reference (Optional)</label>
            <Input
              value={linkOrRef}
              onChange={(e) => setLinkOrRef(e.target.value)}
              placeholder="e.g. https://github.com/... or src/.../GlobalExceptionHandler.java"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-blue-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                {isPublic ? <Globe size={14} className="text-emerald-400" /> : <Lock size={14} className="text-amber-400" />}
                <span>{isPublic ? 'Public Portfolio Proof' : 'Confidential (Private Record Only)'}</span>
              </span>
            </label>
          </div>
        </div>

        <div className="pt-3 flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-white/10">
          <Button variant="secondary" type="button" onClick={onClose} className="w-full sm:w-auto min-h-[44px] justify-center">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="w-full sm:w-auto min-h-[44px] justify-center">
            Save Evidence Artifact
          </Button>
        </div>
      </form>
    </Modal>
  );
};
