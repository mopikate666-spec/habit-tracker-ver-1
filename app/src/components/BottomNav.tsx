import { Calendar, LayoutGrid, BarChart3, UserRound, type LucideIcon } from 'lucide-react'

export type NavTab = 'today' | 'calendar' | 'stats' | 'profile'

interface Props {
  active: NavTab
  onChange: (tab: NavTab) => void
}

const ITEMS: { id: NavTab; label: string; Icon: LucideIcon }[] = [
  { id: 'today', label: 'Today', Icon: LayoutGrid },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'stats', label: 'Stats', Icon: BarChart3 },
  { id: 'profile', label: 'Profile', Icon: UserRound },
]

/**
 * Floating bottom navigation — translucent cream pill with backdrop-blur.
 * Icons-only: each tab is a fixed square cell, label moved to aria-label/title
 * so the row stays compact on narrow viewports.
 */
export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
    >
      <div className="max-w-[440px] mx-auto px-4 pb-4">
        <div
          className="pointer-events-auto bg-cream/70 backdrop-blur-xl border border-cream/60 rounded-full px-2 py-2 flex items-stretch justify-between gap-1 shadow-card"
          style={{ WebkitBackdropFilter: 'blur(16px)' }}
        >
          {ITEMS.map(({ id, label, Icon }) => {
            const isActive = id === active
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                title={label}
                className={[
                  'flex-1 min-w-0 flex items-center justify-center py-2.5 rounded-full transition-colors',
                  isActive
                    ? 'bg-ink-900 text-cream'
                    : 'text-ink-700 hover:bg-creamEdge/60',
                ].join(' ')}
              >
                <Icon
                  className="w-[18px] h-[18px] shrink-0"
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}