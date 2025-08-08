import { z } from "zod"

// TIPOS BASEADOS NOS REQUIREMENTS MATRIX - ZERO DERIVA DE ESCOPO

export interface Plano {
  id: string
  nome: string
  descricao: string
  precoMensal: number
  precoAnual: number
  ativo: boolean
  limitacoes: {
    maxUsuarios: number
    maxProcessos: number
    storageGB: number
  }
  recursos: {
    gestaoUsuarios: boolean
    gestaoClientes: boolean
    gestaoProcessos: boolean
    agenda: boolean
    contratos: boolean
    tarefas: boolean
    chatInterno: boolean
    helpdesk: boolean
    financeiro: boolean
    relatorios: boolean
  }
  dataCriacao: string
  dataAtualizacao: string
}

// SCHEMA DE VALIDAÇÃO ZOD - BASEADO NOS ACCEPTANCE CRITERIA
export const PlanoFormSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  descricao: z.string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  precoMensal: z.number()
    .min(0, "Preço mensal deve ser maior que zero")
    .max(9999.99, "Preço mensal deve ser menor que R$ 9.999,99"),
  precoAnual: z.number()
    .min(0, "Preço anual deve ser maior que zero")
    .max(99999.99, "Preço anual deve ser menor que R$ 99.999,99"),
  ativo: z.boolean().default(true),
  limitacoes: z.object({
    maxUsuarios: z.number()
      .min(1, "Mínimo 1 usuário")
      .max(1000, "Máximo 1000 usuários"),
    maxProcessos: z.number()
      .min(1, "Mínimo 1 processo")
      .max(100000, "Máximo 100.000 processos"),
    storageGB: z.number()
      .min(1, "Mínimo 1 GB")
      .max(1000, "Máximo 1000 GB")
  }),
  recursos: z.object({
    gestaoUsuarios: z.boolean().default(true),
    gestaoClientes: z.boolean().default(true),
    gestaoProcessos: z.boolean().default(true),
    agenda: z.boolean().default(false),
    contratos: z.boolean().default(false),
    tarefas: z.boolean().default(false),
    chatInterno: z.boolean().default(false),
    helpdesk: z.boolean().default(false),
    financeiro: z.boolean().default(false),
    relatorios: z.boolean().default(false)
  })
})

export type PlanoFormData = z.infer<typeof PlanoFormSchema>

// FILTROS PARA LISTAGEM
export interface PlanoFilters {
  busca: string
  status: 'todos' | 'ativo' | 'inativo'
  precoMin: number | null
  precoMax: number | null
}

// TIPOS PARA OPERAÇÕES CRUD
export type PlanoOperation = 'create' | 'edit' | 'delete' | 'toggle-status'

export interface PlanoOperationResult {
  success: boolean
  message: string
  data?: Plano
}
