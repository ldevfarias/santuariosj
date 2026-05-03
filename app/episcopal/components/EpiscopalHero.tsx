import { ArrowLeft } from 'lucide-react'

import Link from 'next/link'

import Ornament from '@/components/ui/Ornament'

export default function EpiscopalHero() {
  return (
    <div className="bg-burgundy py-6 md:py-8">
      <div className="container-site flex flex-col items-center text-center gap-1.5 md:gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gold-bright/80 hover:text-gold-bright font-semibold transition-colors self-start"
        >
          <ArrowLeft size={15} />
          Início
        </Link>
        <div className="hidden sm:block">
          <Ornament light />
        </div>
        <h1 className="font-serif text-[clamp(1.6rem,3.8vw,2.4rem)] font-bold text-white leading-tight">
          Corpo Episcopal
        </h1>
        <p className="font-lora italic text-gold-bright/90 text-sm md:text-[0.95rem] max-w-xl leading-snug">
          Conheça os sacerdotes que pastoreiam o Santuário de São José de Ribamar
        </p>
      </div>
    </div>
  )
}
