import { subDays } from 'date-fns'
import { format } from 'date-fns'
import { todayISO } from '../lib/date'

interface Props {
  /** Set of ISO date strings for days that should be filled. */
  completedDates: string[]
  /** Total days to show (default 14). */
  days?: number
}

/**
 * Mini calendar — 2 rows × 7 columns of dots on the Today screen.
 * Today is highlighted with a distinct outline ring.
 */
export function MiniCalendar({ completedDates, days = 14 }: Props) {
  const set = new Set(completedDates)
  const today = new Date()
  const cells: { iso: string; isToday: boolean }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(today, i)
    cells.push({ iso: format(d, 'yyyy-MM-dd'), isToday: isoOf(d) === todayISO(today) })
  }
  const cols = 7
  return (
    <div
      className="grid pointer-events-none select-none p-1"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: '5px',
      }}
      aria-hidden="true"
    >
      {cells.map(({ iso, isToday }) => {
        const done = set.has(iso)
        let bgClass = done ? 'bg-sage-400' : 'bg-creamEdge'
        let outlineClass = ''

        if (isToday) {
          outlineClass = 'ring-2 ring-sage-600 ring-offset-1 ring-offset-cream z-10 scale-110'
          if (!done) {
            bgClass = 'bg-transparent'
          }
        }

        return (
          <span
            key={iso}
            className={[
              'block aspect-square rounded-full transition-all duration-200',
              bgClass,
              outlineClass,
            ].join(' ')}
          />
        )
      })}
    </div>
  )
}

function isoOf(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}