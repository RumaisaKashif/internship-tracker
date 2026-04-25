import { motion } from 'framer-motion'

interface Props {
  lines: string[]
  className?: string
}

export function StreamingText({ lines, className }: Props) {
  return (
    <div className={`font-mono text-xs space-y-0.5 ${className ?? ''}`}>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="text-text-secondary"
        >
          <span className="text-purple-mid mr-2">›</span>
          {line}
        </motion.div>
      ))}
      {lines.length > 0 && (
        <motion.span
          className="inline-block w-2 h-4 bg-purple-mid ml-4"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}
