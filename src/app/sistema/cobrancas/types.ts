import { z } from "zod"

// Status da cobrança
export type StatusCobranca = 'pendente' | 'enviada' | 'vencida' | 'paga' | 'cancelada'

// Status do cliente
export type StatusCliente = 'ativo' | 'bloqueado' | 'inadimplente'

// Tipo de cobrança
export type TipoCobranca = 'boleto' | 'pix' | 'link_pagamento'

// Interface principal da cobrança
export interface Cobranca {
  id: string
  clienteId: string
  clienteNome: string
  clienteEmail: string
  valor: number
  dataVencimento: Date
  dataEmissao: Date
  status: StatusCobranca
  tipo: TipoCobranca
  urlBoleto?: string
  linkPagamento?: string
  chavePix?: string
  observacoes?: string
  diasAtraso: number
  ultimoEnvio?: Date
  tentativasEnvio: number
  createdAt: Date
  updatedAt: Date
}

// Interface do cliente
export interface Cliente {
  id: string
  nome: string
  email: string
  telefone?: string
  cpfCnpj: string
  status: StatusCliente
  dataBloqueio?: Date
  motivoBloqueio?: string
  totalPendente: number
  diasAtrasoMaximo: number
  createdAt: Date
  updatedAt: Date
}

// Interface do histórico
export interface HistoricoCobranca {
  id: string
  cobrancaId: string
  acao: 'emitida' | 'enviada' | 'reenviada' | 'paga' | 'cancelada' | 'bloqueio' | 'desbloqueio'
  detalhes: string
  usuarioId: string
  usuarioNome: string
  dataAcao: Date
  dadosAdicionais?: Record<string, any>
}

// Schema de validação para nova cobrança
export const NovaCobrancaSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  dataVencimento: z.date().min(new Date(), "Data de vencimento deve ser futura"),
  tipo: z.enum(['boleto', 'pix', 'link_pagamento']),
  observacoes: z.string().optional()
})

// Schema para reenvio de cobrança
export const ReenvioCobrancaSchema = z.object({
  cobrancaId: z.string().min(1, "ID da cobrança é obrigatório"),
  incluirWhatsapp: z.boolean().default(false),
  mensagemPersonalizada: z.string().optional()
})

// Schema para atualização de status
export const AtualizarStatusSchema = z.object({
  cobrancaId: z.string().min(1, "ID da cobrança é obrigatório"),
  novoStatus: z.enum(['pendente', 'enviada', 'vencida', 'paga', 'cancelada']),
  observacoes: z.string().optional(),
  dataPagamento: z.date().optional()
})

// Schema para bloqueio/desbloqueio de cliente
export const GerenciarClienteSchema = z.object({
  clienteId: z.string().min(1, "ID do cliente é obrigatório"),
  acao: z.enum(['bloquear', 'desbloquear']),
  motivo: z.string().min(1, "Motivo é obrigatório")
})

// Filtros para listagem de cobranças
export interface FiltrosCobranca {
  status?: StatusCobranca[]
  cliente?: string
  dataInicio?: Date
  dataFim?: Date
  valorMinimo?: number
  valorMaximo?: number
  diasAtrasoMinimo?: number
  tipo?: TipoCobranca[]
  ordenarPor?: 'dataVencimento' | 'valor' | 'diasAtraso' | 'cliente'
  ordem?: 'asc' | 'desc'
  pagina?: number
  limite?: number
}

// Estatísticas do dashboard
export interface EstatisticasCobranca {
  totalPendente: number
  valorTotalPendente: number
  totalVencidas: number
  valorTotalVencido: number
  totalPagas: number
  valorTotalPago: number
  clientesBloqueados: number
  cobrancasEnviadas: number
  taxaSucesso: number
  tempoMedioRecebimento: number
}

// Dados para gráfico
export interface DadosGrafico {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }[]
}

// Resposta da API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// Tipos para formulários
export type NovaCobrancaForm = z.infer<typeof NovaCobrancaSchema>
export type ReenvioCobrancaForm = z.infer<typeof ReenvioCobrancaSchema>
export type AtualizarStatusForm = z.infer<typeof AtualizarStatusSchema>
export type GerenciarClienteForm = z.infer<typeof GerenciarClienteSchema>
