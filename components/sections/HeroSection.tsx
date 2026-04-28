import { Church, ChevronDown } from 'lucide-react'

import Link from 'next/link'

import HeroSlider from '../interactive/HeroSlider'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Slides (client) */}
      <HeroSlider />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-[2] text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] font-bold leading-tight mb-4">
          Santuário de{' '}
          <span className="text-gold-bright">São José de Ribamar</span>
        </h1>
        <p className="font-lora text-[clamp(1rem,2.5vw,1.3rem)] text-white/90 mb-8 max-w-xl mx-auto">
          Um lugar sagrado de fé, esperança e encontro com Deus.
          <br />
          Venha orar, peregrinar e renovar sua vida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#horarios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
          >
            <Church size={18} />
            Horários das Missas
          </Link>
          <Link
            href="#sobre"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-white font-semibold rounded hover:bg-white hover:text-burgundy transition-colors"
          >
            Conheça o Santuário
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-1 text-white/70 text-xs">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
        <span>Role para baixo</span>
      </div>
    </section>
  )
}
