import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { CalendarClock } from 'lucide-react'

import type { Grupo } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface PastoralSectionProps {
  grupos: Grupo[]
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const iconMap = Icons as unknown as Record<string, LucideIcon>
  const Icon = iconMap[name]
  if (!Icon || typeof Icon !== 'function') return <Icons.Heart size={size} />
  return <Icon size={size} />
}

export default function PastoralSection({ grupos }: PastoralSectionProps) {
  return (
    <section id="pastoral" className="py-20 bg-white">
      <div className="container-site">
        <SectionHeader
          title="Grupos e Movimentos"
          subtitle="Faça parte de uma comunidade viva e atuante"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="grupos">
          {grupos.map((grupo, i) => (
            <div
              key={grupo.nome}
              className="reveal bg-cream rounded-xl p-6 hover:shadow-md transition-shadow border border-cream-dk"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy shrink-0">
                  <DynamicIcon name={grupo.icone} size={22} />
                </div>
                <h3 className="font-serif text-base font-bold text-burgundy">{grupo.nome}</h3>
              </div>
              <p className="text-sm text-text-soft leading-relaxed">{grupo.descricao}</p>
              {grupo.encontro && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-cream-dk text-xs text-text-soft">
                  <CalendarClock size={13} className="shrink-0 text-gold" />
                  <span>{grupo.encontro}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
