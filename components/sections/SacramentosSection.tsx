import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'

import Link from 'next/link'

import type { Sacramento } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface SacramentosSectionProps {
  sacramentos: Sacramento[]
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const iconMap = Icons as unknown as Record<string, LucideIcon>
  const Icon = iconMap[name]
  if (!Icon || typeof Icon !== 'function') return <Icons.Cross size={size} />
  return <Icon size={size} />
}

export default function SacramentosSection({ sacramentos }: SacramentosSectionProps) {
  return (
    <section id="sacramentos" className="py-20 bg-cream-dk">
      <div className="container-site">
        <SectionHeader
          title="Sacramentos"
          subtitle="Os sete sacramentos — sinais visíveis da graça invisível de Deus"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sacramentos.map((s, i) => (
            <div
              key={s.id}
              className="reveal bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4 text-burgundy">
                <DynamicIcon name={s.icone} size={24} />
              </div>
              <h3 className="font-serif text-base font-bold text-burgundy mb-2">{s.nome}</h3>
              <p
                className={
                  s.descricaoItalico
                    ? 'text-sm text-text-soft leading-relaxed italic'
                    : 'text-sm text-text-soft leading-relaxed'
                }
              >
                {s.descricao}
              </p>
              <div className="mt-auto pt-4 min-h-[1.5rem] flex items-center justify-center">
                {s.cta && (
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
                  >
                    {s.cta} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
