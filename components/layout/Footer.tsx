import { Church, Camera, Users, Play, MessageCircle } from 'lucide-react'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-burgundy-dk text-white">
      <div className="py-16">
        <div className="container-site grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center">
                <Church size={20} className="text-gold-bright" />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-gold-bright">Santuário</p>
                <p className="text-xs text-white/70">São José de Ribamar</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-5 leading-relaxed">
              Um lugar sagrado de fé, esperança e encontro com Deus, no coração do Maranhão.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', icon: Camera, label: 'Instagram' },
                { href: '#', icon: Users, label: 'Facebook' },
                { href: '#', icon: Play, label: 'YouTube' },
                { href: '#', icon: MessageCircle, label: 'WhatsApp' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-burgundy-dk transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'O Santuário',
              links: [
                { label: 'História', href: '#historia' },
                { label: 'São José de Ribamar', href: '#sao-jose' },
                { label: 'Estrutura', href: '#sobre' },
              ],
            },
            {
              title: 'Liturgia',
              links: [
                { label: 'Horários das Missas', href: '#horarios' },
                { label: 'Sacramentos', href: '#sacramentos' },
                { label: 'Agenda Litúrgica', href: '#calendario' },
                { label: 'Devoções', href: '#devocoes' },
              ],
            },
            {
              title: 'Pastoral',
              links: [
                { label: 'Grupos e Movimentos', href: '#pastoral' },
                { label: 'Peregrinações', href: '#devocoes' },
                { label: 'Notícias', href: '#noticias' },
                { label: 'Contato', href: '#contato' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-sm font-bold text-gold-bright mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-gold-bright transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© 2025 Santuário de São José de Ribamar. Todos os direitos reservados.</p>
          <p>Desenvolvido com ♥ para a glória de Deus.</p>
        </div>
      </div>
    </footer>
  )
}
