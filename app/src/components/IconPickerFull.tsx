import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ICONS_FULL, type IconId } from '../lib/types'
import { IconGlyph } from './IconGlyph'

interface Props {
  open: boolean
  value: IconId
  onClose: () => void
  onSelect: (id: IconId) => void
}

/**
 * Full-screen icon picker. Scrollable grid of 32 icons with a search field.
 */
export function IconPickerFull({ open, value, onClose, onSelect }: Props) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return ICONS_FULL
    return ICONS_FULL.filter((i) => i.label.toLowerCase().includes(term))
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 max-w-[440px] mx-auto bg-cream rounded-t-[28px] px-5 pt-4 pb-8 max-h-[88dvh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="mx-auto w-10 h-1 rounded-full bg-ink-300/60 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 rounded-full bg-creamEdge grid place-items-center text-ink-900"
              >
                <X className="w-4 h-4" strokeWidth={2.4} />
              </button>
              <h2 className="text-[18px] font-semibold tracking-tight text-ink-900">
                Choose Icon
              </h2>
              <div className="w-10 h-10" />
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" strokeWidth={2} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search icons"
                className="w-full bg-creamEdge rounded-full pl-9 pr-4 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-400 outline-none focus:ring-2 focus:ring-ink-900/30"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
              <div className="grid grid-cols-5 gap-2.5">
                {filtered.map(({ id, label }) => {
                  const selected = id === value
                  return (
                    <motion.button
                      key={id}
                      layout
                      whileTap={{ scale: 0.94 }}
                      onClick={() => {
                        onSelect(id)
                        onClose()
                      }}
                      aria-label={label}
                      aria-pressed={selected}
                      className={[
                        'aspect-square rounded-2xl grid place-items-center transition-all',
                        selected
                          ? 'bg-sage-300 ring-2 ring-ink-900 ring-offset-2 ring-offset-cream'
                          : 'bg-creamEdge',
                      ].join(' ')}
                    >
                      <IconGlyph
                        icon={id}
                        className="w-5 h-5 text-ink-900"
                        strokeWidth={2}
                      />
                    </motion.button>
                  )
                })}
                {filtered.length === 0 && (
                  <p className="col-span-5 text-center text-[13px] text-ink-500 py-12">
                    No icons match "{q}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}