import { motion } from 'framer-motion'

interface Props {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="40" fill="rgba(167,139,250,0.06)" stroke="rgba(167,139,250,0.15)" strokeWidth="1.5"/>
          <path
            d="M60 30 L65 45 L80 48 L69 59 L72 74 L60 67 L48 74 L51 59 L40 48 L55 45 Z"
            fill="rgba(167,139,250,0.2)"
            stroke="rgba(167,139,250,0.4)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="60" r="6" fill="var(--purple-mid)" opacity="0.8"/>
          <line x1="60" y1="70" x2="60" y2="95" stroke="rgba(167,139,250,0.3)" strokeWidth="2" strokeDasharray="4 3"/>
          <ellipse cx="60" cy="97" rx="10" ry="3" fill="rgba(167,139,250,0.15)"/>
        </svg>
      </motion.div>
      <div className="text-center space-y-2">
        <p className="font-display text-lg font-medium text-text-primary">{title}</p>
        {description && <p className="text-sm text-text-secondary max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}
