import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Code, Calendar, Target, Clock, ArrowRight, 
  Sparkles, ShieldCheck, Briefcase, Award, Building2, 
  CheckCircle2, Volume2, VolumeX, Zap, AlertTriangle, ChevronDown, ChevronUp, Check, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCareerStore } from '../../stores/careerStore';
import { useDsaStore } from '../../stores/dsaStore';
import { useSyllabusStore } from '../../stores/syllabusStore';
import { useDailyStore } from '../../stores/dailyStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { computeIntelligenceRecommendations } from '../../engine/intelligenceEngine';
import { TaskExecutionModal } from '../../components/shared/TaskExecutionModal';
import { soundService } from '../../services/soundService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const { profile, skills, roadmap, project } = useCareerStore();
  const dsaStore = useDsaStore();
  const syllabusStore = useSyllabusStore();
  const dailyStore = useDailyStore();
  const dashboardStore = useDashboardStore();

  const [soundEnabled, setSoundEnabled] = useState(soundService.isEnabled());
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const [selectedExecutionTask, setSelectedExecutionTask] = useState<any>(null);
  const [showExtendedPlan, setShowExtendedPlan] = useState(false);
  const [showAlternativeSelector, setShowAlternativeSelector] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundService.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundService.playCheckSound();
  };

  // 1. Dynamic Task Recommendation Engine (Deterministic & grounded)
  const dueRevisions = dsaStore.getDueRevisions();
  const patternAnalysis = dsaStore.getPatternAnalysis();

  const engineOutput = useMemo(() => {
    return computeIntelligenceRecommendations({
      profile,
      skills,
      roadmap,
      project,
      dueRevisions,
      weakPatterns: patternAnalysis.weakPatterns,
      recurringMistakes: patternAnalysis.recurringMistakes,
    });
  }, [profile, skills, roadmap, project, dueRevisions, patternAnalysis]);

  const { currentContext, primaryRecommendation, alternativeRecommendations, detectedBottlenecks } = engineOutput;

  // Selected Primary Task (allows user to swap to fallback or alternative)
  const [customPrimaryId, setCustomPrimaryId] = useState<string | null>(null);

  const activePrimaryTask = useMemo(() => {
    if (customPrimaryId) {
      const alt = alternativeRecommendations.find(a => a.id === customPrimaryId);
      if (alt) return alt;
    }
    return primaryRecommendation;
  }, [customPrimaryId, primaryRecommendation, alternativeRecommendations]);

  // 2. Today's Plan (Maximum 3 Tasks by default)
  const todayDateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Pending DSA problem
  const nextDsa = useMemo(() => {
    if (dueRevisions.length > 0) {
      const match = dsaStore.problems.find(p => p.id === dueRevisions[0].problemId);
      if (match) return { problem: match, isRevision: true };
    }
    const unsolved = dsaStore.problems.find(p => !dsaStore.attempts.some(a => a.problemId === p.id));
    return { problem: unsolved || dsaStore.problems[0], isRevision: false };
  }, [dsaStore.problems, dsaStore.attempts, dueRevisions]);

  // Pending Backend topic
  const nextBackend = useMemo(() => {
    return syllabusStore.getNextPendingItem();
  }, [syllabusStore]);

  // Core 3 Daily Tasks
  const coreDailyTasks = useMemo(() => {
    const dsaDone = dsaStore.attempts.some(a => a.attemptedAt.startsWith(new Date().toISOString().split('T')[0]));
    const backendDone = nextBackend ? syllabusStore.isCompleted(nextBackend.id) : false;
    const commDone = false;

    return [
      {
        id: 'task-dsa',
        category: 'DSA Practice',
        title: nextDsa.problem.name,
        subtitle: `${nextDsa.problem.pattern} • ${nextDsa.problem.difficulty}`,
        durationMin: 45,
        completed: dsaDone,
        actionRoute: '/dsa',
        reason: 'Maintains algorithmic pattern recognition outside work hours.',
        successCriteria: 'Solve in under 30 minutes with optimal time and space complexity.',
        evidenceToCapture: 'Log mistake category and code complexity in DSA Tracker.'
      },
      {
        id: 'task-backend',
        category: 'Java / Backend',
        title: nextBackend ? nextBackend.subtopic : 'Spring Boot Global Exception Handling',
        subtitle: nextBackend ? `Week ${nextBackend.weekNumber} • ${nextBackend.topic}` : 'Spring Boot Architecture',
        durationMin: 45,
        completed: backendDone,
        actionRoute: '/sprint',
        reason: 'Advances active flagship milestone and closes key backend engineering gaps.',
        successCriteria: 'Understand annotations, write unit test, and verify error responses.',
        evidenceToCapture: 'Attach GitHub commit or test result to Evidence Vault.'
      },
      {
        id: 'task-comm',
        category: 'Communication Drill',
        title: 'Technical Pitch & Architecture Vocalization',
        subtitle: '10-minute speech rehearsal',
        durationMin: 10,
        completed: commDone,
        actionRoute: '/communication',
        reason: 'Engineers who speak clearly stand out in product company interviews.',
        successCriteria: 'Explain your current project architecture out loud without filler words.',
        evidenceToCapture: 'Record 60-second audio snippet in Speech Studio.'
      }
    ];
  }, [nextDsa, nextBackend, dsaStore.attempts, syllabusStore]);

  // Handle Starting Task in Execution Modal
  const handleOpenExecution = (task: any) => {
    setSelectedExecutionTask({
      id: task.id || activePrimaryTask.id,
      title: task.taskTitle || task.title,
      skill: task.skill || task.category,
      estimatedMinutes: task.estimatedDurationMin || task.durationMin || 45,
      reason: task.reason,
      successCriteria: task.successCriteria || 'Complete implementation with verified test cases.',
      evidenceToCapture: task.evidenceToCapture || 'Log evidence in your vault.',
      fallbackTask: task.fallbackTask ? {
        title: task.fallbackTask.taskTitle,
        estimatedMinutes: task.fallbackTask.estimatedDurationMin
      } : undefined,
      actionRoute: task.actionRoute
    });
    setExecutionModalOpen(true);
  };

  // Record Task Outcome
  const handleTaskComplete = (notes: string, evidenceUrl?: string) => {
    if (selectedExecutionTask?.id === 'task-backend' && nextBackend) {
      syllabusStore.toggleItem(nextBackend.id);
    }
    dashboardStore.updateStreak('learning');
    soundService.playCheckSound();
  };

  const handleTaskPartial = (notes: string) => {
    // Keep pending for next block
  };

  const handleTaskBlocked = (reason: string) => {
    if (activePrimaryTask.fallbackTask) {
      // Automatically swap to fallback task
      setCustomPrimaryId(null);
    }
  };

  // Top Bottleneck (Show at most 1 on Home)
  const topBottleneck = detectedBottlenecks.length > 0 ? detectedBottlenecks[0] : null;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto pb-20 animate-fade-in font-sans">
      
      {/* SECTION A: Compact Header (Consumes minimal vertical space) */}
      <header className="flex items-center justify-between py-2 px-1 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">Career OS</span>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-medium">Hello, {userName || 'Sanjeev'}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
            {todayDateStr} • TCS Shift: 11 AM – 8 PM
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </header>

      {/* SECTION B: Today's Primary Focus (The ONLY Hero Card on Screen) */}
      <section aria-label="Today's Primary Focus">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0d1017] to-purple-950/30 border border-blue-500/40 shadow-xl space-y-3 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                TODAY'S #1 PRIORITY
              </span>
              <span className="text-gray-400 font-mono text-[11px] hidden sm:inline">
                {activePrimaryTask.skill}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-400 font-mono text-xs">
              <Clock size={12} className="text-blue-400" />
              <span>{activePrimaryTask.estimatedDurationMin} mins</span>
            </div>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black text-white leading-tight">
              {activePrimaryTask.taskTitle}
            </h1>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              <strong className="text-blue-300 font-semibold">Why this task: </strong>
              {activePrimaryTask.reason}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10">
            <div className="text-[11px] text-gray-400">
              <button
                onClick={() => setShowAlternativeSelector(prev => !prev)}
                className="hover:text-blue-300 underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Swap task / view fallback ({activePrimaryTask.fallbackTask?.estimatedDurationMin || 25}m)</span>
                {showAlternativeSelector ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleOpenExecution(activePrimaryTask)}
                className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                aria-label={`Start task: ${activePrimaryTask.taskTitle}`}
              >
                <span>Start Task</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Collapsible Alternative Tasks Drawer */}
          {showAlternativeSelector && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs pt-3">
              <span className="text-[10px] uppercase font-bold text-gray-400">Choose Another Active Task</span>
              <div className="space-y-1.5">
                {alternativeRecommendations.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => {
                      setCustomPrimaryId(alt.id);
                      setShowAlternativeSelector(false);
                    }}
                    className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="text-white font-medium truncate">{alt.taskTitle}</span>
                    <span className="text-gray-400 font-mono text-[10px] shrink-0">{alt.estimatedDurationMin}m</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 7: Compact Actionable Bottleneck (At most 1, disappears when resolved) */}
      {topBottleneck && (
        <aside aria-label="Active Bottleneck Alert">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle size={15} className="text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-200">{topBottleneck.skillName}: </span>
                <span className="text-gray-300">{topBottleneck.reason}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/skills-tree')}
              className="text-[11px] font-bold text-amber-300 hover:text-white px-2.5 py-1 rounded-lg bg-amber-500/20 shrink-0 cursor-pointer"
            >
              Fix Gap
            </button>
          </div>
        </aside>
      )}

      {/* SECTION C: Today's Plan (Maximum 3 Tasks by default) */}
      <section aria-label="Today's Plan">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Today's Short Plan (1.5 Hours Total)</span>
            </h2>
            <span className="text-[10px] text-gray-500 font-mono">1–3 Actions Max</span>
          </div>

          <div className="space-y-2">
            {coreDailyTasks.slice(0, showExtendedPlan ? 5 : 3).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      if (task.id === 'task-backend' && nextBackend) {
                        syllabusStore.toggleItem(nextBackend.id);
                        soundService.playCheckSound();
                      }
                    }}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-white/20 hover:border-white/40 text-transparent'
                    }`}
                    title={task.completed ? 'Completed' : 'Click to toggle'}
                    aria-label={`Mark ${task.title} complete`}
                  >
                    <Check size={12} />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-white/10 text-gray-400 shrink-0">
                        {task.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate mt-0.5">
                      {task.subtitle} • {task.durationMin} mins
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenExecution(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Start Focused Timer"
                    aria-label={`Start timer for ${task.title}`}
                  >
                    <Clock size={15} />
                  </button>
                  <button
                    onClick={() => navigate(task.actionRoute)}
                    className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors cursor-pointer"
                    title="Open Dedicated Page"
                    aria-label={`Open dedicated page for ${task.title}`}
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progressive Disclosure Toggle */}
          <div className="pt-1 text-center">
            <button
              onClick={() => setShowExtendedPlan(prev => !prev)}
              className="text-[11px] font-semibold text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
            >
              {showExtendedPlan ? 'Show Less (Keep it calm)' : 'View Additional Workflows (+2 more)'}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION D: Compact Career Progress (Single Calm Summary Card) */}
      <section aria-label="Career Progress Summary">
        <div className="p-4 rounded-xl bg-[#0d1017] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
              <Target size={14} className="text-emerald-400" />
              <span>Career Progress Pulse</span>
            </div>
            <button
              onClick={() => navigate('/interview-readiness')}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Detailed Analytics ↗
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">DSA Solved</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {dsaStore.attempts.length} <span className="text-[10px] text-gray-500 font-normal">problems</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Current Stage</div>
              <div className="text-sm font-bold text-purple-300 truncate mt-0.5">
                Phase 1 (Oct–Dec)
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Readiness Score</div>
              <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                68% Ready
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase">Target CTC</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                ₹25–45 LPA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: Secondary Tools (Clean, Quiet 1-Tap Hub) */}
      <section aria-label="Secondary Dedicated Tools">
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Dedicated Deep-Dive Pages
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => navigate('/timeline')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Calendar size={15} className="text-blue-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Timeline</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/system-design')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 size={15} className="text-sky-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">System Design</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/job-pipeline')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Briefcase size={15} className="text-amber-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Target Jobs</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/skills-tree')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck size={15} className="text-indigo-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Evidence Vault</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/schedule')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Clock size={15} className="text-rose-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Timetable</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/review')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Award size={15} className="text-purple-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Weekly Review</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/gym')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Zap size={15} className="text-orange-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Gym Split</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/journal')}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span className="text-gray-200 font-medium truncate">Journal</span>
              </div>
              <ArrowRight size={12} className="text-gray-500 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated Task Execution View */}
      {selectedExecutionTask && (
        <TaskExecutionModal
          isOpen={executionModalOpen}
          onClose={() => setExecutionModalOpen(false)}
          task={selectedExecutionTask}
          onComplete={handleTaskComplete}
          onPartial={handleTaskPartial}
          onBlocked={handleTaskBlocked}
        />
      )}

    </div>
  );
};
