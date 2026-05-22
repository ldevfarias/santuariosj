 'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

const slides = [
  {
    src: '/img/sagrada_familia.avif',
    alt: 'Sagrada Família — Santuário de São José de Ribamar',
    position: 'object-[center_18%] md:object-[center_12%] lg:object-[center_10%]',
  },
  { src: '/img/foto_3.jpeg', alt: 'Igreja do Santuário', position: 'object-[center_20%]' },
]

const SLIDE_INTERVAL_MS = 6500
const TRANSITION_MS = 2200

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const prevClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(mediaQuery.matches)

    onChange()
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length
        // Schedule side effects outside the updater to comply with React purity requirements
        setTimeout(() => {
          setPrevIndex(prev)
          if (prevClearTimer.current) clearTimeout(prevClearTimer.current)
          prevClearTimer.current = setTimeout(() => setPrevIndex(null), TRANSITION_MS)
        }, 0)
        return next
      })
    }, SLIDE_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
      if (prevClearTimer.current) clearTimeout(prevClearTimer.current)
    }
  }, [])

  const transitionStyle = reduceMotion
    ? {}
    : { transitionDuration: `${TRANSITION_MS}ms`, transitionTimingFunction: 'ease-in-out' }

  return (
    <>
      {/* Slides */}
      {slides.map((slide, i) => {
        const isActive = i === activeIndex
        const isPrev = i === prevIndex

        if (!isActive && !isPrev) return null

        return (
          <div
            key={slide.src}
            style={{
              ...transitionStyle,
              // Active slide sits on top; previous stays beneath until fade completes
              zIndex: isActive ? 1 : 0,
            }}
            className={`absolute inset-0 transition-opacity will-change-[opacity] ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className={`object-cover ${slide.position}`}
              sizes="100vw"
            />
          </div>
        )
      })}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}: ${slide.alt}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            onClick={() => setActiveIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${i === activeIndex ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </>
  )
}
