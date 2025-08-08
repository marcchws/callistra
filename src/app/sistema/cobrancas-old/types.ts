import { z } from "zod"

// Tipos para COBRANÇAS EM ATRASO (foco específico)
export interface CobrancaEmAtraso {
  id: string
  clienteId: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone?: string
  contratoOriginal: string // Referência ao contrato/serviço original
  valorOriginal: number
  valorAtualizado: number // Com juros/multa
  dataVencimentoOriginal: Date
  dataUltimoEnvio?: Date
  diasAtraso: number
  status: StatusCobrancaAtraso
  
  // Dados específicos para cobrança em atraso
  boletoAtualizado?: {
    codigo: string
    linkPagamento: string
    dataGeracao: Date
  }
  
  alertasEnviados: AlertaInadimplencia[]
  historicoAcoes: HistoricoAcaoCobranca[]
  clienteBloqueado: boolean
  motivoBloqueio?: string
  dataBloqueio?: Date
  
  // Integração com contas a receber
  lancamentoFinanceiro?: {
    id: string
    contaReceberOriginal: string
    situacao: "pendente" | "baixado" | "cancelado"
  }
}

export type StatusCobrancaAtraso = 
  | "vencida"           // Vencida mas ainda não enviada
  | "cobranca_enviada"  // Cobrança enviada ao cliente
  | "aguardando_pago"   // Aguardando confirmação de pagamento
  | "pago"              // Pagamento confirmado
  | "cancelada"         // Cobrança cancelada
  | "bloqueada"         // Cliente bloqueado por inadimplência

export interface AlertaInadimplencia {
  id: string
  tipo: TipoAlerta
  dataEnvio: Date
  destinatarios: string[] // emails
  canalEnvio: "email" | "sistema" | "ambos"
  conteudo: string
  entregue: boolean
}

export type TipoAlerta = 
  | "primeira_cobranca"     // Primeira cobrança após vencimento
  | "segunda_cobranca"      // Segunda tentativa
  | "pre_bloqueio"          // Aviso antes de bloquear (10-14 dias)
  | "cliente_bloqueado"     // Notificação de bloqueio
  | "pagamento_confirmado"  // Confirmação de pagamento

export interface HistoricoAcaoCobranca {
  id: string
  data: Date
  acao: AcaoCobranca
  usuario: string
  detalhes: string
  automatica: boolean // Se foi ação automática do sistema
  dadosAntes?: any
  dadosDepois?: any
}

export type AcaoCobranca = 
  | "cobranca_identificada"    // Sistema identificou cobrança vencida
  | "boleto_gerado"           // Boleto atualizado gerado
  | "envio_automatico"        // Envio automático de cobrança
  | "alerta_inadimplencia"    // Alerta automático enviado
  | "reenvio_manual"          // Reenvio manual solicitado
  | "status_atualizado"       // Status atualizado manualmente
  | "pagamento_confirmado"    // Pagamento confirmado
  | "cliente_bloqueado"       // Cliente bloqueado automaticamente
  | "cliente_liberado"        // Cliente liberado por admin
  | "integracao_financeira"   // Integração com contas a receber

export interface ClienteInadimplente {
  id: string
  nome: string
  email: string
  telefone?: string
  documento: string
  totalEmAtraso: number
  maiorAtraso: number // Maior número de dias em atraso
  cobrancasEmAtraso: number
  bloqueado: boolean
  dataBloqueio?: Date
  motivoBloqueio?: string
  ultimaInteracao?: Date
}

// Dashboard específico para inadimplência
export interface DashboardInadimplencia {
  resumoGeral: {
    totalCobrancasVencidas: number
    valorTotalVencido: number
    clientesInadimplentes: number
    clientesBloqueados: number
    taxaRecuperacao: number // % de cobranças pagas após vencimento
  }
  
  alertasAutomaticos: {
    cobranças0a15dias: number
    cobrancas15dias: number // Para bloqueio automático
    alertasEnviados24h: number
    sucessoEntrega: number // % de emails entregues
  }
  
  acoesPendentes: {
    geracaoBoletos: number
    enviosPendentes: number
    confirmacoesPagamento: number
    liberacoesPendentes: number
  }
  
  integracaoFinanceira: {
    lancamentosAtualizados: number
    divergenciasDetectadas: number
    ultimaSincronizacao: Date
  }
}

// Schemas de validação específicos
export const EmitirBoletoSchema = z.object({
  cobrancaId: z.string().min(1, "Cobrança é obrigatória"),
  incluirJurosMulta: z.boolean().default(true),
  novaDataVencimento: z.date().optional(),
  observacoes: z.string().optional()
})

export const EnviarCobrancaSchema = z.object({
  cobrancaIds: z.array(z.string()).min(1, "Selecione pelo menos uma cobrança"),
  tipoEnvio: z.enum(["email", "sistema", "ambos"]),
  mensagemPersonalizada: z.string().optional(),
  agendarEnvio: z.boolean().default(false),
  dataAgendamento: z.date().optional()
})

export const ConfirmarPagamentoSchema = z.object({
  cobrancaId: z.string().min(1, "Cobrança é obrigatória"),
  valorPago: z.number().min(0.01, "Valor deve ser maior que zero"),
  dataPagamento: z.date(),
  formaPagamento: z.enum(["boleto", "pix", "transferencia", "dinheiro", "cartao"]),
  comprovante: z.string().optional(),
  observacoes: z.string().optional()
})

export const LiberarClienteSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  motivo: z.string().min(10, "Motivo deve ter pelo menos 10 caracteres"),
  liberarTodasCobrancas: z.boolean().default(false),
  condicoes: z.string().optional()
})

// Filtros específicos para cobranças em atraso
export const FiltrosCobrancasAtrasoSchema = z.object({
  status: z.enum(["todas", "vencida", "cobranca_enviada", "aguardando_pago", "pago", "cancelada", "bloqueada"]).optional(),
  diasAtraso: z.enum(["todos", "0-15", "15-30", "30-60", "60+"]).optional(),
  valorMin: z.number().optional(),
  valorMax: z.number().optional(),
  clienteBloqueado: z.enum(["todos", "bloqueados", "nao_bloqueados"]).optional(),
  periodo: z.enum(["hoje", "7d", "15d", "30d", "personalizado"]).optional(),
  dataInicio: z.date().optional(),
  dataFim: z.date().optional()
})

export type EmitirBoleto = z.infer<typeof EmitirBoletoSchema>
export type EnviarCobranca = z.infer<typeof EnviarCobrancaSchema>
export type ConfirmarPagamento = z.infer<typeof ConfirmarPagamentoSchema>
export type LiberarCliente = z.infer<typeof LiberarClienteSchema>
export type FiltrosCobrancasAtraso = z.infer<typeof FiltrosCobrancasAtrasoSchema>

// Props para componentes específicos
export interface CobrancasAtrasoTableProps {
  cobrancas: CobrancaEmAtraso[]
  loading: boolean
  onEmitirBoleto: (id: string) => void
  onEnviarCobranca: (ids: string[]) => void
  onConfirmarPagamento: (id: string) => void
  onReenviar: (id: string) => void
  onBloquearCliente: (clienteId: string) => void
  onLiberarCliente: (clienteId: string) => void
  onVerHistorico: (cobranca: CobrancaEmAtraso) => void
}

export interface DashboardInadimplenciaProps {
  data: DashboardInadimplencia | null
  loading: boolean
  onExecutarAcaoAutomatica: (acao: string) => void
}

export interface AlertasAutomaticosProps {
  alertas: AlertaInadimplencia[]
  loading: boolean
  onReenviarAlerta: (alertaId: string) => void
  onConfigurarAlerta: () => void
}

export interface IntegracaoFinanceiraProps {
  lancamentos: any[]
  loading: boolean
  onSincronizar: () => void
  onResolverDivergencia: (id: string) => void
}