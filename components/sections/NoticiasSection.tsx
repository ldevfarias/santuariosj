'use client'

import { useState } from 'react'

import { ArrowRight, Calendar } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import type { Noticia } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'


interface NoticiasSectionProps {
  noticias: Noticia[]
}

function NoticiaCard({ noticia, index }: { noticia: Noticia; index: number }) {
  return (
    <article
      className={`reveal bg-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${noticia.destaque ? 'md:col-span-1 md:row-span-1' : ''}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={noticia.imagem}
          alt={noticia.titulo}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-burgundy text-white text-xs font-semibold px-3 py-1 rounded-full">
          {noticia.categoria}
        </span>
      </div>
      <div className="p-5">
        <span className="flex items-center gap-1.5 text-xs text-text-soft mb-2">
          <Calendar size={12} />
          {noticia.data}
        </span>
        <h3 className="font-serif text-base font-bold text-burgundy mb-2 leading-snug">
          {noticia.titulo}
        </h3>
        <p className="text-sm text-text-soft mb-4 leading-relaxed">{noticia.resumo}</p>
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:gap-2.5 transition-all"
        >
          Leia mais <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}

export default function NoticiasSection({ noticias }: NoticiasSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const visiveis = noticias.slice(0, 3)
  const extras = noticias.slice(3)

  return (
    <section id="noticias" className="py-20 bg-white">
      <div className="container-site">
        <SectionHeader
          title="Notícias"
          subtitle="Fique por dentro das novidades do Santuário"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiveis.map((noticia, i) => (
            <NoticiaCard key={noticia.id} noticia={noticia} index={i} />
          ))}
        </div>

        {extras.length > 0 && (
          <div
            id="extras-noticias"
            aria-hidden={!expanded}
            {...(!expanded ? { inert: true } : {})}
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {extras.map((noticia, i) => (
              <NoticiaCard key={noticia.id} noticia={noticia} index={i} />
            ))}
          </div>
        )}

        {extras.length > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-controls="extras-noticias"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-burgundy text-burgundy font-semibold rounded hover:bg-burgundy hover:text-white transition-colors"
            >
              {expanded ? 'Ver menos' : 'Ver todas as notícias'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
