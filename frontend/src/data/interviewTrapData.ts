export interface InterviewTrapCard {
  id: string;
  category: 'Java & Concurrency' | 'Spring & APIs' | 'Databases & SQL' | 'Distributed Systems & Redis';
  title: string;
  question: string;
  commonTrap: string;
  executiveAnswer: string;
  codeSnippet?: string;
  keyRule: string;
}

export const INTERVIEW_TRAP_CARDS: InterviewTrapCard[] = [
  // 1. Java & Concurrency
  {
    id: 'trap-1',
    category: 'Java & Concurrency',
    title: 'Virtual Threads vs Platform Threads (Java 21)',
    question: 'Why should you NOT pool Virtual Threads with an ExecutorService in Java 21?',
    commonTrap: 'Candidates often say "You should pool them like standard thread pools to save memory."',
    executiveAnswer: 'Virtual Threads are extremely lightweight JVM objects (a few KB of metadata vs ~1MB OS stack for Platform Threads). Creating them has near-zero overhead. Pooling them artificially constrains concurrency and defeats their purpose. Always create a new Virtual Thread per task using Executors.newVirtualThreadPerTaskExecutor(). The only resource you might pool is the underlying database connection or limited external socket, never the virtual threads themselves.',
    codeSnippet: `// Correct Java 21 Pattern:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> fetchHttpApi(i));
    });
} // auto-joins on close`,
    keyRule: 'Rule: Pool external resources (connections), NEVER pool Virtual Threads.'
  },
  {
    id: 'trap-2',
    category: 'Java & Concurrency',
    title: 'volatile vs AtomicInteger & Race Conditions',
    question: 'Does the volatile keyword in Java guarantee atomic increments (e.g. count++)?',
    commonTrap: 'Believing volatile makes all operations thread-safe including compound assignments.',
    executiveAnswer: 'No. volatile only guarantees Visibility (flushing CPU cache directly to main memory) and Ordering (preventing compiler instruction reordering). It does NOT guarantee Atomicity. count++ is 3 distinct bytecode operations: read, increment, and write. Two threads reading simultaneously will still overwrite each other. Use AtomicInteger (CAS operations) or synchronized / ReentrantLock for atomic compound actions.',
    codeSnippet: `volatile int count = 0; // count++ is NOT thread-safe!
AtomicInteger safeCount = new AtomicInteger(0); // safeCount.incrementAndGet() is lock-free & safe.`,
    keyRule: 'Rule: volatile = Visibility only. AtomicInteger = Lock-free CAS Atomicity.'
  },
  {
    id: 'trap-3',
    category: 'Java & Concurrency',
    title: 'HashMap Rehashing & Race Conditions',
    question: 'What happens if multiple threads invoke HashMap.put() concurrently in Java 8+?',
    commonTrap: 'Saying "It will just throw ConcurrentModificationException" or "It creates an infinite loop in Java 8".',
    executiveAnswer: 'In Java 7, concurrent resize could create a circular linked list (infinite loop). Java 8 fixed the loop by maintaining head/tail order, but ConcurrentHashMap is still mandatory. In regular HashMap under concurrency, bucket collisions cause silent data loss (lost updates) because node linkage updates are not synchronized. Use ConcurrentHashMap, which employs synchronized blocks on bucket heads for fine-grained per-bin locking without global locks.',
    keyRule: 'Rule: Unsynchronized HashMap under concurrency causes silent data loss. Use ConcurrentHashMap.'
  },

  // 2. Spring Boot & APIs
  {
    id: 'trap-4',
    category: 'Spring & APIs',
    title: '@Transactional Self-Invocation Trap',
    question: 'Why does calling a @Transactional method from another method in the SAME class fail to start a transaction?',
    commonTrap: 'Assuming Spring inspects internal method invocations within the same Java bean.',
    executiveAnswer: 'Spring manages @Transactional using Dynamic Proxies (CGLIB or JDK dynamic proxy). When external callers invoke a bean method, the call routes through the proxy interceptor which opens and commits the transaction. But internal self-invocations (this.methodB()) bypass the proxy completely and invoke the raw target instance directly, meaning the transaction aspect is never triggered. Solution: Move the transactional method to a separate service bean or inject the self-bean.',
    codeSnippet: `@Service
public class OrderService {
    public void processOrder() {
        this.saveToDb(); // ⚠️ NO TRANSACTION! Bypasses Spring CGLIB proxy.
    }
    @Transactional
    public void saveToDb() { ... }
}`,
    keyRule: 'Rule: Spring AOP proxies only intercept calls originating from OUTSIDE the bean.'
  },
  {
    id: 'trap-5',
    category: 'Spring & APIs',
    title: 'POST vs PUT Idempotency & Partial Updates',
    question: 'How do PUT and PATCH differ in REST? What makes an endpoint strictly idempotent?',
    commonTrap: 'Using PUT for updating a single field, or confusing idempotency with safety.',
    executiveAnswer: 'PUT is idempotent and replaces the entire target resource state (if fields are omitted, they are reset or nullified). PATCH modifies only the specified partial fields. Idempotent means f(f(x)) = f(x): calling the endpoint 10 times consecutively produces the exact same server state as calling it once. POST creates a resource each time (non-idempotent). PUT and DELETE are idempotent; GET is safe (read-only).',
    keyRule: 'Rule: PUT = Full resource replacement (idempotent). PATCH = Delta modification.'
  },

  // 3. Databases & SQL
  {
    id: 'trap-6',
    category: 'Databases & SQL',
    title: 'Composite Index Column Ordering (Leftmost Prefix Rule)',
    question: 'If you create an index on (tenant_id, created_at, status), will a query filtering ONLY on status use this index?',
    commonTrap: 'Assuming that since "status" is included in the index, PostgreSQL or MySQL will use it automatically.',
    executiveAnswer: 'No. B-Tree composite indices follow the Leftmost Prefix Rule. The index is sorted first by tenant_id, then by created_at, then by status. Searching only for "status" without tenant_id cannot traverse the tree from the root and results in a full table scan. The query must filter on the leading columns (tenant_id, or tenant_id + created_at) to utilize the index hierarchy.',
    codeSnippet: `-- Index: CREATE INDEX idx_orders ON orders (tenant_id, created_at, status);
SELECT * FROM orders WHERE status = 'PAID'; -- ❌ Full Table Scan
SELECT * FROM orders WHERE tenant_id = 42 AND created_at > '2026-01-01'; -- ✅ Uses Index`,
    keyRule: 'Rule: Composite B-Tree indices require queries to match the leftmost columns first.'
  },
  {
    id: 'trap-7',
    category: 'Databases & SQL',
    title: 'Hibernate / JPA N+1 Query Problem & Solutions',
    question: 'What is the N+1 problem in JPA/Hibernate, and why is FetchType.LAZY alone NOT the solution?',
    commonTrap: 'Saying "Just change FetchType to LAZY on all relationships."',
    executiveAnswer: 'FetchType.LAZY only defers loading until the getter is called in code. If you fetch 100 Orders and iterate through them calling order.getCustomer(), Hibernate fires 1 initial query + 100 individual queries for each customer (1 + N = 101 queries). The real solutions are: (1) JOIN FETCH in JPQL/HQL to retrieve both entities in a single SQL JOIN, (2) EntityGraph (@EntityGraph), or (3) @BatchSize to load batches in IN(...) clauses.',
    codeSnippet: `// Solution: Single query with JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.status = :status")
List<Order> findWithCustomer(@Param("status") String status);`,
    keyRule: 'Rule: LAZY defers queries; it does not eliminate N+1. Use JOIN FETCH or @EntityGraph.'
  },

  // 4. Distributed Systems & Redis
  {
    id: 'trap-8',
    category: 'Distributed Systems & Redis',
    title: 'Cache Stampede (Thundering Herd) & Mitigations',
    question: 'What happens when a viral hot key expires in Redis? How do you prevent database crash?',
    commonTrap: 'Only mentioning "increase the TTL".',
    executiveAnswer: 'When a heavily queried key expires, thousands of concurrent requests encounter a cache miss at the exact same millisecond. All of them query the database simultaneously to recompute the value, overwhelming the DB connection pool. Mitigations: (1) Distributed Mutex Lock (only 1 request acquires lock to compute & update cache; others wait or return stale), (2) Probabilistic Early Expiration (XFetch algorithm: background worker refreshes before expiry), or (3) Background Cron pre-warming.',
    codeSnippet: `// Mutex Cache-Aside Pattern:
String val = redis.get(key);
if (val == null) {
    if (redis.setNx(lockKey, "1", 5_SECONDS)) {
        val = db.computeExpensiveQuery();
        redis.set(key, val, 1_HOUR);
        redis.del(lockKey);
    } else {
        Thread.sleep(50); // wait and retry cache
        return redis.get(key);
    }
}`,
    keyRule: 'Rule: High-traffic keys need Mutex Locks or Probabilistic Early Expiry to protect databases.'
  },
  {
    id: 'trap-9',
    category: 'Distributed Systems & Redis',
    title: 'Kafka Consumer Group Rebalancing & Heartbeats',
    question: 'Why does long-running message processing cause duplicate message consumption in Kafka?',
    commonTrap: 'Assuming Kafka automatically knows the worker is busy as long as the TCP socket is open.',
    executiveAnswer: 'Kafka consumer poll loops have a max.poll.interval.ms timeout. If consumer business logic takes longer than this threshold to process a batch of records, the consumer fails to invoke poll() in time. The Kafka coordinator assumes the consumer has crashed or died and triggers a Consumer Group Rebalance, assigning those partitions to another consumer. When the new consumer starts, it re-reads from the last committed offset, leading to duplicate processing. Solution: Keep message processing asynchronous, reduce max.poll.records, or increase max.poll.interval.ms.',
    keyRule: 'Rule: Heavy work exceeding max.poll.interval.ms causes involuntary consumer rebalance and duplicate processing.'
  }
];
