import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, FileText, Copy, Download, Check, ArrowRight } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { ScoreBar } from '@/components/ui/ScoreBar'
import { DiffView } from '@/components/ui/DiffView'
import { StreamingText } from '@/components/ui/StreamingText'
import { useProfile, useOptimizationHistory, useSaveOptimization } from '@/hooks/useSupabase'
import { useOptimizer } from '@/hooks/useOptimizer'
import { useStore } from '@/store/useStore'
import { scrapeJob } from '@/lib/claude'
import { formatRelativeTime } from '@/lib/utils'

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'concise', label: 'Concise' },
]

export function Optimizer() {
  const { data: profile } = useProfile()
  const { data: history = [] } = useOptimizationHistory()
  const { mutate: saveOpt } = useSaveOptimization()
  const { loading, progress, result, error, optimize } = useOptimizer()
  const { optimizerTone, setOptimizerTone } = useStore()

  const [jobUrl, setJobUrl] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [baseResume, setBaseResume] = useState(profile?.base_resume ?? '')
  const [fetching, setFetching] = useState(false)
  const [fetchedJob, setFetchedJob] = useState<{ title: string; company: string } | null>(null)
  const [copiedResume, setCopiedResume] = useState(false)
  const [copiedCover, setCopiedCover] = useState(false)
  const [activeOutput, setActiveOutput] = useState<'diff' | 'resume' | 'cover'>('diff')

  const handleFetch = async () => {
    if (!jobUrl) return
    setFetching(true)
    try {
      const data = await scrapeJob(jobUrl)
      setJobDesc(`${data.title}\n\n${data.description}\n\nRequirements:\n${data.requirements}`)
      setFetchedJob({ title: data.title, company: data.company })
    } catch {
      setJobDesc('[Could not fetch — paste job description manually]')
    } finally {
      setFetching(false)
    }
  }

  const handleOptimize = async () => {
    const resume = baseResume || profile?.base_resume || ''
    await optimize(jobDesc, resume, optimizerTone)
  }

  const handleSave = () => {
    if (!result) return
    saveOpt({
      job_url: jobUrl || undefined,
      job_title: fetchedJob?.title ?? 'Unknown Role',
      company: fetchedJob?.company ?? 'Unknown Company',
      original_resume: baseResume || profile?.base_resume || '',
      optimized_resume: result.optimizedResume,
      cover_letter: result.coverLetter,
      match_score: result.matchScore,
    })
  }

  const copyToClipboard = async (text: string, type: 'resume' | 'cover') => {
    await navigator.clipboard.writeText(text)
    if (type === 'resume') {
      setCopiedResume(true)
      setTimeout(() => setCopiedResume(false), 2000)
    } else {
      setCopiedCover(true)
      setTimeout(() => setCopiedCover(false), 2000)
    }
  }

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageWrapper>
      <PageSection>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-text-primary">Resume Optimizer</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Claude tailors your resume and drafts a cover letter for each role
          </p>
        </div>
      </PageSection>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Job input */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
              <Link size={14} className="text-purple-mid" />
              Job Description
            </h3>

            {/* URL fetch */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Paste job URL..."
                value={jobUrl}
                onChange={e => setJobUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleFetch}
                loading={fetching}
                disabled={!jobUrl}
              >
                Fetch
              </Button>
            </div>

            {fetchedJob && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-3 p-2 rounded-lg"
                style={{ background: 'rgba(134,239,172,0.05)', border: '1px solid rgba(134,239,172,0.15)' }}
              >
                <Check size={12} className="text-green-soft" />
                <p className="text-xs text-green-soft">
                  Fetched: <strong>{fetchedJob.title}</strong> at {fetchedJob.company}
                </p>
              </motion.div>
            )}

            <p className="text-xs text-text-muted mb-2">Or paste job description directly:</p>
            <Textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className="h-48 text-xs"
            />
          </Card>
        </PageSection>

        {/* Right: Resume base */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
              <FileText size={14} className="text-purple-mid" />
              Base Resume
            </h3>
            <Textarea
              value={baseResume || profile?.base_resume || ''}
              onChange={e => setBaseResume(e.target.value)}
              placeholder="Your resume content..."
              className="h-48 text-xs"
            />
            <p className="text-2xs text-text-muted mt-2">
              Synced with Settings. Edits here are local to this session.
            </p>
          </Card>
        </PageSection>
      </div>

      {/* Tone + Optimize button */}
      <PageSection>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Tone:</span>
            <div className="flex gap-1">
              {TONE_OPTIONS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setOptimizerTone(t.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    optimizerTone === t.value
                      ? 'bg-purple-dim/20 text-purple-bright border border-purple-dim/30'
                      : 'text-text-muted border border-transparent hover:text-text-secondary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleOptimize}
            loading={loading}
            disabled={!jobDesc}
            className="sm:ml-auto"
          >
            <ArrowRight size={14} />
            Optimize Resume
          </Button>
        </div>
      </PageSection>

      {/* Progress */}
      <AnimatePresence>
        {loading && progress.length > 0 && (
          <PageSection>
            <motion.div
              className="glass-card p-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StreamingText lines={progress} />
            </motion.div>
          </PageSection>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <PageSection>
          <div
            className="mt-4 p-4 rounded-xl text-sm text-red-400"
            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </div>
        </PageSection>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <PageSection>
              {/* Score */}
              <div className="glass-card p-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Match Score</p>
                  <p className="font-mono text-2xl font-bold text-green-soft">{result.matchScore}%</p>
                </div>
                <div className="flex-1">
                  <ScoreBar score={result.matchScore} />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    Save to History
                  </Button>
                </div>
              </div>
            </PageSection>

            {/* Output tabs */}
            <PageSection>
              <div className="flex gap-1 mb-4">
                {(['diff', 'resume', 'cover'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveOutput(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      activeOutput === tab
                        ? 'bg-purple-dim/20 text-purple-bright border border-purple-dim/30'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {tab === 'diff' ? 'Diff View' : tab === 'resume' ? 'Full Resume' : 'Cover Letter'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeOutput === 'diff' && (
                  <motion.div
                    key="diff"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <DiffView diff={result.diff} />
                  </motion.div>
                )}
                {activeOutput === 'resume' && (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="relative">
                      <pre className="font-mono text-xs text-text-secondary whitespace-pre-wrap bg-white/3 rounded-xl p-4 border border-white/5 max-h-96 overflow-y-auto">
                        {result.optimizedResume}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3"
                        onClick={() => copyToClipboard(result.optimizedResume, 'resume')}
                      >
                        {copiedResume ? <Check size={12} /> : <Copy size={12} />}
                        {copiedResume ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </motion.div>
                )}
                {activeOutput === 'cover' && (
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="relative">
                      <pre className="font-mono text-xs text-text-secondary whitespace-pre-wrap bg-white/3 rounded-xl p-4 border border-white/5 max-h-96 overflow-y-auto">
                        {result.coverLetter}
                      </pre>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.coverLetter, 'cover')}
                        >
                          {copiedCover ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCover ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadText(result.coverLetter, 'cover-letter.txt')}
                        >
                          <Download size={12} />
                          .txt
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </PageSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <PageSection>
          <div className="mt-8">
            <h3 className="font-display font-medium text-text-primary mb-4">Optimization History</h3>
            <div className="space-y-2">
              {history.map(h => (
                <motion.div
                  key={h.id}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer"
                  style={{ background: 'rgba(20,20,32,0.5)', border: '1px solid var(--border)' }}
                  whileHover={{ borderColor: 'var(--border-hover)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{h.job_title}</p>
                    <p className="text-xs text-text-muted">{h.company} · {formatRelativeTime(h.created_at)}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold" style={{
                    color: h.match_score >= 70 ? 'var(--green-soft)' : h.match_score >= 40 ? 'var(--amber-soft)' : '#F87171'
                  }}>
                    {h.match_score}%
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </PageSection>
      )}
    </PageWrapper>
  )
}
