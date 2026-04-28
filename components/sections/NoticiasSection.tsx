import { Calendar, ArrowRight } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import type { Noticia } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface NoticiasSectionProps {
  noticias: Noticia[]
}

export default function NoticiasSection({ noticias }: NoticiasSectionProps) {
  return (
    <section id="noticias" className="py-20 bg-white">
      <div className="container-site">
        <SectionHeader
          title="Notícias"
          subtitle="Fique por dentro das novidades do Santuário"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className={`bg-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${
                noticia.destaque ? 'md:col-span-1 md:row-span-1' : ''
              }`}
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
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-burgundy text-burgundy font-semibold rounded hover:bg-burgundy hover:text-white transition-colors"
          >
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  )
}
