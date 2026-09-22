import { useEffect, useState } from 'react'

/** Returns `now` and re-renders every `intervalMs` ms. */
export function useClock(intervalMs: number = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}