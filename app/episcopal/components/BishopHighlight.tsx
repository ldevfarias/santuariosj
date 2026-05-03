import Image from 'next/image'

import type { Sacerdote } from '@/lib/types'

import Ornament from '@/components/ui/Ornament'

type BishopHighlightProps = {
  bispo: Sacerdote
}

function getExcerpt(text: string, max = 520) {
  if (text.length <= max) return text
  const clipped = text.slice(0, max)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max)}...`
}

export default function BishopHighlight({ bispo }: BishopHighlightProps) {
  const shouldCollapse = bispo.bio.length > 520

  return (
    <div className="bg-burgundy-dk">
      <div className="container-site py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-3/4 rounded-xl overflow-hidden border-2 border-gold shadow-2xl bg-cream-dk">
              <Image
                src={bispo.foto}
                alt={`${bispo.titulo} ${bispo.nome}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 320px, 400px"
              />
              <div className="absolute inset-0 ring-1 ring-black/10 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            <span className="inline-block self-start px-4 py-1 text-xs font-body font-semibold uppercase tracking-widest text-gold border border-gold rounded-full">
              {bispo.cargo}
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight">
              {bispo.titulo} {bispo.nome}
            </h2>
            <Ornament light />
            {shouldCollapse ? (
              <details className="group bio-details max-w-2xl">
                <summary className="list-none cursor-pointer outline-none">
                  <div className="bio-content-wrapper">
                    <div className="bio-excerpt">
                      <p className="font-lora text-cream/90 leading-relaxed">
                        {getExcerpt(bispo.bio)}
                      </p>
                    </div>
                  </div>

                  <span className="mt-2 inline-flex items-center text-sm font-semibold text-gold-bright transition-colors group-hover:text-gold-light">
                    <span className="group-open:hidden">Ver mais</span>
                    <span className="hidden group-open:inline">Ver menos</span>
                  </span>
                </summary>

                <div className="bio-full">
                  <div className="bio-full-inner">
                    <p className="pt-4 mt-3 border-t border-gold/30 font-lora text-cream/90 leading-relaxed">
                      {bispo.bio}
                    </p>
                  </div>
                </div>
              </details>
            ) : (
              <p className="font-lora text-cream/90 leading-relaxed max-w-2xl">
                {bispo.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
