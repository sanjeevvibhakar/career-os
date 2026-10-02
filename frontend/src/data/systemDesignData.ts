export interface SystemDesignBlueprint {
  id: string;
  title: string;
  category: string;
  difficulty: 'MEDIUM' | 'HARD';
  targetCompanies: string[];
  summary: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  keyComponents: {
    name: string;
    role: string;
    technology: string;
  }[];
  estimationBaseline: {
    dau: string;
    readQps: string;
    writeQps: string;
    storagePerYear: string;
  };
  tradeOffs: {
    challenge: string;
    solution: string;
    tradeoff: string;
  }[];
}

export const SYSTEM_DESIGN_BLUEPRINTS: SystemDesignBlueprint[] = [
  {
    id: 'rate-limiter',
    title: 'Distributed API Rate Limiter',
    category: 'Infrastructure & Security',
    difficulty: 'MEDIUM',
    targetCompanies: ['Google', 'Stripe', 'Amazon', 'Cloudflare'],
    summary: 'Design a distributed rate limiter to protect backend services from abuse, DDoS, and API exhaustion while maintaining sub-millisecond check latency.',
    functionalReqs: [
      'Throttle requests exceeding predefined limit (e.g., 100 req/min per user/IP).',
      'Return HTTP 429 Too Many Requests with Retry-After header.',
      'Support tiered limits per user tier (Free, Pro, Enterprise).',
    ],
    nonFunctionalReqs: [
      'Ultra-low latency: < 2ms overhead per API check.',
      'High availability: If rate limiter crashes, default to fail-open so legitimate traffic is not blocked.',
      'Distributed accuracy across multi-region server clusters.',
    ],
    keyComponents: [
      { name: 'API Gateway / Reverse Proxy', role: 'Intercepts incoming traffic before application servers', technology: 'Envoy / NGINX' },
      { name: 'Distributed Cache Cluster', role: 'Maintains atomic token counts and sliding windows', technology: 'Redis Cluster / KeyDB' },
      { name: 'Rules Engine & Config DB', role: 'Stores rate limit rules per client tier', technology: 'PostgreSQL + Etcd' },
      { name: 'Local In-Memory Cache', role: 'Caches user tier rules locally to avoid network hops', technology: 'Caffeine Cache' },
    ],
    estimationBaseline: {
      dau: '100M Active Clients',
      readQps: '50,000 QPS Peak',
      writeQps: '50,000 QPS (every request updates counter)',
      storagePerYear: '100M users × 64 bytes in Redis ≈ 6.4 GB RAM',
    },
    tradeOffs: [
      {
        challenge: 'Race conditions when multiple parallel requests hit Redis simultaneously.',
        solution: 'Execute Redis Lua Scripts to atomically check and decrement tokens in a single round-trip.',
        tradeoff: 'Lua scripts block single-threaded Redis shard briefly; keep scripts minimal.',
      },
      {
        challenge: 'Multi-datacenter synchronization latency.',
        solution: 'Local rate limiting with periodic asynchronous batch synchronization, or eventual consistency via CRDTs.',
        tradeoff: 'Slight over-quota allowance during split-brain cross-region sync.',
      },
    ],
  },
  {
    id: 'tinyurl',
    title: 'Scalable URL Shortener (TinyURL)',
    category: 'High-Scale Storage',
    difficulty: 'MEDIUM',
    targetCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
    summary: 'Design a service that takes long URLs and produces short 7-character aliases, redirecting users with minimal latency.',
    functionalReqs: [
      'Given a long URL, generate a unique 7-character short URL.',
      'Redirect short URL (HTTP 301/302) to original long URL.',
      'Allow optional custom aliases and expiration dates.',
    ],
    nonFunctionalReqs: [
      'Highly read-heavy system (100:1 read-to-write ratio).',
      'P99 redirection latency < 15ms.',
      '100% link durability: Generated URLs must never be lost.',
    ],
    keyComponents: [
      { name: 'KGS (Key Generation Service)', role: 'Pre-generates unique 7-character Base62 keys offline and stores in DB', technology: 'Go / Java Worker + Zookeeper' },
      { name: 'Web / App Tier', role: 'Handles shortening and redirection requests statelessly', technology: 'Spring Boot 3 / Go' },
      { name: 'Distributed Cache', role: 'Caches top 20% hottest URLs (80-20 rule)', technology: 'Redis / Memcached' },
      { name: 'Persistent Database', role: 'Stores mapping: short_key -> original_url, user_id, created_at', technology: 'MongoDB / DynamoDB / PostgreSQL' },
    ],
    estimationBaseline: {
      dau: '500M New URLs / month',
      readQps: '20,000 Read QPS',
      writeQps: '200 Write QPS',
      storagePerYear: '500M × 12 × 500B ≈ 3 TB / year (15 TB over 5 years)',
    },
    tradeOffs: [
      {
        challenge: 'Preventing duplicate keys without runtime collision checking.',
        solution: 'Standalone Key Generation Service (KGS) marks keys as used atomically, loading keys in memory batches.',
        tradeoff: 'If KGS dies, keys held in memory are lost (negligible loss out of 62^7 = 3.5 trillion keys).',
      },
      {
        challenge: 'HTTP 301 Permanent vs HTTP 302 Temporary Redirect.',
        solution: 'Use HTTP 302 if tracking analytics/click metrics is required, since browser caches 301 and bypasses server.',
        tradeoff: 'HTTP 302 increases server read load slightly compared to 301 browser caching.',
      },
    ],
  },
  {
    id: 'chat-system',
    title: 'Real-Time Chat & Messaging (WhatsApp/Slack)',
    category: 'Real-Time Concurrency',
    difficulty: 'HARD',
    targetCompanies: ['Meta', 'Uber', 'Discord', 'Swiggy'],
    summary: 'Design a massive real-time messaging platform supporting 1-on-1 chat, group messages, presence indicators, and offline delivery.',
    functionalReqs: [
      '1-on-1 and group instant messaging with low latency (< 100ms).',
      'Message status: Sent, Delivered, Read ticks.',
      'Online / Last seen presence indicators.',
      'Offline message queuing and push notifications.',
    ],
    nonFunctionalReqs: [
      'Millions of persistent concurrent connections.',
      'Zero message loss (at-least-once delivery with client deduplication).',
      'End-to-end security and horizontal scaling.',
    ],
    keyComponents: [
      { name: 'WebSocket Gateway Cluster', role: 'Maintains long-lived duplex TCP/WebSocket connections with mobile clients', technology: 'Netty / Go WebSockets' },
      { name: 'Message Broker', role: 'Buffers and distributes messages across session servers', technology: 'Apache Kafka / RabbitMQ' },
      { name: 'Presence Service', role: 'Tracks user online status via periodic heartbeats', technology: 'Redis Pub/Sub & Key Expire' },
      { name: 'Chat History Store', role: 'LSM-tree append-only storage for chat histories', technology: 'Apache Cassandra / ScyllaDB' },
    ],
    estimationBaseline: {
      dau: '100M Daily Active Users',
      readQps: '100,000 QPS (fetching recent chats)',
      writeQps: '50,000 Messages / sec',
      storagePerYear: '500M messages/day × 200B ≈ 100 GB/day ≈ 36.5 TB/year',
    },
    tradeOffs: [
      {
        challenge: 'Routing messages to a user connected to a different WebSocket server.',
        solution: 'A Redis Session Store maps `user_id -> server_id`. The publisher routes via Kafka partition to target server.',
        tradeoff: 'Redis session lookup adds ~1ms network hop per outbound message.',
      },
      {
        challenge: 'Chat history storage schema for sequential reads.',
        solution: 'Cassandra with Partition Key: `chat_id`, Clustering Key: `message_id` (time-ordered UUIDv7).',
        tradeoff: 'Very fast writes and sequential range scans; cross-chat queries are not supported without secondary indexes.',
      },
    ],
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway & Idempotent Ledger',
    category: 'Financial Reliability & ACID',
    difficulty: 'HARD',
    targetCompanies: ['Stripe', 'Razorpay', 'Amazon', 'PayPal'],
    summary: 'Design a mission-critical payment processing system guaranteeing zero duplicate charges, exactly-once semantics, and audit-proof double-entry ledger balance.',
    functionalReqs: [
      'Process credit/debit card, UPI, and wallet transactions.',
      'Enforce strict idempotency: multiple retries of same payment request must never double-charge.',
      'Immutable double-entry ledger recording all credit/debit movements.',
      'Reconciliation worker verifying bank settlement statements.',
    ],
    nonFunctionalReqs: [
      '100% Data Consistency: Zero financial discrepancies.',
      'Strict Audit Trail: No records can ever be deleted or updated in-place.',
      'High Availability for checkout flow.',
    ],
    keyComponents: [
      { name: 'Idempotency Layer', role: 'Intercepts requests with Idempotency-Key header using distributed lock', technology: 'Redis Redlock + PostgreSQL' },
      { name: 'Payment Orchestrator', role: 'Coordinates bank calls, tokenization, and multi-step Saga transactions', technology: 'Cadence / Temporal / Spring Boot' },
      { name: 'Double-Entry Ledger DB', role: 'Append-only ledger entries where every transaction has matching Debit and Credit', technology: 'PostgreSQL (B-Tree + WAL)' },
      { name: 'Event Bus', role: 'Emits PaymentSucceeded / PaymentFailed domain events', technology: 'Apache Kafka' },
    ],
    estimationBaseline: {
      dau: '10M Transactions / day',
      readQps: '1,500 Read QPS',
      writeQps: '500 TPS Peak',
      storagePerYear: '10M tx × 4 ledger rows × 200B ≈ 8 GB / day ≈ 3 TB / year',
    },
    tradeOffs: [
      {
        challenge: 'Handling network timeouts while waiting for bank gateway response.',
        solution: 'Mark transaction as `PENDING`. Asynchronously query bank status via webhook or polling cron; do not fail or retry blind.',
        tradeoff: 'Requires user UI to handle pending states gracefully.',
      },
      {
        challenge: 'Idempotency lock race condition during retry spam.',
        solution: 'PostgreSQL unique constraint on `(client_id, idempotency_key)` inside serializable transaction.',
        tradeoff: 'Rejects simultaneous parallel requests with HTTP 409 Conflict until initial transaction finalizes.',
      },
    ],
  },
  {
    id: 'uber-dispatch',
    title: 'Geospatial Driver Matching (Uber/Grab)',
    category: 'Spatial Indexing & Concurrency',
    difficulty: 'HARD',
    targetCompanies: ['Uber', 'Lyft', 'Grab', 'Google Maps'],
    summary: 'Design a location-based matching system tracking millions of moving driver locations and finding nearby drivers within 5km in sub-second time.',
    functionalReqs: [
      'Drivers send GPS updates every 4 seconds.',
      'Riders request rides and see available nearby drivers on map.',
      'Match rider with optimal driver based on ETA and location.',
    ],
    nonFunctionalReqs: [
      'Massive write throughput of driver GPS updates (500k writes/sec).',
      'P99 nearby driver query latency < 50ms.',
      'Graceful handling of GPS jitter and network drops.',
    ],
    keyComponents: [
      { name: 'Location Ingestion Service', role: 'Consumes high-frequency GPS pings via lightweight UDP/WebSockets', technology: 'Go / Netty + Kafka' },
      { name: 'Spatial Indexing Engine', role: 'Partitions Earth surface into discrete hierarchical cells', technology: 'Uber H3 (Hexagonal) / Google S2' },
      { name: 'Live Location Cache', role: 'Stores driver current cell and location in memory', technology: 'Redis GEO / In-Memory Quadtree' },
      { name: 'Dispatch & Matching Worker', role: 'Calculates shortest ETA and reserves driver with distributed lock', technology: 'Rust / Java Dispatch Engine' },
    ],
    estimationBaseline: {
      dau: '1M Active Drivers pinging every 4s',
      readQps: '20,000 Ride Search QPS',
      writeQps: '250,000 GPS Pings / sec',
      storagePerYear: 'In-memory working set: 1M drivers × 64B ≈ 64 MB RAM',
    },
    tradeOffs: [
      {
        challenge: 'Traditional SQL B-Tree with (lat, lon) is terribly slow for 2D bounding box range queries.',
        solution: 'Convert (lat, lon) to 1D spatial hash index (Uber H3 Hexagon ID or Geohash). Range search becomes single key lookup + 6 neighbor cells.',
        tradeoff: 'Hexagonal approximation loses micro-meter precision, but is 100x faster for radius searches.',
      },
      {
        challenge: 'Two riders dispatched the exact same driver simultaneously.',
        solution: 'Distributed lock with TTL on `driver_id` during ride offer window (15s timeout).',
        tradeoff: 'Rider 2 experiences a brief 200ms reroute delay to the second closest driver.',
      },
    ],
  },
];
