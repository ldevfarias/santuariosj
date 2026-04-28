'use server'

import { Resend } from 'resend'
import { z } from 'zod'

import { headers } from 'next/headers'

import type { ContactFormState } from '@/lib/types'

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  assunto: z.string().max(100).optional(),
  mensagem: z.string().min(10, 'Mensagem muito curta').max(2000, 'Mensagem muito longa'),
})

const rateLimit = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now - entry.ts > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, ts: now })
    return false
  }
  if (entry.count >= MAX_REQUESTS) return true
  entry.count++
  return false
}

export async function enviarContato(
  formData: FormData
): Promise<ContactFormState> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return {
      success: false,
      message: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
    }
  }

  const raw = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    assunto: formData.get('assunto'),
    mensagem: formData.get('mensagem'),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, message: first?.message ?? 'Dados inválidos.' }
  }

  const { nome, email, assunto, mensagem } = parsed.data

  const apiKey = process.env['RESEND_API_KEY']
  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@santuariosjoser.org.br'
  const toEmail = process.env['RESEND_TO_EMAIL'] ?? 'contato@santuariosjoser.org.br'

  if (!apiKey) {
    return { success: false, message: 'Serviço de e-mail indisponível.' }
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Site Santuário] ${assunto || 'Mensagem de contato'}`,
      text: `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto || '—'}\n\n${mensagem}`,
    })

    return { success: true, message: 'Mensagem enviada com sucesso! Responderemos em breve.' }
  } catch {
    return { success: false, message: 'Erro ao enviar mensagem. Tente novamente.' }
  }
}
