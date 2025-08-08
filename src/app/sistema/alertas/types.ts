import { z } from "zod"

// Tipos de alerta conforme especificação
export type AlertType = 
  | "confidencialidade"
  | "contas_vencer" 
  | "movimentacao_processos"
  | "chat_interno"
  | "chat_cliente"
  | "prazos_atividades"
  | "agendas"

// Canais de recebimento
export type AlertChannel = "sistema" | "email" | "ambos"

// Status do alerta
export type AlertStatus = "pendente" | "enviado" | "lido" | "arquivado"

// Interface do alerta
export interface Alert {
  id: string
  tipo: AlertType
  canal: AlertChannel
  mensagem: string
  dataHoraEvento: Date
  status: AlertStatus
  usuarioDestinatario: string
  confidencialidadeVinculada?: boolean
  createdAt: Date
  updatedAt: Date
}

// Configurações de preferências do usuário
export interface AlertPreferences {
  [key: string]: AlertChannel
}

// Filtros para o painel de alertas
export interface AlertFilters {
  tipo?: AlertType
  status?: AlertStatus
  dataInicio?: Date
  dataFim?: Date
  busca?: string
}

// Schema de validação para configurações
export const AlertPreferencesSchema = z.object({
  confidencialidade: z.enum(["sistema", "email", "ambos"]),
  contas_vencer: z.enum(["sistema", "email", "ambos"]),
  movimentacao_processos: z.enum(["sistema", "email", "ambos"]),
  chat_interno: z.enum(["sistema", "email", "ambos"]),
  chat_cliente: z.enum(["sistema", "email", "ambos"]),
  prazos_atividades: z.enum(["sistema", "email", "ambos"]),
  agendas: z.enum(["sistema", "email", "ambos"])
})

// Labels para exibição
export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  confidencialidade: "Confidencialidade",
  contas_vencer: "Contas a Vencer",
  movimentacao_processos: "Movimentação de Processos",
  chat_interno: "Chat Interno",
  chat_cliente: "Chat com Cliente",
  prazos_atividades: "Prazos de Atividades",
  agendas: "Agendas"
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  pendente: "Pendente",
  enviado: "Enviado",
  lido: "Lido",
  arquivado: "Arquivado"
}

export const ALERT_CHANNEL_LABELS: Record<AlertChannel, string> = {
  sistema: "Apenas Sistema",
  email: "Apenas E-mail",
  ambos: "Sistema e E-mail"
}