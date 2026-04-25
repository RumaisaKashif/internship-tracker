import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, ExternalLink, BookOpen, ChevronDown, Search } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Drawer } from '@/components/ui/Drawer'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { StreamingText } from '@/components/ui/StreamingText'
import { useLeetCodeProblems, useLeetCodeProgress, useToggleSolved, useLeetCodeStreak } from '@/hooks/useSupabase'
import { useLeetCodeStats } from '@/hooks/useLeetCode'
import { useStore } from '@/store/useStore'
import { streamExplainLC } from '@/lib/claude'
import type { LeetCodeProblem } from '@/lib/supabase'

const DIFF_BADGE: Record<string, 'green' | 'amber' | 'red'> = {
  easy: 'green',
  medium: 'amber',
  hard: 'red',
}

const COMPANY_TABS = ['All', 'Google', 'Meta', 'Amazon', 'Jane Street', 'Citadel', 'Two Sigma', 'Microsoft']

export function LeetCode() {
  const { data: problems = [] } = useLeetCodeProblems()
  const { data: progress = [] } = useLeetCodeProgress()
  const { data: streak } = useLeetCodeStreak()
  const { mutate: toggleSolved } = useToggleSolved()
  const { lcFilters, setLcFilter } = useStore()
  const stats = useLeetCodeStats()

  const [selectedProblem, setSelectedProblem] = useState<LeetCodeProblem | null>(null)
  const [explainLines, setExplainLines] = useState<string[]>([])
  const [explaining, setExplaining] = useState(false)
  const [activeCompanyTab, setActiveCompanyTab] = useState('All')

  const solvedSet = useMemo(
    () => new Set(progress.filter(p => p.solved).map(p => p.problem_id)),
    [progress]
  )

  const filtered = useMemo(() => {
    let list = [...problems]

    if (activeCompanyTab !== 'All') {
      list = list.filter(p => p.companies.includes(activeCompanyTab))
      list.sort((a, b) => b.frequency - a.frequency)
      list = list.slice(0, 15)
    }

    if (lcFilters.search) {
      const q = lcFilters.search.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.pattern.toLowerCase().includes(q))
    }
    if (lcFilters.difficulty) list = list.filter(p => p.difficulty === lcFilters.difficulty)
    if (lcFilters.pattern) list = list.filter(p => p.pattern === lcFilters.pattern)
    if (lcFilters.solved === 'solved') list = list.filter(p => solvedSet.has(p.id))
    if (lcFilters.solved === 'unsolved') list = list.filter(p => !solvedSet.has(p.id))
    if (lcFilters.company) list = list.filter(p => p.companies.includes(lcFilters.company))

    return list
  }, [problems, lcFilters, solvedSet, activeCompanyTab])

  const patterns = useMemo(() => [...new Set(problems.map(p => p.pattern))].sort(), [problems])

  const handleExplain = async (problem: LeetCodeProblem) => {
    setSelectedProblem(problem)
    setExplainLines([])
    setExplaining(true)
    try {
      const lines: string[] = []
      for await (const chunk of streamExplainLC({ problemNumber: problem.number, problemTitle: problem.title })) {
        lines.push(chunk)
        setExplainLines([...lines])
      }
    } catch {
      setExplainLines(['[Claude API not configured. Add ANTHROPIC_API_KEY to enable explanations.]'])
    } finally {
      setExplaining(false)
    }
  }

  return (
    <PageWrapper>
      <PageSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary">LeetCode Repository</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Curated for SWE, ML, and Quant internship interviews
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-amber-soft" />
              <AnimatedCounter value={streak?.current_streak ?? 0} className="font-mono text-sm font-semibold text-amber-soft" />
              <span className="text-xs text-text-muted">day streak</span>
            </div>
            <div className="text-center">
              <AnimatedCounter
                value={stats.totalSolved}
                className="font-display text-xl font-bold text-purple-bright block"
              />
              <p className="text-2xs text-text-muted">/{stats.totalProblems} solved</p>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Pattern progress rings */}
      <PageSection>
        <div className="glass-card p-5 mb-6">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Progress by Pattern</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-4">
            {[...stats.patternStats.entries()].map(([pattern, { total, solved }]) => (
              <motion.div
                key={pattern}
                className="flex flex-col items-center gap-1 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setLcFilter('pattern', lcFilters.pattern === pattern ? '' : pattern)}
              >
                <ProgressRing
                  value={solved}
                  max={total}
                  size={52}
                  strokeWidth={4}
                  color={lcFilters.pattern === pattern ? 'var(--purple-bright)' : 'var(--purple-dim)'}
                  label={`${solved}/${total}`}
                />
                <p className="text-2xs text-text-muted text-center leading-tight">
                  {pattern.split(' ')[0]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Daily recommendations */}
      {stats.dailyRecommendations.length > 0 && (
        <PageSection>
          <div className="glass-card p-5 mb-6">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Daily Recommendations</p>
            <div className="grid md:grid-cols-3 gap-3">
              {stats.dailyRecommendations.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid var(--border)' }}
                >
                  <span className="font-mono text-xs text-text-muted w-10">#{p.number}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{p.title}</p>
                    <p className="text-2xs text-text-muted">{p.pattern}</p>
                  </div>
                  <Badge variant={DIFF_BADGE[p.difficulty]}>{p.difficulty}</Badge>
                </div>
              ))}
            </div>
          </div>
        </PageSection>
      )}

      {/* Company tabs */}
      <PageSection>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {COMPANY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCompanyTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCompanyTab === tab
                  ? 'bg-purple-dim/20 text-purple-bright border border-purple-dim/30'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Search problems..."
            value={lcFilters.search}
            onChange={e => setLcFilter('search', e.target.value)}
            className="w-52"
          />
          <Select
            value={lcFilters.difficulty}
            onChange={v => setLcFilter('difficulty', v)}
            placeholder="Difficulty"
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
            className="w-36"
          />
          <Select
            value={lcFilters.solved}
            onChange={v => setLcFilter('solved', v)}
            placeholder="Status"
            options={[
              { value: 'solved', label: 'Solved' },
              { value: 'unsolved', label: 'Unsolved' },
            ]}
            className="w-36"
          />
        </div>
      </PageSection>

      {/* Problem list */}
      <PageSection>
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((problem, i) => {
              const isSolved = solvedSet.has(problem.id)
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <ProblemRow
                    problem={problem}
                    solved={isSolved}
                    onToggle={() => toggleSolved({ problemId: problem.id, solved: !isSolved })}
                    onExplain={() => handleExplain(problem)}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </PageSection>

      {/* Explain drawer */}
      <Drawer
        open={!!selectedProblem}
        onClose={() => { setSelectedProblem(null); setExplainLines([]) }}
        title={selectedProblem ? `#${selectedProblem.number} ${selectedProblem.title}` : ''}
        width="w-[520px]"
      >
        {selectedProblem && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={DIFF_BADGE[selectedProblem.difficulty]}>{selectedProblem.difficulty}</Badge>
              <Badge variant="gray">{selectedProblem.pattern}</Badge>
              {selectedProblem.companies.map(c => (
                <Badge key={c} variant="purple">{c}</Badge>
              ))}
            </div>
            <a
              href={selectedProblem.lc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-mid hover:text-purple-bright flex items-center gap-1 transition-colors"
            >
              Open on LeetCode <ExternalLink size={11} />
            </a>
            {explaining ? (
              <div>
                <p className="text-xs text-text-muted mb-3">Generating explanation...</p>
                <StreamingText lines={explainLines} />
              </div>
            ) : explainLines.length > 0 ? (
              <div className="prose prose-invert max-w-none">
                <pre className="font-mono text-xs text-text-secondary whitespace-pre-wrap bg-white/3 rounded-xl p-4 border border-white/5">
                  {explainLines.join('')}
                </pre>
              </div>
            ) : (
              <Button onClick={() => handleExplain(selectedProblem)} loading={explaining}>
                <BookOpen size={14} />
                Generate Explanation
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </PageWrapper>
  )
}

interface ProblemRowProps {
  problem: LeetCodeProblem
  solved: boolean
  onToggle: () => void
  onExplain: () => void
}

function ProblemRow({ problem, solved, onToggle, onExplain }: ProblemRowProps) {
  const [hovering, setHovering] = useState(false)

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
      style={{
        background: hovering ? 'rgba(167,139,250,0.05)' : 'rgba(20,20,32,0.5)',
        border: '1px solid var(--border)',
        opacity: solved ? 0.7 : 1,
      }}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      {/* Checkbox */}
      <motion.button
        onClick={onToggle}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 focus-ring"
        style={{
          background: solved ? 'var(--green-soft)' : 'rgba(255,255,255,0.05)',
          border: `2px solid ${solved ? 'var(--green-soft)' : 'var(--border)'}`,
        }}
        whileTap={{ scale: 0.8 }}
        transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        aria-label={solved ? 'Mark unsolved' : 'Mark solved'}
        aria-pressed={solved}
      >
        {solved && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="10" height="10" viewBox="0 0 10 10"
          >
            <path
              d="M2 5 L4 7 L8 3"
              stroke="var(--bg-base)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>
        )}
      </motion.button>

      {/* Number */}
      <span className="font-mono text-xs text-text-muted w-10 flex-shrink-0">
        #{problem.number}
      </span>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${solved ? 'line-through text-text-muted' : 'text-text-primary'}`}>
          {problem.title}
        </p>
        <p className="text-2xs text-text-muted truncate">{problem.pattern}</p>
      </div>

      {/* Frequency dots */}
      <div className="flex gap-0.5 flex-shrink-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: i < problem.frequency ? 'var(--amber-soft)' : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>

      {/* Difficulty */}
      <Badge variant={DIFF_BADGE[problem.difficulty]} className="flex-shrink-0 hidden sm:flex">
        {problem.difficulty}
      </Badge>

      {/* Companies */}
      <div className="hidden md:flex gap-1 flex-shrink-0">
        {problem.companies.slice(0, 2).map(c => (
          <span key={c} className="badge badge-gray text-2xs">{c}</span>
        ))}
      </div>

      {/* Explain */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onExplain}
        className="flex-shrink-0 hidden sm:flex"
      >
        <BookOpen size={13} />
      </Button>

      {/* LeetCode link */}
      <a
        href={problem.lc_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-muted hover:text-purple-mid transition-colors flex-shrink-0"
        onClick={e => e.stopPropagation()}
        aria-label="Open on LeetCode"
      >
        <ExternalLink size={13} />
      </a>
    </motion.div>
  )
}
