import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Clock, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAuth } from '../hooks/useAuth'
import MainHeader from '../components/layout/MainHeader'

const employeeNav = [
  { label: 'Dashboard', to: '/employee/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Payslip', to: '/employee/payslip', icon: <FileText size={18} /> },
  { label: 'Attendance', to: '/employee/attendance', icon: <Clock size={18} /> },
  { label: 'Profile', to: '/employee/profile', icon: <User size={18} /> },
]

export default function EmployeeLayout() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      <MainHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[250px] min-h-full bg-sidebar flex flex-col flex-shrink-0 shadow-sidebar-right">
          <nav className="flex-1 overflow-y-auto">
            {employeeNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white text-ink shadow-[inset_0_-1px_0_0_#E0E0E0]'
                      : 'text-neutral-100 hover:bg-neutral-40/30',
                  ].join(' ')
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User footer */}
          <div className="border-t border-border px-4 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{fullName}</p>
              <p className="text-xs text-muted">Employee</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-muted hover:text-ink rounded transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
