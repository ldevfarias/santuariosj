import { Mail, MessageCircle } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="bg-burgundy-dk text-white text-xs py-2">
      <div className="container-site flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <a
            href="https://api.whatsapp.com/send?phone=5598989114019&text=A%20Par%C3%B3quia%20Santu%C3%A1rio%20S%C3%A3o%20Jos%C3%A9%20de%20Ribamar%20agradece%20seu%20contato.%20Como%20podemos%20ajudar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <MessageCircle size={12} />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:contato@santuariosjoser.org.br"
            className="hidden sm:flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <Mail size={12} />
            <span>contato@santuariosjoser.org.br</span>
          </a>
        </div>
        <p className="font-serif text-[11px] sm:text-xs tracking-wide text-gold-bright">
          São José de Ribamar, rogai por nós.
        </p>
      </div>
    </div>
  )
}
