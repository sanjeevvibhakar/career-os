export const populateDayOneEfforts = () => {
  const today = '2026-10-01';

  // 1. DSA Store
  const dsaAttemptId = 'day1-attempt-twosum';
  const dsaData = {
    state: {
      attempts: [
        {
          id: dsaAttemptId,
          problemId: 1, // Two Sum
          attemptNumber: 1,
          timeTakenMin: 22,
          solvedIndependently: true,
          approach: 'Used single-pass Hash Map lookup. Maintained map of (target - num -> index). Looked up complement in O(1) time before inserting current element.',
          mistake: 'None on logic; previously tried two-pointer without sorting first.',
          complexityTime: 'O(N)',
          complexitySpace: 'O(N)',
          lesson: 'Whenever pair sum or lookup is required, trade O(N) space for O(1) lookup time using a hash map.',
          confidence: 5,
          attemptedAt: `${today}T08:00:00.000Z`,
        }
      ],
      revisions: [
        {
          id: 'day1-rev-1',
          attemptId: dsaAttemptId,
          problemId: 1,
          revisionNumber: 1,
          scheduledDate: '2026-10-02',
          completedDate: null,
          timeTakenMin: null,
          confidence: null,
          status: 'PENDING',
        },
        {
          id: 'day1-rev-2',
          attemptId: dsaAttemptId,
          problemId: 1,
          revisionNumber: 2,
          scheduledDate: '2026-10-04',
          completedDate: null,
          timeTakenMin: null,
          confidence: null,
          status: 'PENDING',
        },
        {
          id: 'day1-rev-3',
          attemptId: dsaAttemptId,
          problemId: 1,
          revisionNumber: 3,
          scheduledDate: '2026-10-08',
          completedDate: null,
          timeTakenMin: null,
          confidence: null,
          status: 'PENDING',
        },
        {
          id: 'day1-rev-4',
          attemptId: dsaAttemptId,
          problemId: 1,
          revisionNumber: 4,
          scheduledDate: '2026-10-22',
          completedDate: null,
          timeTakenMin: null,
          confidence: null,
          status: 'PENDING',
        },
        {
          id: 'day1-rev-5',
          attemptId: dsaAttemptId,
          problemId: 1,
          revisionNumber: 5,
          scheduledDate: '2026-11-30',
          completedDate: null,
          timeTakenMin: null,
          confidence: null,
          status: 'PENDING',
        }
      ]
    },
    version: 0
  };

  // 2. Daily Store
  const dailyData = {
    state: {
      journals: [
        {
          id: 'day1-journal',
          date: today,
          whatBuilt: 'Career OS deployment pipeline on Cloudflare Workers edge and modern TypeScript architecture.',
          whatLearned: 'Spaced repetition algorithms (+1, +3, +7, +21, +60 days) to prevent algorithmic forgetting curves.',
          whatConfused: 'Cloudflare Workers static assets routing vs pages redirect compatibility.',
          bugEncountered: 'Cloudflare 100324 redirect loop; resolved by using native single-page-application handling.',
          revisitTopic: 'Sliding window variable size edge cases.',
          mood: 'GREAT',
          energyLevel: 5,
          createdAt: `${today}T21:30:00.000Z`,
        }
      ],
      gymSessions: [
        {
          id: 'day1-gym',
          date: today,
          type: 'UPPER',
          completed: true,
          durationMinutes: 60,
          notes: 'Winter Arc Day 1 Push Routine: Incline DB press (32kg), Seated OHP, Lateral raises, Cable pushdowns.',
        }
      ],
      communications: [
        {
          id: 'day1-comm',
          date: today,
          type: 'TECHNICAL_EXPLANATION',
          topic: 'Verbalizing Hash Map Lookup vs Two Pointers in Arrays to an interviewer',
          durationMinutes: 15,
          notes: 'Practiced speaking aloud without filler words; clearly stated time-space complexity trade-offs.',
          rating: 5,
          createdAt: `${today}T21:15:00.000Z`,
        }
      ]
    },
    version: 0
  };

  // 3. Sprint Store
  const sprintData = {
    state: {
      sprints: [
        {
          id: 'sprint-1',
          technology: 'Java 21 & Distributed Systems',
          description: 'Deep dive into virtual threads, concurrency models, and scalable backend architectures.',
          startDate: today,
          endDate: '2026-10-28',
          status: 'ACTIVE',
          totalWeeks: 4,
          currentWeek: 1,
          weeks: [
            { weekNumber: 1, focus: 'Virtual Threads & Structured Concurrency', goals: 'Platform threads vs Project Loom benchmarks', completed: false },
            { weekNumber: 2, focus: 'Redis Caching & Distributed Locks', goals: 'Redlock algorithm & cache stampede prevention', completed: false },
            { weekNumber: 3, focus: 'Kafka Event Pipelines', goals: 'Consumer groups, partition keys, idempotent writes', completed: false },
            { weekNumber: 4, focus: 'System Design Capstone', goals: 'Rate Limiter & Task Orchestrator', completed: false },
          ]
        }
      ],
      logs: [
        {
          id: 'day1-log',
          sprintId: 'sprint-1',
          date: today,
          topic: 'Platform Threads vs Virtual Threads (Project Loom)',
          plannedMinutes: 90,
          actualMinutes: 90,
          understanding: 5,
          notes: 'Benchmarked 100k concurrent tasks. Platform threads exhaust OS memory; virtual threads run on carrier pool with minimal heap overhead.',
          resourcesUsed: 'Oracle JDK 21 Docs & Inside Java podcast',
          createdAt: `${today}T20:00:00.000Z`,
        }
      ]
    },
    version: 0
  };

  // 4. Dashboard Store
  const dashboardData = {
    state: {
      streaks: [
        { type: 'dsa', currentCount: 1, bestCount: 1, lastActivityDate: today },
        { type: 'gym', currentCount: 1, bestCount: 1, lastActivityDate: today },
        { type: 'journal', currentCount: 1, bestCount: 1, lastActivityDate: today },
        { type: 'communication', currentCount: 1, bestCount: 1, lastActivityDate: today },
        { type: 'learning', currentCount: 1, bestCount: 1, lastActivityDate: today },
      ],
      reviews: []
    },
    version: 0
  };

  localStorage.setItem('career-os-dsa', JSON.stringify(dsaData));
  localStorage.setItem('career-os-daily', JSON.stringify(dailyData));
  localStorage.setItem('career-os-sprint', JSON.stringify(sprintData));
  localStorage.setItem('career-os-dashboard', JSON.stringify(dashboardData));
};
