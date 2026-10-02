import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GodModeState } from '../../engine/godModeEngine';
import { RoadmapModal } from './RoadmapModal';
import { FocusTimerModal } from '../shared/FocusTimerModal';
import { 
  Sparkles, Brain, ArrowRight, Map, Clock, 
  Building2, Target, Award, ChevronRight, Zap, Check 
} from 'lucide-react';

interface GodModeIntelligenceCardProps {
  godMode: GodModeState;
  solvedProblemIds: Set<number>;
  onOpenSolveModal?: (problem: any) => void;
}

export const GodModeIntelligenceCard: React.FC<GodModeIntelligenceCardProps> = ({
  godMode,
  solvedProblemIds,
  onOpenSolveModal,
}) => {
  const navigate = useNavigate();
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  const {
    currentLevel,
    currentLevelData,
    levelProgressPct,
    readinessScore,
    totalXp,
    playerRank,
    nextRecommendedProblem,
    rightNowRecommendation,
  } = godMode;

  const handleActionClick = () => {
    if (rightNowRecommendation.actionType === 'DSA' && nextRecommendedProblem) {
      if (onOpenSolveModal) {
        onOpenSolveModal(nextRecommendedProblem);
      } else {
        navigate('/dsa');
      }
    } else if (rightNowRecommendation.targetRoute) {
      navigate(rightNowRecommendation.targetRoute);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-purple-950/20 to-black/60 shadow-xl space-y-3.5 relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75" />

        {/* Top Intelligence Telemetry Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider font-mono text-blue-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-400" />
              GOD MODE ADVISOR • LEVEL {currentLevel}: {currentLevelData.title.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Readiness Chip */}
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
              <Award size={13} />
              <span>{readinessScore}% Readiness</span>
            </div>

            {/* XP Chip */}
            <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold flex items-center gap-1 hidden sm:flex">
              <Zap size={13} />
              <span>{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Stage: <strong className="text-white">{currentLevelData.subtitle}</strong></span>
            <span className="text-blue-400 font-bold">{levelProgressPct}% to Level {Math.min(5, currentLevel + 1)}</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, levelProgressPct)}%` }}
            />
          </div>
        </div>

        {/* The "Right Now" Intelligent Callout */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wide uppercase">
                {rightNowRecommendation.phase}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
                <span>{rightNowRecommendation.actionTitle}</span>
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {rightNowRecommendation.actionDescription}
              </p>
            </div>

            <button
              onClick={handleActionClick}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02]"
            >
              <span>Execute</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Micro-Synergy Dual Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-500/15 flex items-start gap-1.5 text-blue-200">
              <Building2 size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <span><strong>At Work:</strong> {currentLevelData.whyAtWork.split('.')[0]}.</span>
            </div>
            <div className="p-2 rounded-lg bg-purple-950/20 border border-purple-500/15 flex items-start gap-1.5 text-purple-200">
              <Target size={13} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <span><strong>In Interview:</strong> {currentLevelData.whyInInterview.split('.')[0]}.</span>
            </div>
          </div>
        </div>

        {/* Action Toolbars */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="text-[11px] text-gray-400 font-mono">
            Rank: <span className="text-purple-400 font-semibold">{playerRank}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Clock size={13} className="text-amber-400" />
              <span>90/20 Timer</span>
            </button>

            <button
              onClick={() => setRoadmapOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Map size={13} className="text-blue-400" />
              <span>View Level Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RoadmapModal
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
        currentLevel={currentLevel}
        solvedProblemIds={solvedProblemIds}
        onSelectProblem={(probId) => {
          const prob = nextRecommendedProblem && nextRecommendedProblem.id === probId 
            ? nextRecommendedProblem 
            : undefined;
          if (onOpenSolveModal && prob) onOpenSolveModal(prob);
          else navigate('/dsa');
        }}
      />

      <FocusTimerModal
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
        taskTitle={rightNowRecommendation.actionTitle}
      />
    </>
  );
};
