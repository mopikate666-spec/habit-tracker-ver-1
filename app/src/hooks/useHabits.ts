import { useCallback, useEffect, useState } from 'react'
import type { Habit } from '../lib/types'
import {
  deleteHabit as deleteHabitInState,
  ensureSeed,
  loadState,
  saveState,
  toggleCompletion,
  uid,
  upsertHabit,
} from '../lib/storage'
import { todayISO } from '../lib/date'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [ready, setReady] = useState(false)

  // Load + seed on first mount
  useEffect(() => {
    const seeded = ensureSeed()
    setHabits(seeded.habits)
    setReady(true)
  }, [])

  // Persist whenever habits change (after initial seed)
  useEffect(() => {
    if (!ready) return
    saveState({ version: 2, habits, seeded: true })
  }, [habits, ready])

  const addHabit = useCallback(
    (data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
      const habit: Habit = {
        ...data,
        id: uid(),
        completedDates: [],
        createdAt: todayISO(),
      }
      setHabits((curr) => upsertHabit({ version: 2, habits: curr, seeded: true }, habit).habits)
    },
    [],
  )

  const updateHabit = useCallback(
    (
      id: string,
      data: Partial<Omit<Habit, 'id' | 'completedDates' | 'createdAt'>>,
    ) => {
      setHabits((curr) =>
        curr.map((h) => (h.id === id ? { ...h, ...data } : h)),
      )
    },
    [],
  )

  const removeHabit = useCallback((id: string) => {
    setHabits((curr) => deleteHabitInState({ version: 2, habits: curr, seeded: true }, id).habits)
  }, [])

  const toggle = useCallback((id: string, iso: string = todayISO()) => {
    setHabits((curr) => toggleCompletion({ version: 2, habits: curr, seeded: true }, id, iso).habits)
  }, [])

  return { habits, ready, addHabit, updateHabit, removeHabit, toggle }
}

/** Re-export for non-hook callers */
export { loadState }