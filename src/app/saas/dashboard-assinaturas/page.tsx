// page.tsx - Dashboard geral de Assinaturas
'use client'

import { useDashboardAssinaturas } from './use-dashboard-assinaturas'
import { FiltrosDashboard } from './components/filtros-dashboard'
import { MetricasCards } from './components/metricas-cards'
import { KPIsGrid } from './components/kpis-grid'
import { GraficosDashboard } from './components/graficos-dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, BarChart3 } from 'lucide-react'
import { TipoPlano } from './types'

export default function DashboardAssinaturasPage() {
  const {
    loading,
    error,
    metricas,
    filtros,
    aplicarFiltros,
    exportarPDF,
    buscarMetricas
  } = useDashboardAssinaturas()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getPlanoLabel = (plano: TipoPlano) => {
    const labels = {
      [TipoPlano.FREE]: 'Free',
      [TipoPlano.BASICO]: 'Básico',
      [TipoPlano.PROFISSIONAL]: 'Profissional',
      [TipoPlano.EMPRESARIAL]: 'Empresarial'
    }
    return labels[plano]
  }

  const getPlanoVariant = (plano: TipoPlano) => {
    const variants = {
      [TipoPlano.FREE]: 'secondary',
      [TipoPlano.BASICO]: 'default',
      [TipoPlano.PROFISSIONAL]: 'default',
      [TipoPlano.EMPRESARIAL]: 'default'
    } as const
    return variants[plano]
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Assinaturas</h1>
          </div>
          <p className="text-muted-foreground">
            Visão geral das principais métricas e indicadores do sistema SaaS
          </p>
        </div>

        {/* Filtros */}
        <FiltrosDashboard
          filtros={filtros}
          onFiltrosChange={aplicarFiltros}
          onExportar={exportarPDF}
          loading={loading}
        />

        {/* Conteúdo principal */}
        {error ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                <p>Erro ao carregar as métricas. Por favor, tente novamente.</p>
              </div>
            </CardContent>
          </Card>
        ) : loading && !metricas ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards de métricas principais */}
            <MetricasCards metricas={metricas} loading={loading} />

            {/* KPIs Grid */}
            <KPIsGrid metricas={metricas} loading={loading} />

            {/* Gráficos */}
            <GraficosDashboard metricas={metricas} loading={loading} />

            {/* Tabelas detalhadas */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tabela de Faturamento por Plano */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold">Faturamento por Plano</CardTitle>
                  <CardDescription>Detalhamento financeiro de cada plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plano</TableHead>
                        <TableHead className="text-center">Assinaturas</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metricas?.totalFinanceiro.porPlano.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant={getPlanoVariant(item.plano)}>
                              {getPlanoLabel(item.plano)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantidade.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.valor)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">
                          {metricas?.totalAssinaturas.total.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(metricas?.totalFinanceiro.total || 0)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Tabela de LTV por Plano */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold">Lifetime Value por Plano</CardTitle>
                  <CardDescription>Receita média por cliente durante permanência</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plano</TableHead>
                        <TableHead className="text-right">LTV</TableHead>
                        <TableHead className="text-center">Comparação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metricas?.ltv.porPlano.map((item, index) => {
                        const percentualMedia = ((item.valor / (metricas?.ltv.medio || 1)) * 100).toFixed(0)
                        const acimaDaMedia = item.valor > (metricas?.ltv.medio || 0)
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant={getPlanoVariant(item.plano)}>
                                {getPlanoLabel(item.plano)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.valor)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={acimaDaMedia ? 'default' : 'secondary'}
                                className={acimaDaMedia ? 'bg-green-100 text-green-700' : ''}
                              >
                                {percentualMedia}% da média
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow className="font-semibold bg-blue-50">
                        <TableCell>Média Geral</TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(metricas?.ltv.medio || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-600">100%</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Resumo de Métricas Críticas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Resumo Executivo</CardTitle>
                <CardDescription>Principais indicadores para tomada de decisão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Faturamento Mensal</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(metricas?.faturamento.mesAtual || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Variação: {metricas?.faturamento.variacaoMensal}%
                    </p>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Faturamento Anual</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(metricas?.faturamento.anual || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Até o último mês fechado
                    </p>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Conversão Trial</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {metricas?.conversaoTrial.percentual.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metricas?.conversaoTrial.quantidade} de {metricas?.conversaoTrial.total}
                    </p>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {metricas?.churn.percentual.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metricas?.churn.quantidade} cancelamentos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}