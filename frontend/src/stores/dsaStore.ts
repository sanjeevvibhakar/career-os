import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DSA_TOPICS, DSA_PROBLEMS } from '../data/dsaProblems';
import type { DsaTopicSeed, DsaProblemSeed } from '../data/dsaProblems';

interface DsaAttempt {
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
}

interface DsaRevision {
  id: string;
  attemptId: string;
  problemId: number;
  revisionNumber: number; // 1-5
  scheduledDate: string; // ISO date string
  completedDate: string | null;
  timeTakenMin: number | null;
  confidence: number | null;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}

interface DsaState {
  topics: DsaTopicSeed[];
  problems: DsaProblemSeed[];
  attempts: DsaAttempt[];
  revisions: DsaRevision[];
  
  logAttempt: (problemId: number, data: Omit<DsaAttempt, 'id' | 'problemId' | 'attemptNumber' | 'attemptedAt'>) => void;
  completeRevision: (revisionId: string, timeTakenMin: number, confidence: number) => void;
  skipRevision: (revisionId: string) => void;
  
  getTopicStats: () => { topicId: number; name: string; icon: string; color: string; total: number; solved: number; avgConfidence: number }[];
  getProblemsByTopic: (topicId: number) => (DsaProblemSeed & { attemptCount: number; lastAttemptDate: string | null; confidence: number; nextRevisionDate: string | null })[];
  getDueRevisions: () => (DsaRevision & { problemName: string; topicName: string; pattern: string })[];
  getStats: () => { totalSolved: number; totalProblems: number; easy: number; medium: number; hard: number; streakDays: number };
  getHeatmap: () => Record<string, number>;
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

          const newRevisions: DsaRevision[] = [1, 3, 7, 21, 60].map((days, index) => {
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

      completeRevision: (revisionId, timeTakenMin, confidence) => {
        set((state) => ({
          revisions: state.revisions.map(rev =>
            rev.id === revisionId
              ? { ...rev, status: 'COMPLETED', completedDate: new Date().toISOString(), timeTakenMin, confidence }
              : rev
          )
        }));
      },

      skipRevision: (revisionId) => {
        set((state) => ({
          revisions: state.revisions.map(rev =>
            rev.id === revisionId ? { ...rev, status: 'SKIPPED' } : rev
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
                // If today is not in dates, check if yesterday was part of a streak
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return {
          totalSolved: solvedProblems.length,
          totalProblems: state.problems.length,
          easy: solvedProblems.filter(p => p.difficulty === 'EASY').length,
          medium: solvedProblems.filter(p => p.difficulty === 'MEDIUM').length,
          hard: solvedProblems.filter(p => p.difficulty === 'HARD').length,
          streakDays,
        };
      },

      getHeatmap: () => {
        const state = get();
        return state.attempts.reduce((acc, attempt) => {
          const date = attempt.attemptedAt.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }
    }),
    { name: 'career-os-dsa' }
  )
);
