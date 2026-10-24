import { describe, it, expect } from 'vitest';
import { computeInterviewReadiness } from './interviewReadinessEngine';
import { generateWeeklyIntelligenceReport } from './weeklyReportEngine';
import { evaluateRoleMatch } from './roleMatchingEngine';
import { 
  INITIAL_CAREER_SKILLS, 
  INITIAL_FLAGSHIP_PROJECT, 
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_JOB_OPPORTUNITIES
} from '../data/careerRoadmapData';

describe('interviewReadinessEngine', () => {
  it('computes grounded multi-dimensional readiness scores across 11 dimensions', () => {
    const result = computeInterviewReadiness({
      skills: INITIAL_CAREER_SKILLS,
      attempts: [],
      mocks: [],
      evidence: INITIAL_EVIDENCE_ITEMS,
    });

    expect(result.dimensionScores.length).toBe(11);
    expect(result.compositeScorePct).toBeGreaterThan(0);
    expect(result.compositeScorePct).toBeLessThanOrEqual(100);
    expect(result.strongestDimensions.length).toBe(3);
    expect(result.weakestDimensions.length).toBe(3);
  });

  it('adjusts DSA score upwards with real independent solve rate', () => {
    const withoutAttempts = computeInterviewReadiness({
      skills: INITIAL_CAREER_SKILLS,
      attempts: [],
      mocks: [],
      evidence: [],
    });

    const withHighIndependentAttempts = computeInterviewReadiness({
      skills: INITIAL_CAREER_SKILLS,
      attempts: [
        {
          id: '1',
          problemId: 1,
          attemptNumber: 1,
          timeTakenMin: 20,
          solvedIndependently: true,
          approach: 'hash map',
          mistake: '',
          complexityTime: 'O(N)',
          complexitySpace: 'O(N)',
          lesson: '',
          confidence: 5,
          attemptedAt: new Date().toISOString(),
        },
        {
          id: '2',
          problemId: 2,
          attemptNumber: 1,
          timeTakenMin: 15,
          solvedIndependently: true,
          approach: 'set',
          mistake: '',
          complexityTime: 'O(N)',
          complexitySpace: 'O(N)',
          lesson: '',
          confidence: 5,
          attemptedAt: new Date().toISOString(),
        },
      ],
      mocks: [],
      evidence: [],
    });

    const dsaWithout = withoutAttempts.dimensionScores.find(d => d.dimension === 'DSA');
    const dsaWith = withHighIndependentAttempts.dimensionScores.find(d => d.dimension === 'DSA');

    expect(dsaWith?.scorePct).toBeGreaterThanOrEqual(dsaWithout?.scorePct || 0);
  });
});

describe('weeklyReportEngine', () => {
  it('identifies concrete bottlenecks and builds realistic plan', () => {
    const report = generateWeeklyIntelligenceReport({
      skills: INITIAL_CAREER_SKILLS,
      attempts: [],
      revisions: [],
      project: INITIAL_FLAGSHIP_PROJECT,
      evidence: INITIAL_EVIDENCE_ITEMS,
      jobs: INITIAL_JOB_OPPORTUNITIES,
      mocks: [],
      averageFatigueRating: 2.5,
    });

    expect(report.bottlenecks.length).toBeGreaterThan(0);
    expect(report.bottlenecks.length).toBeLessThanOrEqual(3);
    expect(report.nextWeekPlan.primaryTechnicalFocus).toBeDefined();
    expect(report.sustainability.workloadEvaluation).toBe('BALANCED');
  });

  it('flags high recovery required when user reports high fatigue rating', () => {
    const report = generateWeeklyIntelligenceReport({
      skills: INITIAL_CAREER_SKILLS,
      attempts: [],
      revisions: [],
      project: INITIAL_FLAGSHIP_PROJECT,
      evidence: INITIAL_EVIDENCE_ITEMS,
      jobs: INITIAL_JOB_OPPORTUNITIES,
      mocks: [],
      averageFatigueRating: 4.8,
    });

    expect(report.sustainability.workloadEvaluation).toBe('HIGH_RECOVERY_REQUIRED');
    expect(report.sustainability.advice).toContain('Minimum Viable Days');
  });
});

describe('roleMatchingEngine', () => {
  it('correctly matches PhonePe job requirements against assessed backend skills', () => {
    const job = INITIAL_JOB_OPPORTUNITIES[0]; // PhonePe Java backend
    const match = evaluateRoleMatch(job, INITIAL_CAREER_SKILLS);

    expect(match.company).toBe('PhonePe');
    expect(match.matchScorePct).toBeGreaterThan(50);
    expect(match.matchedStrengths.length).toBeGreaterThan(0);
    expect(match.criticalSkillGaps).toBeDefined();
  });
});
