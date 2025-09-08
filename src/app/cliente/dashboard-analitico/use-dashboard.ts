"use client"

import { useState, useEffect, useCallback } from "react"
import { format, subDays, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { 
  DashboardData, 
  FilterData, 
  ExportHistory,
  TarefaAtrasada,
  ProdutividadeData,
  Usuario,
  Cargo
} from "./types"

// Dados mockados para demonstração
const mockUsuarios: Usuario[] = [
  { id: "1", nome: "João Silva", cargo: "Advogado Sênior", email: "joao@escritorio.com" },
  { id: "2", nome: "Maria Santos", cargo: "Advogada Pleno", email: "maria@escritorio.com" },
  { id: "3", nome: "Pedro Costa", cargo: "Estagiário", email: "pedro@escritorio.com" },
  { id: "4", nome: "Ana Lima", cargo: "Advogada Júnior", email: "ana@escritorio.com" },
  { id: "5", nome: "Carlos Souza", cargo: "Advogado Sênior", email: "carlos@escritorio.com" }
]

const mockCargos: Cargo[] = [
  { id: "1", nome: "Advogado Sênior", nivel: 3 },
  { id: "2", nome: "Advogada Pleno", nivel: 2 },
  { id: "3", nome: "Advogada Júnior", nivel: 1 },
  { id: "4", nome: "Estagiário", nivel: 0 }
]

const mockTarefasAtrasadas: TarefaAtrasada[] = [
  { 
    id: "1", 
    titulo: "Elaborar petição inicial", 
    responsavel: "João Silva",
    cargo: "Advogado Sênior",
    diasAtraso: 3,
    prioridade: "alta",
    processo: "Proc. 123/2024"
  },
  { 
    id: "2", 
    titulo: "Revisar contrato de locação", 
    responsavel: "Maria Santos",
    cargo: "Advogada Pleno",
    diasAtraso: 1,
    prioridade: "media",
    processo: "Proc. 456/2024"
  },
  { 
    id: "3", 
    titulo: "Protocolar recurso", 
    responsavel: "Pedro Costa",
    cargo: "Estagiário",
    diasAtraso: 5,
    prioridade: "alta",
    processo: "Proc. 789/2024"
  },
  { 
    id: "4", 
    titulo: "Análise de documentos", 
    responsavel: "Ana Lima",
    cargo: "Advogada Júnior",
    diasAtraso: 2,
    prioridade: "baixa"
  },
  { 
    id: "5", 
    titulo: "Audiência de conciliação", 
    responsavel: "Carlos Souza",
    cargo: "Advogado Sênior",
    diasAtraso: 1,
    prioridade: "alta",
    processo: "Proc. 321/2024"
  }
]

const mockProdutividade: ProdutividadeData[] = [
  {
    nome: "João Silva",
    cargo: "Advogado Sênior",
    tarefasConcluidas: 45,
    tarefasAtrasadas: 2,
    processosConcluidos: 12,
    tempoMedio: 3.5,
    eficiencia: 92
  },
  {
    nome: "Maria Santos",
    cargo: "Advogada Pleno",
    tarefasConcluidas: 38,
    tarefasAtrasadas: 1,
    processosConcluidos: 8,
    tempoMedio: 4.2,
    eficiencia: 88
  },
  {
    nome: "Pedro Costa",
    cargo: "Estagiário",
    tarefasConcluidas: 25,
    tarefasAtrasadas: 3,
    processosConcluidos: 3,
    tempoMedio: 6.1,
    eficiencia: 75
  },
  {
    nome: "Ana Lima",
    cargo: "Advogada Júnior",
    tarefasConcluidas: 32,
    tarefasAtrasadas: 1,
    processosConcluidos: 6,
    tempoMedio: 4.8,
    eficiencia: 85
  },
  {
    nome: "Carlos Souza",
    cargo: "Advogado Sênior",
    tarefasConcluidas: 50,
    tarefasAtrasadas: 1,
    processosConcluidos: 15,
    tempoMedio: 3.2,
    eficiencia: 95
  }
]

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterData>({
    periodo: { inicio: subDays(new Date(), 30), fim: new Date() },
    status: "todos"
  })
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [cargos, setCargos] = useState<Cargo[]>(mockCargos)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // Função para buscar dados
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Filtrar tarefas atrasadas
      let tarefasFiltered = [...mockTarefasAtrasadas]
      
      if (filters.usuario) {
        tarefasFiltered = tarefasFiltered.filter(t => t.responsavel === filters.usuario)
      } else if (filters.cargo) {
        tarefasFiltered = tarefasFiltered.filter(t => t.cargo === filters.cargo)
      }
      
      if (filters.busca) {
        tarefasFiltered = tarefasFiltered.filter(t => 
          t.titulo.toLowerCase().includes(filters.busca!.toLowerCase()) ||
          t.processo?.toLowerCase().includes(filters.busca!.toLowerCase())
        )
      }
      
      // Filtrar produtividade
      let produtividadeFiltered = [...mockProdutividade]
      
      if (filters.usuario) {
        produtividadeFiltered = produtividadeFiltered.filter(p => p.nome === filters.usuario)
      } else if (filters.cargo) {
        produtividadeFiltered = produtividadeFiltered.filter(p => p.cargo === filters.cargo)
      }
      
      // Gerar dados do dashboard
      const dashboardData: DashboardData = {
        processos: {
          ativos: 156,
          concluidos: 89,
          ganhos: 72,
          perdidos: 17,
          total: 245
        },
        faturamento: {
          total: 458750.00,
          recebido: 325400.00,
          pendente: 98350.00,
          vencido: 35000.00
        },
        tarefasAtrasadas: tarefasFiltered,
        produtividade: produtividadeFiltered,
        chartProcessos: {
          labels: ["Ganhos", "Perdidos"],
          datasets: [{
            label: "Processos",
            data: [72, 17],
            backgroundColor: ["#10b981", "#ef4444"]
          }]
        },
        chartProdutividade: {
          labels: produtividadeFiltered.map(p => p.nome.split(" ")[0]),
          datasets: [
            {
              label: "Tarefas Concluídas",
              data: produtividadeFiltered.map(p => p.tarefasConcluidas),
              backgroundColor: "#2563eb",
              borderColor: "#2563eb",
              tension: 0.3
            },
            {
              label: "Eficiência (%)",
              data: produtividadeFiltered.map(p => p.eficiencia),
              backgroundColor: "#10b981",
              borderColor: "#10b981",
              tension: 0.3
            }
          ]
        },
        ultimaAtualizacao: new Date()
      }
      
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar dados do dashboard")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Atualização automática em tempo real
  useEffect(() => {
    fetchDashboardData()
    
    // Configurar atualização a cada 30 segundos
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)
    
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [fetchDashboardData])

  // Função para exportar PDF
  const exportToPDF = async () => {
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss")
    const fileName = `dashboard_${timestamp}.pdf`
    
    // Simular exportação
    const newExport: ExportHistory = {
      id: Date.now().toString(),
      data: new Date(),
      formato: "pdf",
      filtros: filters,
      usuario: "Usuário Atual",
      nomeArquivo: fileName
    }
    
    setExportHistory(prev => [newExport, ...prev])
    
    // Aqui você implementaria a lógica real de exportação para PDF
    // Por exemplo, usando jsPDF ou html2pdf
    
    return fileName
  }

  // Função para exportar Excel
  const exportToExcel = async () => {
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss")
    const fileName = `dashboard_${timestamp}.xlsx`
    
    // Simular exportação
    const newExport: ExportHistory = {
      id: Date.now().toString(),
      data: new Date(),
      formato: "excel",
      filtros: filters,
      usuario: "Usuário Atual",
      nomeArquivo: fileName
    }
    
    setExportHistory(prev => [newExport, ...prev])
    
    // Aqui você implementaria a lógica real de exportação para Excel
    // Por exemplo, usando xlsx ou exceljs
    
    return fileName
  }

  // Função para aplicar filtros
  const applyFilters = (newFilters: Partial<FilterData>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Função para resetar filtros
  const resetFilters = () => {
    setFilters({
      periodo: { inicio: subDays(new Date(), 30), fim: new Date() },
      status: "todos"
    })
  }

  // Função para forçar atualização
  const forceRefresh = () => {
    fetchDashboardData()
  }

  return {
    data,
    loading,
    error,
    filters,
    usuarios,
    cargos,
    exportHistory,
    applyFilters,
    resetFilters,
    exportToPDF,
    exportToExcel,
    forceRefresh
  }
}