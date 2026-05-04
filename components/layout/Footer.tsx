import Image from 'next/image'

import Link from 'next/link'

import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../ui/SocialBrandIcons'

export default function Footer() {
  return (
    <footer className="bg-burgundy-dk text-white">
      <div className="py-16">
        <div className="container-site grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/img/logo_sj-removebg-preview.png"
                alt="Logo Santuário de São José de Ribamar"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
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
                { href: 'https://www.instagram.com/santuarioribamar/', icon: InstagramIcon, label: 'Instagram' },
                { href: 'https://www.facebook.com/santuario.ribamar/', icon: FacebookIcon, label: 'Facebook' },
                { href: 'https://www.youtube.com/santuarioribamar/', icon: YouTubeIcon, label: 'YouTube' },
                { href: 'https://api.whatsapp.com/send?phone=5598989114019&text=A%20Par%C3%B3quia%20Santu%C3%A1rio%20S%C3%A3o%20Jos%C3%A9%20de%20Ribamar%20agradece%20seu%20contato.%20Como%20podemos%20ajudar%3F', icon: WhatsAppIcon, label: 'WhatsApp' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'O Santuário',
              links: [
                { label: 'História', href: '/#historia' },
                { label: 'Devoções', href: '/#devocoes' },
                { label: 'Administração', href: '/episcopal' },
                { label: 'Comunidades', href: '/comunidades' },
              ],
            },
            {
              title: 'Liturgia',
              links: [
                { label: 'Horários das Missas', href: '/#horarios' },
                { label: 'Sacramentos', href: '/#sacramentos' },
                { label: 'Agenda Litúrgica', href: '/#calendario' },
              ],
            },
            {
              title: 'Pastoral',
              links: [
                { label: 'Grupos e Movimentos', href: '/#pastoral' },
                { label: 'Notícias', href: '/#noticias' },
                { label: 'Contato', href: '/#contato' },
              ],
            },
            {
              title: 'Secretaria',
              links: [
                { label: 'Expediente', href: '/secretaria' },
                { label: 'Atendimento dos padres', href: '/secretaria#atendimento-dos-padres' },
                { label: 'Atendimento Psicológico', href: '/secretaria#apoio-psicologico' },
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
