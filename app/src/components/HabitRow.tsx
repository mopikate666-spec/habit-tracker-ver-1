import { useRef } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { IconGlyph } from './IconGlyph'
import { CATEGORIES, type Habit } from '../lib/types'
import { todayISO } from '../lib/date'

interface Props {
  habit: Habit
  onOpen: (id: string) => void
  onToggle: (id: string) => void
  /** Triggered on long-press — opens the actions sheet. */
  onLongPress?: (id: string) => void
}

const LONG_PRESS_MS = 480
const LONG_PRESS_SLOP = 8

export function HabitRow({ habit, onOpen, onToggle, onLongPress }: Props) {
  const done = habit.completedDates.includes(todayISO())
  const cat = CATEGORIES[habit.category]
  // Set to true while a long-press is pending or just fired; suppresses the
  // subsequent click that would otherwise open the detail screen.
  const longPressFiredRef = useRef(false)

  function scheduleLongPress(getStart: () => { x: number; y: number } | null) {
    if (!onLongPress) return
    longPressFiredRef.current = false
    const start = getStart()
    if (!start) return
    const timer = window.setTimeout(() => {
      longPressFiredRef.current = true
      onLongPress!(habit.id)
    }, LONG_PRESS_MS)
    const onMove = (mx: number, my: number) => {
      if (Math.abs(mx - start.x) > LONG_PRESS_SLOP || Math.abs(my - start.y) > LONG_PRESS_SLOP) {
        window.clearTimeout(timer)
        cleanup()
      }
    }
    const onEnd = () => {
      window.clearTimeout(timer)
      cleanup()
    }
    function cleanup() {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', mu)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', te)
    }
    const mm = (ev: MouseEvent) => onMove(ev.clientX, ev.clientY)
    const mu = () => onEnd()
    const tm = (ev: TouchEvent) => {
      const t = ev.touches[0]
      if (t) onMove(t.clientX, t.clientY)
    }
    const te = () => onEnd()
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu, { once: true })
    window.addEventListener('touchmove', tm)
    window.addEventListener('touchend', te, { once: true })
  }

  return (
    <motion.button
      onClick={() => {
        if (longPressFiredRef.current) {
          longPressFiredRef.current = false
          return
        }
        onOpen(habit.id)
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return
        scheduleLongPress(() => ({ x: e.clientX, y: e.clientY }))
      }}
      onTouchStart={(e) => {
        const t = e.touches[0]
        if (!t) return
        scheduleLongPress(() => ({ x: t.clientX, y: t.clientY }))
      }}
      whileTap={{ scale: 0.985 }}
      className="w-full flex items-center gap-4 bg-cream rounded-3xl p-3 pl-3 pr-3 text-left shadow-soft select-none touch-manipulation"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: cat.bg, color: cat.fg }}
      >
        <IconGlyph icon={habit.icon} className="w-5 h-5" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] font-semibold leading-tight truncate ${done ? 'text-ink-500 line-through decoration-ink-300' : 'text-ink-900'}`}
        >
          {habit.name}
        </p>
        <p className="text-[12px] text-ink-500 mt-0.5 truncate">{habit.sub}</p>
      </div>

      <span
        role="checkbox"
        aria-checked={done}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(habit.id)
        }}
        className={[
          'w-7 h-7 rounded-md border-2 flex items-center justify-center transition-colors shrink-0',
          done ? 'bg-sage-400 border-sage-400' : 'bg-transparent border-ink-300',
        ].join(' ')}
      >
        <motion.span
          key={done ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          <Check className="w-4 h-4 text-ink-900" strokeWidth={3} />
        </motion.span>
      </span>
    </motion.button>
  )
}