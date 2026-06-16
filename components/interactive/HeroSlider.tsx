'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Slide = { src: string; srcMobile?: string; alt: string; position: string; positionMobile?: string }

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5500)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  return (
    <>
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 hero-slide ${i === current ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {slide.srcMobile && (
            <Image
              src={slide.srcMobile}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover block md:hidden"
              style={{ objectPosition: slide.positionMobile ?? slide.position }}
              sizes="100vw"
            />
          )}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0 && !slide.srcMobile}
            className={`object-cover ${slide.srcMobile ? 'hidden md:block' : ''}`}
            style={{ objectPosition: slide.position }}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => {
              goTo(i)
              resetTimer()
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </>
  )
}
