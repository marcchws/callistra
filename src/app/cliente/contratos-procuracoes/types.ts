import { z } from "zod"

// Enums para valores específicos
export const TipoDocumentoEnum = z.enum(["contrato", "procuracao"])
export const StatusPagamentoEnum = z.enum(["pendente", "pago", "inadimplente"])
export const FormatoPagamentoEnum = z.enum(["a_vista", "parcelado", "outro"])

// Schema principal do documento
export const DocumentoSchema = z.object({
  id: z.string().optional(),
  tipoDocumento: TipoDocumentoEnum,
  modelo: z.string().min(1, "Modelo é obrigatório"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  oab: z.string().optional(),
  enderecoComercial: z.string().optional(),
  valorNegociado: z.number().min(0.01, "Valor deve ser maior que zero"),
  formatoPagamento: FormatoPagamentoEnum,
  parcelas: z.string().optional(),
  dataInicio: z.date({
    required_error: "Data de início é obrigatória",
  }),
  dataTermino: z.date().optional(),
  statusPagamento: StatusPagamentoEnum.default("pendente"),
  renegociacao: z.string().optional(),
  assinaturas: z.array(z.string()).min(1, "Pelo menos uma assinatura é obrigatória"),
  anexos: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  dataCriacao: z.date().optional(),
  ultimaAtualizacao: z.date().optional(),
})

// Schema para filtros de busca
export const FiltrosBuscaSchema = z.object({
  cliente: z.string().optional(),
  tipoDocumento: TipoDocumentoEnum.optional(),
  statusPagamento: StatusPagamentoEnum.optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  responsavel: z.string().optional(),
})

// Schema para renegociação
export const RenegociacaoSchema = z.object({
  documentoId: z.string(),
  novoValor: z.number().min(0.01, "Valor deve ser maior que zero"),
  novoFormatoPagamento: FormatoPagamentoEnum,
  novasParcelas: z.string().optional(),
  observacoes: z.string().min(1, "Observações são obrigatórias para renegociação"),
  dataRenegociacao: z.date().default(new Date()),
})

// Schema para upload de modelo
export const UploadModeloSchema = z.object({
  nome: z.string().min(1, "Nome do modelo é obrigatório"),
  arquivo: z.instanceof(File, {
    message: "Arquivo é obrigatório",
  }),
  tipoDocumento: TipoDocumentoEnum,
  descricao: z.string().optional(),
})

// Types derivados dos schemas
export type Documento = z.infer<typeof DocumentoSchema>
export type FiltrosBusca = z.infer<typeof FiltrosBuscaSchema>
export type Renegociacao = z.infer<typeof RenegociacaoSchema>
export type UploadModelo = z.infer<typeof UploadModeloSchema>
export type TipoDocumento = z.infer<typeof TipoDocumentoEnum>
export type StatusPagamento = z.infer<typeof StatusPagamentoEnum>
export type FormatoPagamento = z.infer<typeof FormatoPagamentoEnum>

// Interface para modelo do sistema
export interface ModeloSistema {
  id: string
  nome: string
  tipoDocumento: TipoDocumento
  campos: CampoModelo[]
  descricao?: string
}

// Interface para campo do modelo
export interface CampoModelo {
  id: string
  nome: string
  tipo: "texto" | "numero" | "data" | "select" | "textarea"
  obrigatorio: boolean
  opcoes?: string[] // Para campos select
  placeholder?: string
  validacao?: string
}

// Interface para histórico de pagamentos (integração com contas a receber)
export interface HistoricoPagamento {
  id: string
  documentoId: string
  valorOriginal: number
  valorPago: number
  dataPagamento: Date
  observacoes?: string
  multas?: number
  descontos?: number
}

// Interface para exportação
export interface OpcoesExportacao {
  formato: "pdf" | "word"
  incluirAnexos: boolean
  incluirHistoricoFinanceiro: boolean
}

// Constantes para validação
export const FORMATO_PAGAMENTO_LABELS = {
  a_vista: "À Vista",
  parcelado: "Parcelado",
  outro: "Outro"
} as const

export const STATUS_PAGAMENTO_LABELS = {
  pendente: "Pendente",
  pago: "Pago",
  inadimplente: "Inadimplente"
} as const

export const TIPO_DOCUMENTO_LABELS = {
  contrato: "Contrato",
  procuracao: "Procuração"
} as const
