import { z } from "zod"

// Enum para tipos de chat
export type ChatType = "internal" | "external"

// Enum para tipos de mensagem
export type MessageType = "text" | "audio" | "attachment"

// Enum para status de mensagem
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "error"

// Enum para status de chat
export type ChatStatus = "active" | "closed" | "archived"

// Interface para participante
export interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline?: boolean
  isExternal: boolean
  lastSeen?: Date
}

// Interface para mensagem
export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  type: MessageType
  content?: string
  audioUrl?: string
  attachmentUrl?: string
  attachmentName?: string
  attachmentSize?: number
  timestamp: Date
  status: MessageStatus
  readBy?: string[]
}

// Interface para chat
export interface Chat {
  id: string
  type: ChatType
  participants: Participant[]
  lastMessage?: Message
  unreadCount: number
  status: ChatStatus
  createdAt: Date
  updatedAt: Date
  secureLink?: string
  clientEmail?: string
  clientDocumentDigits?: string
}

// Schema de validação para iniciar chat externo
export const ExternalChatSchema = z.object({
  clientName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  clientEmail: z.string().email("E-mail inválido"),
  clientDocument: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  sendMethod: z.enum(["email", "whatsapp"]),
  whatsappNumber: z.string().optional(),
  initialMessage: z.string().optional()
})

// Schema de validação para autenticação de cliente externo
export const ClientAuthSchema = z.object({
  email: z.string().email("E-mail inválido"),
  documentDigits: z.string()
    .length(5, "Digite exatamente 5 dígitos")
    .regex(/^\d{5}$/, "Apenas números são permitidos")
})

// Schema de validação para envio de mensagem
export const MessageSchema = z.object({
  content: z.string().min(1, "Mensagem não pode estar vazia").optional(),
  audioBlob: z.instanceof(Blob).optional(),
  attachmentFile: z.instanceof(File).optional()
}).refine(
  (data) => data.content || data.audioBlob || data.attachmentFile,
  { message: "Envie uma mensagem, áudio ou anexo" }
)

// Interface para notificação
export interface Notification {
  id: string
  chatId: string
  message: Message
  timestamp: Date
  read: boolean
}

// Interface para link seguro
export interface SecureLink {
  id: string
  chatId: string
  token: string
  url: string
  expiresAt: Date
  usedAt?: Date
  clientEmail: string
  clientDocumentDigits: string
}

// Mock data types
export interface MockChat extends Chat {
  messages: Message[]
}

// WebSocket event types
export type WebSocketEvent = 
  | { type: "message"; payload: Message }
  | { type: "typing"; payload: { chatId: string; userId: string; isTyping: boolean } }
  | { type: "status"; payload: { userId: string; isOnline: boolean } }
  | { type: "read"; payload: { chatId: string; messageId: string; userId: string } }
  | { type: "chat_closed"; payload: { chatId: string } }

// Form types
export type ExternalChatForm = z.infer<typeof ExternalChatSchema>
export type ClientAuthForm = z.infer<typeof ClientAuthSchema>
export type MessageForm = z.infer<typeof MessageSchema>