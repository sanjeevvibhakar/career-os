import React from 'react';
import { X, CheckCircle2, AlertTriangle, Dumbbell, Sparkles, Target, Activity, Flame, ShieldAlert } from 'lucide-react';
import type { ExerciseDefinition } from '../../data/gymData';

interface ExerciseDemoModalProps {
  exercise: ExerciseDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({ exercise, isOpen, onClose }) => {
  if (!isOpen || !exercise) return null;

  // Render high-contrast anatomical movement diagram
  const renderDiagram = () => {
    switch (exercise.diagramType) {
      case 'bench-press':
      case 'incline-press':
        return (
          <svg viewBox="0 0 440 220" className="w-full h-full max-h-56 mx-auto select-none">
            <rect width="440" height="220" fill="#080c14" rx="14" />
            <defs>
              <linearGradient id="chestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Flat / Incline Bench Structure */}
            <path d="M 60 170 L 380 170" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
            <path d="M 120 170 L 100 205 M 320 170 L 340 205" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
            {exercise.diagramType === 'incline-press' ? (
              <path d="M 90 168 L 330 110" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
            ) : (
              <path d="M 90 166 L 350 166" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
            )}
            {/* Athlete Silhouette */}
            <path d="M 130 156 Q 220 152 290 156" stroke="#64748b" strokeWidth="22" strokeLinecap="round" />
            {/* Target Muscle: Pectoralis Major Activation */}
            <ellipse cx="225" cy="150" rx="34" ry="14" fill="url(#chestGlow)" />
            <text x="225" y="154" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800" letterSpacing="1">PRIMARY: CHEST</text>
            {/* Barbell Path Vectors */}
            <line x1="225" y1="65" x2="225" y2="135" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
            <polygon points="220,72 230,72 225,60" fill="#38bdf8" />
            <polygon points="220,128 230,128 225,140" fill="#38bdf8" />
            {/* Barbell & Weight Plates */}
            <line x1="130" y1="75" x2="320" y2="75" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
            <rect x="115" y="60" width="16" height="30" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <rect x="319" y="60" width="16" height="30" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            {/* Cues */}
            <text x="225" y="32" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">ECCENTRIC: 3s LOWER TO LOWER STERNUM</text>
            <text x="225" y="206" textAnchor="middle" fill="#94a3b8" fontSize="10">Elbows tucked 45° • Pinch shoulder blades into bench</text>
          </svg>
        );
      case 'lat-pulldown':
      case 'cable-row':
        return (
          <svg viewBox="0 0 440 220" className="w-full h-full max-h-56 mx-auto select-none">
            <rect width="440" height="220" fill="#080c14" rx="14" />
            {/* Cable Machine Column */}
            <rect x="370" y="25" width="20" height="175" rx="4" fill="#0f172a" stroke="#1e293b" />
            <circle cx="380" cy="40" r="10" fill="#334155" />
            {/* High Pulley Cable */}
            <path d="M 380 40 L 220 45" stroke="#64748b" strokeWidth="3" />
            <path d="M 150 45 Q 220 50 290 45" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
            {/* Trajectory Arrow Down */}
            <line x1="220" y1="55" x2="220" y2="120" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
            <polygon points="215,115 225,115 220,128" fill="#10b981" />
            {/* Athlete Torso (Slight 10° Lean) */}
            <path d="M 210 135 Q 220 165 225 195" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
            {/* Target Muscle: Lats V-Taper */}
            <ellipse cx="212" cy="150" rx="22" ry="26" fill="#10b981" opacity="0.85" />
            <text x="212" y="154" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">LATS</text>
            {/* Cue */}
            <text x="220" y="28" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">CONCENTRIC: DRIVE ELBOWS DOWN TO HIP POCKETS</text>
            <text x="220" y="208" textAnchor="middle" fill="#94a3b8" fontSize="10">Keep chest proud • Squeeze scapula for 1s at bottom</text>
          </svg>
        );
      case 'squat':
      case 'leg-press':
      case 'split-squat':
        return (
          <svg viewBox="0 0 440 220" className="w-full h-full max-h-56 mx-auto select-none">
            <rect width="440" height="220" fill="#080c14" rx="14" />
            {/* Floor Ground */}
            <line x1="50" y1="195" x2="390" y2="195" stroke="#1e293b" strokeWidth="4" />
            {/* Athlete Legs in Deep Parallel Squat */}
            <polyline points="200,95 250,135 210,195" stroke="#64748b" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Torso & Head */}
            <line x1="200" y1="95" x2="175" y2="55" stroke="#64748b" strokeWidth="20" strokeLinecap="round" />
            <circle cx="165" cy="35" r="14" fill="#94a3b8" />
            {/* Barbell Across Traps */}
            <line x1="120" y1="50" x2="230" y2="50" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
            <rect x="105" y="38" width="16" height="26" rx="2" fill="#475569" />
            <rect x="229" y="38" width="16" height="26" rx="2" fill="#475569" />
            {/* Target Muscle: Quads & Glutes */}
            <ellipse cx="230" cy="120" rx="20" ry="14" fill="#f59e0b" opacity="0.85" />
            <ellipse cx="190" cy="100" rx="16" ry="16" fill="#ef4444" opacity="0.85" />
            <text x="230" y="124" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800">QUADS</text>
            <text x="190" y="104" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800">GLUTES</text>
            {/* Cue */}
            <text x="220" y="24" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">PARALLEL DEPTH: CREASE OF HIP BELOW TOP OF KNEE</text>
            <text x="220" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10">Drive through mid-foot • Keep knees tracking in line with toes</text>
          </svg>
        );
      case 'rdl':
      case 'leg-curl':
        return (
          <svg viewBox="0 0 440 220" className="w-full h-full max-h-56 mx-auto select-none">
            <rect width="440" height="220" fill="#080c14" rx="14" />
            {/* Ground */}
            <line x1="50" y1="195" x2="390" y2="195" stroke="#1e293b" strokeWidth="4" />
            {/* Hip Hinge Posture */}
            <polyline points="205,195 210,135 155,105 110,105" stroke="#64748b" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hamstring Activation */}
            <ellipse cx="215" cy="140" rx="14" ry="26" fill="#a855f7" opacity="0.85" />
            <text x="215" y="144" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800">HAMSTRINGS</text>
            {/* Dumbbells hanging at shins */}
            <line x1="110" y1="105" x2="150" y2="155" stroke="#475569" strokeWidth="4" />
            <circle cx="150" cy="160" r="10" fill="#f1f5f9" />
            {/* Cue */}
            <text x="220" y="24" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="bold">HIP HINGE: PUSH GLUTES BACK TOWARDS WALL</text>
            <text x="220" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10">Keep bar glued to shins • Soft knee bend • Flat neutral spine</text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 440 220" className="w-full h-full max-h-56 mx-auto select-none">
            <rect width="440" height="220" fill="#080c14" rx="14" />
            <circle cx="220" cy="110" r="65" fill="#3b82f6" opacity="0.1" />
            <circle cx="220" cy="110" r="40" fill="#3b82f6" opacity="0.2" />
            <circle cx="220" cy="110" r="24" fill="#38bdf8" opacity="0.75" />
            <text x="220" y="114" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
              {exercise.targetMuscle.toUpperCase()}
            </text>
            <text x="220" y="30" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
              ISOLATION STRETCH & PEAK SQUEEZE
            </text>
            <text x="220" y="204" textAnchor="middle" fill="#94a3b8" fontSize="10">
              {exercise.equipment} • Controlled 3s Negative Rep
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0c101a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#07090e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Dumbbell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                  {exercise.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-bold border border-orange-500/25">
                  {exercise.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 font-mono">
                <Target size={12} className="text-red-400" />
                <span>Primary: <strong className="text-gray-200">{exercise.targetMuscle}</strong></span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Anatomical Movement Diagram */}
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
            {renderDiagram()}
          </div>

          {/* Training Parameters Strip */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-gray-400 block text-[10px] uppercase">Hypertrophy Goal</span>
              <span className="font-bold text-white text-xs sm:text-sm">{exercise.defaultSets} Sets × {exercise.defaultReps}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-gray-400 block text-[10px] uppercase">Equipment</span>
              <span className="font-bold text-sky-400 text-xs sm:text-sm truncate block">{exercise.equipment}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-gray-400 block text-[10px] uppercase">Tempo Blueprint</span>
              <span className="font-bold text-emerald-400 text-xs sm:text-sm block">3-1-1-0</span>
            </div>
          </div>

          {/* 2-Phase Movement Blueprint */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs font-mono">
                <Activity size={14} />
                <span>PHASE 1: ECCENTRIC LOAD (3s)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Slowly resist the weight down over 3 full seconds. Inhale deeply, feel the target muscle stretch fully without losing joint stability.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs font-mono">
                <Flame size={14} />
                <span>PHASE 2: CONCENTRIC DRIVE (1s)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Explode up through the primary muscle. Exhale forcefully through the sticking point and pause for a 1-second peak muscle contraction.
              </p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Form Checklist
            </h4>
            <div className="space-y-1.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Guardrails: Do's & Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {exercise.formTips.length > 0 && (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Sparkles size={13} /> Coach Form Cue
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {exercise.formTips[0]}
                </p>
              </div>
            )}

            {exercise.commonMistakes.length > 0 && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <ShieldAlert size={13} /> Fatal Mistake to Avoid
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {exercise.commonMistakes[0]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#07090e] flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <span>Understood • Ready to Lift</span>
          </button>
        </div>
      </div>
    </div>
  );
};
