import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, FileText, Clock, User, CalendarDays, X } from 'lucide-react'
import MainHeader from '../components/layout/MainHeader'
import Sidebar from '../components/layout/Sidebar'
import type { NavItem } from '../components/layout/Sidebar'

const employeeNav: NavItem[] = [
  { label: 'Dashboard', to: '/employee/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Payslip', to: '/employee/payslip', icon: <FileText size={18} /> },
  { label: 'Attendance', to: '/employee/attendance', icon: <Clock size={18} /> },
  { label: 'Leave', to: '/employee/leave', icon: <CalendarDays size={18} /> },
  { label: 'Profile', to: '/employee/profile', icon: <User size={18} /> },
]

export default function EmployeeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      <MainHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar items={employeeNav} roleLabel="Employee" />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            />
            <div className="absolute inset-y-0 left-0 bg-white shadow-2xl">
              <div className="flex h-14 items-center justify-end border-b border-border px-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <Sidebar items={employeeNav} onNavigate={() => setSidebarOpen(false)} roleLabel="Employee" />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
