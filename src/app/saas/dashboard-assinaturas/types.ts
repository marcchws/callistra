// types.ts - Tipagens do Dashboard de Assinaturas
import { z } from 'zod'

// Enums para tipos de planos e status
export enum TipoPlano {
  FREE = 'free',
  BASICO = 'basico',
  PROFISSIONAL = 'profissional',
  EMPRESARIAL = 'empresarial'
}

export enum StatusAssinatura {
  ATIVA = 'ativa',
  TRIAL = 'trial',
  SUSPENSA = 'suspensa',
  CANCELADA = 'cancelada',
  INADIMPLENTE = 'inadimplente'
}

// Interface principal de métricas do dashboard
export interface MetricasDashboard {
  // Total de assinaturas
  totalAssinaturas: {
    total: number
    free: number
    pagas: number
    variacao: number // % comparado ao período anterior
  }
  
  // Total financeiro
  totalFinanceiro: {
    total: number
    porPlano: {
      plano: TipoPlano
      valor: number
      quantidade: number
    }[]
  }
  
  // Indicadores de performance
  kpis: {
    roi: number
    ticketMedio: number
    tempoPagamento: number // em dias
    taxaInadimplencia: number // percentual
    conversaoCasos: number // percentual
    retencaoClientes: number // percentual
  }
  
  // Faturamento
  faturamento: {
    mesAtual: number
    anual: number // até último mês fechado
    variacaoMensal: number // % comparado mês anterior
  }
  
  // Conversão Trial → Pago
  conversaoTrial: {
    percentual: number
    quantidade: number
    total: number // total de trials no período
  }
  
  // LTV (Lifetime Value)
  ltv: {
    medio: number
    porPlano: {
      plano: TipoPlano
      valor: number
    }[]
  }
  
  // Receita projetada
  receitaProjetada: {
    proximosMeses: {
      mes: string
      valor: number
    }[]
    totalProjetado: number
  }
  
  // Churn
  churn: {
    percentual: number
    quantidade: number
    quantidadeFree: number
    quantidadePagas: number
    variacaoMensal: number // % comparado mês anterior
  }
  
  // Inadimplência
  inadimplencia: {
    quantidade: number
    montante: number
    percentual: number
  }
  
  // Acessos IA
  acessosIA: {
    mesVigente: number
    mesAnterior: number
    variacao: number // percentual
  }
  
  // Assinaturas por plano
  assinaturasPorPlano: {
    plano: TipoPlano
    quantidade: number
    percentual: number
  }[]
}

// Filtros do dashboard
export interface FiltrosDashboard {
  periodo: {
    tipo: 'mes' | 'semestral' | 'anual' | 'custom'
    dataInicio?: Date
    dataFim?: Date
  }
  plano?: TipoPlano
}

// Schema de validação dos filtros
export const FiltrosDashboardSchema = z.object({
  periodo: z.object({
    tipo: z.enum(['mes', 'semestral', 'anual', 'custom']),
    dataInicio: z.date().optional(),
    dataFim: z.date().optional()
  }),
  plano: z.nativeEnum(TipoPlano).optional()
})

// Dados para gráficos
export interface DadosGrafico {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

// Configuração de exportação PDF
export interface ConfigExportacaoPDF {
  titulo: string
  subtitulo: string
  periodo: string
  metricas: MetricasDashboard
  geradoEm: Date
  geradoPor: string
}