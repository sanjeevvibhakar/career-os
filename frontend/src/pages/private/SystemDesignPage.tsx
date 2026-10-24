import React, { useState, useMemo } from 'react';
import { 
  Building2, Layers, Cpu, Database, Server, Network, 
  Check, CheckCircle2, ExternalLink, BookOpen, Clock, 
  HelpCircle, AlertTriangle, ArrowRight, ShieldCheck, Calculator
} from 'lucide-react';
import { MASTER_ROADMAP_TOPICS, type MasterRoadmapTopic } from '../../data/masterRoadmapData';
import { SYSTEM_DESIGN_BLUEPRINTS, type SystemDesignBlueprint } from '../../data/systemDesignData';
import { CapacityCalculator } from '../../components/system-design/CapacityCalculator';
import { useDailyPlannerStore } from '../../stores/dailyPlannerStore';
import { soundService } from '../../services/soundService';

const SYSTEM_DESIGN_STAGES = [
  { id: 'Stage 1: Foundations', title: 'Stage 1: Foundations', icon: Network, count: 5, color: 'text-blue-400' },
  { id: 'Stage 2: App & DB Design', title: 'Stage 2: App & DB Design', icon: Database, count: 6, color: 'text-emerald-400' },
  { id: 'Stage 3: Low-Level Design', title: 'Stage 3: Low-Level Design (LLD)', icon: Cpu, count: 7, color: 'text-purple-400' },
  { id: 'Stage 4: High-Level Design', title: 'Stage 4: High-Level Design (HLD)', icon: Server, count: 9, color: 'text-amber-400' },
  { id: 'Stage 5: Design Exercises', title: 'Stage 5: Design Exercises', icon: Layers, count: 6, color: 'text-cyan-400' },
];

export const SystemDesignPage: React.FC = () => {
  const dailyPlannerStore = useDailyPlannerStore();
  const [activeStageId, setActiveStageId] = useState<string>('Stage 1: Foundations');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  // System Design topics from master roadmap
  const sysDesignTopics = useMemo(() => {
    return MASTER_ROADMAP_TOPICS.filter(t => t.track === 'SYSTEM_DESIGN');
  }, []);

  const activeStageTopics = useMemo(() => {
    return sysDesignTopics.filter(t => t.stage === activeStageId);
  }, [sysDesignTopics, activeStageId]);

  const activeTopic = useMemo(() => {
    if (selectedTopicId) {
      const found = sysDesignTopics.find(t => t.id === selectedTopicId);
      if (found) return found;
    }
    return activeStageTopics[0] || sysDesignTopics[0];
  }, [selectedTopicId, activeStageTopics, sysDesignTopics]);

  // Find blueprint if active topic is a design exercise
  const matchedBlueprint = useMemo(() => {
    if (activeStageId !== 'Stage 5: Design Exercises') return null;
    if (activeTopic.id.includes('url-shortener')) return SYSTEM_DESIGN_BLUEPRINTS.find(b => b.id.includes('url') || b.id.includes('rate'));
    if (activeTopic.id.includes('rate-limiter')) return SYSTEM_DESIGN_BLUEPRINTS.find(b => b.id === 'rate-limiter');
    if (activeTopic.id.includes('notification')) return SYSTEM_DESIGN_BLUEPRINTS.find(b => b.id.includes('notif') || b.id === 'rate-limiter');
    return SYSTEM_DESIGN_BLUEPRINTS[0];
  }, [activeStageId, activeTopic]);

  const handleToggleTopic = (topicId: string) => {
    const isDone = dailyPlannerStore.getTopicStatus(topicId) === 'COMPLETED';
    dailyPlannerStore.markTopicMastered(topicId, !isDone);
    soundService.playCheckSound();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans text-gray-100">
      
      {/* 1. Header Banner */}
      <header className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0d1017] to-purple-950/30 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                System Design Studio
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Genuine beginner-to-advanced sequence: Foundations → App & DB Design → LLD → HLD → 6 Core Design Exercises.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalculator(prev => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator size={14} className="text-blue-400" />
              <span>{showCalculator ? 'Close Estimator' : 'Capacity Estimator'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Optional Capacity Calculator Modal/Panel */}
      {showCalculator && (
        <section className="p-4 rounded-2xl bg-[#0d1017] border border-blue-500/30">
          <CapacityCalculator />
        </section>
      )}

      {/* 2. 5 Stages Horizontal Tabs */}
      <section aria-label="System Design Stages Navigation">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SYSTEM_DESIGN_STAGES.map((stage) => {
            const isSelected = stage.id === activeStageId;
            const stageTopics = sysDesignTopics.filter(t => t.stage === stage.id);
            const doneCount = stageTopics.filter(t => dailyPlannerStore.getTopicStatus(t.id) === 'COMPLETED').length;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStageId(stage.id);
                  setSelectedTopicId(null);
                  soundService.playCheckSound();
                }}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                    : 'bg-[#0d1017] border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={16} className={stage.color} />
                  <span className="text-[10px] font-mono text-gray-500">
                    {doneCount}/{stageTopics.length}
                  </span>
                </div>
                <div className="font-bold text-xs text-white mt-1.5 truncate">
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Stage Content & Split View */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Topics in Current Stage */}
          <div className="lg:col-span-5 space-y-1.5 max-h-[650px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{activeStageId} ({activeStageTopics.length} topics)</span>
            </div>

            {activeStageTopics.map((topic) => {
              const status = dailyPlannerStore.getTopicStatus(topic.id);
              const isSelected = topic.id === activeTopic.id;
              const isDone = status === 'COMPLETED';

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md text-white'
                      : 'bg-[#0d1017] border-white/5 hover:border-white/15 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTopic(topic.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-white/20 hover:border-white/40 text-transparent'
                      }`}
                      title={isDone ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <Check size={12} />
                    </button>

                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isDone ? 'line-through text-gray-500' : 'text-white'}`}>
                        {topic.title}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                        {topic.estimatedEffort}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-gray-500 shrink-0">
                    #{topic.order}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Topic Detailed Learning Content */}
          <div className="lg:col-span-7 bg-[#0d1017] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  {activeTopic.stage} • Topic #{activeTopic.order}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeTopic.title}
                </h2>
              </div>

              <button
                onClick={() => handleToggleTopic(activeTopic.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  dailyPlannerStore.getTopicStatus(activeTopic.id) === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
              >
                {dailyPlannerStore.getTopicStatus(activeTopic.id) === 'COMPLETED' ? '✓ Completed' : 'Mark Complete'}
              </button>
            </div>

            {/* Explanation & Relevance */}
            <div className="space-y-2 text-xs leading-relaxed text-gray-300">
              <p>
                <strong className="text-white">Explanation: </strong>
                {activeTopic.shortExplanation}
              </p>
              <p className="text-cyan-300">
                <strong>Why this matters in system design: </strong>
                {activeTopic.whyItMatters}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-gray-200">Key Design Objectives:</span>
              <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
                {activeTopic.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Practical Design Exercise */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <Layers size={14} />
                <span>Practical Design Exercise:</span>
              </span>
              {activeTopic.practiceExercises.map((ex, i) => (
                <div key={i} className="text-gray-300 text-[11px]">
                  <strong className="text-white">{ex.title}: </strong>
                  <span>{ex.description}</span>
                </div>
              ))}
            </div>

            {/* Completion Criteria */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={14} />
                <span>Completion Criteria:</span>
              </span>
              <ul className="text-gray-300 text-[11px] list-disc list-inside space-y-0.5">
                {activeTopic.completionCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Design Blueprint Details if in Stage 5 */}
            {matchedBlueprint && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <Server size={14} className="text-purple-400" />
                  <span>Blueprint Breakdown: {matchedBlueprint.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-white/5">
                    <span className="text-gray-400">Target DAU: </span>
                    <span className="text-cyan-300">{matchedBlueprint.estimationBaseline.dau}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <span className="text-gray-400">Read / Write QPS: </span>
                    <span className="text-emerald-300">{matchedBlueprint.estimationBaseline.readQps} / {matchedBlueprint.estimationBaseline.writeQps}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-300">Key Architectural Trade-Offs:</span>
                  {matchedBlueprint.tradeOffs.map((to, i) => (
                    <div key={i} className="p-2 rounded bg-white/[0.02] border border-white/5 space-y-0.5 text-[11px]">
                      <div className="text-amber-300"><strong>Challenge: </strong>{to.challenge}</div>
                      <div className="text-gray-300"><strong>Solution: </strong>{to.solution}</div>
                      <div className="text-gray-400"><strong>Trade-off: </strong>{to.tradeoff}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            <div className="pt-2 border-t border-white/5 text-xs space-y-1.5">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <BookOpen size={13} className="text-cyan-400" />
                <span>Recommended Reading & Architecture Guides:</span>
              </span>
              {activeTopic.resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[11px]">
                  <span className="text-gray-200">{res.title}</span>
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-gray-500 font-mono text-[10px]">{res.type}</span>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
