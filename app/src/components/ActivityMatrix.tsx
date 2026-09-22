import { subDays, format } from 'date-fns'
import { todayISO } from '../lib/date'

interface Props {
  completedDates: string[]
  rows?: number
  cols?: number
}

/**
 * Larger dot matrix used on the Habit Detail screen.
 * Reads bottom-to-top, latest column = today.
 * Highlights the latest completed day in lime.
 */
export function ActivityMatrix({ completedDates, rows = 7, cols = 14 }: Props) {
  const set = new Set(completedDates)
  const today = new Date()
  const totalCells = rows * cols
  const cells: { iso: string; done: boolean; isToday: boolean }[] = []
  for (let i = totalCells - 1; i >= 0; i--) {
    const d = subDays(today, i)
    const iso = format(d, 'yyyy-MM-dd')
    cells.push({ iso, done: set.has(iso), isToday: iso === todayISO(today) })
  }
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: '5px',
      }}
    >
      {cells.map(({ iso, done, isToday }) => (
        <span
          key={iso}
          className={[
            'block aspect-square rounded-full',
            done ? 'bg-sage-400' : 'bg-sage-100',
            isToday && !done ? 'bg-sage-100 ring-1 ring-sage-400/50' : '',
          ].join(' ')}
          title={iso}
        />
      ))}
    </div>
  )
}