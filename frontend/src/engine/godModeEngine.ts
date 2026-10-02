import { CURRICULUM_LEVELS, type CurriculumLevel, getLevelForProblem } from '../data/curriculumData';
import { DSA_PROBLEMS, type DsaProblemSeed } from '../data/dsaProblems';

export interface GodModeState {
  currentLevel: number;
  currentLevelData: CurriculumLevel;
  levelProgressPct: number;
  totalProblemsSolved: number;
  readinessScore: number; // 0-100
  totalXp: number;
  playerRank: string;
  nextRecommendedProblem: DsaProblemSeed | null;
  rightNowRecommendation: {
    phase: string;
    actionTitle: string;
    actionDescription: string;
    scienceReason: string;
    whyAtWork: string;
    whyInInterview: string;
    actionType: 'DSA' | 'TECH' | 'SPEECH' | 'WORK' | 'SLEEP' | 'REVISION';
    targetRoute?: string;
    targetProblemId?: number;
  };
}

export function computeGodMode(params: {
  attempts: Array<{ problemId: number; solvedIndependently: boolean; confidence: number; attemptedAt: string }>;
  revisions: Array<{ status: string }>;
  sprintLogs: Array<{ actualMinutes: number }>;
  commCount: number;
  gymCount: number;
}): GodModeState {
  const { attempts, revisions, sprintLogs, commCount, gymCount } = params;

  // Set of unique solved problem IDs
  const solvedProblemIds = new Set(attempts.map(a => a.problemId));
  const totalProblemsSolved = solvedProblemIds.size;

  // Determine Current Curriculum Level (0 to 5)
  let currentLevel = 0;
  for (let lvl = 0; lvl <= 5; lvl++) {
    const levelData = CURRICULUM_LEVELS[lvl];
    const solvedInLevel = levelData.recommendedProblemIds.filter(id => solvedProblemIds.has(id)).length;
    const threshold = Math.max(1, Math.floor(levelData.recommendedProblemIds.length * 0.6)); // 60% to move to next
    
    if (solvedInLevel >= threshold && lvl < 5) {
      currentLevel = lvl + 1;
    } else {
      currentLevel = lvl;
      break;
    }
  }

  const currentLevelData = CURRICULUM_LEVELS[currentLevel];
  const solvedInCurrentLevel = currentLevelData.recommendedProblemIds.filter(id => solvedProblemIds.has(id)).length;
  const levelProgressPct = Math.min(100, Math.round((solvedInCurrentLevel / currentLevelData.recommendedProblemIds.length) * 100));

  // Endowed Progress Effect (Nunes & Drèze, 2006): Start with 18% baseline credit for real-world programming fundamentals
  const baseEndowedScore = 18;
  const dsaPoints = Math.min(42, (totalProblemsSolved / 60) * 42);
  const completedRevisions = revisions.filter(r => r.status === 'COMPLETED').length;
  const revisionPoints = Math.min(15, (completedRevisions / 15) * 15);
  const techPoints = Math.min(12, (sprintLogs.length / 10) * 12);
  const commPoints = Math.min(8, (commCount / 6) * 8);
  const gymPoints = Math.min(5, (gymCount / 8) * 5);

  const readinessScore = Math.min(100, Math.round(baseEndowedScore + dsaPoints + revisionPoints + techPoints + commPoints + gymPoints));

  // XP & Rank Calculation
  const totalXp = 250 + (totalProblemsSolved * 100) + (completedRevisions * 40) + (commCount * 75) + (gymCount * 50) + (sprintLogs.length * 40);
  
  let playerRank = 'Novice Software Engineer (Lv 1)';
  if (totalXp >= 3500) playerRank = 'Tier-1 Switch Ready Architect (Lv 10)';
  else if (totalXp >= 2500) playerRank = 'Senior Interview Contender (Lv 8)';
  else if (totalXp >= 1800) playerRank = 'Advanced Pattern Master (Lv 6)';
  else if (totalXp >= 1200) playerRank = 'Non-Linear Systems Specialist (Lv 4)';
  else if (totalXp >= 600) playerRank = 'Linear Patterns Apprentice (Lv 2)';

  // Find next recommended problem in the current level
  let nextRecommendedProblem: DsaProblemSeed | null = null;
  for (const probId of currentLevelData.recommendedProblemIds) {
    if (!solvedProblemIds.has(probId)) {
      nextRecommendedProblem = DSA_PROBLEMS.find(p => p.id === probId) || null;
      if (nextRecommendedProblem) break;
    }
  }

  // If all problems in current level solved, pick any unsolved problem
  if (!nextRecommendedProblem) {
    nextRecommendedProblem = DSA_PROBLEMS.find(p => !solvedProblemIds.has(p.id)) || DSA_PROBLEMS[0];
  }

  // Circadian & Ultradian Analysis (Kleitman, Lavie)
  const currentHour = new Date().getHours();
  let rightNowRecommendation: GodModeState['rightNowRecommendation'];

  if (currentHour >= 5 && currentHour < 12) {
    // Morning (Peak Prefrontal Glycogen)
    rightNowRecommendation = {
      phase: '🌅 Morning Peak (High Prefrontal Bandwidth)',
      actionTitle: `Solve: ${nextRecommendedProblem.name}`,
      actionDescription: `Pattern: ${nextRecommendedProblem.pattern} (${nextRecommendedProblem.difficulty}) • Level ${currentLevel}: ${currentLevelData.title}`,
      scienceReason: 'Anders Ericsson & Lavie: Working memory is highest before workday cognitive fatigue sets in. Peak time for algorithmic invariants.',
      whyAtWork: currentLevelData.whyAtWork,
      whyInInterview: currentLevelData.whyInInterview,
      actionType: 'DSA',
      targetRoute: '/dsa',
      targetProblemId: nextRecommendedProblem.id,
    };
  } else if (currentHour >= 12 && currentHour < 18) {
    // Workday Afternoon
    rightNowRecommendation = {
      phase: '💼 Workday Engineering Execution',
      actionTitle: 'Apply Clean Code & Debugger At Work',
      actionDescription: `${currentLevelData.practicalWorkAction}`,
      scienceReason: 'Sweller (Cognitive Load Theory): Avoid cognitive fatigue during job hours; channel study concepts directly into production code.',
      whyAtWork: 'Builds your reputation as a high-agency, reliable engineer in sprint demos and code reviews.',
      whyInInterview: 'Provides real-world stories for System Design and Behavioral STAR rounds.',
      actionType: 'WORK',
      targetRoute: '/journal',
    };
  } else if (currentHour >= 18 && currentHour < 21) {
    // Evening Plateau
    rightNowRecommendation = {
      phase: '🌆 Evening Synthesis (Alertness Plateau)',
      actionTitle: 'System Design & Tech Sprint Deep Dive',
      actionDescription: 'Spend 45–60 mins building backend services, reviewing Kafka/SQL indexing, or revising spaced reviews.',
      scienceReason: 'Lavie (Forbidden Zone for Sleep): High evening arousal allows high conceptual synthesis with low working memory friction.',
      whyAtWork: currentLevelData.whyAtWork,
      whyInInterview: currentLevelData.whyInInterview,
      actionType: 'TECH',
      targetRoute: '/sprint',
    };
  } else if (currentHour >= 21 && currentHour <= 22) {
    // Night Consolidation
    rightNowRecommendation = {
      phase: '🎙️ Night Reflection & Articulation',
      actionTitle: '15-Minute Speech Studio or Behavioral Narration',
      actionDescription: 'Record 1 technical explanation or draft 1 STAR behavioral story before winding down.',
      scienceReason: 'Roediger & Karpicke: Active vocal retrieval right before sleep locks neural pathways into long-term memory.',
      whyAtWork: 'Improves concise speaking in stand-ups and stakeholder presentations.',
      whyInInterview: 'Tier-1 bar raisers grade heavily on communication clarity and structured thinking.',
      actionType: 'SPEECH',
      targetRoute: '/communication',
    };
  } else {
    // Late Night (Sleep Protection)
    rightNowRecommendation = {
      phase: '🌙 Sleep Protection (Inviolable Hard Stop)',
      actionTitle: 'Close Laptop & Sleep (8 Hours)',
      actionDescription: 'Zero screens. Let slow-wave and REM sleep consolidate today’s memory schemas.',
      scienceReason: 'Wagner et al. (Nature 2004): Nocturnal sleep more than doubles (2.36x) the probability of algorithmic insight.',
      whyAtWork: 'Prevents daytime burnout and costly production mistakes.',
      whyInInterview: 'Restored prefrontal cortex ensures fast pattern matching tomorrow morning.',
      actionType: 'SLEEP',
      targetRoute: '/schedule',
    };
  }

  return {
    currentLevel,
    currentLevelData,
    levelProgressPct,
    totalProblemsSolved,
    readinessScore,
    totalXp,
    playerRank,
    nextRecommendedProblem,
    rightNowRecommendation,
  };
}
