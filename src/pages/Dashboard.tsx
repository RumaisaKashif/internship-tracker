import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, ArrowRight, TrendingUp, Briefcase, Search, Star, X } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { CompanyAvatar } from '@/components/ui/CompanyAvatar'
import { ScoreBar } from '@/components/ui/ScoreBar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { useInternships, useScanLogs } from '@/hooks/useSupabase'
import { useStore } from '@/store/useStore'
import { getGreeting, formatRelativeTime, formatCountdown } from '@/lib/utils'

const STAT_ICONS = [Briefcase, TrendingUp, Star, Search]
const STAT_COLORS = ['var(--purple-bright)', 'var(--teal-soft)', 'var(--amber-soft)', 'var(--pink-soft)']

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { data: internships = [], isLoading } = useInternships()
  const { data: scanLogs = [] } = useScanLogs()
  const { dismissedUrgencyBanners, dismissUrgencyBanner, setJobStatus } = useStore()

  const stats = useMemo(() => {
    const total = internships.length
    const applied = internships.filter(i => i.status === 'applied').length
    const interviewing = internships.filter(i => i.status === 'interviewing').length
    const isNew = internships.filter(i => i.is_new).length
    return [
      { label: 'Total Saved', value: total, icon: 0 },
      { label: 'Applied', value: applied, icon: 1 },
      { label: 'Interviewing', value: interviewing, icon: 2 },
      { label: 'New Listings', value: isNew, icon: 3 },
    ]
  }, [internships])

  const urgentCompanies = useMemo(() =>
    internships.filter(i =>
      i.days_until_deadline !== null &&
      i.days_until_deadline <= 30 &&
      i.days_until_deadline > 0 &&
      !dismissedUrgencyBanners.includes(i.id)
    ).slice(0, 3),
    [internships, dismissedUrgencyBanners]
  )

  const topListings = useMemo(() =>
    [...internships]
      .sort((a, b) => b.match_score - a.match_score)
      .filter(i => i.status === 'saved')
      .slice(0, 3),
    [internships]
  )

  const nextScanDate = useMemo(() => {
    const lastScan = scanLogs[0]
    if (!lastScan?.completed_at) return new Date(Date.now() + 48 * 3600 * 1000)
    return new Date(new Date(lastScan.completed_at).getTime() + 48 * 3600 * 1000)
  }, [scanLogs])

  const recentActivity = useMemo(() => {
    const events: Array<{ text: string; time: string; type: 'scan' | 'new' | 'status' }> = []
    for (const log of scanLogs.slice(0, 3)) {
      events.push({
        text: `Scan completed — ${log.listings_added} listings added`,
        time: log.completed_at ?? log.started_at,
        type: 'scan',
      })
    }
    for (const i of internships.filter(j => j.is_new).slice(0, 5)) {
      events.push({
        text: `New: ${i.role} at ${i.company}`,
        time: i.created_at,
        type: 'new',
      })
    }
    return events
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8)
  }, [scanLogs, internships])

  if (isLoading) return <DashboardSkeleton />

  return (
    <PageWrapper>
      {/* Greeting */}
      <PageSection>
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-gradient mb-1">
            {getGreeting('Rumaisa')}
          </h1>
          <p className="text-text-secondary text-sm">
            Here's what's happening with your Summer 2027 internship hunt.
          </p>
        </div>
      </PageSection>

      {/* Urgency banners */}
      {urgentCompanies.length > 0 && (
        <PageSection>
          <div className="mb-6 space-y-2">
            {urgentCompanies.map(company => (
              <motion.div
                key={company.id}
                layout
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(252,211,77,0.06)',
                  border: '1px solid rgba(252,211,77,0.2)',
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="glow-dot glow-dot-amber animate-pulse-soft flex-shrink-0" />
                <p className="text-sm text-amber-soft flex-1">
                  <span className="font-medium">{company.company}</span>
                  {' — '}window closes in {company.days_until_deadline} days
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissUrgencyBanner(company.id)}
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </Button>
              </motion.div>
            ))}
          </div>
        </PageSection>
      )}

      {/* Stats */}
      <PageSection>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[stat.icon]
            return (
              <Card key={stat.label} delay={i * 0.07}>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${STAT_COLORS[i]}18` }}
                  >
                    <Icon size={18} style={{ color: STAT_COLORS[i] }} />
                  </div>
                </div>
                <AnimatedCounter
                  value={stat.value}
                  className="font-display text-3xl font-bold text-text-primary block"
                />
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </Card>
            )
          })}
        </div>
      </PageSection>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next scan countdown */}
        <PageSection>
          <Card hover={false}>
            <div className="flex items-center gap-3 mb-4">
              <Search size={16} className="text-purple-mid" />
              <h3 className="font-display font-medium text-text-primary">Next Auto-Scan</h3>
            </div>
            <div className="font-mono text-2xl font-semibold text-purple-bright">
              <NextScanCountdown target={nextScanDate} />
            </div>
            <p className="text-xs text-text-muted mt-1">Gmail scanner runs every 48h</p>
          </Card>
        </PageSection>

        {/* Recent activity */}
        <PageSection>
          <Card hover={false} className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={16} className="text-purple-mid" />
              <h3 className="font-display font-medium text-text-primary">Recent Activity</h3>
            </div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-text-muted">No recent activity. Trigger a scan to start.</p>
              ) : (
                recentActivity.map((event, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background: event.type === 'scan'
                          ? 'var(--green-soft)'
                          : event.type === 'new'
                          ? 'var(--purple-bright)'
                          : 'var(--amber-soft)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary truncate">{event.text}</p>
                      <p className="text-2xs text-text-muted">{formatRelativeTime(event.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </PageSection>
      </div>

      {/* Quick-apply strip */}
      {topListings.length > 0 && (
        <PageSection>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-medium text-text-primary">Top Matches — Apply Now</h3>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs text-purple-mid hover:text-purple-bright transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {topListings.map((listing, i) => (
                <Card key={listing.id} delay={i * 0.07}>
                  <div className="flex items-start gap-3 mb-3">
                    <CompanyAvatar company={listing.company} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-text-primary truncate">{listing.role}</p>
                      <p className="text-xs text-text-secondary truncate">{listing.company}</p>
                    </div>
                  </div>
                  <ScoreBar score={listing.match_score} showLabel />
                  <div className="flex items-center justify-between mt-3">
                    <StatusPill status={listing.status} />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setJobStatus(listing.id, 'applied')
                        if (listing.apply_url) window.open(listing.apply_url, '_blank')
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </PageSection>
      )}
    </PageWrapper>
  )
}

function NextScanCountdown({ target }: { target: Date }) {
  const [, setTick] = [0, () => {}]
  const countdown = formatCountdown(target)

  return <span>{countdown}</span>
}

function DashboardSkeleton() {
  return (
    <PageWrapper>
      <div className="mb-8 space-y-2">
        <div className="skeleton h-10 w-64" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="skeleton h-9 w-9 rounded-xl mb-3" />
            <div className="skeleton h-8 w-16 mb-1" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
