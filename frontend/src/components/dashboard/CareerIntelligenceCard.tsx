import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerStore } from '../../stores/careerStore';
import { useDsaStore } from '../../stores/dsaStore';
import { computeIntelligenceRecommendations } from '../../engine/intelligenceEngine';
import { FocusTimerModal } from '../shared/FocusTimerModal';
import { DsaDiagnosticModal } from '../shared/DsaDiagnosticModal';
import { 
  Sparkles, Brain, Clock, ShieldCheck, ArrowRight, Target, 
  AlertCircle, CheckCircle2, ChevronRight, Briefcase, Zap, Layers 
} from 'lucide-react';

export const CareerIntelligenceCard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, skills, roadmap, project } = useCareerStore();
  const dsaStore = useDsaStore();

  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);

  const dueRevisions = dsaStore.getDueRevisions();
  const patternAnalysis = dsaStore.getPatternAnalysis();

  const intelligence = computeIntelligenceRecommendations({
    profile,
    skills,
    roadmap,
    project,
    dueRevisions,
    weakPatterns: patternAnalysis.weakPatterns,
    recurringMistakes: patternAnalysis.recurringMistakes,
  });

  const { currentContext, primaryRecommendation, alternativeRecommendations, detectedBottlenecks } = intelligence;

  return (
    <>
      <div className="p-5 sm:p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-purple-950/20 to-black/80 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider font-mono text-blue-400 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>CAREER INTELLIGENCE ENGINE</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Target Role & CTC Chip */}
            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1.5">
              <Target size={13} />
              <span>Target: ₹{profile.targetCareer.targetCtcMinLpa}–{profile.targetCareer.targetCtcMaxLpa} LPA</span>
            </div>

            {/* Target Date */}
            <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold hidden sm:flex items-center gap-1">
              <span>Switch: May–June 2027</span>
            </div>
          </div>
        </div>

        {/* Context Status Banner */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock size={14} className="text-blue-400 shrink-0" />
            <span>{currentContext.contextMessage}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-400 font-mono">
              Session Budget: <span className="text-white font-bold">{currentContext.availableSessionMinutes} mins</span>
            </span>
            <button
              onClick={() => setDiagnosticModalOpen(true)}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium"
            >
              DSA Diagnostic
            </button>
          </div>
        </div>

        {/* Primary Recommended Task: Answers the 6 Core Questions */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                primaryRecommendation.priority === 'CRITICAL'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
              }`}>
                {primaryRecommendation.priority} PRIORITY
              </span>
              <span className="text-xs font-mono text-purple-300">
                {primaryRecommendation.skill}
              </span>
            </div>

            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              <span>Est. {primaryRecommendation.estimatedDurationMin} mins</span>
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {primaryRecommendation.taskTitle}
            </h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              <span className="font-semibold text-blue-300">Why this matters: </span>
              {primaryRecommendation.reason}
            </p>
          </div>

          {/* Key Answers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-gray-400">Success Criteria</div>
              <div className="text-gray-200">{primaryRecommendation.successCriteria}</div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-gray-400">Evidence to Capture</div>
              <div className="text-emerald-300">{primaryRecommendation.evidenceToCapture}</div>
            </div>
          </div>

          {/* Action Buttons & Fallback Task */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-gray-400">
              <span className="text-gray-500">Short on time? Fallback: </span>
              <span className="text-gray-300 italic">{primaryRecommendation.fallbackTask.taskTitle} ({primaryRecommendation.fallbackTask.estimatedDurationMin}m)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimerModalOpen(true)}
                className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                aria-label="Start focus timer session"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Focus Timer</span>
              </button>

              <button
                onClick={() => {
                  if (primaryRecommendation.actionRoute) {
                    navigate(primaryRecommendation.actionRoute);
                  }
                }}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
                aria-label={`Execute task: ${primaryRecommendation.taskTitle}`}
              >
                <span>Execute Task</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Alternative Ranked Next Tasks */}
        {alternativeRecommendations.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Next In Priority Queue
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {alternativeRecommendations.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => alt.actionRoute && navigate(alt.actionRoute)}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 truncate">{alt.skill}</span>
                    <span className="text-[10px] font-mono text-gray-500">{alt.estimatedDurationMin}m</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{alt.taskTitle}</div>
                  <div className="text-[10px] text-gray-400 line-clamp-1">{alt.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottlenecks Warning Strip if any detected */}
        {detectedBottlenecks.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-2.5 text-xs">
            <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-rose-300">
                Active Bottleneck Detected: {detectedBottlenecks[0].skillName}
              </span>
              <p className="text-gray-300 text-[11px]">
                {detectedBottlenecks[0].reason} → <span className="text-white font-medium">{detectedBottlenecks[0].actionSuggested}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <FocusTimerModal
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        taskTitle={primaryRecommendation.taskTitle}
      />

      <DsaDiagnosticModal
        isOpen={diagnosticModalOpen}
        onClose={() => setDiagnosticModalOpen(false)}
      />
    </>
  );
};
