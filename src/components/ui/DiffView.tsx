import { motion } from 'framer-motion'
import type { computeDiff } from '@/lib/utils'

interface Props {
  diff: ReturnType<typeof computeDiff>
}

export function DiffView({ diff }: Props) {
  return (
    <div className="font-mono text-xs rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 space-y-0.5 max-h-96 overflow-y-auto">
        {diff.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.005 }}
            className={`px-2 py-0.5 rounded ${
              line.type === 'added'
                ? 'bg-green-500/10 text-green-300'
                : line.type === 'removed'
                ? 'bg-red-500/10 text-red-400 line-through opacity-60'
                : 'text-text-muted'
            }`}
          >
            <span className="mr-2 select-none">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            {line.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
