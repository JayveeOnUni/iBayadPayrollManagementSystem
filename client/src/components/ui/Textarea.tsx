import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const helpId = textareaId ? `${textareaId}-help` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-ink">
            {label}
            {props.required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? helpId : undefined}
          className={[
            'field-base min-h-24 resize-y leading-6',
            error ? 'border-danger focus:border-danger focus:ring-danger-border' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p id={helpId} className="text-xs text-danger">{error}</p>}
        {hint && !error && <p id={helpId} className="text-xs text-muted">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
