"use client"

import { useBalancete } from "@/hooks/use-balancete"
import { BalanceteStats } from "@/components/balancete/balancete-stats"
import { BalanceteFiltersComponent } from "@/components/balancete/balancete-filters"
import { BalanceteCharts } from "@/components/balancete/balancete-charts"
import { BalanceteKpis } from "@/components/balancete/balancete-kpis"
import { BalanceteExport } from "@/components/balancete/balancete-export"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, BarChart3 } from "lucide-react"
import { toast } from 'sonner'

export default function BalancetePage() {
  const { 
    data, 
    loading, 
    error, 
    filters, 
    chartData, 
    loadData, 
    exportData, 
    applyFilters 
  } = useBalancete()

  const handleRefresh = async () => {
    await loadData(filters)
    toast.success("Dados atualizados com sucesso!", {
      duration: 2000,
      position: "bottom-right"
    })
  }

  const handleFiltersChange = async (newFilters: any) => {
    await applyFilters(newFilters)
  }

  const handleExport = async (formato: 'pdf' | 'csv') => {
    await exportData(formato)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Balancete</h1>
          <p className="text-muted-foreground">
            Erro ao carregar dados do balancete
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => loadData()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - seguindo exatamente o Global Layout Structure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Balancete
              {loading && (
                <Badge variant="secondary" className="animate-pulse">
                  Atualizando...
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Relatório centralizado da posição financeira da empresa e processos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <BalanceteExport 
              onExport={handleExport}
              disabled={loading || !data}
            />
          </div>
        </div>
      </div>

      {/* Filtros Avançados - Cenários 2, 3, 4 do PRD */}
      <BalanceteFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Cards de Estatísticas - Cenário 1 do PRD */}
      <BalanceteStats 
        data={data}
        loading={loading}
      />

      {/* Layout Dashboard Grid - seguindo callistra-patterns.md */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráficos Principais - Cenário 7 do PRD */}
        <div className="col-span-4">
          <BalanceteCharts 
            chartData={chartData}
            loading={loading}
          />
        </div>
        
        {/* KPIs e Indicadores - Cenário 9 do PRD */}
        <div className="col-span-3">
          <BalanceteKpis 
            data={data}
            loading={loading}
          />
        </div>
      </div>

      {/* Informações de Atualização - Cenário 10 do PRD */}
      {data && !loading && (
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <p>
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
          <p>
            Período: {data.dataReferencia.inicio.toLocaleDateString('pt-BR')} até {data.dataReferencia.fim.toLocaleDateString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  )
}
