import { Quote } from 'lucide-react'

export default function CitacaoSection() {
  return (
    <section className="py-20 bg-burgundy">
      <div className="reveal container-site max-w-3xl text-center">
        <Quote size={40} className="text-gold mx-auto mb-6 opacity-60" />
        <p className="font-serif text-[clamp(1.4rem,3vw,2rem)] font-bold text-white mb-4 leading-relaxed">
          &ldquo;Em seguida, desceu com eles a Nazaré e lhes era submisso. Sua mãe guardava todas essas coisas no seu coração.&rdquo;
        </p>
        <p className="font-lora text-gold-bright text-base mb-4">
          Lucas 2,51
        </p>
        <p className="font-lora italic text-white/70 text-base">
          Na humildade do lar de Nazaré, Jesus, Maria e José viveram a mais perfeita comunhão de amor &mdash; modelo eterno para toda família cristã.
        </p>
      </div>
    </section>
  )
}
