'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>(
    '.reveal, .reveal-left, .reveal-right'
  )
  if (!els.length) return null

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -56px 0px' }
  )

  els.forEach((el) => {
    if (el.classList.contains('visible')) return
    observer.observe(el)
  })

  return observer
}

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    const frame = requestAnimationFrame(() => {
      observer = initReveal()
    })

    // Reinitialize when page is restored from bfcache (back/forward navigation)
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        observer?.disconnect()
        observer = initReveal()
      }
    }
    window.addEventListener('pageshow', onPageShow)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [pathname])

  return null
}
