import { motion } from 'framer-motion'
import { getScoreColor } from '@/lib/utils'

interface Props {
  score: number
  className?: string
  showLabel?: boolean
}

export function ScoreBar({ score, className, showLabel = false }: Props) {
  const color = getScoreColor(score)
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Match</span>
          <span className="font-mono font-medium" style={{ color }}>{score}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
