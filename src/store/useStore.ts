import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApplicationStatus, OutreachStatus } from '@/lib/supabase'

interface AppState {
  sidebarExpanded: boolean
  setSidebarExpanded: (v: boolean) => void

  activeTab: string
  setActiveTab: (tab: string) => void

  jobFilters: {
    field: string
    locType: string
    paid: string
    minScore: number
    status: string
    search: string
  }
  setJobFilter: <K extends keyof AppState['jobFilters']>(key: K, value: AppState['jobFilters'][K]) => void

  lcFilters: {
    company: string
    pattern: string
    difficulty: string
    solved: string
    search: string
  }
  setLcFilter: <K extends keyof AppState['lcFilters']>(key: K, value: AppState['lcFilters'][K]) => void

  referralFilters: {
    company: string
    status: OutreachStatus | ''
  }
  setReferralFilter: <K extends keyof AppState['referralFilters']>(key: K, value: AppState['referralFilters'][K]) => void

  dismissedUrgencyBanners: string[]
  dismissUrgencyBanner: (companyId: string) => void

  scanRunning: boolean
  setScanRunning: (v: boolean) => void
  scanLog: string[]
  appendScanLog: (line: string) => void
  clearScanLog: () => void

  optimizerTone: string
  setOptimizerTone: (tone: string) => void

  jobSort: 'match_score' | 'created_at' | 'deadline'
  setJobSort: (sort: AppState['jobSort']) => void

  solvedProblems: Set<string>
  toggleSolved: (id: string) => void

  statusUpdates: Record<string, ApplicationStatus>
  setJobStatus: (id: string, status: ApplicationStatus) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarExpanded: false,
      setSidebarExpanded: (v) => set({ sidebarExpanded: v }),

      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      jobFilters: {
        field: '',
        locType: '',
        paid: '',
        minScore: 0,
        status: '',
        search: '',
      },
      setJobFilter: (key, value) =>
        set((s) => ({ jobFilters: { ...s.jobFilters, [key]: value } })),

      lcFilters: {
        company: '',
        pattern: '',
        difficulty: '',
        solved: '',
        search: '',
      },
      setLcFilter: (key, value) =>
        set((s) => ({ lcFilters: { ...s.lcFilters, [key]: value } })),

      referralFilters: { company: '', status: '' },
      setReferralFilter: (key, value) =>
        set((s) => ({ referralFilters: { ...s.referralFilters, [key]: value } })),

      dismissedUrgencyBanners: [],
      dismissUrgencyBanner: (id) =>
        set((s) => ({ dismissedUrgencyBanners: [...s.dismissedUrgencyBanners, id] })),

      scanRunning: false,
      setScanRunning: (v) => set({ scanRunning: v }),
      scanLog: [],
      appendScanLog: (line) => set((s) => ({ scanLog: [...s.scanLog, line] })),
      clearScanLog: () => set({ scanLog: [] }),

      optimizerTone: 'professional',
      setOptimizerTone: (tone) => set({ optimizerTone: tone }),

      jobSort: 'match_score',
      setJobSort: (sort) => set({ jobSort: sort }),

      solvedProblems: new Set(),
      toggleSolved: (id) =>
        set((s) => {
          const next = new Set(s.solvedProblems)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return { solvedProblems: next }
        }),

      statusUpdates: {},
      setJobStatus: (id, status) =>
        set((s) => ({ statusUpdates: { ...s.statusUpdates, [id]: status } })),
    }),
    {
      name: 'internship-tracker',
      partialize: (s) => ({
        dismissedUrgencyBanners: s.dismissedUrgencyBanners,
        jobFilters: s.jobFilters,
        lcFilters: s.lcFilters,
        jobSort: s.jobSort,
        optimizerTone: s.optimizerTone,
        statusUpdates: s.statusUpdates,
      }),
    }
  )
)
