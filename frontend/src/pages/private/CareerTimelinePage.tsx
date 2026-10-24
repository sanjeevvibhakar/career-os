import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, Circle, Clock, ArrowRight, Target, 
  ChevronRight, Brain, Code, Building2, Filter, Layers, 
  ExternalLink, BookOpen, Check, AlertCircle, HelpCircle
} from 'lucide-react';
import { 
  MASTER_ROADMAP_PHASES, 
  MASTER_ROADMAP_TOPICS, 
  type RoadmapPhaseId, 
  type RoadmapTrack, 
  type MasterRoadmapTopic,
  type TopicStatus
} from '../../data/masterRoadmapData';
import { useDailyPlannerStore } from '../../stores/dailyPlannerStore';
import { soundService } from '../../services/soundService';

export const CareerTimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const dailyPlannerStore = useDailyPlannerStore();

  const [selectedPhaseId, setSelectedPhaseId] = useState<RoadmapPhaseId>(1);
  const [selectedTrack, setSelectedTrack] = useState<RoadmapTrack | 'ALL'>('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const selectedPhase = MASTER_ROADMAP_PHASES.find(p => p.id === selectedPhaseId) || MASTER_ROADMAP_PHASES[0];

  // Topics for the active phase and track filter
  const filteredTopics = useMemo(() => {
    return MASTER_ROADMAP_TOPICS.filter(t => {
      const matchPhase = t.phase === selectedPhaseId;
      const matchTrack = selectedTrack === 'ALL' || t.track === selectedTrack;
      return matchPhase && matchTrack;
    }).sort((a, b) => a.order - b.order);
  }, [selectedPhaseId, selectedTrack]);

  // Phase completion statistics
  const phaseStats = useMemo(() => {
    const phaseTopics = MASTER_ROADMAP_TOPICS.filter(t => t.phase === selectedPhaseId);
    const completed = phaseTopics.filter(t => dailyPlannerStore.getTopicStatus(t.id) === 'COMPLETED').length;
    const total = phaseTopics.length;
    return {
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [selectedPhaseId, dailyPlannerStore]);

  const activeTopic = useMemo(() => {
    if (selectedTopicId) {
      const found = MASTER_ROADMAP_TOPICS.find(t => t.id === selectedTopicId);
      if (found) return found;
    }
    return filteredTopics[0] || MASTER_ROADMAP_TOPICS[0];
  }, [selectedTopicId, filteredTopics]);

  const handleToggleTopic = (topicId: string) => {
    const current = dailyPlannerStore.getTopicStatus(topicId);
    const next = current === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    dailyPlannerStore.markTopicMastered(topicId, next === 'COMPLETED');
    soundService.playCheckSound();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans text-gray-100">
      
      {/* 1. Header Banner */}
      <header className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0d1017] to-purple-950/30 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Master Career Roadmap
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Deterministic beginner-to-advanced curriculum connecting DSA, Java Backend, and System Design (Oct 2026 – June 2027).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <Target size={14} />
              <span>Target: ₹25–45 LPA CTC by June 2027</span>
            </div>
          </div>
        </div>

        {/* Schedule & Office Context */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400 shrink-0" />
            <span>
              <strong className="text-gray-200">Workplace Shift:</strong> 11:00 AM – 8:00 PM (TCS React Native Training). Self-study roadmap executes in morning (DSA) and evening (Backend & System Design).
            </span>
          </div>
          <span className="text-blue-300 font-mono font-semibold shrink-0">
            Total Curriculum: {MASTER_ROADMAP_TOPICS.length} Milestones
          </span>
        </div>
      </header>

      {/* 2. Horizontal 5-Phase Selector */}
      <section aria-label="Roadmap Phases Navigation">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {MASTER_ROADMAP_PHASES.map((phase) => {
            const isSelected = phase.id === selectedPhaseId;
            const phaseTopics = MASTER_ROADMAP_TOPICS.filter(t => t.phase === phase.id);
            const done = phaseTopics.filter(t => dailyPlannerStore.getTopicStatus(t.id) === 'COMPLETED').length;
            const pct = phaseTopics.length > 0 ? Math.round((done / phaseTopics.length) * 100) : 0;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setSelectedPhaseId(phase.id);
                  setSelectedTopicId(null);
                  soundService.playCheckSound();
                }}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-[#0d1017] border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  {phase.timeRange}
                </div>
                <div className="font-bold text-xs sm:text-sm text-white mt-0.5 truncate">
                  {phase.title}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mt-2">
                  <span>{done}/{phaseTopics.length} done</span>
                  <span className={pct === 100 ? 'text-emerald-400 font-bold' : ''}>{pct}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${pct === 100 ? 'bg-emerald-400' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Phase Mission & Track Filter */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#0d1017] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              {selectedPhase.timeRange}
            </span>
            <h2 className="text-lg font-black text-white">
              {selectedPhase.title}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5 max-w-3xl leading-relaxed">
              <strong className="text-gray-100">Phase Goal: </strong>
              {selectedPhase.goal}
            </p>
            <p className="text-xs text-emerald-300 mt-0.5 max-w-3xl leading-relaxed font-mono">
              <strong>Deliverable: </strong>
              {selectedPhase.deliverable}
            </p>
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-1 self-start sm:self-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            {(['ALL', 'DSA', 'BACKEND', 'SYSTEM_DESIGN'] as const).map(track => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedTrack === track
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {track === 'ALL' ? 'All Tracks' : track === 'SYSTEM_DESIGN' ? 'System Design' : track}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Split Layout: Topic List on Left, Topic Deep Dive Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          
          {/* Left Column: Topics List */}
          <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Milestones ({filteredTopics.length})</span>
              <span className="text-gray-500 font-mono text-[11px]">Select to view detail</span>
            </div>

            {filteredTopics.map((topic) => {
              const status = dailyPlannerStore.getTopicStatus(topic.id);
              const isSelected = topic.id === activeTopic.id;
              const isCompleted = status === 'COMPLETED';

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTopic(topic.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-white/20 hover:border-white/40 text-transparent'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <Check size={12} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                          {topic.title}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 truncate mt-0.5">
                        {topic.stage} • {topic.estimatedEffort}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    topic.track === 'DSA'
                      ? 'bg-purple-500/10 text-purple-300'
                      : topic.track === 'BACKEND'
                      ? 'bg-blue-500/10 text-blue-300'
                      : 'bg-cyan-500/10 text-cyan-300'
                  }`}>
                    {topic.track}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Curriculum Card for Active Topic */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeTopic.track === 'DSA'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : activeTopic.track === 'BACKEND'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {activeTopic.track} • {activeTopic.stage}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    Est: {activeTopic.estimatedEffort}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-1.5 leading-snug">
                  {activeTopic.title}
                </h3>
              </div>

              {/* Status Toggle Button */}
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

            {/* Explanation & Why it matters */}
            <div className="space-y-2 text-xs leading-relaxed text-gray-300">
              <p>
                <strong className="text-white">Explanation: </strong>
                {activeTopic.shortExplanation}
              </p>
              <p>
                <strong className="text-blue-300">Why this matters: </strong>
                {activeTopic.whyItMatters}
              </p>
            </div>

            {/* Prerequisites */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 space-y-1">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-amber-400" />
                <span>Prerequisites:</span>
              </span>
              <div className="text-gray-400 font-mono text-[11px]">
                {activeTopic.prerequisites.length === 0
                  ? 'None (Foundational entry point)'
                  : activeTopic.prerequisites.map(p => {
                      const prereq = MASTER_ROADMAP_TOPICS.find(t => t.id === p);
                      const isMet = dailyPlannerStore.getTopicStatus(p) === 'COMPLETED';
                      return (
                        <span key={p} className={`inline-block mr-2 ${isMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isMet ? '✓' : '○'} {prereq ? prereq.title : p}
                        </span>
                      );
                    })}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-gray-200">Learning Objectives:</span>
              <ul className="space-y-1 text-gray-300 text-[11px] list-disc list-inside">
                {activeTopic.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Resources & Practice Exercises */}
            <div className="space-y-2 pt-1 border-t border-white/5 text-xs">
              <span className="font-bold text-gray-200 flex items-center gap-1.5">
                <BookOpen size={13} className="text-blue-400" />
                <span>Recommended Resources & Exercises:</span>
              </span>

              <div className="space-y-1.5">
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
                        <span>Open</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-gray-500 font-mono text-[10px]">{res.type}</span>
                    )}
                  </div>
                ))}

                {activeTopic.practiceExercises.map((ex, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5 text-[11px] space-y-0.5">
                    <div className="font-bold text-purple-300 flex items-center justify-between">
                      <span>Practice: {ex.title}</span>
                      {ex.practiceUrl && (
                        <a 
                          href={ex.practiceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <span>Solve</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <div className="text-gray-400">{ex.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Criteria */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={13} />
                <span>Clear Completion Criteria:</span>
              </span>
              <ul className="text-gray-300 text-[11px] list-disc list-inside space-y-0.5">
                {activeTopic.completionCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Link to Dedicated Hub */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  if (activeTopic.track === 'DSA') navigate('/dsa');
                  else if (activeTopic.track === 'BACKEND') navigate('/backend');
                  else navigate('/system-design');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Dedicated {activeTopic.track} Studio</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
