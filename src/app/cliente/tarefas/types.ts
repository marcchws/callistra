import { z } from "zod"

// Enums para os status e prioridades
export const TaskStatus = {
  NAO_INICIADA: "nao_iniciada",
  EM_ANDAMENTO: "em_andamento",
  CONCLUIDA: "concluida"
} as const

export const TaskPriority = {
  BAIXA: "baixa",
  MEDIA: "media",
  ALTA: "alta"
} as const

export const TaskActivityType = {
  ADMINISTRATIVA: "administrativa",
  JURIDICA: "juridica",
  FINANCEIRA: "financeira",
  ATENDIMENTO: "atendimento",
  OUTROS: "outros"
} as const

// Schema de validação para criação/edição de tarefa
export const taskSchema = z.object({
  tipoAtividade: z.enum(["administrativa", "juridica", "financeira", "atendimento", "outros"], {
    required_error: "Tipo de atividade é obrigatório"
  }),
  nomeAtividade: z.string().min(1, "Nome da atividade é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.enum(["baixa", "media", "alta"], {
    required_error: "Prioridade é obrigatória"
  }),
  status: z.enum(["nao_iniciada", "em_andamento", "concluida"]).default("nao_iniciada"),
  etiquetas: z.array(z.string()).optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  horaInicio: z.string().min(1, "Hora de início é obrigatória"),
  dataFim: z.string().min(1, "Data de término é obrigatória"),
  horaFim: z.string().min(1, "Hora de término é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  processo: z.string().min(1, "Processo é obrigatório"),
  atividade: z.string().optional(),
  subAtividade: z.string().optional(),
  valor: z.number().optional(),
  tipoSegmento: z.string().optional(),
  observacoes: z.string().optional()
})

export type TaskFormData = z.infer<typeof taskSchema>

// Interface completa da tarefa (incluindo campos do sistema)
export interface Task extends TaskFormData {
  id: string
  anexos?: TaskAttachment[]
  criadoEm: Date
  atualizadoEm: Date
  criadoPor: string
  atualizadoPor: string
  historico?: TaskHistory[]
}

export interface TaskAttachment {
  id: string
  nome: string
  url: string
  tamanho: number
  tipo: string
  uploadedAt: Date
  uploadedBy: string
}

export interface TaskHistory {
  id: string
  acao: "criacao" | "edicao" | "remocao" | "status_change" | "anexo_adicionado" | "anexo_removido"
  descricao: string
  usuario: string
  data: Date
  dadosAnteriores?: Partial<Task>
  dadosNovos?: Partial<Task>
}

// Filtros para busca
export interface TaskFilters {
  search?: string
  responsavel?: string
  cliente?: string
  processo?: string
  prioridade?: string
  status?: string
  tipoAtividade?: string
  dataInicio?: string
  dataFim?: string
}

// Mock data para desenvolvimento
export const mockClientes = [
  { value: "cliente1", label: "João Silva - CPF: 123.456.789-00" },
  { value: "cliente2", label: "Maria Santos - CPF: 987.654.321-00" },
  { value: "cliente3", label: "Empresa ABC LTDA - CNPJ: 12.345.678/0001-90" },
  { value: "cliente4", label: "Pedro Oliveira - CPF: 456.789.123-00" },
  { value: "cliente5", label: "Tech Solutions S.A. - CNPJ: 98.765.432/0001-10" }
]

export const mockProcessos = [
  { value: "processo1", label: "0001234-56.2024.8.26.0100 - Ação Trabalhista" },
  { value: "processo2", label: "0005678-90.2024.8.26.0100 - Ação Civil" },
  { value: "processo3", label: "0009012-34.2024.8.26.0100 - Ação de Cobrança" },
  { value: "processo4", label: "0003456-78.2024.8.26.0100 - Mandado de Segurança" },
  { value: "processo5", label: "0007890-12.2024.8.26.0100 - Ação de Indenização" }
]

export const mockResponsaveis = [
  { value: "adv1", label: "Dr. Carlos Mendes - OAB/SP 123.456" },
  { value: "adv2", label: "Dra. Ana Paula Costa - OAB/SP 234.567" },
  { value: "adv3", label: "Dr. Roberto Alves - OAB/SP 345.678" },
  { value: "adv4", label: "Dra. Juliana Lima - OAB/SP 456.789" },
  { value: "adv5", label: "Dr. Fernando Santos - OAB/SP 567.890" }
]

export const mockAtividades = [
  { value: "ativ1", label: "Elaboração de Petição" },
  { value: "ativ2", label: "Análise de Documentos" },
  { value: "ativ3", label: "Reunião com Cliente" },
  { value: "ativ4", label: "Audiência" },
  { value: "ativ5", label: "Protocolo de Documentos" }
]

export const mockSubAtividades = [
  { value: "sub1", label: "Petição Inicial" },
  { value: "sub2", label: "Contestação" },
  { value: "sub3", label: "Recurso" },
  { value: "sub4", label: "Manifestação" },
  { value: "sub5", label: "Alegações Finais" }
]

export const mockSegmentos = [
  { value: "seg1", label: "Direito Trabalhista" },
  { value: "seg2", label: "Direito Civil" },
  { value: "seg3", label: "Direito Empresarial" },
  { value: "seg4", label: "Direito Tributário" },
  { value: "seg5", label: "Direito Penal" }
]
