import Image from 'next/image'

const slides = [
  { src: '/img/sagrada_familia.avif', alt: 'Sagrada Família — Santuário de São José de Ribamar', position: 'object-center' },
  { src: '/img/foto_3.jpeg', alt: 'Igreja do Santuário', position: 'object-[center_20%]' },
]

export default function HeroSlider() {
  return (
    <>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide absolute inset-0 ${i === 0 ? 'hero-slide-a' : 'hero-slide-b'}`}
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
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </>
  )
}
