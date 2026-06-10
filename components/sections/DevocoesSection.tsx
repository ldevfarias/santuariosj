import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getDevocoesPages } from '@/lib/data'

import Ornament from '../ui/Ornament'

export default function DevocoesSection() {
  const devocoes = getDevocoesPages().filter((d) => d.slug !== 'ex-voto-museum')

  if (devocoes.length === 0) return null

  const cardImage = (slug: string, src: string) =>
    slug === 'house-of-candles' ? '/img/devota.png' : src

  return (
    <section id="devocoes" className="py-20 bg-burgundy-dk">
      <div className="container-site">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <Ornament light />
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-gold mb-3">
            Devoções Tradicionais
          </h2>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
            O Santuário mantém vivas as tradições devocionais que alimentam a fé do povo
            maranhense há séculos.
          </p>
        </div>

        {/* Cards full-bleed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devocoes.map((devocao) => (
            <article
              key={devocao.slug}
              className="reveal group relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-end"
            >
              {/* Foto de fundo */}
              <Image
                src={cardImage(devocao.slug, devocao.imagemSrc)}
                alt={devocao.imagemAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Conteúdo */}
              <div className="relative z-10 p-8">
                <span className="block text-xs font-semibold tracking-widest uppercase text-gold mb-3">
                  {devocao.slug === 'house-of-miracles' ? 'Lugar de Memória e Fé' : 'Oração e Entrega'}
                </span>
                <h3 className="font-serif text-[clamp(1.4rem,3vw,1.9rem)] font-bold text-white mb-3 leading-tight">
                  {devocao.titulo}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-5 max-w-sm">
                  {devocao.descricaoHero}
                </p>
                <Link
                  href={devocao.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright transition-colors"
                >
                  Conhecer <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
