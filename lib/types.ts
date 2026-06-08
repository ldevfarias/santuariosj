export type Horario = {
  hora: string
  desc: string
}

export type Missa = {
  dia: string
  destaque?: boolean
  icone: string
  horarios: Horario[]
  programacaoSemanal?: string[]
  observacao?: string
}

export type AgendaItem = {
  dia: number
  mes: string
  titulo: string
  hora: string
  local: string
  tipo: 'festivo' | 'liturgico' | 'padroeiro'
}

export type Noticia = {
  id: string
  titulo: string
  categoria: string
  data: string
  resumo: string
  imagem: string
  destaque?: boolean
}

export type Sacramento = {
  id: string
  slug: string
  nome: string
  descricao: string
  descricaoItalico?: boolean
  descricaoLonga: string
  requisitos: string[]
  agendamento: string
  agendamentoItens?: string[]
  agendamentoContato?: string
  cta?: string
  href: string
  icone: string
}

export type Grupo = {
  nome: string
  descricao: string
  icone: string
  encontro?: string
}

export type Comunidade = {
  id: number
  nome: string
  endereco: string
  celebracoes: string
  mapaUrl: string
  imagem: string
}

export type Devocao = {
  nome: string
  descricao: string
  icone: string
}

export type DevocaoPage = {
  slug: string
  titulo: string
  descricaoHero: string
  resumoArtigo: string
  paragrafos: string[]
  imagemSrc: string
  imagemAlt: string
  imagemSecundariaSrc?: string
  imagemSecundariaAlt?: string
  href: string
}

export type DevoItem = {
  titulo: string
  descricao: string
  icone: string
}

export type MarcoHistorico = {
  ano: string
  titulo: string
  descricao: string
}

export type Historia = {
  intro: string
  lenda: string
  milagre: string
  marcos: MarcoHistorico[]
  complexo: string[]
}

export type ContactFormState = {
  success: boolean
  message: string
} | null

export type Sacerdote = {
  id: string
  nome: string
  titulo: string
  cargo: 'bispo' | 'reitor' | 'paroco_solidario' | 'diacono' | (string & {})
  foto: string
  bio: string
  bispo: boolean
}
