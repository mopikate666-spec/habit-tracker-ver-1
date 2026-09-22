import { ICON_MAP } from '../lib/icons'
import type { IconId } from '../lib/types'

interface Props {
  icon: IconId
  className?: string
  strokeWidth?: number
}

export function IconGlyph({ icon, className = 'w-5 h-5', strokeWidth = 1.75 }: Props) {
  const Cmp = ICON_MAP[icon]
  return <Cmp className={className} strokeWidth={strokeWidth} />
}