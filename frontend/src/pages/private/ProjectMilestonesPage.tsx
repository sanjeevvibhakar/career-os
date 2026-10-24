import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useCareerStore } from '../../stores/careerStore';
import { EvidenceVaultModal } from '../../components/career/EvidenceVaultModal';
import { 
  GitBranch, CheckCircle2, Clock, ShieldCheck, 
  Layers, Terminal, ExternalLink, Plus, Cpu, Sparkles, Zap, Award 
} from 'lucide-react';

export const ProjectMilestonesPage: React.FC = () => {
  const { project, updateProjectMilestone, setProjectVersion } = useCareerStore();
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeVersionFilter, setActiveVersionFilter] = useState<'ALL' | 'v1' | 'v2' | 'v3' | 'v4'>('ALL');

  const filteredMilestones = activeVersionFilter === 'ALL'
    ? project.milestones
    : project.milestones.filter(m => m.version === activeVersionFilter);

  const completedCount = project.milestones.filter(m => m.status === 'DONE').length;
  const progressPct = Math.round((completedCount / project.milestones.length) * 100);

  const handleStatusChange = (milestoneId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    updateProjectMilestone(milestoneId, nextStatus);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
              Flagship Portfolio Project
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {project.architectureType}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {project.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {project.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3.5 py-2.5 min-h-[44px] rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-mono flex items-center justify-center gap-1.5 transition-colors flex-1 sm:flex-none"
            >
              <GitBranch size={14} className="text-blue-400" />
              <span>GitHub Repo</span>
              <ExternalLink size={12} className="text-gray-500" />
            </a>
          )}

          <Button
            variant="primary"
            onClick={() => setEvidenceModalOpen(true)}
            className="text-xs flex items-center justify-center min-h-[44px] gap-1.5 flex-1 sm:flex-none"
          >
            <Plus size={14} />
            <span>Attach Milestone Evidence</span>
          </Button>
        </div>
      </div>

      {/* Progress & Version Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0d1017] border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Project Completion
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {progressPct}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {completedCount} of {project.milestones.length} milestones delivered
            </div>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </Card>

        {project.versions.map((ver) => {
          const isCurrent = project.currentVersion === ver.version;
          return (
            <Card
              key={ver.version}
              className={`p-4 transition-all cursor-pointer ${
                isCurrent 
                  ? 'bg-blue-900/20 border-blue-500/40 shadow-lg' 
                  : 'bg-[#0d1017] border-white/10 hover:border-white/20'
              }`}
              onClick={() => setProjectVersion(ver.version)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">
                  {ver.version.toUpperCase()}
                </span>
                {isCurrent && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500 text-white font-semibold">
                    Current Focus
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white mt-1.5">{ver.title}</h4>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                {ver.focus}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Version Filter Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex gap-2">
          {(['ALL', 'v1', 'v2', 'v3', 'v4'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveVersionFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeVersionFilter === v
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {v === 'ALL' ? 'All Milestones' : v.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400">
          Showing <span className="font-semibold text-white">{filteredMilestones.length}</span> milestones
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.map((m) => {
          const isDone = m.status === 'DONE';
          const isInProgress = m.status === 'IN_PROGRESS';

          return (
            <Card
              key={m.id}
              className={`p-4 bg-[#0d1017] border-white/10 transition-all ${
                isDone ? 'border-emerald-500/30' : isInProgress ? 'border-blue-500/40' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10 text-gray-300">
                      {m.version.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isDone 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : isInProgress 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-white/5 text-gray-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-[10px] text-gray-500">Skills developed:</span>
                    {m.linkedSkillIds.map((sId) => (
                      <span key={sId} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
                        {sId}
                      </span>
                    ))}
                    {m.testCoveragePct !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                        {m.testCoveragePct}% Test Coverage
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStatusChange(m.id, m.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isInProgress
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isDone ? 'Delivered' : isInProgress ? 'In Progress' : 'Start Task'}</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <EvidenceVaultModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
      />
    </div>
  );
};
