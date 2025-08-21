import { z } from "zod"

// Tipagens para o dashboard
export interface DashboardData {
  // Indicadores principais
  processosAtivos: number
  processosAtivosTendencia: number
  processosConcluidos: number
  processosConcluidosTendencia: number
  faturamento: number
  faturamentoTendencia: number
  tarefasAtrasadas: number

  // Percentuais de ganhos/perdas
  percentualGanhos: number
  percentualPerdas: number

  // Dados para filtros
  usuarios?: Usuario[]
  cargos?: string[]

  // Produtividade
  produtividade?: Produtividade[]

  // Tarefas atrasadas detalhadas
  tarefasAtrasadasDetalhes?: TarefaAtrasada[]

  // Histórico de exportações
  historicoExportacoes?: HistoricoExportacao[]
}

export interface Usuario {
  id: string
  nome: string
  cargo: string
  email: string
}

export interface Produtividade {
  id: string
  nome: string
  cargo: string
  pontuacao: number
  processosFinalizados: number
  tarefasConcluidas: number
  tempoMedio: number
}

export interface TarefaAtrasada {
  id: string
  titulo: string
  responsavel: string
  cargo: string
  vencimento: string
  diasAtraso: number
  status: string
  processo?: string
}

export interface HistoricoExportacao {
  id: string
  data: string
  formato: ExportFormat
  filtros: string
  usuario: string
  tamanho?: string
}

// Filtros do dashboard
export interface DashboardFilters {
  dateRange?: {
    from: Date
    to: Date
  }
  userId?: string | null
  cargo?: string | null
  status?: string | null
  searchTerm?: string
}

export type ExportFormat = 'pdf' | 'excel'

// Validação dos filtros
export const DashboardFiltersSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
  userId: z.string().nullable().optional(),
  cargo: z.string().nullable().optional(),
  status: z.enum(['ativo', 'concluido', 'suspenso']).nullable().optional(),
  searchTerm: z.string().optional()
})

// Estados do dashboard
export interface DashboardState {
  data: DashboardData
  loading: boolean
  error: string | null
  filters: DashboardFilters
  lastUpdated: Date | null
}

// Parâmetros para exportação
export interface ExportParams {
  format: ExportFormat
  filters: DashboardFilters
  includeCharts?: boolean
  fileName?: string
}

// Métricas de tempo real
export interface RealTimeMetrics {
  processosAtualizados: number
  tarefasAtualizadas: number
  faturamentoAtualizado: number
  ultimaAtualizacao: Date
}

// Configurações de gráficos
export interface ChartConfig {
  type: 'pie' | 'bar' | 'line' | 'donut'
  data: ChartDataPoint[]
  colors?: string[]
  showLegend?: boolean
  responsive?: boolean
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  percentage?: number
}

// Configurações de produtividade
export interface ProdutividadeConfig {
  groupBy: 'cargo' | 'usuario'
  metric: 'pontuacao' | 'processos' | 'tarefas' | 'tempo'
  period: 'dia' | 'semana' | 'mes' | 'ano'
}

// Alertas do dashboard
export interface DashboardAlert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  dismissed?: boolean
}

// Mock data para desenvolvimento
export const mockDashboardData: DashboardData = {
  processosAtivos: 145,
  processosAtivosTendencia: 12,
  processosConcluidos: 89,
  processosConcluidosTendencia: 8,
  faturamento: 285000,
  faturamentoTendencia: 15,
  tarefasAtrasadas: 23,
  percentualGanhos: 72,
  percentualPerdas: 28,
  usuarios: [
    { id: '1', nome: 'Ana Silva', cargo: 'Advogada Sênior', email: 'ana@escritorio.com' },
    { id: '2', nome: 'Carlos Santos', cargo: 'Advogado Júnior', email: 'carlos@escritorio.com' },
    { id: '3', nome: 'Maria Costa', cargo: 'Paralegal', email: 'maria@escritorio.com' },
    { id: '4', nome: 'João Oliveira', cargo: 'Secretário', email: 'joao@escritorio.com' }
  ],
  cargos: ['Advogado Sênior', 'Advogado Júnior', 'Paralegal', 'Secretário', 'Estagiário'],
  produtividade: [
    { id: '1', nome: 'Ana Silva', cargo: 'Advogada Sênior', pontuacao: 95, processosFinalizados: 12, tarefasConcluidas: 45, tempoMedio: 2.5 },
    { id: '2', nome: 'Carlos Santos', cargo: 'Advogado Júnior', pontuacao: 88, processosFinalizados: 8, tarefasConcluidas: 32, tempoMedio: 3.2 },
    { id: '3', nome: 'Maria Costa', cargo: 'Paralegal', pontuacao: 92, processosFinalizados: 6, tarefasConcluidas: 58, tempoMedio: 1.8 },
    { id: '4', nome: 'João Oliveira', cargo: 'Secretário', pontuacao: 85, processosFinalizados: 4, tarefasConcluidas: 67, tempoMedio: 1.5 }
  ],
  tarefasAtrasadasDetalhes: [
    { id: '1', titulo: 'Análise de contrato', responsavel: 'Ana Silva', cargo: 'Advogada Sênior', vencimento: '2024-03-15', diasAtraso: 5, status: 'Em andamento', processo: '001/2024' },
    { id: '2', titulo: 'Petição inicial', responsavel: 'Carlos Santos', cargo: 'Advogado Júnior', vencimento: '2024-03-18', diasAtraso: 2, status: 'Pendente', processo: '002/2024' },
    { id: '3', titulo: 'Relatório de audiência', responsavel: 'Maria Costa', cargo: 'Paralegal', vencimento: '2024-03-12', diasAtraso: 8, status: 'Em revisão', processo: '003/2024' }
  ],
  historicoExportacoes: [
    { id: '1', data: '2024-03-20', formato: 'pdf', filtros: 'Março 2024, Todos usuários', usuario: 'Ana Silva', tamanho: '2.3 MB' },
    { id: '2', data: '2024-03-19', formato: 'excel', filtros: 'Semana atual, Advogados', usuario: 'Carlos Santos', tamanho: '1.8 MB' },
    { id: '3', data: '2024-03-18', formato: 'pdf', filtros: 'Fevereiro 2024, Processos ativos', usuario: 'Maria Costa', tamanho: '3.1 MB' }
  ]
}

export default mockDashboardData