type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand-50 text-brand-600 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger:  'bg-red-50 text-red-700 ring-red-200',
  info:    'bg-sky-50 text-sky-700 ring-sky-200',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-sky-500',
  neutral: 'bg-slate-400',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
}

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full ring-1',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  )
}

// Convenience helpers
export function statusBadge(status: string): React.ReactElement {
  const map: Record<string, BadgeVariant> = {
    active: 'success',
    approved: 'success',
    paid: 'success',
    present: 'success',
    inactive: 'neutral',
    pending: 'warning',
    processing: 'info',
    draft: 'neutral',
    rejected: 'danger',
    cancelled: 'danger',
    terminated: 'danger',
    absent: 'danger',
    late: 'warning',
    on_leave: 'info',
    holiday: 'info',
    resigned: 'neutral',
  }
  const variant = map[status] ?? 'neutral'
  return <Badge variant={variant} dot>{status.replace(/_/g, ' ')}</Badge>
}
