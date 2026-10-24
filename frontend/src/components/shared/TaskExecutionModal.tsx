import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, 
  Clock, ShieldCheck, Zap, ArrowRight, ExternalLink, HelpCircle
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export interface TaskExecutionProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    skill: string;
    estimatedMinutes: number;
    reason: string;
    successCriteria: string;
    evidenceToCapture: string;
    fallbackTask?: {
      title: string;
      estimatedMinutes: number;
    };
    actionRoute?: string;
  };
  onComplete: (notes: string, evidenceUrl?: string) => void;
  onPartial: (notes: string) => void;
  onBlocked: (reason: string) => void;
}

export const TaskExecutionModal: React.FC<TaskExecutionProps> = ({
  isOpen,
  onClose,
  task,
  onComplete,
  onPartial,
  onBlocked
}) => {
  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(task.estimatedMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [blockerReason, setBlockerReason] = useState('');
  const [activeTab, setActiveTab] = useState<'FOCUS' | 'COMPLETE' | 'BLOCKED'>('FOCUS');

  // Reset timer when task changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(task.estimatedMinutes * 60);
      setIsTimerRunning(false);
      setActiveTab('FOCUS');
      setEvidenceNotes('');
      setBlockerReason('');
    }
  }, [isOpen, task.estimatedMinutes, task.id]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundService.playCheckSound();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const toggleTimer = () => setIsTimerRunning(prev => !prev);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(task.estimatedMinutes * 60);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleFinishComplete = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playCheckSound();
    onComplete(evidenceNotes, evidenceUrl || undefined);
    onClose();
  };

  const handleFinishBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    onBlocked(blockerReason || 'Prerequisite blocked or stuck on implementation.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Focused Execution Studio">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto text-sm pr-1">
        
        {/* Task Objective Header */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-purple-950/30 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300">
              {task.skill}
            </span>
            <span className="text-gray-400 font-mono flex items-center gap-1">
              <Clock size={13} />
              <span>Target: {task.estimatedMinutes} mins</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {task.title}
          </h3>

          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-blue-300">Why this matters: </strong>
            {task.reason}
          </p>
        </div>

        {/* Focus Timer & Controls */}
        {activeTab === 'FOCUS' && (
          <div className="space-y-4">
            {/* Interactive Digital Clock */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white select-none">
                {timeFormatted}
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <Button
                  variant="primary"
                  onClick={toggleTimer}
                  className="px-6 py-2.5 min-h-[44px] text-xs font-bold flex items-center gap-2"
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isTimerRunning ? 'Pause Timer' : 'Start Focus Timer'}</span>
                </Button>

                <button
                  onClick={resetTimer}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Reset Timer"
                  aria-label="Reset Timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Success Criteria Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Success Criteria</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                {task.successCriteria}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('BLOCKED')}
                className="text-xs text-amber-400 hover:text-amber-300 py-2 min-h-[44px] flex items-center gap-1"
              >
                <AlertTriangle size={14} />
                <span>Stuck or Blocked?</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    onPartial('Worked partially on milestone.');
                    onClose();
                  }}
                  className="flex-1 sm:flex-none text-xs min-h-[44px]"
                >
                  Partial Done
                </Button>
                
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => setActiveTab('COMPLETE')}
                  className="flex-1 sm:flex-none text-xs min-h-[44px] bg-emerald-600 hover:bg-emerald-500"
                >
                  Done (Record Result)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Record Result / Completion */}
        {activeTab === 'COMPLETE' && (
          <form onSubmit={handleFinishComplete} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              Great execution! Record a quick note or link to store as technical proof in your Career Vault.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Summary of What You Built / Solved
              </label>
              <Input
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="e.g. Implemented REST controller with unit tests and verified 200/404 responses."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                GitHub PR / Commit / Documentation Link (Optional)
              </label>
              <Input
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://github.com/... or leave blank"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('FOCUS')}
                className="text-xs text-gray-400 hover:text-white min-h-[44px]"
              >
                Back to Timer
              </button>
              <Button variant="primary" type="submit" className="text-xs min-h-[44px] bg-emerald-600 hover:bg-emerald-500">
                Save & Mark Complete
              </Button>
            </div>
          </form>
        )}

        {/* Tab: Record Blocker */}
        {activeTab === 'BLOCKED' && (
          <form onSubmit={handleFinishBlocked} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              It is normal to hit roadblocks. Recording what blocked you helps the engine recommend the right prerequisite next time.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                What is currently blocking you?
              </label>
              <Input
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                placeholder="e.g. Concept unclear / missing prerequisite / ran out of time after TCS shift"
                required
              />
            </div>

            {task.fallbackTask && (
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300 space-y-1">
                <span className="font-bold text-blue-300">Suggested Fallback Task:</span>
                <p>{task.fallbackTask.title} ({task.fallbackTask.estimatedMinutes} mins)</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('FOCUS')}
                className="text-xs text-gray-400 hover:text-white min-h-[44px]"
              >
                Back to Timer
              </button>
              <Button variant="danger" type="submit" className="text-xs min-h-[44px]">
                Mark Blocked & Switch
              </Button>
            </div>
          </form>
        )}

      </div>
    </Modal>
  );
};
