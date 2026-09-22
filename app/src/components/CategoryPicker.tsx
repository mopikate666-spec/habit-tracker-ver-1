import { CATEGORIES, type CategoryId } from '../lib/types'

interface Props {
  value: CategoryId
  onChange: (id: CategoryId) => void
}

/**
 * 12 saturated color swatches in a 6-column grid.
 * No per-swatch labels — the selected swatch is communicated
 * via the ring, and the color name lives in `aria-label` for a11y.
 */
const ORDER: CategoryId[] = [
  'health', 'mind', 'focus', 'body',
  'sleep', 'fitness', 'learning', 'creativity',
  'nutrition', 'social', 'outdoors', 'mindful',
]

export function CategoryPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-6 gap-x-2 gap-y-2">
      {ORDER.map((id) => {
        const def = CATEGORIES[id]
        const selected = id === value
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-label={def.label}
            aria-pressed={selected}
            title={def.label}
            className="aspect-square rounded-xl transition-all"
          >
            <span
              className={[
                'block w-full h-full rounded-xl transition-all',
                selected
                  ? 'ring-2 ring-ink-900 ring-offset-[3px] ring-offset-cream scale-95'
                  : '',
              ].join(' ')}
              style={{ backgroundColor: def.bg }}
            />
          </button>
        )
      })}
    </div>
  )
}