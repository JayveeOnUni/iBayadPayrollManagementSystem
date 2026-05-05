import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 text-muted pointer-events-none">{leftAddon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-md border bg-white text-ink text-sm',
              'px-3 py-2 min-h-10',
              'placeholder:text-slate-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand',
              'disabled:bg-slate-50 disabled:text-muted disabled:cursor-not-allowed',
              error ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : 'border-border',
              leftAddon ? 'pl-9' : '',
              rightAddon ? 'pr-9' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 text-muted">{rightAddon}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
