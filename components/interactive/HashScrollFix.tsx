'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const FALLBACK_HEADER_OFFSET = 92

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function getTargetScrollY(el: HTMLElement) {
  const header = document.getElementById('site-header')
  const headerOffset = header ? header.getBoundingClientRect().height + 12 : FALLBACK_HEADER_OFFSET
  const target = el.getBoundingClientRect().top + window.scrollY - headerOffset
  return Math.max(0, target)
}

/**
 * Força scroll suave para âncoras internas mesmo quando o hash já está na URL.
 * Intercepta href="#id" (mesma página) e href="/#id" quando já está na home,
 * evitando que o browser adicione o hash à URL atual em vez de navegar.
 */
export default function HashScrollFix() {
  const pathname = usePathname()
  const router = useRouter()
  const animationFrameRef = useRef<number | null>(null)

  const smoothScrollTo = (el: HTMLElement) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, getTargetScrollY(el))
      return
    }

    const startY = window.scrollY
    const targetY = getTargetScrollY(el)
    const distance = Math.abs(targetY - startY)
    if (distance < 4) return

    const duration = Math.min(900, Math.max(520, distance * 0.55))
    let startTime: number | null = null

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(progress)
      const nextY = startY + (targetY - startY) * eased
      window.scrollTo(0, nextY)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step)
      } else {
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    if (pathname !== '/') return

    const pending = sessionStorage.getItem('pending-hash-scroll')
    const hashFromUrl = window.location.hash.replace('#', '')
    const id = pending || hashFromUrl
    if (!id) return

    const run = () => {
      const el = document.getElementById(id)
      if (!el) return
      smoothScrollTo(el)
      history.replaceState(null, '', `#${id}`)
      if (pending) sessionStorage.removeItem('pending-hash-scroll')
    }

    requestAnimationFrame(() => requestAnimationFrame(run))
  }, [pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      let id: string | null = null

      if (href.startsWith('#')) {
        id = href.slice(1)
        if (pathname !== '/') {
          if (!id) return
          e.preventDefault()
          sessionStorage.setItem('pending-hash-scroll', id)
          router.push('/')
          return
        }
      } else if (href.startsWith('/#') && pathname === '/') {
        id = href.slice(2)
      } else if (href.startsWith('/#') && pathname !== '/') {
        id = href.slice(2)
        if (!id) return
        e.preventDefault()
        sessionStorage.setItem('pending-hash-scroll', id)
        router.push('/')
        return
      }

      if (!id) return
      const el = document.getElementById(id)
      if (!el) return

      e.preventDefault()
      smoothScrollTo(el)
      history.replaceState(null, '', `#${id}`)
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname, router])

  useEffect(
    () => () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    },
    []
  )

  return null
}
