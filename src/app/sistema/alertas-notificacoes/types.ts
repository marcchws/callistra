export interface Alert {
  id: string // ID do alerta - identificador único gerado automaticamente
  type: AlertType // Tipo de alerta
  channel: AlertChannel // Canal de recebimento
  message: string // Mensagem do alerta
  eventDateTime: Date // Data/hora do evento
  status: AlertStatus // Status do alerta
  recipientUserId: string // Usuário destinatário
  confidentialityLinked?: boolean // Confidencialidade vinculada (opcional)
  createdAt: Date
  updatedAt: Date
}

export type AlertType = 
  | "confidencialidade"
  | "contas_a_vencer"
  | "movimentacao_processos"
  | "chat_interno"
  | "chat_cliente"
  | "prazos_atividades"
  | "agendas"

export type AlertChannel = "sistema" | "email" | "ambos"

export type AlertStatus = "pendente" | "enviado" | "lido" | "arquivado"

export interface AlertConfiguration {
  userId: string
  alertType: AlertType
  channel: AlertChannel
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AlertFilters {
  type?: AlertType
  status?: AlertStatus
  startDate?: Date
  endDate?: Date
  search?: string
}

export interface AlertStatistics {
  total: number
  pending: number
  read: number
  unread: number
  byType: Record<AlertType, number>
}

// Mapeamento de tipos para labels amigáveis
export const alertTypeLabels: Record<AlertType, string> = {
  confidencialidade: "Confidencialidade",
  contas_a_vencer: "Contas a Vencer",
  movimentacao_processos: "Movimentação de Processos",
  chat_interno: "Chat Interno",
  chat_cliente: "Chat com Cliente",
  prazos_atividades: "Prazos de Atividades",
  agendas: "Agendas"
}

export const alertChannelLabels: Record<AlertChannel, string> = {
  sistema: "Sistema",
  email: "E-mail",
  ambos: "Ambos"
}

export const alertStatusLabels: Record<AlertStatus, string> = {
  pendente: "Pendente",
  enviado: "Enviado",
  lido: "Lido",
  arquivado: "Arquivado"
}
