// types.ts - Tipagens para o sistema de tickets de suporte

export type TicketStatus = 'aberto' | 'em_atendimento' | 'resolvido' | 'fechado'

export type UserAccessLevel = 'total' | 'restrito'

export interface TicketAttachment {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: Date
  uploadedBy: string
}

export interface TicketInteraction {
  id: string
  type: 'mensagem' | 'mudanca_status' | 'mudanca_responsavel' | 'anexo'
  content: string
  attachments?: TicketAttachment[]
  author: string
  authorRole: 'atendente' | 'cliente' | 'sistema'
  createdAt: Date
}

export interface Ticket {
  id: string
  cliente: string
  emailCliente: string
  motivo: string
  descricao: string
  anexos: TicketAttachment[]
  responsavel: string | null
  status: TicketStatus
  historico: TicketInteraction[]
  dataAbertura: Date
  ultimaAcao: Date
}

export interface Attendant {
  id: string
  name: string
  email: string
  avatar?: string
  accessLevel: UserAccessLevel
  ticketsCount?: number
}

export interface TicketFilters {
  status?: TicketStatus | 'todos'
  responsavel?: string | 'todos' | 'sem_responsavel'
  cliente?: string
  search?: string
}

// Constantes para status com cores
export const STATUS_CONFIG = {
  aberto: {
    label: 'Aberto',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🔓'
  },
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '👤'
  },
  resolvido: {
    label: 'Resolvido',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓'
  },
  fechado: {
    label: 'Fechado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '🔒'
  }
} as const

// Função helper para formatar tempo decorrido
export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}min atrás`
  return 'Agora'
}

// Função helper para obter iniciais do nome
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}