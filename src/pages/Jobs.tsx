import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ExternalLink, ChevronDown } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card, CardSkeleton } from '@/components/ui/Card'
import { CompanyAvatar } from '@/components/ui/CompanyAvatar'
import { ScoreBar } from '@/components/ui/ScoreBar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ScanButton } from '@/components/ui/ScanButton'
import { StreamingText } from '@/components/ui/StreamingText'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { useInternships, useUpdateInternshipStatus } from '@/hooks/useSupabase'
import { useRealtimeInternships } from '@/hooks/useRealtime'
import { useScan } from '@/hooks/useScan'
import { useStore } from '@/store/useStore'
import type { Internship, ApplicationStatus } from '@/lib/supabase'

const LOC_BADGE: Record<string, 'purple' | 'amber' | 'gray'> = {
  remote: 'purple',
  hybrid: 'amber',
  onsite: 'gray',
}

export function Jobs() {
  useRealtimeInternships()
  const { data: internships = [], isLoading } = useInternships()
  const { mutate: updateStatus } = useUpdateInternshipStatus()
  const { triggerScan, scanRunning } = useScan()
  const { jobFilters, setJobFilter, jobSort, setJobSort, scanLog } = useStore()
  const [scanCompleted, setScanCompleted] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleScan = async () => {
    setScanCompleted(false)
    await triggerScan()
    setScanCompleted(true)
  }

  const filtered = useMemo(() => {
    let list = [...internships]

    if (jobFilters.search) {
      const q = jobFilters.search.toLowerCase()
      list = list.filter(i =>
        i.role.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      )
    }
    if (jobFilters.locType) list = list.filter(i => i.loc_type === jobFilters.locType)
    if (jobFilters.paid === 'paid') list = list.filter(i => i.paid)
    if (jobFilters.paid === 'unpaid') list = list.filter(i => !i.paid)
    if (jobFilters.status) list = list.filter(i => i.status === jobFilters.status)
    if (jobFilters.minScore > 0) list = list.filter(i => i.match_score >= jobFilters.minScore)

    list.sort((a, b) => {
      if (jobSort === 'match_score') return b.match_score - a.match_score
      if (jobSort === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (jobSort === 'deadline') {
        if (!a.days_until_deadline) return 1
        if (!b.days_until_deadline) return -1
        return a.days_until_deadline - b.days_until_deadline
      }
      return 0
    })

    return list
  }, [internships, jobFilters, jobSort])

  return (
    <PageWrapper>
      <PageSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary">Job Postings</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} · updated via Gmail scan
            </p>
          </div>
          <ScanButton running={scanRunning} onTrigger={handleScan} completed={scanCompleted} />
        </div>
      </PageSection>

      {/* Scan log */}
      <AnimatePresence>
        {(scanRunning || scanLog.length > 0) && (
          <PageSection>
            <motion.div
              className="glass-card p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Scan Log</p>
              <StreamingText lines={scanLog} />
            </motion.div>
          </PageSection>
        )}
      </AnimatePresence>

      {/* Filters */}
      <PageSection>
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Input
              placeholder="Search..."
              value={jobFilters.search}
              onChange={e => setJobFilter('search', e.target.value)}
              className="col-span-2"
            />
            <Select
              value={jobFilters.locType}
              onChange={v => setJobFilter('locType', v)}
              placeholder="Location"
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' },
              ]}
            />
            <Select
              value={jobFilters.paid}
              onChange={v => setJobFilter('paid', v)}
              placeholder="Pay"
              options={[
                { value: 'paid', label: 'Paid only' },
                { value: 'unpaid', label: 'Unpaid' },
              ]}
            />
            <Select
              value={jobFilters.status}
              onChange={v => setJobFilter('status', v)}
              placeholder="Status"
              options={[
                { value: 'saved', label: 'Saved' },
                { value: 'applied', label: 'Applied' },
                { value: 'interviewing', label: 'Interviewing' },
                { value: 'offer', label: 'Offer' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
            <Select
              value={jobSort}
              onChange={v => setJobSort(v as typeof jobSort)}
              options={[
                { value: 'match_score', label: 'Match Score' },
                { value: 'created_at', label: 'Date Added' },
                { value: 'deadline', label: 'Deadline' },
              ]}
              label=""
            />
          </div>
        </div>
      </PageSection>

      {/* Listings grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No listings found"
          description="Run a scan to discover new internship opportunities from your Gmail alerts."
          action={
            <Button onClick={() => triggerScan()}>
              Run First Scan
            </Button>
          }
        />
      ) : (
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((listing, i) => (
            <JobCard
              key={listing.id}
              listing={listing}
              expanded={expandedId === listing.id}
              onExpand={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
              onStatusChange={(status) => updateStatus({ id: listing.id, status })}
              index={i}
            />
          ))}
        </motion.div>
      )}
    </PageWrapper>
  )
}

interface JobCardProps {
  listing: Internship
  expanded: boolean
  onExpand: () => void
  onStatusChange: (status: ApplicationStatus) => void
  index: number
}

const USER_SKILLS = [
  'Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'React', 'PyTorch', 'TensorFlow',
  'LangChain', 'FastAPI', 'Docker', 'AWS', 'Supabase', 'Redis', 'OpenCV', 'NumPy',
  'RAG', 'LLM', 'ML', 'AI', 'Computer Vision', 'OCaml',
]

function JobCard({ listing, expanded, onExpand, onStatusChange, index }: JobCardProps) {
  const matchingSkills = listing.skills_required.filter(s =>
    USER_SKILLS.some(us => us.toLowerCase() === s.toLowerCase())
  )

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      layout
    >
      <Card hover={false} animate={false} className="!p-0 overflow-hidden">
        <div
          className="p-5 cursor-pointer"
          onClick={onExpand}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <CompanyAvatar company={listing.company} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-sm text-text-primary truncate">
                    {listing.role}
                  </h3>
                  <p className="text-xs text-text-secondary">{listing.company}</p>
                </div>
                <ChevronDown
                  size={16}
                  className="text-text-muted flex-shrink-0 mt-0.5 transition-transform"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </div>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant={listing.paid ? 'green' : 'gray'}>
              {listing.paid
                ? listing.wage
                  ? `$${listing.wage}/${listing.wage_period ?? 'mo'}`
                  : 'Paid'
                : 'Unpaid'}
            </Badge>
            <Badge variant={LOC_BADGE[listing.loc_type] ?? 'gray'}>
              {listing.loc_type}
            </Badge>
            {listing.days_until_deadline !== null && (
              <Badge variant={listing.days_until_deadline <= 7 ? 'red' : 'gray'}>
                {listing.days_until_deadline <= 0 ? 'Deadline passed' : `${listing.days_until_deadline}d left`}
              </Badge>
            )}
            {listing.is_new && <Badge variant="purple">New</Badge>}
          </div>

          {/* Description */}
          <p className="text-xs text-text-secondary line-clamp-2 mb-3">
            {listing.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.skills_required.slice(0, 6).map(skill => (
              <span
                key={skill}
                className={`badge text-2xs ${
                  matchingSkills.includes(skill)
                    ? 'badge-purple'
                    : 'badge-gray'
                }`}
              >
                {skill}
              </span>
            ))}
            {listing.skills_required.length > 6 && (
              <span className="badge badge-gray text-2xs">
                +{listing.skills_required.length - 6}
              </span>
            )}
          </div>

          {/* Score bar */}
          <ScoreBar score={listing.match_score} showLabel />
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0 border-t border-white/5">
                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Requirements</p>
                    <p className="text-xs text-text-secondary">{listing.requirements || 'No requirements listed.'}</p>
                  </div>
                  <div>
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Source</p>
                    <p className="text-xs text-text-secondary">{listing.source}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={listing.status}
                      onChange={(v) => onStatusChange(v as ApplicationStatus)}
                      options={[
                        { value: 'saved', label: 'Saved' },
                        { value: 'applied', label: 'Applied' },
                        { value: 'interviewing', label: 'Interviewing' },
                        { value: 'offer', label: 'Offer' },
                        { value: 'rejected', label: 'Rejected' },
                      ]}
                      className="flex-1"
                    />
                    {listing.apply_url && (
                      <Button
                        size="sm"
                        onClick={() => window.open(listing.apply_url!, '_blank')}
                      >
                        <ExternalLink size={13} />
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <StatusPill status={listing.status} />
          <p className="text-2xs text-text-muted">via {listing.source}</p>
        </div>
      </Card>
    </motion.div>
  )
}
