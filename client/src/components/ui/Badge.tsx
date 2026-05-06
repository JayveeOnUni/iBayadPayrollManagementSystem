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
  default: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-success-muted text-success ring-success-border',
  warning: 'bg-warning-muted text-warning ring-warning-border',
  danger:  'bg-danger-muted text-danger ring-danger-border',
  info:    'bg-info-muted text-brand-700 ring-info-border',
  neutral: 'bg-neutral-30 text-neutral-80 ring-neutral-40',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-secondary',
  danger:  'bg-danger',
  info:    'bg-info',
  neutral: 'bg-neutral-60',
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
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium capitalize ring-1',
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
    released: 'success',
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
