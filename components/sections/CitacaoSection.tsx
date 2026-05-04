import { Quote } from 'lucide-react'

export default function CitacaoSection() {
  return (
    <section className="py-10 bg-burgundy">
      <div className="reveal container-site max-w-3xl text-center">
        <Quote size={32} className="text-gold mx-auto mb-4 opacity-60" />
        <p className="font-serif text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold text-white mb-3 leading-snug">
          &ldquo;Desceu com eles e voltou para Nazaré, e era-lhes submisso.
          Sua mãe guardava todas essas coisas no seu coração.&rdquo;
        </p>
        <p className="font-lora italic text-white/70 text-sm mb-2">
          Lucas 2,51
        </p>
        <p className="font-lora italic text-gold/70 text-sm">
          Na humildade do lar de Nazaré, Jesus, Maria e José viveram a mais perfeita comunhão de
          amor — modelo eterno para toda família cristã.
        </p>
      </div>
    </section>
  )
}
