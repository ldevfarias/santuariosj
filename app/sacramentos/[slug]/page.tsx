import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { ArrowLeft, CalendarDays, CheckCircle2, Phone } from 'lucide-react'

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getSacramento, getSacramentos } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'

type Props = {
  params: Promise<{ slug: string }>
}

function DynamicIcon({ name, size = 32 }: { name: string; size?: number }) {
  const iconMap = Icons as unknown as Record<string, LucideIcon>
  const Icon = iconMap[name]
  if (!Icon || typeof Icon !== 'function') return <Icons.Cross size={size} />
  return <Icon size={size} />
}

export async function generateStaticParams() {
  const sacramentos = getSacramentos()
  return sacramentos.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sacramento = getSacramento(slug)
  if (!sacramento) return {}
  return {
    title: sacramento.nome,
    description: sacramento.descricao,
  }
}

export default async function SacramentoPage({ params }: Props) {
  const { slug } = await params
  const sacramento = getSacramento(slug)
  if (!sacramento) notFound()
  const descricaoHeroClass = sacramento.descricaoItalico
    ? 'font-lora text-gold-bright/80 text-sm mt-0.5 leading-relaxed max-w-xl italic'
    : 'font-lora text-gold-bright/80 text-sm mt-0.5 leading-relaxed max-w-xl'

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero strip */}
      <div className="bg-burgundy py-6">
        <div className="container-site flex flex-col gap-2.5">
          <Link
            href="/#sacramentos"
            className="inline-flex items-center gap-2 text-sm text-gold-bright/80 hover:text-gold-bright font-semibold transition-colors self-start"
          >
            <ArrowLeft size={15} />
            Sacramentos
          </Link>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold-bright">
              <DynamicIcon name={sacramento.icone} size={22} />
            </div>
            <div>
              <h1 className="font-serif text-[clamp(1.45rem,3.6vw,2.15rem)] font-bold text-white leading-tight">
                {sacramento.nome}
              </h1>
              <p className={descricaoHeroClass}>
                {sacramento.descricao}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Sobre o sacramento */}
          <div>
            <Ornament />
            <h2 className="font-serif text-2xl font-bold text-burgundy mt-3 mb-2">
              Sobre o Sacramento
            </h2>
            <p className="font-lora text-base text-text-soft leading-relaxed">
              {sacramento.descricaoLonga}
            </p>
          </div>

          {/* Requisitos */}
          <div>
            <h2 className="font-serif text-xl font-bold text-burgundy mb-3">Requisitos</h2>
            <ul className="flex flex-col gap-3">
              {sacramento.requisitos.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-text-soft">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-gold" />
                  <span className="text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar: agendamento */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-cream-dk bg-white px-5 py-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-burgundy">
              <CalendarDays size={20} className="text-gold" />
              <h3 className="font-serif text-lg font-bold">Como agendar</h3>
            </div>
            <p className="text-sm text-text-soft leading-relaxed">{sacramento.agendamento}</p>
            {sacramento.agendamentoItens && sacramento.agendamentoItens.length > 0 && (
              <ul className="flex flex-col gap-2">
                {sacramento.agendamentoItens.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 shrink-0 h-2 w-2 rounded-full bg-gold" />
                    <span className="text-sm text-text-soft leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {sacramento.agendamentoContato && (
              <div className="flex items-center gap-2 text-sm font-semibold text-burgundy border-t border-cream-dk pt-3">
                <Phone size={15} className="shrink-0 text-gold" />
                <span>{sacramento.agendamentoContato}</span>
              </div>
            )}
            {sacramento.cta && (
              <Link
                href="/#contato"
                className="inline-flex items-center justify-center gap-2 rounded px-5 py-3 bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-dk transition-colors"
              >
                {sacramento.cta}
              </Link>
            )}
          </div>

          {/* Back link */}
          <Link
            href="/#sacramentos"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Todos os sacramentos
          </Link>
        </aside>
      </div>
    </main>
  )
}
