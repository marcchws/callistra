import { z } from "zod"

// Tipos baseados nos campos especificados no PRD - Requirements Lock
export interface Ticket {
  id: string
  nomeCliente: string
  emailCliente: string
  motivoSuporte: string
  descricao: string
  anexoInicial?: string
  status: 'aberto' | 'em_atendimento' | 'resolvido' | 'fechado'
  dataHoraAbertura: Date
  historicoInteracoes: TicketInteraction[]
  createdAt: Date
  updatedAt: Date
}

export interface TicketInteraction {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderType: 'cliente' | 'atendente'
  content: string
  type: 'text' | 'file'
  fileName?: string
  fileSize?: number
  filePath?: string
  timestamp: Date
  isRead: boolean
}

// Schemas de validação baseados nos critérios de aceite
export const createTicketSchema = z.object({
  nomeCliente: z.string().min(1, "Nome do cliente é obrigatório"),
  emailCliente: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  motivoSuporte: z.string().min(1, "Motivo do suporte é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória")
})

export const messageTicketSchema = z.object({
  content: z.string().min(1, "Mensagem não pode estar vazia"),
  type: z.enum(['text', 'file']).default('text')
})

export const ticketSearchSchema = z.object({
  searchTerm: z.string().optional(),
  status: z.enum(['todos', 'aberto', 'em_atendimento', 'resolvido', 'fechado']).default('todos'),
  motivo: z.string().optional()
})

export type CreateTicketFormData = z.infer<typeof createTicketSchema>
export type MessageTicketFormData = z.infer<typeof messageTicketSchema>
export type TicketSearchFormData = z.infer<typeof ticketSearchSchema>

// Estados para gerenciamento da aplicação
export interface HelpdeskState {
  tickets: Ticket[]
  selectedTicket: Ticket | null
  interactions: Record<string, TicketInteraction[]>
  loading: boolean
  error: string | null
  searchTerm: string
  statusFilter: string
  motivoFilter: string
}

// Tipos para notificações em tempo real
export interface TicketNotification {
  type: 'nova_mensagem' | 'status_alterado' | 'ticket_criado'
  ticketId: string
  message: string
  timestamp: Date
}

// Status labels para interface
export const statusLabels = {
  aberto: 'Aberto',
  em_atendimento: 'Em Atendimento', 
  resolvido: 'Resolvido',
  fechado: 'Fechado'
} as const

export const statusColors = {
  aberto: 'bg-blue-100 text-blue-800',
  em_atendimento: 'bg-yellow-100 text-yellow-800',
  resolvido: 'bg-green-100 text-green-800', 
  fechado: 'bg-gray-100 text-gray-800'
} as const
