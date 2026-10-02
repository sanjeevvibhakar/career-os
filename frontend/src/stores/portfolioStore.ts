import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  location: string;
  currentFocus: string;
  email: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  architectureNotes: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  category: 'Backend' | 'Database & Storage' | 'Distributed Systems' | 'Frontend' | 'DevOps & Tools';
  proficiency: number; // 0-100
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
}

interface PortfolioState {
  profile: ProfileData;
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  experiences: PortfolioExperience[];

  // Profile actions
  updateProfile: (updates: Partial<ProfileData>) => void;

  // Project CRUD
  addProject: (project: Omit<PortfolioProject, 'id'>) => void;
  updateProject: (id: string, updates: Partial<PortfolioProject>) => void;
  deleteProject: (id: string) => void;

  // Skill CRUD
  addSkill: (skill: Omit<PortfolioSkill, 'id'>) => void;
  updateSkill: (id: string, updates: Partial<PortfolioSkill>) => void;
  deleteSkill: (id: string) => void;

  // Experience CRUD
  addExperience: (exp: Omit<PortfolioExperience, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<PortfolioExperience>) => void;
  deleteExperience: (id: string) => void;

  // Reset
  resetToDefaults: () => void;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Sanjeev Vibhakar',
  title: 'Software Engineer | Backend & Distributed Systems',
  bio: 'Building resilient backend microservices, high-throughput message pipelines, and modern reactive interfaces. Specialized in Java 21, Spring Boot 3, Apache Kafka, PostgreSQL, and Clean Architecture.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  resumeUrl: '#',
  githubUrl: 'https://github.com/sanjeevvibhakar',
  linkedinUrl: 'https://linkedin.com/in/sanjeev-vibhakar',
  location: 'India',
  currentFocus: 'High-Throughput Microservices & Tier-1 Switch Preparation',
  email: 'sanjeev.vibhakar@example.com',
};

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Career OS — Autonomous Engineer Platform',
    slug: 'career-os',
    description: 'All-in-one Career OS with an algorithmic master roadmap, spaced repetition DSA tracker, 1-click tech syllabus, and offline-first PWA architecture.',
    longDescription: 'Engineered an offline-first progressive web application combining a public engineering portfolio with a private execution command center. Features circadian-aligned daily goals, automated Leitner spaced revisions (+1, +3, +7, +21, +60 days), and cross-device Supabase syncing.',
    architectureNotes: 'Vite + React 18, TypeScript, Tailwind CSS, Zustand persistence, Service Worker precaching (Workbox), Supabase cloud backup.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'PWA', 'Supabase'],
    githubUrl: 'https://github.com/sanjeevvibhakar/career-os',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'High-Throughput Event Processing Engine',
    slug: 'event-processing-engine',
    description: 'Distributed event processing pipeline handling 25,000+ msg/sec with idempotency, DLQ routing, and consumer autoscaling.',
    longDescription: 'Designed an asynchronous event-driven backend service consuming order events from Apache Kafka. Implemented distributed deduplication with Redis and dead-letter queue (DLQ) automated replay with exponential backoff.',
    architectureNotes: 'Spring Boot 3, Apache Kafka, PostgreSQL with Flyway migrations, Redis token bucket rate limiting, Docker Compose cluster.',
    techStack: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'PostgreSQL', 'Redis', 'Docker'],
    githubUrl: '#',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'Distributed Cache-Aside Resilience Service',
    slug: 'distributed-cache-service',
    description: 'Sub-millisecond query acceleration microservice with Redis caching, B-Tree index optimization, and Resilience4j circuit breakers.',
    longDescription: 'Engineered a read-heavy microservice utilizing the Cache-Aside pattern with randomized TTL jitter to eliminate cache stampedes. Reduced p99 database latency from 180ms to 4ms under simulated load.',
    architectureNotes: 'Java 21 Virtual Threads, Spring Data JPA with JOIN FETCH to cure N+1 queries, Resilience4j Circuit Breakers, Prometheus & Grafana metrics.',
    techStack: ['Java 21', 'Spring Boot', 'Redis', 'PostgreSQL', 'Resilience4j', 'Grafana'],
    githubUrl: '#',
    liveUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
];

const DEFAULT_SKILLS: PortfolioSkill[] = [
  { id: 's-1', name: 'Java 21 & Concurrency', category: 'Backend', proficiency: 92 },
  { id: 's-2', name: 'Spring Boot 3 & REST APIs', category: 'Backend', proficiency: 90 },
  { id: 's-3', name: 'Clean Architecture & OOP', category: 'Backend', proficiency: 88 },
  { id: 's-4', name: 'PostgreSQL & Query Optimization', category: 'Database & Storage', proficiency: 86 },
  { id: 's-5', name: 'Redis Caching & Data Structures', category: 'Database & Storage', proficiency: 84 },
  { id: 's-6', name: 'Apache Kafka & Event Streaming', category: 'Distributed Systems', proficiency: 82 },
  { id: 's-7', name: 'Microservices & System Design', category: 'Distributed Systems', proficiency: 80 },
  { id: 's-8', name: 'TypeScript & Modern React', category: 'Frontend', proficiency: 84 },
  { id: 's-9', name: 'Tailwind CSS & Responsive UI', category: 'Frontend', proficiency: 88 },
  { id: 's-10', name: 'Docker & Containerization', category: 'DevOps & Tools', proficiency: 78 },
  { id: 's-11', name: 'Git, CI/CD & Linux', category: 'DevOps & Tools', proficiency: 85 },
];

const DEFAULT_EXPERIENCE: PortfolioExperience[] = [
  {
    id: 'exp-1',
    company: 'Enterprise Software Engineering',
    role: 'Software Engineer',
    period: '2024 – Present',
    startDate: '2024-01-01',
    endDate: null,
    description: 'Engineered and scaled core backend services, designed RESTful APIs with strict contract validations, reduced slow database query response times by 40% using composite B-Tree indexes, and contributed to asynchronous event ingestion pipelines.',
    technologies: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redis', 'Docker', 'React', 'TypeScript'],
  },
];

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      experiences: DEFAULT_EXPERIENCE,

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      addProject: (project) => {
        set((state) => ({
          projects: [
            ...state.projects,
            { ...project, id: crypto.randomUUID() },
          ],
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addSkill: (skill) => {
        set((state) => ({
          skills: [
            ...state.skills,
            { ...skill, id: crypto.randomUUID() },
          ],
        }));
      },

      updateSkill: (id, updates) => {
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSkill: (id) => {
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }));
      },

      addExperience: (exp) => {
        set((state) => ({
          experiences: [
            ...state.experiences,
            { ...exp, id: crypto.randomUUID() },
          ],
        }));
      },

      updateExperience: (id, updates) => {
        set((state) => ({
          experiences: state.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteExperience: (id) => {
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        }));
      },

      resetToDefaults: () => {
        set({
          profile: DEFAULT_PROFILE,
          projects: DEFAULT_PROJECTS,
          skills: DEFAULT_SKILLS,
          experiences: DEFAULT_EXPERIENCE,
        });
      },
    }),
    { name: 'career-os-portfolio' }
  )
);
