import { Church } from 'lucide-react'

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
      <div className="hero-content relative z-[2] text-center text-white px-6 max-w-2xl mx-auto w-full mt-12 sm:mt-0">
        <h1 className="font-serif text-[clamp(1.85rem,6vw,4rem)] font-bold leading-tight mb-4">
          Santuário São José{' '}
          <span className="text-gold-bright">de Ribamar</span>
        </h1>

        {/* Separador dourado */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block h-px w-10 bg-gold/60" />
          <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="block h-px w-10 bg-gold/60" />
        </div>

        <p className="font-lora text-[clamp(0.95rem,2.5vw,1.2rem)] text-white/85 mb-8 max-w-sm mx-auto leading-relaxed">
          Um lugar de fé, esperança e encontro com Deus. Venha orar e fortalecer sua fé.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#horarios"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors w-full sm:w-auto"
          >
            <Church size={18} />
            Horários das Missas
          </Link>
          <Link
            href="#sobre"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent text-white border-2 border-white/70 font-semibold rounded hover:bg-white hover:text-burgundy transition-colors w-full sm:w-auto"
          >
            Conheça o Santuário
          </Link>
        </div>
      </div>
    </section>
  )
}
