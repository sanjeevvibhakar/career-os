import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CURRICULUM_LEVELS, type CurriculumLevel } from '../../data/curriculumData';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import { CheckCircle2, Lock, Unlock, Sparkles, Building2, Target, Award, ChevronRight, BookOpen } from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  solvedProblemIds: Set<number>;
  onSelectProblem?: (problemId: number) => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  solvedProblemIds,
  onSelectProblem,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(currentLevel);
  const activeLevel = CURRICULUM_LEVELS.find(l => l.levelNumber === selectedLevelId) || CURRICULUM_LEVELS[0];

  const getLevelStatus = (lvlNum: number) => {
    if (lvlNum < currentLevel) return 'COMPLETED';
    if (lvlNum === currentLevel) return 'ACTIVE';
    return 'LOCKED';
  };

  const calculateLevelProgress = (level: CurriculumLevel) => {
    const solved = level.recommendedProblemIds.filter(id => solvedProblemIds.has(id)).length;
    return {
      solved,
      total: level.recommendedProblemIds.length,
      pct: Math.min(100, Math.round((solved / level.recommendedProblemIds.length) * 100)),
    };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Syllabus & Career Switch Roadmap">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Intro Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-emerald-900/20 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
            <Sparkles size={14} />
            <span>PROGRESSIVE OVERLOAD ROADMAP (ZERO OVERWHELM)</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Engineered to accelerate your <strong>current company growth</strong> (clean code, debugging, APIs) while systematically training you for <strong>Tier-1 Product Interviews in 2027</strong>.
          </p>
        </div>

        {/* Level Tabs / Stepper */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          {CURRICULUM_LEVELS.map(level => {
            const status = getLevelStatus(level.levelNumber);
            const isSelected = selectedLevelId === level.levelNumber;
            const progress = calculateLevelProgress(level);

            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevelId(level.levelNumber)}
                className={`p-2 rounded-lg text-left transition-all relative ${
                  isSelected 
                    ? 'bg-white/10 border border-white/20 shadow-md' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span>{level.icon} L{level.levelNumber}</span>
                  {status === 'COMPLETED' && <span className="text-emerald-400">✓</span>}
                  {status === 'ACTIVE' && <span className="text-blue-400 animate-pulse">●</span>}
                  {status === 'LOCKED' && <Lock size={10} className="text-gray-500" />}
                </div>
                <div className="text-[11px] font-bold text-white truncate mt-0.5">
                  {level.title.split(' ')[0]}
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all" 
                    style={{ width: `${progress.pct}%` }} 
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Level Detail View */}
        <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3.5 bg-black/30">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeLevel.icon}</span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Level {activeLevel.levelNumber}: {activeLevel.title}
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                {activeLevel.weeks} • {activeLevel.subtitle}
              </p>
            </div>
            
            <div className="text-right flex-shrink-0">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                getLevelStatus(activeLevel.levelNumber) === 'COMPLETED'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : getLevelStatus(activeLevel.levelNumber) === 'ACTIVE'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}>
                {getLevelStatus(activeLevel.levelNumber)}
              </span>
              <div className="text-[11px] font-mono text-gray-400 mt-1">
                {calculateLevelProgress(activeLevel).solved} / {activeLevel.recommendedProblemIds.length} done
              </div>
            </div>
          </div>

          {/* Dual Synergy Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Current Company Box */}
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold font-mono text-[11px]">
                <Building2 size={13} />
                <span>HOW THIS HELPS AT YOUR CURRENT JOB</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {activeLevel.whyAtWork}
              </p>
              <div className="text-[10px] text-blue-300/80 font-mono pt-1 border-t border-blue-500/10">
                Action: {activeLevel.practicalWorkAction}
              </div>
            </div>

            {/* Product Interview Box */}
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold font-mono text-[11px]">
                <Target size={13} />
                <span>HOW THIS PREPARES YOU FOR TIER-1 INTERVIEWS</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {activeLevel.whyInInterview}
              </p>
              <div className="text-[10px] text-purple-300/80 font-mono pt-1 border-t border-purple-500/10">
                Prep: {activeLevel.interviewPrepAction}
              </div>
            </div>
          </div>

          {/* Core Concepts */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wider">
              Core Mental Models in This Level
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {activeLevel.coreConcepts.map((concept, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-300 flex items-start gap-1.5">
                  <span className="text-blue-400 font-mono font-bold">0{idx + 1}.</span>
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Problems */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                Curated Practice Problems ({activeLevel.recommendedProblemIds.length})
              </h4>
              <span className="text-[10px] text-gray-500 font-mono">Click to jump & solve</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {activeLevel.recommendedProblemIds.map(probId => {
                const prob = DSA_PROBLEMS.find(p => p.id === probId);
                if (!prob) return null;
                const isSolved = solvedProblemIds.has(probId);

                return (
                  <div
                    key={probId}
                    onClick={() => {
                      if (onSelectProblem) {
                        onSelectProblem(probId);
                        onClose();
                      }
                    }}
                    className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isSolved 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' 
                        : 'bg-white/[0.02] border-white/10 text-gray-300 hover:border-blue-500/40 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                        isSolved ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        {isSolved ? '✓' : probId}
                      </div>
                      <span className="truncate font-semibold">{prob.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                      prob.difficulty === 'EASY' ? 'text-emerald-400 bg-emerald-500/10' :
                      prob.difficulty === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10' :
                      'text-rose-400 bg-rose-500/10'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pass Rule */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2 text-xs">
            <Award size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 font-mono text-[11px]">LEVEL CLEARANCE CRITERIA:</span>
              <p className="text-gray-300 text-[11px] mt-0.5">
                {activeLevel.passRule}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
