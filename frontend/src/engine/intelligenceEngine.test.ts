import { describe, it, expect } from 'vitest';
import { computeIntelligenceRecommendations } from './intelligenceEngine';
import { 
  INITIAL_CAREER_PROFILE, 
  INITIAL_CAREER_SKILLS, 
  INITIAL_ROADMAP_PHASES, 
  INITIAL_FLAGSHIP_PROJECT 
} from '../data/careerRoadmapData';

describe('intelligenceEngine', () => {
  it('respects office training hours (11 AM to 8 PM weekdays) and does not prescribe independent study', () => {
    const result = computeIntelligenceRecommendations({
      profile: INITIAL_CAREER_PROFILE,
      skills: INITIAL_CAREER_SKILLS,
      roadmap: INITIAL_ROADMAP_PHASES,
      project: INITIAL_FLAGSHIP_PROJECT,
      dueRevisions: [],
      weakPatterns: [],
      recurringMistakes: [],
      currentHour: 14, // 2 PM
      isWeekend: false,
    });

    expect(result.currentContext.isOfficeHours).toBe(true);
    expect(result.currentContext.circadianPhase).toBe('OFFICE_TRAINING');
    expect(result.primaryRecommendation.actionType).toBe('WORKPLACE');
    expect(result.primaryRecommendation.skill).toContain('Workplace');
  });

  it('prioritizes due spaced repetition revisions during morning study window', () => {
    const result = computeIntelligenceRecommendations({
      profile: INITIAL_CAREER_PROFILE,
      skills: INITIAL_CAREER_SKILLS,
      roadmap: INITIAL_ROADMAP_PHASES,
      project: INITIAL_FLAGSHIP_PROJECT,
      dueRevisions: [
        {
          id: 'rev-1',
          problemId: 1,
          problemName: 'Two Sum',
          pattern: 'Hash Map Lookup',
          difficulty: 'EASY',
        },
      ],
      weakPatterns: [],
      recurringMistakes: [],
      currentHour: 8, // 8 AM morning
      isWeekend: false,
    });

    expect(result.currentContext.isOfficeHours).toBe(false);
    expect(result.currentContext.circadianPhase).toBe('EARLY_MORNING_DEEP_WORK');
    expect(result.primaryRecommendation.actionType).toBe('REVISION');
    expect(result.primaryRecommendation.taskTitle).toContain('Two Sum');
  });

  it('favors flagship project engineering on weekends', () => {
    const result = computeIntelligenceRecommendations({
      profile: INITIAL_CAREER_PROFILE,
      skills: INITIAL_CAREER_SKILLS,
      roadmap: INITIAL_ROADMAP_PHASES,
      project: INITIAL_FLAGSHIP_PROJECT,
      dueRevisions: [],
      weakPatterns: [],
      recurringMistakes: [],
      currentHour: 11,
      isWeekend: true,
    });

    expect(result.currentContext.isOfficeHours).toBe(false);
    expect(result.currentContext.circadianPhase).toBe('WEEKEND_PROJECT_BLOCK');
    expect(result.primaryRecommendation.actionType).toBe('PROJECT');
  });

  it('recommends minimum viable session duration when fatigue is high (level 4 or 5)', () => {
    const result = computeIntelligenceRecommendations({
      profile: INITIAL_CAREER_PROFILE,
      skills: INITIAL_CAREER_SKILLS,
      roadmap: INITIAL_ROADMAP_PHASES,
      project: INITIAL_FLAGSHIP_PROJECT,
      dueRevisions: [],
      weakPatterns: [],
      recurringMistakes: [],
      currentHour: 20, // 8:30 PM evening
      isWeekend: false,
      fatigueLevel: 5, // Exhausted
    });

    expect(result.currentContext.availableSessionMinutes).toBeLessThanOrEqual(30);
  });
});
