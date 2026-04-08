import { Bell, Globe, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

export default function MainHeader() {
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
    <header className="h-[50px] bg-white border-b border-border flex items-center px-12 gap-4 sticky top-0 z-30 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-1">
        <div className="w-[30px] h-[21px] flex items-center justify-center">
          <span className="text-primary font-bold text-lg leading-none">ib</span>
        </div>
        <span className="font-bold text-primary text-base font-montserrat tracking-tight">IBayad</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Language */}
        <button className="flex items-center gap-1.5 text-sm font-medium text-ink" title="English language selected">
          <Globe size={16} className="text-ink" />
          <span>EN</span>
        </button>

        {/* Notifications */}
        <button
          className="text-ink hover:text-muted transition-colors"
          onClick={() => navigate(user?.role === 'employee' ? '/employee/dashboard' : '/admin/administration/announcements')}
          title="Open announcements"
        >
          <Bell size={16} />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5"
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
