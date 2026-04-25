export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 17) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatCountdown(targetDate: Date): string {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return 'Now'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'var(--green-soft)'
  if (score >= 40) return 'var(--amber-soft)'
  return '#F87171'
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return 'Strong Match'
  if (score >= 40) return 'Partial Match'
  return 'Low Match'
}

export function getCompanyGradient(company: string): string {
  const gradients: Record<string, string> = {
    Google: 'linear-gradient(135deg, #4285F4, #34A853)',
    Meta: 'linear-gradient(135deg, #0668E1, #1C2B4B)',
    Amazon: 'linear-gradient(135deg, #FF9900, #E47911)',
    Microsoft: 'linear-gradient(135deg, #00BCF2, #0067B8)',
    Apple: 'linear-gradient(135deg, #555, #222)',
    Anthropic: 'linear-gradient(135deg, #E07B54, #CC4B24)',
    OpenAI: 'linear-gradient(135deg, #10a37f, #147060)',
    'Jane Street': 'linear-gradient(135deg, #C4B5FD, #7C3AED)',
    Citadel: 'linear-gradient(135deg, #EF4444, #991B1B)',
    'Two Sigma': 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    'D.E. Shaw': 'linear-gradient(135deg, #06B6D4, #0E7490)',
    Optiver: 'linear-gradient(135deg, #F59E0B, #B45309)',
    Palantir: 'linear-gradient(135deg, #6366F1, #4338CA)',
    Stripe: 'linear-gradient(135deg, #635BFF, #3B35CC)',
    Databricks: 'linear-gradient(135deg, #FF6900, #CC5500)',
    'Scale AI': 'linear-gradient(135deg, #FF6B6B, #CC3333)',
    HRT: 'linear-gradient(135deg, #10B981, #065F46)',
    'Five Rings': 'linear-gradient(135deg, #F472B6, #BE185D)',
    LinkedIn: 'linear-gradient(135deg, #0A66C2, #004182)',
    Grab: 'linear-gradient(135deg, #00B14F, #007A36)',
    'Sea Group': 'linear-gradient(135deg, #EE4D2D, #B83A22)',
  }
  return gradients[company] || `linear-gradient(135deg, #A78BFA, #7C3AED)`
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function computeDiff(original: string, modified: string): Array<{ type: 'same' | 'added' | 'removed'; content: string }> {
  const origLines = original.split('\n')
  const modLines = modified.split('\n')
  const result: Array<{ type: 'same' | 'added' | 'removed'; content: string }> = []

  const maxLen = Math.max(origLines.length, modLines.length)
  for (let i = 0; i < maxLen; i++) {
    const origLine = origLines[i]
    const modLine = modLines[i]
    if (origLine === modLine) {
      result.push({ type: 'same', content: origLine ?? '' })
    } else {
      if (origLine !== undefined) result.push({ type: 'removed', content: origLine })
      if (modLine !== undefined) result.push({ type: 'added', content: modLine })
    }
  }
  return result
}
