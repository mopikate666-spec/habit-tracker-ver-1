/**
 * localStorage layer for habits.
 * Schema v2 drops `reminder` and expands categories.
 */

import type { Habit } from './types'
import { SEED_HABITS } from './seed'

const KEY = 'momentum.habit-tracker.v2'
const LEGACY_KEY = 'momentum.habit-tracker.v1'

interface State {
  version: 2
  habits: Habit[]
  seeded: boolean
}

function empty(): State {
  return { version: 2, habits: [], seeded: false }
}

export function loadState(): State {
  try {
    // If an old v1 payload is around, drop it so the new schema can re-seed.
    if (localStorage.getItem(LEGACY_KEY)) {
      localStorage.removeItem(LEGACY_KEY)
    }
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as State
    if (parsed.version !== 2 || !Array.isArray(parsed.habits)) return empty()
    return parsed
  } catch {
    return empty()
  }
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

export function ensureSeed(): State {
  const state = loadState()
  if (!state.seeded || state.habits.length === 0) {
    return { ...state, habits: SEED_HABITS, seeded: true }
  }
  return state
}

export function upsertHabit(state: State, habit: Habit): State {
  const i = state.habits.findIndex((h) => h.id === habit.id)
  const habits =
    i === -1 ? [...state.habits, habit] : state.habits.map((h, idx) => (idx === i ? habit : h))
  return { ...state, habits }
}

export function deleteHabit(state: State, id: string): State {
  return { ...state, habits: state.habits.filter((h) => h.id !== id) }
}

export function toggleCompletion(state: State, id: string, iso: string): State {
  return {
    ...state,
    habits: state.habits.map((h) => {
      if (h.id !== id) return h
      const set = new Set(h.completedDates)
      if (set.has(iso)) set.delete(iso)
      else set.add(iso)
      return { ...h, completedDates: [...set] }
    }),
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}