import * as Icons from 'lucide-react'

import type { Missa } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface MissasSectionProps {
  missas: Missa[]
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon || typeof Icon !== 'function') return null
  return <Icon size={size} />
}

export default function MissasSection({ missas }: MissasSectionProps) {
  return (
    <section id="horarios" className="py-20 bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Horários das Missas"
          subtitle="Venha participar da Eucaristia e encontrar-se com Jesus"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missas.map((missa) => (
            <div
              key={missa.dia}
              className={`rounded-xl p-8 text-center shadow-md transition-transform hover:-translate-y-1 ${
                missa.destaque
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-text'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  missa.destaque ? 'bg-white/20 text-gold-bright' : 'bg-burgundy/10 text-burgundy'
                }`}
              >
                <DynamicIcon name={missa.icone} size={28} />
              </div>
              <h3
                className={`font-serif text-xl font-bold mb-4 ${
                  missa.destaque ? 'text-white' : 'text-burgundy'
                }`}
              >
                {missa.dia}
              </h3>
              <ul className="space-y-2">
                {missa.horarios.map((h) => (
                  <li
                    key={h.hora}
                    className={`flex items-center justify-between text-sm ${
                      missa.destaque ? 'text-white/90' : 'text-text-soft'
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        missa.destaque ? 'text-gold-bright' : 'text-burgundy'
                      }`}
                    >
                      {h.hora}
                    </span>
                    <span>{h.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
