import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, ChevronDown, Edit3, Check } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CompanyAvatar } from '@/components/ui/CompanyAvatar'
import { useTimeline, useUpdateTimelineNote } from '@/hooks/useSupabase'
import type { TimelineEvent } from '@/lib/supabase'

const URGENCY_CONFIG = {
  open_now: { label: 'Open Now', color: 'var(--green-soft)', badge: 'green' as const, ring: 'border-green-soft' },
  opening_soon: { label: 'Opening Soon', color: 'var(--amber-soft)', badge: 'amber' as const, ring: 'border-amber-soft' },
  upcoming: { label: 'Upcoming', color: '#60A5FA', badge: 'purple' as const, ring: 'border-blue-400' },
  unknown: { label: 'TBD', color: 'var(--text-muted)', badge: 'gray' as const, ring: 'border-text-muted' },
}

export function Timeline() {
  const { data: events = [], isLoading } = useTimeline()

  const sorted = [...(events as TimelineEvent[])].sort((a, b) => {
    const urgencyOrder: Record<string, number> = { open_now: 0, opening_soon: 1, upcoming: 2, unknown: 3 }
    const aOrder = urgencyOrder[a.urgency] ?? 3
    const bOrder = urgencyOrder[b.urgency] ?? 3
    if (aOrder !== bOrder) return aOrder - bOrder
    if (!a.expected_date) return 1
    if (!b.expected_date) return -1
    return new Date(a.expected_date).getTime() - new Date(b.expected_date).getTime()
  })

  if (isLoading) return <TimelineSkeleton />

  return (
    <PageWrapper>
      <PageSection>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-text-primary">Application Timeline</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Track when each company opens applications. Don't miss a window.
          </p>
        </div>
      </PageSection>

      {/* Desktop: horizontal scroll timeline header */}
      <PageSection>
        <div className="glass-card p-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-8 min-w-max px-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
              const now = new Date()
              const isNow = now.getMonth() === i
              return (
                <div key={month} className="text-center">
                  <div
                    className="w-2 h-2 rounded-full mx-auto mb-1"
                    style={{
                      background: isNow ? 'var(--purple-bright)' : 'var(--text-muted)',
                      boxShadow: isNow ? 'var(--glow-sm)' : 'none',
                    }}
                  />
                  <p className={`text-xs ${isNow ? 'text-purple-bright font-semibold' : 'text-text-muted'}`}>
                    {month}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </PageSection>

      {/* Timeline nodes */}
      <PageSection>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent)' }}
          />

          {/* Animated draw line */}
          <svg className="absolute left-5 top-0 bottom-0 hidden md:block" width="2" height="100%" style={{ overflow: 'visible' }}>
            <motion.line
              x1="1" y1="0" x2="1" y2="100%"
              stroke="var(--purple-dim)"
              strokeWidth="1"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </svg>

          <div className="space-y-4 md:pl-14">
            {sorted.map((event, i) => (
              <TimelineNode key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  )
}

function TimelineNode({ event, index }: { event: TimelineEvent; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(event.notes ?? '')
  const { mutate: updateNote } = useUpdateTimelineNote()

  const config = URGENCY_CONFIG[event.urgency]
  const companyName = event.companies?.name ?? 'Unknown'

  const saveNote = () => {
    updateNote({ id: event.id, notes: noteText })
    setEditingNote(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative"
    >
      {/* Node dot (desktop) */}
      <div
        className="absolute -left-[3.25rem] top-5 w-4 h-4 rounded-full border-2 hidden md:flex items-center justify-center"
        style={{
          background: `${config.color}20`,
          borderColor: config.color,
          boxShadow: `0 0 12px ${config.color}40`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: config.color }}
        />
      </div>

      <div className="glass-card">
        <button
          className="w-full p-5 text-left"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <CompanyAvatar company={companyName} size="sm" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-sm text-text-primary">{companyName}</h3>
                  <Badge variant={config.badge}>{config.label}</Badge>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{event.event_type}</p>
                {event.expected_date && (
                  <p className="text-xs text-text-muted mt-0.5">
                    Expected: {new Date(event.expected_date).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
            <ChevronDown
              size={16}
              className="text-text-muted flex-shrink-0 mt-1 transition-transform"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-text-muted mb-1">Confidence</p>
                    <p className="text-text-secondary">{Math.round(event.confidence * 100)}%</p>
                  </div>
                  {event.verified_at && (
                    <div>
                      <p className="text-text-muted mb-1">Last Verified</p>
                      <p className="text-text-secondary">
                        {new Date(event.verified_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {event.source_url && (
                    <div className="col-span-2">
                      <p className="text-text-muted mb-1">Source</p>
                      <a
                        href={event.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-mid hover:text-purple-bright text-xs flex items-center gap-1 transition-colors"
                      >
                        View source <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider">Notes</p>
                    <button
                      onClick={() => setEditingNote(!editingNote)}
                      className="text-text-muted hover:text-text-primary transition-colors"
                      aria-label="Edit note"
                    >
                      {editingNote ? <Check size={12} onClick={saveNote} /> : <Edit3 size={12} />}
                    </button>
                  </div>
                  {editingNote ? (
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      className="input-field text-xs h-20 w-full"
                      placeholder="Add notes about this opportunity..."
                      autoFocus
                    />
                  ) : (
                    <p className="text-xs text-text-secondary">
                      {noteText || <span className="text-text-muted italic">No notes yet. Click edit to add.</span>}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {event.apply_url && (
                    <Button
                      size="sm"
                      onClick={() => window.open(event.apply_url!, '_blank')}
                    >
                      <ExternalLink size={12} />
                      Apply
                    </Button>
                  )}
                  {event.companies?.careers_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(event.companies!.careers_url!, '_blank')}
                    >
                      Careers Page
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function TimelineSkeleton() {
  return (
    <PageWrapper>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
