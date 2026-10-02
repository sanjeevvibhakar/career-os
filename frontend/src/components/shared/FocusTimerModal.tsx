import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { 
  Play, Pause, RotateCcw, Brain, Coffee, Sparkles, CheckCircle2, 
  Bell, BellOff, ArrowRight, Target, ShieldCheck, Flame
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import { notificationService } from '../../services/notificationService';

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
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [customIntention, setCustomIntention] = useState<string>(taskTitle);

  // Notification state
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(() => {
    return notificationService.isGranted();
  });

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    return parseInt(localStorage.getItem('career_os_completed_timers') || '0', 10);
  });

  const originalDocTitle = useRef<string>(typeof document !== 'undefined' ? document.title : 'Career OS');

  const getDurationForMode = (m: '90_WORK' | '20_BREAK' | '25_POMO') => {
    if (m === '90_WORK') return 90 * 60;
    if (m === '20_BREAK') return 20 * 60;
    return 25 * 60;
  };

  const handleSwitchMode = (newMode: '90_WORK' | '20_BREAK' | '25_POMO') => {
    setIsRunning(false);
    setSessionCompleted(false);
    setMode(newMode);
    setTimeLeftSec(getDurationForMode(newMode));
  };

  const handleRequestNotification = async () => {
    const granted = await notificationService.requestPermission();
    setHasNotificationPermission(granted);
    if (granted) {
      notificationService.sendNotification('🔔 Alarms Activated', {
        body: 'Career OS will alert you when your deep work and recovery cycles finish!',
      });
      soundService.playCheckSound();
    }
  };

  // Timer interval and completion effect
  useEffect(() => {
    let interval: any = null;

    if (isRunning && timeLeftSec > 0) {
      interval = setInterval(() => {
        setTimeLeftSec(prev => prev - 1);
      }, 1000);
    } else if (timeLeftSec === 0 && isRunning) {
      setIsRunning(false);
      setSessionCompleted(true);
      soundService.playFocusGong();
      notificationService.sendFocusCompleteNotification(mode);

      const updated = completedSessions + 1;
      setCompletedSessions(updated);
      localStorage.setItem('career_os_completed_timers', updated.toString());
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSec, mode, completedSessions]);

  // Tab Title countdown (runs while modal is open and active)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isRunning && timeLeftSec > 0) {
      const mins = Math.floor(timeLeftSec / 60);
      const secs = timeLeftSec % 60;
      const tag = mode === '90_WORK' ? '🧠 Deep Work' : mode === '20_BREAK' ? '☕ Rest' : '⚡ Sprint';
      document.title = `(${mins}:${String(secs).padStart(2, '0')}) ${tag} | Career OS`;
    } else {
      document.title = originalDocTitle.current;
    }

    return () => {
      document.title = originalDocTitle.current;
    };
  }, [isRunning, timeLeftSec, mode]);

  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;
  const totalDuration = getDurationForMode(mode);
  const progressPct = ((totalDuration - timeLeftSec) / totalDuration) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ultradian 90/20 Deep Work Studio">
      <div className="space-y-5 text-center py-1">
        
        {/* Top Controls: Mode Selector & Notification Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Mode Selector */}
          <div className="flex justify-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => handleSwitchMode('90_WORK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                mode === '25_POMO'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={13} />
              <span>25m Sprint</span>
            </button>
          </div>

          {/* Background Notification Status */}
          <button
            onClick={handleRequestNotification}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 transition-colors self-stretch sm:self-auto justify-center ${
              hasNotificationPermission 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
            }`}
            title="Enable background browser alerts when timer finishes"
          >
            {hasNotificationPermission ? (
              <>
                <Bell size={12} className="text-emerald-400" />
                <span>Alarms Active</span>
              </>
            ) : (
              <>
                <BellOff size={12} className="text-amber-400" />
                <span>Enable Alarms</span>
              </>
            )}
          </button>
        </div>

        {/* Task Focus Intention Input */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-white/10 text-left space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400 flex items-center gap-1 font-bold">
              <Target size={12} className="text-sky-400" />
              <span>Session Intention (Single-Task Rule):</span>
            </span>
            <span className="text-gray-500 text-[10px]">Close other tabs</span>
          </div>
          <input
            type="text"
            value={customIntention}
            onChange={(e) => setCustomIntention(e.target.value)}
            placeholder="e.g. Solve Two Sum & understand Hash Map complement..."
            className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none focus:text-blue-300 font-semibold"
          />
        </div>

        {/* Big Circular / Rounded Time Display */}
        <div className="relative py-3 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white select-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          <p className="text-[11px] font-mono text-gray-400 mt-2 px-2 max-w-sm">
            {mode === '90_WORK' && '🧠 Peak Prefrontal Vigilance (Anders Ericsson / Kleitman Cycle)'}
            {mode === '20_BREAK' && '☕ No Screens! Walk, hydrate, stretch for synaptic consolidation.'}
            {mode === '25_POMO' && '⚡ High-intensity single pattern problem solving.'}
          </p>

          {/* Progress bar */}
          <div className="w-72 max-w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                mode === '90_WORK' ? 'bg-blue-500' : mode === '20_BREAK' ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Completion Banner (When Timer Hits Zero) */}
        {sessionCompleted && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>
                {mode === '90_WORK' ? '🎉 90-Minute Focus Session Completed!' : '☕ Recovery Rest Finished!'}
              </span>
            </div>
            <p className="text-xs text-gray-300">
              {mode === '90_WORK' 
                ? 'Your prefrontal cortex has achieved maximum deep work. Step away from screens for a 20-minute refractory rest.'
                : 'Neural memory consolidation complete. Ready for the next focused block!'}
            </p>
            <button
              onClick={() => {
                if (mode === '90_WORK') {
                  handleSwitchMode('20_BREAK');
                } else {
                  handleSwitchMode('90_WORK');
                }
              }}
              className="mt-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs inline-flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <span>{mode === '90_WORK' ? 'Start 20m Screen-Free Rest' : 'Start Next 90m Deep Work'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (sessionCompleted) setSessionCompleted(false);
              setIsRunning(!isRunning);
            }}
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
              setSessionCompleted(false);
              setTimeLeftSec(getDurationForMode(mode));
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Scientific Note & Streak Counter */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-white/5 gap-2">
          <span className="flex items-center gap-1 text-amber-400 font-mono">
            <Flame size={12} />
            <span>Completed Blocks: {completedSessions}</span>
          </span>
          <span className="text-[10px] text-gray-500">
            Background tab alerts + haptic vibration enabled
          </span>
        </div>
      </div>
    </Modal>
  );
};
