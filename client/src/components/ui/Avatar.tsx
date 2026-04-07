type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function getColorFromName(name?: string): string {
  if (!name) return 'bg-slate-400'
  const colors = [
    'bg-blue-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-orange-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = getColorFromName(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={[
          'rounded-full object-cover flex-shrink-0',
          sizeClasses[size],
          className,
        ].join(' ')}
      />
    )
  }

  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0',
        colorClass,
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={name}
    >
      {initials}
    </span>
  )
}
