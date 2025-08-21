// graficos-dashboard.tsx - Componente de gráficos do dashboard
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricasDashboard, TipoPlano } from '../types'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, PieChart, TrendingUp } from 'lucide-react'

interface GraficosDashboardProps {
  metricas: MetricasDashboard | null
  loading?: boolean
}

export function GraficosDashboard({ metricas, loading = false }: GraficosDashboardProps) {
  if (loading || !metricas) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  const getPlanoColor = (plano: TipoPlano) => {
    const colors = {
      [TipoPlano.FREE]: 'bg-gray-400',
      [TipoPlano.BASICO]: 'bg-blue-400',
      [TipoPlano.PROFISSIONAL]: 'bg-purple-500',
      [TipoPlano.EMPRESARIAL]: 'bg-orange-500'
    }
    return colors[plano]
  }

  // Calcular o máximo valor para escala do gráfico
  const maxReceita = Math.max(...metricas.receitaProjetada.proximosMeses.map(m => m.valor))
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Gráfico de Receita Projetada */}
      <Card className="col-span-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Receita Projetada</CardTitle>
              <CardDescription>Próximos 6 meses baseado em recorrências</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between text-sm">
              <span className="text-muted-foreground">Total projetado:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(metricas.receitaProjetada.totalProjetado)}
              </span>
            </div>
            
            {/* Gráfico de barras simplificado */}
            <div className="space-y-3">
              {metricas.receitaProjetada.proximosMeses.map((mes, index) => {
                const porcentagem = (mes.valor / maxReceita) * 100
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{mes.mes.split('/')[0]}</span>
                      <span className="font-medium">{formatCurrency(mes.valor)}</span>
                    </div>
                    <div className="h-8 bg-blue-50 rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-md transition-all duration-500"
                        style={{ width: `${porcentagem}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição por Plano */}
      <Card className="col-span-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Distribuição por Plano</CardTitle>
              <CardDescription>Total de assinaturas ativas</CardDescription>
            </div>
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quantidade" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quantidade">Quantidade</TabsTrigger>
              <TabsTrigger value="receita">Receita</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quantidade" className="space-y-4">
              <div className="space-y-3">
                {metricas.assinaturasPorPlano.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPlanoColor(item.plano)}`} />
                        <span className="font-medium">{getPlanoLabel(item.plano)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.quantidade}</span>
                        <span className="font-medium">{item.percentual.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPlanoColor(item.plano)} transition-all duration-500`}
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de assinaturas</span>
                  <span className="text-lg font-bold">{metricas.totalAssinaturas.total.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="receita" className="space-y-4">
              <div className="space-y-3">
                {metricas.totalFinanceiro.porPlano
                  .filter(p => p.plano !== TipoPlano.FREE)
                  .map((item, index) => {
                    const percentual = (item.valor / metricas.totalFinanceiro.total) * 100
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPlanoColor(item.plano)}`} />
                            <span className="font-medium">{getPlanoLabel(item.plano)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{formatCurrency(item.valor)}</span>
                            <span className="font-medium">{percentual.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getPlanoColor(item.plano)} transition-all duration-500`}
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita total</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(metricas.totalFinanceiro.total)}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}