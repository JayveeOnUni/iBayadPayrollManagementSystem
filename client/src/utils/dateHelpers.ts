import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  differenceInDays,
  differenceInCalendarDays,
  isWeekend,
  isSameDay,
  isAfter,
  isBefore,
  isWithinInterval,
  getDay,
  addMonths,
  subMonths,
  getDate,
  setDate,
  isValid,
} from 'date-fns'

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatDate(date: string | Date, pattern = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, pattern) : '—'
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

export function formatTime(date: string | Date): string {
  return formatDate(date, 'hh:mm a')
}

export function formatMonthYear(date: string | Date): string {
  return formatDate(date, 'MMMM yyyy')
}

export function formatShort(date: string | Date): string {
  return formatDate(date, 'MM/dd/yyyy')
}

// ─── Pay Period helpers ───────────────────────────────────────────────────────

export interface SemiMonthlyPeriod {
  label: string
  startDate: Date
  endDate: Date
  payDate: Date
}

/**
 * Get the two semi-monthly periods for a given month and year.
 * Cutoffs: 1st–15th (pay on 20th), 16th–end of month (pay on 5th of next month).
 */
export function getSemiMonthlyPeriods(year: number, month: number): SemiMonthlyPeriod[] {
  // month is 1-indexed
  const firstPeriodStart = new Date(year, month - 1, 1)
  const firstPeriodEnd = new Date(year, month - 1, 15)
  const firstPayDate = new Date(year, month - 1, 20)

  const secondPeriodStart = new Date(year, month - 1, 16)
  const secondPeriodEnd = endOfMonth(new Date(year, month - 1, 1))
  const secondPayDate = new Date(year, month, 5) // 5th of next month

  const monthLabel = format(new Date(year, month - 1, 1), 'MMMM yyyy')

  return [
    {
      label: `${monthLabel} 1st Period (1–15)`,
      startDate: firstPeriodStart,
      endDate: firstPeriodEnd,
      payDate: firstPayDate,
    },
    {
      label: `${monthLabel} 2nd Period (16–EOM)`,
      startDate: secondPeriodStart,
      endDate: secondPeriodEnd,
      payDate: secondPayDate,
    },
  ]
}

// ─── Working days ─────────────────────────────────────────────────────────────

/**
 * Count working days (Mon–Fri) between two dates, excluding provided holidays.
 */
export function countWorkingDays(
  start: Date,
  end: Date,
  holidays: Date[] = []
): number {
  let count = 0
  let current = new Date(start)

  while (!isAfter(current, end)) {
    const dayOfWeek = getDay(current)
    const isHoliday = holidays.some((h) => isSameDay(h, current))

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
      count++
    }

    current = addDays(current, 1)
  }

  return count
}

/**
 * Get all working days between two dates.
 */
export function getWorkingDays(start: Date, end: Date, holidays: Date[] = []): Date[] {
  const days: Date[] = []
  let current = new Date(start)

  while (!isAfter(current, end)) {
    const dayOfWeek = getDay(current)
    const isHoliday = holidays.some((h) => isSameDay(h, current))

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
      days.push(new Date(current))
    }

    current = addDays(current, 1)
  }

  return days
}

// ─── Leave helpers ────────────────────────────────────────────────────────────

/**
 * Count business days (Mon–Fri) for a leave application, excluding holidays.
 */
export function countLeaveDays(
  startDate: string | Date,
  endDate: string | Date,
  holidays: Date[] = []
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return countWorkingDays(start, end, holidays)
}

// ─── Relative time ────────────────────────────────────────────────────────────

export function daysUntil(date: string | Date): number {
  const target = typeof date === 'string' ? parseISO(date) : date
  return differenceInCalendarDays(target, new Date())
}

export function daysAgo(date: string | Date): number {
  const target = typeof date === 'string' ? parseISO(date) : date
  return differenceInCalendarDays(new Date(), target)
}

export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isSameDay(d, new Date())
}

// ─── Age / tenure ─────────────────────────────────────────────────────────────

export function yearsOfService(hireDate: string | Date): number {
  const hire = typeof hireDate === 'string' ? parseISO(hireDate) : hireDate
  return Math.floor(differenceInDays(new Date(), hire) / 365.25)
}

export function age(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  return Math.floor(differenceInDays(new Date(), birth) / 365.25)
}

// ─── Re-exports from date-fns ─────────────────────────────────────────────────
export {
  parseISO,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isWeekend,
  isSameDay,
  isAfter,
  isBefore,
  isWithinInterval,
  getDate,
  setDate,
  getDay,
  isValid,
}
