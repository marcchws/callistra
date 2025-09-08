import { z } from "zod"

// Enums
export enum TipoItem {
  EVENTO = "Evento",
  REUNIAO = "Reunião",
  TAREFA = "Tarefa",
  BLOQUEIO = "Bloqueio de agenda"
}

export enum StatusEvento {
  EM_ANDAMENTO = "Em andamento",
  PENDENTE = "Pendente",
  CONCLUIDO = "Concluído",
  BLOQUEIO = "Bloqueio"
}

export enum RespostaParticipante {
  SIM = "Sim",
  NAO = "Não",
  TALVEZ = "Talvez",
  PENDENTE = "Pendente"
}

export enum RecorrenciaTipo {
  NENHUMA = "Nenhuma",
  DIARIA = "Diária",
  SEMANAL = "Semanal",
  MENSAL = "Mensal",
  ANUAL = "Anual",
  PERSONALIZADA = "Personalizada"
}

// Interfaces
export interface Participante {
  id: string
  nome: string
  email: string
  resposta: RespostaParticipante
  respostaObrigatoria: boolean
  respondidoEm?: Date
}

export interface Anexo {
  id: string
  nome: string
  url: string
  tamanho: number
  tipo: string
  uploadEm: Date
}

export interface ConfiguracoesExibicao {
  inicioSemana: "domingo" | "segunda"
  mostrarFinaisSemana: boolean
  formatoData: "DD/MM/YYYY" | "MM/DD/YYYY"
  formatoHora: "24h" | "12h"
}

export interface EventoAgenda {
  id: string
  titulo: string
  tipoItem: TipoItem
  participantes: Participante[]
  dataHoraInicio: Date
  dataHoraTermino: Date
  recorrencia: {
    tipo: RecorrenciaTipo
    intervalo?: number
    diasSemana?: number[]
    diaDoMes?: number
    dataFim?: Date
  }
  respostaObrigatoria: boolean
  linkVideoconferencia?: string
  clienteId?: string
  clienteNome?: string
  processoId?: string
  processoNumero?: string
  descricao?: string
  anexos: Anexo[]
  status: StatusEvento
  criadoPor: string
  criadoEm: Date
  atualizadoEm: Date
  cor?: string
  notificacaoEnviada: boolean
  lembreteMinutos?: number
}

// Schema de validação Zod
export const EventoFormSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  tipoItem: z.nativeEnum(TipoItem),
  participantes: z.array(z.string()).optional(),
  dataHoraInicio: z.coerce.date(),
  dataHoraTermino: z.coerce.date(),
  recorrencia: z.object({
    tipo: z.nativeEnum(RecorrenciaTipo),
    intervalo: z.number().optional(),
    diasSemana: z.array(z.number()).optional(),
    diaDoMes: z.number().optional(),
    dataFim: z.coerce.date().optional()
  }),
  respostaObrigatoria: z.boolean().default(false),
  linkVideoconferencia: z.string().url("Link inválido").optional().or(z.literal("")),
  clienteId: z.string().optional(),
  processoId: z.string().optional(),
  descricao: z.string().max(1000, "Descrição muito longa").optional(),
  lembreteMinutos: z.number().optional()
}).refine(
  (data) => data.dataHoraTermino > data.dataHoraInicio,
  {
    message: "Data/hora de término deve ser posterior ao início",
    path: ["dataHoraTermino"]
  }
)

// Tipo derivado do schema
export type EventoFormData = z.infer<typeof EventoFormSchema>

// Filtros
export interface FiltrosAgenda {
  busca?: string
  status?: StatusEvento | "todos"
  tipoItem?: TipoItem | "todos"
  resposta?: RespostaParticipante | "todos"
  dataInicio?: Date
  dataFim?: Date
  clienteId?: string
  processoId?: string
}

// Configuração de visualização
export type ViewMode = "month" | "day" | "week"

export interface CalendarConfig {
  viewMode: ViewMode
  selectedDate: Date
  showWeekends: boolean
  businessHours: {
    start: string
    end: string
  }
}
