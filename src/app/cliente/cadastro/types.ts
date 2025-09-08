import { z } from "zod"

// Enums
export const TipoCliente = {
  PESSOA_FISICA: "pessoa_fisica",
  PESSOA_JURIDICA: "pessoa_juridica",
  PARCEIRO: "parceiro"
} as const

export const StatusCliente = {
  ATIVO: "ativo",
  INATIVO: "inativo"
} as const

// Types
export type TipoCliente = typeof TipoCliente[keyof typeof TipoCliente]
export type StatusCliente = typeof StatusCliente[keyof typeof StatusCliente]

export interface Cliente {
  id: string
  tipo: TipoCliente
  nome: string // Nome completo (PF) ou Razão Social (PJ)
  cpfCnpj: string
  dataNascimento?: string // Apenas PF
  responsavel?: string // Apenas PJ
  telefone: string
  email: string
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  confidencial: boolean
  status: StatusCliente
  login: string
  senha?: string // Não retornar em listagens
  anexos?: Anexo[]
  historicoFinanceiro?: TransacaoFinanceira[]
  createdAt: Date
  updatedAt: Date
}

export interface Anexo {
  id: string
  nome: string
  tipo: string
  tamanho: number
  url: string
  dataUpload: Date
}

export interface TransacaoFinanceira {
  id: string
  tipo: "receita" | "despesa"
  descricao: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: "pendente" | "pago" | "cancelado"
}

// Validação Zod
const baseSchema = z.object({
  tipo: z.enum([TipoCliente.PESSOA_FISICA, TipoCliente.PESSOA_JURIDICA, TipoCliente.PARCEIRO]),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  contaCorrente: z.string().optional(),
  chavePix: z.string().optional(),
  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  confidencial: z.boolean().default(false),
  status: z.enum([StatusCliente.ATIVO, StatusCliente.INATIVO]).default(StatusCliente.ATIVO),
  login: z.string().min(3, "Login deve ter no mínimo 3 caracteres"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
})

// Schema para Pessoa Física
export const clientePFSchema = baseSchema.extend({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  cpfCnpj: z.string().length(11, "CPF deve ter 11 dígitos"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
})

// Schema para Pessoa Jurídica
export const clientePJSchema = baseSchema.extend({
  nome: z.string().min(3, "Razão social é obrigatória"),
  cpfCnpj: z.string().length(14, "CNPJ deve ter 14 dígitos"),
  responsavel: z.string().min(3, "Nome do responsável é obrigatório"),
})

// Schema dinâmico baseado no tipo
export const clienteFormSchema = z.discriminatedUnion("tipo", [
  clientePFSchema,
  clientePJSchema,
])

export type ClienteFormData = z.infer<typeof clienteFormSchema>

// Filtros
export interface ClienteFilters {
  search?: string
  tipo?: TipoCliente
  status?: StatusCliente
  confidencial?: boolean
}

// Utils
export function formatarCpfCnpj(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }
}

export function formatarTelefone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length === 10) {
    // (00) 0000-0000
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  } else if (numbers.length === 11) {
    // (00) 00000-0000
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  
  return value
}

export function formatarCep(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
}