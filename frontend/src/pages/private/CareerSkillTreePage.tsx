import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useCareerStore } from '../../stores/careerStore';
import { EvidenceVaultModal } from '../../components/career/EvidenceVaultModal';
import { DsaDiagnosticModal } from '../../components/shared/DsaDiagnosticModal';
import { 
  MASTERY_LEVEL_DEFINITIONS, 
  type MasteryLevel, 
  type SkillBranch 
} from '../../types/career';
import { 
  Brain, Code, Database, Server, Cpu, ShieldCheck, 
  Sparkles, Layers, CheckCircle2, AlertCircle, Plus, FileText, Lock, Globe, ExternalLink, Terminal
} from 'lucide-react';

const BRANCH_CONFIG: Record<SkillBranch, { label: string; icon: any; color: string; description: string }> = {
  JAVA: {
    label: 'Java Foundations & Advanced Core',
    icon: Code,
    color: 'from-amber-500 to-orange-600',
    description: 'Object-Oriented Design, Collections, Streams, Multithreading, JMM, and Virtual Threads.',
  },
  SPRING_BOOT: {
    label: 'Spring Boot 3 & Backend Architecture',
    icon: Server,
    color: 'from-emerald-500 to-teal-600',
    description: 'IoC, REST API design, JPA/Hibernate, Spring Security, Transactions, and Testcontainers.',
  },
  SQL_DATABASES: {
    label: 'SQL & Database Performance',
    icon: Database,
    color: 'from-blue-500 to-indigo-600',
    description: 'Relational modeling, Window functions, B-Tree indexing, EXPLAIN ANALYZE, and MVCC isolation.',
  },
  DSA: {
    label: 'Data Structures & Algorithms',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    description: 'Linear patterns, Binary Search, Trees, Heaps, Dynamic Programming, and timed problem-solving.',
  },
  CS_FUNDAMENTALS: {
    label: 'CS Fundamentals & LLD',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-600',
    description: 'Operating Systems, Computer Networks, SOLID principles, and Low-Level Machine Coding.',
  },
  SOFTWARE_ENGINEERING: {
    label: 'Software Engineering & Testing',
    icon: Terminal,
    color: 'from-sky-500 to-blue-700',
    description: 'Clean code, Git etiquette, automated unit/integration testing, and debugging methodologies.',
  },
  SYSTEM_DESIGN: {
    label: 'High-Level System Design (HLD)',
    icon: Layers,
    color: 'from-fuchsia-500 to-purple-600',
    description: 'Load balancing, Sharding, Caching, Asynchronous messaging, and distributed trade-offs.',
  },
  PRODUCTION_ENGINEERING: {
    label: 'Production Engineering & Cloud',
    icon: Server,
    color: 'from-violet-500 to-indigo-600',
    description: 'Docker multi-stage builds, GitHub Actions CI/CD, AWS deployment, Redis caching, and logs.',
  },
  AI_APPLICATION_ENGINEERING: {
    label: 'AI Application Engineering',
    icon: Sparkles,
    color: 'from-amber-400 to-yellow-600',
    description: 'LLM integration, structured outputs, validation schemas, token costs, and fallback heuristics.',
  },
  WORKPLACE_LEARNING: {
    label: 'Workplace Assignment (TCS)',
    icon: ShieldCheck,
    color: 'from-slate-500 to-gray-700',
    description: 'React Native mobile frontend training for current job assignment. Isolated from independent study.',
  },
};

export const CareerSkillTreePage: React.FC = () => {
  const { skills, evidence, updateSkillLevel, updateSkillProgress, toggleSkillBottleneck } = useCareerStore();

  const [selectedBranch, setSelectedBranch] = useState<SkillBranch>('JAVA');
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'TREE' | 'VAULT'>('TREE');

  const filteredSkills = skills.filter(s => s.branch === selectedBranch);
  const currentBranchConfig = BRANCH_CONFIG[selectedBranch];

  const handleLevelChange = (skillId: string, newLevel: MasteryLevel) => {
    updateSkillLevel(skillId, newLevel);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span>Career Skill Tree & Evidence Vault</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
              5-Level Mastery Model
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Grounded in tangible proof and independent execution—not gamified XP or hours logged.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => setDiagnosticModalOpen(true)}
            className="flex-1 sm:flex-none justify-center min-h-[44px] flex items-center gap-2 text-xs"
          >
            <Brain size={14} className="text-purple-400" />
            <span>DSA Diagnostic</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => { setSelectedSkillForEvidence(undefined); setEvidenceModalOpen(true); }}
            className="flex-1 sm:flex-none justify-center min-h-[44px] flex items-center gap-2 text-xs"
          >
            <Plus size={14} />
            <span>Log Proof / Evidence</span>
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('TREE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'TREE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Skill Tree Branches</span>
        </button>

        <button
          onClick={() => setActiveTab('VAULT')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'VAULT'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Evidence Vault ({evidence.length} Artifacts)</span>
        </button>
      </div>

      {activeTab === 'TREE' ? (
        <>
          {/* 5-Level Mastery Legend */}
          <Card className="p-4 bg-[#0e111a]/80 border-white/10">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              The 5 Mastery Levels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const def = MASTERY_LEVEL_DEFINITIONS[lvl as MasteryLevel];
                return (
                  <div key={lvl} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">
                        {lvl}
                      </span>
                      <span>{def.title}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 leading-snug">
                      {def.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Branch Navigation Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {(Object.keys(BRANCH_CONFIG) as SkillBranch[]).map((branchKey) => {
              const cfg = BRANCH_CONFIG[branchKey];
              const Icon = cfg.icon;
              const isSelected = selectedBranch === branchKey;
              const count = skills.filter(s => s.branch === branchKey).length;

              return (
                <button
                  key={branchKey}
                  onClick={() => setSelectedBranch(branchKey)}
                  className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-white/15 text-white border border-white/20 shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-blue-400' : 'text-gray-500'} />
                  <span>{cfg.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Branch Info Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-transparent border border-white/10 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentBranchConfig.label}</span>
                {selectedBranch === 'WORKPLACE_LEARNING' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    TCS Assignment Only • Not Independent Study
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {currentBranchConfig.description}
              </p>
            </div>
          </div>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => {
              const linkedEvidence = evidence.filter(e => skill.evidenceIds.includes(e.id));
              const currentLevelDef = MASTERY_LEVEL_DEFINITIONS[skill.assessedProficiency];

              return (
                <Card key={skill.id} className="p-4 bg-[#0d1017] border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{skill.name}</h3>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          skill.tier === 1 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : skill.tier === 2 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          Tier {skill.tier === 0 ? 'Workplace' : skill.tier}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        Entry criteria: <span className="text-gray-300">{skill.entryCriteria}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSkillBottleneck(skill.id)}
                      className={`text-[10px] px-2 py-1 rounded font-medium transition-colors shrink-0 ${
                        skill.isBottleneck 
                          ? 'bg-rose-600 text-white shadow-sm' 
                          : 'bg-white/5 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {skill.isBottleneck ? 'Bottleneck' : 'Mark Bottleneck'}
                    </button>
                  </div>

                  {/* The 3 Separate Indicators */}
                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-black/30 border border-white/5 text-center">
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Progress</div>
                      <div className="text-xs font-bold text-blue-400 mt-0.5">{skill.learningProgressPct}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Assessed Level</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        Lv {skill.assessedProficiency} ({currentLevelDef.title})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Interview Readiness</div>
                      <div className="text-xs font-bold text-purple-400 mt-0.5">{skill.interviewReadinessPct}%</div>
                    </div>
                  </div>

                  {/* Level Adjustment Buttons */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Set Assessed Level:</span>
                      <span className="text-gray-300 font-mono text-[10px]">
                        Requires evidence for Lv 4-5
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleLevelChange(skill.id, lvl as MasteryLevel)}
                          className={`py-1 rounded text-[11px] font-bold transition-all ${
                            skill.assessedProficiency === lvl
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          L{lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtopics Checklist */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="text-[11px] font-semibold text-gray-400 mb-1">Key Subtopics:</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.subtopics.map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Items Linked */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck size={14} className={linkedEvidence.length > 0 ? 'text-emerald-400' : 'text-gray-600'} />
                      <span>{linkedEvidence.length} Evidence Artifacts</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSkillForEvidence(skill.id);
                        setEvidenceModalOpen(true);
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>Attach Proof</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        /* Evidence Vault Browser */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Stored Technical Proof & Artifacts
            </h2>
            <Button
              variant="primary"
              onClick={() => { setSelectedSkillForEvidence(undefined); setEvidenceModalOpen(true); }}
              className="text-xs flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add Evidence Artifact</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((item) => {
              const demonstratedSkills = skills.filter(s => item.demonstratedSkillIds.includes(s.id));

              return (
                <Card key={item.id} className="p-4 bg-[#0d1017] border-white/10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300">
                          {item.evidenceType.replace(/_/g, ' ')}
                        </span>
                        {item.isPublic ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1 font-mono">
                            <Globe size={10} /> Public
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1 font-mono">
                            <Lock size={10} /> TCS Confidential
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                      {item.verificationStatus}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <div><span className="text-gray-500 font-medium">Context:</span> {item.context}</div>
                    <div><span className="text-gray-500 font-medium">Action:</span> {item.actionTaken}</div>
                    <div><span className="text-gray-500 font-medium">Result:</span> <span className="text-emerald-300 font-semibold">{item.measurableResult}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-gray-500">Skills:</span>
                    {demonstratedSkills.map(s => (
                      <span key={s.id} className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-gray-300 font-mono">
                        {s.name}
                      </span>
                    ))}
                  </div>

                  {item.linkOrRef && (
                    <div className="text-[11px] text-blue-400 font-mono truncate flex items-center gap-1 pt-1 border-t border-white/5">
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{item.linkOrRef}</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <EvidenceVaultModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        preselectedSkillId={selectedSkillForEvidence}
      />

      <DsaDiagnosticModal
        isOpen={diagnosticModalOpen}
        onClose={() => setDiagnosticModalOpen(false)}
      />
    </div>
  );
};
