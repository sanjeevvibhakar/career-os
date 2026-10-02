// Auth
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { email: string; password: string; name: string }
export interface AuthResponse { token: string; refreshToken: string; name: string; email: string }
export interface User { id: number; name: string; email: string; role: string }

// Portfolio
export interface Profile {
  id: number; title: string; bio: string; avatarUrl: string;
  resumeUrl: string; githubUrl: string; linkedinUrl: string;
  location: string; currentFocus: string;
}
export interface Project {
  id: number; title: string; slug: string; description: string;
  longDescription: string; architectureNotes: string;
  techStack: string[]; githubUrl: string; liveUrl: string;
  imageUrl: string; challenges: string; results: string;
  featured: boolean;
}
export interface Skill {
  id: number; name: string; category: string;
  proficiency: number; evidenceCount: number;
}
export interface Experience {
  id: number; company: string; role: string;
  startDate: string; endDate: string | null;
  description: string; technologies: string[];
}
export interface Achievement {
  id: number; title: string; description: string;
  achievedDate: string; category: string;
}

// DSA
export interface DsaTopic {
  id: number; name: string; description: string;
  icon: string; color: string;
  totalProblems: number; solvedProblems: number;
  averageConfidence: number;
}
export interface DsaProblem {
  id: number; name: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  source: string; sourceUrl: string; pattern: string;
  topicName: string; attemptCount: number;
  lastAttemptDate: string | null; confidence: number;
  nextRevisionDate: string | null;
}
export interface DsaAttemptRequest {
  timeTakenMin: number; solvedIndependently: boolean;
  approach: string; mistake: string;
  complexityTime: string; complexitySpace: string;
  lesson: string; confidence: number;
}
export interface DsaAttempt {
  id: number; attemptNumber: number; timeTakenMin: number;
  solvedIndependently: boolean; approach: string;
  mistake: string; complexityTime: string;
  complexitySpace: string; lesson: string;
  confidence: number; attemptedAt: string;
}
export interface DsaRevision {
  id: number; problemName: string; topicName: string;
  revisionNumber: number; scheduledDate: string;
  completedDate: string | null; timeTakenMin: number;
  confidence: number; status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}
export interface DsaStats {
  totalSolved: number; totalProblems: number;
  easyCount: number; mediumCount: number; hardCount: number;
  streakDays: number;
  topicMastery: TopicMastery[];
}
export interface TopicMastery {
  topicName: string; solved: number; total: number;
  averageConfidence: number; percentage: number;
}

// Learning
export interface TechSprint {
  id: number; technology: string; description: string;
  startDate: string; endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  totalWeeks: number; currentWeek: number;
  weeks: SprintWeek[];
}
export interface SprintWeek {
  id: number; weekNumber: number; focus: string;
  goals: string; completed: boolean;
}
export interface DailyLearningLog {
  id: number; date: string; topic: string;
  plannedMinutes: number; actualMinutes: number;
  understanding: number; notes: string;
  resourcesUsed: string;
}

// Daily
export interface JournalEntry {
  id: number; date: string; whatBuilt: string;
  whatLearned: string; whatConfused: string;
  bugEncountered: string; revisitTopic: string;
  mood: 'GREAT' | 'GOOD' | 'OKAY' | 'LOW' | 'BAD';
  energyLevel: number;
}
export interface CommunicationLog {
  id: number | string; date: string;
  type: 'SPEAKING' | 'WRITING' | 'TECHNICAL_EXPLANATION' | 'WORKPLACE';
  topic: string; durationMinutes: number;
  notes: string; rating: number;
  wpm?: number; audioDurationSec?: number; score?: number; fillersCount?: number;
}
export interface GymSession {
  id: number; date: string;
  type: 'UPPER' | 'LOWER' | 'CARDIO' | 'SPORT' | 'REST';
  completed: boolean; durationMinutes: number; notes: string;
}

// Dashboard
export interface Dashboard {
  userName: string;
  todaysDsa: { problemName: string; topicName: string; pattern: string } | null;
  todaysTech: { sprintName: string; weekFocus: string; topic: string } | null;
  todaysComm: string;
  streaks: {
    dsa: { currentCount: number; bestCount: number };
    gym: { currentCount: number; bestCount: number };
    journal: { currentCount: number; bestCount: number };
    communication: { currentCount: number; bestCount: number };
  };
  currentBottleneck: string;
  dueRevisions: number;
  weeklyProof: string;
}

// Weekly Review
export interface WeeklyReview {
  id: number | string; weekStartDate: string;
  dsaProblemsSolved: number; dsaAccuracy: number;
  techHours: number; projectHours: number;
  gymSessions: number; sleepAvg: number;
  biggestWin: string; biggestStruggle: string;
  nextWeekFocus: string; nextWeekDsaTheme: string;
  nextWeekTechTheme: string; notes: string;
  syllabusTopicsCount?: number;
  commSessionsCount?: number;
  adherenceScore?: number;
  journalDaysCount?: number;
}

// API wrapper
export interface ApiResponse<T> {
  success: boolean; message: string; data: T;
}
