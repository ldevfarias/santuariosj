import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  Clock3,
  FileText,
  HandCoins,
  Heart,
  Mail,
  Phone,
} from 'lucide-react'

import type { Metadata } from 'next'
import Link from 'next/link'

import Button from '@/components/ui/Button'
import Ornament from '@/components/ui/Ornament'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Secretaria',
  description:
    'Informacoes da secretaria do Santuario de Sao Jose de Ribamar, com avisos importantes, atendimento dos padres e acolhimento para apoio psicologico.',
}

const psychologicalSupportCards = [
  {
    title: 'Informacoes sobre encaminhamento',
    description:
      'Area preparada para informar criterios, publico atendido, disponibilidade e contato para futuras etapas do servico.',
    icon: FileText,
  },
  {
    title: 'Contato de referencia',
    description:
      'Enquanto o fluxo definitivo nao e publicado, a secretaria permanece como ponto de orientacao e primeiro contato.',
    icon: Phone,
  },
] as const

export default function SecretariaPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-burgundy py-3 sm:py-4">
        <div className="container-site relative flex flex-col gap-2 text-center sm:gap-2.5">
          <Link
            href="/"
            className="absolute top-0 left-0 inline-flex items-center gap-2 text-sm font-semibold text-gold-bright/80 transition-colors hover:text-gold-bright"
          >
            <ArrowLeft size={15} />
            Início
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Ornament light />
            <h1 className="font-serif text-[clamp(1.75rem,4.4vw,2.8rem)] font-bold text-white">
              Secretaria
            </h1>
            <p className="max-w-3xl font-lora text-sm leading-relaxed text-gold-bright/90 sm:text-base">
              Um espaço para reunir avisos importantes, orientações de atendimento e caminhos
              de acolhimento para a comunidade.
            </p>
          </div>
        </div>
      </div>

      <div className="container-site py-8 sm:py-10">
        <section id="expediente-secretaria" className="rounded-[1.75rem] border border-cream-dk bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full bg-gold-pale px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-burgundy">
                Avisos importantes
              </span>
              <h2 className="mt-4 font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-bold text-burgundy">
                Expediente da secretaria e centro paroquial
              </h2>
              <p className="mt-3 max-w-2xl font-lora text-base leading-relaxed text-text-soft">
                Informações oficiais de funcionamento, contato e apoio ao fiel em um único espaço,
                com acesso rápido aos principais serviços da secretaria.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/secretaria#atendimento-dos-padres">Atendimento dos padres</Button>
                <Button href="/secretaria#apoio-psicologico" variant="gold">
                  Atendimento Psicológico
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-burgundy/10 bg-burgundy px-5 py-6 text-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-white/10 p-2 text-gold-bright">
                  <BellRing size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright/80">
                    Destaque atual
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">
                    Funcionamento semanal
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">
                    Consulte abaixo os horários da Secretaria e do Centro Pastoral, além dos
                    canais oficiais de contato e do Pix para doações.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.25rem] border border-cream-dk bg-cream px-5 py-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <Clock3 size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-burgundy">Secretaria</h3>
              <div className="mt-3 space-y-3 text-sm text-text-soft">
                <p>
                  <span className="font-semibold text-text">Terça-feira a sábado:</span> das 8h às
                  12h e das 14h às 18h
                </p>
                <p>
                  <span className="font-semibold text-text">Domingo:</span> das 8h às 10h
                </p>
              </div>
            </article>

            <article className="rounded-[1.25rem] border border-cream-dk bg-cream px-5 py-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <BellRing size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-burgundy">Centro Pastoral</h3>
              <div className="mt-3 space-y-3 text-sm text-text-soft">
                <p>
                  <span className="font-semibold text-text">Terça-feira a sábado:</span> das 8h às
                  12h e das 14h às 19h
                </p>
                <p>
                  <span className="font-semibold text-text">Domingo:</span> das 7h às 12h30 e das
                  14h às 19h
                </p>
              </div>
            </article>

            <article className="rounded-[1.25rem] border border-cream-dk bg-cream px-5 py-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <Phone size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-burgundy">Contato e doações</h3>
              <div className="mt-3 space-y-3 text-sm text-text-soft">
                <p className="flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    (98) 98911-4019
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    santuariosjrsecretaria@hotmail.com
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <HandCoins size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <span className="font-semibold text-text">Pix para doações:</span> (98)
                    988930158
                  </span>
                </p>
              </div>
            </article>
          </div>

          <div className="mt-4 rounded-2xl border border-burgundy/15 bg-burgundy/5 px-5 py-4">
            <p className="flex items-start gap-2 text-sm font-semibold text-burgundy">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-gold" />
              SEGUNDAS E FERIADOS NÃO HÁ EXPEDIENTE.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-cream-dk bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">
              Navegação interna
            </span>
            <Link
              href="/secretaria#atendimento-dos-padres"
              className="rounded-full border border-burgundy/15 bg-cream px-4 py-2 text-sm font-semibold text-burgundy transition-colors hover:border-burgundy hover:bg-burgundy hover:text-white"
            >
              Atendimento dos padres
            </Link>
            <Link
              href="/secretaria#apoio-psicologico"
              className="rounded-full border border-burgundy/15 bg-cream px-4 py-2 text-sm font-semibold text-burgundy transition-colors hover:border-burgundy hover:bg-burgundy hover:text-white"
            >
              Atendimento Psicológico
            </Link>
          </div>
        </section>

        <section id="atendimento-dos-padres" className="scroll-mt-34 py-12 sm:py-16">
          <SectionHeader
            title="Atendimento dos padres"
            subtitle="Informações oficiais para o atendimento dos paroquianos e devotos com a equipe de Párocos Solidários."
          />

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-3xl border border-cream-dk bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-[clamp(1.4rem,2.6vw,2rem)] font-bold text-burgundy">
                Equipe de Párocos Solidários
              </h3>
              <p className="mt-4 font-lora text-base leading-relaxed text-text-soft">
                Os padres que compõem a equipe de Párocos Solidários, responsável pela
                administração da Paróquia e Santuário São José de Ribamar, estão disponíveis para
                atendimento aos paroquianos e devotos de terça a sexta.
              </p>

              <div className="mt-6 rounded-2xl border border-gold/25 bg-gold-pale/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
                  Palavra da Igreja
                </p>
                <p className="mt-2 font-lora text-sm leading-relaxed text-text-soft italic">
                  Os fiéis têm o direito de receber dos Pastores sagrados, dentre os bens
                  espirituais da Igreja, principalmente os auxílios da Palavra de Deus e dos
                  sacramentos (Cân. 213).
                </p>
              </div>
            </article>

            <aside className="rounded-3xl border border-gold/20 bg-gold-pale/45 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-burgundy">
                <Clock3 size={20} className="text-gold" />
                <h3 className="font-serif text-2xl font-bold">Atendimento</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-soft">
                Atendimento aos paroquianos e devotos de terça a sexta, nos horários estabelecidos
                para manhã e tarde.
              </p>
              <div className="mt-5 space-y-3 rounded-2xl border border-white/70 bg-white/80 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-soft">
                    Manhã
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text">8h30 às 11h30</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-soft">
                    Tarde
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text">15h às 16h45</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="apoio-psicologico" className="scroll-mt-34 border-t border-cream-dk py-12 sm:py-16">
          <SectionHeader
            title="Atendimento Psicológico"
            subtitle="Espaço inicial de apresentação para o futuro serviço de acolhimento e orientação em Atendimento Psicológico."
          />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-[1.75rem] bg-burgundy p-6 text-white shadow-sm sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-gold-bright">
                <Heart size={22} />
              </div>
              <h3 className="mt-5 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold">
                Acolher com respeito e discrição
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Este bloco foi pensado para comunicar o serviço com sobriedade, clareza e cuidado,
                preservando o caráter de acolhimento humano e pastoral do Santuário.
              </p>
              <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-bright/85">
                  Observação importante
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  As informações exibidas neste momento organizam o layout da página. Critérios,
                  responsáveis e disponibilidade podem ser definidos em etapa posterior.
                </p>
              </div>
            </aside>

            <div className="grid gap-5 md:grid-cols-2">
              {psychologicalSupportCards.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-cream-dk bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-burgundy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-soft">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}