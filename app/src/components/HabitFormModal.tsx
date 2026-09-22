import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, X } from 'lucide-react'
import { CATEGORIES, type CategoryId, type Habit, type IconId } from '../lib/types'
import { IconGlyph } from './IconGlyph'
import { IconPicker } from './IconPicker'
import { IconPickerFull } from './IconPickerFull'
import { CategoryPicker } from './CategoryPicker'

interface Props {
  open: boolean
  /** When set, the form edits this habit instead of creating a new one. */
  habit?: Habit | null
  onClose: () => void
  onCreate: (data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void
  onUpdate: (id: string, data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void
}

const FREQUENCIES: { id: Habit['frequency']; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekly', label: '3x / week' },
]

const DEFAULTS = {
  name: '',
  icon: 'leaf' as IconId,
  category: 'health' as CategoryId,
  frequency: 'daily' as Habit['frequency'],
}

export function HabitFormModal({ open, habit, onClose, onCreate, onUpdate }: Props) {
  const isEdit = !!habit
  const [name, setName] = useState(DEFAULTS.name)
  const [icon, setIcon] = useState<IconId>(DEFAULTS.icon)
  const [category, setCategory] = useState<CategoryId>(DEFAULTS.category)
  const [frequency, setFrequency] = useState<Habit['frequency']>(DEFAULTS.frequency)
  const [fullIconsOpen, setFullIconsOpen] = useState(false)

  // Sync form state whenever the modal opens (fresh defaults for create, pre-fill for edit).
  useEffect(() => {
    if (!open) return
    if (habit) {
      setName(habit.name)
      setIcon(habit.icon)
      setCategory(habit.category)
      setFrequency(habit.frequency)
    } else {
      setName(DEFAULTS.name)
      setIcon(DEFAULTS.icon)
      setCategory(DEFAULTS.category)
      setFrequency(DEFAULTS.frequency)
    }
    setFullIconsOpen(false)
  }, [open, habit])

  const canSave = name.trim().length > 1

  function handleSave() {
    if (!canSave) return
    const payload = {
      name: name.trim(),
      sub: habit?.sub ?? 'Daily progress',
      icon,
      category,
      frequency,
    }
    if (habit) onUpdate(habit.id, payload)
    else onCreate(payload)
    onClose()
  }

  const cat = CATEGORIES[category]

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          >
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 500) onClose()
              }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 bg-cream rounded-t-[28px] px-5 pt-4 pb-8 max-h-[92dvh] overflow-y-auto"
            >
              <div className="mx-auto w-10 h-1 rounded-full bg-ink-300/60 mb-4" />

              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-creamEdge grid place-items-center text-ink-900"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.4} />
                </button>
                <h2 className="text-[18px] font-semibold tracking-tight text-ink-900">
                  {isEdit ? 'Edit Habit' : 'New Habit'}
                </h2>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className={[
                    'text-[12px] font-semibold uppercase tracking-[0.14em] px-1 py-2',
                    canSave ? 'text-ink-900' : 'text-ink-400 cursor-not-allowed',
                  ].join(' ')}
                >
                  {isEdit ? 'Save' : 'Create'}
                </button>
              </div>

              <section className="card mt-5 p-4 shadow-soft">
                <p className="label-eyebrow mb-2">Habit Name</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Yoga"
                  className="w-full bg-transparent text-[18px] font-medium text-ink-900 placeholder:text-ink-400 outline-none"
                  autoFocus
                />
              </section>

              <section className="card mt-3 p-4 shadow-soft">
                <p className="label-eyebrow mb-3">Icon</p>
                <IconPicker
                  value={icon}
                  onChange={setIcon}
                  onOpenFull={() => setFullIconsOpen(true)}
                />
              </section>

              <section className="card mt-3 p-4 shadow-soft">
                <p className="label-eyebrow mb-3">Colors</p>
                <CategoryPicker value={category} onChange={setCategory} />
              </section>

              <section className="card mt-3 p-4 shadow-soft">
                <p className="label-eyebrow">Frequency</p>
                <button
                  onClick={() => {
                    const i = FREQUENCIES.findIndex((f) => f.id === frequency)
                    setFrequency(FREQUENCIES[(i + 1) % FREQUENCIES.length].id)
                  }}
                  className="w-full flex items-center justify-between mt-2"
                >
                  <span className="text-[15px] font-medium text-ink-900">
                    {FREQUENCIES.find((f) => f.id === frequency)?.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-ink-500" />
                </button>
              </section>

              <section className="card mt-3 p-3 flex items-center gap-3 shadow-soft">
                <div
                  className="w-10 h-10 rounded-2xl grid place-items-center"
                  style={{ backgroundColor: cat.bg, color: cat.fg }}
                >
                  <IconGlyph icon={icon} className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">
                    {name.trim() || 'Your new habit'}
                  </p>
                  <p className="text-[12px] text-ink-500">
                    {cat.label} · {FREQUENCIES.find((f) => f.id === frequency)?.label}
                  </p>
                </div>
              </section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <IconPickerFull
        open={fullIconsOpen}
        value={icon}
        onClose={() => setFullIconsOpen(false)}
        onSelect={(id) => setIcon(id)}
      />
    </>
  )
}