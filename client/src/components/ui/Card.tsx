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
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  iconBg = 'bg-brand-50',
  className = '',
}: StatCardProps) {
  const deltaColor =
    deltaType === 'up' ? 'text-emerald-600' : deltaType === 'down' ? 'text-red-600' : 'text-muted'

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold leading-tight text-ink">{value}</p>
          {delta && (
            <p className={`text-xs mt-1 ${deltaColor}`}>{delta}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
