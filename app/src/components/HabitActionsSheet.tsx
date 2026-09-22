import { AnimatePresence, motion } from 'motion/react'
import { Pencil, Trash2, X } from 'lucide-react'
import type { Habit } from '../lib/types'
import { CATEGORIES } from '../lib/types'
import { IconGlyph } from './IconGlyph'

interface Props {
  habit: Habit | null
  onClose: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Bottom sheet that appears after long-pressing a habit row.
 * Lets the user Edit (opens HabitFormModal in edit mode) or Delete the habit.
 */
export function HabitActionsSheet({ habit, onClose, onEdit, onDelete }: Props) {
  const open = !!habit
  const cat = habit ? CATEGORIES[habit.category] : null

  return (
    <AnimatePresence>
      {open && habit && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-w-[440px] mx-auto bg-cream rounded-t-[28px] px-5 pt-4 pb-8"
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-ink-300/60 mb-4" />

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full bg-creamEdge grid place-items-center text-ink-900"
              >
                <X className="w-4 h-4" strokeWidth={2.4} />
              </button>
              <p className="label-eyebrow">Habit Actions</p>
              <div className="w-10 h-10" />
            </div>

            {/* Habit preview chip */}
            <div className="card p-3 flex items-center gap-3 shadow-soft mb-3">
              <div
                className="w-10 h-10 rounded-2xl grid place-items-center"
                style={{ backgroundColor: cat?.bg, color: cat?.fg }}
              >
                <IconGlyph icon={habit.icon} className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 truncate">{habit.name}</p>
                <p className="text-[12px] text-ink-500">{cat?.label}</p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                onEdit(habit.id)
                onClose()
              }}
              className="w-full card p-4 flex items-center gap-3 shadow-soft mb-2 active:scale-[0.99] transition-transform"
            >
              <span className="w-10 h-10 rounded-2xl bg-sage-300 grid place-items-center text-ink-900">
                <Pencil className="w-4 h-4" strokeWidth={2.2} />
              </span>
              <span className="flex-1 text-left text-[15px] font-medium text-ink-900">Edit</span>
              <span className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
                Name · icon · color · frequency
              </span>
            </button>

            <button
              onClick={() => {
                onDelete(habit.id)
                onClose()
              }}
              className="w-full card p-4 flex items-center gap-3 shadow-soft active:scale-[0.99] transition-transform"
            >
              <span className="w-10 h-10 rounded-2xl bg-[#F4A3A3] grid place-items-center text-[#6B1F1F]">
                <Trash2 className="w-4 h-4" strokeWidth={2.2} />
              </span>
              <span className="flex-1 text-left text-[15px] font-medium text-[#7A2542]">Delete</span>
              <span className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">
                Removes all history
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}