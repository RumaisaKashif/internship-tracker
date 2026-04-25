import { useState, useCallback } from 'react'
import { streamOptimize } from '@/lib/claude'
import { computeDiff } from '@/lib/utils'

export interface OptimizeResult {
  optimizedResume: string
  coverLetter: string
  matchScore: number
  diff: ReturnType<typeof computeDiff>
}

export function useOptimizer() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<string[]>([])
  const [result, setResult] = useState<OptimizeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const optimize = useCallback(async (jobDescription: string, baseResume: string, tone: string) => {
    setLoading(true)
    setProgress([])
    setResult(null)
    setError(null)

    const progressSteps = [
      'Analyzing job requirements...',
      'Matching skills to requirements...',
      'Rewriting bullet points...',
      'Optimizing ATS keywords...',
      'Generating cover letter...',
      'Calculating match score...',
      'Finalizing output...',
    ]

    try {
      let fullText = ''
      let stepIdx = 0

      const interval = setInterval(() => {
        if (stepIdx < progressSteps.length) {
          setProgress(p => [...p, progressSteps[stepIdx]])
          stepIdx++
        } else {
          clearInterval(interval)
        }
      }, 800)

      for await (const chunk of streamOptimize({ jobDescription, baseResume, tone })) {
        fullText += chunk
      }

      clearInterval(interval)
      setProgress(progressSteps)

      let parsed: { optimizedResume?: string; coverLetter?: string; matchScore?: number }
      try {
        parsed = JSON.parse(fullText)
      } catch {
        parsed = {
          optimizedResume: fullText,
          coverLetter: `Dear Hiring Team,\n\nI am writing to express my strong interest in this position.\n\n[Generated cover letter will appear here when connected to Claude API]\n\nSincerely,\nRumaisa Kashif`,
          matchScore: 75,
        }
      }

      const optimizedResume = parsed.optimizedResume ?? fullText
      const coverLetter = parsed.coverLetter ?? ''
      const matchScore = parsed.matchScore ?? 75

      setResult({
        optimizedResume,
        coverLetter,
        matchScore,
        diff: computeDiff(baseResume, optimizedResume),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, progress, result, error, optimize }
}
