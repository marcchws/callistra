// Types baseados nos campos especificados no PRD
export interface BalanceteData {
  id: string
  dataReferencia: {
    inicio: Date
    fim: Date
    tipo: 'mensal' | 'trimestral' | 'anual' | 'personalizado'
  }
  totalProcessos: number
  ganhos: number
  honorarios: number
  fixosRecorrentes: {
    receitas: number
    despesas: number
  }
  despesas: number
  custasProcessuais: number
  inadimplencia: {
    valor: number
    percentual: number
  }
  faturamento: number
  cliente?: string
  tipoServico?: string
  indicadoresPerformance: {
    roi: number
    ticketMedio: number
    tempoMedioPagamento: number
    taxaInadimplencia: number
    conversaoCasos: number
    retencaoClientes: number
  }
}

export interface BalanceteFilters {
  dataInicio?: Date
  dataFim?: Date
  cliente?: string
  tipoServico?: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface ExportOptions {
  formato: 'pdf' | 'csv'
  incluirGraficos: boolean
  incluirDetalhes: boolean
}

export interface BalanceteState {
  data: BalanceteData | null
  loading: boolean
  error: string | null
  filters: BalanceteFilters
  chartData: {
    receitas: ChartData[]
    despesas: ChartData[]
    evolucao: ChartData[]
  }
}
