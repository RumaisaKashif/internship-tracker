import { motion } from 'framer-motion'

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled }: Props) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative w-10 h-6 rounded-full transition-colors duration-300 focus-ring outline-none"
        style={{
          background: checked ? 'var(--purple-dim)' : 'rgba(74,72,101,0.4)',
          boxShadow: checked ? 'var(--glow-sm)' : 'none',
        }}
      >
        <motion.span
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? 22 : 4 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </button>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  )
}
