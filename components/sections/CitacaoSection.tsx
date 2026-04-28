import { Quote } from 'lucide-react'

export default function CitacaoSection() {
  return (
    <section className="py-20 bg-burgundy">
      <div className="container-site max-w-3xl text-center">
        <Quote size={40} className="text-gold mx-auto mb-6 opacity-60" />
        <p className="font-serif text-[clamp(1.4rem,3vw,2rem)] font-bold text-white mb-4 leading-relaxed">
          &ldquo;Ide a José!&rdquo; &mdash; Gênesis 41,55
        </p>
        <p className="font-lora italic text-white/70 text-base">
          A Sagrada Escritura, ao falar de José do Egito, prefigurava São José, guardião e protetor
          do Messias.
        </p>
      </div>
    </section>
  )
}
