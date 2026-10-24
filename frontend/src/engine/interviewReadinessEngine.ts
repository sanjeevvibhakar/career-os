import type { 
  CareerSkill, 
  InterviewDimension, 
  InterviewDimensionScore, 
  MockInterviewLog, 
  CareerEvidenceItem,
  MasteryLevel 
} from '../types/career';
import type { DsaAttempt } from '../stores/dsaStore';

export interface ReadinessInput {
  skills: CareerSkill[];
  attempts: DsaAttempt[];
  mocks: MockInterviewLog[];
  evidence: CareerEvidenceItem[];
}

export interface OverallInterviewReadiness {
  compositeScorePct: number; // 0 - 100
  readinessRating: 'INTERVIEW_READY' | 'COMPETITIVE_CANDIDATE' | 'IN_PROGRESS' | 'NEEDS_PREPARATION';
  dimensionScores: InterviewDimensionScore[];
  strongestDimensions: InterviewDimensionScore[];
  weakestDimensions: InterviewDimensionScore[];
  recommendedMockFrequency: 'ONCE_A_MONTH' | 'BI_WEEKLY' | 'WEEKLY' | 'INTENSIVE_TRI_WEEKLY';
}

const DIMENSION_CONFIG: Record<InterviewDimension, { title: string; skillIds: string[]; dsaTopicMatch?: boolean }> = {
  DSA: {
    title: 'Data Structures & Algorithms',
    skillIds: ['dsa-arrays-hashing', 'dsa-binary-search', 'dsa-trees-graphs', 'dsa-dp-backtracking'],
    dsaTopicMatch: true,
  },
  JAVA: {
    title: 'Java Core, Concurrency & JVM',
    skillIds: ['java-syntax-core', 'java-collections-generics', 'java-streams-lambdas', 'java-concurrency', 'java-jvm-memory-gc'],
  },
  SPRING_BOOT: {
    title: 'Spring Boot 3, IoC & Security',
    skillIds: ['spring-di-ioc', 'spring-rest-apis', 'spring-jpa-hibernate', 'spring-security', 'spring-transactions-testing'],
  },
  SQL_DBMS: {
    title: 'PostgreSQL, Query Tuning & Transactions',
    skillIds: ['sql-joins-indexing', 'sql-indexing-transactions'],
  },
  OS_NETWORKS: {
    title: 'Operating Systems & Computer Networks',
    skillIds: ['cs-os-networks'],
  },
  BACKEND_ENGINEERING: {
    title: 'Backend Engineering & Testing',
    skillIds: ['spring-transactions-testing', 'prod-docker-cicd'],
  },
  PROJECT_DEPTH: {
    title: 'Project Depth & Production Quality',
    skillIds: ['spring-rest-apis', 'spring-jpa-hibernate', 'prod-docker-cicd'],
  },
  LLD: {
    title: 'Low-Level Design & Clean Architecture',
    skillIds: ['cs-oop-lld'],
  },
  HLD: {
    title: 'High-Level System Design & Scaling',
    skillIds: ['system-design-hld'],
  },
  TECHNICAL_COMMUNICATION: {
    title: 'Technical Communication & Articulation',
    skillIds: [],
  },
  BEHAVIORAL: {
    title: 'Behavioral & Leadership Principles',
    skillIds: [],
  },
};

export function computeInterviewReadiness(input: ReadinessInput): OverallInterviewReadiness {
  const { skills, attempts, mocks, evidence } = input;

  const dimensionScores: InterviewDimensionScore[] = (Object.keys(DIMENSION_CONFIG) as InterviewDimension[]).map((dim) => {
    const config = DIMENSION_CONFIG[dim];
    const relatedSkills = skills.filter(s => config.skillIds.includes(s.id));
    const relatedMocks = mocks.filter(m => m.dimension === dim);
    const relatedEvidence = evidence.filter(e => e.demonstratedSkillIds.some(id => config.skillIds.includes(id)));

    // Calculate base score from skills
    let baseScore = 50;
    let assessedLevel: MasteryLevel = 2;

    if (relatedSkills.length > 0) {
      const avgProficiency = relatedSkills.reduce((sum, s) => sum + s.assessedProficiency, 0) / relatedSkills.length;
      const avgReadiness = relatedSkills.reduce((sum, s) => sum + s.interviewReadinessPct, 0) / relatedSkills.length;
      assessedLevel = Math.min(5, Math.max(1, Math.round(avgProficiency))) as MasteryLevel;
      baseScore = avgReadiness;
    }

    // Special modifier for DSA based on real problem attempts
    if (dim === 'DSA' && attempts.length > 0) {
      const independentSolves = attempts.filter(a => a.solvedIndependently).length;
      const independentRate = (independentSolves / attempts.length) * 100;
      const avgConfidence = (attempts.reduce((sum, a) => sum + a.confidence, 0) / attempts.length) * 20; // 0-100
      const dsaCalculated = Math.round((independentRate * 0.6) + (avgConfidence * 0.4));
      baseScore = Math.round((baseScore * 0.4) + (dsaCalculated * 0.6));
    }

    // Modify with Mock Interview feedback if any exist
    if (relatedMocks.length > 0) {
      const avgMockScore = (relatedMocks.reduce((sum, m) => sum + m.overallRating, 0) / relatedMocks.length) * 10;
      baseScore = Math.round((baseScore * 0.6) + (avgMockScore * 0.4));
    }

    // Confidence rating (1-5) based on volume of evidence and attempts
    let confidenceRating = 2;
    const evidenceVolume = relatedEvidence.length;
    if (evidenceVolume >= 3 || relatedMocks.length >= 2 || (dim === 'DSA' && attempts.length >= 30)) {
      confidenceRating = 5;
    } else if (evidenceVolume >= 2 || relatedMocks.length >= 1 || (dim === 'DSA' && attempts.length >= 15)) {
      confidenceRating = 4;
    } else if (evidenceVolume >= 1 || (dim === 'DSA' && attempts.length >= 5)) {
      confidenceRating = 3;
    }

    // Find recurring mistakes noted in mocks
    const recurringMistakes: string[] = [];
    relatedMocks.forEach(m => {
      recurringMistakes.push(...m.weaknessesNoted);
    });

    // Next improvement task
    let nextImprovementTask = `Complete Level ${Math.min(5, assessedLevel + 1)} assessment task.`;
    if (relatedEvidence.length === 0) {
      nextImprovementTask = `Upload at least 1 verified code artifact to Evidence Vault.`;
    } else if (recurringMistakes.length > 0) {
      nextImprovementTask = `Practice targeted drill addressing: "${recurringMistakes[0]}".`;
    }

    const missingEvidenceCount = Math.max(0, 2 - relatedEvidence.length);

    return {
      dimension: dim,
      title: config.title,
      assessedLevel,
      scorePct: Math.min(100, Math.max(0, Math.round(baseScore))),
      confidenceRating,
      lastAssessmentDate: relatedSkills[0]?.lastAssessedDate || relatedMocks[0]?.date || undefined,
      nextImprovementTask,
      recurringMistakes: Array.from(new Set(recurringMistakes)).slice(0, 3),
      missingEvidenceCount,
    };
  });

  // Calculate composite weighted readiness score
  // Core Tier 1 (Java, Spring, SQL, DSA) holds highest weight (65%)
  const weights: Record<InterviewDimension, number> = {
    DSA: 0.20,
    JAVA: 0.15,
    SPRING_BOOT: 0.15,
    SQL_DBMS: 0.10,
    OS_NETWORKS: 0.08,
    BACKEND_ENGINEERING: 0.08,
    PROJECT_DEPTH: 0.08,
    LLD: 0.06,
    HLD: 0.04,
    TECHNICAL_COMMUNICATION: 0.03,
    BEHAVIORAL: 0.03,
  };

  const compositeScore = dimensionScores.reduce((sum, item) => {
    return sum + (item.scorePct * (weights[item.dimension] || 0.05));
  }, 0);

  const compositeScorePct = Math.min(100, Math.round(compositeScore));

  let readinessRating: OverallInterviewReadiness['readinessRating'] = 'NEEDS_PREPARATION';
  if (compositeScorePct >= 80) readinessRating = 'INTERVIEW_READY';
  else if (compositeScorePct >= 68) readinessRating = 'COMPETITIVE_CANDIDATE';
  else if (compositeScorePct >= 50) readinessRating = 'IN_PROGRESS';

  const sorted = [...dimensionScores].sort((a, b) => b.scorePct - a.scorePct);
  const strongestDimensions = sorted.slice(0, 3);
  const weakestDimensions = [...dimensionScores].sort((a, b) => a.scorePct - b.scorePct).slice(0, 3);

  let recommendedMockFrequency: OverallInterviewReadiness['recommendedMockFrequency'] = 'BI_WEEKLY';
  if (compositeScorePct >= 75) recommendedMockFrequency = 'WEEKLY';
  else if (compositeScorePct < 50) recommendedMockFrequency = 'ONCE_A_MONTH';

  return {
    compositeScorePct,
    readinessRating,
    dimensionScores,
    strongestDimensions,
    weakestDimensions,
    recommendedMockFrequency,
  };
}
