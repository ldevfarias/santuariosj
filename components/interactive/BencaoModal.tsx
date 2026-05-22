'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { BENCAOS, IMAGENS_SANTO, getDayOfYear } from '@/data/bencaos'
import Button from '@/components/ui/Button'

type ModalState = {
  imagem: string
  texto: string
  autor?: string
}

export default function BencaoModal() {
  const [aberto, setAberto] = useState(false)
  const [modal, setModal] = useState<ModalState | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const hoje = new Date()
    const diaSemana = hoje.getDay()
    const diaAno = getDayOfYear(hoje)
    const bencao = BENCAOS[diaAno % BENCAOS.length]

    setModal({
      imagem: IMAGENS_SANTO[diaSemana] ?? IMAGENS_SANTO[0] ?? '',
      texto: bencao?.texto ?? '',
      autor: bencao?.autor,
    })
    setAberto(true)
  }, [])

  useEffect(() => {
    if (aberto) {
      btnRef.current?.focus()
    }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aberto])

  if (!aberto || !modal) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      aria-hidden="true"
      onClick={() => setAberto(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bencao-titulo"
        className="relative w-full max-w-md bg-cream rounded-2xl shadow-2xl border border-gold/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem */}
        <div className="relative w-full h-56">
          <Image
            src={modal.imagem}
            alt="São José de Ribamar"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-cream/80" />
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-6 pt-2 text-center">
          <p
            id="bencao-titulo"
            className="font-serif text-gold text-lg tracking-widest uppercase mb-4"
          >
            ✝ Bênção do Dia
          </p>

          <blockquote className="font-lora italic text-burgundy-dk text-base leading-relaxed mb-2">
            &ldquo;{modal.texto}&rdquo;
          </blockquote>

          {modal.autor && (
            <p className="font-body text-xs text-text-soft mb-5">— {modal.autor}</p>
          )}

          <Button
            ref={btnRef}
            variant="primary"
            full
            onClick={() => setAberto(false)}
          >
            Amém
          </Button>
        </div>
      </div>
    </div>
  )
}
