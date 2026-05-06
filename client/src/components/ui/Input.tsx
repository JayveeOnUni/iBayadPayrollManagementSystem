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
    const helpId = inputId ? `${inputId}-help` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">{leftAddon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error || hint ? helpId : undefined}
            className={[
              'field-base',
              error ? 'border-danger focus:ring-danger-border focus:border-danger' : '',
              leftAddon ? 'pl-9' : '',
              rightAddon ? 'pr-9' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{rightAddon}</div>
          )}
        </div>
        {error && <p id={helpId} className="text-xs text-danger">{error}</p>}
        {hint && !error && <p id={helpId} className="text-xs text-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
