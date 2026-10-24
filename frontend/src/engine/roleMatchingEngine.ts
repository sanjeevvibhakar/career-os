import type { CareerSkill, JobOpportunity } from '../types/career';

export interface MatchAnalysisResult {
  jobId: string;
  company: string;
  role: string;
  matchScorePct: number; // 0 - 100
  qualificationStatus: 'STRONG_MATCH' | 'COMPETITIVE_MATCH' | 'GAP_CLOSING_REQUIRED' | 'MISALIGNED';
  matchedStrengths: {
    skillName: string;
    assessedLevel: number;
    evidenceCount: number;
  }[];
  criticalSkillGaps: {
    requiredSkill: string;
    currentAssessedLevel: number;
    recommendedPreparationTask: string;
  }[];
  preferredBonusSkills: {
    skillName: string;
    present: boolean;
  }[];
}

// Map common requirement strings to CareerSkill IDs and names
const SKILL_SYNONYMS: Record<string, string> = {
  'java': 'java-syntax-core',
  'core java': 'java-syntax-core',
  'java 21': 'java-syntax-core',
  'oop': 'java-syntax-core',
  'collections': 'java-collections-generics',
  'multithreading': 'java-concurrency',
  'concurrency': 'java-concurrency',
  'spring': 'spring-di-ioc',
  'spring boot': 'spring-di-ioc',
  'rest': 'spring-rest-apis',
  'rest api': 'spring-rest-apis',
  'rest apis': 'spring-rest-apis',
  'jpa': 'spring-jpa-hibernate',
  'hibernate': 'spring-jpa-hibernate',
  'spring security': 'spring-security',
  'sql': 'sql-joins-indexing',
  'postgresql': 'sql-joins-indexing',
  'mysql': 'sql-joins-indexing',
  'database': 'sql-joins-indexing',
  'dsa': 'dsa-arrays-hashing',
  'data structures': 'dsa-arrays-hashing',
  'algorithms': 'dsa-arrays-hashing',
  'problem solving': 'dsa-arrays-hashing',
  'testing': 'spring-transactions-testing',
  'unit testing': 'spring-transactions-testing',
  'docker': 'prod-docker-cicd',
  'redis': 'prod-docker-cicd',
  'caching': 'prod-docker-cicd',
  'system design': 'system-design-hld',
  'lld': 'cs-oop-lld',
  'low level design': 'cs-oop-lld',
  'hld': 'system-design-hld',
  'high level design': 'system-design-hld',
  'distributed systems': 'system-design-hld',
};

export function evaluateRoleMatch(job: JobOpportunity, userSkills: CareerSkill[]): MatchAnalysisResult {
  const matchedStrengths: MatchAnalysisResult['matchedStrengths'] = [];
  const criticalSkillGaps: MatchAnalysisResult['criticalSkillGaps'] = [];
  const preferredBonusSkills: MatchAnalysisResult['preferredBonusSkills'] = [];

  let requiredScoreTotal = 0;
  const totalRequiredWeight = Math.max(1, job.requiredSkills.length);

  job.requiredSkills.forEach((req) => {
    const normalized = req.trim().toLowerCase();
    const mappedSkillId = SKILL_SYNONYMS[normalized];

    // Find in userSkills by mapped ID or fuzzy name
    const foundSkill = mappedSkillId 
      ? userSkills.find(s => s.id === mappedSkillId)
      : userSkills.find(s => s.name.toLowerCase().includes(normalized));

    if (foundSkill) {
      // Scale by assessed proficiency (Level 1-5 -> 20%-100%)
      const levelMultiplier = foundSkill.assessedProficiency / 5;
      requiredScoreTotal += levelMultiplier;

      if (foundSkill.assessedProficiency >= 3) {
        matchedStrengths.push({
          skillName: foundSkill.name,
          assessedLevel: foundSkill.assessedProficiency,
          evidenceCount: foundSkill.evidenceIds.length,
        });
      } else {
        criticalSkillGaps.push({
          requiredSkill: req,
          currentAssessedLevel: foundSkill.assessedProficiency,
          recommendedPreparationTask: `Elevate ${foundSkill.name} to Level 3 through independent coding milestones.`,
        });
      }
    } else {
      // Skill completely unassessed or outside primary stack
      criticalSkillGaps.push({
        requiredSkill: req,
        currentAssessedLevel: 1,
        recommendedPreparationTask: `Assess baseline competence in ${req} or document existing workplace experience.`,
      });
    }
  });

  // Check preferred skills (bonus credit up to 15%)
  let bonusCredit = 0;
  job.preferredSkills.forEach((pref) => {
    const normalized = pref.trim().toLowerCase();
    const mappedSkillId = SKILL_SYNONYMS[normalized];
    const foundSkill = mappedSkillId 
      ? userSkills.find(s => s.id === mappedSkillId)
      : userSkills.find(s => s.name.toLowerCase().includes(normalized));

    const present = Boolean(foundSkill && foundSkill.assessedProficiency >= 2);
    preferredBonusSkills.push({ skillName: pref, present });
    if (present) bonusCredit += 3;
  });

  const baseMatchPct = Math.round((requiredScoreTotal / totalRequiredWeight) * 85);
  const matchScorePct = Math.min(100, Math.max(10, baseMatchPct + bonusCredit));

  let qualificationStatus: MatchAnalysisResult['qualificationStatus'] = 'GAP_CLOSING_REQUIRED';
  if (matchScorePct >= 80 && criticalSkillGaps.length === 0) {
    qualificationStatus = 'STRONG_MATCH';
  } else if (matchScorePct >= 65) {
    qualificationStatus = 'COMPETITIVE_MATCH';
  } else if (matchScorePct < 45) {
    qualificationStatus = 'MISALIGNED';
  }

  return {
    jobId: job.id,
    company: job.company,
    role: job.role,
    matchScorePct,
    qualificationStatus,
    matchedStrengths,
    criticalSkillGaps,
    preferredBonusSkills,
  };
}
