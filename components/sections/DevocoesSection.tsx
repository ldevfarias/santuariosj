import * as Icons from 'lucide-react'
import { CheckCircle } from 'lucide-react'

import Link from 'next/link'

import type { DevoItem } from '@/lib/types'

import Ornament from '../ui/Ornament'

interface DevocoesSectionProps {
  lista: string[]
  cards: DevoItem[]
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon || typeof Icon !== 'function') return null
  return <Icon size={size} />
}

export default function DevocoesSection({ lista, cards }: DevocoesSectionProps) {
  return (
    <section id="devocoes" className="py-20 bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Text side */}
          <div>
            <Ornament />
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy mb-4">
              Devoções Tradicionais
            </h2>
            <p className="text-text-soft mb-6 leading-relaxed">
              O Santuário mantém vivas as tradições devocionais que alimentam a fé do povo
              maranhense há séculos.
            </p>
            <ul className="space-y-3 mb-8">
              {lista.map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-soft">
                  <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#calendario"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
            >
              Ver Calendário Litúrgico
            </Link>
          </div>

          {/* Cards side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.titulo}
                className="bg-white rounded-xl p-5 shadow-sm border border-cream-dk hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center mb-3 text-burgundy">
                  <DynamicIcon name={card.icone} size={20} />
                </div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">{card.titulo}</h4>
                <p className="text-xs text-text-soft leading-relaxed">{card.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
