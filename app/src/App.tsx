import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useHabits } from './hooks/useHabits'
import { useClock } from './hooks/useClock'
import { useSwipe } from './hooks/useSwipe'
import { TodayScreen } from './components/TodayScreen'
import { CalendarScreen } from './components/CalendarScreen'
import { HabitDetailScreen } from './components/HabitDetailScreen'
import { HabitFormModal } from './components/HabitFormModal'
import { HabitActionsSheet } from './components/HabitActionsSheet'
import { BottomNav, type NavTab } from './components/BottomNav'

const TAB_ORDER: NavTab[] = ['today', 'calendar', 'stats', 'profile']

export default function App() {
  const { habits, ready, addHabit, updateHabit, removeHabit, toggle } = useHabits()
  const now = useClock()
  const [tab, setTab] = useState<NavTab>('today')
  const [openId, setOpenId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [actionsId, setActionsId] = useState<string | null>(null)

  const openHabit = useMemo(
    () => habits.find((h) => h.id === openId) ?? null,
    [habits, openId],
  )
  const editingHabit = useMemo(
    () => habits.find((h) => h.id === editingId) ?? null,
    [habits, editingId],
  )
  const actionsHabit = useMemo(
    () => habits.find((h) => h.id === actionsId) ?? null,
    [habits, actionsId],
  )

  const swipeTo = useCallback(
    (dir: 1 | -1) => {
      const i = TAB_ORDER.indexOf(tab)
      const next = TAB_ORDER[i + dir]
      if (next) {
        setTab(next)
        setOpenId(null)
      }
    },
    [tab],
  )

  const swipeRef = useSwipe<HTMLElement>(
    {
      onSwipeLeft: () => swipeTo(1),
      onSwipeRight: () => swipeTo(-1),
    },
    !openHabit,
  )

  if (!ready) {
    return (
      <div className="min-h-dvh w-full grid place-items-center">
        <div className="w-8 h-8 rounded-full border-2 border-cream/30 border-t-sage-300 animate-spin" />
      </div>
    )
  }

  function openCreateForm() {
    setEditingId(null)
    setFormOpen(true)
  }

  function openEditForm(id: string) {
    setEditingId(id)
    setFormOpen(true)
  }

  /**
   * Switch tab and close any open detail in one go —
   * tapping a nav tab should not leave the detail screen stacked on top.
   */
  function switchTab(next: NavTab) {
    setTab(next)
    setOpenId(null)
  }

  /** Aggregated completion dates across all habits — used by Calendar and Today streak. */
  function flatDates(habits: { completedDates: string[] }[]): string[] {
    const set = new Set<string>()
    for (const h of habits) for (const d of h.completedDates) set.add(d)
    return [...set]
  }

  return (
    <div className="min-h-dvh w-full flex justify-center">
      <div className="w-full max-w-[440px] relative bg-page min-h-dvh flex flex-col">
        <main ref={swipeRef} className="flex-1 overflow-y-auto no-scrollbar pb-28 touch-pan-y">
          <AnimatePresence mode="wait">
            {openHabit ? (
              <HabitDetailScreen
                key="detail"
                habit={openHabit}
                onBack={() => setOpenId(null)}
                onLog={(id) => toggle(id)}
              />
            ) : tab === 'calendar' ? (
              <CalendarScreen
                key="calendar"
                now={now}
                habits={habits}
                aggregatedDates={flatDates(habits)}
              />
            ) : (
              <TodayScreen
                key="today"
                habits={habits}
                now={now}
                onOpenHabit={setOpenId}
                onToggle={toggle}
                onNewHabit={openCreateForm}
                onHabitLongPress={(id) => setActionsId(id)}
              />
            )}
          </AnimatePresence>
        </main>

        <BottomNav active={tab} onChange={switchTab} />

        <HabitFormModal
          open={formOpen}
          habit={editingHabit}
          onClose={() => setFormOpen(false)}
          onCreate={addHabit}
          onUpdate={updateHabit}
        />

        <HabitActionsSheet
          habit={actionsHabit}
          onClose={() => setActionsId(null)}
          onEdit={(id) => openEditForm(id)}
          onDelete={(id) => removeHabit(id)}
        />
      </div>
    </div>
  )
}