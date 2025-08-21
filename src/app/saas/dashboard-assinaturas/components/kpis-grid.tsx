// kpis-grid.tsx - Grid de indicadores de performance (KPIs)
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MetricasDashboard } from '../types'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react'

interface KPIsGridProps {
  metricas: MetricasDashboard | null
  loading?: boolean
}

export function KPIsGrid({ metricas, loading = false }: KPIsGridProps) {
  if (loading || !metricas) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const kpis = [
    {
      label: 'ROI',
      value: metricas.kpis.roi,
      format: 'percent',
      icon: TrendingUp,
      color: 'blue',
      target: 250,
      description: 'Retorno sobre investimento'
    },
    {
      label: 'Ticket Médio',
      value: metricas.kpis.ticketMedio,
      format: 'currency',
      icon: DollarSign,
      color: 'green',
      target: 500,
      description: 'Valor médio por cliente'
    },
    {
      label: 'Tempo de Pagamento',
      value: metricas.kpis.tempoPagamento,
      format: 'days',
      icon: Clock,
      color: 'yellow',
      target: 30,
      description: 'Média em dias',
      inverse: true // menor é melhor
    },
    {
      label: 'Taxa de Inadimplência',
      value: metricas.kpis.taxaInadimplencia,
      format: 'percent',
      icon: AlertTriangle,
      color: 'red',
      target: 5,
      description: 'Clientes inadimplentes',
      inverse: true // menor é melhor
    },
    {
      label: 'Conversão de Casos',
      value: metricas.kpis.conversaoCasos,
      format: 'percent',
      icon: CheckCircle,
      color: 'purple',
      target: 70,
      description: 'Taxa de sucesso'
    },
    {
      label: 'Retenção de Clientes',
      value: metricas.kpis.retencaoClientes,
      format: 'percent',
      icon: Users,
      color: 'teal',
      target: 90,
      description: 'Taxa de retenção mensal'
    }
  ]

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value)
      case 'days':
        return `${value} dias`
      default:
        return value.toString()
    }
  }

  const getProgress = (value: number, target: number, inverse: boolean = false) => {
    if (inverse) {
      return Math.max(0, Math.min(100, ((target - value) / target) * 100))
    }
    return Math.min(100, (value / target) * 100)
  }

  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-yellow-500'
    if (progress >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (progress: number) => {
    if (progress >= 90) return { text: 'Excelente', variant: 'default' as const }
    if (progress >= 70) return { text: 'Bom', variant: 'secondary' as const }
    if (progress >= 50) return { text: 'Regular', variant: 'outline' as const }
    return { text: 'Atenção', variant: 'destructive' as const }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Indicadores de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            const progress = getProgress(kpi.value, kpi.target, kpi.inverse)
            const status = getStatusBadge(progress)
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-${kpi.color}-600`} />
                    <span className="text-sm font-medium">{kpi.label}</span>
                  </div>
                  <Badge variant={status.variant} className="text-xs">
                    {status.text}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold tracking-tight">
                      {formatValue(kpi.value, kpi.format)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Meta: {formatValue(kpi.target, kpi.format)}
                    </span>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2"
                    indicatorClassName={getStatusColor(progress)}
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    {kpi.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}