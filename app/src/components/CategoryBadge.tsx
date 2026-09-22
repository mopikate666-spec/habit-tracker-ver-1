import { CATEGORIES, type CategoryId } from '../lib/types'

export function CategorySwatch({
  category,
  className = 'w-14 h-14',
  style,
}: {
  category: CategoryId
  className?: string
  style?: React.CSSProperties
}) {
  const def = CATEGORIES[category]
  return (
    <div
      className={`${className ?? ''} rounded-2xl shrink-0`}
      style={{ backgroundColor: def.bg, ...style }}
    />
  )
}

export function CategoryDot({ category }: { category: CategoryId }) {
  const def = CATEGORIES[category]
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: def.bg }}
    />
  )
}