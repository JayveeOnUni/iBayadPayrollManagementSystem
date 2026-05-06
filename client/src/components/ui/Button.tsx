import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'ghost' | 'danger' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 focus-visible:ring-brand-300 disabled:bg-brand-200',
  secondary:
    'bg-neutral-30 text-ink hover:bg-neutral-40 active:bg-neutral-50 focus-visible:ring-neutral-50 disabled:bg-neutral-20',
  accent:
    'bg-secondary text-neutral-100 shadow-sm hover:bg-secondary-hover active:bg-secondary-700 focus-visible:ring-secondary-300 disabled:bg-secondary-100',
  success:
    'bg-success text-white shadow-sm hover:bg-success-hover active:bg-success-hover focus-visible:ring-success-border disabled:bg-success-surface',
  ghost:
    'bg-transparent text-neutral-80 hover:bg-neutral-30 hover:text-ink active:bg-neutral-40 focus-visible:ring-neutral-50',
  danger:
    'bg-danger text-white shadow-sm hover:bg-danger-hover active:bg-danger-hover focus-visible:ring-danger-border disabled:bg-danger-surface',
  outline:
    'border border-border bg-white text-ink shadow-sm hover:bg-neutral-20 active:bg-neutral-30 focus-visible:ring-brand-200',
}

const sizeClasses: Record<Size, string> = {
  xs: 'min-h-8 px-2.5 text-xs gap-1.5',
  sm: 'min-h-9 px-3 text-sm gap-1.5',
  md: 'min-h-10 px-4 text-sm gap-2',
  lg: 'min-h-11 px-5 text-base gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        disabled={disabled || isLoading}
        className={[
          'inline-flex items-center justify-center rounded-md font-medium leading-none',
          'transition-colors duration-150 whitespace-nowrap',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'lg' ? 18 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
