import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, Clock, ArrowRight, Target, 
  ChevronRight, Brain, Code, Building2, Briefcase, Award, ShieldCheck, Flame
} from 'lucide-react';
import { useCareerStore } from '../../stores/careerStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CareerTimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, roadmap, skills, project } = useCareerStore();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(roadmap[0]?.id || 1);

  const selectedPhase = roadmap.find(p => p.id === selectedPhaseId) || roadmap[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in font-sans">
      
      {/* 1. Header: Clear & Human */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0d1017] to-purple-950/30 border border-white/10 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Career Timeline & Milestones
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Your step-by-step roadmap from TCS (₹7 LPA) to Product Company SDE-1 (₹25–45 LPA) by May–June 2027.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <Target size={14} />
              <span>Target: ₹{profile.targetCareer.targetCtcMinLpa}–{profile.targetCareer.targetCtcMaxLpa} LPA</span>
            </div>
          </div>
        </div>

        {/* Schedule Context Banner */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400 shrink-0" />
            <span>
              <strong className="text-gray-200">Office Schedule:</strong> 11:00 AM – 8:00 PM (TCS React Native Training). Self-study is focused in morning & evening blocks.
            </span>
          </div>
          <span className="text-purple-300 font-mono font-semibold">
            Timeline Horizon: Oct 2026 – June 2027
          </span>
        </div>
      </div>

      {/* 2. Visual 6-Phase Horizontal Steps */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Roadmap Sequence (Click any phase to see exact milestones)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {roadmap.map((phase) => {
            const isSelected = phase.id === selectedPhaseId;
            const isCompleted = phase.milestones.every(m => m.status === 'COMPLETED');
            const isCurrent = phase.id === 1 || phase.milestones.some(m => m.status === 'IN_PROGRESS');

            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[110px] cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-md text-white'
                    : isCurrent
                    ? 'bg-blue-950/20 border-blue-500/40 text-gray-200 hover:border-blue-500/60'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-300 hover:border-emerald-500/50'
                    : 'bg-[#0d1017] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                      Phase {phase.id}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : isCurrent 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {isCompleted ? '✓ Done' : isCurrent ? 'Active' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                    {phase.title}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-gray-400 mt-2">
                  {phase.timeRange}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Selected Phase Card */}
      {selectedPhase && (
        <Card className="p-5 sm:p-6 bg-[#0d1017] border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Phase {selectedPhase.id}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {selectedPhase.timeRange}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-2">
                {selectedPhase.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                {selectedPhase.goal}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={() => navigate('/sprint')}
                className="text-xs min-h-[44px] flex items-center gap-2"
              >
                <Code size={14} />
                <span>Open Topic Checklist</span>
              </Button>
            </div>
          </div>

          {/* Concrete Deliverable & Exit Criteria */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-purple-950/20 border border-blue-500/30 space-y-2">
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Phase Deliverable & Proof of Completion</span>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              {selectedPhase.deliverable}
            </p>
          </div>

          {/* Milestones in this Phase */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Concrete Milestones to Complete ({selectedPhase.milestones.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPhase.milestones.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{m.title}</span>
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                      m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                      m.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="p-2 rounded-lg bg-black/40 text-[11px] text-emerald-300 font-mono border border-white/5">
                    <strong>Deliverable:</strong> {m.concreteDeliverable}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Jump Links to Dedicated Practice Tools */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Work on this phase using dedicated pages:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => navigate('/dsa')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Brain size={16} className="text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-white">DSA Practice Sheet</div>
                    <div className="text-[10px] text-gray-400">Solve daily patterns</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </button>

              <button
                onClick={() => navigate('/system-design')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 size={16} className="text-sky-400" />
                  <div>
                    <div className="text-xs font-bold text-white">System Design Studio</div>
                    <div className="text-[10px] text-gray-400">HLD, LLD & Tradeoffs</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </button>

              <button
                onClick={() => navigate('/job-pipeline')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase size={16} className="text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Target Job Pipeline</div>
                    <div className="text-[10px] text-gray-400">Product company openings</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};
