import { ArrowLeft, Clock3, MapPin, Navigation } from 'lucide-react'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getComunidades } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'

export const metadata: Metadata = {
  title: 'Comunidades',
  description:
    'Conheca as comunidades vinculadas ao Santuário de São Jose de Ribamar, com seus bairros, horarios de celebracao e localizacao.',
}

export default async function ComunidadesPage() {
  const comunidades = await getComunidades()

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-burgundy py-6 sm:py-8">
        <div className="container-site flex flex-col gap-2 text-center sm:gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gold-bright/80 transition-colors hover:text-gold-bright"
          >
            <ArrowLeft size={15} />
            Início
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Ornament light />
            <h1 className="font-serif text-[clamp(1.75rem,4.4vw,2.8rem)] font-bold text-white">
              Comunidades
            </h1>
            <p className="max-w-2xl font-lora text-sm leading-relaxed text-gold-bright/90 sm:text-base">
              Espaços de oração, encontro e celebração que prolongam a vida pastoral do Santuário
              nas comunidades.
            </p>
          </div>
        </div>
      </div>

      <section className="container-site py-8 sm:py-10">
        <div className="mb-8 text-center reveal sm:mb-10">
          <Ornament />
          <h2 className="font-serif text-[clamp(1.7rem,4vw,2.7rem)] font-bold leading-tight text-burgundy">
            Comunidades do Santuário
          </h2>
          <p className="mx-auto mt-2 max-w-3xl font-lora text-base text-text-soft sm:text-lg">
            Cada comunidade apresenta seu endereço, horário de celebração e acesso rápido ao mapa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {comunidades.map((comunidade, index) => (
            <article
              key={comunidade.id}
              className="reveal overflow-hidden rounded-[1.75rem] border border-cream-dk bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-16/9 w-full overflow-hidden">
                <Image
                  src={comunidade.imagem}
                  alt={comunidade.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  priority={index < 2}
                />
              </div>

              <div className="p-6 sm:p-7">
                <span className="inline-flex rounded-full bg-burgundy px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Comunidade
                </span>

                <h2 className="mt-4 font-serif text-[clamp(1.5rem,2.7vw,2rem)] font-bold text-burgundy">
                  {comunidade.nome}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-text-soft">
                  <p className="flex items-start gap-3 leading-relaxed">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold text-text">Endereço:</strong> {comunidade.endereco}
                    </span>
                  </p>
                  <p className="flex items-start gap-3 leading-relaxed">
                    <Clock3 size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold text-text">Celebrações:</strong>{' '}
                      {comunidade.celebracoes}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={comunidade.mapaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-burgundy px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-burgundy-dk"
                  >
                    Ver no mapa
                    <Navigation size={16} />
                  </a>
                  <span className="text-xs uppercase tracking-[0.16em] text-text-soft">
                    Santuário de São Jose de Ribamar
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}