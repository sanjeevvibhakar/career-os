import React from 'react';
import { X, CheckCircle2, AlertTriangle, Dumbbell, ShieldAlert, Sparkles, Target } from 'lucide-react';
import type { ExerciseDefinition } from '../../data/gymData';

interface ExerciseDemoModalProps {
  exercise: ExerciseDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({ exercise, isOpen, onClose }) => {
  if (!isOpen || !exercise) return null;

  // Render stylized SVG anatomical & trajectory visual based on diagramType
  const renderDiagram = () => {
    switch (exercise.diagramType) {
      case 'bench-press':
      case 'incline-press':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 mx-auto">
            <rect width="400" height="240" fill="#0c101a" rx="16" />
            {/* Bench */}
            <path d="M 80 180 L 320 180" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M 120 180 L 110 220 M 280 180 L 290 220" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            {/* Bench Pad */}
            {exercise.diagramType === 'incline-press' ? (
              <path d="M 100 176 L 270 120" stroke="#3b82f6" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
            ) : (
              <path d="M 100 174 L 300 174" stroke="#3b82f6" strokeWidth="14" strokeLinecap="round" opacity="0.8" />
            )}
            {/* Athlete Torso */}
            <path d="M 130 166 Q 190 164 240 166" stroke="#94a3b8" strokeWidth="18" strokeLinecap="round" />
            {/* Active Muscle Glow (Chest) */}
            <ellipse cx="200" cy="162" rx="30" ry="12" fill="#ef4444" opacity="0.75" />
            <text x="200" y="166" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">CHEST TENSION</text>
            {/* Barbell Path / Trajectory */}
            <line x1="200" y1="90" x2="200" y2="150" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            {/* Downward / Upward Arrows */}
            <path d="M 195 98 L 200 90 L 205 98" fill="#38bdf8" />
            <path d="M 195 142 L 200 150 L 205 142" fill="#38bdf8" />
            {/* Barbell */}
            <line x1="120" y1="100" x2="280" y2="100" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
            <rect x="105" y="88" width="16" height="24" rx="3" fill="#64748b" />
            <rect x="279" y="88" width="16" height="24" rx="3" fill="#64748b" />
            <text x="200" y="38" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">BAR PATH: CONTROLLED 3s DESCENT</text>
            <text x="200" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">Elbows tucked 45° • Scapula retracted</text>
          </svg>
        );
      case 'lat-pulldown':
      case 'cable-row':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 mx-auto">
            <rect width="400" height="240" fill="#0c101a" rx="16" />
            {/* Machine Cable Column */}
            <rect x="330" y="30" width="16" height="180" rx="4" fill="#1e293b" />
            <circle cx="338" cy="45" r="8" fill="#475569" />
            {/* Cable Line */}
            <path d="M 338 45 L 210 50" stroke="#64748b" strokeWidth="3" />
            {/* Lat Bar */}
            <path d="M 150 50 Q 210 55 270 50" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
            {/* Pull Trajectory Arrow */}
            <path d="M 210 58 L 210 115" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="206,115 214,115 210,123" fill="#10b981" />
            {/* Athlete Back / Torso */}
            <path d="M 200 130 Q 210 160 215 190" stroke="#94a3b8" strokeWidth="22" strokeLinecap="round" />
            {/* Active Muscle Glow (Lats) */}
            <ellipse cx="202" cy="145" rx="20" ry="24" fill="#10b981" opacity="0.75" />
            <text x="202" y="148" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">LAT V-TAPER</text>
            <text x="200" y="28" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">DRIVE ELBOWS TO HIP POCKETS</text>
            <text x="200" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">Do not swing torso • Squeeze scapula</text>
          </svg>
        );
      case 'squat':
      case 'leg-press':
      case 'split-squat':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 mx-auto">
            <rect width="400" height="240" fill="#0c101a" rx="16" />
            {/* Floor */}
            <line x1="60" y1="210" x2="340" y2="210" stroke="#334155" strokeWidth="4" />
            {/* Athlete Legs & Hips in Squat */}
            <polyline points="180,110 225,145 195,208" stroke="#94a3b8" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Torso & Head */}
            <line x1="180" y1="110" x2="160" y2="70" stroke="#94a3b8" strokeWidth="18" strokeLinecap="round" />
            <circle cx="150" cy="50" r="14" fill="#cbd5e1" />
            {/* Barbell Across Traps */}
            <line x1="110" y1="65" x2="210" y2="65" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
            <rect x="96" y="53" width="15" height="24" rx="2" fill="#64748b" />
            <rect x="209" y="53" width="15" height="24" rx="2" fill="#64748b" />
            {/* Active Muscle Glow (Quads & Glutes) */}
            <ellipse cx="205" cy="130" rx="18" ry="12" fill="#f59e0b" opacity="0.8" />
            <ellipse cx="170" cy="115" rx="14" ry="14" fill="#ef4444" opacity="0.8" />
            <text x="205" y="133" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">QUADS</text>
            {/* Depth Line */}
            <line x1="160" y1="145" x2="270" y2="145" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="200" y="28" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">PARALLEL DEPTH: HIPS BELOW KNEES</text>
            <text x="200" y="228" textAnchor="middle" fill="#94a3b8" fontSize="10">Mid-foot pressure • Knees track over toes</text>
          </svg>
        );
      case 'rdl':
      case 'leg-curl':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 mx-auto">
            <rect width="400" height="240" fill="#0c101a" rx="16" />
            {/* Floor */}
            <line x1="60" y1="210" x2="340" y2="210" stroke="#334155" strokeWidth="4" />
            {/* Athlete Hinge (Legs soft bent, Torso flat) */}
            <polyline points="190,208 195,145 145,115 105,115" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Active Muscle Glow (Hamstrings) */}
            <ellipse cx="200" cy="148" rx="14" ry="24" fill="#a855f7" opacity="0.85" />
            <text x="200" y="152" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">HAMS</text>
            {/* Dumbbells hanging close to shins */}
            <line x1="105" y1="115" x2="140" y2="165" stroke="#64748b" strokeWidth="4" />
            <circle cx="140" cy="170" r="10" fill="#e2e8f0" />
            {/* Hip arrow back */}
            <path d="M 175 145 L 240 145" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4 4" />
            <polygon points="240,140 248,145 240,150" fill="#a855f7" />
            <text x="200" y="28" textAnchor="middle" fill="#a855f7" fontSize="12" fontWeight="bold">HIP HINGE: PUSH GLUTES TO WALL</text>
            <text x="200" y="228" textAnchor="middle" fill="#94a3b8" fontSize="10">Neutral spine • Shins vertical • Feel stretch</text>
          </svg>
        );
      default:
        // Arm / Shoulder / Core Generic High-Tech Diagram
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 mx-auto">
            <rect width="400" height="240" fill="#0c101a" rx="16" />
            {/* Target Area Spotlight */}
            <circle cx="200" cy="115" r="70" fill="#3b82f6" opacity="0.1" />
            <circle cx="200" cy="115" r="45" fill="#3b82f6" opacity="0.2" />
            <circle cx="200" cy="115" r="25" fill="#38bdf8" opacity="0.5" />
            <text x="200" y="119" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              {exercise.targetMuscle.split(' ')[0].toUpperCase()}
            </text>
            {/* Dynamic Orbit Rings */}
            <ellipse cx="200" cy="115" rx="85" ry="35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
            <text x="200" y="32" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
              PEAK MUSCLE TENSION & STRETCH
            </text>
            <text x="200" y="222" textAnchor="middle" fill="#94a3b8" fontSize="10">
              {exercise.equipment} • Strict Form
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c101a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/10 bg-[#07090e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Dumbbell size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                  {exercise.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/25">
                  {exercise.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <Target size={12} className="text-red-400" />
                <span>Primary Target: <strong className="text-gray-200">{exercise.targetMuscle}</strong></span>
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
        <div className="p-4 md:p-6 overflow-y-auto space-y-5">
          {/* Visual Movement & Form Diagram */}
          <div className="p-2 rounded-xl bg-black/50 border border-white/10 shadow-inner">
            {renderDiagram()}
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-gray-400 block text-[10px] uppercase">Default Target</span>
              <span className="font-bold text-white">{exercise.defaultSets} Sets × {exercise.defaultReps}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-gray-400 block text-[10px] uppercase">Equipment</span>
              <span className="font-bold text-sky-400 truncate block">{exercise.equipment}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-gray-400 block text-[10px] uppercase">Secondary Muscles</span>
              <span className="font-bold text-purple-300 truncate block">{exercise.secondaryMuscles.join(', ')}</span>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Execution Steps
            </h4>
            <div className="space-y-1.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 bg-white/[0.02] p-2 rounded-lg">
                  <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Form Tips */}
          {exercise.formTips.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles size={14} /> Coach Form Cue
              </h4>
              <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                {exercise.formTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {exercise.commonMistakes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Mistakes to Avoid
              </h4>
              <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#07090e] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
          >
            <span>Understood • Ready to Lift</span>
          </button>
        </div>
      </div>
    </div>
  );
};
