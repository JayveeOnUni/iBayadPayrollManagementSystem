import { Plus, LogIn, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'

const announcements = [
  { title: 'Scrum Master', startDate: 'Dec 4, 2019 21:42', endDate: 'Dec 7, 2019 23:26', description: 'Corrected item alignment' },
  { title: 'Software Tester', startDate: 'Dec 30, 2019 05:18', endDate: 'Feb 2, 2019 19:28', description: 'Embedded analytic scripts' },
  { title: 'Software Developer', startDate: 'Dec 30, 2019 07:52', endDate: 'Dec 4, 2019 21:42', description: 'High resolution imagery option' },
  { title: 'UI/UX Designer', startDate: 'Dec 7, 2019 23:26', endDate: 'Feb 2, 2019 19:28', description: 'Enhanced UX for cart quantity updates' },
  { title: 'Ethical Hacker', startDate: 'Mar 20, 2019 23:14', endDate: 'Dec 4, 2019 21:42', description: 'Cart history fixes' },
]

const leaveStats = [
  { label: 'Total leave allowance', value: 15 },
  { label: 'Total leave taken', value: 5 },
  { label: 'Total leave available', value: 10 },
  { label: 'Leave request pending', value: 0 },
]

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.firstName ?? 'User'
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div className="bg-surface min-h-full">
      {/* Page header bar */}
      <div className="bg-surface px-8 py-4 flex items-center justify-between">
        <h1 className="text-[20px] font-medium text-ink tracking-[-0.017em]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="w-8 h-7 bg-primary flex items-center justify-center rounded-md hover:bg-primary-hover transition-colors">
            <Plus size={16} className="text-white" />
          </button>
          <button className="h-7 px-4 bg-white border border-border text-ink text-sm font-medium rounded-md hover:bg-surface transition-colors">
            Manager POV
          </button>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-4">
        {/* Greeting card */}
        <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-ink tracking-tight">Good to see you, {firstName} 👋</p>
            <p className="text-sm text-muted mt-0.5">
              {today}
            </p>
          </div>
          <div className="flex items-center gap-8">
            {/* Time In */}
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-success-surface rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogIn size={18} className="text-success" />
                </div>
              </div>
              <span className="text-sm font-medium text-muted">Time In</span>
            </div>
            {/* Time Out */}
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-danger-surface rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogOut size={18} className="text-danger" />
                </div>
              </div>
              <span className="text-sm font-medium text-muted">Time Out</span>
            </div>
          </div>
        </div>

        {/* Leave stats */}
        <div className="bg-white rounded-lg px-8 py-4 flex items-center gap-10">
          {leaveStats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-10 flex-1">
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-base font-medium text-neutral-90">{stat.label}</p>
                <p className="text-[28px] font-medium text-info leading-9 tracking-[-0.021em] opacity-80">{stat.value}</p>
              </div>
              {i < leaveStats.length - 1 && (
                <div className="w-px h-[89px] bg-border flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-lg px-8 py-4">
          <h2 className="text-base font-bold text-ink mb-4">Announcements</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="text-left p-3 text-xs font-normal text-ink">Title</th>
                <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">Start date</th>
                <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">End date</th>
                <th className="text-left p-3 text-xs font-normal text-ink border-l border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3 text-ink text-xs">{row.title}</td>
                  <td className="p-3 text-ink text-xs">{row.startDate}</td>
                  <td className="p-3 text-ink text-xs">{row.endDate}</td>
                  <td className="p-3 text-ink text-xs">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Celebration */}
        <div className="bg-white rounded-lg px-8 py-4">
          <h2 className="text-base font-bold text-ink mb-4">Celebration</h2>
          <div className="flex items-center gap-4">
            <div className="w-px h-16 bg-border flex-shrink-0" />
            <div>
              <p className="text-base font-medium text-neutral-90">This month</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 p-3">
            <div className="w-[95px] h-[81px] bg-surface rounded-[18px] flex items-center justify-center">
              <span className="text-xs font-medium text-neutral-90">—</span>
            </div>
            <p className="text-sm text-muted">No celebrations this month yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
