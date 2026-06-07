import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { unstable_cache } from 'next/cache'

import { query } from './db'
import type {
  AgendaItem,
  Comunidade,
  DevocaoPage,
  DevoItem,
  Grupo,
  Historia,
  Missa,
  Noticia,
  Sacerdote,
  Sacramento,
} from './types'

function readJson<T>(filename: string): T {
  const filepath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T
}

// ── missas ───────────────────────────────────────────────────────────────────

type MissaRow = {
  id: number; ordem: number; dia: string; destaque: number; icone: string
  horarios: string; programacao_semanal: string | null; observacao: string | null
}

export const getMissas = unstable_cache(
  async (): Promise<Missa[]> => {
    const rows = await query<MissaRow>('SELECT * FROM missas ORDER BY ordem ASC')
    return rows.map((r) => ({
      dia: r.dia,
      destaque: Boolean(r.destaque),
      icone: r.icone,
      horarios: JSON.parse(r.horarios) as Missa['horarios'],
    }))
  },
  ['missas'],
  { revalidate: 600, tags: ['missas'] }
)

// ── agenda ───────────────────────────────────────────────────────────────────

type AgendaRow = {
  id: number; ordem: number; dia: number; mes: string
  titulo: string; hora: string; local: string; tipo: string
}

export const getAgenda = unstable_cache(
  async (): Promise<AgendaItem[]> => {
    const rows = await query<AgendaRow>('SELECT * FROM agenda ORDER BY ordem ASC')
    return rows.map((r) => ({
      dia: r.dia,
      mes: r.mes,
      titulo: r.titulo,
      hora: r.hora,
      local: r.local,
      tipo: r.tipo as AgendaItem['tipo'],
    }))
  },
  ['agenda'],
  { revalidate: 300, tags: ['agenda'] }
)

// ── noticias ─────────────────────────────────────────────────────────────────

type NoticiaRow = {
  id: number; ordem: number; titulo: string; categoria: string
  data: string; conteudo: string; imagem: string; destaque: number
}

export const getNoticias = unstable_cache(
  async (): Promise<Noticia[]> => {
    const rows = await query<NoticiaRow>('SELECT * FROM noticias ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: String(r.id),
      titulo: r.titulo,
      categoria: r.categoria,
      data: r.data,
      resumo: r.conteudo,
      imagem: r.imagem,
      destaque: Boolean(r.destaque),
    }))
  },
  ['noticias'],
  { revalidate: 300, tags: ['noticias'] }
)

// ── sacramentos ──────────────────────────────────────────────────────────────

type SacramentoRow = {
  id: number; ordem: number; slug: string; nome: string; descricao: string
  descricao_italico: number; descricao_longa: string; requisitos: string
  agendamento: string; agendamento_itens: string | null
  agendamento_contato: string | null; cta: string | null; href: string; icone: string
}

export const getSacramentos = unstable_cache(
  async (): Promise<Sacramento[]> => {
    const rows = await query<SacramentoRow>('SELECT * FROM sacramentos ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: r.slug,
      slug: r.slug,
      nome: r.nome,
      descricao: r.descricao,
      descricaoItalico: Boolean(r.descricao_italico),
      descricaoLonga: r.descricao_longa,
      requisitos: JSON.parse(r.requisitos) as string[],
      agendamento: r.agendamento,
      agendamentoItens: r.agendamento_itens ? (JSON.parse(r.agendamento_itens) as string[]) : undefined,
      agendamentoContato: r.agendamento_contato ?? undefined,
      cta: r.cta ?? undefined,
      href: r.href,
      icone: r.icone,
    }))
  },
  ['sacramentos'],
  { revalidate: 1800, tags: ['sacramentos'] }
)

export async function getSacramento(slug: string): Promise<Sacramento | undefined> {
  const all = await getSacramentos()
  return all.find((s) => s.slug === slug)
}

// ── grupos ───────────────────────────────────────────────────────────────────

type GrupoRow = {
  id: number; ordem: number; nome: string; descricao: string
  icone: string; encontro: string | null
}

export const getGrupos = unstable_cache(
  async (): Promise<Grupo[]> => {
    const rows = await query<GrupoRow>('SELECT * FROM grupos ORDER BY ordem ASC')
    return rows.map((r) => ({
      nome: r.nome,
      descricao: r.descricao,
      icone: r.icone,
      encontro: r.encontro ?? undefined,
    }))
  },
  ['grupos'],
  { revalidate: 1800, tags: ['grupos'] }
)

// ── episcopal ────────────────────────────────────────────────────────────────

type EpiscopalRow = {
  id: number; ordem: number; nome: string; titulo: string
  cargo: string; biografia: string; foto: string
}

export const getSacerdotes = unstable_cache(
  async (): Promise<Sacerdote[]> => {
    const rows = await query<EpiscopalRow>('SELECT * FROM episcopal ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: String(r.id),
      nome: r.nome,
      titulo: r.titulo,
      cargo: r.cargo,
      foto: r.foto,
      bio: r.biografia,
      bispo: r.cargo === 'bispo',
    }))
  },
  ['episcopal'],
  { revalidate: 1800, tags: ['episcopal'] }
)

// ── bencao_dia ───────────────────────────────────────────────────────────────

type BencaoDiaRow = {
  id: number; ordem: number; dia: string; mensagem: string; autor: string; imagem: string
}

export const getBencaoDia = unstable_cache(
  async (): Promise<BencaoDiaRow[]> => {
    return query<BencaoDiaRow>('SELECT * FROM bencao_dia ORDER BY ordem ASC')
  },
  ['bencao_dia'],
  { revalidate: 3600, tags: ['bencao_dia'] }
)

// ── devocoes (cards permanecem hardcoded no componente) ──────────────────────

export async function getDevocoes(): Promise<{ lista: string[]; cards: DevoItem[] }> {
  const rows = await getBencaoDia()
  const cards: DevoItem[] = [
    { titulo: 'Romaria Anual', descricao: 'Todo mês de março, milhares de peregrinos percorrem o caminho até o Santuário.', icone: 'Church' },
    { titulo: 'Pagamento de Promessas', descricao: 'Espaço dedicado para os fiéis cumprirem as promessas feitas ao Santo Padroeiro.', icone: 'Flame' },
    { titulo: 'Ex-Votos', descricao: 'Sala dos Milagres com os testemunhos de graças alcançadas pelos devotos.', icone: 'Heart' },
    { titulo: 'Óleo Bento', descricao: 'Distribuição de óleo bento em honra a São José, tradição centenária do Santuário.', icone: 'Droplets' },
  ]
  return { lista: rows.map((r) => r.mensagem), cards }
}

// ── mantidos como JSON (sem tabela no schema) ────────────────────────────────

export function getComunidades(): Comunidade[] {
  return readJson<Comunidade[]>('comunidades.json')
}

export function getDevocoesPages(): DevocaoPage[] {
  return readJson<DevocaoPage[]>('devocoes-pages.json')
}

export function getDevocaoPage(slug: string): DevocaoPage | undefined {
  return getDevocoesPages().find((item) => item.slug === slug)
}

export function getDevocaoGalleryImages(slug: string): string[] {
  if (slug !== 'ex-voto-museum') return []
  const imagesDir = join(process.cwd(), 'public', 'img')
  return readdirSync(imagesDir)
    .filter((file) => /^museu_\d+\.(png|jpe?g|webp|avif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map((file) => `/img/${file}`)
}

export function getHistoria(): Historia {
  return readJson<Historia>('historia.json')
}
