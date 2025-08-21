import { z } from "zod"

// REQUIREMENTS LOCK: Baseado nos 18 campos especificados no PRD
export interface Tarefa {
  id: string
  tipoAtividade: string
  nomeAtividade: string
  responsavel: string
  prioridade: 'baixa' | 'media' | 'alta'
  status: 'nao_iniciada' | 'em_andamento' | 'concluida'
  etiquetas?: string[]
  dataInicio: string
  horaInicio: string
  dataFim: string
  horaFim: string
  descricao: string
  cliente: string
  processo: string
  atividade?: string
  subAtividade?: string
  valor?: number
  tipoSegmento?: string
  anexos?: Anexo[]
  observacoes?: string
  criadoEm: string
  atualizadoEm: string
  criadoPor: string
  atualizadoPor?: string
}

export interface Anexo {
  id: string
  nome: string
  tipo: string
  tamanho: number
  url: string
  uploadedAt: string
}

// VALIDATION SCHEMA - Baseado nos critérios de aceite
export const TarefaFormSchema = z.object({
  tipoAtividade: z.string().min(1, "Tipo de atividade é obrigatório"),
  nomeAtividade: z.string().min(1, "Nome da atividade é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.enum(['baixa', 'media', 'alta'], {
    required_error: "Prioridade é obrigatória"
  }),
  etiquetas: z.array(z.string()).optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  horaInicio: z.string().min(1, "Hora de início é obrigatória"),
  dataFim: z.string().min(1, "Data de fim é obrigatória"),
  horaFim: z.string().min(1, "Hora de fim é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  processo: z.string().min(1, "Processo é obrigatório"),
  atividade: z.string().optional(),
  subAtividade: z.string().optional(),
  valor: z.number().optional(),
  tipoSegmento: z.string().optional(),
  anexos: z.array(z.any()).optional(),
  observacoes: z.string().optional(),
})

export type TarefaFormData = z.infer<typeof TarefaFormSchema>

// MOCK DATA TYPES - Para integrações conforme especificado
export interface Cliente {
  id: string
  nome: string
  tipo: 'fisica' | 'juridica'
}

export interface Processo {
  id: string
  numero: string
  titulo: string
  clienteId: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  ativo: boolean
}

// FILTER TYPES - Baseado no critério de busca e filtro
export interface TarefaFilters {
  busca?: string
  responsavel?: string
  cliente?: string
  processo?: string
  prioridade?: string
  status?: string
  tipoAtividade?: string
  dataInicio?: string
  dataFim?: string
}

// PRIORIDADE E STATUS OPTIONS - Conforme especificado
export const PRIORIDADE_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' }
] as const

export const STATUS_OPTIONS = [
  { value: 'nao_iniciada', label: 'Não Iniciada' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' }
] as const

// TIPOS DE ATIVIDADE - Mockado baseado no contexto jurídico
export const TIPO_ATIVIDADE_OPTIONS = [
  { value: 'administrativa', label: 'Administrativa' },
  { value: 'juridica', label: 'Jurídica' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'financeira', label: 'Financeira' },
  { value: 'consultoria', label: 'Consultoria' }
] as const