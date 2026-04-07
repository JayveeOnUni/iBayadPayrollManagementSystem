import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Clock,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Building2,
  Clock3,
  AlignLeft,
  ClipboardList,
  FileText,
  CalendarDays,
  BookOpen,
  LogOut,
  Briefcase,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  label: string
  to?: string
  icon: React.ReactNode
  children?: { label: string; to: string; icon?: React.ReactNode }[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Job Desk',
    icon: <Briefcase size={18} />,
    children: [
      { label: 'Employees', to: '/admin/employees', icon: <Users size={15} /> },
      { label: 'Payroll', to: '/admin/payroll', icon: <CreditCard size={15} /> },
    ],
  },
  {
    label: 'Employee',
    icon: <Users size={18} />,
    children: [
      { label: 'All Employees', to: '/admin/employees', icon: <Users size={15} /> },
    ],
  },
  {
    label: 'Leave',
    icon: <AlignLeft size={18} />,
    children: [
      { label: 'Status', to: '/admin/leave/status', icon: <ClipboardList size={15} /> },
      { label: 'Requests', to: '/admin/leave/requests', icon: <FileText size={15} /> },
      { label: 'Calendar', to: '/admin/leave/calendar', icon: <CalendarDays size={15} /> },
    ],
  },
  {
    label: 'Attendance',
    icon: <Clock size={18} />,
    children: [
      { label: 'Daily Log', to: '/admin/attendance/daily', icon: <BookOpen size={15} /> },
      { label: 'Requests', to: '/admin/attendance/requests', icon: <FileText size={15} /> },
      { label: 'Summary', to: '/admin/attendance/summary', icon: <ClipboardList size={15} /> },
    ],
  },
  {
    label: 'Administration',
    icon: <FolderOpen size={18} />,
    children: [
      { label: 'Roles', to: '/admin/administration/roles', icon: <Users size={15} /> },
      { label: 'Departments', to: '/admin/administration/departments', icon: <Building2 size={15} /> },
      { label: 'Shifts', to: '/admin/administration/shifts', icon: <Clock3 size={15} /> },
      { label: 'Holidays', to: '/admin/administration/holidays', icon: <Calendar size={15} /> },
      { label: 'Announcements', to: '/admin/administration/announcements', icon: <Megaphone size={15} /> },
    ],
  },
  {
    label: 'Setting',
    icon: <Settings size={18} />,
    children: [
      { label: 'General', to: '/admin/settings/general' },
      { label: 'Payroll', to: '/admin/settings/payroll' },
      { label: 'Leave', to: '/admin/settings/leave' },
      { label: 'Attendance', to: '/admin/settings/attendance' },
    ],
  },
]

function NavGroup({ item }: { item: NavItem }) {
  const location = useLocation()
  const isActive = item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-100 hover:bg-neutral-40/30 transition-colors"
      >
        <span className="flex items-center gap-3">
          {item.icon}
          <span>{item.label}</span>
        </span>
        <span className="text-muted">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open && (
        <div className="bg-neutral-20">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-white text-ink font-medium shadow-[inset_0_-1px_0_0_#E0E0E0]'
                    : 'text-neutral-90 hover:bg-neutral-40/40',
                ].join(' ')
              }
            >
              {child.icon}
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="w-[250px] min-h-screen bg-sidebar flex flex-col flex-shrink-0 shadow-sidebar-right">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {/* Dashboard — plain link */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white text-ink shadow-[inset_0_-1px_0_0_#E0E0E0]'
                : 'text-neutral-100 hover:bg-neutral-40/30',
            ].join(' ')
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {/* Grouped items */}
        {navItems.slice(1).map((item) => (
          <NavGroup key={item.label} item={item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{fullName}</p>
          <p className="text-xs text-muted capitalize truncate">
            {user?.role?.replace(/_/g, ' ')}
          </p>
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
  )
}
