'use client'

import { Church, Menu, X } from 'lucide-react'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import MobileNav from '../interactive/MobileNav'

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
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container-site flex items-center justify-between h-20">
        {/* Brand */}
        <Link
          href="#hero"
          className="flex items-center gap-3"
          aria-label="Santuário de São José de Ribamar"
          onClick={closeMenu}
        >
          <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center">
            <Church size={20} className="text-gold-bright" />
          </div>
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
