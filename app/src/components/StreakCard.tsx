import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { currentStreak } from '../lib/date'
import { MiniCalendar } from './MiniCalendar'

interface Props {
  completedDates: string[]
}

/** Phrase table — picked by streak length so the message changes as the chain grows. */
function phraseFor(streak: number): string {
  if (streak === 0) return 'A new chain starts with one small step.'
  if (streak === 1) return 'Day one. The hardest one. You showed up.'
  if (streak < 4) return 'Keep the chain going.'
  if (streak < 8) return 'Momentum is building. Don\u2019t break it.'
  if (streak < 15) return 'Habits are forming. This is where it sticks.'
  if (streak < 30) return 'Two weeks strong. You\u2019re not the same as day one.'
  if (streak < 60) return 'A month of showing up. The compound effect is real.'
  if (streak < 100) return 'This is who you are now. Keep going.'
  return 'You\u2019ve built a system. The chain speaks for itself.'
}

/** Hero card on Today screen — streak number + motivational phrase + 14-day mini calendar. */
export function StreakCard({ completedDates }: Props) {
  const streak = currentStreak(new Set(completedDates))
  const phrase = phraseFor(streak)
  return (
    <div className="card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">Day Streak</p>
        <span className="w-8 h-8 rounded-full bg-sage-100 grid place-items-center text-sage-700">
          <Sparkles className="w-4 h-4" strokeWidth={2} />
        </span>
      </div>

      <div className="flex items-end justify-between gap-4 mt-1">
        <div className="min-w-0 flex-1">
          <motion.p
            key={streak}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="display-num text-[80px] text-ink-900 leading-none"
          >
            {streak}
          </motion.p>
          <motion.p
            key={`p-${phrase}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-[13px] text-ink-700 leading-snug pr-2"
          >
            {phrase}
          </motion.p>
        </div>
        <div className="w-[44%] max-w-[140px] pb-1">
          <MiniCalendar completedDates={completedDates} days={14} />
        </div>
      </div>
    </div>
  )
}