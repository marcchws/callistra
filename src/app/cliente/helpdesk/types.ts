import { z } from "zod"

// Enums
export const TicketStatus = {
  ABERTO: "aberto",
  EM_ATENDIMENTO: "em_atendimento",
  RESOLVIDO: "resolvido",
  FECHADO: "fechado",
} as const

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus]

// Tipos de dados
export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: Date
}

export interface Message {
  id: string
  ticketId: string
  content: string
  senderId: string
  senderName: string
  senderType: "cliente" | "atendente"
  attachments: Attachment[]
  createdAt: Date
  read: boolean
}

export interface Ticket {
  id: string
  clientName: string
  clientEmail: string
  subject: string
  description: string
  status: TicketStatusType
  initialAttachment?: Attachment
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  closedAt?: Date
  reopenedAt?: Date
  attendantId?: string
  attendantName?: string
  unreadCount: number
}

// Schemas de validação
export const newTicketSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientEmail: z.string().email("E-mail inválido"),
  subject: z.string().min(1, "Motivo do suporte é obrigatório"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  attachment: z.any().optional(),
})

export const messageSchema = z.object({
  content: z.string().min(1, "Mensagem não pode estar vazia"),
  attachments: z.array(z.any()).optional(),
})

export const searchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["todos", "aberto", "em_atendimento", "resolvido", "fechado"]).optional(),
})

export type NewTicketData = z.infer<typeof newTicketSchema>
export type MessageData = z.infer<typeof messageSchema>
export type SearchData = z.infer<typeof searchSchema>
