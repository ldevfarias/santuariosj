import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import Link from 'next/link'

import { getDevocoesPages } from '@/lib/data'

import Ornament from '../ui/Ornament'

export default function DevocoesSection() {
  const devocoes = getDevocoesPages()
  const featured = devocoes[0]
  const rest = devocoes.slice(1)

  if (!featured) return null

  return (
    <section id="devocoes" className="py-20 bg-cream">
      <div className="container-site">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <Ornament />
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy mb-3">
            Devoções Tradicionais
          </h2>
          <p className="text-text-soft max-w-xl mx-auto leading-relaxed">
            O Santuário mantém vivas as tradições devocionais que alimentam a fé do povo
            maranhense há séculos.
          </p>
        </div>

        {/* Artigo destaque */}
        <article className="reveal grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden border border-cream-dk shadow-md bg-white mb-8">
          <div className="lg:col-span-2 relative min-h-64 lg:min-h-full bg-cream-dk">
            <Image
              src={featured.imagemSrc}
              alt={featured.imagemAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
              Destaque
            </span>
            <h3 className="font-serif text-[clamp(1.5rem,3vw,2rem)] font-bold text-burgundy mb-3 leading-tight">
              {featured.titulo}
            </h3>
            <p className="font-lora text-base italic text-text-soft leading-relaxed mb-2">
              {featured.descricaoHero}
            </p>
            <p className="text-sm text-text-soft leading-relaxed mb-8">
              {featured.resumoArtigo}
            </p>
            <Link
              href={featured.href}
              className="self-start inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white text-sm font-semibold rounded hover:bg-burgundy-dk transition-colors"
            >
              Conhecer a Casa dos Milagres <ArrowRight size={15} />
            </Link>
          </div>
        </article>

        {/* Artigos secundários */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((devocao, i) => (
            <article
              key={devocao.slug}
              className="reveal group rounded-xl border border-cream-dk bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="w-8 h-0.5 bg-gold rounded-full" />
              <h3 className="font-serif text-xl font-bold text-burgundy group-hover:text-burgundy-dk transition-colors">
                {devocao.titulo}
              </h3>
              <p className="text-sm text-text-soft leading-relaxed flex-1">{devocao.descricaoHero}</p>
              <Link
                href={devocao.href}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
              >
                Saiba mais <ArrowRight size={13} />
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
