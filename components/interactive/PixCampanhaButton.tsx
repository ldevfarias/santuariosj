'use client'

import { Copy, Check, Heart, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PIX_KEY = '(98) 98893-0158'

export default function PixCampanhaButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — silently ignore
    }
  }

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <>
      {/* Botão flutuante */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Campanha dos Devotos — Contribuir via Pix"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-burgundy text-white rounded-l-lg shadow-lg hover:bg-burgundy-dk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {/* Desktop: texto rotacionado */}
        <span className="hidden lg:flex items-center gap-2 px-3 py-4">
          <Heart size={14} className="shrink-0" />
          <span
            className="font-serif text-xs font-semibold tracking-wider uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            Campanha dos Devotos
          </span>
        </span>
        {/* Mobile: só ícone */}
        <span className="lg:hidden flex items-center justify-center w-10 h-16">
          <Heart size={16} />
        </span>
      </button>

      {/* Popover */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="false"
        aria-label="Campanha dos Devotos — Pix"
        className={`fixed right-[52px] lg:right-[60px] top-1/2 -translate-y-1/2 z-40
          w-72 bg-white rounded-xl shadow-2xl border border-cream-dk
          transition-all duration-200 origin-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="font-serif text-sm font-bold text-burgundy uppercase tracking-wide">
            Campanha dos Devotos
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="text-text-soft hover:text-burgundy transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="px-4 pb-3 font-body text-xs text-text-soft leading-relaxed">
          Contribua com o Santuário de São José de Ribamar.
        </p>

        {/* QR Code placeholder */}
        <div className="mx-4 mb-3 aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 border border-gray-200">
          <div className="w-12 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Heart size={20} className="text-gray-300" />
          </div>
          <p className="font-body text-[11px] text-gray-400 text-center leading-tight px-2">
            QR Code em breve
          </p>
        </div>

        {/* Chave Pix */}
        <div className="mx-4 mb-3 p-3 bg-cream rounded-lg">
          <p className="font-body text-[10px] text-text-soft uppercase tracking-wider mb-1">
            Chave Pix (telefone)
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-burgundy tracking-wide">
              {PIX_KEY}
            </span>
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Chave Pix copiada' : 'Copiar chave Pix'}
              aria-live="polite"
              className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors
                bg-burgundy text-white hover:bg-burgundy-dk"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <p className="px-4 pb-4 font-lora italic text-[11px] text-text-soft text-center">
          Que São José abençoe sua oferta.
        </p>
      </div>
    </>
  )
}
