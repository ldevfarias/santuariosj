import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { unstable_cache } from 'next/cache'

import { query } from './db'

function dbCache<T>(fn: () => Promise<T>, keys: string[], opts: { revalidate: number; tags: string[] }): () => Promise<T> {
  if (process.env.NODE_ENV === 'development') return fn
  return unstable_cache(fn, keys, opts)
}
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

function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// ── missas ───────────────────────────────────────────────────────────────────

type MissaRow = {
  id: number; ordem: number; dia: string; destaque: number
  horarios: string; programacao_semanal: string | null; observacao: string | null
}

export const getMissas = dbCache(
  async (): Promise<Missa[]> => {
    const rows = await query<MissaRow>('SELECT * FROM missas ORDER BY ordem ASC')
    return rows.map((r) => ({
      dia: r.dia,
      destaque: Boolean(r.destaque),
      horarios: parseJsonField(r.horarios, [] as Missa['horarios']),
      programacaoSemanal: parseJsonField(r.programacao_semanal, undefined as string[] | undefined),
      observacao: r.observacao ?? undefined,
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

export const getAgenda = dbCache(
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

export const getNoticias = dbCache(
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

// O banco (gerido pelo CMS) não armazena slug/href/cta/icone para sacramentos
// e usa os nomes `versiculo` (descrição curta) e `informacoes` (texto de
// agendamento). Esses metadados de apresentação são derivados aqui, com chave
// na coluna `ordem`, mantendo a UI estável independente do schema do CMS.
type SacramentoMeta = { slug: string; icone: string; cta: string }

const SACRAMENTO_META: Record<number, SacramentoMeta> = {
  0: { slug: 'baptism', icone: 'Droplets', cta: 'Agendar' },
  1: { slug: 'confirmation', icone: 'Wind', cta: 'Saiba mais' },
  2: { slug: 'eucharist', icone: 'Wheat', cta: 'Saiba mais' },
  3: { slug: 'confession', icone: 'ShieldCheck', cta: 'Ver horários' },
  4: { slug: 'matrimony', icone: 'Heart', cta: 'Agendar' },
  5: { slug: 'anointing-of-the-sick', icone: 'HeartPulse', cta: 'Solicitar' },
  6: { slug: 'holy-orders', icone: 'Cross', cta: 'Saiba mais' },
}

type SacramentoRow = {
  id: number; ordem: number; nome: string; versiculo: string
  descricao_italico: number; descricao_longa: string; requisitos: string
  informacoes: string; agendamento_contato: string | null
}

export const getSacramentos = dbCache(
  async (): Promise<Sacramento[]> => {
    const rows = await query<SacramentoRow>('SELECT * FROM sacramentos ORDER BY ordem ASC')
    return rows.map((r) => {
      const meta = SACRAMENTO_META[r.ordem]
      const slug = meta?.slug ?? `sacramento-${r.ordem}`
      return {
        id: slug,
        slug,
        nome: r.nome,
        descricao: r.versiculo,
        descricaoItalico: Boolean(r.descricao_italico),
        descricaoLonga: r.descricao_longa,
        requisitos: parseJsonField(r.requisitos, [] as string[]),
        agendamento: r.informacoes,
        agendamentoItens: undefined,
        agendamentoContato: r.agendamento_contato ?? undefined,
        cta: meta?.cta,
        href: `/sacramentos/${slug}`,
        icone: meta?.icone ?? 'Cross',
      }
    })
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

export const getGrupos = dbCache(
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

export const getSacerdotes = dbCache(
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

export type BencaoDiaRow = {
  id: number; ordem: number; dia: string; mensagem: string; autor: string; imagem: string
}

export const getBencaoDia = dbCache(
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

// ── hero slides ──────────────────────────────────────────────────────────────

type HeroSlideRow = {
  id: number; ordem: number; imagem: string; alt: string; position: string | null
}

const FALLBACK_SLIDES = [
  { src: '/img/sagrada_familia.avif', alt: 'Sagrada Família — Santuário de São José de Ribamar', position: 'object-center' },
  { src: '/img/foto_3.jpeg', alt: 'Igreja do Santuário', position: 'object-[center_80%]' },
]

export const getHeroSlides = dbCache(
  async () => {
    const rows = await query<HeroSlideRow>('SELECT * FROM hero_slides ORDER BY ordem ASC')
    if (rows.length === 0) return FALLBACK_SLIDES
    return rows.map((r) => ({
      src: r.imagem,
      alt: r.alt,
      position: r.position ?? 'object-center',
    }))
  },
  ['hero_slides'],
  { revalidate: 3600, tags: ['hero_slides'] }
)

// ── hero ─────────────────────────────────────────────────────────────────────

type HeroRow = {
  id: number; titulo: string; titulo_destaque: string; subtitulo: string
}

export const getHero = dbCache(
  async () => {
    const rows = await query<HeroRow>('SELECT * FROM hero LIMIT 1')
    const r = rows[0]
    if (!r) return { titulo: '', tituloDestaque: '', subtitulo: '' }
    return { titulo: r.titulo, tituloDestaque: r.titulo_destaque, subtitulo: r.subtitulo }
  },
  ['hero'],
  { revalidate: 3600, tags: ['hero'] }
)

// ── comunidades ──────────────────────────────────────────────────────────────

type ComunidadeRow = {
  id: number; ordem: number; nome: string; endereco: string
  celebracoes: string; mapa_url: string; imagem: string
}

export const getComunidades = dbCache(
  async (): Promise<Comunidade[]> => {
    const rows = await query<ComunidadeRow>('SELECT * FROM comunidades ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      endereco: r.endereco,
      celebracoes: r.celebracoes,
      mapaUrl: r.mapa_url,
      imagem: r.imagem,
    }))
  },
  ['comunidades'],
  { revalidate: 1800, tags: ['comunidades'] }
)

// ── mantidos como JSON (sem tabela no schema) ────────────────────────────────

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
