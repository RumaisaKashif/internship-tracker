import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  Code2,
  FileText,
  Users,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'timeline', label: 'Timeline', icon: GitBranch },
  { id: 'leetcode', label: 'LeetCode', icon: Code2 },
  { id: 'optimizer', label: 'Optimizer', icon: FileText },
  { id: 'referrals', label: 'Referrals', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface Props {
  activeTab: string
  onNavigate: (tab: string) => void
  scanRunning?: boolean
}

export function Sidebar({ activeTab, onNavigate, scanRunning }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <motion.nav
        className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 py-6"
        style={{
          background: 'rgba(9, 9, 20, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border)',
        }}
        animate={{ width: expanded ? 220 : 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center px-3 mb-8 h-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--purple-dim), #4c1d95)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="4" fill="white" opacity="0.9"/>
              <path d="M9 2 L9 4 M9 14 L9 16 M2 9 L4 9 M14 9 L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="ml-3 font-display font-semibold text-sm text-text-primary whitespace-nowrap"
              >
                InternTrack
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative flex items-center h-10 px-2.5 rounded-xl transition-colors duration-200 focus-ring w-full',
                  active
                    ? 'text-purple-bright'
                    : 'text-text-muted hover:text-text-secondary'
                )}
                style={{
                  background: active ? 'rgba(167,139,250,0.12)' : 'transparent',
                  borderLeft: active ? '2px solid var(--purple-bright)' : '2px solid transparent',
                }}
                whileTap={{ scale: 0.96 }}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="ml-3 text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Bottom: user + scan status */}
        <div className="px-2 space-y-3">
          <div className="flex items-center gap-2 px-2.5 h-10">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--purple-dim), #6d28d9)' }}
            >
              RK
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-2 min-w-0"
                >
                  <span className="text-xs text-text-secondary truncate">Rumaisa K.</span>
                  <span
                    className={cn('glow-dot flex-shrink-0', scanRunning ? 'glow-dot-amber' : 'glow-dot-green')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {!expanded && (
              <span className={cn('absolute right-2 bottom-16 glow-dot', scanRunning ? 'glow-dot-amber' : 'glow-dot-green')} />
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-safe"
        style={{
          background: 'rgba(9,9,20,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
          paddingTop: '8px',
          paddingBottom: '12px',
        }}
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.slice(0, 6).map(item => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors',
                active ? 'text-purple-bright' : 'text-text-muted'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} />
              <span className="text-2xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
