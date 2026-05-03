import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'

import type { Metadata } from 'next'
import Link from 'next/link'

import { getSacramentos } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Sacramentos',
  description:
    'Conheça os sete sacramentos celebrados no Santuário de São José de Ribamar — sinais visíveis da graça invisível de Deus.',
}

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon || typeof Icon !== 'function') return null
  return <Icon size={size} />
}

export default function SacramentosPage() {
  const sacramentos = getSacramentos()

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero strip */}
      <div className="bg-burgundy py-16">
        <div className="container-site flex flex-col items-center text-center gap-3">
          <Ornament light />
          <h1 className="font-serif text-[clamp(2rem,5vw,3.2rem)] font-bold text-white">
            Sacramentos
          </h1>
          <p className="font-lora text-gold-bright/90 text-lg max-w-xl leading-relaxed">
            Os sete sacramentos — sinais visíveis da graça invisível de Deus
          </p>
        </div>
      </div>

      <div className="container-site py-16">
        <SectionHeader
          title="Os Sete Sacramentos"
          subtitle="Selecione um sacramento para conhecer seus requisitos e como recebê-lo no Santuário"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sacramentos.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4 text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors">
                <DynamicIcon name={s.icone} size={24} />
              </div>
              <h2 className="font-serif text-base font-bold text-burgundy mb-2">{s.nome}</h2>
              <p
                className={
                  s.descricaoItalico
                    ? 'text-sm text-text-soft mb-4 leading-relaxed italic'
                    : 'text-sm text-text-soft mb-4 leading-relaxed'
                }
              >
                {s.descricao}
              </p>
              {s.cta && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:text-gold-light transition-colors">
                  {s.cta} <ArrowRight size={14} />
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
