export interface Flashcard {
  id: string;
  category: 'JAVA_CONCURRENCY' | 'DISTRIBUTED_SYSTEMS' | 'DATABASE_INTERNALS' | 'DSA_PATTERNS' | 'SPRING_BOOT';
  categoryLabel: string;
  question: string;
  answer: string;
  codeSnippet?: string;
  keyTakeaway: string;
}

export const FLASHCARDS_DATA: Flashcard[] = [
  // 1. Java 21 & Concurrency
  {
    id: 'java-1',
    category: 'JAVA_CONCURRENCY',
    categoryLabel: 'Java 21 & Concurrency',
    question: 'How do Java 21 Virtual Threads differ from traditional Platform Threads?',
    answer: 'Platform threads are 1:1 wrappers around OS kernel threads (heavyweight, ~1MB stack memory, context switching managed by OS). Virtual threads are lightweight user-mode threads managed by the JVM (Project Loom). They have shallow dynamic call stacks (~few KB) and are mounted onto a small pool of carrier ForkJoinPool threads during execution, unmounting whenever blocked on I/O.',
    keyTakeaway: 'Allows 1,000,000 concurrent threads for I/O-bound microservices without reactive syntax overhead.',
  },
  {
    id: 'java-2',
    category: 'JAVA_CONCURRENCY',
    categoryLabel: 'Java 21 & Concurrency',
    question: 'What is Thread Pinning in Virtual Threads and how do you prevent it?',
    answer: 'Thread pinning occurs when a Virtual Thread cannot unmount from its carrier thread when blocked. In Java 21, this happens primarily when blocking inside a `synchronized` block/method or native call (JNI).',
    keyTakeaway: 'Replace `synchronized` blocks with `java.util.concurrent.locks.ReentrantLock` so the JVM can freely unmount the virtual thread during blocking operations.',
  },
  {
    id: 'java-3',
    category: 'JAVA_CONCURRENCY',
    categoryLabel: 'Java 21 & Concurrency',
    question: 'Explain the Java Memory Model "Happens-Before" relationship with `volatile`.',
    answer: 'A write to a `volatile` variable happens-before every subsequent read of that same variable. This prevents compiler and CPU hardware instruction reordering across the memory barrier and ensures that changes made by one thread are immediately visible across CPU caches to all other threads.',
    keyTakeaway: 'Volatile guarantees visibility and ordering, but NOT atomicity (e.g. `count++` is not atomic with volatile).',
  },
  {
    id: 'java-4',
    category: 'JAVA_CONCURRENCY',
    categoryLabel: 'Java 21 & Concurrency',
    question: 'How does Compare-And-Swap (CAS) work in AtomicInteger and LongAdder?',
    answer: 'CAS is an atomic CPU hardware instruction (e.g., `CMPXCHG` on x86). It checks if the memory location holds expected value V; if so, it updates to new value N; otherwise, it fails and retries. `LongAdder` improves on AtomicLong under high thread contention by striping the counter into an array of cell variables per thread, reducing CPU cache-line bouncing.',
    keyTakeaway: 'Use `LongAdder` for high-throughput write-heavy metrics collection, `AtomicLong` when exact single-variable atomic sequencing is needed.',
  },
  {
    id: 'java-5',
    category: 'JAVA_CONCURRENCY',
    categoryLabel: 'Java 21 & Concurrency',
    question: 'When should you use `CompletableFuture` vs Virtual Threads in modern Java?',
    answer: 'Virtual threads make sequential, blocking code as fast as asynchronous code without callback spaghetti. However, `CompletableFuture` is still ideal for composing multiple concurrent asynchronous tasks (e.g. `CompletableFuture.allOf(...)`, racing with `.anyOf()`, or complex functional pipelines).',
    keyTakeaway: 'Use Virtual Threads for structured concurrency & blocking I/O; use `CompletableFuture` for fan-out/fan-in task composition.',
  },

  // 2. Distributed Systems & Microservices
  {
    id: 'dist-1',
    category: 'DISTRIBUTED_SYSTEMS',
    categoryLabel: 'Distributed Systems',
    question: 'What is the difference between the 2-Phase Commit (2PC) and Saga Pattern?',
    answer: '2PC is a synchronous, blocking distributed transaction coordinator protocol guaranteeing ACID across distributed DBs, but suffers from high latency and single-point-of-coordinator failure. The Saga pattern breaks a distributed transaction into a sequence of local transactions coordinated via events (Choreography) or an orchestrator service. If a step fails, the Saga executes compensating transactions (rollback undo actions).',
    keyTakeaway: 'Sagas trade immediate consistency (ACID) for eventual consistency (BASE), enabling high availability in microservices.',
  },
  {
    id: 'dist-2',
    category: 'DISTRIBUTED_SYSTEMS',
    categoryLabel: 'Distributed Systems',
    question: 'How does Consistent Hashing work and why are Virtual Nodes essential?',
    answer: 'Consistent Hashing maps both cache servers and data keys onto a circular hash ring (0 to 2^32-1). A key is stored on the first server encountered moving clockwise. When a node is added or removed, only K/N keys need to be remapped on average. Virtual Nodes (each physical server mapped to 100-200 points on the ring) prevent non-uniform distribution and hot spots.',
    keyTakeaway: 'Virtual nodes ensure uniform hash distribution and predictable failover loads in DynamoDB and Cassandra.',
  },
  {
    id: 'dist-3',
    category: 'DISTRIBUTED_SYSTEMS',
    categoryLabel: 'Distributed Systems',
    question: 'What is a Cache Stampede (Dog-piling) and how do you mitigate it?',
    answer: 'A cache stampede occurs when a highly requested cache key expires, and hundreds of concurrent application threads simultaneously miss the cache and overwhelm the backend database to regenerate the value.',
    keyTakeaway: 'Mitigations: 1. Distributed mutex/lock on key refresh (only 1 thread computes, others wait). 2. Probabilistic early expiration (XFetch algorithm). 3. Background asynchronous worker refreshed before TTL.',
  },
  {
    id: 'dist-4',
    category: 'DISTRIBUTED_SYSTEMS',
    categoryLabel: 'Distributed Systems',
    question: 'Explain the Token Bucket vs Leaky Bucket Rate Limiting algorithms.',
    answer: 'Token Bucket: Tokens are added to a bucket of fixed capacity at a constant rate $R$. A request consumes a token; if empty, it is dropped or queued. It permits short bursts of traffic up to the bucket capacity. Leaky Bucket: Requests enter a FIFO queue and leak out to the processing engine at a strictly fixed constant rate, smoothing traffic completely without bursts.',
    keyTakeaway: 'Token Bucket is standard for APIs allowing burstiness (Stripe, AWS); Leaky Bucket is used for traffic shaping downstream.',
  },
  {
    id: 'dist-5',
    category: 'DISTRIBUTED_SYSTEMS',
    categoryLabel: 'Distributed Systems',
    question: 'What is PACELC theorem and how does it extend the CAP theorem?',
    answer: 'CAP theorem only describes system behavior during a network partition (P). PACELC says: If there is a Partition (P), trade off Availability (A) vs Consistency (C); Else (E) when system is running normally, trade off Latency (L) vs Consistency (C).',
    keyTakeaway: 'MongoDB is PC/EC; Cassandra and DynamoDB are PA/EL (prioritize low latency and availability even in normal operations).',
  },

  // 3. Database Internals & Storage Engines
  {
    id: 'db-1',
    category: 'DATABASE_INTERNALS',
    categoryLabel: 'Database Internals',
    question: 'Compare B-Tree vs LSM-Tree (Log-Structured Merge-tree) storage engines.',
    answer: 'B-Trees (PostgreSQL, MySQL InnoDB): In-place updates on disk pages. Provides $O(\\log N)$ fast reads and point lookups, but high random disk I/O on writes. LSM-Trees (Cassandra, RocksDB): Append-only writes to an in-memory MemTable, flushed sequentially to immutable SSTables on disk, compacted in the background. Exceptional write throughput, but reads may require checking multiple SSTables (mitigated by Bloom filters).',
    keyTakeaway: 'B-Trees for read-heavy transactional workloads; LSM-Trees for high-write ingest velocity.',
  },
  {
    id: 'db-2',
    category: 'DATABASE_INTERNALS',
    categoryLabel: 'Database Internals',
    question: 'What is the difference between Read Committed and Repeatable Read isolation levels?',
    answer: 'Read Committed: A transaction only reads committed data (no Dirty Reads). However, reading the same row twice may return different values if another transaction commits changes in between (Non-Repeatable Read). Repeatable Read: Guarantees that any row read during the transaction remains identical on subsequent reads using MVCC snapshots. (In Postgres, Repeatable Read also prevents phantom rows).',
    keyTakeaway: 'PostgreSQL uses MVCC (Multi-Version Concurrency Control) so readers never block writers and writers never block readers.',
  },
  {
    id: 'db-3',
    category: 'DATABASE_INTERNALS',
    categoryLabel: 'Database Internals',
    question: 'How do you determine the optimal HikariCP Connection Pool size?',
    answer: 'More connections do NOT mean faster throughput due to CPU thread context switching and disk spindle saturation. PostgreSQL and HikariCP recommend the formula: `connections = ((core_count * 2) + effective_spindle_count)`. For an 8-core server with SSD, a pool of 16-20 connections will often saturate the DB and achieve maximum QPS with lowest latency.',
    keyTakeaway: 'Keep connection pools tight (10–30) rather than inflating to 200, which degrades performance via lock contention.',
  },

  // 4. Spring Boot & Production Best Practices
  {
    id: 'spring-1',
    category: 'SPRING_BOOT',
    categoryLabel: 'Spring Boot 3',
    question: 'Why does `@Transactional` fail when calling a method from within the same class?',
    answer: 'Spring manages `@Transactional` via CGLIB dynamic proxies. When an external bean calls the proxy, the proxy intercepts the call, opens the transaction, and delegates to the target. When a method calls another `@Transactional` method within the same class (`this.method()`), the proxy is bypassed, so no transaction interceptor executes.',
    keyTakeaway: 'Solution: Extract the transactional method to a separate bean, or self-inject the proxy via `@Autowired private SelfService self;`.',
  },
  {
    id: 'spring-2',
    category: 'SPRING_BOOT',
    categoryLabel: 'Spring Boot 3',
    question: 'How do you prevent the JPA N+1 Query Problem in Spring Data JPA?',
    answer: 'The N+1 problem occurs when fetching an entity with lazy relationships triggers 1 initial query followed by N individual queries for each related child entity. Mitigations: 1. Use `@EntityGraph(attributePaths = {"children"})` on the repository method. 2. Write JPQL with `JOIN FETCH e.children`. 3. Set `@BatchSize(size = 50)` on the relationship.',
    keyTakeaway: 'Always verify SQL logs in dev with `spring.jpa.show-sql: true` or DataSource-Proxy to prevent hidden N+1 queries in production.',
  },

  // 5. DSA Pattern Spotters
  {
    id: 'dsa-1',
    category: 'DSA_PATTERNS',
    categoryLabel: 'DSA Pattern Spotter',
    question: 'How do you immediately spot a Monotonic Stack problem in an interview?',
    answer: 'Keywords: "Next greater element", "Previous smaller element", "Daily temperatures", "Largest rectangle in histogram", "Stock span". If the problem asks for the nearest element satisfying a comparison relation for each item in an array in $O(N)$ time, maintain elements in strictly ascending or descending order on a stack.',
    keyTakeaway: 'A Monotonic Stack computes the nearest greater/smaller element for all array positions in linear time.',
  },
  {
    id: 'dsa-2',
    category: 'DSA_PATTERNS',
    categoryLabel: 'DSA Pattern Spotter',
    question: 'When should you use Fast & Slow Pointers (Floyd\'s Tortoise and Hare)?',
    answer: '1. Cycle detection in Linked Lists or implicit sequence graphs (e.g. Find the Duplicate Number). 2. Finding the middle element of a linked list in a single pass. 3. Finding the $K$-th node from the end. 4. Determining palindrome linked lists by reversing the second half.',
    keyTakeaway: 'When Fast moves at 2x speed and Slow at 1x, their meeting point proves a cycle and gives mathematical distance to the cycle entrance.',
  },
  {
    id: 'dsa-3',
    category: 'DSA_PATTERNS',
    categoryLabel: 'DSA Pattern Spotter',
    question: 'What is the standard template for "Binary Search on Answer Space"?',
    answer: 'Used when the problem asks for the "minimum maximum" or "maximum minimum" capacity, time, or rate (e.g., Koko Eating Bananas, Capacity To Ship Packages). The search space is bounded between `[minPossible, maxPossible]`. A greedy helper function `canFeasible(mid)` returns boolean in $O(N)$. If feasible, explore the better half; otherwise, discard.',
    keyTakeaway: 'Time complexity is $O(N \\log(\\text{range}))$. If monotonicity holds on feasibility, binary search the answer.',
  },
];
