import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SYLLABUS_DATA, type SyllabusDayItem } from '../data/syllabusData';

export type PaceStatus = 'ON_TRACK' | 'AHEAD' | 'MILD_LAG' | 'SIGNIFICANT_LAG';

export interface PaceAnalysis {
  completedCount: number;
  totalCount: number;
  progressPct: number;
  expectedCount: number;
  lagCount: number; // positive = behind, zero/negative = on track/ahead
  status: PaceStatus;
  statusLabel: string;
  strategyTitle: string;
  strategyAdvice: string;
  nextPendingItem: SyllabusDayItem | null;
}

interface SyllabusState {
  completedItemIds: string[];
  completionDates: Record<string, string>; // itemId -> YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  
  // Actions
  toggleItem: (itemId: string) => void;
  markCompleted: (itemId: string) => void;
  setStartDate: (date: string) => void;
  resetProgress: () => void;
  
  // Computed
  isCompleted: (itemId: string) => boolean;
  getPaceAnalysis: () => PaceAnalysis;
  getNextPendingItem: () => SyllabusDayItem | null;
  getItemById: (itemId: string) => SyllabusDayItem | undefined;
}

// Helper to count weekdays between two dates
function getWeekdaysBetween(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (start > end) return 0;
  
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) { // Monday-Friday
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export const useSyllabusStore = create<SyllabusState>()(
  persist(
    (set, get) => ({
      completedItemIds: [],
      completionDates: {},
      startDate: new Date().toISOString().split('T')[0],

      toggleItem: (itemId: string) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const isDone = state.completedItemIds.includes(itemId);
          if (isDone) {
            const nextIds = state.completedItemIds.filter((id) => id !== itemId);
            const nextDates = { ...state.completionDates };
            delete nextDates[itemId];
            return {
              completedItemIds: nextIds,
              completionDates: nextDates,
            };
          } else {
            return {
              completedItemIds: [...state.completedItemIds, itemId],
              completionDates: {
                ...state.completionDates,
                [itemId]: today,
              },
            };
          }
        });
      },

      markCompleted: (itemId: string) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          if (state.completedItemIds.includes(itemId)) return state;
          return {
            completedItemIds: [...state.completedItemIds, itemId],
            completionDates: {
              ...state.completionDates,
              [itemId]: today,
            },
          };
        });
      },

      setStartDate: (date: string) => {
        set({ startDate: date });
      },

      resetProgress: () => {
        set({
          completedItemIds: [],
          completionDates: {},
          startDate: new Date().toISOString().split('T')[0],
        });
      },

      isCompleted: (itemId: string) => {
        return get().completedItemIds.includes(itemId);
      },

      getNextPendingItem: () => {
        const { completedItemIds } = get();
        return SYLLABUS_DATA.find((item) => !completedItemIds.includes(item.id)) || null;
      },

      getItemById: (itemId: string) => {
        return SYLLABUS_DATA.find((item) => item.id === itemId);
      },

      getPaceAnalysis: () => {
        const { completedItemIds, startDate } = get();
        const totalCount = SYLLABUS_DATA.length;
        const completedCount = completedItemIds.length;
        const progressPct = Math.round((completedCount / totalCount) * 100);

        const todayStr = new Date().toISOString().split('T')[0];
        const weekdaysElapsed = getWeekdaysBetween(startDate, todayStr);
        // We expect at most totalCount, and at least 1 if started today
        const expectedCount = Math.min(totalCount, Math.max(1, weekdaysElapsed));

        const lagCount = expectedCount - completedCount;
        let status: PaceStatus = 'ON_TRACK';
        let statusLabel = '⚡ On Track';
        let strategyTitle = 'Maintain Consistent Daily Rhythm';
        let strategyAdvice = 'You are matching your expected timeline! Spend 45 minutes on today’s subtopic, take notes mentally or in code, and mark it done.';

        if (lagCount < 0) {
          status = 'AHEAD';
          statusLabel = `🚀 Ahead by ${Math.abs(lagCount)} Day${Math.abs(lagCount) > 1 ? 's' : ''}`;
          strategyTitle = 'Ahead of Schedule — Reinforce with Code';
          strategyAdvice = 'Great velocity! Use this extra buffer to implement the subtopic directly into your company’s codebase or build a mini-POC project.';
        } else if (lagCount === 0) {
          status = 'ON_TRACK';
          statusLabel = '⚡ Perfectly On Track';
          strategyTitle = 'Zero Lag — Protect Your Flow';
          strategyAdvice = 'Steady momentum is the #1 predictor of interview success. Keep checking off 1 subtopic each weekday evening.';
        } else if (lagCount <= 2) {
          status = 'MILD_LAG';
          statusLabel = `⚠️ ${lagCount} Day${lagCount > 1 ? 's' : ''} Behind`;
          strategyTitle = 'Pace Strategy: Rapid Weekend Catch-Up';
          strategyAdvice = `You are behind by ${lagCount} subtopic${lagCount > 1 ? 's' : ''}. Don’t stress: allocate one 60-minute deep-work block this Saturday to cover the missed subtopics without rushing.`;
        } else {
          status = 'SIGNIFICANT_LAG';
          statusLabel = `🚨 ${lagCount} Days Behind`;
          strategyTitle = 'Pace Strategy: Recalibrate Baseline';
          strategyAdvice = `You have a backlog of ${lagCount} subtopics. Two actionable strategies: 1) Group similar subtopics into a 2-hour weekend sprint, or 2) Click 'Reset Baseline to Today' to give yourself a fresh, realistic runway without feeling overwhelmed.`;
        }

        const nextPendingItem = SYLLABUS_DATA.find((item) => !completedItemIds.includes(item.id)) || null;

        return {
          completedCount,
          totalCount,
          progressPct,
          expectedCount,
          lagCount,
          status,
          statusLabel,
          strategyTitle,
          strategyAdvice,
          nextPendingItem,
        };
      },
    }),
    { name: 'career-os-syllabus' }
  )
);
