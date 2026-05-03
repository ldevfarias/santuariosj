import Image from 'next/image'
import Link from 'next/link'

import { getHistoria } from '@/lib/data'

import Ornament from '../ui/Ornament'

export default function SobreSection() {
  const historia = getHistoria()

  return (
    <section id="sobre" className="py-20 bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative reveal-left">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-3/4">
              <Image
                src="/img/santuario_historia.avif"
                alt="Santuário de São José de Ribamar"
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="absolute top-0 right-4 -translate-y-1/2 bg-burgundy text-white rounded-xl px-5 py-3 flex items-center gap-2 shadow-lg">
              <Image
                src="/img/logo_sj-removebg-preview.png"
                alt="Logo do Santuário"
                width={30}
                height={30}
                className="w-7 h-7 object-contain"
                loading="lazy"
              />
              <span className="font-serif text-sm font-bold">Desde 1615</span>
            </div>
          </div>

          {/* Content */}
          <div id="historia" className="flex flex-col gap-5 reveal-right">
            <Ornament />
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy">
                História do Santuário
              </h2>
              <p className="font-lora text-base text-text-soft leading-relaxed">{historia.lenda}</p>
            </div>

            {/* Linha do tempo */}
            <div className="rounded-2xl border border-cream-dk bg-white px-6 py-5 shadow-sm">
              <div className="relative flex flex-col gap-0 pl-6">
                {/* trilho vertical */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />

                {historia.marcos.map((marco, i) => (
                  <div key={marco.ano} className={`relative flex gap-4 ${i < historia.marcos.length - 1 ? 'pb-6' : ''}`}>
                    {/* ponto */}
                    <div className="absolute -left-6 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-gold bg-cream">
                      <div className="h-2 w-2 rounded-full bg-burgundy" />
                    </div>

                    {/* conteúdo */}
                    <div>
                      <span className="font-serif text-xs font-bold text-gold tracking-widest uppercase">
                        {marco.ano}
                      </span>
                      <p className="font-serif text-sm font-semibold text-burgundy mt-0.5">{marco.titulo}</p>
                      <p className="font-body text-sm text-text-soft leading-snug mt-0.5">{marco.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="#devocoes"
              className="mt-1 inline-flex items-center gap-2 self-start rounded px-6 py-3 bg-burgundy text-white font-semibold hover:bg-burgundy-dk transition-colors"
            >
              Devoções ao Santo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
