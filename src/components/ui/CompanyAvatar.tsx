import { getCompanyGradient, getInitials } from '@/lib/utils'

interface Props {
  company: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function CompanyAvatar({ company, size = 'md' }: Props) {
  return (
    <div
      className={`${sizeMap[size]} rounded-xl flex items-center justify-center font-display font-semibold text-white flex-shrink-0`}
      style={{ background: getCompanyGradient(company) }}
    >
      {getInitials(company)}
    </div>
  )
}
