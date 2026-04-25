import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, MessageSquare, ChevronDown, Edit3 } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { CompanyAvatar } from '@/components/ui/CompanyAvatar'
import { Modal } from '@/components/ui/Modal'
import { StreamingText } from '@/components/ui/StreamingText'
import { useReferralContacts, useUpdateReferralStatus } from '@/hooks/useSupabase'
import { useStore } from '@/store/useStore'
import { draftDM } from '@/lib/claude'
import type { ReferralContact, OutreachStatus } from '@/lib/supabase'

const STATUS_BADGE: Record<OutreachStatus, 'gray' | 'amber' | 'teal' | 'green'> = {
  not_started: 'gray',
  messaged: 'amber',
  replied: 'teal',
  coffee_chat_done: 'green',
}

const STATUS_LABEL: Record<OutreachStatus, string> = {
  not_started: 'Not Started',
  messaged: 'Messaged',
  replied: 'Replied',
  coffee_chat_done: 'Coffee Chat Done',
}

const TEMPLATE_TYPES = [
  { value: 'coffee_chat', label: 'Coffee Chat Request' },
  { value: 'referral_ask', label: 'Referral Ask' },
  { value: 'followup', label: 'Follow-up' },
]

export function Referrals() {
  const { data: contacts = [], isLoading } = useReferralContacts()
  const { mutate: updateStatus } = useUpdateReferralStatus()
  const { referralFilters, setReferralFilter } = useStore()

  const [draftModal, setDraftModal] = useState<{
    contact: ReferralContact
    templateType: string
  } | null>(null)
  const [dmLines, setDmLines] = useState<string>('')
  const [drafting, setDrafting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = contacts.filter(c => {
    if (referralFilters.company && c.companies?.name !== referralFilters.company) return false
    if (referralFilters.status && c.status !== referralFilters.status) return false
    return true
  })

  const handleDraftDM = async (contact: ReferralContact, templateType: string) => {
    setDrafting(true)
    setDmLines('')
    try {
      const result = await draftDM({
        company: contact.companies?.name ?? 'the company',
        roleType: contact.companies?.field?.join(', ') ?? 'Software Engineering',
        templateType,
      })
      setDmLines(result.message)
    } catch {
      setDmLines('[Claude API not configured. Add ANTHROPIC_API_KEY to Settings to enable DM drafts.]')
    } finally {
      setDrafting(false)
    }
  }

  const copyDM = async () => {
    await navigator.clipboard.writeText(dmLines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageWrapper>
      <PageSection>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-text-primary">Referral Network</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Strategic outreach for your target companies
          </p>
        </div>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <div className="flex gap-3 mb-6 flex-wrap">
          <Select
            value={referralFilters.status}
            onChange={v => setReferralFilter('status', v as OutreachStatus | '')}
            placeholder="All Statuses"
            options={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
            className="w-44"
          />
        </div>
      </PageSection>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="skeleton h-5 w-32 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((contact, i) => (
            <ReferralCard
              key={contact.id}
              contact={contact}
              index={i}
              expanded={expandedId === contact.id}
              onExpand={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              onStatusChange={(status) => updateStatus({ id: contact.id, status })}
              onDraftDM={(templateType) => {
                setDraftModal({ contact, templateType })
                handleDraftDM(contact, templateType)
              }}
            />
          ))}
        </motion.div>
      )}

      {/* DM Draft Modal */}
      <Modal
        open={!!draftModal}
        onClose={() => { setDraftModal(null); setDmLines('') }}
        title={`Draft DM — ${draftModal?.contact.companies?.name ?? ''}`}
        size="lg"
      >
        {draftModal && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {TEMPLATE_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => handleDraftDM(draftModal.contact, t.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    draftModal.templateType === t.value
                      ? 'bg-purple-dim/20 text-purple-bright border border-purple-dim/30'
                      : 'text-text-muted border border-transparent hover:text-text-secondary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {drafting ? (
              <div className="py-4">
                <p className="text-xs text-text-muted mb-3">Generating personalized DM...</p>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-purple-mid"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            ) : dmLines ? (
              <div className="relative">
                <pre className="text-xs text-text-secondary whitespace-pre-wrap bg-white/3 rounded-xl p-4 border border-white/5 max-h-80 overflow-y-auto font-body">
                  {dmLines}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3"
                  onClick={copyDM}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}

interface ReferralCardProps {
  contact: ReferralContact
  index: number
  expanded: boolean
  onExpand: () => void
  onStatusChange: (status: OutreachStatus) => void
  onDraftDM: (templateType: string) => void
}

function ReferralCard({ contact, index, expanded, onExpand, onStatusChange, onDraftDM }: ReferralCardProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(contact.notes ?? '')
  const { mutate: updateStatus } = useUpdateReferralStatus()
  const companyName = contact.companies?.name ?? 'Unknown'

  const saveNote = () => {
    updateStatus({ id: contact.id, status: contact.status, notes: noteText })
    setEditingNote(false)
  }

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <Card hover={false} animate={false} className="!p-0 overflow-hidden">
        <button className="w-full p-5 text-left" onClick={onExpand} aria-expanded={expanded}>
          <div className="flex items-start gap-3">
            <CompanyAvatar company={companyName} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-semibold text-sm text-text-primary">{companyName}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.companies?.field?.map(f => (
                      <span key={f} className="badge badge-gray text-2xs">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_BADGE[contact.status]}>
                    {STATUS_LABEL[contact.status]}
                  </Badge>
                  <ChevronDown
                    size={14}
                    className="text-text-muted transition-transform"
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </div>
            </div>
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
                {contact.companies?.outreach_strategy && (
                  <div>
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Strategy</p>
                    <p className="text-xs text-text-secondary">{contact.companies.outreach_strategy}</p>
                  </div>
                )}

                {contact.companies?.timing_advice && (
                  <div>
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider mb-1.5">Timing</p>
                    <p className="text-xs text-text-secondary">{contact.companies.timing_advice}</p>
                  </div>
                )}

                {contact.companies?.linkedin_query && (
                  <div>
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider mb-1.5">LinkedIn Search</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-purple-bright bg-white/5 px-2 py-1 rounded flex-1 truncate">
                        {contact.companies.linkedin_query}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(contact.companies?.linkedin_query ?? '')}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                        aria-label="Copy LinkedIn query"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-2xs font-medium text-text-muted uppercase tracking-wider">Notes</p>
                    <button
                      onClick={() => editingNote ? saveNote() : setEditingNote(true)}
                      className="text-text-muted hover:text-text-primary transition-colors"
                    >
                      {editingNote ? <Check size={12} /> : <Edit3 size={12} />}
                    </button>
                  </div>
                  {editingNote ? (
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      className="input-field text-xs h-16 w-full"
                      autoFocus
                    />
                  ) : (
                    <p className="text-xs text-text-secondary">
                      {noteText || <span className="text-text-muted italic">No notes yet.</span>}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={contact.status}
                    onChange={v => onStatusChange(v as OutreachStatus)}
                    options={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
                    className="flex-1 min-w-32"
                  />
                  <Button
                    size="sm"
                    onClick={() => onDraftDM('coffee_chat')}
                  >
                    <MessageSquare size={12} />
                    Draft DM
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
