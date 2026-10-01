import { Pool } from 'pg';
import { DSA_TOPICS, DSA_PROBLEMS } from './data/dsaProblems.js';

const connectionString = process.env.DATABASE_URL || process.env.SPRING_DATASOURCE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  : null;

// Initialize schema on boot
export async function initDb() {
  if (!pool) {
    console.log('⚡ No PostgreSQL DATABASE_URL found. Running in resilient in-memory mode.');
    return;
  }

  try {
    const client = await pool.connect();
    console.log('✓ Connected to PostgreSQL Database.');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dsa_attempts (
        id VARCHAR(64) PRIMARY KEY,
        problem_id INTEGER NOT NULL,
        attempt_number INTEGER NOT NULL,
        time_taken_min INTEGER,
        solved_independently BOOLEAN DEFAULT true,
        approach TEXT,
        mistake TEXT,
        complexity_time VARCHAR(50),
        complexity_space VARCHAR(50),
        lesson TEXT,
        confidence INTEGER,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS dsa_revisions (
        id VARCHAR(64) PRIMARY KEY,
        attempt_id VARCHAR(64) REFERENCES dsa_attempts(id) ON DELETE CASCADE,
        problem_id INTEGER NOT NULL,
        revision_number INTEGER NOT NULL,
        scheduled_date VARCHAR(20) NOT NULL,
        completed_date VARCHAR(20),
        time_taken_min INTEGER,
        confidence INTEGER,
        status VARCHAR(20) DEFAULT 'PENDING'
      );

      CREATE TABLE IF NOT EXISTS journal_entries (
        id VARCHAR(64) PRIMARY KEY,
        date VARCHAR(20) NOT NULL,
        what_built TEXT,
        what_learned TEXT,
        what_confused TEXT,
        bug_encountered TEXT,
        revisit_topic TEXT,
        mood VARCHAR(20),
        energy_level INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS streaks (
        type VARCHAR(50) PRIMARY KEY,
        current_count INTEGER DEFAULT 0,
        best_count INTEGER DEFAULT 0,
        last_activity_date VARCHAR(20)
      );
    `);

    // Initialize default streaks
    const streakTypes = ['dsa', 'gym', 'journal', 'communication', 'learning'];
    for (const type of streakTypes) {
      await client.query(`
        INSERT INTO streaks (type, current_count, best_count)
        VALUES ($1, 0, 0)
        ON CONFLICT (type) DO NOTHING
      `, [type]);
    }

    client.release();
    console.log('✓ PostgreSQL tables initialized and ready.');
  } catch (err) {
    console.error('⚠️ Database initialization warning (will run in resilient fallback):', err);
  }
}
