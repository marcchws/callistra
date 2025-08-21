"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BalanceteData } from "@/types/balancete"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  CreditCard, 
  AlertTriangle,
  Target,
  Users
} from "lucide-react"

interface BalanceteStatsProps {
  data: BalanceteData | null
  loading: boolean
}

export function BalanceteStats({ data, loading }: BalanceteStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const stats = [
    {
      title: "Total de Processos",
      value: data.totalProcessos.toString(),
      description: "Ativos e encerrados no período",
      icon: FileText,
      trend: "neutral"
    },
    {
      title: "Faturamento Total",
      value: `R$ ${data.faturamento.toLocaleString('pt-BR')}`,
      description: "Receita bruta do período",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Ganhos Líquidos",
      value: `R$ ${data.ganhos.toLocaleString('pt-BR')}`,
      description: "Após despesas e custas",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Honorários",
      value: `R$ ${data.honorarios.toLocaleString('pt-BR')}`,
      description: "Receita de honorários",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Despesas Totais",
      value: `R$ ${data.despesas.toLocaleString('pt-BR')}`,
      description: "Gastos operacionais",
      icon: TrendingDown,
      trend: "down"
    },
    {
      title: "Custas Processuais",
      value: `R$ ${data.custasProcessuais.toLocaleString('pt-BR')}`,
      description: "Custas judiciais pagas",
      icon: AlertTriangle,
      trend: "neutral"
    },
    {
      title: "Taxa de Inadimplência",
      value: `${data.inadimplencia.percentual.toFixed(1)}%`,
      description: `R$ ${data.inadimplencia.valor.toLocaleString('pt-BR')} em aberto`,
      icon: AlertTriangle,
      trend: data.inadimplencia.percentual > 10 ? "down" : "neutral"
    },
    {
      title: "Ticket Médio",
      value: `R$ ${data.indicadoresPerformance.ticketMedio.toLocaleString('pt-BR')}`,
      description: "Valor médio por processo",
      icon: Target,
      trend: "up"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <stat.icon className="h-4 w-4" />
              {stat.title}
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              {stat.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
