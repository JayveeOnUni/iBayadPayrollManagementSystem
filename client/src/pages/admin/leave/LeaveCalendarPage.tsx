import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../../components/ui/Card'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameDay, isWithinInterval, addMonths, subMonths, parseISO
} from '../../../utils/dateHelpers'
import { leaveService } from '../../../services/leaveService'
import type { LeaveApplication } from '../../../types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function LeaveCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<LeaveApplication[]>([])
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setMessage(null)
        const res = await leaveService.getCalendar(currentMonth.getMonth() + 1, currentMonth.getFullYear())
        setEvents(res.data)
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Unable to load leave calendar.')
      }
    }

    loadEvents()
  }, [currentMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = calStart
  while (day <= calEnd) {
    days.push(new Date(day))
    day = addDays(day, 1)
  }

  const eventColors: Record<string, string> = {
    vacation: 'bg-brand-100 text-brand-700',
    sick: 'bg-red-100 text-red-700',
    emergency: 'bg-amber-100 text-amber-700',
    maternity: 'bg-sky-100 text-sky-700',
    paternity: 'bg-sky-100 text-sky-700',
  }

  const getEventsForDay = useMemo(() => (date: Date) =>
    events.filter((e) =>
      isWithinInterval(date, { start: parseISO(e.startDate), end: parseISO(e.endDate) })
    ), [events])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">Leave Calendar</h2>
        <p className="text-sm text-muted mt-0.5">Visual overview of all approved and pending leave schedules</p>
      </div>

      {message && (
        <div className="text-sm text-ink bg-slate-50 border border-border rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Vacation', color: 'bg-brand-100 text-brand-700' },
          { label: 'Sick', color: 'bg-red-100 text-red-700' },
          { label: 'Emergency', color: 'bg-amber-100 text-amber-700' },
          { label: 'Maternity/Paternity', color: 'bg-purple-100 text-purple-700' },
        ].map((l) => (
          <span key={l.label} className={`text-xs px-2.5 py-1 rounded-full font-medium ${l.color}`}>
            {l.label}
          </span>
        ))}
      </div>

      <Card>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-base font-semibold text-ink">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-slate-100 text-muted hover:text-ink"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 border-t border-l border-border">
          {days.map((date, i) => {
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
            const isToday = isSameDay(date, new Date())
            const events = getEventsForDay(date)

            return (
              <div
                key={i}
                className={[
                  'min-h-[80px] border-r border-b border-border p-1.5',
                  isCurrentMonth ? 'bg-white' : 'bg-slate-50',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-6 h-6 flex items-center justify-center rounded-full text-xs mb-1 font-medium',
                    isToday ? 'bg-brand text-white' : isCurrentMonth ? 'text-ink' : 'text-slate-300',
                  ].join(' ')}
                >
                  {format(date, 'd')}
                </div>
                <div className="space-y-0.5">
                  {events.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${eventColors[e.leaveType] ?? 'bg-slate-100 text-slate-700'}`}
                      title={`${e.employee ? `${e.employee.firstName} ${e.employee.lastName}` : 'Employee'} - ${e.leaveType} (${e.status})`}
                    >
                      {e.employee?.firstName ?? 'Leave'}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-muted px-1">+{events.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
