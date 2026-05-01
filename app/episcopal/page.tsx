import type { Metadata } from 'next'
import Image from 'next/image'

import { getSacerdotes } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Corpo Episcopal | Santuário de São José de Ribamar',
  description: 'Conheça o bispo e os padres que pastoreiam o Santuário de São José de Ribamar.',
}

export default function EpiscopalPage() {
  const sacerdotes = getSacerdotes()
  const bispo = sacerdotes.find((s) => s.bispo)
  const padres = sacerdotes.filter((s) => !s.bispo)

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero strip */}
      <div className="bg-burgundy py-16">
        <div className="container-site flex flex-col items-center text-center gap-3">
          <Ornament light />
          <h1 className="font-serif text-[clamp(2rem,5vw,3.2rem)] font-bold text-white">
            Corpo Episcopal
          </h1>
          <p className="font-lora italic text-gold-bright/90 text-lg max-w-xl leading-relaxed">
            Conheça os sacerdotes que pastoreiam o Santuário de São José de Ribamar
          </p>
        </div>
      </div>

      {/* Bishop highlight */}
      {bispo && (
        <div className="bg-burgundy-dk">
          <div className="container-site py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden border-2 border-gold shadow-2xl">
                  <Image
                    src={bispo.foto}
                    alt={`${bispo.titulo} ${bispo.nome}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 320px, 400px"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="inline-block self-start px-4 py-1 text-xs font-body font-semibold uppercase tracking-widest text-gold border border-gold rounded-full">
                  {bispo.cargo}
                </span>
                <h2 className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight">
                  {bispo.titulo} {bispo.nome}
                </h2>
                <Ornament light />
                <p className="font-lora text-cream/90 leading-relaxed">
                  {bispo.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priests grid */}
      <div className="container-site py-16">
        <SectionHeader title="Nossos Padres" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {padres.map((padre) => (
            <article
              key={padre.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={padre.foto}
                  alt={`${padre.titulo} ${padre.nome}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-0.5 text-xs font-body font-semibold uppercase tracking-wider text-white bg-burgundy rounded mb-3">
                  {padre.cargo}
                </span>
                <h3 className="font-serif text-xl font-bold text-text mb-2">
                  {padre.titulo} {padre.nome}
                </h3>
                <div className="w-12 border-b border-gold mb-4" />
                <p className="font-body text-sm text-text-soft leading-relaxed">
                  {padre.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
