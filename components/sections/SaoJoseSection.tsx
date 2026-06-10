import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SaoJoseSection() {
  return (
    <section
      id="sao-jose"
      className="relative py-24 bg-burgundy-dk overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/img/foto_2.jpeg')] bg-cover bg-position-[center_30%] opacity-10" />

      <div className="reveal relative z-[1] container-site grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Coluna esquerda — identidade */}
        <div>
          <Ornament light />
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-5">
            São José de Ribamar
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            São José é o esposo da Virgem Maria e pai adotivo de Jesus Cristo. Homem justo,
            trabalhador e fiel, é invocado como protetor dos trabalhadores, das famílias e da Igreja
            universal. Sua devoção no Maranhão remonta aos primeiros séculos da colonização.
          </p>
          <Link
            href="/devocoes/sao-jose"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white font-semibold rounded hover:bg-gold-light transition-colors"
          >
            Devoções ao Santo
          </Link>
        </div>

        {/* Coluna direita — oração */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-gold-bright uppercase mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-gold mr-1">99</span>
            Oração a São José
            <span className="text-gold ml-1">66</span>
            <span className="h-px w-8 bg-gold/50" />
          </p>

          <div className="font-lora italic text-white/90 text-base leading-relaxed space-y-4">
            <p>
              Salve, guardião do Redentor<br />
              E esposo da Virgem Maria!
            </p>
            <p>
              A vós, Deus confiou o seu Filho;<br />
              Em vós, Maria depositou a sua confiança;<br />
              Convosco, Cristo tornou-Se homem.
            </p>
            <p>
              Ó Bem-aventurado José,
            </p>
            <p>
              Mostrai-vos pai também para nós<br />
              E guiai-nos no caminho da vida.<br />
              Alcançai-nos graça, misericórdia e coragem,<br />
              E defendei-nos de todo o mal.
            </p>
          </div>

          <p className="mt-6 text-white/50 font-lora italic tracking-widest text-sm">— Amém —</p>

          <p className="mt-5 font-serif font-semibold text-gold-bright text-base">
            São José de Ribamar, rogai por nós!
          </p>
        </div>
      </div>
    </section>
  )
}
