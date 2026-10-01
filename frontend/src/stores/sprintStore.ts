import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TechSprint {
  id: string;
  technology: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  totalWeeks: number;
  currentWeek: number;
  weeks: SprintWeek[];
}

interface SprintWeek {
  weekNumber: number;
  focus: string;
  goals: string;
  completed: boolean;
}

interface LearningLog {
  id: string;
  sprintId: string | null;
  date: string;
  topic: string;
  plannedMinutes: number;
  actualMinutes: number;
  understanding: number; // 1-5
  notes: string;
  resourcesUsed: string;
  createdAt: string;
}

interface SprintState {
  sprints: TechSprint[];
  logs: LearningLog[];
  
  createSprint: (sprint: Omit<TechSprint, 'id' | 'weeks'> & { weeks: Omit<SprintWeek, never>[] }) => void;
  updateSprint: (id: string, updates: Partial<TechSprint>) => void;
  completeWeek: (sprintId: string, weekNumber: number) => void;
  getActiveSprint: () => TechSprint | undefined;
  
  createLog: (log: Omit<LearningLog, 'id' | 'createdAt'>) => void;
  getRecentLogs: (limit: number) => LearningLog[];
  getLogsByDate: (date: string) => LearningLog[];
}

export const useSprintStore = create<SprintState>()(
  persist(
    (set, get) => ({
      sprints: [],
      logs: [],

      createSprint: (sprint) => {
        set((state) => ({
          sprints: [
            ...state.sprints,
            { ...sprint, id: crypto.randomUUID() }
          ]
        }));
      },

      updateSprint: (id, updates) => {
        set((state) => ({
          sprints: state.sprints.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
      },

      completeWeek: (sprintId, weekNumber) => {
        set((state) => ({
          sprints: state.sprints.map(s => {
            if (s.id !== sprintId) return s;
            return {
              ...s,
              weeks: s.weeks.map(w => w.weekNumber === weekNumber ? { ...w, completed: true } : w)
            };
          })
        }));
      },

      getActiveSprint: () => {
        return get().sprints.find(s => s.status === 'ACTIVE');
      },

      createLog: (log) => {
        set((state) => ({
          logs: [
            {
              ...log,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.logs
          ].sort((a, b) => b.date.localeCompare(a.date))
        }));
      },

      getRecentLogs: (limit) => {
        return get().logs.slice(0, limit);
      },

      getLogsByDate: (date) => {
        return get().logs.filter(l => l.date === date);
      }
    }),
    { name: 'career-os-sprint' }
  )
);
