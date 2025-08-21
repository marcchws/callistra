import { z } from "zod"

// Enums para status e planos
export const StatusAssinatura = {
  ATIVA: "ativa",
  INATIVA: "inativa",
  INADIMPLENTE: "inadimplente"
} as const

export const PlanoTipo = {
  FREE: "Free",
  STANDARD: "Standard",
  PREMIUM: "Premium",
  ENTERPRISE: "Enterprise"
} as const

export const FormaPagamento = {
  ANUAL_VISTA: "Plano anual, à vista",
  ANUAL_PARCELADO: "Plano anual, 12x no cartão",
  MENSAL_VISTA: "Plano mensal, à vista no cartão"
} as const

// Tipo principal do Cliente
export interface Cliente {
  id: string
  nomeEscritorio: string
  nomeContratante: string
  emailContratante: string
  cnpj: string
  telefone: string
  nomePlano: keyof typeof PlanoTipo
  vigenciaPlano: Date
  valorPlano: number
  formaPagamento: string
  descricaoPlano: string
  status: keyof typeof StatusAssinatura
  // Métricas de uso
  usuariosUsados: number
  usuariosDisponiveis: number
  processosUsados: number
  processosDisponiveis: number
  tokensIAUsados: number
  tokensIADisponiveis: number
  // Datas de controle
  createdAt: Date
  updatedAt: Date
}

// Schema de validação para o formulário de cliente
export const clienteFormSchema = z.object({
  nomeEscritorio: z.string()
    .min(3, "Nome do escritório deve ter no mínimo 3 caracteres")
    .max(100, "Nome do escritório deve ter no máximo 100 caracteres"),
  
  nomeContratante: z.string()
    .min(3, "Nome do contratante deve ter no mínimo 3 caracteres")
    .max(100, "Nome do contratante deve ter no máximo 100 caracteres"),
  
  emailContratante: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  
  cnpj: z.string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"),
  
  telefone: z.string()
    .regex(/^\+\d{2}\s?\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Telefone deve estar no formato +XX (XX) XXXXX-XXXX"),
  
  nomePlano: z.enum(["FREE", "STANDARD", "PREMIUM", "ENTERPRISE"]),
  
  vigenciaPlano: z.date({
    required_error: "Data de vigência é obrigatória",
  }),
  
  valorPlano: z.number()
    .min(0, "Valor deve ser maior ou igual a zero")
    .max(999999.99, "Valor máximo excedido"),
  
  formaPagamento: z.string()
    .min(1, "Forma de pagamento é obrigatória"),
  
  descricaoPlano: z.string()
    .min(10, "Descrição do plano deve ter no mínimo 10 caracteres")
    .max(500, "Descrição do plano deve ter no máximo 500 caracteres"),
  
  status: z.enum(["ativa", "inativa", "inadimplente"]).default("ativa"),
  
  // Campos de métricas (opcionais no cadastro)
  usuariosUsados: z.number().min(0).default(0),
  usuariosDisponiveis: z.number().min(1).default(5),
  processosUsados: z.number().min(0).default(0),
  processosDisponiveis: z.number().min(1).default(50),
  tokensIAUsados: z.number().min(0).default(0),
  tokensIADisponiveis: z.number().min(0).default(1000),
})

export type ClienteFormData = z.infer<typeof clienteFormSchema>

// Schema para alteração de titularidade
export const alterarTitularidadeSchema = z.object({
  novoNome: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  novoEmail: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  
  novoTelefone: z.string()
    .regex(/^\+\d{2}\s?\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Telefone deve estar no formato +XX (XX) XXXXX-XXXX"),
})

export type AlterarTitularidadeData = z.infer<typeof alterarTitularidadeSchema>

// Schema para troca de plano
export const trocarPlanoSchema = z.object({
  novoPlano: z.enum(["FREE", "STANDARD", "PREMIUM", "ENTERPRISE"]),
  novoValor: z.number()
    .min(0, "Valor deve ser maior ou igual a zero")
    .max(999999.99, "Valor máximo excedido"),
  novaDescricao: z.string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
})

export type TrocarPlanoData = z.infer<typeof trocarPlanoSchema>

// Filtros para busca
export interface ClienteFilters {
  search?: string
  plano?: string
  status?: string
  sortBy?: keyof Cliente
  sortOrder?: 'asc' | 'desc'
}

// Helpers para formatação
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return cnpj
  
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length < 12) return telefone
  
  const ddi = cleaned.slice(0, 2)
  const ddd = cleaned.slice(2, 4)
  const firstPart = cleaned.slice(4, 9)
  const secondPart = cleaned.slice(9, 13)
  
  return `+${ddi} (${ddd}) ${firstPart}-${secondPart}`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function getStatusColor(status: keyof typeof StatusAssinatura): string {
  switch (status) {
    case 'ativa':
      return 'bg-green-100 text-green-800'
    case 'inativa':
      return 'bg-gray-100 text-gray-800'
    case 'inadimplente':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getPlanoColor(plano: keyof typeof PlanoTipo): string {
  switch (plano) {
    case 'FREE':
      return 'bg-gray-100 text-gray-800'
    case 'STANDARD':
      return 'bg-blue-100 text-blue-800'
    case 'PREMIUM':
      return 'bg-purple-100 text-purple-800'
    case 'ENTERPRISE':
      return 'bg-amber-100 text-amber-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}