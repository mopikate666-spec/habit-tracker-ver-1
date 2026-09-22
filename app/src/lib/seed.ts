import type { Habit } from './types'
import { subDays, format } from 'date-fns'

/** Deterministic pseudo-random so the seed always produces the same data. */
function seeded(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function isoDay(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

interface SeedSpec {
  id: string
  name: string
  sub: string
  icon: Habit['icon']
  category: Habit['category']
  frequency: Habit['frequency']
  rate: number
  seed: number
  days: number
}

const SPECS: SeedSpec[] = [
  {
    id: 'drink-water',
    name: 'Drink Water',
    sub: '6/8 glasses',
    icon: 'droplet',
    category: 'nutrition',
    frequency: 'daily',
    rate: 0.92,
    seed: 1,
    days: 120,
  },
  {
    id: 'read',
    name: 'Read',
    sub: '20 min done',
    icon: 'book',
    category: 'learning',
    frequency: 'daily',
    rate: 0.78,
    seed: 2,
    days: 248,
  },
  {
    id: 'meditation',
    name: 'Meditation',
    sub: '10 min session',
    icon: 'moon',
    category: 'mindful',
    frequency: 'daily',
    rate: 0.65,
    seed: 3,
    days: 180,
  },
  {
    id: 'no-phone',
    name: 'No Phone',
    sub: 'Until 12:00 PM',
    icon: 'phone-off',
    category: 'focus',
    frequency: 'weekdays',
    rate: 0.55,
    seed: 4,
    days: 90,
  },
  {
    id: 'stretch',
    name: 'Full Body Stretch',
    sub: 'Daily mobility',
    icon: 'runner',
    category: 'fitness',
    frequency: 'daily',
    rate: 0.7,
    seed: 5,
    days: 60,
  },
  {
    id: 'workout',
    name: 'Workout',
    sub: 'Leg Day',
    icon: 'dumbbell',
    category: 'fitness',
    frequency: 'weekly',
    rate: 0.4,
    seed: 6,
    days: 200,
  },
]

export const SEED_HABITS: Habit[] = SPECS.map((spec) => {
  const rand = seeded(spec.seed * 9999)
  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < spec.days; i++) {
    const d = subDays(today, i)
    if (rand() < spec.rate) {
      dates.push(isoDay(d))
    }
  }
  // Make sure today is NOT completed for a couple of habits so the UI shows the unchecked state.
  const forceOffToday = spec.id === 'workout'
  const forceOnToday = ['drink-water', 'read', 'stretch'].includes(spec.id)
  const todayStr = isoDay(today)
  let completedDates = dates
  if (forceOffToday) {
    completedDates = completedDates.filter((d) => d !== todayStr)
  }
  if (forceOnToday && !completedDates.includes(todayStr)) {
    completedDates = [...completedDates, todayStr]
  }
  return {
    id: spec.id,
    name: spec.name,
    sub: spec.sub,
    icon: spec.icon,
    category: spec.category,
    frequency: spec.frequency,
    completedDates,
    createdAt: isoDay(subDays(today, spec.days)),
  }
})