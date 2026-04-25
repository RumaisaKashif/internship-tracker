import { createClient } from '@supabase/supabase-js'

export type LocType = 'remote' | 'hybrid' | 'onsite'
export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'
export type OutreachStatus = 'not_started' | 'messaged' | 'replied' | 'coffee_chat_done'
export type Urgency = 'open_now' | 'opening_soon' | 'upcoming' | 'unknown'
export type ScanStatus = 'running' | 'completed' | 'failed'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface UserProfile {
  id: string
  name: string
  university: string
  grad_date: string
  current_position: string
  skills: string[]
  target_fields: string[]
  location_pref: string
  pay_floor: number
  target_companies: string[]
  base_resume: string
  notification_email: string
  scan_frequency: number
  claude_api_key: string | null
}

export interface Internship {
  id: string
  role: string
  company: string
  location: string
  loc_type: LocType
  wage: number | null
  wage_period: string | null
  paid: boolean
  description: string
  requirements: string
  skills_required: string[]
  match_score: number
  deadline: string | null
  days_until_deadline: number | null
  status: ApplicationStatus
  source: string
  apply_url: string | null
  scan_id: string | null
  is_new: boolean
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  careers_url: string | null
  logo_color: string
  field: string[]
  notes: string | null
  outreach_status: OutreachStatus
  linkedin_query: string | null
  outreach_strategy: string | null
  timing_advice: string | null
}

export interface TimelineEvent {
  id: string
  company_id: string
  event_type: string
  expected_date: string | null
  confidence: number
  source_url: string | null
  verified_at: string | null
  notes: string | null
  apply_url: string | null
  urgency: Urgency
  companies?: Company
}

export interface LeetCodeProblem {
  id: string
  number: number
  title: string
  difficulty: Difficulty
  pattern: string
  companies: string[]
  frequency: number
  topic: string
  lc_url: string
  notes: string | null
}

export interface LeetCodeProgress {
  id: string
  problem_id: string
  solved: boolean
  solved_at: string | null
  notes: string | null
}

export interface LeetCodeStreak {
  id: string
  current_streak: number
  longest_streak: number
  last_solved_date: string | null
}

export interface OptimizationHistory {
  id: string
  job_url: string | null
  job_title: string
  company: string
  original_resume: string
  optimized_resume: string
  cover_letter: string
  match_score: number
  created_at: string
}

export interface ScanLog {
  id: string
  started_at: string
  completed_at: string | null
  listings_found: number
  listings_added: number
  status: ScanStatus
  log_text: string | null
}

export interface ReferralContact {
  id: string
  company_id: string
  strategy: string | null
  status: OutreachStatus
  notes: string | null
  dm_history: string[]
  last_contact_date: string | null
  companies?: Company
}

export type Database = {
  public: {
    Tables: {
      user_profile: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id'> & { id?: string }
        Update: Partial<UserProfile>
      }
      internships: {
        Row: Internship
        Insert: Omit<Internship, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Internship>
      }
      companies: {
        Row: Company
        Insert: Omit<Company, 'id'> & { id?: string }
        Update: Partial<Company>
      }
      timeline_events: {
        Row: TimelineEvent
        Insert: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<TimelineEvent>
      }
      leetcode_problems: {
        Row: LeetCodeProblem
        Insert: Omit<LeetCodeProblem, 'id'> & { id?: string }
        Update: Partial<LeetCodeProblem>
      }
      leetcode_progress: {
        Row: LeetCodeProgress
        Insert: Omit<LeetCodeProgress, 'id'> & { id?: string }
        Update: Partial<LeetCodeProgress>
      }
      leetcode_streak: {
        Row: LeetCodeStreak
        Insert: Omit<LeetCodeStreak, 'id'> & { id?: string }
        Update: Partial<LeetCodeStreak>
      }
      optimization_history: {
        Row: OptimizationHistory
        Insert: Omit<OptimizationHistory, 'id'> & { id?: string }
        Update: Partial<OptimizationHistory>
      }
      scan_logs: {
        Row: ScanLog
        Insert: Omit<ScanLog, 'id'> & { id?: string }
        Update: Partial<ScanLog>
      }
      referral_contacts: {
        Row: ReferralContact
        Insert: Omit<ReferralContact, 'id'> & { id?: string }
        Update: Partial<ReferralContact>
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using demo mode.')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)
