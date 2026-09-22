import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import type { Habit } from '../lib/types'
import { IconGlyph } from './IconGlyph'
import { ActivityMatrix } from './ActivityMatrix'
import { WeeklyBars } from './WeeklyBars'
import { currentStreak, longestStreak, weeklyActivitySingle } from '../lib/date'

interface Props {
  habit: Habit
  onBack: () => void
  onLog: (id: string) => void
}

export function HabitDetailScreen({ habit, onBack, onLog }: Props) {
  const streak = currentStreak(new Set(habit.completedDates))
  const best = longestStreak(habit.completedDates)
  const total = habit.completedDates.length
  const done = habit.completedDates.includes(todayISO())

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="px-5 pt-6 pb-8 flex flex-col gap-5"
    >
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <button
          aria-label="Back"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-cream grid place-items-center text-ink-900 shadow-soft active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.4} />
        </button>
        <h1 className="text-[20px] font-semibold tracking-tight text-cream">
          {habit.name}
        </h1>
        <div className="w-10 h-10 rounded-full bg-cream grid place-items-center text-ink-900 shadow-soft">
          <IconGlyph icon={habit.icon} className="w-5 h-5" strokeWidth={2} />
        </div>
      </header>

      {/* Big stat block */}
      <section className="card p-5 shadow-soft">
        <div className="flex items-end justify-between">
          <p className="label-eyebrow">Momentum {new Date().getFullYear()}</p>
          <p className="text-[12px] text-ink-700">{total} days completed</p>
        </div>
        <div className="mt-4">
          <ActivityMatrix completedDates={habit.completedDates} rows={7} cols={14} />
        </div>
      </section>

      {/* Streak row */}
      <section className="grid grid-cols-2 gap-3">
        <div className="card p-5 shadow-soft">
          <p className="label-eyebrow">Streak</p>
          <motion.p
            key={streak}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="display-num text-[64px] mt-2 text-ink-900"
          >
            {streak}
          </motion.p>
          <p className="text-[11px] uppercase tracking-wider text-ink-500 mt-1">Current days</p>
        </div>
        <div className="card p-5 shadow-soft">
          <p className="label-eyebrow">Best Streak</p>
          <motion.p
            key={best}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="display-num text-[64px] mt-2 text-ink-900"
          >
            {best}
          </motion.p>
          <p className="text-[11px] uppercase tracking-wider text-ink-500 mt-1">All time record</p>
        </div>
      </section>

      {/* Weekly activity */}
      <section className="card p-5 shadow-soft">
        <p className="label-eyebrow">Weekly Activity</p>
        <div className="mt-4">
          <WeeklyBars data={weeklyActivitySingle(habit.completedDates)} />
        </div>
      </section>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onLog(habit.id)}
        className={[
          'w-full rounded-full py-4 text-[15px] font-semibold shadow-card transition-colors',
          done ? 'bg-cream text-ink-900' : 'bg-ink-900 text-cream',
        ].join(' ')}
      >
        {done ? 'Logged today · undo' : 'Log Habit Now'}
      </motion.button>
    </motion.div>
  )
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}