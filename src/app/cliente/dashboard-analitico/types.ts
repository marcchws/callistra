import { z } from "zod"

// Schemas de validação
export const FilterSchema = z.object({
  periodo: z.object({
    inicio: z.date().nullable(),
    fim: z.date().nullable()
  }),
  usuario: z.string().optional(),
  cargo: z.string().optional(),
  status: z.enum(["todos", "ativo", "concluido", "ganho", "perdido"]).default("todos"),
  busca: z.string().optional()
})

export const ExportHistorySchema = z.object({
  id: z.string(),
  data: z.date(),
  formato: z.enum(["pdf", "excel"]),
  filtros: FilterSchema,
  usuario: z.string(),
  nomeArquivo: z.string()
})

// Types
export type FilterData = z.infer<typeof FilterSchema>
export type ExportHistory = z.infer<typeof ExportHistorySchema>

export interface ProcessoStats {
  ativos: number
  concluidos: number
  ganhos: number
  perdidos: number
  total: number
}

export interface FaturamentoData {
  total: number
  recebido: number
  pendente: number
  vencido: number
}

export interface TarefaAtrasada {
  id: string
  titulo: string
  responsavel: string
  cargo: string
  diasAtraso: number
  prioridade: "alta" | "media" | "baixa"
  processo?: string
}

export interface ProdutividadeData {
  nome: string
  cargo?: string
  tarefasConcluidas: number
  tarefasAtrasadas: number
  processosConcluidos: number
  tempoMedio: number
  eficiencia: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    tension?: number
  }[]
}

export interface DashboardData {
  processos: ProcessoStats
  faturamento: FaturamentoData
  tarefasAtrasadas: TarefaAtrasada[]
  produtividade: ProdutividadeData[]
  chartProcessos: ChartData
  chartProdutividade: ChartData
  ultimaAtualizacao: Date
}

export interface Usuario {
  id: string
  nome: string
  cargo: string
  email: string
}

export interface Cargo {
  id: string
  nome: string
  nivel: number
}