import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
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
    'bg-brand text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-300 disabled:bg-brand-200',
  secondary:
    'bg-slate-100 text-ink hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-300 disabled:bg-slate-50',
  ghost:
    'bg-transparent text-ink hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-300 disabled:bg-red-200',
  outline:
    'border border-border bg-white text-ink hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300',
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
          'transition-colors duration-150',
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
