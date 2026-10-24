import type { 
  CareerSkill, 
  FlagshipProjectTracker, 
  CareerEvidenceItem, 
  JobOpportunity, 
  MockInterviewLog 
} from '../types/career';
import type { DsaAttempt, DsaRevision } from '../stores/dsaStore';

export interface WeeklyReportInput {
  skills: CareerSkill[];
  attempts: DsaAttempt[];
  revisions: DsaRevision[];
  project: FlagshipProjectTracker;
  evidence: CareerEvidenceItem[];
  jobs: JobOpportunity[];
  mocks: MockInterviewLog[];
  studyMinutesThisWeek?: number;
  averageFatigueRating?: number; // 1-5
}

export interface GeneratedWeeklyReport {
  weekIdentifier: string;
  generatedDate: string;
  progressSummary: {
    dsaSolvedIndependently: number;
    totalDsaAttempted: number;
    revisionsCompleted: number;
    topicsAdvanced: string[];
    projectMilestonesCompleted: string[];
    mockInterviewsLogged: number;
    activeApplicationsCount: number;
    newEvidenceItemsCount: number;
  };
  bottlenecks: {
    id: string;
    area: string;
    severity: 'HIGH' | 'MEDIUM';
    evidenceBasedIssue: string;
    concreteRemedy: string;
  }[];
  nextWeekPlan: {
    primaryTechnicalFocus: string;
    secondaryTechnicalFocus: string;
    dsaPriorities: string[];
    concreteProjectOutcome: string;
    interviewCommunicationExercise: string;
    estimatedTotalMinutes: number;
  };
  sustainability: {
    studyMinutesRecorded: number;
    averageFatigueRating: number;
    workloadEvaluation: 'BALANCED' | 'ELEVATED' | 'HIGH_RECOVERY_REQUIRED';
    advice: string;
  };
}

export function generateWeeklyIntelligenceReport(input: WeeklyReportInput): GeneratedWeeklyReport {
  const {
    skills,
    attempts,
    revisions,
    project,
    evidence,
    jobs,
    mocks,
    studyMinutesThisWeek = 420, // 7 hours baseline default
    averageFatigueRating = 2.5,
  } = input;

  const now = new Date();
  const weekNumber = Math.ceil(now.getDate() / 7);
  const weekIdentifier = `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
  const generatedDate = now.toISOString().split('T')[0];

  // 1. Calculate Progress
  const dsaSolvedIndependently = attempts.filter(a => a.solvedIndependently).length;
  const revisionsCompleted = revisions.filter(r => r.status === 'COMPLETED').length;

  const topicsAdvanced = skills
    .filter(s => s.learningProgressPct > 50)
    .map(s => s.name)
    .slice(0, 4);

  const projectMilestonesCompleted = project.milestones
    .filter(m => m.status === 'DONE')
    .map(m => m.title);

  const activeApplicationsCount = jobs.filter(j => j.status !== 'REJECTED' && j.status !== 'WITHDRAWN').length;

  // 2. Derive Real Bottlenecks from Data
  const bottlenecks: GeneratedWeeklyReport['bottlenecks'] = [];

  // Check Spring Security & JPA Level
  const springSecurity = skills.find(s => s.id === 'spring-security');
  if (springSecurity && springSecurity.assessedProficiency < 3) {
    bottlenecks.push({
      id: 'bn-spring-sec',
      area: 'Spring Security & Authentication',
      severity: 'HIGH',
      evidenceBasedIssue: 'Spring Security filter chain is understood conceptually (Level 2), but no independent implementation or unit tests exist in codebase.',
      concreteRemedy: 'Build a standalone stateless JWT authentication filter with Refresh Token rotation and JUnit sliced tests.',
    });
  }

  // Check JPA / Database Testing
  const jpaTesting = skills.find(s => s.id === 'spring-transactions-testing');
  if (jpaTesting && jpaTesting.evidenceIds.length === 0) {
    bottlenecks.push({
      id: 'bn-testing-gap',
      area: 'Automated Testing & Testcontainers',
      severity: 'HIGH',
      evidenceBasedIssue: 'No automated integration tests exist verifying PostgreSQL transaction rollback or N+1 query elimination.',
      concreteRemedy: 'Implement @DataJpaTest and configure a Testcontainers PostgreSQL container for repository integration tests.',
    });
  }

  // Check DSA Timed Independence
  if (attempts.length > 0) {
    const independentRate = (dsaSolvedIndependently / attempts.length) * 100;
    if (independentRate < 70) {
      bottlenecks.push({
        id: 'bn-dsa-hints',
        area: 'DSA Independence Under Timed Conditions',
        severity: 'MEDIUM',
        evidenceBasedIssue: `Independent solve rate is currently ${Math.round(independentRate)}%. Reliance on hints during initial struggle delays interview readiness.`,
        concreteRemedy: 'Implement the strict 20-minute struggle rule: do not open hints or discussions until 20 minutes of active dry-running on paper.',
      });
    }
  }

  // Fallback bottleneck if empty
  if (bottlenecks.length === 0) {
    bottlenecks.push({
      id: 'bn-evidence-vault',
      area: 'Portfolio Evidence Density',
      severity: 'MEDIUM',
      evidenceBasedIssue: 'Need more tangible proof items (architecture diagrams, benchmarks) linking code to assessed skills.',
      concreteRemedy: 'Export an OpenAPI specification and benchmark query execution times with EXPLAIN ANALYZE for the Evidence Vault.',
    });
  }

  // 3. Formulate Next-Week Plan
  const activeMilestone = project.milestones.find(m => m.status === 'IN_PROGRESS') || project.milestones.find(m => m.status === 'TODO');
  const primaryMilestoneTitle = activeMilestone ? activeMilestone.title : 'Spring Boot REST Controller & Exception Architecture';

  const nextWeekPlan: GeneratedWeeklyReport['nextWeekPlan'] = {
    primaryTechnicalFocus: 'Java 21 Virtual Threads & Spring Security FilterChain',
    secondaryTechnicalFocus: 'PostgreSQL Composite B-Tree Indexing & EXPLAIN ANALYZE',
    dsaPriorities: ['Binary Search on Answer Space', 'Tree DFS Recursive Invariants'],
    concreteProjectOutcome: primaryMilestoneTitle,
    interviewCommunicationExercise: '3-minute verbal walkthrough of volatile happens-before memory visibility without hesitation.',
    estimatedTotalMinutes: 480, // ~8 hours across 7 days
  };

  // 4. Evaluate Sustainability
  let workloadEvaluation: GeneratedWeeklyReport['sustainability']['workloadEvaluation'] = 'BALANCED';
  let advice = 'Your weekly study rhythm is sustainable alongside your full-time TCS office schedule. Keep protecting 7-8 hours of sleep.';

  if (averageFatigueRating >= 4.0) {
    workloadEvaluation = 'HIGH_RECOVERY_REQUIRED';
    advice = 'Fatigue indicators are elevated. Switch to Minimum Viable Days (20-30 min revision only) for the next 48 hours to prevent cognitive burnout.';
  } else if (averageFatigueRating >= 3.0) {
    workloadEvaluation = 'ELEVATED';
    advice = 'Workload is moderately demanding. Prioritize weekend rest and ensure workouts/sleep are not sacrificed for extra study sessions.';
  }

  return {
    weekIdentifier,
    generatedDate,
    progressSummary: {
      dsaSolvedIndependently,
      totalDsaAttempted: attempts.length,
      revisionsCompleted,
      topicsAdvanced,
      projectMilestonesCompleted,
      mockInterviewsLogged: mocks.length,
      activeApplicationsCount,
      newEvidenceItemsCount: evidence.length,
    },
    bottlenecks: bottlenecks.slice(0, 3),
    nextWeekPlan,
    sustainability: {
      studyMinutesRecorded: studyMinutesThisWeek,
      averageFatigueRating,
      workloadEvaluation,
      advice,
    },
  };
}
