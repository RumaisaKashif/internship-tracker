import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, children, className, disabled, ...props },
  ref
) {
  const base = cn(
    'relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-ring cursor-pointer',
    size === 'sm' && 'px-3 py-1.5 text-xs rounded-lg',
    size === 'md' && 'px-4 py-2 text-sm rounded-xl',
    size === 'lg' && 'px-6 py-3 text-base rounded-xl',
    variant === 'primary' && 'btn-primary',
    variant === 'ghost' && 'btn-ghost',
    variant === 'danger' && 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 hover:border-red-500/35',
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <motion.button
      ref={ref}
      className={base}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  )
})
