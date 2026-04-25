import type { ApplicationStatus } from '@/lib/supabase'
import { Badge } from './Badge'

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; variant: 'purple' | 'green' | 'amber' | 'red' | 'gray' | 'teal' }> = {
  saved: { label: 'Saved', variant: 'gray' },
  applied: { label: 'Applied', variant: 'purple' },
  interviewing: { label: 'Interviewing', variant: 'teal' },
  offer: { label: 'Offer', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
}

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { label, variant } = STATUS_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}
