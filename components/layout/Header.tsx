'use client'

import { Menu, X } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import MobileNav from '../interactive/MobileNav'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../ui/SocialBrandIcons'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
    >
      <div className="container-site flex items-center justify-between h-20">
        {/* Brand */}
        <Link
          href="/#hero"
          className="flex items-center gap-3"
          aria-label="Santuário de São José de Ribamar"
          onClick={closeMenu}
        >
          <Image
            src="/img/logo_sj-removebg-preview.png"
            alt="Logo Santuário de São José de Ribamar"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            priority
          />
          <div>
            <span className="block font-serif text-sm font-bold text-burgundy leading-tight">
              Santuário
            </span>
            <span className="block font-body text-xs text-text-soft leading-tight">
              São José de Ribamar
            </span>
          </div>
        </Link>

        {/* Desktop nav via MobileNav (visible lg+) */}
        <div className="hidden lg:block">
          <MobileNav isOpen={true} onClose={closeMenu} />
        </div>

        {/* Desktop social */}
        <div className="hidden lg:flex items-center gap-2">
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
              className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
            >
              <Icon className="w-[15px] h-[15px]" />
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-burgundy"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      <div className="lg:hidden">
        <MobileNav isOpen={menuOpen} onClose={closeMenu} />
      </div>
    </header>
  )
}
