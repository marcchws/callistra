"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDashboard } from "./use-dashboard"
import { DashboardStats } from "./components/dashboard-stats"
import { DashboardFilters } from "./components/dashboard-filters"
import { DashboardCharts } from "./components/dashboard-charts"
import { DashboardExports } from "./components/dashboard-exports"

export default function DashboardAnalitico() {
  const {
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
  } = useDashboard()

  // Auto-refresh indicator
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        // Apenas para indicar visualmente que houve atualização
        const element = document.getElementById("last-update")
        if (element) {
          element.classList.add("animate-pulse")
          setTimeout(() => {
            element.classList.remove("animate-pulse")
          }, 1000)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [data])

  // Loading skeleton
  if (loading && !data) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-48" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard Analítico</h1>
                </div>
                <p className="text-muted-foreground">
                  Indicadores estratégicos e operacionais do escritório
                </p>
              </div>
              <div className="flex items-center gap-4">
                {data && (
                  <div id="last-update" className="text-sm text-muted-foreground">
                    Última atualização: {format(data.ultimaAtualizacao, "HH:mm:ss", { locale: ptBR })}
                  </div>
                )}
                <DashboardExports
                  exportHistory={exportHistory}
                  onExportPDF={exportToPDF}
                  onExportExcel={exportToExcel}
                />
              </div>
            </div>

            {/* Filtros */}
            <DashboardFilters
              filters={filters}
              usuarios={usuarios}
              cargos={cargos}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              onRefresh={forceRefresh}
            />

            {data && (
              <>
                {/* Cards de Estatísticas */}
                <DashboardStats
                  processos={data.processos}
                  faturamento={data.faturamento}
                />

                {/* Gráficos e Tarefas */}
                <DashboardCharts
                  chartProcessos={data.chartProcessos}
                  chartProdutividade={data.chartProdutividade}
                  tarefasAtrasadas={data.tarefasAtrasadas}
                  produtividade={data.produtividade}
                />
              </>
            )}

            {/* Loading overlay para atualizações */}
            {loading && data && (
              <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    <span className="text-sm">Atualizando dados...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}