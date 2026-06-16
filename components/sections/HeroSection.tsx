import { Church } from 'lucide-react'

import Link from 'next/link'

import HeroSlider from '../interactive/HeroSlider'

type Slide = { src: string; srcMobile?: string; alt: string; position: string; positionMobile?: string }
type HeroData = { titulo: string; tituloDestaque: string; subtitulo: string }

const FALLBACK: HeroData = {
  titulo: 'Santuário de',
  tituloDestaque: 'São José de Ribamar',
  subtitulo: 'Um lugar sagrado de fé, esperança e encontro com Deus.\nVenha orar, peregrinar e renovar sua vida.',
}

export default function HeroSection({ hero, slides }: { hero: HeroData; slides: Slide[] }) {
  const titulo = hero.titulo || FALLBACK.titulo
  const tituloDestaque = hero.tituloDestaque || FALLBACK.tituloDestaque
  const subtitulo = hero.subtitulo || FALLBACK.subtitulo

  return (
    <section
      id="hero"
      className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Slides (client) */}
      <HeroSlider slides={slides} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="hero-content relative z-[2] text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] font-bold leading-tight mb-4">
          {titulo}{' '}
          <span className="text-gold-bright">{tituloDestaque}</span>
        </h1>
        <p className="font-lora text-[clamp(1rem,2.5vw,1.3rem)] text-white/90 mb-8 max-w-xl mx-auto whitespace-pre-line">
          {subtitulo}
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
    </section>
  )
}
