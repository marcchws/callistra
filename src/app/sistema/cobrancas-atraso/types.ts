import { z } from 'zod'

// Status baseados nos critérios de aceite
export type StatusCobranca = 'pendente' | 'enviada' | 'pago' | 'vencida' | 'bloqueado'

export type StatusCliente = 'ativo' | 'bloqueado' | 'liberado'

// Schema de validação para cobrança baseado nos requisitos
export const CobrancaSchema = z.object({
  id: z.string(),
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  clienteNome: z.string().min(1, "Nome do cliente é obrigatório"),
  valor: z.number().positive("Valor deve ser positivo"),
  dataVencimento: z.date(),
  dataCriacao: z.date(),
  dataUltimoEnvio: z.date().optional(),
  status: z.enum(['pendente', 'enviada', 'pago', 'vencida', 'bloqueado'] as const),
  boleto: z.string().optional(),
  linkPagamento: z.string().optional(),
  observacoes: z.string().optional(),
  tentativasEnvio: z.number().default(0),
  diasAtraso: z.number().default(0),
})

// Schema para histórico conforme AC5
export const HistoricoCobrancaSchema = z.object({
  id: z.string(),
  cobrancaId: z.string(),
  acao: z.enum(['criada', 'enviada', 'reenviada', 'pago', 'bloqueado', 'liberado', 'alerta_enviado'] as const),
  dataAcao: z.date(),
  usuario: z.string(),
  detalhes: z.string().optional(),
})

// Schema para cliente baseado no AC4 (bloqueio após 15 dias)
export const ClienteCobrancaSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  status: z.enum(['ativo', 'bloqueado', 'liberado'] as const),
  dataBloqueio: z.date().optional(),
  motivoBloqueio: z.string().optional(),
  usuarioBloqueio: z.string().optional(),
  totalDevedor: z.number().default(0),
  diasMaximoAtraso: z.number().default(0),
})

// Types inferidos dos schemas
export type Cobranca = z.infer<typeof CobrancaSchema>
export type HistoricoCobranca = z.infer<typeof HistoricoCobrancaSchema>
export type ClienteCobranca = z.infer<typeof ClienteCobrancaSchema>

// Form schemas para ações específicas baseadas nos cenários
export const EmissaoCobrancaSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  valor: z.number().positive("Valor deve ser positivo"),
  dataVencimento: z.date(),
  observacoes: z.string().optional(),
})

export const AtualizacaoStatusSchema = z.object({
  cobrancaId: z.string(),
  novoStatus: z.enum(['pago', 'vencida'] as const),
  observacoes: z.string().optional(),
})

export const LiberacaoClienteSchema = z.object({
  clienteId: z.string(),
  motivo: z.string().min(1, "Motivo da liberação é obrigatório"),
})

export type EmissaoCobrancaForm = z.infer<typeof EmissaoCobrancaSchema>
export type AtualizacaoStatusForm = z.infer<typeof AtualizacaoStatusSchema>
export type LiberacaoClienteForm = z.infer<typeof LiberacaoClienteSchema>

// Estatísticas para dashboard conforme AC7 (integração financeira)
export interface EstatisticasCobranca {
  totalEmAberto: number
  totalVencido: number
  totalRecebido: number
  clientesBloqueados: number
  cobrancasEnviadas: number
  ticketMedio: number
}

// Filtros para pesquisa
export interface FiltrosCobranca {
  status?: StatusCobranca
  clienteId?: string
  dataInicio?: Date
  dataFim?: Date
  diasAtraso?: number
}
