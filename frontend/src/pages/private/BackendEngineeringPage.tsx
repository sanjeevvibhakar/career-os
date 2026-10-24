import React, { useState, useMemo } from 'react';
import { 
  Code, Server, Database, ShieldCheck, Cloud, FolderGit2, 
  Check, CheckCircle2, ExternalLink, BookOpen, Clock, 
  Terminal, ArrowRight, Layers, FileCode
} from 'lucide-react';
import { MASTER_ROADMAP_TOPICS, type MasterRoadmapTopic } from '../../data/masterRoadmapData';
import { useDailyPlannerStore } from '../../stores/dailyPlannerStore';
import { soundService } from '../../services/soundService';

const BACKEND_STAGES = [
  { id: 'Stage 1: Java Foundations', title: 'Stage 1: Java Foundations', icon: FileCode, count: 10, color: 'text-blue-400' },
  { id: 'Stage 2: SQL and Databases', title: 'Stage 2: SQL & Databases', icon: Database, count: 10, color: 'text-emerald-400' },
  { id: 'Stage 3: Spring Boot', title: 'Stage 3: Spring Boot 3', icon: Server, count: 12, color: 'text-purple-400' },
  { id: 'Stage 4: Testing & Quality', title: 'Stage 4: Testing & Quality', icon: ShieldCheck, count: 8, color: 'text-cyan-400' },
  { id: 'Stage 5: Deployment', title: 'Stage 5: Cloud Deployment', icon: Cloud, count: 7, color: 'text-amber-400' },
  { id: 'Stage 6: Flagship Project', title: 'Stage 6: Flagship Project', icon: FolderGit2, count: 4, color: 'text-rose-400' },
];

export const BackendEngineeringPage: React.FC = () => {
  const dailyPlannerStore = useDailyPlannerStore();
  const [activeStageId, setActiveStageId] = useState<string>('Stage 1: Java Foundations');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // All backend topics from master roadmap
  const backendTopics = useMemo(() => {
    return MASTER_ROADMAP_TOPICS.filter(t => t.track === 'BACKEND');
  }, []);

  const activeStageTopics = useMemo(() => {
    return backendTopics.filter(t => t.stage === activeStageId);
  }, [backendTopics, activeStageId]);

  const activeTopic = useMemo(() => {
    if (selectedTopicId) {
      const found = backendTopics.find(t => t.id === selectedTopicId);
      if (found) return found;
    }
    return activeStageTopics[0] || backendTopics[0];
  }, [selectedTopicId, activeStageTopics, backendTopics]);

  const overallProgress = useMemo(() => {
    const completed = backendTopics.filter(t => dailyPlannerStore.getTopicStatus(t.id) === 'COMPLETED').length;
    return {
      completed,
      total: backendTopics.length,
      pct: Math.round((completed / backendTopics.length) * 100),
    };
  }, [backendTopics, dailyPlannerStore]);

  const handleToggleTopic = (topicId: string) => {
    const isDone = dailyPlannerStore.getTopicStatus(topicId) === 'COMPLETED';
    dailyPlannerStore.markTopicMastered(topicId, !isDone);
    soundService.playCheckSound();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans text-gray-100">
      
      {/* 1. Header Banner */}
      <header className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0d1017] to-cyan-950/30 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Code size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Java & Spring Boot Backend Engineering
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Production Java 21, PostgreSQL, Spring Boot 3, Testcontainers, Docker, Redis & Flagship Architecture.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono text-gray-400">Curriculum Progress</div>
              <div className="text-sm font-mono font-bold text-blue-400">
                {overallProgress.completed} / {overallProgress.total} completed ({overallProgress.pct}%)
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 6 Stages Horizontal Tabs */}
      <section aria-label="Backend Stages Navigation">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {BACKEND_STAGES.map((stage) => {
            const isSelected = stage.id === activeStageId;
            const stageTopics = backendTopics.filter(t => t.stage === stage.id);
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
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
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
                      ? 'bg-blue-950/40 border-blue-500 shadow-md text-white'
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
                <span className="text-xs font-mono text-blue-400 uppercase font-bold">
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
              <p className="text-blue-300">
                <strong>Why this matters in backend engineering: </strong>
                {activeTopic.whyItMatters}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-gray-200">Key Engineering Objectives:</span>
              <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
                {activeTopic.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Practical Coding Exercise */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-blue-300">
                <Terminal size={14} />
                <span>Hands-On Coding Exercise:</span>
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

            {/* Resources */}
            <div className="pt-2 border-t border-white/5 text-xs space-y-1.5">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <BookOpen size={13} className="text-blue-400" />
                <span>Recommended Official Documentation & Guide:</span>
              </span>
              {activeTopic.resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[11px]">
                  <span className="text-gray-200">{res.title}</span>
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>Read Documentation</span>
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

      {/* 4. Stage 6 Special Flagship Project Evidence Vault */}
      {activeStageId === 'Stage 6: Flagship Project' && (
        <section className="p-5 rounded-2xl bg-[#0d1017] border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <FolderGit2 size={18} className="text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Flagship Project Deliverables & Production Evidence
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Database size={13} className="text-blue-400" />
                <span>Relational Schema</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                PostgreSQL schema managed with Flyway migrations. Normalized 3NF tables with composite B-Tree indexing.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Automated Test Suite</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                JUnit 5, Mockito & Testcontainers integration test suite running real PostgreSQL in CI.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cloud size={13} className="text-purple-400" />
                <span>Live Deployment</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                Multi-stage Docker container deployed to cloud host with GitHub Actions CI/CD and Redis caching.
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
