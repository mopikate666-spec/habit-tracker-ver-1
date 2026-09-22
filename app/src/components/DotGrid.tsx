import { lastNDates, todayISO } from '../lib/date'

interface Props {
  completedDates: string[]
  /** Total dots to render (default 20). */
  count?: number
  /** dots per row (default 5). */
  cols?: number
}

/**
 * Small heatmap: a grid of dots, sage when completed, faint cream when not.
 * Latest dot is the bottom-right of the last row.
 */
export function DotGrid({ completedDates, count = 20, cols = 5 }: Props) {
  const dates = lastNDates(count)
  const set = new Set(completedDates)
  const today = todayISO()
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '6px' }}
    >
      {dates.map((d) => {
        const iso = todayISO(d)
        const done = set.has(iso)
        const isTodayDot = iso === today
        return (
          <span
            key={iso}
            className={[
              'block aspect-square rounded-full transition-colors',
              done ? 'bg-sage-300' : 'bg-creamEdge/70',
              isTodayDot && !done ? 'ring-1 ring-sage-300/40' : '',
            ].join(' ')}
            title={iso}
          />
        )
      })}
    </div>
  )
}