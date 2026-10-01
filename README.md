# Career OS

> Personal Career Operating System — Public Portfolio + Private Career Dashboard

A full-stack application that combines a **public portfolio** (for recruiters) with a **private career dashboard** (for daily use), featuring DSA tracking with pattern intelligence, technology sprint management, daily journaling, and career analytics.

## 🎯 Mission

**Service-Based → Product-Based Software Engineer**
Target: 2027 hiring season

## 🏗️ Architecture

```
Frontend                    Backend                     Database
────────────────           ────────────────            ────────────
React 18                   Java 21                     PostgreSQL 16
TypeScript                 Spring Boot 3.3
Tailwind CSS               Spring Security (JWT)
Vite                       Spring Data JPA
Zustand                    Flyway
React Router               Hibernate
Recharts
Lucide Icons
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 16+ (or Docker)
- Maven 3.9+

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

**Database:**
```bash
# Start PostgreSQL and create database
createdb careeros
```

**Backend:**
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
career-os/
├── frontend/          # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Public + Private pages
│   │   ├── stores/       # Zustand state management
│   │   ├── services/     # API client
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript interfaces
│   └── ...
├── backend/           # Java + Spring Boot
│   ├── src/main/java/
│   │   └── com/sanjeev/careeros/
│   │       ├── auth/        # JWT authentication
│   │       ├── portfolio/   # Public portfolio
│   │       ├── dsa/         # DSA tracker + revision engine
│   │       ├── learning/    # Technology sprints
│   │       ├── daily/       # Journal, communication, gym
│   │       ├── dashboard/   # Dashboard + analytics
│   │       └── common/      # Shared utilities
│   └── src/main/resources/
│       └── db/migration/    # Flyway migrations
├── docker-compose.yml
└── README.md
```

## 🔑 Features

### Public Portfolio
- **Home** — Hero section with dynamic skill visualization
- **Projects** — Detailed project cards with architecture notes
- **Skills** — Progress bars by category
- **Experience** — Career timeline
- **Contact** — Contact form

### Private Dashboard
- **Morning Dashboard** — Today's 3 priorities, streaks, bottleneck
- **DSA Tracker** — Pattern-based tracking with spaced revision
- **Tech Sprint** — 2-4 week technology deep-dives
- **Daily Journal** — 5-minute engineering journal
- **Communication** — Speaking/writing practice log
- **Gym Tracker** — Simple session tracking
- **Weekly Review** — Auto-generated summaries + planning

## 📊 DSA Approach

**Hybrid Method:**
- **Striver A2Z** → Topic-by-topic deep learning
- **NeetCode 150** → Pattern verification testing
- **Grind 75** → Interview sprint mode

**Tracks pattern mastery, not problem count:**
```
Sliding Window     ████████░░  82%  (confident)
Graphs BFS/DFS     ████░░░░░░  40%  (this week's focus)
DP on Subsequences ███░░░░░░░  28%  (not started)
```

## 🛠️ Tech Stack Evidence

This project itself demonstrates:
- JWT Authentication
- REST API Design (30+ endpoints)
- PostgreSQL Schema Design (20+ entities)
- Spaced Repetition Algorithm
- Data Visualization
- Responsive Design
- Docker Containerization

## 📝 License

Private project. All rights reserved.

---

*Built by Sanjeev Vibhakar as Project #1 of the Career OS system.*
