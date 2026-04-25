import { useMemo } from 'react'
import { useLeetCodeProblems, useLeetCodeProgress } from './useSupabase'
import type { LeetCodeProblem, LeetCodeProgress } from '@/lib/supabase'

export function useLeetCodeStats() {
  const { data: problems = [] } = useLeetCodeProblems()
  const { data: progress = [] } = useLeetCodeProgress()

  const progressMap = useMemo(() => {
    const map = new Map<string, LeetCodeProgress>()
    for (const p of progress) map.set(p.problem_id, p)
    return map
  }, [progress])

  const solvedIds = useMemo(
    () => new Set(progress.filter(p => p.solved).map(p => p.problem_id)),
    [progress]
  )

  const patternStats = useMemo(() => {
    const map = new Map<string, { total: number; solved: number }>()
    for (const p of problems) {
      const existing = map.get(p.pattern) ?? { total: 0, solved: 0 }
      existing.total++
      if (solvedIds.has(p.id)) existing.solved++
      map.set(p.pattern, existing)
    }
    return map
  }, [problems, solvedIds])

  const companyProblems = useMemo(() => {
    const map = new Map<string, LeetCodeProblem[]>()
    for (const p of problems) {
      for (const company of p.companies) {
        const existing = map.get(company) ?? []
        existing.push(p)
        map.set(company, existing)
      }
    }
    return map
  }, [problems])

  const dailyRecommendations = useMemo(() => {
    const targetCompanies = ['Google', 'Meta', 'Amazon', 'Jane Street', 'Citadel', 'Two Sigma']
    const companyProbs = problems.filter(p =>
      p.companies.some(c => targetCompanies.includes(c)) && !solvedIds.has(p.id)
    )
    const sorted = [...companyProbs].sort((a, b) => b.frequency - a.frequency)
    return sorted.slice(0, 3)
  }, [problems, solvedIds])

  return {
    problems,
    progressMap,
    solvedIds,
    patternStats,
    companyProblems,
    dailyRecommendations,
    totalSolved: solvedIds.size,
    totalProblems: problems.length,
  }
}
