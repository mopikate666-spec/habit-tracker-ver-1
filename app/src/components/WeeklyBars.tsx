import { motion } from 'motion/react'
import type { WeeklyBarData } from '../lib/date'

interface Props {
  data: WeeklyBarData[]
}

export function WeeklyBars({ data }: Props) {
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((item, i) => {
        // Minimum visual height of 10% for empty/0% days so they remain visible
        const heightPct = Math.max(10, Math.round(item.rate * 100))
        
        // Color logic based on requirements:
        // Today bar: Bright lime/sage green
        // Completed past/other days (rate > 0): Soft green
        // Uncompleted days (rate == 0): Light gray
        let barBgClass = 'bg-creamEdge'
        if (item.isToday) {
          barBgClass = item.rate > 0 ? 'bg-sage-400' : 'bg-sage-300'
        } else if (item.rate > 0) {
          barBgClass = 'bg-sage-200'
        }

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex-1 flex items-end">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${heightPct}%`, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={[
                  'w-full rounded-t-2xl transition-colors',
                  barBgClass,
                ].join(' ')}
              />
            </div>
            <span
              className={[
                'text-[10px] uppercase tracking-wider font-medium',
                item.isToday ? 'text-sage-700 font-bold' : 'text-ink-500',
              ].join(' ')}
            >
              {item.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}