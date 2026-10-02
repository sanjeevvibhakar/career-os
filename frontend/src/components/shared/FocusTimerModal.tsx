import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Play, Pause, RotateCcw, Brain, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle?: string;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  taskTitle = 'Algorithmic Problem Solving',
}) => {
  // Modes: 90m deep work (Ultradian), 20m break (BRAC recovery), 25m pomodoro
  const [mode, setMode] = useState<'90_WORK' | '20_BREAK' | '25_POMO'>('90_WORK');
  const [timeLeftSec, setTimeLeftSec] = useState<number>(90 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    return parseInt(localStorage.getItem('career_os_completed_timers') || '0', 10);
  });

  const getDurationForMode = (m: '90_WORK' | '20_BREAK' | '25_POMO') => {
    if (m === '90_WORK') return 90 * 60;
    if (m === '20_BREAK') return 20 * 60;
    return 25 * 60;
  };

  const handleSwitchMode = (newMode: '90_WORK' | '20_BREAK' | '25_POMO') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeftSec(getDurationForMode(newMode));
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSec === 0 && isRunning) {
      setIsRunning(false);
      soundService.playFocusGong();
      const updated = completedSessions + 1;
      setCompletedSessions(updated);
      localStorage.setItem('career_os_completed_timers', updated.toString());
      if (mode === '90_WORK') {
        alert('🎉 90-Minute Ultradian Deep Work Complete! Step away from all screens for a 20-minute refractory rest.');
        handleSwitchMode('20_BREAK');
      } else {
        alert('✅ Break finished! Ready for the next focused sprint.');
        handleSwitchMode('90_WORK');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSec, mode, completedSessions]);

  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;
  const totalDuration = getDurationForMode(mode);
  const progressPct = ((totalDuration - timeLeftSec) / totalDuration) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ultradian 90/20 Focus Timer">
      <div className="space-y-5 text-center py-2">
        {/* Mode selector */}
        <div className="flex justify-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 max-w-sm mx-auto">
          <button
            onClick={() => handleSwitchMode('90_WORK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              mode === '90_WORK'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain size={13} />
            <span>90m Deep Work</span>
          </button>

          <button
            onClick={() => handleSwitchMode('20_BREAK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              mode === '20_BREAK'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Coffee size={13} />
            <span>20m Recovery</span>
          </button>

          <button
            onClick={() => handleSwitchMode('25_POMO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              mode === '25_POMO'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={13} />
            <span>25m Sprint</span>
          </button>
        </div>

        {/* Task Focus Banner */}
        <div className="text-xs text-gray-400 font-mono">
          Current Focus: <span className="text-white font-bold">{taskTitle}</span>
        </div>

        {/* Big Circular / Rounded Time Display */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white select-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-2">
            {mode === '90_WORK' && '🧠 Peak Prefrontal Focus (Anders Ericsson / Kleitman Cycle)'}
            {mode === '20_BREAK' && '☕ No Screens! Walk, hydrate, stretch for neural consolidation.'}
            {mode === '25_POMO' && '⚡ High-intensity single pattern drill.'}
          </p>

          {/* Progress bar */}
          <div className="w-64 max-w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                mode === '90_WORK' ? 'bg-blue-500' : mode === '20_BREAK' ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/40'
                : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/25'
            }`}
          >
            {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start Session</>}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeftSec(getDurationForMode(mode));
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Scientific Note */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 max-w-md mx-auto text-left leading-relaxed">
          <strong className="text-gray-300 font-mono">Why 90 minutes?</strong> In 1982, Peretz Lavie & Nathaniel Kleitman demonstrated that the human Basic Rest-Activity Cycle (BRAC) provides an optimal 90-minute window of peak prefrontal vigilance before biological fatigue degrades error-checking.
        </div>
      </div>
    </Modal>
  );
};
