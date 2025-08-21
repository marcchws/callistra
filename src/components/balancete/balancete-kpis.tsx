"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BalanceteData } from "@/types/balancete"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Heart
} from "lucide-react"

interface BalanceteKpisProps {
  data: BalanceteData | null
  loading: boolean
}

export function BalanceteKpis({ data, loading }: BalanceteKpisProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-2 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const kpis = [
    {
      title: "ROI (Return on Investment)",
      value: data.indicadoresPerformance.roi,
      suffix: "x",
      description: "Retorno sobre investimento",
      icon: Target,
      target: 3.0,
      format: (value: number) => value.toFixed(1)
    },
    {
      title: "Ticket Médio",
      value: data.indicadoresPerformance.ticketMedio,
      prefix: "R$ ",
      description: "Valor médio por processo",
      icon: TrendingUp,
      target: 8000,
      format: (value: number) => value.toLocaleString('pt-BR')
    },
    {
      title: "Tempo Médio de Pagamento",
      value: data.indicadoresPerformance.tempoMedioPagamento,
      suffix: " dias",
      description: "Prazo médio para recebimento",
      icon: Clock,
      target: 30,
      reversed: true, // Menor é melhor
      format: (value: number) => value.toString()
    },
    {
      title: "Taxa de Inadimplência",
      value: data.indicadoresPerformance.taxaInadimplencia,
      suffix: "%",
      description: "Percentual de inadimplência",
      icon: AlertTriangle,
      target: 5,
      reversed: true, // Menor é melhor
      format: (value: number) => value.toFixed(1)
    },
    {
      title: "Conversão de Casos",
      value: data.indicadoresPerformance.conversaoCasos,
      suffix: "%",
      description: "Taxa de conversão lead → cliente",
      icon: Users,
      target: 80,
      format: (value: number) => value.toFixed(1)
    },
    {
      title: "Retenção de Clientes",
      value: data.indicadoresPerformance.retencaoClientes,
      suffix: "%",
      description: "Taxa de retenção anual",
      icon: Heart,
      target: 90,
      format: (value: number) => value.toFixed(1)
    }
  ]

  const getProgressValue = (kpi: typeof kpis[0]) => {
    if (kpi.reversed) {
      // Para indicadores onde menor é melhor (inadimplência, tempo de pagamento)
      return Math.max(0, Math.min(100, (kpi.target / kpi.value) * 100))
    } else {
      // Para indicadores onde maior é melhor
      return Math.min(100, (kpi.value / kpi.target) * 100)
    }
  }

  const getProgressColor = (kpi: typeof kpis[0]) => {
    const progress = getProgressValue(kpi)
    if (progress >= 90) return "bg-green-500"
    if (progress >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusColor = (kpi: typeof kpis[0]) => {
    const progress = getProgressValue(kpi)
    if (progress >= 90) return "text-green-600"
    if (progress >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Indicadores de Performance</CardTitle>
        <CardDescription>
          KPIs estratégicos para acompanhamento da performance financeira
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <kpi.icon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getStatusColor(kpi)}`}>
                  {kpi.prefix || ''}{kpi.format(kpi.value)}{kpi.suffix || ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  Meta: {kpi.prefix || ''}{kpi.format(kpi.target)}{kpi.suffix || ''}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Progress 
                value={getProgressValue(kpi)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{kpi.reversed ? 'Objetivo' : 'Início'}</span>
                <span>{getProgressValue(kpi).toFixed(0)}% {kpi.reversed ? 'eficiência' : 'da meta'}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
