import { z } from "zod"

// Enums e tipos base
export type TipoServico = 'civel' | 'trabalhista' | 'consultivo' | 'criminal' | 'tributario' | 'outros'
export type PeriodoReferencia = 'mensal' | 'trimestral' | 'anual' | 'personalizado'
export type TipoVisualizacao = 'tabela' | 'graficos' | 'indicadores'

// Tipo principal do Balancete
export interface Balancete {
  id: string
  dataReferencia: {
    inicio: Date
    fim: Date
    periodo: PeriodoReferencia
  }
  totalProcessos: {
    ativos: number
    encerrados: number
    total: number
  }
  financeiro: {
    ganhos: number
    honorarios: number
    despesas: number
    custasProcessuais: number
    faturamento: number
    inadimplencia: {
      valor: number
      percentual: number
    }
  }
  receitasDespesas: {
    fixas: {
      receitas: number
      despesas: number
    }
    recorrentes: {
      receitas: number
      despesas: number
    }
  }
  indicadores: {
    roi: number
    ticketMedio: number
    tempoMedioPagamento: number
    taxaInadimplencia: number
    conversaoCasos: number
    retencaoClientes: number
  }
  detalhamento: {
    porCliente: DetalhamentoCliente[]
    porTipoServico: DetalhamentoServico[]
    porCategoria: DetalhamentoCategoria[]
  }
}

export interface DetalhamentoCliente {
  id: string
  nome: string
  totalProcessos: number
  receitas: number
  despesas: number
  inadimplencia: number
  status: 'adimplente' | 'inadimplente' | 'parcial'
}

export interface DetalhamentoServico {
  tipo: TipoServico
  label: string
  quantidade: number
  receitas: number
  despesas: number
  lucro: number
}

export interface DetalhamentoCategoria {
  categoria: string
  tipo: 'receita' | 'despesa'
  valor: number
  percentual: number
}

// Schema de validação para filtros
export const FiltrosBalanceteSchema = z.object({
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  periodo: z.enum(['mensal', 'trimestral', 'anual', 'personalizado']).optional(),
  clienteId: z.string().optional(),
  tipoServico: z.enum(['civel', 'trabalhista', 'consultivo', 'criminal', 'tributario', 'outros', 'todos']).optional(),
})

export type FiltrosBalancete = z.infer<typeof FiltrosBalanceteSchema>

// Tipos para gráficos
export interface DadosGrafico {
  nome: string
  valor: number
  percentual?: number
  cor?: string
}

export interface EvolucaoFinanceira {
  mes: string
  receitas: number
  despesas: number
  lucro: number
}

// Tipo para exportação
export interface ExportOptions {
  formato: 'pdf' | 'csv'
  incluirGraficos: boolean
  incluirDetalhamento: boolean
  incluirIndicadores: boolean
}

// Mock data generator
export function generateMockBalancete(): Balancete {
  return {
    id: 'bal-001',
    dataReferencia: {
      inicio: new Date(2024, 0, 1),
      fim: new Date(2024, 11, 31),
      periodo: 'anual'
    },
    totalProcessos: {
      ativos: 127,
      encerrados: 43,
      total: 170
    },
    financeiro: {
      ganhos: 1250000,
      honorarios: 980000,
      despesas: 420000,
      custasProcessuais: 85000,
      faturamento: 1250000,
      inadimplencia: {
        valor: 125000,
        percentual: 10
      }
    },
    receitasDespesas: {
      fixas: {
        receitas: 450000,
        despesas: 180000
      },
      recorrentes: {
        receitas: 800000,
        despesas: 240000
      }
    },
    indicadores: {
      roi: 197.6,
      ticketMedio: 7352.94,
      tempoMedioPagamento: 32,
      taxaInadimplencia: 10,
      conversaoCasos: 68,
      retencaoClientes: 85
    },
    detalhamento: {
      porCliente: [
        {
          id: 'cli-001',
          nome: 'Empresa ABC Ltda',
          totalProcessos: 12,
          receitas: 180000,
          despesas: 45000,
          inadimplencia: 0,
          status: 'adimplente'
        },
        {
          id: 'cli-002',
          nome: 'João Silva & Associados',
          totalProcessos: 8,
          receitas: 95000,
          despesas: 22000,
          inadimplencia: 15000,
          status: 'parcial'
        },
        {
          id: 'cli-003',
          nome: 'Construtora XYZ',
          totalProcessos: 15,
          receitas: 220000,
          despesas: 58000,
          inadimplencia: 45000,
          status: 'inadimplente'
        },
        {
          id: 'cli-004',
          nome: 'Maria Santos',
          totalProcessos: 3,
          receitas: 35000,
          despesas: 8000,
          inadimplencia: 0,
          status: 'adimplente'
        },
        {
          id: 'cli-005',
          nome: 'Tech Solutions',
          totalProcessos: 6,
          receitas: 125000,
          despesas: 28000,
          inadimplencia: 0,
          status: 'adimplente'
        }
      ],
      porTipoServico: [
        {
          tipo: 'civel',
          label: 'Cível',
          quantidade: 65,
          receitas: 480000,
          despesas: 120000,
          lucro: 360000
        },
        {
          tipo: 'trabalhista',
          label: 'Trabalhista',
          quantidade: 42,
          receitas: 320000,
          despesas: 95000,
          lucro: 225000
        },
        {
          tipo: 'consultivo',
          label: 'Consultivo',
          quantidade: 28,
          receitas: 180000,
          despesas: 35000,
          lucro: 145000
        },
        {
          tipo: 'criminal',
          label: 'Criminal',
          quantidade: 15,
          receitas: 150000,
          despesas: 65000,
          lucro: 85000
        },
        {
          tipo: 'tributario',
          label: 'Tributário',
          quantidade: 20,
          receitas: 120000,
          despesas: 105000,
          lucro: 15000
        }
      ],
      porCategoria: [
        {
          categoria: 'Honorários Advocatícios',
          tipo: 'receita',
          valor: 980000,
          percentual: 78.4
        },
        {
          categoria: 'Consultorias',
          tipo: 'receita',
          valor: 180000,
          percentual: 14.4
        },
        {
          categoria: 'Pareceres',
          tipo: 'receita',
          valor: 90000,
          percentual: 7.2
        },
        {
          categoria: 'Salários e Encargos',
          tipo: 'despesa',
          valor: 180000,
          percentual: 42.9
        },
        {
          categoria: 'Custas Processuais',
          tipo: 'despesa',
          valor: 85000,
          percentual: 20.2
        },
        {
          categoria: 'Aluguel e Condomínio',
          tipo: 'despesa',
          valor: 60000,
          percentual: 14.3
        },
        {
          categoria: 'Marketing e Publicidade',
          tipo: 'despesa',
          valor: 45000,
          percentual: 10.7
        },
        {
          categoria: 'Outras Despesas',
          tipo: 'despesa',
          valor: 50000,
          percentual: 11.9
        }
      ]
    }
  }
}

// Função para gerar dados de evolução mensal
export function generateEvolucaoMensal(): EvolucaoFinanceira[] {
  return [
    { mes: 'Jan', receitas: 95000, despesas: 35000, lucro: 60000 },
    { mes: 'Fev', receitas: 102000, despesas: 38000, lucro: 64000 },
    { mes: 'Mar', receitas: 108000, despesas: 42000, lucro: 66000 },
    { mes: 'Abr', receitas: 98000, despesas: 36000, lucro: 62000 },
    { mes: 'Mai', receitas: 115000, despesas: 40000, lucro: 75000 },
    { mes: 'Jun', receitas: 103000, despesas: 38000, lucro: 65000 },
    { mes: 'Jul', receitas: 110000, despesas: 35000, lucro: 75000 },
    { mes: 'Ago', receitas: 105000, despesas: 32000, lucro: 73000 },
    { mes: 'Set', receitas: 98000, despesas: 30000, lucro: 68000 },
    { mes: 'Out', receitas: 112000, despesas: 34000, lucro: 78000 },
    { mes: 'Nov', receitas: 106000, despesas: 31000, lucro: 75000 },
    { mes: 'Dez', receitas: 98000, despesas: 29000, lucro: 69000 }
  ]
}
