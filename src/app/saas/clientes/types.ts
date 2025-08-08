import { z } from "zod"

// TIPOS BASEADOS NOS REQUIREMENTS MATRIX - ZERO DERIVA DE ESCOPO

export interface Cliente {
  id: string
  nomeEscritorio: string
  nomeContratante: string
  emailContratante: string
  cnpj: string
  telefone: string
  nomePlano: string
  vigenciaPlano: string
  valorPlano: number
  formaPagamento: string
  descricaoPlano: string
  status: 'ativa' | 'inativa' | 'inadimplente'
  quantidadeUsuarios: {
    usado: number
    disponivel: number
  }
  quantidadeProcessos: {
    usado: number
    disponivel: number
  }
  tokensIA: {
    usado: number
    disponivel: number
  }
  dataCriacao: string
  dataAtualizacao: string
}

// SCHEMA DE VALIDAÇÃO ZOD - BASEADO NOS ACCEPTANCE CRITERIA
export const ClienteFormSchema = z.object({
  nomeEscritorio: z.string()
    .min(3, "Nome do escritório deve ter pelo menos 3 caracteres")
    .max(100, "Nome do escritório deve ter no máximo 100 caracteres"),
  nomeContratante: z.string()
    .min(3, "Nome do contratante deve ter pelo menos 3 caracteres")
    .max(100, "Nome do contratante deve ter no máximo 100 caracteres"),
  emailContratante: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  cnpj: z.string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve ter o formato XX.XXX.XXX/XXXX-XX")
    .length(18, "CNPJ deve ter 18 caracteres"),
  telefone: z.string()
    .regex(/^\+\d{2}\s\d{2}\s\d{4,5}-\d{4}$/, "Telefone deve ter o formato +XX XX XXXXX-XXXX"),
  nomePlano: z.string()
    .min(1, "Plano é obrigatório"),
  vigenciaPlano: z.string()
    .min(1, "Vigência do plano é obrigatória"),
  valorPlano: z.number()
    .min(0, "Valor do plano deve ser maior ou igual a zero")
    .max(99999.99, "Valor do plano deve ser menor que R$ 99.999,99"),
  formaPagamento: z.string()
    .min(1, "Forma de pagamento é obrigatória"),
  descricaoPlano: z.string()
    .min(10, "Descrição do plano deve ter pelo menos 10 caracteres")
    .max(500, "Descrição do plano deve ter no máximo 500 caracteres"),
  status: z.enum(['ativa', 'inativa', 'inadimplente']).default('ativa')
})

export type ClienteFormData = z.infer<typeof ClienteFormSchema>

// FILTROS PARA LISTAGEM - BASEADOS NOS ACCEPTANCE CRITERIA
export interface ClienteFilters {
  busca: string // ID, nome empresa, e-mail
  plano: string
  status: 'todos' | 'ativa' | 'inativa' | 'inadimplente'
}

// TIPOS PARA OPERAÇÕES CRUD
export type ClienteOperation = 'create' | 'edit' | 'delete' | 'toggle-status' | 'change-plan' | 'change-ownership'

export interface ClienteOperationResult {
  success: boolean
  message: string
  data?: Cliente
}

// TIPOS PARA TROCA DE PLANO
export interface TrocaPlanoData {
  clienteId: string
  novoPlano: string
  motivo: string
}

// TIPOS PARA ALTERAÇÃO DE TITULARIDADE
export interface AlteracaoTitularidadeData {
  clienteId: string
  novoEmail: string
  novoNome: string
  novoTelefone: string
  motivo: string
}

// TIPOS PARA EXPORTAÇÃO
export type ExportFormat = 'pdf' | 'excel'
export interface ExportOptions {
  format: ExportFormat
  filters?: ClienteFilters
  selectedIds?: string[]
}
