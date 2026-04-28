import * as Icons from 'lucide-react'

import type { Grupo } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface PastoralSectionProps {
  grupos: Grupo[]
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon || typeof Icon !== 'function') return null
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
          {grupos.map((grupo) => (
            <div
              key={grupo.nome}
              className="bg-cream rounded-xl p-6 hover:shadow-md transition-shadow border border-cream-dk"
            >
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mb-4 text-burgundy">
                <DynamicIcon name={grupo.icone} size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-burgundy mb-2">{grupo.nome}</h3>
              <p className="text-sm text-text-soft leading-relaxed">{grupo.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
