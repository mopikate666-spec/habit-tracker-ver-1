import { useEffect, useRef } from 'react'

interface SwipeOptions {
  /** Minimum horizontal distance (px) before it counts as a swipe. Default 60. */
  threshold?: number
  /** Swipe right (deltaX > 0) — e.g. previous tab. */
  onSwipeRight?: () => void
  /** Swipe left (deltaX < 0) — e.g. next tab. */
  onSwipeLeft?: () => void
}

/**
 * Attaches touch listeners to `ref.current`. Fires onSwipeLeft/Right when
 * a horizontal swipe exceeds the threshold and the gesture is mostly
 * horizontal (not a vertical scroll).
 */
export function useSwipe<T extends HTMLElement>(
  { threshold = 60, onSwipeLeft, onSwipeRight }: SwipeOptions,
  enabled: boolean = true,
) {
  const ref = useRef<T | null>(null)
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const locked = useRef<'h' | 'v' | null>(null)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      startX.current = t.clientX
      startY.current = t.clientY
      locked.current = null
    }
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (startX.current == null || startY.current == null) return
      if (locked.current) return
      const dx = t.clientX - startX.current
      const dy = t.clientY - startY.current
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        locked.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }
    }
    const onEnd = (e: TouchEvent) => {
      if (startX.current == null || startY.current == null) return
      const t = e.changedTouches[0]
      if (!t) return
      const dx = t.clientX - startX.current
      const dy = t.clientY - startY.current
      // Only fire if gesture was mostly horizontal
      if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) onSwipeLeft?.()
        else onSwipeRight?.()
      }
      startX.current = null
      startY.current = null
      locked.current = null
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [enabled, threshold, onSwipeLeft, onSwipeRight])

  return ref
}