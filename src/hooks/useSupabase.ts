import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  ApplicationStatus, OutreachStatus, UserProfile, Internship,
  TimelineEvent, LeetCodeProblem, LeetCodeProgress, LeetCodeStreak,
  OptimizationHistory, ScanLog, ReferralContact
} from '@/lib/supabase'

export function useProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_profile').select('*').single()
      if (error) throw error
      return data as UserProfile | null
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useInternships() {
  return useQuery<Internship[]>({
    queryKey: ['internships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internships').select('*').order('match_score', { ascending: false })
      if (error) throw error
      return (data ?? []) as Internship[]
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpdateInternshipStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('internships')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['internships'] }),
  })
}

export function useTimeline() {
  return useQuery<TimelineEvent[]>({
    queryKey: ['timeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_events').select('*, companies(*)').order('expected_date', { ascending: true })
      if (error) throw error
      return (data ?? []) as TimelineEvent[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateTimelineNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase.from('timeline_events').update({ notes }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timeline'] }),
  })
}

export function useLeetCodeProblems() {
  return useQuery<LeetCodeProblem[]>({
    queryKey: ['leetcode_problems'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leetcode_problems').select('*').order('number')
      if (error) throw error
      return (data ?? []) as LeetCodeProblem[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useLeetCodeProgress() {
  return useQuery<LeetCodeProgress[]>({
    queryKey: ['leetcode_progress'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leetcode_progress').select('*')
      if (error) throw error
      return (data ?? []) as LeetCodeProgress[]
    },
  })
}

export function useToggleSolved() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ problemId, solved }: { problemId: string; solved: boolean }) => {
      const { data: existing } = await supabase
        .from('leetcode_progress').select('id').eq('problem_id', problemId).single()

      if (existing) {
        await supabase.from('leetcode_progress')
          .update({ solved, solved_at: solved ? new Date().toISOString() : null })
          .eq('problem_id', problemId)
      } else {
        await supabase.from('leetcode_progress')
          .insert({ problem_id: problemId, solved, solved_at: solved ? new Date().toISOString() : null })
      }

      if (solved) {
        const today = new Date().toISOString().split('T')[0]
        const { data: rawStreak } = await supabase.from('leetcode_streak').select('*').single()
        const streak = rawStreak as LeetCodeStreak | null
        if (streak) {
          const last = streak.last_solved_date
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]
          const newStreak = last === yesterdayStr || last === today
            ? (last === today ? streak.current_streak : streak.current_streak + 1) : 1
          await supabase.from('leetcode_streak').update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, streak.longest_streak),
            last_solved_date: today,
          }).eq('id', streak.id)
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leetcode_progress'] })
      qc.invalidateQueries({ queryKey: ['leetcode_streak'] })
    },
  })
}

export function useLeetCodeStreak() {
  return useQuery<LeetCodeStreak | null>({
    queryKey: ['leetcode_streak'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leetcode_streak').select('*').single()
      if (error) return null
      return data as LeetCodeStreak | null
    },
  })
}

export function useOptimizationHistory() {
  return useQuery<OptimizationHistory[]>({
    queryKey: ['optimization_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('optimization_history').select('*').order('created_at', { ascending: false }).limit(10)
      if (error) throw error
      return (data ?? []) as OptimizationHistory[]
    },
  })
}

export function useSaveOptimization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      job_url?: string; job_title: string; company: string
      original_resume: string; optimized_resume: string; cover_letter: string; match_score: number
    }) => {
      const { error } = await supabase.from('optimization_history')
        .insert({ ...payload, created_at: new Date().toISOString() })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optimization_history'] }),
  })
}

export function useReferralContacts() {
  return useQuery<ReferralContact[]>({
    queryKey: ['referral_contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_contacts').select('*, companies(*)').order('companies(name)')
      if (error) throw error
      return (data ?? []) as ReferralContact[]
    },
  })
}

export function useUpdateReferralStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: OutreachStatus; notes?: string }) => {
      const update: Record<string, unknown> = { status }
      if (notes !== undefined) update.notes = notes
      const { error } = await supabase.from('referral_contacts').update(update).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['referral_contacts'] }),
  })
}

export function useScanLogs() {
  return useQuery<ScanLog[]>({
    queryKey: ['scan_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scan_logs').select('*').order('started_at', { ascending: false }).limit(10)
      if (error) throw error
      return (data ?? []) as ScanLog[]
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { error } = await supabase.from('user_profile').update(updates).not('id', 'is', null)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}
