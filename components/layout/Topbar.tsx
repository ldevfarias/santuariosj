import { Camera, Users, Play, Phone, Mail } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="bg-burgundy-dk text-white text-xs py-2">
      <div className="container-site flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <a
            href="tel:+5598322700000"
            className="flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <Phone size={12} />
            <span>(98) 3227-0000</span>
          </a>
          <a
            href="mailto:contato@santuariosjoser.org.br"
            className="hidden sm:flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <Mail size={12} />
            <span>contato@santuariosjoser.org.br</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-gold-bright transition-colors"
          >
            <Camera size={14} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-gold-bright transition-colors"
          >
            <Users size={14} />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-gold-bright transition-colors"
          >
            <Play size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
