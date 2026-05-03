'use client'

import { ChevronDown } from 'lucide-react'

import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Início', href: '/#hero' },
  {
    label: 'O Santuário',
    href: '/#sobre',
    children: [
      { label: 'Administração', href: '/episcopal' },
      { label: 'História', href: '/#historia' },
      { label: 'Comunidades', href: '/comunidades' },
      { label: 'Devoções', href: '/#devocoes' },
      { label: 'Horários de Missa', href: '/#horarios' },
      { label: 'Calendário Litúrgico', href: '/#calendario' },
    ],
  },
  {
    label: 'Liturgia',
    href: '/#horarios',
    children: [
      { label: 'Horários das Missas', href: '/#horarios' },
      { label: 'Sacramentos', href: '/#sacramentos' },
      { label: 'Calendário Litúrgico', href: '/#calendario' },
    ],
  },
  { label: 'Notícias', href: '/#noticias' },
  {
    label: 'Pastoral',
    href: '/#pastoral',
    children: [
      { label: 'Grupos e Movimentos', href: '/#pastoral' },
    ],
  },
  { label: 'Contato', href: '/#contato' },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <nav
      id="main-nav"
      aria-label="Navegação principal"
      className={`
        fixed inset-0 top-30 bg-white z-40 overflow-y-auto
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:static lg:translate-x-0 lg:bg-transparent lg:overflow-visible lg:top-0
      `}
    >
      <ul className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-1 p-6 lg:p-0">
        {navItems.map((item) => (
          <li key={item.label} className="group relative">
            {item.children ? (
              <>
                <button
                  className="flex items-center gap-1 w-full text-left px-4 py-3 lg:py-2 font-body text-sm font-semibold text-text hover:text-burgundy transition-colors"
                  onClick={(e) => {
                    const parent = (e.currentTarget as HTMLElement).closest('li')
                    parent?.classList.toggle('open')
                  }}
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-[.open]:rotate-180 lg:group-hover:rotate-180" />
                </button>
                <ul className="hidden group-[.open]:block lg:group-hover:block lg:absolute lg:top-full lg:left-0 lg:bg-white lg:shadow-md lg:rounded lg:min-w-50 lg:py-2">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="block px-6 lg:px-4 py-2 text-sm text-text-soft hover:text-burgundy hover:bg-cream transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 lg:py-2 font-body text-sm font-semibold text-text hover:text-burgundy transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
