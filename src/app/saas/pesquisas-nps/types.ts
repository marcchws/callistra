import { z } from "zod"

// =====================================================
// ENUMS PRINCIPAIS
// =====================================================

export const QuestionType = {
  MULTIPLE_CHOICE: "multiple_choice",
  TEXT: "text"
} as const

export const SurveyPeriodicity = {
  ONCE: "once",
  RECURRING: "recurring", 
  ON_LOGIN: "on_login"
} as const

export const SurveyStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft"
} as const

// =====================================================
// ALIASES PARA COMPATIBILIDADE COM COMPONENTES LEGADOS
// =====================================================

export const TipoPergunta = {
  MULTIPLA_ESCOLHA: "multiple_choice",
  DISCURSIVA: "text"
} as const

export const Periodicidade = {
  UNICA: "once",
  RECORRENTE: "recurring",
  POR_LOGIN: "on_login"
} as const

export const StatusPesquisa = {
  ATIVA: "active",
  INATIVA: "inactive",
  RASCUNHO: "draft"
} as const

// =====================================================
// SCHEMAS ZOD
// =====================================================

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Pergunta obrigatória"),
  type: z.enum([QuestionType.MULTIPLE_CHOICE, QuestionType.TEXT]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
  order: z.number()
})

export const SurveySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome da pesquisa obrigatório"),
  questions: z.array(QuestionSchema).min(1, "Adicione pelo menos uma pergunta"),
  periodicity: z.enum([
    SurveyPeriodicity.ONCE,
    SurveyPeriodicity.RECURRING,
    SurveyPeriodicity.ON_LOGIN
  ]),
  recurringMonths: z.number().min(1).max(12).optional(),
  targetProfiles: z.array(z.string()).min(1, "Selecione pelo menos um perfil"),
  targetUsers: z.array(z.string()).optional(),
  startDate: z.string().min(1, "Data de início obrigatória"),
  endDate: z.string().optional(),
  status: z.enum([
    SurveyStatus.ACTIVE,
    SurveyStatus.INACTIVE,
    SurveyStatus.DRAFT
  ]).default(SurveyStatus.DRAFT),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const ResponseSchema = z.object({
  id: z.string(),
  surveyId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userProfile: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.array(z.string())])
  })),
  respondedAt: z.string()
})

// Schema para formulário legado (compatibilidade)
export const PesquisaSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  descricao: z.string().optional(),
  perguntas: z.array(z.object({
    texto: z.string().min(1, "Pergunta obrigatória"),
    tipo: z.enum(["multiple_choice", "text"]),
    opcoes: z.array(z.string()).optional(),
    obrigatoria: z.boolean()
  })).min(1, "Adicione pelo menos uma pergunta"),
  periodicidade: z.enum(["once", "recurring", "on_login"]),
  intervaloMeses: z.number().optional(),
  perfisAlvo: z.array(z.string()).min(1, "Selecione pelo menos um perfil"),
  dataInicio: z.date(),
  dataTermino: z.date().optional(),
  status: z.enum(["active", "inactive", "draft"])
})

// =====================================================
// TIPOS PRINCIPAIS
// =====================================================

export type Question = z.infer<typeof QuestionSchema>
export type Survey = z.infer<typeof SurveySchema>
export type Response = z.infer<typeof ResponseSchema>

// =====================================================
// TIPOS PARA COMPATIBILIDADE
// =====================================================

export type Pergunta = {
  id: string
  texto: string
  tipo: typeof TipoPergunta[keyof typeof TipoPergunta]
  opcoes?: string[]
  obrigatoria: boolean
  ordem: number
}

export type Pesquisa = {
  id: string
  nome: string
  descricao?: string
  perguntas: Pergunta[]
  periodicidade: typeof Periodicidade[keyof typeof Periodicidade]
  intervaloMeses?: number
  perfisAlvo: string[]
  usuariosEspecificos?: string[]
  dataInicio: Date
  dataTermino?: Date
  status: typeof StatusPesquisa[keyof typeof StatusPesquisa]
  totalRespostas: number
  dataCriacao: Date
  dataAtualizacao: Date
}

export type Resposta = {
  id: string
  pesquisaId: string
  usuarioId: string
  usuario: {
    id: string
    nome: string
    email: string
    perfil: {
      id: string
      nome: string
    }
  }
  perguntaId: string
  resposta: string | string[]
  dataResposta: Date
}

// =====================================================
// INTERFACES DE FILTROS
// =====================================================

// Filtros principais
export interface SurveyFilters {
  status?: string
  profile?: string
  period?: {
    start: string
    end: string
  }
}

export interface ResponseFilters {
  userId?: string
  userProfile?: string
  period?: {
    start: string
    end: string
  }
}

// Filtros para componentes legados
export interface PesquisaFilters {
  status?: string
  nome?: string
  perfil?: string
  periodo?: {
    inicio: Date
    fim: Date
  }
}

export interface RespostaFilters {
  usuarioId?: string
  perfilId?: string
  periodo?: {
    inicio: Date
    fim: Date
  }
}

// =====================================================
// INTERFACES DE USUÁRIOS E PERFIS
// =====================================================

// Interfaces principais
export interface UserProfile {
  id: string
  name: string
  description?: string
}

export interface User {
  id: string
  name: string
  email: string
  profile: string
}

// Interfaces para compatibilidade
export interface PerfilUsuario {
  id: string
  nome: string
  descricao?: string
}

export interface Usuario {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
}

// =====================================================
// OUTROS TIPOS
// =====================================================

export type ExportFormat = "pdf" | "excel"
