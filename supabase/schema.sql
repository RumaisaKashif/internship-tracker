-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE loc_type AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE application_status AS ENUM ('saved', 'applied', 'interviewing', 'offer', 'rejected');
CREATE TYPE outreach_status AS ENUM ('not_started', 'messaged', 'replied', 'coffee_chat_done');
CREATE TYPE urgency AS ENUM ('open_now', 'opening_soon', 'upcoming', 'unknown');
CREATE TYPE scan_status AS ENUM ('running', 'completed', 'failed');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT '',
  university TEXT NOT NULL DEFAULT '',
  grad_date TEXT NOT NULL DEFAULT '',
  current_position TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  target_fields TEXT[] NOT NULL DEFAULT '{}',
  location_pref TEXT NOT NULL DEFAULT '',
  pay_floor INTEGER NOT NULL DEFAULT 0,
  target_companies TEXT[] NOT NULL DEFAULT '{}',
  base_resume TEXT NOT NULL DEFAULT '',
  notification_email TEXT NOT NULL DEFAULT '',
  scan_frequency INTEGER NOT NULL DEFAULT 2,
  claude_api_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  careers_url TEXT,
  logo_color TEXT NOT NULL DEFAULT '#A78BFA',
  field TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  outreach_status outreach_status NOT NULL DEFAULT 'not_started',
  linkedin_query TEXT,
  outreach_strategy TEXT,
  timing_advice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  loc_type loc_type NOT NULL DEFAULT 'onsite',
  wage DECIMAL,
  wage_period TEXT,
  paid BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  skills_required TEXT[] NOT NULL DEFAULT '{}',
  match_score INTEGER NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  deadline DATE,
  days_until_deadline INTEGER,
  status application_status NOT NULL DEFAULT 'saved',
  source TEXT NOT NULL DEFAULT '',
  apply_url TEXT,
  scan_id UUID,
  is_new BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  expected_date DATE,
  confidence DECIMAL NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  source_url TEXT,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  apply_url TEXT,
  urgency urgency NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leetcode_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  difficulty difficulty NOT NULL,
  pattern TEXT NOT NULL,
  companies TEXT[] NOT NULL DEFAULT '{}',
  frequency INTEGER NOT NULL DEFAULT 1 CHECK (frequency >= 1 AND frequency <= 5),
  topic TEXT NOT NULL DEFAULT '',
  lc_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leetcode_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES leetcode_problems(id) ON DELETE CASCADE,
  solved BOOLEAN NOT NULL DEFAULT false,
  solved_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (problem_id)
);

CREATE TABLE leetcode_streak (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_solved_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE optimization_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_url TEXT,
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  original_resume TEXT NOT NULL DEFAULT '',
  optimized_resume TEXT NOT NULL DEFAULT '',
  cover_letter TEXT NOT NULL DEFAULT '',
  match_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  listings_found INTEGER NOT NULL DEFAULT 0,
  listings_added INTEGER NOT NULL DEFAULT 0,
  status scan_status NOT NULL DEFAULT 'running',
  log_text TEXT
);

CREATE TABLE referral_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  strategy TEXT,
  status outreach_status NOT NULL DEFAULT 'not_started',
  notes TEXT,
  dm_history TEXT[] NOT NULL DEFAULT '{}',
  last_contact_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_internships_company ON internships(company);
CREATE INDEX idx_internships_status ON internships(status);
CREATE INDEX idx_internships_match_score ON internships(match_score DESC);
CREATE INDEX idx_internships_created_at ON internships(created_at DESC);
CREATE INDEX idx_internships_is_new ON internships(is_new) WHERE is_new = true;
CREATE INDEX idx_timeline_company ON timeline_events(company_id);
CREATE INDEX idx_timeline_urgency ON timeline_events(urgency);
CREATE INDEX idx_timeline_date ON timeline_events(expected_date ASC NULLS LAST);
CREATE INDEX idx_lc_pattern ON leetcode_problems(pattern);
CREATE INDEX idx_lc_difficulty ON leetcode_problems(difficulty);
CREATE INDEX idx_lc_number ON leetcode_problems(number);
CREATE INDEX idx_referral_company ON referral_contacts(company_id);
CREATE INDEX idx_scan_logs_started ON scan_logs(started_at DESC);

-- =============================================
-- REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE scan_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE leetcode_progress;
