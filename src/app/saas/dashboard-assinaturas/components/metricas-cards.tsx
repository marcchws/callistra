// metricas-cards.tsx - Cards principais de métricas
'use client'

import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  UserCheck,
  AlertCircle,
  Target,
  Repeat,
  Brain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetricasDashboard } from '../types'
import { Skeleton } from '@/components/ui/skeleton'

interface MetricasCardsProps {
  metricas: MetricasDashboard | null
  loading?: boolean
}

export function MetricasCards({ metricas, loading = false }: MetricasCardsProps) {
  if (loading || !metricas) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const cards = [
    {
      title: 'Total de Assinaturas',
      value: metricas.totalAssinaturas.total.toLocaleString('pt-BR'),
      subtitle: `Free: ${metricas.totalAssinaturas.free} | Pagas: ${metricas.totalAssinaturas.pagas}`,
      change: metricas.totalAssinaturas.variacao,
      icon: Users,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(metricas.totalFinanceiro.total),
      subtitle: 'Assinaturas ativas',
      change: metricas.faturamento.variacaoMensal,
      icon: DollarSign,
      iconColor: 'text-green-600'
    },
    {
      title: 'Conversão Trial → Pago',
      value: formatPercent(metricas.conversaoTrial.percentual),
      subtitle: `${metricas.conversaoTrial.quantidade} de ${metricas.conversaoTrial.total}`,
      change: null,
      icon: UserCheck,
      iconColor: 'text-purple-600'
    },
    {
      title: 'LTV Médio',
      value: formatCurrency(metricas.ltv.medio),
      subtitle: 'Lifetime value por cliente',
      change: null,
      icon: Target,
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Churn Rate',
      value: formatPercent(metricas.churn.percentual),
      subtitle: `${metricas.churn.quantidade} cancelamentos`,
      change: metricas.churn.variacaoMensal,
      icon: TrendingDown,
      iconColor: 'text-red-600',
      invertChange: true
    },
    {
      title: 'Inadimplência',
      value: formatCurrency(metricas.inadimplencia.montante),
      subtitle: `${metricas.inadimplencia.quantidade} clientes (${formatPercent(metricas.inadimplencia.percentual)})`,
      change: null,
      icon: AlertCircle,
      iconColor: 'text-orange-600'
    },
    {
      title: 'Retenção de Clientes',
      value: formatPercent(metricas.kpis.retencaoClientes),
      subtitle: 'Taxa de retenção',
      change: null,
      icon: Repeat,
      iconColor: 'text-teal-600'
    },
    {
      title: 'Acessos IA',
      value: metricas.acessosIA.mesVigente.toLocaleString('pt-BR'),
      subtitle: 'Criação de peças com IA',
      change: metricas.acessosIA.variacao,
      icon: Brain,
      iconColor: 'text-violet-600'
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.invertChange 
          ? (card.change && card.change < 0) 
          : (card.change && card.change > 0)
        
        return (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
              {card.change !== null && (
                <div className="flex items-center gap-1 mt-2">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <Badge 
                    variant={isPositive ? 'default' : 'destructive'}
                    className={`text-xs ${isPositive ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}
                  >
                    {Math.abs(card.change)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs mês anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}