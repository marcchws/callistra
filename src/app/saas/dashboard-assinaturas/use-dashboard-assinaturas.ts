// use-dashboard-assinaturas.ts - Hook para gestão de dados do dashboard
'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { 
  MetricasDashboard, 
  FiltrosDashboard, 
  TipoPlano,
  StatusAssinatura,
  DadosGrafico
} from './types'

// Dados mockados para demonstração
const generateMockData = (filtros: FiltrosDashboard): MetricasDashboard => {
  // Simulação de variações baseadas nos filtros
  const planFilter = filtros.plano
  const baseMultiplier = planFilter ? 0.3 : 1 // Reduz números quando filtrado por plano
  
  return {
    totalAssinaturas: {
      total: Math.floor(2847 * baseMultiplier),
      free: Math.floor(1523 * baseMultiplier),
      pagas: Math.floor(1324 * baseMultiplier),
      variacao: planFilter ? -5.2 : 12.5
    },
    
    totalFinanceiro: {
      total: planFilter ? 187500 : 625000,
      porPlano: [
        { plano: TipoPlano.FREE, valor: 0, quantidade: Math.floor(1523 * baseMultiplier) },
        { plano: TipoPlano.BASICO, valor: planFilter === TipoPlano.BASICO ? 45000 : 150000, quantidade: Math.floor(450 * baseMultiplier) },
        { plano: TipoPlano.PROFISSIONAL, valor: planFilter === TipoPlano.PROFISSIONAL ? 87500 : 275000, quantidade: Math.floor(550 * baseMultiplier) },
        { plano: TipoPlano.EMPRESARIAL, valor: planFilter === TipoPlano.EMPRESARIAL ? 55000 : 200000, quantidade: Math.floor(324 * baseMultiplier) }
      ].filter(p => !planFilter || p.plano === planFilter)
    },
    
    kpis: {
      roi: 285.4,
      ticketMedio: 472.50,
      tempoPagamento: 28,
      taxaInadimplencia: 3.8,
      conversaoCasos: 68.5,
      retencaoClientes: 92.3
    },
    
    faturamento: {
      mesAtual: planFilter ? 62500 : 208333,
      anual: planFilter ? 750000 : 2500000,
      variacaoMensal: 8.7
    },
    
    conversaoTrial: {
      percentual: 42.3,
      quantidade: Math.floor(127 * baseMultiplier),
      total: Math.floor(300 * baseMultiplier)
    },
    
    ltv: {
      medio: 4850,
      porPlano: [
        { plano: TipoPlano.BASICO, valor: 2100 },
        { plano: TipoPlano.PROFISSIONAL, valor: 5200 },
        { plano: TipoPlano.EMPRESARIAL, valor: 8400 }
      ].filter(p => !planFilter || p.plano === planFilter)
    },
    
    receitaProjetada: {
      proximosMeses: [
        { mes: 'Janeiro/2025', valor: planFilter ? 65000 : 216666 },
        { mes: 'Fevereiro/2025', valor: planFilter ? 68000 : 226666 },
        { mes: 'Março/2025', valor: planFilter ? 71000 : 236666 },
        { mes: 'Abril/2025', valor: planFilter ? 74000 : 246666 },
        { mes: 'Maio/2025', valor: planFilter ? 77000 : 256666 },
        { mes: 'Junho/2025', valor: planFilter ? 80000 : 266666 }
      ],
      totalProjetado: planFilter ? 435000 : 1450000
    },
    
    churn: {
      percentual: 2.1,
      quantidade: Math.floor(60 * baseMultiplier),
      quantidadeFree: Math.floor(32 * baseMultiplier),
      quantidadePagas: Math.floor(28 * baseMultiplier),
      variacaoMensal: -0.3
    },
    
    inadimplencia: {
      quantidade: Math.floor(50 * baseMultiplier),
      montante: planFilter ? 7125 : 23750,
      percentual: 3.8
    },
    
    acessosIA: {
      mesVigente: Math.floor(3847 * baseMultiplier),
      mesAnterior: Math.floor(3215 * baseMultiplier),
      variacao: 19.6
    },
    
    assinaturasPorPlano: [
      { plano: TipoPlano.FREE, quantidade: Math.floor(1523 * baseMultiplier), percentual: 53.5 },
      { plano: TipoPlano.BASICO, quantidade: Math.floor(450 * baseMultiplier), percentual: 15.8 },
      { plano: TipoPlano.PROFISSIONAL, quantidade: Math.floor(550 * baseMultiplier), percentual: 19.3 },
      { plano: TipoPlano.EMPRESARIAL, quantidade: Math.floor(324 * baseMultiplier), percentual: 11.4 }
    ].filter(p => !planFilter || p.plano === planFilter)
  }
}

export const useDashboardAssinaturas = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null)
  const [filtros, setFiltros] = useState<FiltrosDashboard>({
    periodo: { tipo: 'mes' }
  })

  // Buscar métricas com base nos filtros
  const buscarMetricas = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dados = generateMockData(filtros)
      setMetricas(dados)
      
      toast.success('Métricas atualizadas com sucesso!', {
        duration: 2000,
        position: 'bottom-right'
      })
    } catch (err) {
      const message = 'Erro ao carregar métricas do dashboard'
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: 'bottom-right'
      })
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  const aplicarFiltros = (novosFiltros: FiltrosDashboard) => {
    setFiltros(novosFiltros)
  }

  // Exportar para PDF
  const exportarPDF = async () => {
    if (!metricas) {
      toast.error('Não há dados para exportar', {
        duration: 3000,
        position: 'bottom-right'
      })
      return
    }

    setLoading(true)
    
    try {
      // Simula geração de PDF
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Em produção, aqui você faria a chamada real para gerar o PDF
      // Por exemplo, usando jsPDF ou uma API backend
      
      // Simula download
      const blob = new Blob(['PDF Content'], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dashboard-assinaturas-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('PDF exportado com sucesso!', {
        duration: 2000,
        position: 'bottom-right'
      })
    } catch (err) {
      toast.error('Erro ao exportar PDF', {
        duration: 3000,
        position: 'bottom-right'
      })
    } finally {
      setLoading(false)
    }
  }

  // Preparar dados para gráficos
  const dadosGraficos = useMemo(() => {
    if (!metricas) return null
    
    return {
      assinaturasPorPlano: {
        labels: metricas.assinaturasPorPlano.map(p => p.plano.toUpperCase()),
        datasets: [{
          label: 'Assinaturas',
          data: metricas.assinaturasPorPlano.map(p => p.quantidade),
          backgroundColor: [
            'rgba(59, 130, 246, 0.5)',  // blue-500
            'rgba(34, 197, 94, 0.5)',   // green-500
            'rgba(168, 85, 247, 0.5)',  // purple-500
            'rgba(251, 146, 60, 0.5)'   // orange-400
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(34, 197, 94)',
            'rgb(168, 85, 247)',
            'rgb(251, 146, 60)'
          ]
        }]
      } as DadosGrafico,
      
      receitaProjetada: {
        labels: metricas.receitaProjetada.proximosMeses.map(m => m.mes),
        datasets: [{
          label: 'Receita Projetada',
          data: metricas.receitaProjetada.proximosMeses.map(m => m.valor),
          backgroundColor: 'rgba(37, 99, 235, 0.1)',  // blue-600 com opacity
          borderColor: 'rgb(37, 99, 235)'  // blue-600
        }]
      } as DadosGrafico
    }
  }, [metricas])

  // Buscar dados ao montar o componente
  useEffect(() => {
    buscarMetricas()
  }, [filtros])

  return {
    loading,
    error,
    metricas,
    filtros,
    aplicarFiltros,
    exportarPDF,
    buscarMetricas,
    dadosGraficos
  }
}