import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  animate?: boolean
  delay?: number
}

export function Card({ children, className, hover = true, onClick, animate = true, delay = 0 }: Props) {
  const content = (
    <motion.div
      className={cn('glass-card p-5', hover && 'cursor-pointer', className)}
      whileHover={hover ? { scale: 1.015, y: -3 } : undefined}
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 16 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      layout
    >
      {children}
    </motion.div>
  )
  return content
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-5', className)}>
      <div className="space-y-3">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
