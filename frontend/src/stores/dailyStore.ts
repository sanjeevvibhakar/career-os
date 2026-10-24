import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WORKOUT_ROUTINES, type WorkoutRoutine, type ExerciseDefinition } from '../data/gymData';

interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  whatBuilt: string;
  whatLearned: string;
  whatConfused: string;
  bugEncountered: string;
  revisitTopic: string;
  mood: 'GREAT' | 'GOOD' | 'OKAY' | 'LOW' | 'BAD';
  energyLevel: number; // 1-5
  createdAt: string;
}

interface CommunicationLog {
  id: string;
  date: string;
  type: 'SPEAKING' | 'WRITING' | 'TECHNICAL_EXPLANATION' | 'WORKPLACE';
  topic: string;
  durationMinutes: number;
  notes: string;
  rating: number; // 1-5
  createdAt: string;
  wpm?: number;
  audioDurationSec?: number;
  score?: number;
  fillersCount?: number;
}

export interface CompletedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle?: string;
  completed: boolean;
  sets: CompletedSet[];
}

export interface GymSession {
  id: string;
  date: string;
  type: string;
  completed: boolean;
  durationMinutes: number;
  notes: string;
  exercises?: CompletedExercise[];
  totalVolumeKg?: number;
}

export interface ScheduleBlock {
  time: string;
  activity: string;
  category: 'work' | 'study' | 'gym' | 'rest' | 'personal';
}

interface DailyState {
  journals: JournalEntry[];
  communications: CommunicationLog[];
  gymSessions: GymSession[];
  schedule: Record<string, ScheduleBlock[]>; // dayOfWeek -> blocks
  
  // Journal actions
  saveJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  getJournalByDate: (date: string) => JournalEntry | undefined;
  getRecentJournals: (limit: number) => JournalEntry[];
  
  // Communication actions
  saveCommunication: (log: Omit<CommunicationLog, 'id' | 'createdAt'>) => void;
  getRecentCommunications: (limit: number) => CommunicationLog[];
  
  // Gym actions
  saveGymSession: (session: Omit<GymSession, 'id'>) => void;
  getGymByMonth: (yearMonth: string) => GymSession[]; // '2026-10'
  workoutRoutines: WorkoutRoutine[];
  updateWorkoutRoutine: (routineId: string, updates: Partial<WorkoutRoutine>) => void;
  updateExerciseInRoutine: (routineId: string, exerciseId: string, updates: Partial<ExerciseDefinition>) => void;
  addExerciseToRoutine: (routineId: string, exercise: ExerciseDefinition) => void;
  removeExerciseFromRoutine: (routineId: string, exerciseId: string) => void;
  resetRoutinesToDefaults: () => void;
  
  // Schedule actions
  updateSchedule: (dayOfWeek: string, blocks: ScheduleBlock[]) => void;
  getScheduleForDay: (dayOfWeek: string) => ScheduleBlock[];
}

export const DEFAULT_SCHEDULE = {
  'Monday': [
    { time: '06:30-07:45', activity: 'Morning Gym Workout', category: 'gym' as const },
    { time: '07:45-08:30', activity: 'Breakfast + Fresh Up', category: 'personal' as const },
    { time: '08:30-10:15', activity: 'Deep Study Block 1: DSA Practice & Problem Solving', category: 'study' as const },
    { time: '10:15-11:00', activity: 'Commute / Workplace Readiness', category: 'personal' as const },
    { time: '11:00-20:00', activity: 'TCS Training Shift (React Native Assignment)', category: 'work' as const },
    { time: '20:00-20:45', activity: 'Commute + Dinner', category: 'rest' as const },
    { time: '20:45-22:15', activity: 'Deep Study Block 2: Backend Engineering & System Design', category: 'study' as const },
    { time: '22:15-22:45', activity: 'Daily Task Review & Next Day Plan', category: 'study' as const },
    { time: '22:45-06:30', activity: 'Sleep & Physical Recovery', category: 'rest' as const },
  ],
  'Tuesday': [
    { time: '06:30-07:45', activity: 'Morning Gym Workout', category: 'gym' as const },
    { time: '07:45-08:30', activity: 'Breakfast + Fresh Up', category: 'personal' as const },
    { time: '08:30-10:15', activity: 'Deep Study Block 1: DSA Practice & Problem Solving', category: 'study' as const },
    { time: '10:15-11:00', activity: 'Commute / Workplace Readiness', category: 'personal' as const },
    { time: '11:00-20:00', activity: 'TCS Training Shift (React Native Assignment)', category: 'work' as const },
    { time: '20:00-20:45', activity: 'Commute + Dinner', category: 'rest' as const },
    { time: '20:45-22:15', activity: 'Deep Study Block 2: Backend Engineering & System Design', category: 'study' as const },
    { time: '22:15-22:45', activity: 'Daily Task Review & Next Day Plan', category: 'study' as const },
    { time: '22:45-06:30', activity: 'Sleep & Physical Recovery', category: 'rest' as const },
  ],
  'Wednesday': [
    { time: '06:30-07:45', activity: 'Morning Gym Workout', category: 'gym' as const },
    { time: '07:45-08:30', activity: 'Breakfast + Fresh Up', category: 'personal' as const },
    { time: '08:30-10:15', activity: 'Deep Study Block 1: DSA Practice & Problem Solving', category: 'study' as const },
    { time: '10:15-11:00', activity: 'Commute / Workplace Readiness', category: 'personal' as const },
    { time: '11:00-20:00', activity: 'TCS Training Shift (React Native Assignment)', category: 'work' as const },
    { time: '20:00-20:45', activity: 'Commute + Dinner', category: 'rest' as const },
    { time: '20:45-22:15', activity: 'Deep Study Block 2: Backend Engineering & System Design', category: 'study' as const },
    { time: '22:15-22:45', activity: 'Daily Task Review & Next Day Plan', category: 'study' as const },
    { time: '22:45-06:30', activity: 'Sleep & Physical Recovery', category: 'rest' as const },
  ],
  'Thursday': [
    { time: '06:30-07:45', activity: 'Morning Gym Workout', category: 'gym' as const },
    { time: '07:45-08:30', activity: 'Breakfast + Fresh Up', category: 'personal' as const },
    { time: '08:30-10:15', activity: 'Deep Study Block 1: DSA Practice & Problem Solving', category: 'study' as const },
    { time: '10:15-11:00', activity: 'Commute / Workplace Readiness', category: 'personal' as const },
    { time: '11:00-20:00', activity: 'TCS Training Shift (React Native Assignment)', category: 'work' as const },
    { time: '20:00-20:45', activity: 'Commute + Dinner', category: 'rest' as const },
    { time: '20:45-22:15', activity: 'Deep Study Block 2: Backend Engineering & System Design', category: 'study' as const },
    { time: '22:15-22:45', activity: 'Daily Task Review & Next Day Plan', category: 'study' as const },
    { time: '22:45-06:30', activity: 'Sleep & Physical Recovery', category: 'rest' as const },
  ],
  'Friday': [
    { time: '06:30-07:45', activity: 'Morning Gym Workout', category: 'gym' as const },
    { time: '07:45-08:30', activity: 'Breakfast + Fresh Up', category: 'personal' as const },
    { time: '08:30-10:15', activity: 'Deep Study Block 1: DSA Practice & Problem Solving', category: 'study' as const },
    { time: '10:15-11:00', activity: 'Commute / Workplace Readiness', category: 'personal' as const },
    { time: '11:00-20:00', activity: 'TCS Training Shift (React Native Assignment)', category: 'work' as const },
    { time: '20:00-20:45', activity: 'Commute + Dinner', category: 'rest' as const },
    { time: '20:45-22:15', activity: 'Deep Study Block 2: Backend Engineering & System Design', category: 'study' as const },
    { time: '22:15-22:45', activity: 'Daily Task Review & Next Day Plan', category: 'study' as const },
    { time: '22:45-06:30', activity: 'Sleep & Physical Recovery', category: 'rest' as const },
  ],
  'Saturday': [
    { time: '07:00-08:00', activity: 'Wake Up + Breakfast', category: 'personal' as const },
    { time: '08:00-09:30', activity: 'Gym Workout & Mobility', category: 'gym' as const },
    { time: '10:00-13:00', activity: 'Deep Study Block 1: Flagship Backend Engineering Project', category: 'study' as const },
    { time: '13:00-14:30', activity: 'Lunch & Rest', category: 'rest' as const },
    { time: '14:30-17:00', activity: 'Deep Study Block 2: System Design Blueprints & Trade-Offs', category: 'study' as const },
    { time: '17:00-18:30', activity: 'Timed DSA Interview Practice', category: 'study' as const },
    { time: '18:30-22:30', activity: 'Free Time & Social Life', category: 'personal' as const },
    { time: '22:30-07:00', activity: 'Sleep & Recovery', category: 'rest' as const },
  ],
  'Sunday': [
    { time: '07:30-08:30', activity: 'Sleep In & Breakfast', category: 'personal' as const },
    { time: '09:00-11:30', activity: 'Weekly Review: Career Roadmap Progress & DSA Weak Patterns', category: 'study' as const },
    { time: '11:30-13:00', activity: 'System Design Capacity & Back-of-the-Envelope Drills', category: 'study' as const },
    { time: '13:00-22:30', activity: 'Free Time / Social / Rest', category: 'personal' as const },
    { time: '22:30-06:30', activity: 'Sleep & Rest for Next Week', category: 'rest' as const },
  ]
};

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      journals: [],
      communications: [],
      gymSessions: [],
      schedule: DEFAULT_SCHEDULE,

      saveJournal: (entry) => {
        set((state) => {
          const newJournal: JournalEntry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          const filtered = state.journals.filter(j => j.date !== entry.date);
          return { journals: [...filtered, newJournal].sort((a, b) => b.date.localeCompare(a.date)) };
        });
      },

      getJournalByDate: (date) => {
        return get().journals.find(j => j.date === date);
      },

      getRecentJournals: (limit) => {
        return get().journals.slice(0, limit);
      },

      saveCommunication: (log) => {
        set((state) => ({
          communications: [
            {
              ...log,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.communications,
          ].sort((a, b) => b.date.localeCompare(a.date))
        }));
      },

      getRecentCommunications: (limit) => {
        return get().communications.slice(0, limit);
      },

      saveGymSession: (session) => {
        set((state) => {
          const newSession: GymSession = {
            ...session,
            id: crypto.randomUUID(),
          };
          const filtered = state.gymSessions.filter(s => s.date !== session.date);
          return { gymSessions: [...filtered, newSession].sort((a, b) => b.date.localeCompare(a.date)) };
        });
      },

      getGymByMonth: (yearMonth) => {
        return get().gymSessions.filter(s => s.date.startsWith(yearMonth));
      },

      workoutRoutines: WORKOUT_ROUTINES,

      updateWorkoutRoutine: (routineId, updates) => {
        set(state => ({
          workoutRoutines: (state.workoutRoutines || WORKOUT_ROUTINES).map(r =>
            r.id === routineId ? { ...r, ...updates } : r
          )
        }));
      },

      updateExerciseInRoutine: (routineId, exerciseId, updates) => {
        set(state => ({
          workoutRoutines: (state.workoutRoutines || WORKOUT_ROUTINES).map(r => {
            if (r.id !== routineId) return r;
            return {
              ...r,
              exercises: r.exercises.map(ex =>
                ex.id === exerciseId ? { ...ex, ...updates } : ex
              )
            };
          })
        }));
      },

      addExerciseToRoutine: (routineId, exercise) => {
        set(state => ({
          workoutRoutines: (state.workoutRoutines || WORKOUT_ROUTINES).map(r => {
            if (r.id !== routineId) return r;
            return {
              ...r,
              exercises: [...r.exercises, exercise]
            };
          })
        }));
      },

      removeExerciseFromRoutine: (routineId, exerciseId) => {
        set(state => ({
          workoutRoutines: (state.workoutRoutines || WORKOUT_ROUTINES).map(r => {
            if (r.id !== routineId) return r;
            return {
              ...r,
              exercises: r.exercises.filter(ex => ex.id !== exerciseId)
            };
          })
        }));
      },

      resetRoutinesToDefaults: () => {
        set({ workoutRoutines: WORKOUT_ROUTINES });
      },

      updateSchedule: (dayOfWeek, blocks) => {
        set((state) => ({
          schedule: {
            ...state.schedule,
            [dayOfWeek]: blocks,
          }
        }));
      },

      getScheduleForDay: (dayOfWeek) => {
        const schedule = get().schedule;
        if (schedule[dayOfWeek] && schedule[dayOfWeek].length > 0) return schedule[dayOfWeek];
        const normalized = dayOfWeek.toLowerCase();
        for (const [key, val] of Object.entries(schedule)) {
          if (key.toLowerCase() === normalized && val.length > 0) return val;
        }
        for (const [key, val] of Object.entries(DEFAULT_SCHEDULE)) {
          if (key.toLowerCase() === normalized) return val;
        }
        return [];
      }
    }),
    { name: 'career-os-daily' }
  )
);
