import { Info, MapPin } from 'lucide-react'
import Image from 'next/image'

import type { Missa } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface MissasSectionProps {
  missas: Missa[]
}

function getDiaSubtitle(dia: string): string {
  if (dia.toLowerCase().includes('sábado')) return 'Celebrações de peregrinação'
  if (dia.toLowerCase().includes('domingo')) return 'Dia do Senhor'
  return 'Celebrações semanais'
}

export default function MissasSection({ missas }: MissasSectionProps) {
  return (
    <section id="horarios" className="py-20 bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Horários das Missas"
          subtitle="Venha participar da Eucaristia e encontrar-se com Jesus"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {missas.map((missa, i) => (
            <div
              key={missa.dia}
              className={`reveal relative rounded-2xl p-7 sm:p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${missa.destaque
                ? 'bg-burgundy text-white ring-1 ring-gold/35'
                : 'bg-white text-text'
                }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {missa.destaque ? (
                <span className="absolute right-4 top-4 rounded-full border border-gold/35 bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-bright">
                  Destaque
                </span>
              ) : null}

              <div
                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ring-2 ${missa.destaque ? 'bg-white/20 ring-gold/35'
                  : 'bg-burgundy/10 ring-gold/30'
                  }`}
              >
                <Image
                  src="/img/logo_sj-removebg-preview.png"
                  alt="Logo do Santuário"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="mb-4 text-center">
                <h3
                  className={`font-serif text-[1.95rem] font-bold leading-tight ${missa.destaque ? 'text-white' : 'text-burgundy'
                    }`}
                >
                  {missa.dia}
                </h3>
                <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${missa.destaque ? 'text-gold-pale/85' : 'text-text-soft/75'}`}>
                  {getDiaSubtitle(missa.dia)}
                </p>
              </div>

              <ul className={`mt-2 space-y-2.5 ${missa.destaque ? 'divide-y divide-white/15' : 'divide-y divide-burgundy/10'}`}>
                {missa.horarios.map((h) => (
                  <li
                    key={h.hora}
                    className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm ${missa.destaque ? 'border-white/15 bg-white/10 text-white/90'
                      : 'border-cream-dk bg-cream/65 text-text-soft'
                      }`}
                  >
                    <span
                      className={`font-bold ${missa.destaque ? 'text-gold-bright' : 'text-burgundy'
                        }`}
                    >
                      {h.hora}
                    </span>
                    <span>{h.desc}</span>
                  </li>
                ))}
              </ul>

              {missa.programacaoSemanal && missa.programacaoSemanal.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {missa.programacaoSemanal.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${missa.destaque ? 'text-white/80' : 'text-text-soft'}`}
                    >
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {missa.observacao && (
                <div
                  className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${missa.destaque
                    ? 'border-white/20 bg-white/10 text-white/80'
                    : 'border-gold/25 bg-gold/5 text-text-soft'
                    }`}
                >
                  <Info
                    size={14}
                    className={`mt-0.5 shrink-0 ${missa.destaque ? 'text-gold-bright' : 'text-gold'}`}
                  />
                  <p className="text-xs">{missa.observacao}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://maps.google.com/?q=-2.5655,-44.0588"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-burgundy/25 bg-white px-5 py-2.5 text-sm font-semibold text-burgundy shadow-sm transition-all hover:border-gold/50 hover:bg-cream hover:text-gold hover:shadow-md"
          >
            <MapPin size={16} className="text-gold" />
            Como chegar ao Santuário
          </a>
        </div>
      </div>
    </section>
  )
}
