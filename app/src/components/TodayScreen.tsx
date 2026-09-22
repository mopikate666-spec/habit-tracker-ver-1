import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import type { Habit } from '../lib/types'
import { fmtMonthDay } from '../lib/date'
import { HabitRow } from './HabitRow'
import { StreakCard } from './StreakCard'

interface Props {
  habits: Habit[]
  now: Date
  onOpenHabit: (id: string) => void
  onToggle: (id: string) => void
  onNewHabit: () => void
  onHabitLongPress: (id: string) => void
}

function greeting(now: Date): string {
  const h = now.getHours()
  if (h < 5) return 'Late night'
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  if (h < 21) return 'Evening'
  return 'Night'
}

export function TodayScreen({ habits, now, onOpenHabit, onToggle, onNewHabit, onHabitLongPress }: Props) {
  const today = fmtMonthDay(now)
  // Overall streak = max current streak across all habits
  // For hero, sum today's completion ratio
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(formatISO(now)),
  ).length
  const total = habits.length
  return (
    <div className="px-5 pt-6 pb-4 flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label-eyebrow">{today}</p>
          <h1 className="mt-2 text-[34px] leading-[1.05] font-semibold tracking-tight text-cream">
            {greeting(now)}, Jordan.
          </h1>
        </div>
        <button
          aria-label="Profile"
          className="w-12 h-12 rounded-full overflow-hidden bg-sage-300 shrink-0 grid place-items-center text-ink-900 font-semibold"
        >
          J
        </button>
      </header>

      {/* Hero streak card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <StreakCard completedDates={flatDates(habits)} />
      </motion.div>

      {/* Subheading */}
      <div className="flex items-center justify-between">
        <p className="text-cream/90 text-[15px] font-medium">
          {completedToday}/{total} habits today
        </p>
        <button
          onClick={onNewHabit}
          className="w-10 h-10 rounded-full bg-cream grid place-items-center text-ink-900 shadow-soft active:scale-95 transition-transform"
          aria-label="Add new habit"
        >
          <Plus className="w-5 h-5" strokeWidth={2.4} />
        </button>
      </div>

      {/* Habit list */}
      <ul className="flex flex-col gap-2.5">
        {habits.map((h, i) => (
          <motion.li
            key={h.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.08 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <HabitRow habit={h} onOpen={onOpenHabit} onToggle={onToggle} onLongPress={onHabitLongPress} />
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

/** Combined completion of any habit on each day (used to compute streak). */
function flatDates(habits: Habit[]): string[] {
  const set = new Set<string>()
  for (const h of habits) for (const d of h.completedDates) set.add(d)
  return [...set]
}

function formatISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}