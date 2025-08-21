"use client"

import { useState, useEffect, useCallback } from 'react'
import { BalanceteData, BalanceteFilters, BalanceteState, ChartData } from '@/types/balancete'

// Mock data seguindo EXATAMENTE os campos do PRD
const mockBalanceteData: BalanceteData = {
  id: '1',
  dataReferencia: {
    inicio: new Date(2024, 0, 1), // Janeiro 2024
    fim: new Date(2024, 11, 31), // Dezembro 2024
    tipo: 'anual'
  },
  totalProcessos: 156,
  ganhos: 890000,
  honorarios: 750000,
  fixosRecorrentes: {
    receitas: 45000,
    despesas: 32000
  },
  despesas: 234000,
  custasProcessuais: 56000,
  inadimplencia: {
    valor: 89000,
    percentual: 10.2
  },
  faturamento: 1125000,
  indicadoresPerformance: {
    roi: 3.8,
    ticketMedio: 7211.54,
    tempoMedioPagamento: 45,
    taxaInadimplencia: 10.2,
    conversaoCasos: 78.5,
    retencaoClientes: 92.3
  }
}

const mockChartData = {
  receitas: [
    { name: 'Honorários', value: 750000, color: '#2563eb' },
    { name: 'Receitas Fixas', value: 45000, color: '#3b82f6' },
    { name: 'Outras Receitas', value: 95000, color: '#60a5fa' }
  ],
  despesas: [
    { name: 'Operacionais', value: 120000, color: '#dc2626' },
    { name: 'Custas Processuais', value: 56000, color: '#ef4444' },
    { name: 'Despesas Fixas', value: 32000, color: '#f87171' },
    { name: 'Marketing', value: 26000, color: '#fca5a5' }
  ],
  evolucao: [
    { name: 'Jan', value: 85000 },
    { name: 'Fev', value: 92000 },
    { name: 'Mar', value: 88000 },
    { name: 'Abr', value: 95000 },
    { name: 'Mai', value: 102000 },
    { name: 'Jun', value: 98000 },
    { name: 'Jul', value: 105000 },
    { name: 'Ago', value: 108000 },
    { name: 'Set', value: 96000 },
    { name: 'Out', value: 110000 },
    { name: 'Nov', value: 103000 },
    { name: 'Dez', value: 118000 }
  ]
}

export function useBalancete() {
  const [state, setState] = useState<BalanceteState>({
    data: null,
    loading: true,
    error: null,
    filters: {},
    chartData: mockChartData
  })

  // Simulação de carregamento de dados baseado nos cenários do PRD
  const loadData = useCallback(async (filters?: BalanceteFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simula API call com delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aplica filtros nos dados mock (cenários 2, 3, 4 do PRD)
      let filteredData = { ...mockBalanceteData }
      
      if (filters?.cliente) {
        filteredData.cliente = filters.cliente
        // Simula dados filtrados por cliente
        filteredData.faturamento = filteredData.faturamento * 0.3
        filteredData.ganhos = filteredData.ganhos * 0.3
      }
      
      if (filters?.tipoServico) {
        filteredData.tipoServico = filters.tipoServico
        // Simula dados filtrados por tipo de serviço
        filteredData.faturamento = filteredData.faturamento * 0.4
        filteredData.ganhos = filteredData.ganhos * 0.4
      }
      
      setState(prev => ({
        ...prev,
        data: filteredData,
        loading: false,
        filters: filters || {}
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar dados do balancete',
        loading: false
      }))
    }
  }, [])

  // Função para exportar dados (cenários 5 e 6 do PRD)
  const exportData = useCallback(async (formato: 'pdf' | 'csv') => {
    if (!state.data) return

    // Simula exportação
    const filename = `balancete-${new Date().toISOString().split('T')[0]}.${formato}`
    
    if (formato === 'csv') {
      // Simula geração de CSV
      const csvContent = [
        'Campo,Valor',
        `Total de Processos,${state.data.totalProcessos}`,
        `Ganhos,R$ ${state.data.ganhos.toLocaleString('pt-BR')}`,
        `Honorários,R$ ${state.data.honorarios.toLocaleString('pt-BR')}`,
        `Despesas,R$ ${state.data.despesas.toLocaleString('pt-BR')}`,
        `Faturamento,R$ ${state.data.faturamento.toLocaleString('pt-BR')}`,
        `Taxa de Inadimplência,${state.data.inadimplencia.percentual}%`
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    } else {
      // Simula geração de PDF
      console.log('Exportando PDF...', filename)
    }
  }, [state.data])

  // Simulação de atualização em tempo real (cenário 10 do PRD)
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.data && !state.loading) {
        setState(prev => ({
          ...prev,
          data: prev.data ? {
            ...prev.data,
            // Simula pequenas variações em tempo real
            faturamento: prev.data.faturamento + Math.floor(Math.random() * 1000 - 500)
          } : null
        }))
      }
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [state.data, state.loading])

  // Carrega dados iniciais
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    ...state,
    loadData,
    exportData,
    applyFilters: loadData
  }
}
