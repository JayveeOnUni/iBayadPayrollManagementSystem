import type { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
  className?: string
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full'
}

const maxWidthClasses: Record<NonNullable<PageProps['maxWidth']>, string> = {
  default: 'max-w-7xl',
  narrow: 'max-w-3xl',
  wide: 'max-w-screen-2xl',
  full: 'max-w-none',
}

export function Page({ children, className = '', maxWidth = 'default' }: PageProps) {
  return (
    <div className={`mx-auto w-full space-y-5 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-4 py-10 text-center ${className}`}
    >
      {icon && <div className="mb-3 text-muted">{icon}</div>}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface FeedbackMessageProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  className?: string
}

const feedbackClasses: Record<NonNullable<FeedbackMessageProps['variant']>, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
}

export function FeedbackMessage({ children, variant = 'info', className = '' }: FeedbackMessageProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm leading-6 ${feedbackClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}
