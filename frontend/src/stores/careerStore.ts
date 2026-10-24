import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CareerProfileSettings, 
  CareerSkill, 
  RoadmapPhase, 
  FlagshipProjectTracker, 
  CareerEvidenceItem, 
  JobOpportunity, 
  MockInterviewLog,
  MasteryLevel
} from '../types/career';
import { 
  INITIAL_CAREER_PROFILE, 
  INITIAL_CAREER_SKILLS, 
  INITIAL_ROADMAP_PHASES, 
  INITIAL_FLAGSHIP_PROJECT, 
  INITIAL_EVIDENCE_ITEMS, 
  INITIAL_JOB_OPPORTUNITIES 
} from '../data/careerRoadmapData';

interface CareerState {
  profile: CareerProfileSettings;
  skills: CareerSkill[];
  roadmap: RoadmapPhase[];
  project: FlagshipProjectTracker;
  evidence: CareerEvidenceItem[];
  jobs: JobOpportunity[];
  mockSessions: MockInterviewLog[];
  dsaDiagnostic: Record<number, { known: boolean; pattern: string; confidence: number }>;

  // Profile actions
  updateProfile: (updates: Partial<CareerProfileSettings>) => void;
  updateTrainingSchedule: (startHour: number, endHour: number, remainingMonths: number) => void;
  updateTargetCareer: (updates: Partial<CareerProfileSettings['targetCareer']>) => void;

  // Skill actions
  updateSkillLevel: (skillId: string, level: MasteryLevel, interviewReadinessPct?: number) => void;
  updateSkillProgress: (skillId: string, progressPct: number) => void;
  toggleSkillBottleneck: (skillId: string) => void;
  linkEvidenceToSkill: (skillId: string, evidenceId: string) => void;

  // Roadmap & Milestones
  updateMilestoneStatus: (phaseId: number, milestoneId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => void;
  updatePhaseDates: (phaseId: number, timeRange: string) => void;

  // Project actions
  updateProjectMilestone: (milestoneId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE', testCoveragePct?: number) => void;
  setProjectVersion: (version: 'v1' | 'v2' | 'v3' | 'v4') => void;

  // Evidence actions
  addEvidence: (item: Omit<CareerEvidenceItem, 'id' | 'createdAt'>) => void;
  updateEvidence: (id: string, updates: Partial<CareerEvidenceItem>) => void;
  deleteEvidence: (id: string) => void;

  // Job pipeline actions
  addJob: (job: Omit<JobOpportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJobStatus: (id: string, status: JobOpportunity['status']) => void;
  updateJob: (id: string, updates: Partial<JobOpportunity>) => void;
  deleteJob: (id: string) => void;

  // Mock sessions
  logMockSession: (session: Omit<MockInterviewLog, 'id'>) => void;

  // Diagnostic DSA
  recordDiagnosticResult: (problemId: number, known: boolean, pattern: string, confidence: number) => void;
  batchRecordDiagnostic: (results: Record<number, { known: boolean; pattern: string; confidence: number }>) => void;

  // Reset to initial
  resetToDefaults: () => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      profile: INITIAL_CAREER_PROFILE,
      skills: INITIAL_CAREER_SKILLS,
      roadmap: INITIAL_ROADMAP_PHASES,
      project: INITIAL_FLAGSHIP_PROJECT,
      evidence: INITIAL_EVIDENCE_ITEMS,
      jobs: INITIAL_JOB_OPPORTUNITIES,
      mockSessions: [],
      dsaDiagnostic: {},

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      updateTrainingSchedule: (startHour, endHour, remainingMonths) => {
        set((state) => ({
          profile: {
            ...state.profile,
            officeTrainingSchedule: {
              ...state.profile.officeTrainingSchedule,
              startHour,
              endHour,
              activeMonthsRemaining: remainingMonths,
            },
          },
        }));
      },

      updateTargetCareer: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            targetCareer: {
              ...state.profile.targetCareer,
              ...updates,
            },
          },
        }));
      },

      updateSkillLevel: (skillId, level, interviewReadinessPct) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          skills: state.skills.map((skill) => {
            if (skill.id === skillId) {
              return {
                ...skill,
                assessedProficiency: level,
                interviewReadinessPct: interviewReadinessPct !== undefined ? interviewReadinessPct : skill.interviewReadinessPct,
                lastAssessedDate: today,
              };
            }
            return skill;
          }),
        }));
      },

      updateSkillProgress: (skillId, progressPct) => {
        set((state) => ({
          skills: state.skills.map((skill) => 
            skill.id === skillId ? { ...skill, learningProgressPct: Math.min(100, Math.max(0, progressPct)) } : skill
          ),
        }));
      },

      toggleSkillBottleneck: (skillId) => {
        set((state) => ({
          skills: state.skills.map((skill) => 
            skill.id === skillId ? { ...skill, isBottleneck: !skill.isBottleneck } : skill
          ),
        }));
      },

      linkEvidenceToSkill: (skillId, evidenceId) => {
        set((state) => ({
          skills: state.skills.map((skill) => {
            if (skill.id === skillId && !skill.evidenceIds.includes(evidenceId)) {
              return { ...skill, evidenceIds: [...skill.evidenceIds, evidenceId] };
            }
            return skill;
          }),
        }));
      },

      updateMilestoneStatus: (phaseId, milestoneId, status) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          roadmap: state.roadmap.map((phase) => {
            if (phase.id === phaseId) {
              return {
                ...phase,
                milestones: phase.milestones.map((m) => 
                  m.id === milestoneId 
                    ? { ...m, status, completedDate: status === 'COMPLETED' ? today : undefined } 
                    : m
                ),
              };
            }
            return phase;
          }),
        }));
      },

      updatePhaseDates: (phaseId, timeRange) => {
        set((state) => ({
          roadmap: state.roadmap.map((phase) => 
            phase.id === phaseId ? { ...phase, timeRange } : phase
          ),
        }));
      },

      updateProjectMilestone: (milestoneId, status, testCoveragePct) => {
        set((state) => ({
          project: {
            ...state.project,
            milestones: state.project.milestones.map((m) => 
              m.id === milestoneId 
                ? { ...m, status, testCoveragePct: testCoveragePct !== undefined ? testCoveragePct : m.testCoveragePct } 
                : m
            ),
          },
        }));
      },

      setProjectVersion: (version) => {
        set((state) => ({
          project: {
            ...state.project,
            currentVersion: version,
          },
        }));
      },

      addEvidence: (item) => {
        const id = `ev-${Date.now()}`;
        const newEvidence: CareerEvidenceItem = {
          ...item,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          evidence: [newEvidence, ...state.evidence],
        }));

        // Automatically link to demonstrated skills
        item.demonstratedSkillIds.forEach((skillId) => {
          get().linkEvidenceToSkill(skillId, id);
        });
      },

      updateEvidence: (id, updates) => {
        set((state) => ({
          evidence: state.evidence.map((ev) => ev.id === id ? { ...ev, ...updates } : ev),
        }));
      },

      deleteEvidence: (id) => {
        set((state) => ({
          evidence: state.evidence.filter((ev) => ev.id !== id),
          skills: state.skills.map((skill) => ({
            ...skill,
            evidenceIds: skill.evidenceIds.filter((eId) => eId !== id),
          })),
        }));
      },

      addJob: (job) => {
        const id = `job-${Date.now()}`;
        const now = new Date().toISOString();
        const newJob: JobOpportunity = {
          ...job,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          jobs: [newJob, ...state.jobs],
        }));
      },

      updateJobStatus: (id, status) => {
        const now = new Date().toISOString();
        set((state) => ({
          jobs: state.jobs.map((job) => job.id === id ? { ...job, status, updatedAt: now } : job),
        }));
      },

      updateJob: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          jobs: state.jobs.map((job) => job.id === id ? { ...job, ...updates, updatedAt: now } : job),
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },

      logMockSession: (session) => {
        const newSession: MockInterviewLog = {
          ...session,
          id: `mock-${Date.now()}`,
        };
        set((state) => ({
          mockSessions: [newSession, ...state.mockSessions],
        }));
      },

      recordDiagnosticResult: (problemId, known, pattern, confidence) => {
        set((state) => ({
          dsaDiagnostic: {
            ...state.dsaDiagnostic,
            [problemId]: { known, pattern, confidence },
          },
        }));
      },

      batchRecordDiagnostic: (results) => {
        set((state) => ({
          dsaDiagnostic: {
            ...state.dsaDiagnostic,
            ...results,
          },
        }));
      },

      resetToDefaults: () => {
        set({
          profile: INITIAL_CAREER_PROFILE,
          skills: INITIAL_CAREER_SKILLS,
          roadmap: INITIAL_ROADMAP_PHASES,
          project: INITIAL_FLAGSHIP_PROJECT,
          evidence: INITIAL_EVIDENCE_ITEMS,
          jobs: INITIAL_JOB_OPPORTUNITIES,
          mockSessions: [],
          dsaDiagnostic: {},
        });
      },
    }),
    {
      name: 'career-os-career-storage',
      version: 1,
    }
  )
);
