import { Quote } from 'lucide-react'

import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SaoJoseSection() {
  return (
    <section
      id="sao-jose"
      className="relative py-24 bg-burgundy-dk overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/img/foto_2.jpeg')] bg-cover bg-center opacity-10" />
      <div className="relative z-[1] container-site max-w-2xl">
        <Ornament light />
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white mb-4 text-center">
          São José de Ribamar
        </h2>
        <p className="font-lora text-lg text-white/80 text-center mb-6">
          Padroeiro do Maranhão, protetor das famílias e dos trabalhadores.
        </p>
        <p className="text-white/80 mb-6 leading-relaxed text-center">
          São José é o esposo da Virgem Maria e pai adotivo de Jesus Cristo. Homem justo,
          trabalhador e fiel, é invocado como protetor dos trabalhadores, das famílias e da Igreja
          universal. Sua devoção no Maranhão remonta aos primeiros séculos da colonização.
        </p>
        <blockquote className="border-l-4 border-gold pl-6 my-8">
          <Quote size={24} className="text-gold mb-2" />
          <p className="font-lora italic text-white/90 text-lg mb-2">
            &ldquo;São José, modelo de virtude e de obediência à vontade de Deus, guia-nos pelo caminho
            da santidade.&rdquo;
          </p>
          <cite className="text-sm text-gold-bright not-italic">— Oração ao Padroeiro</cite>
        </blockquote>
        <div className="text-center">
          <Link
            href="#devocoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white font-semibold rounded hover:bg-gold-light transition-colors"
          >
            Devoções ao Santo
          </Link>
        </div>
      </div>
    </section>
  )
}
