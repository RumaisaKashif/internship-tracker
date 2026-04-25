import { useEffect, useRef } from 'react'
import { useSpring, useTransform, motion, useMotionValue } from 'framer-motion'

interface Props {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ value, duration = 1.2, className, prefix = '', suffix = '' }: Props) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      motionValue.set(value)
    } else {
      motionValue.set(value)
    }
  }, [value, motionValue])

  return (
    <span className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}
