import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = '', id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const helpId = selectId ? `${selectId}-help` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error || hint ? helpId : undefined}
            className={[
              'field-base appearance-none pr-9',
              error ? 'border-danger focus:border-danger focus:ring-danger-border' : '',
              className,
            ].join(' ')}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>
        {error && <p id={helpId} className="text-xs text-danger">{error}</p>}
        {hint && !error && <p id={helpId} className="text-xs text-muted">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
