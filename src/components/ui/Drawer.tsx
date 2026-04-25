import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: 'right' | 'left'
  width?: string
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-[480px]' }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} z-50 h-full ${width} max-w-full`}
            style={{
              background: 'rgba(14, 14, 25, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: side === 'right' ? '1px solid var(--border)' : 'none',
              borderRight: side === 'left' ? '1px solid var(--border)' : 'none',
            }}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                {title && (
                  <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
