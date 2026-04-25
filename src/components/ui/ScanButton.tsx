import { motion, AnimatePresence } from 'framer-motion'
import { Scan, Check, Loader2 } from 'lucide-react'

interface Props {
  running: boolean
  onTrigger: () => void
  completed?: boolean
}

export function ScanButton({ running, onTrigger, completed }: Props) {
  return (
    <motion.button
      onClick={onTrigger}
      disabled={running}
      className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus-ring disabled:cursor-not-allowed"
      style={{
        background: running
          ? 'rgba(167,139,250,0.1)'
          : 'linear-gradient(135deg, var(--purple-dim), #6d28d9)',
        border: '1px solid rgba(196,181,253,0.2)',
        color: 'var(--text-primary)',
        boxShadow: running ? 'none' : '0 0 20px rgba(124,58,237,0.3)',
      }}
      whileTap={{ scale: running ? 1 : 0.97 }}
    >
      <AnimatePresence mode="wait">
        {running ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={15} className="animate-spin" />
            Scanning...
          </motion.span>
        ) : completed ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check size={15} />
            Scan Complete
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Scan size={15} />
            Scan Now
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
