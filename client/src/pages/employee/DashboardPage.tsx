import { LogIn, LogOut, Plus } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const announcements = [
  { title: 'Scrum Master', startDate: 'Dec 4, 2019 21:42', endDate: 'Dec 7, 2019 23:26', description: 'Corrected item alignment' },
  { title: 'Software Tester', startDate: 'Dec 30, 2019 05:18', endDate: 'Feb 2, 2019 19:28', description: 'Embedded analytic scripts' },
  { title: 'Software Developer', startDate: 'Dec 30, 2019 07:52', endDate: 'Dec 4, 2019 21:42', description: 'High resolution imagery option' },
  { title: 'UI/UX Designer', startDate: 'Dec 7, 2019 23:26', endDate: 'Feb 2, 2019 19:28', description: 'Enhanced UX for cart quantity updates' },
  { title: 'Ethical Hacker', startDate: 'Mar 20, 2019 23:14', endDate: 'Dec 4, 2019 21:42', description: 'Cart history fixes' },
]

const leaveStats = [
  {
    label: 'Total leave allowance',
    value: 34,
    paid: 11,
    unpaid: 4,
  },
  {
    label: 'Total leave taken',
    value: 20,
    paid: 62,
    unpaid: 76,
  },
  {
    label: 'Total leave available',
    value: 87,
    paid: 50,
    unpaid: 51,
  },
  {
    label: 'Leave request pending',
    value: 122,
    paid: 60,
    unpaid: 53,
  },
]

interface ProgressBarProps {
  percent: number
}

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="h-2 bg-neutral-20 rounded-md overflow-hidden w-full">
      <div
        className="h-full bg-info rounded-md"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  )
}

export default function EmployeeDashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.firstName ?? 'User'

  return (
    <div className="bg-surface min-h-full">
      {/* Page header */}
      <div className="bg-surface px-8 py-4 flex items-center justify-between">
        <h1 className="text-[20px] font-medium text-ink tracking-[-0.017em]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-7 px-4 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors">
            <Plus size={14} />
            Buddy Punching
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
            <p className="text-sm text-muted mt-0.5">You came 15 minutes early today.</p>
          </div>
          <div className="flex items-center gap-8">
            {/* Punch In */}
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-success-surface rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogIn size={18} className="text-success" />
                </div>
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium text-neutral-90 leading-[18px]">7:14 AM</span>
                <span className="text-xs text-muted leading-[18px]">Punch in</span>
              </div>
            </div>
            {/* Punch Out */}
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-danger-surface rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LogOut size={18} className="text-danger" />
                </div>
              </div>
              <div className="flex flex-col gap-px">
                <span className="text-xs font-medium text-neutral-90 leading-[18px]">05:00 PM</span>
                <span className="text-xs text-muted leading-[18px]">Punch Out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave stats */}
        <div className="bg-white rounded-lg px-8 py-4 flex items-start gap-10">
          {leaveStats.map((stat, i) => (
            <div key={stat.label} className="flex items-start gap-10 flex-1">
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-base font-medium text-neutral-90">{stat.label}</p>
                <p className="text-[28px] font-medium text-info leading-9 tracking-[-0.021em]">{stat.value}</p>
                <div className="flex gap-6 text-xs">
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-60">Paid</span>
                    <span className="text-[#1158b7] font-medium">{stat.paid}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-60">Unpaid</span>
                    <span className="text-danger font-medium">{stat.unpaid}</span>
                  </div>
                </div>
              </div>
              {i < leaveStats.length - 1 && (
                <div className="w-px h-[89px] bg-border flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Time Log */}
        <div className="bg-white rounded-lg px-8 py-4">
          <h2 className="text-base font-bold text-ink mb-4">Time Log</h2>

          <div className="flex gap-4 items-start">
            {/* Today */}
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-base font-medium text-neutral-90">Today</p>
              <div className="flex gap-3">
                <div className="flex-1 bg-surface rounded-lg px-4 py-2 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">08:00</p>
                  <p className="text-xs text-neutral-60">Scheduled</p>
                </div>
                <div className="flex-1 bg-surface rounded-lg px-4 py-2 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">12:00</p>
                  <p className="text-xs text-neutral-60">Balance</p>
                </div>
                <div className="flex-1 bg-surface rounded-lg px-4 py-2 flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-90">05:00</p>
                  <p className="text-xs text-neutral-60">Worked</p>
                </div>
              </div>
            </div>

            <div className="w-px self-stretch bg-border flex-shrink-0" />

            {/* This month */}
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-base font-medium text-neutral-90">This month</p>
              <div className="flex gap-8">
                {/* Left column */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-neutral-60">Total</span>
                      <span className="text-neutral-90">216 hour</span>
                    </div>
                    <ProgressBar percent={87} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-neutral-60">Shortage time</span>
                      <span className="text-neutral-90">23 hour</span>
                    </div>
                    <ProgressBar percent={40} />
                  </div>
                </div>
                {/* Right column */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-neutral-60">Worked time</span>
                      <span className="text-neutral-90">189 hour</span>
                    </div>
                    <ProgressBar percent={75} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-neutral-60">Over time</span>
                      <span className="text-neutral-90">56 hour</span>
                    </div>
                    <ProgressBar percent={55} />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  )
}
