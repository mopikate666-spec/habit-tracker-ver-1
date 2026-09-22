/**
 * Date utilities — built on date-fns but with our own helpers.
 * All "dates" stored in localStorage are YYYY-MM-DD strings in the user's local time.
 */

import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'

export const todayISO = (d: Date = new Date()): string =>
  format(startOfDay(d), 'yyyy-MM-dd')

export const fromISO = (iso: string): Date => parseISO(iso)

export const fmtWeekday = (d: Date): string => format(d, 'EEEE')
export const fmtWeekdayShort = (d: Date): string => format(d, 'EEE')
export const fmtMonthDay = (d: Date): string =>
  format(d, 'LLLL d').toUpperCase() // "OCTOBER 12"
export const fmtMonthDayShort = (d: Date): string => format(d, 'MMM d')
export const fmtMonth = (d: Date): string => format(d, 'LLLL')
export const fmtYear = (d: Date): string => format(d, 'yyyy')

/**
 * Returns the number of consecutive days ending at `endDate` (inclusive)
 * for which `isoSet` contains the date string.
 */
export function currentStreak(
  isoSet: Set<string>,
  endDate: Date = new Date(),
): number {
  let count = 0
  let cursor = startOfDay(endDate)
  while (isoSet.has(todayISO(cursor))) {
    count++
    cursor = subDays(cursor, 1)
  }
  return count
}

/**
 * Returns the longest run of consecutive completed days anywhere in the list.
 */
export function longestStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...dates]
    .map((d) => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime())

  let best = 1
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(sorted[i], sorted[i - 1])
    if (diff === 1) {
      run++
      best = Math.max(best, run)
    } else if (diff > 1) {
      run = 1
    }
    // diff === 0 (duplicate date) is ignored
  }
  return best
}

/**
 * Returns an array of `count` dates (oldest first) ending today.
 * Used for the dotted heatmap grid on Today.
 */
export function lastNDates(count: number, endDate: Date = new Date()): Date[] {
  const out: Date[] = []
  for (let i = count - 1; i >= 0; i--) {
    out.push(subDays(endDate, i))
  }
  return out
}

/**
 * Returns 7 days (Mon..Sun) for the current week with completion rate (0..1)
 * and whether the day is today.
 */
export interface WeeklyBarData {
  day: string
  rate: number
  isToday: boolean
  date: Date
}

export function weeklyActivityAggregate(
  habits: { completedDates: string[] }[],
  ref: Date = new Date(),
): WeeklyBarData[] {
  const dow = ref.getDay() // 0 Sun .. 6 Sat
  const offsetToMonday = (dow + 6) % 7
  const monday = subDays(startOfDay(ref), offsetToMonday)
  const todayIsoStr = todayISO(ref)
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i)
    const iso = todayISO(d)
    const total = habits.length
    const completedCount = habits.filter((h) => h.completedDates.includes(iso)).length
    const rate = total > 0 ? completedCount / total : 0

    return {
      day: labels[i],
      rate,
      isToday: iso === todayIsoStr,
      date: d,
    }
  })
}

export function weeklyActivitySingle(
  completedDates: string[],
  ref: Date = new Date(),
): WeeklyBarData[] {
  const dow = ref.getDay() // 0 Sun .. 6 Sat
  const offsetToMonday = (dow + 6) % 7
  const monday = subDays(startOfDay(ref), offsetToMonday)
  const todayIsoStr = todayISO(ref)
  const set = new Set(completedDates)
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i)
    const iso = todayISO(d)
    const done = set.has(iso)

    return {
      day: labels[i],
      rate: done ? 1 : 0,
      isToday: iso === todayIsoStr,
      date: d,
    }
  })
}

export function isToday(iso: string, ref: Date = new Date()): boolean {
  return iso === todayISO(ref)
}

export function isFuture(iso: string, ref: Date = new Date()): boolean {
  return parseISO(iso) > endOfDay(ref)
}

export { addDays, subDays, format }