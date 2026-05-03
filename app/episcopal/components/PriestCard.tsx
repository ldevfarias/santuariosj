import Image from 'next/image'

import type { Sacerdote } from '@/lib/types'

function getExcerpt(text: string, max = 280) {
  if (text.length <= max) return text
  const clipped = text.slice(0, max)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max)}...`
}

type PriestCardProps = {
  padre: Sacerdote
}

export default function PriestCard({ padre }: PriestCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-3/4 w-full bg-cream-dk">
        <Image
          src={padre.foto}
          alt={`${padre.titulo} ${padre.nome}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 ring-1 ring-black/10 pointer-events-none" />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-0.5 text-xs font-body font-semibold uppercase tracking-wider text-white bg-burgundy rounded mb-3">
          {padre.cargo}
        </span>
        <h3 className="font-serif text-xl font-bold text-text mb-2">
          {padre.titulo} {padre.nome}
        </h3>
        <div className="w-12 border-b border-gold mb-4" />
        <details className="group bio-details">
          <summary className="list-none cursor-pointer outline-none">
            <div className="bio-content-wrapper">
              <div className="bio-excerpt">
                <p className="font-body text-sm text-text-soft leading-relaxed">
                  {getExcerpt(padre.bio)}
                </p>
              </div>
            </div>

            <span className="mt-2 inline-flex items-center text-sm font-semibold text-burgundy transition-colors group-hover:text-burgundy-dk">
              <span className="group-open:hidden">Ver mais</span>
              <span className="hidden group-open:inline">Ver menos</span>
            </span>
          </summary>

          <div className="bio-full">
            <div className="bio-full-inner">
              <p className="pt-4 font-body text-sm text-text-soft leading-relaxed border-t border-cream-dk mt-3">
                {padre.bio}
              </p>
            </div>
          </div>
        </details>
      </div>
    </article>
  )
}
