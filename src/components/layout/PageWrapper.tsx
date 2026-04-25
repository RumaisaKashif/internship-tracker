import { motion, type Variants } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PageWrapper({ children, className }: Props) {
  return (
    <motion.div
      className={`p-6 md:p-8 max-w-7xl mx-auto ${className ?? ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={childVariants}>
      {children}
    </motion.div>
  )
}
