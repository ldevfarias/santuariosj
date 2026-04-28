'use client'

import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react'

import { useTransition, useState } from 'react'

import { enviarContato } from '@/app/actions/contato'
import type { ContactFormState } from '@/lib/types'

export default function ContatoForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ContactFormState>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    startTransition(async () => {
      const res = await enviarContato(formData)
      setResult(res)
      if (res?.success) form.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h3 className="font-serif text-xl font-bold text-burgundy mb-6">Envie uma mensagem</h3>

      <div>
        <label htmlFor="nome" className="block text-sm font-semibold text-text mb-1">
          Nome completo
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          placeholder="Seu nome"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-text mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="assunto" className="block text-sm font-semibold text-text mb-1">
          Assunto
        </label>
        <select
          id="assunto"
          name="assunto"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        >
          <option value="">Selecione um assunto</option>
          <option>Agendamento de Sacramento</option>
          <option>Informações sobre a Festa</option>
          <option>Grupos e Movimentos</option>
          <option>Peregrinação</option>
          <option>Outros</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-semibold text-text mb-1">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          required
          placeholder="Sua mensagem..."
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={18} />
            Enviar Mensagem
          </>
        )}
      </button>

      {result && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 p-4 rounded text-sm font-medium ${
            result.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {result.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {result.message}
        </div>
      )}
    </form>
  )
}
