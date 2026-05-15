import { Quote } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SaoJoseSection() {
  return (
    <section
      id="sao-jose"
      className="relative py-16 bg-burgundy-dk overflow-hidden"
    >
      <Image
        src="/img/foto_2.avif"
        alt=""
        fill
        aria-hidden="true"
        className="absolute inset-0 object-cover object-[center_30%] opacity-10"
        sizes="100vw"
      />
      <div className="reveal relative z-1 container-site">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">

          {/* Apresentação */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Ornament light />
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white mb-2">
              São José de Ribamar
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed max-w-lg">
              São José é o esposo da Virgem Maria e pai adotivo de Jesus Cristo. Homem justo,
              trabalhador e fiel, é invocado como protetor dos trabalhadores, das famílias e da
              Igreja universal. Sua devoção no Maranhão remonta aos primeiros séculos da
              colonização.
            </p>
            <Link
              href="#devocoes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white font-semibold rounded hover:bg-gold-light transition-colors"
            >
              Devoções ao Santo
            </Link>
          </div>

          {/* Oração */}
          <div className="flex flex-col items-center text-center lg:border-l lg:border-white/10 lg:pl-14">
            <div className="mb-5 flex items-center gap-3">
              <span className="block h-px w-8 bg-gold/45" />
              <Quote size={14} className="text-gold" />
              <span className="font-serif text-xs font-semibold uppercase tracking-[0.24em] text-gold-bright/70">
                Oração a São José
              </span>
              <Quote size={14} className="rotate-180 text-gold" />
              <span className="block h-px w-8 bg-gold/45" />
            </div>

            <div className="space-y-3 font-lora text-base leading-7 text-white/85 italic">
              <p>
                Salve, guardião do Redentor<br />
                E esposo da Virgem Maria!<br />
                A vós, Deus confiou o seu Filho;<br />
                Em vós, Maria depositou a sua confiança;<br />
                Convosco, Cristo tornou-Se homem.
              </p>
              <p>Ó Bem-aventurado José,</p>
              <p>
                Mostrai-vos pai também para nós<br />
                E guiai-nos no caminho da vida.<br />
                Alcançai-nos graça, misericórdia e coragem,<br />
                E defendei-nos de todo o mal.
              </p>
              <p className="not-italic font-semibold tracking-[0.2em] text-white/50">— Amém —</p>
            </div>

            <div className="mt-5 h-px w-14 bg-gold/35" />
            <p className="mt-4 font-serif text-sm font-bold tracking-[0.14em] text-gold-bright">
              São José de Ribamar, rogai por nós!
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
