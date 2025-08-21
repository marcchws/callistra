import { z } from "zod"

// Tipos baseados nos campos especificados no PRD
export interface ChatParticipant {
  id: string
  name: string
  email: string
  type: 'user' | 'external_client'
  avatar?: string
  lastSeen?: Date
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  type: 'text' | 'audio' | 'file'
  fileName?: string
  fileSize?: number
  filePath?: string
  timestamp: Date
  isRead: boolean
  readBy?: string[]
}

export interface Chat {
  id: string
  participants: ChatParticipant[]
  type: 'internal' | 'external'
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
  secureLink?: string
  clientEmail?: string
  clientDocumentDigits?: string
  createdAt: Date
  updatedAt: Date
}

// Schemas de validação baseados nos critérios de aceite
export const createExternalChatSchema = z.object({
  clientEmail: z.string().email("E-mail inválido").min(1, "E-mail obrigatório"),
  clientName: z.string().min(1, "Nome do cliente obrigatório"),
  documentDigits: z.string().length(5, "Informe exatamente 5 dígitos do documento"),
  sendMethod: z.enum(['email', 'whatsapp'], {
    required_error: "Selecione o método de envio"
  })
})

export const messageSchema = z.object({
  content: z.string().min(1, "Mensagem não pode estar vazia"),
  type: z.enum(['text', 'audio', 'file']).default('text')
})

export const externalAccessSchema = z.object({
  email: z.string().email("E-mail inválido"),
  documentDigits: z.string().length(5, "Informe exatamente 5 dígitos do documento")
})

export type CreateExternalChatFormData = z.infer<typeof createExternalChatSchema>
export type MessageFormData = z.infer<typeof messageSchema>
export type ExternalAccessFormData = z.infer<typeof externalAccessSchema>

// Estados para gerenciamento da aplicação
export interface ChatState {
  chats: Chat[]
  selectedChat: Chat | null
  messages: Record<string, ChatMessage[]>
  loading: boolean
  error: string | null
  searchTerm: string
  isConnected: boolean
}

// Tipos para WebSocket
export interface WebSocketMessage {
  type: 'message' | 'notification' | 'status'
  data: any
  chatId?: string
  timestamp: Date
}