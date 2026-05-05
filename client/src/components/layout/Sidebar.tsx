import { NavLink, useLocation } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

export interface NavItem {
  label: string
  to?: string
  icon: ReactNode
  children?: { label: string; to: string; icon?: ReactNode }[]
}

interface SidebarProps {
  items: NavItem[]
  onNavigate?: () => void
  roleLabel?: string
}

function NavGroup({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const location = useLocation()
  const isActive = item.children?.some((child) => location.pathname.startsWith(child.to)) ?? false
  const [open, setOpen] = useState(isActive)

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        onClick={onNavigate}
        className={({ isActive: linkActive }) =>
          [
            'flex min-h-11 items-center gap-3 px-4 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-inset',
            linkActive
              ? 'bg-white text-ink shadow-[inset_3px_0_0_0_#212143]'
              : 'text-neutral-90 hover:bg-neutral-40/30 hover:text-ink',
          ].join(' ')
        }
      >
        <span className="text-muted">{item.icon}</span>
        <span className="truncate">{item.label}</span>
      </NavLink>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          'flex min-h-11 w-full items-center justify-between px-4 text-left text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-inset',
          isActive ? 'text-ink' : 'text-neutral-90 hover:bg-neutral-40/30 hover:text-ink',
        ].join(' ')}
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-muted">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </span>
        <span className="text-muted">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open && (
        <div className="bg-neutral-20/80 py-1">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive: childActive }) =>
                [
                  'flex min-h-10 items-center gap-3 pl-10 pr-4 text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-inset',
                  childActive
                    ? 'bg-white text-ink font-medium shadow-[inset_3px_0_0_0_#212143]'
                    : 'text-neutral-80 hover:bg-neutral-40/40 hover:text-ink',
                ].join(' ')
              }
            >
              {child.icon && <span className="text-muted">{child.icon}</span>}
              <span className="truncate">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ items, onNavigate, roleLabel }: SidebarProps) {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const initials = fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="flex h-full w-[250px] flex-col border-r border-border bg-sidebar">
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin" aria-label="Primary navigation">
        {items.map((item) => (
          <NavGroup key={item.to ?? item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{fullName}</p>
            <p className="truncate text-xs capitalize text-muted">
              {roleLabel ?? user?.role?.replace(/_/g, ' ')}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md p-2 text-muted transition-colors hover:bg-neutral-20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
