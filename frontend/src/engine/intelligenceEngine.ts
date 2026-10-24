import type { 
  CareerProfileSettings, 
  CareerSkill, 
  RoadmapPhase, 
  FlagshipProjectTracker, 
  IntelligenceRecommendation,
  MistakeCategory,
  MasteryLevel 
} from '../types/career';
import type { DsaRevision } from '../stores/dsaStore';

export interface IntelligenceInput {
  profile: CareerProfileSettings;
  skills: CareerSkill[];
  roadmap: RoadmapPhase[];
  project: FlagshipProjectTracker;
  dueRevisions: Array<{ id: string; problemId: number; problemName: string; pattern: string; difficulty: string }>;
  weakPatterns: Array<{ pattern: string; topicName: string; avgConfidence: number }>;
  recurringMistakes: Array<{ category: MistakeCategory; count: number }>;
  currentHour?: number; // 0-23
  isWeekend?: boolean;
  fatigueLevel?: number; // 1 (fresh) to 5 (exhausted)
  targetRoleId?: string;
}

export interface EngineResult {
  currentContext: {
    isOfficeHours: boolean;
    availableSessionMinutes: number;
    circadianPhase: 'EARLY_MORNING_DEEP_WORK' | 'OFFICE_TRAINING' | 'EVENING_DEEP_WORK' | 'NIGHT_RECALL_REST' | 'WEEKEND_PROJECT_BLOCK';
    contextMessage: string;
  };
  primaryRecommendation: IntelligenceRecommendation;
  alternativeRecommendations: IntelligenceRecommendation[];
  detectedBottlenecks: {
    skillId: string;
    skillName: string;
    reason: string;
    severity: 'HIGH' | 'MEDIUM';
    actionSuggested: string;
  }[];
}

export function computeIntelligenceRecommendations(input: IntelligenceInput): EngineResult {
  const {
    profile,
    skills,
    roadmap,
    project,
    dueRevisions,
    weakPatterns,
    recurringMistakes,
    fatigueLevel = 2,
  } = input;

  const now = new Date();
  const currentHour = input.currentHour !== undefined ? input.currentHour : now.getHours();
  const isWeekend = input.isWeekend !== undefined ? input.isWeekend : (now.getDay() === 0 || now.getDay() === 6);

  // Office hours check (default 11 AM - 8 PM weekdays)
  const isOfficeHours = !isWeekend && (currentHour >= profile.officeTrainingSchedule.startHour && currentHour < profile.officeTrainingSchedule.endHour);

  // Determine Circadian Phase & Session Budget
  let circadianPhase: EngineResult['currentContext']['circadianPhase'];
  let availableSessionMinutes = 45;
  let contextMessage = '';

  if (isWeekend) {
    circadianPhase = 'WEEKEND_PROJECT_BLOCK';
    availableSessionMinutes = fatigueLevel >= 4 ? 60 : 120;
    contextMessage = 'Weekend Focus Block: Dedicated to flagship project engineering, timed mock problem-solving, and architecture design.';
  } else if (isOfficeHours) {
    circadianPhase = 'OFFICE_TRAINING';
    availableSessionMinutes = 30;
    contextMessage = `Office Hours (${profile.officeTrainingSchedule.startHour}:00 - ${profile.officeTrainingSchedule.endHour}:00): React Native assignment training. Independent study paused to protect job performance.`;
  } else if (currentHour >= 5 && currentHour < profile.officeTrainingSchedule.startHour) {
    circadianPhase = 'EARLY_MORNING_DEEP_WORK';
    availableSessionMinutes = fatigueLevel >= 4 ? 30 : 60;
    contextMessage = 'Peak Prefrontal Energy: Optimal morning window for DSA problem-solving and rigorous Java concurrency fundamentals.';
  } else if (currentHour >= profile.officeTrainingSchedule.endHour && currentHour < 22) {
    circadianPhase = 'EVENING_DEEP_WORK';
    availableSessionMinutes = fatigueLevel >= 4 ? 30 : 60;
    contextMessage = 'Evening Engineering Block: Focus on Spring Boot API milestones, PostgreSQL optimization, and project architecture.';
  } else {
    circadianPhase = 'NIGHT_RECALL_REST';
    availableSessionMinutes = 20;
    contextMessage = 'Night Wind-Down: Limit to spaced repetition flashcard review or technical vocalization. Sleep and recovery are mandatory.';
  }

  // Adjust for high fatigue
  if (fatigueLevel >= 4) {
    availableSessionMinutes = Math.min(availableSessionMinutes, profile.studyAvailability.minimumViableDayMinutes);
  }

  // 1. Detect active bottlenecks across skills
  const detectedBottlenecks: EngineResult['detectedBottlenecks'] = [];
  skills.forEach((s) => {
    if (s.tier === 1 && s.assessedProficiency < 3) {
      detectedBottlenecks.push({
        skillId: s.id,
        skillName: s.name,
        reason: `Core Tier-1 Backend skill assessed below Level 3 (Independent Implementation).`,
        severity: 'HIGH',
        actionSuggested: `Build an independent code milestone demonstrating ${s.name} without reference guides.`,
      });
    } else if (s.tier === 1 && s.evidenceIds.length === 0) {
      detectedBottlenecks.push({
        skillId: s.id,
        skillName: s.name,
        reason: `No tangible code proof or verified artifacts saved in Evidence Vault for ${s.name}.`,
        severity: 'MEDIUM',
        actionSuggested: `Document an architecture diagram, test suite, or GitHub commit proving capability.`,
      });
    } else if (s.isBottleneck) {
      detectedBottlenecks.push({
        skillId: s.id,
        skillName: s.name,
        reason: `Manually marked as progress bottleneck in career roadmap.`,
        severity: 'HIGH',
        actionSuggested: `Schedule a 45-minute focused session to resolve blockers on ${s.name}.`,
      });
    }
  });

  // Check for DSA weak patterns
  if (weakPatterns.length > 0) {
    detectedBottlenecks.push({
      skillId: 'dsa-weak-pattern',
      skillName: `DSA Pattern: ${weakPatterns[0].pattern}`,
      reason: `Historical confidence is low (${weakPatterns[0].avgConfidence}/5) or independent solve rate < 60%.`,
      severity: 'HIGH',
      actionSuggested: `Solve 2 targeted medium problems on ${weakPatterns[0].pattern} under timed constraints.`,
    });
  }

  // Check recurring mistakes
  if (recurringMistakes.length > 0 && recurringMistakes[0].count >= 2) {
    detectedBottlenecks.push({
      skillId: 'dsa-mistake-pattern',
      skillName: `Recurring Error: ${recurringMistakes[0].category.replace(/_/g, ' ')}`,
      reason: `Encountered ${recurringMistakes[0].count} times in recent attempts.`,
      severity: 'MEDIUM',
      actionSuggested: `Verbalize invariants and write test edge cases before submitting code.`,
    });
  }

  // 2. Generate Candidate Recommendations
  const candidates: Array<{
    recommendation: IntelligenceRecommendation;
    score: number;
  }> = [];

  // Case A: Office hours -> Workplace Learning or Brief Break
  if (isOfficeHours) {
    const workplaceRec: IntelligenceRecommendation = {
      id: 'rec-workplace-training',
      taskTitle: 'TCS Workplace: React Native Assignment Execution',
      skill: 'React Native & Mobile Frontend (Workplace)',
      skillId: 'workplace-react-native',
      priority: 'MEDIUM',
      estimatedDurationMin: 45,
      reason: 'Office training hours are dedicated to your TCS assignment. High professional standing protects mental energy.',
      prerequisites: ['Office environment active'],
      successCriteria: 'Complete designated client training ticket and log clean non-confidential work summary.',
      relatedCareerObjective: 'Maintain strong employment standing while reserving study time for morning/evening blocks.',
      evidenceToCapture: 'Log non-confidential ticket description in Workplace Learning evidence category.',
      fallbackTask: {
        taskTitle: '10-Minute Workplace Code Review or Break',
        estimatedDurationMin: 10,
        reason: 'Rest eyes and hydrate between training modules.',
      },
      actionType: 'WORKPLACE',
      actionRoute: '/profile',
    };
    candidates.push({ recommendation: workplaceRec, score: 100 });
  } else {
    // Independent study hours: Score based on user's priority tiers

    // 1. Spaced Repetition Due Revisions (Highest urgency to prevent forgetting)
    if (dueRevisions.length > 0) {
      const topDue = dueRevisions[0];
      const revRec: IntelligenceRecommendation = {
        id: `rec-rev-${topDue.id}`,
        taskTitle: `Spaced Revision: Solve "${topDue.problemName}" (${topDue.difficulty})`,
        skill: `DSA: ${topDue.pattern}`,
        skillId: 'dsa-arrays-hashing',
        priority: 'CRITICAL',
        estimatedDurationMin: 25,
        reason: `Optimal retention window reached for ${topDue.problemName} (${topDue.pattern}). Re-solving now strengthens neural retrieval.`,
        prerequisites: ['Previous attempt logged'],
        successCriteria: 'Solve without editorial hints in under 25 minutes; confirm optimal time/space complexity.',
        relatedCareerObjective: 'Ensure zero knowledge decay across solved DSA patterns ahead of product SDE interviews.',
        evidenceToCapture: 'Log re-solve confidence and note whether approach was recalled immediately.',
        fallbackTask: {
          taskTitle: '5-Minute Approach & Pattern Mental Walkthrough',
          estimatedDurationMin: 10,
          reason: 'If low on time, write pseudocode on paper and verbalize Big-O complexity.',
        },
        actionType: 'REVISION',
        actionRoute: '/dsa',
      };
      candidates.push({ recommendation: revRec, score: 95 + (topDue.difficulty === 'HARD' ? 3 : 0) });
    }

    // 2. High-Priority Weak DSA Pattern Practice
    if (weakPatterns.length > 0) {
      const weak = weakPatterns[0];
      const weakRec: IntelligenceRecommendation = {
        id: `rec-weak-${weak.pattern.replace(/\s+/g, '-').toLowerCase()}`,
        taskTitle: `Targeted Drill: Master ${weak.pattern} Problems`,
        skill: `DSA: ${weak.pattern}`,
        skillId: 'dsa-trees-graphs',
        priority: 'HIGH',
        estimatedDurationMin: 40,
        reason: `Your independent solve rate or confidence for ${weak.pattern} is below target (${weak.avgConfidence}/5). Closing pattern gaps is essential for Tier-1 OAs.`,
        prerequisites: ['Understanding of core data structure operations'],
        successCriteria: 'Solve 1 medium problem independently; identify pattern triggers within first 3 minutes.',
        relatedCareerObjective: 'Eliminate failure modes on non-linear patterns targeting ₹25–45 LPA rounds.',
        evidenceToCapture: 'Record time taken, mistake category if any, and key invariant learned.',
        fallbackTask: {
          taskTitle: 'Deconstruct 1 Solved Editorial for Pattern Invariants',
          estimatedDurationMin: 15,
          reason: 'Read and diagram the optimal solution without looking at implementation code.',
        },
        actionType: 'DSA',
        actionRoute: '/dsa',
      };
      candidates.push({ recommendation: weakRec, score: 88 });
    }

    // 3. Current Backend Roadmap Milestone Task
    const currentPhase = roadmap.find(p => p.isCurrent) || roadmap[0];
    const currentMilestone = currentPhase.milestones.find(m => m.status === 'IN_PROGRESS') || currentPhase.milestones.find(m => m.status === 'TODO');

    if (currentMilestone) {
      const backendRec: IntelligenceRecommendation = {
        id: `rec-milestone-${currentMilestone.id}`,
        taskTitle: `Backend Milestone: ${currentMilestone.title}`,
        skill: 'Spring Boot & Relational Databases',
        skillId: currentMilestone.skillsDeveloped[0] || 'spring-rest-apis',
        priority: 'HIGH',
        estimatedDurationMin: Math.min(availableSessionMinutes, 50),
        reason: `Advances ${currentPhase.title}. Deliverable: ${currentMilestone.concreteDeliverable}`,
        prerequisites: ['Java 21 environment setup', 'PostgreSQL running locally or in Docker'],
        successCriteria: currentMilestone.concreteDeliverable,
        relatedCareerObjective: 'Establish demonstrable Java backend engineering capability for product company evaluations.',
        evidenceToCapture: 'Save Git commit hash, API documentation snippet, or unit test run in Evidence Vault.',
        fallbackTask: {
          taskTitle: 'Write Test Case & DTO Validation Schema',
          estimatedDurationMin: 20,
          reason: 'Define controller input/output DTOs and unit tests before full implementation.',
        },
        actionType: 'BACKEND',
        actionRoute: '/sprint',
      };
      candidates.push({ recommendation: backendRec, score: 90 });
    }

    // 4. Flagship Project Milestone (Especially on Weekends)
    const activeProjectMilestone = project.milestones.find(m => m.status === 'IN_PROGRESS') || project.milestones.find(m => m.status === 'TODO');
    if (activeProjectMilestone) {
      const projScore = isWeekend ? 94 : 82;
      const projRec: IntelligenceRecommendation = {
        id: `rec-proj-${activeProjectMilestone.id}`,
        taskTitle: `Flagship Project: ${activeProjectMilestone.title}`,
        skill: 'Production Engineering & Modular Monolith',
        skillId: activeProjectMilestone.linkedSkillIds[0] || 'spring-di-ioc',
        priority: isWeekend ? 'CRITICAL' : 'HIGH',
        estimatedDurationMin: isWeekend ? 90 : 45,
        reason: `${project.name} is your primary portfolio artifact proving Java/Spring Boot competence to hiring managers.`,
        prerequisites: ['Career OS backend repository branch ready'],
        successCriteria: activeProjectMilestone.description,
        relatedCareerObjective: 'Provide concrete public proof of backend design and testability for ₹25–45 LPA positions.',
        evidenceToCapture: 'Add commit link, architecture diagram, or benchmark to Career Evidence Vault.',
        fallbackTask: {
          taskTitle: 'Document API Endpoints and Architecture Trade-offs',
          estimatedDurationMin: 25,
          reason: 'Write README architecture notes and OpenAPI documentation.',
        },
        actionType: 'PROJECT',
        actionRoute: '/system-design',
      };
      candidates.push({ recommendation: projRec, score: projScore });
    }

    // 5. Technical Recall & Speaking Practice (Always high score in late evening)
    if (circadianPhase === 'NIGHT_RECALL_REST' || currentHour >= 21) {
      const recallRec: IntelligenceRecommendation = {
        id: 'rec-tech-recall',
        taskTitle: '10-Minute Technical Verbalization: Java Concurrency & JMM',
        skill: 'Technical Communication & Java Fundamentals',
        skillId: 'java-concurrency',
        priority: 'MEDIUM',
        estimatedDurationMin: 10,
        reason: 'Explaining technical concepts fluently out loud bridges the gap between coding ability and passing technical interview screens.',
        prerequisites: ['None'],
        successCriteria: 'Speak for 3 minutes without filler words explaining volatile, happens-before, and Virtual Threads.',
        relatedCareerObjective: 'Ace phone screens and senior engineer design discussions with precise technical communication.',
        evidenceToCapture: 'Record a speech log in Speech Studio with words per minute and rating.',
        fallbackTask: {
          taskTitle: 'Read and Rephrase 3 Flashcards',
          estimatedDurationMin: 5,
          reason: 'Review pocket flashcards on core JVM memory.',
        },
        actionType: 'INTERVIEW_PREP',
        actionRoute: '/communication',
      };
      candidates.push({ recommendation: recallRec, score: 92 });
    }
  }

  // Fallback if candidates empty
  if (candidates.length === 0) {
    const defaultRec: IntelligenceRecommendation = {
      id: 'rec-default-dsa',
      taskTitle: 'Diagnostic DSA Practice: Linear Data Structures',
      skill: 'Data Structures & Algorithms',
      skillId: 'dsa-arrays-hashing',
      priority: 'MEDIUM',
      estimatedDurationMin: 30,
      reason: 'Maintain daily algorithmic problem-solving rhythm.',
      prerequisites: ['None'],
      successCriteria: 'Solve 1 medium problem independently with optimal Big-O analysis.',
      relatedCareerObjective: 'Progress toward interview readiness for May–June 2027 switch.',
      evidenceToCapture: 'Log attempt in DSA Tracker.',
      fallbackTask: {
        taskTitle: '15-Minute Flashcard Review',
        estimatedDurationMin: 15,
        reason: 'Review core concepts in Flashcards tab.',
      },
      actionType: 'DSA',
      actionRoute: '/dsa',
    };
    candidates.push({ recommendation: defaultRec, score: 70 });
  }

  // Sort candidates by score descending
  candidates.sort((a, b) => b.score - a.score);

  const primaryRecommendation = candidates[0].recommendation;
  const alternativeRecommendations = candidates.slice(1, 4).map(c => c.recommendation);

  return {
    currentContext: {
      isOfficeHours,
      availableSessionMinutes,
      circadianPhase,
      contextMessage,
    },
    primaryRecommendation,
    alternativeRecommendations,
    detectedBottlenecks,
  };
}
