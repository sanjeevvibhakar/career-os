import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Streak {
  type: 'dsa' | 'gym' | 'journal' | 'communication' | 'learning';
  currentCount: number;
  bestCount: number;
  lastActivityDate: string | null;
}

interface WeeklyReview {
  id: string;
  weekStartDate: string;
  dsaProblemsSolved: number;
  dsaAccuracy: number;
  techHours: number;
  projectHours: number;
  gymSessions: number;
  sleepAvg: number;
  biggestWin: string;
  biggestStruggle: string;
  nextWeekFocus: string;
  nextWeekDsaTheme: string;
  nextWeekTechTheme: string;
  notes: string;
  createdAt: string;
}

interface DashboardState {
  streaks: Streak[];
  reviews: WeeklyReview[];
  
  updateStreak: (type: Streak['type']) => void;
  getStreaks: () => Streak[];
  
  saveReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  getLatestReview: () => WeeklyReview | undefined;
  getReviewByWeek: (weekStartDate: string) => WeeklyReview | undefined;
}

const INITIAL_STREAKS: Streak[] = [
  { type: 'dsa', currentCount: 0, bestCount: 0, lastActivityDate: null },
  { type: 'gym', currentCount: 0, bestCount: 0, lastActivityDate: null },
  { type: 'journal', currentCount: 0, bestCount: 0, lastActivityDate: null },
  { type: 'communication', currentCount: 0, bestCount: 0, lastActivityDate: null },
  { type: 'learning', currentCount: 0, bestCount: 0, lastActivityDate: null },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      streaks: INITIAL_STREAKS,
      reviews: [],

      updateStreak: (type) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

          return {
            streaks: state.streaks.map(streak => {
              if (streak.type !== type) return streak;

              if (streak.lastActivityDate === today) {
                return streak; // Already logged today
              }

              let newCurrentCount = 1;
              if (streak.lastActivityDate === yesterday) {
                newCurrentCount = streak.currentCount + 1;
              }

              return {
                ...streak,
                currentCount: newCurrentCount,
                bestCount: Math.max(streak.bestCount, newCurrentCount),
                lastActivityDate: today,
              };
            })
          };
        });
      },

      getStreaks: () => get().streaks,

      saveReview: (review) => {
        set((state) => {
          const newReview: WeeklyReview = {
            ...review,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          const filtered = state.reviews.filter(r => r.weekStartDate !== review.weekStartDate);
          return {
            reviews: [...filtered, newReview].sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
          };
        });
      },

      getLatestReview: () => {
        return get().reviews[0];
      },

      getReviewByWeek: (weekStartDate) => {
        return get().reviews.find(r => r.weekStartDate === weekStartDate);
      }
    }),
    { name: 'career-os-dashboard' }
  )
);
