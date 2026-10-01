CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    resume_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    location VARCHAR(255),
    current_focus VARCHAR(255)
);

CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    architecture_notes TEXT,
    long_description TEXT,
    tech_stack JSON,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    challenges TEXT,
    results TEXT,
    order_index INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skill (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    proficiency INTEGER,
    evidence_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true
);

CREATE TABLE experience (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    technologies JSON,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true
);

CREATE TABLE achievement (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achieved_date DATE,
    category VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true
);

CREATE TABLE dsa_topic (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50)
);

CREATE TABLE dsa_problem (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT REFERENCES dsa_topic(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50),
    source VARCHAR(50),
    source_url VARCHAR(500),
    pattern VARCHAR(255),
    striver_step VARCHAR(50),
    neetcode_category VARCHAR(100),
    notes TEXT
);

CREATE TABLE dsa_attempt (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT REFERENCES dsa_problem(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    attempt_number INTEGER,
    time_taken_min INTEGER,
    solved_independently BOOLEAN,
    approach TEXT,
    mistake TEXT,
    complexity_time VARCHAR(255),
    complexity_space VARCHAR(255),
    lesson TEXT,
    confidence INTEGER,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dsa_revision (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT REFERENCES dsa_attempt(id) ON DELETE CASCADE,
    revision_number INTEGER,
    scheduled_date DATE,
    completed_date DATE,
    time_taken_min INTEGER,
    confidence INTEGER,
    status VARCHAR(50)
);

CREATE TABLE tech_sprint (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    technology VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    total_weeks INTEGER,
    current_week INTEGER
);

CREATE TABLE tech_sprint_week (
    id BIGSERIAL PRIMARY KEY,
    sprint_id BIGINT REFERENCES tech_sprint(id) ON DELETE CASCADE,
    week_number INTEGER,
    focus VARCHAR(255),
    goals TEXT,
    completed BOOLEAN DEFAULT false
);

CREATE TABLE daily_learning_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    sprint_id BIGINT REFERENCES tech_sprint(id) ON DELETE SET NULL,
    date DATE,
    topic VARCHAR(255),
    planned_minutes INTEGER,
    actual_minutes INTEGER,
    understanding INTEGER,
    notes TEXT,
    resources_used TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_entry (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    what_built TEXT,
    what_learned TEXT,
    what_confused TEXT,
    bug_encountered TEXT,
    revisit_topic TEXT,
    mood VARCHAR(50),
    energy_level INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

CREATE TABLE communication_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    date DATE,
    type VARCHAR(50),
    topic VARCHAR(255),
    duration_minutes INTEGER,
    notes TEXT,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gym_session (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    date DATE,
    type VARCHAR(50),
    completed BOOLEAN DEFAULT false,
    duration_minutes INTEGER,
    notes TEXT
);

CREATE TABLE schedule_template (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    day_of_week VARCHAR(50),
    blocks TEXT,
    active BOOLEAN DEFAULT true
);

CREATE TABLE weekly_review (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE,
    dsa_problems_solved INTEGER,
    dsa_accuracy DECIMAL,
    tech_hours DECIMAL,
    project_hours DECIMAL,
    gym_sessions INTEGER,
    sleep_avg DECIMAL,
    biggest_win TEXT,
    biggest_struggle TEXT,
    next_week_focus TEXT,
    next_week_dsa_theme TEXT,
    next_week_tech_theme TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE streak (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50),
    current_count INTEGER DEFAULT 0,
    best_count INTEGER DEFAULT 0,
    last_activity_date DATE
);
