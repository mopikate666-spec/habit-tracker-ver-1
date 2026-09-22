import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns'
import { currentStreak, longestStreak, weeklyActivityAggregate } from '../lib/date'
import type { Habit } from '../lib/types'
import { WeeklyBars } from './WeeklyBars'

interface Props {
  now: Date
  habits: Habit[]
  aggregatedDates: string[]
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function CalendarScreen({ now, habits, aggregatedDates }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(now))
  const completedSet = useMemo(() => new Set(aggregatedDates), [aggregatedDates])

  const cells = useMemo(() => {
    const monthStart = startOfMonth(cursor)
    const monthEnd = endOfMonth(cursor)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const daysInMonth = monthEnd.getDate()
    const offsetDays = (gridStart.getDay() + 6) % 7
    const totalCells = Math.ceil((offsetDays + daysInMonth) / 7) * 7
    const out: Date[] = []
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      out.push(d)
    }
    return out
  }, [cursor])

  const currentCombined = useMemo(() => currentStreak(completedSet), [completedSet])
  const bestCombined = useMemo(() => longestStreak(aggregatedDates), [aggregatedDates])
  const weeklyData = useMemo(() => weeklyActivityAggregate(habits, now), [habits, now])

  function isoOf(d: Date): string {
    return format(d, 'yyyy-MM-dd')
  }

  return (
    <div className="px-5 pt-6 pb-4 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow">Calendar</p>
          <h1 className="mt-1 text-[28px] leading-[1.1] font-semibold tracking-tight text-cream">
            {format(cursor, 'LLLL yyyy')}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous month"
            onClick={() => setCursor((c) => addMonths(c, -1))}
            className="w-9 h-9 rounded-full bg-cream grid place-items-center text-ink-900 shadow-soft active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.4} />
          </button>
          <button
            aria-label="Next month"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="w-9 h-9 rounded-full bg-cream grid place-items-center text-ink-900 shadow-soft active:scale-95 transition-transform"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1.5 px-1">
        {WEEKDAYS.map((d, idx) => (
          <div key={idx} className="text-center text-[10px] uppercase tracking-wider text-cream/60 font-medium">
            {d}
          </div>
        ))}
      </div>

      <motion.div
        key={format(cursor, 'yyyy-MM')}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-7 gap-1.5"
      >
        {cells.map((d) => {
          const inMonth = isSameMonth(d, cursor)
          const isToday = isSameDay(d, now)
          const done = completedSet.has(isoOf(d))

          let cellBg = inMonth ? 'bg-cream' : 'bg-cream/40'
          let textCls = inMonth ? 'text-ink-900' : 'text-ink-300'
          let dotCls = done ? 'bg-sage-500' : 'bg-creamEdge'

          if (isToday) {
            cellBg = 'bg-sage-400 ring-2 ring-sage-600 ring-offset-1 ring-offset-[#1b1c1e]'
            textCls = 'text-ink-900 font-bold'
            dotCls = done ? 'bg-ink-900' : 'bg-sage-600/40'
          }

          return (
            <div
              key={d.toISOString()}
              className={[
                'aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors select-none pointer-events-none cursor-default',
                cellBg,
              ].join(' ')}
            >
              <span className={['text-[12px] font-semibold tabular-nums leading-none select-none', textCls].join(' ')}>
                {d.getDate()}
              </span>
              <span className={['w-1.5 h-1.5 rounded-full', dotCls].join(' ')} />
            </div>
          )
        })}
      </motion.div>

      {/* Stat blocks: STREAK / BEST STREAK / WEEKLY ACTIVITY */}
      <section className="grid grid-cols-2 gap-3">
        <div className="card p-5 shadow-soft">
          <p className="label-eyebrow">Streak</p>
          <motion.p
            key={`cs-${currentCombined}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="display-num text-[56px] mt-2 text-ink-900"
          >
            {currentCombined}
          </motion.p>
          <p className="text-[11px] uppercase tracking-wider text-ink-500 mt-1">Current days</p>
        </div>
        <div className="card p-5 shadow-soft">
          <p className="label-eyebrow">Best Streak</p>
          <motion.p
            key={`bs-${bestCombined}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="display-num text-[56px] mt-2 text-ink-900"
          >
            {bestCombined}
          </motion.p>
          <p className="text-[11px] uppercase tracking-wider text-ink-500 mt-1">All time record</p>
        </div>
      </section>

      <section className="card p-5 shadow-soft">
        <p className="label-eyebrow">Weekly Activity</p>
        <div className="mt-4">
          <WeeklyBars data={weeklyData} />
        </div>
      </section>
    </div>
  )
}