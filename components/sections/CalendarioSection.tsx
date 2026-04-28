import { Clock, MapPin } from 'lucide-react'

import type { AgendaItem } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface CalendarioSectionProps {
  agenda: AgendaItem[]
}

const tipoColors: Record<AgendaItem['tipo'], string> = {
  festivo: 'bg-gold text-white',
  padroeiro: 'bg-burgundy text-white',
  liturgico: 'bg-text-soft/20 text-text',
}

const tipoLabels: Record<AgendaItem['tipo'], string> = {
  festivo: 'Festivo',
  padroeiro: 'Padroeiro',
  liturgico: 'Litúrgico',
}

export default function CalendarioSection({ agenda }: CalendarioSectionProps) {
  return (
    <section id="calendario" className="py-20 bg-burgundy">
      <div className="container-site">
        <SectionHeader
          title="Agenda Litúrgica"
          subtitle="Próximas celebrações e eventos do Santuário"
          light
        />
        <div className="space-y-4 max-w-3xl mx-auto">
          {agenda.map((item) => (
            <div
              key={`${item.dia}-${item.mes}`}
              className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-colors"
            >
              <div className="shrink-0 w-16 h-16 rounded-xl bg-gold/20 flex flex-col items-center justify-center text-white">
                <span className="font-serif text-2xl font-bold leading-none">{item.dia}</span>
                <span className="text-xs font-semibold text-gold-bright">{item.mes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base font-bold text-white mb-1 leading-snug">
                  {item.titulo}
                </h4>
                <p className="text-sm text-white/70 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.hora}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {item.local}
                  </span>
                </p>
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${tipoColors[item.tipo]}`}
              >
                {tipoLabels[item.tipo]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
