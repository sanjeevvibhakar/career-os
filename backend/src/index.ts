import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool, initDb } from './db.js';
import { DSA_TOPICS, DSA_PROBLEMS } from './data/dsaProblems.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'career-os-super-secure-production-jwt-key-2026';

// In-memory fallback caches if DB is not available
const memoryAttempts: any[] = [];
const memoryRevisions: any[] = [];
const memoryJournals: any[] = [];
const memoryStreaks: Record<string, { currentCount: number; bestCount: number; lastActivityDate: string | null }> = {
  dsa: { currentCount: 0, bestCount: 0, lastActivityDate: null },
  gym: { currentCount: 0, bestCount: 0, lastActivityDate: null },
  journal: { currentCount: 0, bestCount: 0, lastActivityDate: null },
  communication: { currentCount: 0, bestCount: 0, lastActivityDate: null },
  learning: { currentCount: 0, bestCount: 0, lastActivityDate: null },
};

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 1. Health Probe for Cloud Hosting (Render, Railway, Cloudflare)
app.get(['/', '/health'], (req, res) => {
  res.json({
    status: 'UP',
    service: 'Career OS Production API',
    runtime: 'Node.js 20+ & TypeScript',
    architecture: 'RESTful API with Spaced Repetition Engine',
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password, pin } = req.body;
  if (pin === '1234' || (email && password)) {
    const token = jwt.sign({ user: 'Sanjeev', role: 'ADMIN' }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        name: 'Sanjeev Vibhakar',
        email: email || 'sanjeev@careeros.dev',
      },
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Default PIN is 1234.' });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: { id: 1, name: 'Sanjeev Vibhakar', role: 'ADMIN' },
  });
});

// 3. DSA Routes
app.get('/api/dsa/topics', async (req, res) => {
  const topicsWithStats = DSA_TOPICS.map(topic => {
    const problems = DSA_PROBLEMS.filter(p => p.topicId === topic.id);
    const solved = problems.filter(p => memoryAttempts.some(a => a.problemId === p.id));
    return {
      id: topic.id,
      name: topic.name,
      icon: topic.icon,
      color: topic.color,
      description: topic.description,
      totalProblems: problems.length,
      solvedProblems: solved.length,
      averageConfidence: 4,
    };
  });
  res.json({ success: true, data: topicsWithStats });
});

app.get('/api/dsa/topics/:id/problems', (req, res) => {
  const topicId = parseInt(req.params.id);
  const problems = DSA_PROBLEMS.filter(p => p.topicId === topicId).map(p => {
    const attempts = memoryAttempts.filter(a => a.problemId === p.id);
    return {
      ...p,
      attemptCount: attempts.length,
      lastAttemptDate: attempts.length > 0 ? attempts[attempts.length - 1].attemptedAt : null,
      confidence: attempts.length > 0 ? attempts[attempts.length - 1].confidence : 0,
    };
  });
  res.json({ success: true, data: problems });
});

app.post('/api/dsa/problems/:id/attempts', async (req, res) => {
  const problemId = parseInt(req.params.id);
  const { timeTakenMin, solvedIndependently, approach, mistake, complexityTime, complexitySpace, lesson, confidence } = req.body;

  const attemptId = crypto.randomUUID();
  const attempt = {
    id: attemptId,
    problemId,
    attemptNumber: memoryAttempts.filter(a => a.problemId === problemId).length + 1,
    timeTakenMin: timeTakenMin || 25,
    solvedIndependently: solvedIndependently ?? true,
    approach: approach || '',
    mistake: mistake || '',
    complexityTime: complexityTime || 'O(n)',
    complexitySpace: complexitySpace || 'O(1)',
    lesson: lesson || '',
    confidence: confidence || 4,
    attemptedAt: new Date().toISOString(),
  };

  memoryAttempts.push(attempt);

  // Spaced repetition schedule (+1, +3, +7, +21, +60 days)
  const intervals = [1, 3, 7, 21, 60];
  intervals.forEach((days, idx) => {
    const schedDate = new Date();
    schedDate.setDate(schedDate.getDate() + days);
    memoryRevisions.push({
      id: crypto.randomUUID(),
      attemptId,
      problemId,
      revisionNumber: idx + 1,
      scheduledDate: schedDate.toISOString().split('T')[0],
      status: 'PENDING',
    });
  });

  // Update streak
  memoryStreaks.dsa.currentCount += 1;
  if (memoryStreaks.dsa.currentCount > memoryStreaks.dsa.bestCount) {
    memoryStreaks.dsa.bestCount = memoryStreaks.dsa.currentCount;
  }
  memoryStreaks.dsa.lastActivityDate = new Date().toISOString().split('T')[0];

  res.json({ success: true, message: 'Attempt logged & 5 spaced revisions scheduled', data: attempt });
});

app.get('/api/dsa/revisions/due', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const due = memoryRevisions.filter(r => r.status === 'PENDING' && r.scheduledDate <= today).map(r => {
    const prob = DSA_PROBLEMS.find(p => p.id === r.problemId);
    const top = DSA_TOPICS.find(t => t.id === prob?.topicId);
    return {
      ...r,
      problemName: prob?.name || 'Problem',
      topicName: top?.name || 'Topic',
      pattern: prob?.pattern || 'Pattern',
    };
  });
  res.json({ success: true, data: due });
});

app.put('/api/dsa/revisions/:id', (req, res) => {
  const rev = memoryRevisions.find(r => r.id === req.params.id);
  if (rev) {
    rev.status = 'COMPLETED';
    rev.completedDate = new Date().toISOString().split('T')[0];
    rev.timeTakenMin = req.body.timeTakenMin || 15;
    rev.confidence = req.body.confidence || 4;
  }
  res.json({ success: true, data: rev });
});

app.get('/api/dsa/stats', (req, res) => {
  const totalSolved = new Set(memoryAttempts.map(a => a.problemId)).size;
  const easy = DSA_PROBLEMS.filter(p => p.difficulty === 'EASY' && memoryAttempts.some(a => a.problemId === p.id)).length;
  const medium = DSA_PROBLEMS.filter(p => p.difficulty === 'MEDIUM' && memoryAttempts.some(a => a.problemId === p.id)).length;
  const hard = DSA_PROBLEMS.filter(p => p.difficulty === 'HARD' && memoryAttempts.some(a => a.problemId === p.id)).length;

  res.json({
    success: true,
    data: {
      totalSolved,
      totalProblems: DSA_PROBLEMS.length,
      easy,
      medium,
      hard,
      streakDays: memoryStreaks.dsa.currentCount,
    },
  });
});

// 4. Daily Habits & Dashboard
app.post('/api/daily/journal', (req, res) => {
  const entry = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString() };
  memoryJournals.push(entry);
  memoryStreaks.journal.currentCount += 1;
  res.json({ success: true, data: entry });
});

app.get('/api/daily/journal', (req, res) => {
  const date = req.query.date as string;
  const entry = memoryJournals.find(j => j.date === date);
  res.json({ success: true, data: entry || null });
});

app.get('/api/dashboard/today', (req, res) => {
  res.json({
    success: true,
    data: {
      userName: 'Sanjeev Vibhakar',
      streaks: memoryStreaks,
      totalProblems: DSA_PROBLEMS.length,
      dueRevisionsCount: memoryRevisions.filter(r => r.status === 'PENDING').length,
    },
  });
});

// Boot Server
app.listen(PORT, async () => {
  console.log(`🚀 Career OS Production API running on port ${PORT}`);
  await initDb();
});
