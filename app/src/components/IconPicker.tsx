import { Plus } from 'lucide-react'
import { ICONS_QUICK, type IconId } from '../lib/types'
import { IconGlyph } from './IconGlyph'

interface Props {
  value: IconId
  onChange: (id: IconId) => void
  /** Opens the full picker. */
  onOpenFull: () => void
}

/**
 * Compact 5-tile row:
 *   [Leaf] [Coffee] [Bed] [Dumbbell] [+ More]
 *
 * The 5th tile opens the full library via `onOpenFull`.
 * The currently selected icon (if it's NOT one of the 4 quick-picks) is
 * visually highlighted on the "+" tile so users know what's chosen.
 */
export function IconPicker({ value, onChange, onOpenFull }: Props) {
  const isQuickPick = ICONS_QUICK.some((i) => i.id === value)

  return (
    <div className="grid grid-cols-5 gap-2.5">
      {ICONS_QUICK.map(({ id, label }) => {
        const selected = id === value
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-pressed={selected}
            className={[
              'aspect-square rounded-2xl grid place-items-center transition-all',
              selected
                ? 'bg-sage-300 ring-2 ring-ink-900 ring-offset-2 ring-offset-cream'
                : 'bg-creamEdge',
            ].join(' ')}
          >
            <IconGlyph icon={id} className="w-5 h-5 text-ink-900" strokeWidth={2} />
          </button>
        )
      })}

      <button
        onClick={onOpenFull}
        aria-label="More icons"
        aria-pressed={!isQuickPick}
        className={[
          'aspect-square rounded-2xl grid place-items-center transition-all',
          !isQuickPick
            ? 'bg-sage-300 ring-2 ring-ink-900 ring-offset-2 ring-offset-cream'
            : 'bg-creamEdge',
        ].join(' ')}
      >
        {isQuickPick ? (
          <Plus className="w-5 h-5 text-ink-900" strokeWidth={2.4} />
        ) : (
          <IconGlyph icon={value} className="w-5 h-5 text-ink-900" strokeWidth={2} />
        )}
      </button>
    </div>
  )
}