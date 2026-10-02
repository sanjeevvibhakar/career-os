export interface CurriculumLevel {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  weeks: string;
  icon: string;
  theme: string;
  color: string;
  whyAtWork: string;
  whyInInterview: string;
  coreConcepts: string[];
  passRule: string;
  recommendedProblemIds: number[];
  practicalWorkAction: string;
  interviewPrepAction: string;
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 0,
    levelNumber: 0,
    title: 'Baseline Primer',
    subtitle: 'Foundation & Confidence Building',
    weeks: 'Weeks 1–3',
    icon: '🌱',
    theme: 'Eliminate syntax fear and build Big-O intuition',
    color: '#10b981', // emerald
    whyAtWork: 'Fast debugging with IDE breakpoints instead of print statements; clean Git branching and PR etiquette.',
    whyInInterview: 'Instantly identifying O(1) vs O(N) vs O(N²) without guessing. Never freezing on basic array/string loops.',
    coreConcepts: [
      'Big-O Time & Space Complexity intuition (loop counting, not complex math)',
      'Array manipulation & frequency maps using HashMaps and HashSets',
      'IDE Debugger mastery (conditional breakpoints, stack trace inspection)',
      'Git workflow (clean commits, feature branches, rebasing)',
    ],
    passRule: 'Solve Two Sum with a HashMap in < 15 mins without hints; zero fear using the IDE debugger at work.',
    recommendedProblemIds: [1, 2, 3, 11, 16], // Two Sum, Contains Duplicate, Valid Anagram, Valid Palindrome, Stock I
    practicalWorkAction: 'Use IDE debugger on every bug this week; write descriptive multi-line Git commit messages.',
    interviewPrepAction: 'Solve 1 problem/day from Level 0; verbalize Big-O out loud before writing a line of code.',
  },
  {
    id: 1,
    levelNumber: 1,
    title: 'Linear Patterns & Production APIs',
    subtitle: 'Two Pointers, Sliding Window & Clean REST',
    weeks: 'Weeks 4–8',
    icon: '⚡',
    theme: 'Master O(N) patterns and write senior-approved REST APIs',
    color: '#3b82f6', // blue
    whyAtWork: 'Design clean REST APIs with input validation, DTOs, idempotency, and structured error handling.',
    whyInInterview: 'Know exactly when to reach for Two Pointers vs Sliding Window vs Binary Search on sorted/contiguous inputs.',
    coreConcepts: [
      'Two Pointers: Inward scanning & Fast/Slow pointer cycle detection',
      'Sliding Window: Fixed window vs Variable window with frequency maps',
      'Binary Search: Exact match, rotated arrays, and binary search on Answer Space',
      'REST API Design: Idempotency, HTTP status codes, global exception handling with @ControllerAdvice',
    ],
    passRule: 'Solve Search in Rotated Sorted Array & 3Sum independently; design a complete CRUD API with DTO validation.',
    recommendedProblemIds: [12, 13, 14, 17, 18, 20, 21, 23, 24, 25, 26, 27, 28, 31, 32],
    practicalWorkAction: 'Refactor messy controller endpoints at work to use DTOs and global validation handlers.',
    interviewPrepAction: 'Practice the 2-minute pattern classification rule before coding any problem.',
  },
  {
    id: 2,
    levelNumber: 2,
    title: 'Non-Linear Structures & Database Depth',
    subtitle: 'Trees, Heaps, SQL Indexing & Caching',
    weeks: 'Weeks 9–16',
    icon: '🌳',
    theme: 'Think recursively and eliminate slow database queries',
    color: '#8b5cf6', // purple
    whyAtWork: 'Fix slow DB queries with composite B-Tree indexes, solve the N+1 JPA query problem, implement Redis cache-aside.',
    whyInInterview: 'Comfortably navigate Tree recursion (DFS/BFS), BST invariants, and Top-K Priority Queue patterns.',
    coreConcepts: [
      'Binary Tree traversals (DFS Pre/In/Post and BFS Level-Order using Queue)',
      'Binary Search Tree properties and validation',
      'Min/Max Heaps for streaming data and Top-K optimization',
      'SQL B-Tree indexing, reading EXPLAIN ANALYZE, JPA JOIN FETCH to cure N+1',
      'Redis Cache-Aside pattern, TTL, cache invalidation strategies',
    ],
    passRule: 'Write Tree DFS/BFS templates from memory in < 5 mins; explain how B-Tree indexes work to a teammate.',
    recommendedProblemIds: [33, 35, 36, 37, 38, 39, 40, 42, 43, 44, 46],
    practicalWorkAction: 'Inspect slow queries in your current project using EXPLAIN ANALYZE and add proper composite indexes.',
    interviewPrepAction: 'Solve 1 Tree problem every morning; explain the recursion call stack out loud.',
  },
  {
    id: 3,
    levelNumber: 3,
    title: 'Graphs & Distributed Foundations',
    subtitle: 'Networks, Message Queues & High-Level Design',
    weeks: 'Weeks 17–26',
    icon: '🕸️',
    theme: 'Connect complex systems and understand enterprise scale',
    color: '#06b6d4', // cyan
    whyAtWork: 'Understand asynchronous decoupling with Kafka/RabbitMQ; manage database replication and read replicas.',
    whyInInterview: 'Standard graph modeling (BFS/DFS, Topological Sort) and High-Level System Design (HLD) building blocks.',
    coreConcepts: [
      'Graph representations: Adjacency list, grid traversal, multi-source BFS',
      'Directed Acyclic Graphs (DAG) & Topological Sort (Kahn’s algorithm)',
      'Asynchronous messaging: Kafka producer-consumer, consumer groups, idempotency',
      'High-Level Design: Load balancing (L4/L7), DB sharding, CAP Theorem in practical terms',
      'STAR Behavioral stories (Situation, Task, Action, Result) for engineering impact',
    ],
    passRule: 'Code Number of Islands and Course Schedule cleanly in < 25 mins; articulate Kafka vs synchronous HTTP trade-offs.',
    recommendedProblemIds: [47, 48, 49, 50, 51, 52, 74, 75, 76],
    practicalWorkAction: 'Document an architectural data flow diagram for one existing microservice in your company.',
    interviewPrepAction: 'Draft and rehearse 4 STAR stories: tough bug solved, performance optimized, disagreement handled.',
  },
  {
    id: 4,
    levelNumber: 4,
    title: 'Dynamic Programming & Machine Coding',
    subtitle: 'Optimization Templates & Low-Level Design (LLD)',
    weeks: 'Weeks 27–38',
    icon: '🧮',
    theme: 'Demystify DP and write clean, modular object-oriented software',
    color: '#f59e0b', // amber
    whyAtWork: 'Write decoupled, extensible code using Strategy, Factory, and Observer patterns that pass senior reviews with ease.',
    whyInInterview: 'Solve classic 1D/2D DP problems using the 3-step framework (Recursion → Memoize → Tabulate); ace LLD rounds.',
    coreConcepts: [
      '3-Step DP Framework: Recursive brute force → Memoization cache → Iterative table',
      '1D DP: Climbing Stairs, House Robber, Coin Change, LIS',
      '2D DP: Grid paths, Longest Common Subsequence, Edit Distance',
      'SOLID Principles applied to real code refactoring',
      'Machine Coding / LLD classic problems: Rate Limiter, Notification Engine, Parking Lot',
    ],
    passRule: 'Identify overlapping subproblems and state transitions for Coin Change; write an extensible Rate Limiter in 45 mins.',
    recommendedProblemIds: [53, 54, 55, 56, 57, 58, 59, 60, 62, 63],
    practicalWorkAction: 'Refactor a complex legacy switch/case or if/else chain at work into a clean Strategy or Factory pattern.',
    interviewPrepAction: 'Do timed 35-minute DP problem drills; never spend > 20 mins stuck before checking the recurrence relation.',
  },
  {
    id: 5,
    levelNumber: 5,
    title: 'Tier-1 Calibration & Interview Drills',
    subtitle: 'Full Mocks, Bar Raiser & Final Offer Prep',
    weeks: 'Weeks 39–50',
    icon: '🏆',
    theme: 'Simulate real pressure and convert preparation into Tier-1 offers',
    color: '#ef4444', // rose
    whyAtWork: 'Lead design discussions, mentor junior engineers, evaluate technical trade-offs with high agency.',
    whyInInterview: 'Pass Tier-1 product interviews (Google, Amazon, Flipkart, Razorpay) with confident communication and calm execution.',
    coreConcepts: [
      'Random mixed problem sets under strict 30-minute timers',
      'End-to-end 45-minute System Design sessions (URL shortener, Chat system, Video pipeline)',
      '8–12 structured mock interviews (the research-proven threshold for +30% pass rate)',
      'Amazon 16 Leadership Principles & Google Rubrics alignment',
      'Negotiation strategy and offer evaluation',
    ],
    passRule: '120+ total solved patterns across all tiers; 8+ realistic mock interviews completed with strong hire ratings.',
    recommendedProblemIds: [8, 15, 19, 34, 41, 45, 65, 69],
    practicalWorkAction: 'Lead a technical design review at work; write a technical RFC for a new feature.',
    interviewPrepAction: 'Schedule weekly mock interviews on Pramp or with senior mentors; do real-time think-aloud coding.',
  },
];

export function getLevelForProblem(problemId: number): number {
  for (const level of CURRICULUM_LEVELS) {
    if (level.recommendedProblemIds.includes(problemId)) {
      return level.levelNumber;
    }
  }
  // Fallback heuristics based on topic id
  if ([1, 6].includes(problemId)) return 0;
  if ([3, 4, 5, 8, 9].includes(problemId)) return 1;
  if ([10, 11, 12].includes(problemId)) return 2;
  if ([13, 19].includes(problemId)) return 3;
  if ([14, 15, 16].includes(problemId)) return 4;
  return 5;
}
