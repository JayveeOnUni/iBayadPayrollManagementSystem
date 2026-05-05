import { CalendarCheck, Clock3, LogIn, LogOut, Plus, Users } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Button from '../../components/ui/Button'
import Card, { CardHeader, StatCard } from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import { EmptyState, Page, PageHeader } from '../../components/ui/Page'

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
  const navigate = useNavigate()
  const firstName = user?.firstName ?? 'User'
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor attendance, leave activity, and company updates."
        actions={
          <>
          <Button
            size="sm"
            onClick={() => navigate('/admin/employees')}
            leftIcon={<Plus size={14} />}
          >
            Add Employee
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/attendance/summary')}
          >
            Attendance Summary
          </Button>
          </>
        }
      />

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-semibold text-ink">Good to see you, {firstName}</p>
            <p className="mt-1 text-sm text-muted">{today}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate('/admin/attendance/daily')}
              className="flex min-w-[180px] items-center gap-3 rounded-lg border border-border bg-success-surface/50 px-3 py-2 text-left transition-colors hover:border-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success-surface">
                <LogIn size={18} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Time In</p>
                <p className="text-xs text-muted">Review daily logs</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/attendance/daily')}
              className="flex min-w-[180px] items-center gap-3 rounded-lg border border-border bg-danger-surface/50 px-3 py-2 text-left transition-colors hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-danger-surface">
                <LogOut size={18} className="text-danger" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Time Out</p>
                <p className="text-xs text-muted">Check incomplete punches</p>
              </div>
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {leaveStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={<CalendarCheck size={20} className="text-info" />}
            iconBg="bg-sky-50"
          />
        ))}
      </div>

      <Card padding="none">
        <div className="px-5 py-4">
          <CardHeader
            title="Announcements"
            subtitle="Current notices shared with employees."
            className="mb-0"
          />
        </div>
        <Table
          data={announcements}
          rowKey={(row) => `${row.title}-${row.startDate}`}
          emptyMessage="No announcements have been published."
          columns={[
            { key: 'title', header: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'startDate', header: 'Start date' },
            { key: 'endDate', header: 'End date' },
            { key: 'description', header: 'Description' },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Active employees"
          value="Review"
          delta="Open employee directory"
          icon={<Users size={20} className="text-brand" />}
          iconBg="bg-brand-50"
          className="lg:col-span-1"
        />
        <Card className="lg:col-span-2">
          <CardHeader title="Celebration" subtitle="This month" />
          <EmptyState
            title="No celebrations this month yet."
            description="Birthdays and work anniversaries will appear here once available."
            icon={<Clock3 size={22} />}
          />
        </Card>
      </div>
    </Page>
  )
}
