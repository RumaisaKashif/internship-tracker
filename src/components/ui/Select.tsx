import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  label?: string
}

export function Select({ value, onChange, options, placeholder, className, label }: Props) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'input-field appearance-none cursor-pointer',
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-bg-card">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
