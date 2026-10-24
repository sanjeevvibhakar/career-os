export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

export interface SkillMasteryDefinition {
  level: MasteryLevel;
  title: string;
  description: string;
  criteria: string;
}

export const MASTERY_LEVEL_DEFINITIONS: Record<MasteryLevel, SkillMasteryDefinition> = {
  1: {
    level: 1,
    title: 'Recognition',
    description: 'I understand the terminology and can explain the concept simply.',
    criteria: 'Can define key terms, identify where it fits in an architecture, and explain concepts without jargon.',
  },
  2: {
    level: 2,
    title: 'Guided Implementation',
    description: 'I can implement it using documentation or guided exercises.',
    criteria: 'Can build working code following official docs, boilerplate or step-by-step references.',
  },
  3: {
    level: 3,
    title: 'Independent Implementation',
    description: 'I can build a working solution without following a tutorial.',
    criteria: 'Can write clean, functional implementation from scratch under realistic time constraints.',
  },
  4: {
    level: 4,
    title: 'Engineering Competence',
    description: 'I can debug problems, test edge cases, identify trade-offs and improve reliability or performance.',
    criteria: 'Can write automated unit/integration tests, debug live failures, optimize query/compute, and handle edge cases.',
  },
  5: {
    level: 5,
    title: 'Advanced Application',
    description: 'I can design a solution, justify architectural choices, diagnose complex failures and explain the design to another engineer.',
    criteria: 'Can defend architectural trade-offs in system design, conduct code reviews, diagnose race conditions or JVM heap leaks, and mentor others.',
  },
};

export type SkillBranch = 
  | 'JAVA'
  | 'SPRING_BOOT'
  | 'SQL_DATABASES'
  | 'DSA'
  | 'CS_FUNDAMENTALS'
  | 'SOFTWARE_ENGINEERING'
  | 'SYSTEM_DESIGN'
  | 'PRODUCTION_ENGINEERING'
  | 'AI_APPLICATION_ENGINEERING'
  | 'WORKPLACE_LEARNING';

export type SkillPriorityTier = 1 | 2 | 3 | 4 | 0; // 0 for workplace

export interface CareerSkill {
  id: string;
  name: string;
  branch: SkillBranch;
  tier: SkillPriorityTier;
  subtopics: string[];
  learningProgressPct: number; // 0 - 100
  assessedProficiency: MasteryLevel; // 1 - 5
  interviewReadinessPct: number; // 0 - 100
  lastAssessedDate?: string;
  entryCriteria: string;
  interviewQuestions: string[];
  evidenceIds: string[];
  isBottleneck?: boolean;
}

export type MistakeCategory =
  | 'PATTERN_NOT_RECOGNIZED'
  | 'INCORRECT_ALGORITHM'
  | 'INCORRECT_COMPLEXITY'
  | 'EDGE_CASE_FAILURE'
  | 'IMPLEMENTATION_ERROR'
  | 'COULD_NOT_EXPLAIN'
  | 'TIME_MANAGEMENT';

export const MISTAKE_CATEGORY_LABELS: Record<MistakeCategory, { label: string; description: string }> = {
  PATTERN_NOT_RECOGNIZED: {
    label: 'Failed to Recognize Pattern',
    description: 'Did not map problem characteristics to standard patterns (e.g. Two Pointers, Monotonic Stack).',
  },
  INCORRECT_ALGORITHM: {
    label: 'Incorrect Algorithm',
    description: 'Chose a fundamentally flawed or suboptimal algorithmic approach.',
  },
  INCORRECT_COMPLEXITY: {
    label: 'Incorrect Complexity',
    description: 'Failed to meet time or space complexity constraints (e.g. O(N^2) instead of O(N log N)).',
  },
  EDGE_CASE_FAILURE: {
    label: 'Edge Case Failure',
    description: 'Crashed or returned wrong output on boundary values (empty input, duplicates, negatives, overflow).',
  },
  IMPLEMENTATION_ERROR: {
    label: 'Implementation Error / Bug',
    description: 'Algorithmic logic was correct, but off-by-one, typing, or syntax bugs prevented passing.',
  },
  COULD_NOT_EXPLAIN: {
    label: 'Could Not Explain Approach',
    description: 'Solved the code but stumbled when articulating invariants, state, or complexity to an interviewer.',
  },
  TIME_MANAGEMENT: {
    label: 'Time Management Issue',
    description: 'Took excessively long (> 35-40 min) on what should be a standard medium problem.',
  },
};

export type EvidenceType =
  | 'WORKPLACE_ACHIEVEMENT'
  | 'FEATURE_DESCRIPTION'
  | 'PROJECT_LINK'
  | 'GITHUB_COMMIT'
  | 'PULL_REQUEST'
  | 'ARCHITECTURE_DIAGRAM'
  | 'API_DOCUMENTATION'
  | 'TEST_RESULTS'
  | 'PERFORMANCE_BENCHMARK'
  | 'DEBUGGING_CASE_STUDY'
  | 'MOCK_EVALUATION'
  | 'TECHNICAL_EXPLANATION';

export interface CareerEvidenceItem {
  id: string;
  title: string;
  evidenceType: EvidenceType;
  demonstratedSkillIds: string[];
  context: string;
  actionTaken: string;
  measurableResult: string;
  relevantProject: string;
  verificationStatus: 'DRAFT' | 'VERIFIED' | 'PEER_REVIEWED';
  isPublic: boolean; // false for proprietary TCS work!
  linkOrRef?: string;
  createdAt: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseId: number;
  title: string;
  targetMonth: string; // e.g. "October–December 2026"
  description: string;
  concreteDeliverable: string;
  skillsDeveloped: string[];
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  completedDate?: string;
  evidenceId?: string;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  timeRange: string;
  goal: string;
  deliverable: string;
  milestones: RoadmapMilestone[];
  isCurrent: boolean;
}

export interface ProjectMilestoneItem {
  id: string;
  version: 'v1' | 'v2' | 'v3' | 'v4';
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  linkedSkillIds: string[];
  evidenceId?: string;
  testCoveragePct?: number;
}

export interface FlagshipProjectTracker {
  id: string;
  name: string;
  tagline: string;
  description: string;
  currentVersion: 'v1' | 'v2' | 'v3' | 'v4';
  repositoryUrl?: string;
  liveUrl?: string;
  architectureType: 'Modular Monolith (Spring Boot 3 + PostgreSQL)';
  versions: {
    version: 'v1' | 'v2' | 'v3' | 'v4';
    title: string;
    focus: string;
    deliverable: string;
    completed: boolean;
  }[];
  milestones: ProjectMilestoneItem[];
}

export type JobApplicationState = 
  | 'SAVED'
  | 'PREPARING'
  | 'APPLIED'
  | 'OA'
  | 'INTERVIEW'
  | 'HR_NEGOTIATION'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  officialJobUrl: string;
  location: string;
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  experienceRequiredYears: number;
  requiredSkills: string[];
  preferredSkills: string[];
  applicationDeadline?: string;
  status: JobApplicationState;
  referralStatus: 'NONE' | 'REQUESTED' | 'CONFIRMED';
  interviewRounds: {
    roundName: string;
    date?: string;
    notes?: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
  }[];
  compensation: {
    fixedLpa?: number;
    variableLpa?: number;
    bonusLpa?: number;
    equityLpa?: number;
    totalLpa?: number;
    source: 'USER_ENTERED' | 'RECRUITER_DISCLOSED' | 'PUBLIC_ESTIMATE';
  };
  notes: string;
  followUpActions: string[];
  createdAt: string;
  updatedAt: string;
}

export type InterviewDimension =
  | 'DSA'
  | 'JAVA'
  | 'SPRING_BOOT'
  | 'SQL_DBMS'
  | 'OS_NETWORKS'
  | 'BACKEND_ENGINEERING'
  | 'PROJECT_DEPTH'
  | 'LLD'
  | 'HLD'
  | 'TECHNICAL_COMMUNICATION'
  | 'BEHAVIORAL';

export interface InterviewDimensionScore {
  dimension: InterviewDimension;
  title: string;
  assessedLevel: MasteryLevel;
  scorePct: number; // 0 - 100
  confidenceRating: number; // 1 - 5 (based on volume of attempts, mocks, evidence)
  lastAssessmentDate?: string;
  nextImprovementTask: string;
  recurringMistakes: string[];
  missingEvidenceCount: number;
}

export interface MockInterviewLog {
  id: string;
  date: string;
  dimension: InterviewDimension;
  interviewerRole: string; // e.g. "Senior SDE-2 Mock / Peer"
  overallRating: number; // 1 - 10
  feedbackNotes: string;
  weaknessesNoted: string[];
  actionItemTasks: string[];
}

export interface CareerProfileSettings {
  name: string;
  currentCompany: string; // 'TCS'
  currentCtcLpa: number; // 7
  currentAssignmentRole: string; // 'React Native Frontend Training'
  officeTrainingSchedule: {
    startHour: number; // 11 (11 AM)
    endHour: number; // 20 (8 PM)
    officeDays: number[]; // 1,2,3,4,5 (Mon-Fri)
    activeMonthsRemaining: number; // 2
  };
  tcsBackendOpportunity: {
    isPossible: boolean;
    stack: string; // 'Java / Spring Boot'
    priorityBoost: boolean; // if true, prioritize production Java experience
  };
  targetCareer: {
    primaryIdentity: string; // 'Product-focused Software Engineer'
    targetRole: string; // 'Software Engineer / Java Backend Engineer / SDE-1'
    targetCtcMinLpa: number; // 25
    targetCtcMaxLpa: number; // 45
    targetDate: string; // '2027-06-01'
  };
  studyAvailability: {
    weekdayStudyMinutes: number; // 100 min total (45m DSA, 45m Java, 10m Comm)
    weekendStudyMinutes: number; // 300 min total
    minimumViableDayMinutes: number; // 30 min (for high-fatigue days)
  };
}

export interface IntelligenceRecommendation {
  id: string;
  taskTitle: string;
  skill: string;
  skillId: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estimatedDurationMin: number;
  reason: string;
  prerequisites: string[];
  successCriteria: string;
  relatedCareerObjective: string;
  evidenceToCapture: string;
  fallbackTask: {
    taskTitle: string;
    estimatedDurationMin: number;
    reason: string;
  };
  actionType: 'DSA' | 'BACKEND' | 'PROJECT' | 'REVISION' | 'SYSTEM_DESIGN' | 'INTERVIEW_PREP' | 'WORKPLACE';
  actionRoute?: string;
}
