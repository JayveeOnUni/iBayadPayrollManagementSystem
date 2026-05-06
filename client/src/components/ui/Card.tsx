interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-lg border border-border shadow-card',
        paddingClasses[padding],
        hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  iconBg?: string
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  className?: string
}

const statToneClasses: Record<NonNullable<StatCardProps['tone']>, { rail: string; icon: string; value: string }> = {
  brand: { rail: 'bg-brand', icon: 'bg-brand-50 text-brand', value: 'text-ink' },
  success: { rail: 'bg-success', icon: 'bg-success-muted text-success', value: 'text-ink' },
  warning: { rail: 'bg-secondary', icon: 'bg-warning-muted text-warning', value: 'text-ink' },
  danger: { rail: 'bg-danger', icon: 'bg-danger-muted text-danger', value: 'text-ink' },
  neutral: { rail: 'bg-neutral-50', icon: 'bg-neutral-30 text-neutral-80', value: 'text-ink' },
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  iconBg,
  tone = 'brand',
  className = '',
}: StatCardProps) {
  const deltaColor =
    deltaType === 'up' ? 'text-success' : deltaType === 'down' ? 'text-danger' : 'text-muted'
  const toneClasses = statToneClasses[tone]

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-y-0 left-0 w-1 ${toneClasses.rail}`} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className={`mt-1 break-words text-2xl font-semibold leading-tight ${toneClasses.value}`}>{value}</p>
          {delta && (
            <p className={`text-xs mt-1 ${deltaColor}`}>{delta}</p>
          )}
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-md flex items-center justify-center ${iconBg ?? toneClasses.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
