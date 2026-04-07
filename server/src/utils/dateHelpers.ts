import { format, parseISO, startOfMonth, endOfMonth, addDays, isWeekend, differenceInCalendarDays } from 'date-fns'

export function formatDate(date: Date | string, pattern = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern)
}

/**
 * Get the semi-monthly pay period dates.
 * Period 1: 1st–15th, cutoff on 15th, pay on 20th
 * Period 2: 16th–end of month, cutoff on last day, pay on 5th next month
 */
export function getSemiMonthlyPeriods(year: number, month: number): Array<{
  period: number
  startDate: Date
  endDate: Date
  payDate: Date
}> {
  const start1 = new Date(year, month - 1, 1)
  const end1 = new Date(year, month - 1, 15)
  const payDate1 = new Date(year, month - 1, 20)

  const start2 = new Date(year, month - 1, 16)
  const end2 = endOfMonth(new Date(year, month - 1))
  const payDate2 = new Date(year, month, 5) // 5th of next month

  return [
    { period: 1, startDate: start1, endDate: end1, payDate: payDate1 },
    { period: 2, startDate: start2, endDate: end2, payDate: payDate2 },
  ]
}

/**
 * Count working days between two dates (excluding weekends).
 * Does not account for holidays — handle separately.
 */
export function countWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0
  let current = startDate
  while (current <= endDate) {
    if (!isWeekend(current)) count++
    current = addDays(current, 1)
  }
  return count
}

/**
 * Compute daily rate from monthly basic pay.
 * DOLE standard: monthly rate / 22 working days
 */
export function getDailyRate(monthlyRate: number, workDaysPerMonth = 22): number {
  return Math.round((monthlyRate / workDaysPerMonth) * 100) / 100
}

/**
 * Compute hourly rate from daily rate.
 */
export function getHourlyRate(dailyRate: number, workHoursPerDay = 8): number {
  return Math.round((dailyRate / workHoursPerDay) * 100) / 100
}

export { format, parseISO, startOfMonth, endOfMonth, differenceInCalendarDays }
