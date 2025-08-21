"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from 'sonner'
import type { 
  DashboardData, 
  DashboardFilters, 
  DashboardState, 
  ExportFormat,
  ExportParams,
  RealTimeMetrics
} from "./types"
import mockDashboardData from "./types"

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    data: mockDashboardData,
    loading: false,
    error: null,
    filters: {
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
      }
    },
    lastUpdated: new Date()
  })

  // Simular carregamento inicial
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Simular atualização em tempo real a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.loading) {
        updateRealTimeData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [state.loading])

  const loadDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simular API call com delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular dados baseados nos filtros
      const filteredData = applyFilters(mockDashboardData, state.filters)
      
      setState(prev => ({
        ...prev,
        data: filteredData,
        loading: false,
        lastUpdated: new Date()
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dados'
      }))
    }
  }, [state.filters])

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }))
    
    // Recarregar dados com novos filtros
    setTimeout(() => {
      loadDashboardData()
    }, 300) // Debounce
  }, [loadDashboardData])

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      // Simular refresh
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Simular pequenas alterações nos dados para demonstrar tempo real
      const updatedData = {
        ...mockDashboardData,
        processosAtivos: mockDashboardData.processosAtivos + Math.floor(Math.random() * 5),
        tarefasAtrasadas: Math.max(0, mockDashboardData.tarefasAtrasadas + Math.floor(Math.random() * 3) - 1),
        faturamento: mockDashboardData.faturamento + Math.floor(Math.random() * 10000)
      }
      
      const filteredData = applyFilters(updatedData, state.filters)
      
      setState(prev => ({
        ...prev,
        data: filteredData,
        loading: false,
        lastUpdated: new Date()
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao atualizar dados'
      }))
      throw error
    }
  }, [state.filters])

  const exportData = useCallback(async (format: ExportFormat, filters: DashboardFilters) => {
    try {
      // Simular processo de exportação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular geração do arquivo
      const exportParams: ExportParams = {
        format,
        filters,
        includeCharts: true,
        fileName: `dashboard_${format}_${new Date().toISOString().split('T')[0]}`
      }
      
      // Adicionar ao histórico de exportações
      const novaExportacao = {
        id: Date.now().toString(),
        data: new Date().toISOString(),
        formato: format,
        filtros: formatFiltersForHistory(filters),
        usuario: 'Usuário Atual', // Em produção, pegar do contexto de auth
        tamanho: format === 'pdf' ? '2.5 MB' : '1.8 MB'
      }
      
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          historicoExportacoes: [novaExportacao, ...(prev.data.historicoExportacoes || [])]
        }
      }))
      
      // Simular download do arquivo
      console.log('Exportando:', exportParams)
      
    } catch (error) {
      throw new Error(`Erro ao exportar dashboard em ${format.toUpperCase()}`)
    }
  }, [])

  const updateRealTimeData = useCallback(() => {
    // Simular pequenas atualizações em tempo real
    setState(prev => {
      if (prev.loading) return prev
      
      const updates: Partial<DashboardData> = {}
      
      // Atualizar aleatoriamente alguns valores para simular tempo real
      if (Math.random() > 0.7) {
        updates.processosAtivos = prev.data.processosAtivos + (Math.random() > 0.5 ? 1 : 0)
      }
      
      if (Math.random() > 0.8) {
        updates.tarefasAtrasadas = Math.max(0, prev.data.tarefasAtrasadas + (Math.random() > 0.5 ? 1 : -1))
      }
      
      if (Math.random() > 0.9) {
        updates.faturamento = prev.data.faturamento + Math.floor(Math.random() * 5000)
      }
      
      if (Object.keys(updates).length > 0) {
        return {
          ...prev,
          data: { ...prev.data, ...updates },
          lastUpdated: new Date()
        }
      }
      
      return prev
    })
  }, [])

  // Função auxiliar para aplicar filtros
  const applyFilters = (data: DashboardData, filters: DashboardFilters): DashboardData => {
    let filteredData = { ...data }
    
    // Aplicar filtro de usuário
    if (filters.userId && filters.userId !== 'todos') {
      const usuario = data.usuarios?.find(u => u.id === filters.userId)
      if (usuario) {
        // Filtrar tarefas atrasadas por usuário
        filteredData.tarefasAtrasadasDetalhes = data.tarefasAtrasadasDetalhes?.filter(
          tarefa => tarefa.responsavel === usuario.nome
        )
        
        // Filtrar produtividade por usuário
        filteredData.produtividade = data.produtividade?.filter(
          prod => prod.id === filters.userId
        )
        
        // Recalcular número de tarefas atrasadas
        filteredData.tarefasAtrasadas = filteredData.tarefasAtrasadasDetalhes?.length || 0
      }
    }
    
    // Aplicar filtro de cargo
    if (filters.cargo && filters.cargo !== 'todos') {
      filteredData.tarefasAtrasadasDetalhes = filteredData.tarefasAtrasadasDetalhes?.filter(
        tarefa => tarefa.cargo === filters.cargo
      )
      
      filteredData.produtividade = filteredData.produtividade?.filter(
        prod => prod.cargo === filters.cargo
      )
      
      filteredData.tarefasAtrasadas = filteredData.tarefasAtrasadasDetalhes?.length || 0
    }
    
    // Aplicar filtro de busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      
      filteredData.tarefasAtrasadasDetalhes = filteredData.tarefasAtrasadasDetalhes?.filter(
        tarefa => 
          tarefa.titulo.toLowerCase().includes(searchLower) ||
          tarefa.responsavel.toLowerCase().includes(searchLower) ||
          tarefa.processo?.toLowerCase().includes(searchLower)
      )
      
      filteredData.tarefasAtrasadas = filteredData.tarefasAtrasadasDetalhes?.length || 0
    }
    
    return filteredData
  }

  // Função auxiliar para formatar filtros para histórico
  const formatFiltersForHistory = (filters: DashboardFilters): string => {
    const parts: string[] = []
    
    if (filters.dateRange) {
      const from = filters.dateRange.from.toLocaleDateString('pt-BR')
      const to = filters.dateRange.to.toLocaleDateString('pt-BR')
      parts.push(`${from} - ${to}`)
    }
    
    if (filters.userId && filters.userId !== 'todos') {
      const usuario = state.data.usuarios?.find(u => u.id === filters.userId)
      if (usuario) {
        parts.push(`Usuário: ${usuario.nome}`)
      }
    }
    
    if (filters.cargo && filters.cargo !== 'todos') {
      parts.push(`Cargo: ${filters.cargo}`)
    }
    
    if (filters.status && filters.status !== 'todos') {
      parts.push(`Status: ${filters.status}`)
    }
    
    if (filters.searchTerm) {
      parts.push(`Busca: "${filters.searchTerm}"`)
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Todos os dados'
  }

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    lastUpdated: state.lastUpdated,
    updateFilters,
    exportData,
    refreshData,
    loadDashboardData
  }
}