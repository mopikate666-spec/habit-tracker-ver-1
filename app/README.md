# Momentum · Habit Tracker

A warm, mobile-first habit tracker built with React + Vite + Tailwind. Designed to deploy as a static site on Vercel.

## Features

- **Today screen** — personalized greeting, day-streak hero with heatmap, today's habit list with one-tap logging
- **Habit detail** — annual momentum matrix, current & best streak, weekly activity bar chart, "Log Habit Now" CTA
- **New Habit modal** — slide-up sheet with quick-pick icons (4 + "More" tile opens a full library of 28 icons), 12 saturated category swatches, frequency
- **localStorage persistence** — data lives in the user's browser, no backend needed
- **Restrained motion** — sheets slide, checkboxes pop, stats fade-in stagger; respects reduced-motion users

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS 3 (custom palette: olive page, cream cards, sage accent)
- Motion (`motion/react`) for animations
- lucide-react for icons
- date-fns for date math

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # builds to dist/
npm run preview  # serves dist/ locally
```

## Deploying to Vercel

The `vercel.json` is preconfigured:

- Framework: **Vite** (auto-detected)
- Build command: `npm run build`
- Output: `dist/`
- SPA rewrites enabled (any unknown path → `/index.html`)

Three ways to deploy:

1. **Git integration** — push to GitHub, import on vercel.com
2. **CLI** — `vercel` from this directory
3. **Drag & drop** — `npm run build`, then drag `dist/` onto vercel.com

## Project structure

```
src/
  main.tsx              Entry
  App.tsx               Shell + routing (Today ↔ Detail)
  index.css             Tailwind + Geist + tokens
  components/           TodayScreen, HabitDetailScreen, NewHabitModal,
                        HabitRow, StreakCard, DotGrid, ActivityMatrix,
                        WeeklyBars, IconPicker, CategoryPicker, BottomNav
  hooks/
    useHabits.ts        CRUD against localStorage
    useClock.ts         Re-renders for time-of-day greeting
  lib/
    types.ts            Domain types & category/icon metadata
    storage.ts          localStorage layer + seed
    seed.ts             Deterministic fake history (6 habits, up to 248 days)
    date.ts             Streaks, heatmap, weekly activity helpers
    icons.ts            IconId → lucide component map
```

## Design tokens

- Page bg: `#3F4631` (warm olive)
- Card surface: `#FBF7EF` (cream)
- Accent: `#C7DC8B` → `#A8C76A` (sage/lime)
- Category pastels: sage, peach `#F5D5BD`, powder `#C6DEEC`, lilac `#E3D4F1`
- Type: **Geist** (display + UI), tabular numerals on stats

## Resetting demo data

Open DevTools → Application → Local Storage → delete `momentum.habit-tracker.v1`. Reload — the seed will re-populate.