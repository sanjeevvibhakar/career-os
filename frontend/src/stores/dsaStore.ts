import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DSA_TOPICS, DSA_PROBLEMS } from '../data/dsaProblems';
import type { DsaTopicSeed, DsaProblemSeed } from '../data/dsaProblems';
import type { MistakeCategory } from '../types/career';

export interface DsaAttempt {
  id: string;
  problemId: number;
  attemptNumber: number;
  timeTakenMin: number;
  solvedIndependently: boolean;
  approach: string;
  mistake: string;
  complexityTime: string;
  complexitySpace: string;
  lesson: string;
  confidence: number; // 1-5
  attemptedAt: string; // ISO date string
  // Enhanced fields
  language?: string;
  hintUsage?: 'NONE' | 'SMALL_HINT' | 'EDITORIAL_LOOKUP';
  mistakeCategory?: MistakeCategory;
  optimalComplexity?: { time: string; space: string };
  reSolvePerformance?: 'PASS_FIRST_TRY' | 'STRUGGLED' | 'FAILED';
}

export interface DsaRevision {
  id: string;
  attemptId: string;
  problemId: number;
  revisionNumber: number; // 1-5
  scheduledDate: string; // ISO date string
  completedDate: string | null;
  timeTakenMin: number | null;
  confidence: number | null;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  reSolvePerformance?: 'PASS_FIRST_TRY' | 'STRUGGLED' | 'FAILED';
}

export interface PatternPerformance {
  pattern: string;
  topicName: string;
  solvedCount: number;
  avgConfidence: number;
  independentSolveRatePct: number;
  isStrong: boolean;
  isWeak: boolean;
}

export interface DsaState {
  topics: DsaTopicSeed[];
  problems: DsaProblemSeed[];
  attempts: DsaAttempt[];
  revisions: DsaRevision[];
  
  logAttempt: (problemId: number, data: Omit<DsaAttempt, 'id' | 'problemId' | 'attemptNumber' | 'attemptedAt'>) => void;
  completeRevision: (revisionId: string, timeTakenMin: number, confidence: number, performance?: 'PASS_FIRST_TRY' | 'STRUGGLED' | 'FAILED') => void;
  skipRevision: (revisionId: string) => void;
  
  getTopicStats: () => { topicId: number; name: string; icon: string; color: string; description: string; total: number; solved: number; avgConfidence: number }[];
  getProblemsByTopic: (topicId: number) => (DsaProblemSeed & { attemptCount: number; lastAttemptDate: string | null; confidence: number; nextRevisionDate: string | null })[];
  getDueRevisions: () => (DsaRevision & { problemName: string; topicName: string; pattern: string; difficulty: string })[];
  getStats: () => { totalSolved: number; totalProblems: number; easy: number; medium: number; hard: number; streakDays: number; independentSolveRatePct: number };
  getHeatmap: () => Record<string, number>;
  getPatternAnalysis: () => {
    strongPatterns: PatternPerformance[];
    weakPatterns: PatternPerformance[];
    recurringMistakes: { category: MistakeCategory; count: number }[];
  };
  getTimedAccuracy: () => {
    totalAttemptCount: number;
    independentSolveRatePct: number;
    avgTimeMin: number;
    under30MinRatePct: number;
  };
}

export const useDsaStore = create<DsaState>()(
  persist(
    (set, get) => ({
      topics: DSA_TOPICS,
      problems: DSA_PROBLEMS,
      attempts: [],
      revisions: [],

      logAttempt: (problemId, data) => {
        set((state) => {
          const problemAttempts = state.attempts.filter(a => a.problemId === problemId);
          const attemptNumber = problemAttempts.length + 1;
          const newAttempt: DsaAttempt = {
            ...data,
            id: crypto.randomUUID(),
            problemId,
            attemptNumber,
            attemptedAt: new Date().toISOString(),
          };

          // Standard spaced repetition intervals (1, 3, 7, 21, 60 days)
          // If low confidence (<= 2) or hint was used, shorten interval to reinforce faster
          const baseIntervals = data.confidence <= 2 || data.hintUsage === 'EDITORIAL_LOOKUP'
            ? [1, 2, 5, 14, 30]
            : [1, 3, 7, 21, 60];

          const newRevisions: DsaRevision[] = baseIntervals.map((days, index) => {
            const scheduledDate = new Date();
            scheduledDate.setDate(scheduledDate.getDate() + days);
            return {
              id: crypto.randomUUID(),
              attemptId: newAttempt.id,
              problemId,
              revisionNumber: index + 1,
              scheduledDate: scheduledDate.toISOString().split('T')[0],
              completedDate: null,
              timeTakenMin: null,
              confidence: null,
              status: 'PENDING',
            };
          });

          return {
            attempts: [...state.attempts, newAttempt],
            revisions: [...state.revisions, ...newRevisions],
          };
        });
      },

      completeRevision: (revisionId, timeTakenMin, confidence, performance = 'PASS_FIRST_TRY') => {
        set((state) => {
          const targetRev = state.revisions.find(r => r.id === revisionId);
          const updatedRevisions = state.revisions.map(rev =>
            rev.id === revisionId
              ? { 
                  ...rev, 
                  status: 'COMPLETED' as const, 
                  completedDate: new Date().toISOString(), 
                  timeTakenMin, 
                  confidence,
                  reSolvePerformance: performance
                }
              : rev
          );

          // If user struggled or failed during recall, automatically schedule a reinforcement review in 2 days
          if (targetRev && (performance === 'FAILED' || performance === 'STRUGGLED' || confidence <= 2)) {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 2);
            const reinforcementRev: DsaRevision = {
              id: crypto.randomUUID(),
              attemptId: targetRev.attemptId,
              problemId: targetRev.problemId,
              revisionNumber: targetRev.revisionNumber + 1,
              scheduledDate: nextDate.toISOString().split('T')[0],
              completedDate: null,
              timeTakenMin: null,
              confidence: null,
              status: 'PENDING',
            };
            return { revisions: [...updatedRevisions, reinforcementRev] };
          }

          return { revisions: updatedRevisions };
        });
      },

      skipRevision: (revisionId) => {
        set((state) => ({
          revisions: state.revisions.map(rev =>
            rev.id === revisionId ? { ...rev, status: 'SKIPPED' as const } : rev
          )
        }));
      },

      getTopicStats: () => {
        const state = get();
        return state.topics.map(topic => {
          const topicProblems = state.problems.filter(p => p.topicId === topic.id);
          const solvedProblems = topicProblems.filter(p => state.attempts.some(a => a.problemId === p.id));
          const totalConfidence = solvedProblems.reduce((sum, p) => {
            const attempts = state.attempts.filter(a => a.problemId === p.id);
            const latest = attempts.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())[0];
            return sum + (latest?.confidence || 0);
          }, 0);
          
          return {
            topicId: topic.id,
            name: topic.name,
            icon: topic.icon,
            color: topic.color,
            description: topic.description,
            total: topicProblems.length,
            solved: solvedProblems.length,
            avgConfidence: solvedProblems.length ? totalConfidence / solvedProblems.length : 0,
          };
        });
      },

      getProblemsByTopic: (topicId) => {
        const state = get();
        const problems = state.problems.filter(p => p.topicId === topicId);
        
        return problems.map(p => {
          const attempts = state.attempts.filter(a => a.problemId === p.id).sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
          const pendingRevisions = state.revisions.filter(r => r.problemId === p.id && r.status === 'PENDING').sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
          
          return {
            ...p,
            attemptCount: attempts.length,
            lastAttemptDate: attempts.length > 0 ? attempts[0].attemptedAt : null,
            confidence: attempts.length > 0 ? attempts[0].confidence : 0,
            nextRevisionDate: pendingRevisions.length > 0 ? pendingRevisions[0].scheduledDate : null,
          };
        });
      },

      getDueRevisions: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        return state.revisions
          .filter(r => r.status === 'PENDING' && r.scheduledDate <= today)
          .map(r => {
            const problem = state.problems.find(p => p.id === r.problemId);
            const topic = state.topics.find(t => t.id === problem?.topicId);
            return {
              ...r,
              problemName: problem?.name || 'Unknown',
              topicName: topic?.name || 'Unknown',
              pattern: problem?.pattern || 'Unknown',
              difficulty: problem?.difficulty || 'MEDIUM',
            };
          });
      },

      getStats: () => {
        const state = get();
        const solvedProblemsIds = new Set(state.attempts.map(a => a.problemId));
        const solvedProblems = state.problems.filter(p => solvedProblemsIds.has(p.id));
        
        const dates = [...new Set(state.attempts.map(a => a.attemptedAt.split('T')[0]))].sort();
        let streakDays = 0;
        const today = new Date().toISOString().split('T')[0];
        let currentDate = new Date(today);
        
        while(true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (dates.includes(dateStr)) {
            streakDays++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (dateStr === today) {
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }

        const independentCount = state.attempts.filter(a => a.solvedIndependently).length;
        const independentSolveRatePct = state.attempts.length > 0
          ? Math.round((independentCount / state.attempts.length) * 100)
          : 0;
        
        return {
          totalSolved: solvedProblems.length,
          totalProblems: state.problems.length,
          easy: solvedProblems.filter(p => p.difficulty === 'EASY').length,
          medium: solvedProblems.filter(p => p.difficulty === 'MEDIUM').length,
          hard: solvedProblems.filter(p => p.difficulty === 'HARD').length,
          streakDays,
          independentSolveRatePct,
        };
      },

      getHeatmap: () => {
        const state = get();
        return state.attempts.reduce((acc, attempt) => {
          const date = attempt.attemptedAt.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getPatternAnalysis: () => {
        const state = get();
        const patternMap: Record<string, { pattern: string; topicName: string; confidences: number[]; independentCount: number; totalCount: number }> = {};

        state.attempts.forEach((a) => {
          const problem = state.problems.find(p => p.id === a.problemId);
          if (!problem) return;
          const pattern = problem.pattern || 'General';
          const topic = state.topics.find(t => t.id === problem.topicId);
          const topicName = topic?.name || 'Algorithms';

          if (!patternMap[pattern]) {
            patternMap[pattern] = { pattern, topicName, confidences: [], independentCount: 0, totalCount: 0 };
          }
          patternMap[pattern].confidences.push(a.confidence);
          if (a.solvedIndependently) patternMap[pattern].independentCount++;
          patternMap[pattern].totalCount++;
        });

        const patternList: PatternPerformance[] = Object.values(patternMap).map(p => {
          const avgConfidence = p.confidences.reduce((a, b) => a + b, 0) / p.confidences.length;
          const independentSolveRatePct = Math.round((p.independentCount / p.totalCount) * 100);
          return {
            pattern: p.pattern,
            topicName: p.topicName,
            solvedCount: p.totalCount,
            avgConfidence: Math.round(avgConfidence * 10) / 10,
            independentSolveRatePct,
            isStrong: avgConfidence >= 4.0 && independentSolveRatePct >= 75,
            isWeak: avgConfidence < 3.2 || independentSolveRatePct < 60,
          };
        });

        const strongPatterns = patternList.filter(p => p.isStrong).sort((a, b) => b.solvedCount - a.solvedCount);
        const weakPatterns = patternList.filter(p => p.isWeak).sort((a, b) => a.avgConfidence - b.avgConfidence);

        // Tally recurring mistakes
        const mistakeCounts: Record<MistakeCategory, number> = {
          PATTERN_NOT_RECOGNIZED: 0,
          INCORRECT_ALGORITHM: 0,
          INCORRECT_COMPLEXITY: 0,
          EDGE_CASE_FAILURE: 0,
          IMPLEMENTATION_ERROR: 0,
          COULD_NOT_EXPLAIN: 0,
          TIME_MANAGEMENT: 0,
        };

        state.attempts.forEach((a) => {
          if (a.mistakeCategory && mistakeCounts[a.mistakeCategory] !== undefined) {
            mistakeCounts[a.mistakeCategory]++;
          }
        });

        const recurringMistakes = (Object.entries(mistakeCounts) as [MistakeCategory, number][])
          .filter(([_, count]) => count > 0)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);

        return {
          strongPatterns,
          weakPatterns,
          recurringMistakes,
        };
      },

      getTimedAccuracy: () => {
        const state = get();
        if (state.attempts.length === 0) {
          return {
            totalAttemptCount: 0,
            independentSolveRatePct: 0,
            avgTimeMin: 0,
            under30MinRatePct: 0,
          };
        }

        const totalAttempts = state.attempts.length;
        const independentCount = state.attempts.filter(a => a.solvedIndependently).length;
        const totalTime = state.attempts.reduce((sum, a) => sum + (a.timeTakenMin || 0), 0);
        const under30Count = state.attempts.filter(a => (a.timeTakenMin || 0) <= 30).length;

        return {
          totalAttemptCount: totalAttempts,
          independentSolveRatePct: Math.round((independentCount / totalAttempts) * 100),
          avgTimeMin: Math.round(totalTime / totalAttempts),
          under30MinRatePct: Math.round((under30Count / totalAttempts) * 100),
        };
      },
    }),
    {
      name: 'career-os-dsa',
      version: 3,
      migrate: (persistedState: any) => {
        return {
          ...persistedState,
          topics: DSA_TOPICS,
          problems: DSA_PROBLEMS,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.problems = DSA_PROBLEMS;
          state.topics = DSA_TOPICS;
        }
      }
    }
  )
);
