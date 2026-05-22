'use client'

import { Check, Copy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PIX_KEY = '(98) 98893-0158'

function QrMock() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QR Code PIX — substituir pela imagem real"
      className="rounded-lg"
    >
      <rect width="160" height="160" fill="#faf6ef" />
      {/* cantos */}
      <rect x="10" y="10" width="44" height="44" rx="4" fill="#4a0f0f" />
      <rect x="16" y="16" width="32" height="32" rx="2" fill="#faf6ef" />
      <rect x="22" y="22" width="20" height="20" rx="1" fill="#4a0f0f" />
      <rect x="106" y="10" width="44" height="44" rx="4" fill="#4a0f0f" />
      <rect x="112" y="16" width="32" height="32" rx="2" fill="#faf6ef" />
      <rect x="118" y="22" width="20" height="20" rx="1" fill="#4a0f0f" />
      <rect x="10" y="106" width="44" height="44" rx="4" fill="#4a0f0f" />
      <rect x="16" y="112" width="32" height="32" rx="2" fill="#faf6ef" />
      <rect x="22" y="118" width="20" height="20" rx="1" fill="#4a0f0f" />
      {/* módulos centrais mock */}
      {[60,66,72,78,84,90,96].map((x) =>
        [60,66,72,78,84,90,96].map((y) =>
          Math.abs(x - 78) + Math.abs(y - 78) > 12 ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#4a0f0f" />
          ) : null
        )
      )}
      {[10,16,22,28,34,40,46,52].map((x) =>
        [60,66,72,78,84,90,96,102].map((y) => (
          (x + y) % 12 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#4a0f0f" /> : null
        ))
      )}
      {[108,114,120,126,132,138,144,150].map((x) =>
        [60,66,72,78,84,90,96,102].map((y) => (
          (x + y) % 10 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#4a0f0f" /> : null
        ))
      )}
      {[60,66,72,78,84,90,96,102].map((x) =>
        [10,16,22,28,34,40,46].map((y) => (
          (x * y) % 7 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#4a0f0f" /> : null
        ))
      )}
      {[60,66,72,78,84,90,96,102].map((x) =>
        [114,120,126,132,138,144,150].map((y) => (
          (x + y) % 9 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#4a0f0f" /> : null
        ))
      )}
      {/* label */}
      <text x="80" y="155" textAnchor="middle" fontSize="7" fill="#b8860b" fontFamily="monospace">
        MOCK — substituir
      </text>
    </svg>
  )
}

export default function PixWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const hoverRef = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      if (!hoverRef.current) setIsOpen(false)
    }, 150)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onResize = () => setIsMobile(mq.matches)
    const onMotion = () => setReduceMotion(mqMotion.matches)

    onResize()
    onMotion()

    mq.addEventListener('change', onResize)
    mqMotion.addEventListener('change', onMotion)

    return () => {
      mq.removeEventListener('change', onResize)
      mqMotion.removeEventListener('change', onMotion)
    }
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const transitionClass = reduceMotion
    ? 'transition-none'
    : 'transition-[opacity,transform] duration-200'

  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-gold">
          Doe ao Santuário
        </span>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fechar"
            className="text-text-soft hover:text-burgundy transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex justify-center mb-3">
        <QrMock />
      </div>

      <p className="text-center text-[10px] text-text-soft mb-2 leading-relaxed">
        Aponte a câmera do seu banco para o QR code ou use a chave abaixo
      </p>

      <div className="flex items-center gap-2 bg-cream-dk rounded-lg px-3 py-2">
        <span className="font-mono text-xs text-text flex-1 select-all">{PIX_KEY}</span>
        <button
          onClick={handleCopy}
          aria-label="Copiar chave PIX"
          className="text-gold hover:text-burgundy transition-colors shrink-0"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      {copied && (
        <p className="text-center text-[10px] text-gold mt-1.5 font-semibold">Chave copiada!</p>
      )}
    </>
  )

  return (
    <>
      {/* Botão fixo */}
      <button
        aria-label="Fazer doação via PIX"
        onMouseEnter={() => { if (!isMobile) { cancelClose(); hoverRef.current = true; setIsOpen(true) } }}
        onMouseLeave={() => { if (!isMobile) { hoverRef.current = false; scheduleClose() } }}
        onClick={() => { if (isMobile) setIsOpen((v) => !v) }}
        className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-burgundy text-white text-sm font-semibold rounded-full shadow-lg hover:bg-burgundy-dk transition-colors"
      >
        <span>Campanha dos Devotos</span>
      </button>

      {/* Card desktop — ancorado abaixo do botão */}
      {!isMobile && (
        <div
          role="dialog"
          aria-label="Doação via PIX"
          aria-hidden={!isOpen}
          onMouseEnter={() => { cancelClose(); hoverRef.current = true }}
          onMouseLeave={() => { hoverRef.current = false; scheduleClose() }}
          className={`fixed top-32 right-6 z-60 w-60 bg-cream border border-gold/30 rounded-xl shadow-2xl p-4 ${transitionClass} ${
            isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {cardContent}
        </div>
      )}

      {/* Drawer mobile — sobe de baixo */}
      {isMobile && (
        <>
          {isOpen && (
            <div
              className="fixed inset-0 z-59 bg-black/40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          )}

          <div
            role="dialog"
            aria-label="Doação via PIX"
            aria-modal="true"
            aria-hidden={!isOpen}
            className={`fixed bottom-0 inset-x-0 z-60 bg-cream rounded-t-2xl shadow-2xl px-5 pt-5 pb-8 ${transitionClass} ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="w-10 h-1 bg-cream-dk rounded-full mx-auto mb-4" />
            {cardContent}
          </div>
        </>
      )}
    </>
  )
}
