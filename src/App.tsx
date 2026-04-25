import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Dashboard } from '@/pages/Dashboard'
import { Jobs } from '@/pages/Jobs'
import { Timeline } from '@/pages/Timeline'
import { LeetCode } from '@/pages/LeetCode'
import { Optimizer } from '@/pages/Optimizer'
import { Referrals } from '@/pages/Referrals'
import { Settings } from '@/pages/Settings'
import { useStore } from '@/store/useStore'

const PAGES: Record<string, React.ComponentType<{ onNavigate: (tab: string) => void }>> = {
  dashboard: Dashboard,
  jobs: Jobs,
  timeline: Timeline,
  leetcode: LeetCode,
  optimizer: Optimizer,
  referrals: Referrals,
  settings: Settings,
}

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { scanRunning } = useStore()

  const ActivePage = PAGES[activeTab] ?? Dashboard

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        scanRunning={scanRunning}
      />

      {/* Main content area */}
      <main
        className="md:pl-[60px] pb-20 md:pb-0 min-h-screen"
        id="main-content"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ActivePage onNavigate={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
