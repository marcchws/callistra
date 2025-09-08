import { z } from "zod"

// Enums
export enum TipoLancamento {
  RECEITA = "RECEITA",
  DESPESA = "DESPESA"
}

export enum StatusLancamento {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
  RECEBIDO = "RECEBIDO"
}

// Interfaces
export interface Lancamento {
  id: string
  tipo: TipoLancamento
  categoria: string
  subcategoria: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date | null
  status: StatusLancamento
  processo?: string | null
  beneficiario?: string | null
  anexos?: Anexo[]
  renegociacoes?: Renegociacao[]
  observacoes?: string | null
  criadoPor?: string
  criadoEm?: Date
  atualizadoPor?: string
  atualizadoEm?: Date
}

export interface Anexo {
  id: string
  nome: string
  url: string
  tamanho: number
  tipo: string
  uploadedAt: Date
}

export interface Renegociacao {
  id: string
  dataRenegociacao: Date
  valorOriginal: number
  valorNovo: number
  juros: number
  motivo?: string
  responsavel: string
}

export interface Filtros {
  tipo?: TipoLancamento
  categoria?: string
  status?: StatusLancamento
  processo?: string
  beneficiario?: string
  dataInicio?: Date
  dataFim?: Date
  agrupamento?: "processo" | "beneficiario" | null
}

// Schemas de validação
export const LancamentoSchema = z.object({
  tipo: z.nativeEnum(TipoLancamento, {
    required_error: "Tipo é obrigatório"
  }),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  subcategoria: z.string().min(1, "Subcategoria é obrigatória"),
  valor: z.number().positive("Valor deve ser maior que zero"),
  dataVencimento: z.date({
    required_error: "Data de vencimento é obrigatória"
  }),
  dataPagamento: z.date().nullable().optional(),
  processo: z.string().nullable().optional(),
  beneficiario: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

export const RenegociacaoSchema = z.object({
  valorNovo: z.number().positive("Novo valor deve ser maior que zero"),
  juros: z.number().min(0, "Juros não pode ser negativo"),
  motivo: z.string().optional()
})

export type LancamentoFormData = z.infer<typeof LancamentoSchema>
export type RenegociacaoFormData = z.infer<typeof RenegociacaoSchema>

// Tipos auxiliares
export interface CategoriaInfo {
  nome: string
  subcategorias: string[]
}

export interface ResumoFinanceiro {
  totalReceitas: number
  totalDespesas: number
  receitasPendentes: number
  despesasPendentes: number
  receitasRecebidas: number
  despesasPagas: number
  saldo: number
}

export interface LancamentoAgrupado {
  titulo: string
  lancamentos: Lancamento[]
  total: number
  totalPendente: number
  totalPago: number
}