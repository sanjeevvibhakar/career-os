import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface ScheduleBlock {
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
  
  // Schedule actions
  updateSchedule: (dayOfWeek: string, blocks: ScheduleBlock[]) => void;
  getScheduleForDay: (dayOfWeek: string) => ScheduleBlock[];
}

const DEFAULT_SCHEDULE = {
  'Monday': [
    { time: '05:45', activity: 'Wake Up', category: 'personal' as const },
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-07:45', activity: 'Breakfast + Get Ready', category: 'personal' as const },
    { time: '07:45-08:15', activity: 'DSA Problem', category: 'study' as const },
    { time: '08:15-09:00', activity: 'Commute', category: 'personal' as const },
    { time: '09:00-18:00', activity: 'Work', category: 'work' as const },
    { time: '18:00-18:45', activity: 'Commute', category: 'personal' as const },
    { time: '18:45-19:45', activity: 'Dinner + Rest', category: 'rest' as const },
    { time: '19:45-21:15', activity: 'Deep Preparation', category: 'study' as const },
    { time: '21:15-21:30', activity: 'Communication Practice', category: 'study' as const },
    { time: '21:30-22:00', activity: 'Journal + Review', category: 'study' as const },
    { time: '22:00-22:30', activity: 'Wind Down', category: 'rest' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Tuesday': [
    { time: '05:45', activity: 'Wake Up', category: 'personal' as const },
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-07:45', activity: 'Breakfast + Get Ready', category: 'personal' as const },
    { time: '07:45-08:15', activity: 'DSA Problem', category: 'study' as const },
    { time: '08:15-09:00', activity: 'Commute', category: 'personal' as const },
    { time: '09:00-18:00', activity: 'Work', category: 'work' as const },
    { time: '18:00-18:45', activity: 'Commute', category: 'personal' as const },
    { time: '18:45-19:45', activity: 'Dinner + Rest', category: 'rest' as const },
    { time: '19:45-21:15', activity: 'Deep Preparation', category: 'study' as const },
    { time: '21:15-21:30', activity: 'Communication Practice', category: 'study' as const },
    { time: '21:30-22:00', activity: 'Journal + Review', category: 'study' as const },
    { time: '22:00-22:30', activity: 'Wind Down', category: 'rest' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Wednesday': [
    { time: '05:45', activity: 'Wake Up', category: 'personal' as const },
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-07:45', activity: 'Breakfast + Get Ready', category: 'personal' as const },
    { time: '07:45-08:15', activity: 'DSA Problem', category: 'study' as const },
    { time: '08:15-09:00', activity: 'Commute', category: 'personal' as const },
    { time: '09:00-18:00', activity: 'Work', category: 'work' as const },
    { time: '18:00-18:45', activity: 'Commute', category: 'personal' as const },
    { time: '18:45-19:45', activity: 'Dinner + Rest', category: 'rest' as const },
    { time: '19:45-21:15', activity: 'Deep Preparation', category: 'study' as const },
    { time: '21:15-21:30', activity: 'Communication Practice', category: 'study' as const },
    { time: '21:30-22:00', activity: 'Journal + Review', category: 'study' as const },
    { time: '22:00-22:30', activity: 'Wind Down', category: 'rest' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Thursday': [
    { time: '05:45', activity: 'Wake Up', category: 'personal' as const },
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-07:45', activity: 'Breakfast + Get Ready', category: 'personal' as const },
    { time: '07:45-08:15', activity: 'DSA Problem', category: 'study' as const },
    { time: '08:15-09:00', activity: 'Commute', category: 'personal' as const },
    { time: '09:00-18:00', activity: 'Work', category: 'work' as const },
    { time: '18:00-18:45', activity: 'Commute', category: 'personal' as const },
    { time: '18:45-19:45', activity: 'Dinner + Rest', category: 'rest' as const },
    { time: '19:45-21:15', activity: 'Deep Preparation', category: 'study' as const },
    { time: '21:15-21:30', activity: 'Communication Practice', category: 'study' as const },
    { time: '21:30-22:00', activity: 'Journal + Review', category: 'study' as const },
    { time: '22:00-22:30', activity: 'Wind Down', category: 'rest' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Friday': [
    { time: '05:45', activity: 'Wake Up', category: 'personal' as const },
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-07:45', activity: 'Breakfast + Get Ready', category: 'personal' as const },
    { time: '07:45-08:15', activity: 'DSA Problem', category: 'study' as const },
    { time: '08:15-09:00', activity: 'Commute', category: 'personal' as const },
    { time: '09:00-18:00', activity: 'Work', category: 'work' as const },
    { time: '18:00-18:45', activity: 'Commute', category: 'personal' as const },
    { time: '18:45-19:45', activity: 'Dinner + Rest', category: 'rest' as const },
    { time: '19:45-21:15', activity: 'Deep Preparation', category: 'study' as const },
    { time: '21:15-21:30', activity: 'Communication Practice', category: 'study' as const },
    { time: '21:30-22:00', activity: 'Journal + Review', category: 'study' as const },
    { time: '22:00-22:30', activity: 'Wind Down', category: 'rest' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Saturday': [
    { time: '06:00-07:00', activity: 'Gym', category: 'gym' as const },
    { time: '07:00-08:00', activity: 'Breakfast', category: 'personal' as const },
    { time: '08:00-10:00', activity: 'DSA Deep Dive', category: 'study' as const },
    { time: '10:00-13:00', activity: 'Project Work', category: 'study' as const },
    { time: '13:00-14:00', activity: 'Lunch', category: 'personal' as const },
    { time: '14:00-17:00', activity: 'Technology Sprint', category: 'study' as const },
    { time: '17:00-18:00', activity: 'Communication Practice', category: 'study' as const },
    { time: '18:00-19:00', activity: 'Weekly Review', category: 'study' as const },
    { time: '19:00-22:00', activity: 'Free Time', category: 'personal' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
  ],
  'Sunday': [
    { time: '07:00-08:00', activity: 'Sleep In + Breakfast', category: 'personal' as const },
    { time: '08:00-10:00', activity: 'Light DSA Review', category: 'study' as const },
    { time: '10:00-12:00', activity: 'System Design Study', category: 'study' as const },
    { time: '12:00-22:00', activity: 'Free / Social / Rest', category: 'personal' as const },
    { time: '22:30', activity: 'Sleep', category: 'rest' as const },
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

      updateSchedule: (dayOfWeek, blocks) => {
        set((state) => ({
          schedule: {
            ...state.schedule,
            [dayOfWeek]: blocks,
          }
        }));
      },

      getScheduleForDay: (dayOfWeek) => {
        return get().schedule[dayOfWeek] || [];
      }
    }),
    { name: 'career-os-daily' }
  )
);
