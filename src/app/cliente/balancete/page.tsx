"use client"

import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useBalancete } from "./use-balancete"
import { BalanceteFilters } from "./components/balancete-filters"
import { BalanceteIndicators } from "./components/balancete-indicators"
import { BalanceteCharts } from "./components/balancete-charts"
import { BalanceteTable } from "./components/balancete-table"
import { BalanceteExport } from "./components/balancete-export"

export default function BalancetePage() {
  const {
    balancete,
    evolucaoMensal,
    loading,
    error,
    filtros,
    exportando,
    aplicarFiltros,
    limparFiltros,
    exportarRelatorio,
    atualizarDados
  } = useBalancete()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Balancete</h1>
                  <p className="text-muted-foreground">
                    Relatório centralizado da posição financeira com indicadores de performance
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={atualizarDados}
                    disabled={loading}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar Dados
                  </Button>
                  <BalanceteExport
                    onExport={exportarRelatorio}
                    exportando={exportando}
                    disabled={loading || !balancete}
                  />
                </div>
              </div>
            </div>

            {/* Filtros */}
            <BalanceteFilters
              filtros={filtros}
              onFiltrar={aplicarFiltros}
              onLimpar={limparFiltros}
              loading={loading}
            />

            {/* Indicadores de Performance */}
            <BalanceteIndicators 
              balancete={balancete}
              loading={loading}
            />

            {/* Visualizações com Tabs */}
            <Tabs defaultValue="graficos" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                <TabsTrigger value="tabelas">Tabelas</TabsTrigger>
              </TabsList>

              {/* Conteúdo de Gráficos */}
              <TabsContent value="graficos" className="space-y-4">
                <BalanceteCharts
                  balancete={balancete}
                  evolucaoMensal={evolucaoMensal}
                  loading={loading}
                />
              </TabsContent>

              {/* Conteúdo de Tabelas */}
              <TabsContent value="tabelas" className="space-y-4">
                <BalanceteTable
                  balancete={balancete}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
