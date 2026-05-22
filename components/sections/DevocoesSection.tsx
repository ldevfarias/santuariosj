import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import Link from 'next/link'

import { getDevocoesPages } from '@/lib/data'

import Ornament from '../ui/Ornament'

const CANDLES_IMAGE = '/img/devocao.png'

export default function DevocoesSection() {
  const devocoes = getDevocoesPages()
  const casaMilagres = devocoes.find((d) => d.slug === 'house-of-miracles')
  const casaVelas = devocoes.find((d) => d.slug === 'house-of-candles')

  return (
    <section id="devocoes" className="py-14 bg-burgundy-dk">
      <div className="container-site">
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <Ornament />
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-gold-bright mb-3">
            Devoções Tradicionais
          </h2>
          <p className="text-cream/70 max-w-xl mx-auto leading-relaxed">
            O Santuário mantém vivas as tradições devocionais que alimentam a fé do povo
            maranhense há séculos.
          </p>
        </div>

        {/* Dois cards fotográficos side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Card — Casa dos Milagres */}
          {casaMilagres && (
            <article className="reveal group relative rounded-xl overflow-hidden aspect-3/2 md:aspect-auto md:min-h-85 shadow-lg">
              <Image
                src={casaMilagres.imagemSrc}
                alt={casaMilagres.imagemAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradiente de baixo para cima */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Conteúdo âncora no rodapé */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold">
                  Lugar de Memória e Fé
                </span>
                <h3 className="font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-bold text-white leading-tight">
                  {casaMilagres.titulo}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                  {casaMilagres.descricaoHero}
                </p>
                <Link
                  href={casaMilagres.href}
                  className="mt-1 self-start inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-bright transition-colors group/link"
                >
                  Conhecer
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          )}

          {/* Card — Casa das Velas */}
          {casaVelas && (
            <article className="reveal group relative rounded-xl overflow-hidden aspect-3/2 md:aspect-auto md:min-h-85 shadow-lg">
              <Image
                src={CANDLES_IMAGE}
                alt={casaVelas.imagemAlt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradiente quente — azul-burgundy de baixo */}
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dk/90 via-black/25 to-transparent" />

              {/* Conteúdo âncora no rodapé */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold">
                  Oração e Entrega
                </span>
                <h3 className="font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-bold text-white leading-tight">
                  {casaVelas.titulo}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                  {casaVelas.descricaoHero}
                </p>
                <Link
                  href={casaVelas.href}
                  className="mt-1 self-start inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-bright transition-colors group/link"
                >
                  Conhecer
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          )}

        </div>
      </div>
    </section>
  )
}
