export type CategoryId =
  | 'health'
  | 'mind'
  | 'focus'
  | 'body'
  | 'sleep'
  | 'fitness'
  | 'learning'
  | 'creativity'
  | 'nutrition'
  | 'social'
  | 'outdoors'
  | 'mindful'

export type IconId =
  // Quick-pick row (4) + 5th "more" tile
  | 'leaf'
  | 'coffee'
  | 'bed'
  | 'dumbbell'
  // Full library
  | 'moon'
  | 'book'
  | 'star'
  | 'heart'
  | 'books'
  | 'runner'
  | 'apple'
  | 'droplet'
  | 'flame'
  | 'sun'
  | 'cloud'
  | 'music'
  | 'pencil'
  | 'palette'
  | 'camera'
  | 'headphones'
  | 'mic'
  | 'message'
  | 'users'
  | 'phone-off'
  | 'smile'
  | 'briefcase'
  | 'wallet'
  | 'piggy'
  | 'compass'
  | 'map'
  | 'tree'
  | 'flower'
  | 'bike'

export interface Habit {
  id: string
  name: string
  sub: string
  icon: IconId
  category: CategoryId
  frequency: 'daily' | 'weekdays' | 'weekly'
  /** ISO date strings (YYYY-MM-DD) when habit was completed */
  completedDates: string[]
  createdAt: string
}

export interface CategoryDef {
  id: CategoryId
  label: string
  /** bg of swatch (raw hex) */
  bg: string
  /** text/accent */
  fg: string
}

/** 12 saturated but tasteful swatches. */
export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  health:     { id: 'health',     label: 'Health',     bg: '#C7DC8B', fg: '#3F4631' },
  mind:       { id: 'mind',       label: 'Mind',       bg: '#F5D5BD', fg: '#6B4A2B' },
  focus:      { id: 'focus',      label: 'Focus',      bg: '#C6DEEC', fg: '#1F3D52' },
  body:       { id: 'body',       label: 'Body',       bg: '#E3D4F1', fg: '#5A3F73' },
  sleep:      { id: 'sleep',      label: 'Sleep',      bg: '#B8B5D9', fg: '#2E2B5A' },
  fitness:    { id: 'fitness',    label: 'Fitness',    bg: '#F4A3A3', fg: '#6B1F1F' },
  learning:   { id: 'learning',   label: 'Learning',   bg: '#F6D86A', fg: '#5A4400' },
  creativity: { id: 'creativity', label: 'Creativity', bg: '#F9B6C2', fg: '#7A2542' },
  nutrition:  { id: 'nutrition',  label: 'Nutrition',  bg: '#A8D4B0', fg: '#1F4D2C' },
  social:     { id: 'social',     label: 'Social',     bg: '#FFD58A', fg: '#6B4500' },
  outdoors:   { id: 'outdoors',   label: 'Outdoors',   bg: '#9DC9B2', fg: '#1F4A36' },
  mindful:    { id: 'mindful',    label: 'Mindful',    bg: '#D7C4B0', fg: '#4A3520' },
}

export interface IconDef {
  id: IconId
  label: string
}

/** First 4 shown in the inline picker. */
export const ICONS_QUICK: IconDef[] = [
  { id: 'leaf', label: 'Wellness' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'bed', label: 'Sleep' },
  { id: 'dumbbell', label: 'Strength' },
]

/** Full library opened from the 5th "more" tile. */
export const ICONS_FULL: IconDef[] = [
  ...ICONS_QUICK,
  { id: 'moon', label: 'Evening' },
  { id: 'book', label: 'Reading' },
  { id: 'star', label: 'Focus' },
  { id: 'heart', label: 'Cardio' },
  { id: 'books', label: 'Study' },
  { id: 'runner', label: 'Run' },
  { id: 'apple', label: 'Nutrition' },
  { id: 'droplet', label: 'Hydrate' },
  { id: 'flame', label: 'Streak' },
  { id: 'sun', label: 'Morning' },
  { id: 'cloud', label: 'Breath' },
  { id: 'music', label: 'Music' },
  { id: 'pencil', label: 'Write' },
  { id: 'palette', label: 'Create' },
  { id: 'camera', label: 'Photo' },
  { id: 'headphones', label: 'Listen' },
  { id: 'mic', label: 'Speak' },
  { id: 'message', label: 'Talk' },
  { id: 'users', label: 'Social' },
  { id: 'phone-off', label: 'Unplug' },
  { id: 'smile', label: 'Mood' },
  { id: 'briefcase', label: 'Work' },
  { id: 'wallet', label: 'Budget' },
  { id: 'piggy', label: 'Save' },
  { id: 'compass', label: 'Explore' },
  { id: 'map', label: 'Travel' },
  { id: 'tree', label: 'Nature' },
  { id: 'flower', label: 'Garden' },
  { id: 'bike', label: 'Ride' },
]