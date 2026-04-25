import { cn } from '@/lib/utils'

type Variant = 'purple' | 'green' | 'amber' | 'red' | 'gray' | 'teal' | 'pink'

interface Props {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const variantMap: Record<Variant, string> = {
  purple: 'badge-purple',
  green: 'badge-green',
  amber: 'badge-amber',
  red: 'badge-red',
  gray: 'badge-gray',
  teal: 'badge-teal',
  pink: 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20',
}

export function Badge({ variant = 'gray', children, className }: Props) {
  return (
    <span className={cn('badge', variantMap[variant], className)}>
      {children}
    </span>
  )
}
