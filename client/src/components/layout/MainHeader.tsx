import { Bell, Globe, ChevronDown, Menu } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import logoUrl from '../../Logo.png'

interface MainHeaderProps {
  onMenuClick?: () => void
}

export default function MainHeader({ onMenuClick }: MainHeaderProps) {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      {/* Logo */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-9 w-10 shrink-0 items-center justify-start overflow-hidden rounded-md bg-ink">
          <img src={logoUrl} alt="iBayad logo" className="h-8 w-auto max-w-none object-contain object-left" />
        </div>
        <div className="min-w-0 leading-tight">
          <span className="block truncate text-base font-semibold text-primary">iBayad</span>
          <span className="hidden truncate text-xs font-medium text-muted sm:block">Payroll Management System</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language */}
        <button type="button" className="hidden min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-ink transition-colors hover:bg-slate-100 sm:flex" title="English language selected">
          <Globe size={16} className="text-ink" />
          <span>EN</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="rounded-md p-2 text-ink transition-colors hover:bg-slate-100 hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          onClick={() => navigate(user?.role === 'employee' ? '/employee/dashboard' : '/admin/administration/announcements')}
          aria-label="Open announcements"
        >
          <Bell size={16} />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex min-h-9 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            aria-expanded={dropdownOpen}
            aria-label="Open user menu"
          >
            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-semibold">
              {initials}
            </div>
            <ChevronDown size={12} className="text-muted" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-border z-20 py-1 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-sm font-medium text-ink truncate">{fullName}</p>
                  <p className="text-xs text-muted capitalize">{user?.role?.replace(/_/g, ' ')}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate(user?.role === 'employee' ? '/employee/profile' : '/admin/settings/general')
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors"
                >
                  {user?.role === 'employee' ? 'Profile' : 'Settings'}
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger-surface transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
