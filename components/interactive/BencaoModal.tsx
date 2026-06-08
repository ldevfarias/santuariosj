'use client'

import Image from 'next/image'
import { useState } from 'react'

type BencaoDiaRow = {
  id: number
  ordem: number
  dia: string
  mensagem: string
  autor: string
  imagem: string
}

export default function BencaoModal({ bencaos }: { bencaos: BencaoDiaRow[] }) {
  const [open, setOpen] = useState(true)

  const idx = new Date().getDay() // 0 = domingo … 6 = sábado
  const bencao = bencaos[idx]

  if (!open || !bencao) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="bencao-titulo"
    >
      <div className="bg-cream rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transition-opacity duration-300">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={bencao.imagem}
            alt="Bênção do Santuário de São José de Ribamar"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <h2
            id="bencao-titulo"
            className="font-serif text-lg font-bold text-gold tracking-widest uppercase"
          >
            † Bênção do Dia
          </h2>

          <p className="font-lora italic text-text text-base leading-relaxed">
            "{bencao.mensagem}"
          </p>

          <button
            onClick={() => setOpen(false)}
            autoFocus
            className="mt-2 w-full py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
          >
            Amém
          </button>
        </div>
      </div>
    </div>
  )
}
