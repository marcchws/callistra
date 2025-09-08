"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import type { ProcessoStats, FaturamentoData } from "../types"

interface DashboardStatsProps {
  processos: ProcessoStats
  faturamento: FaturamentoData
}

export function DashboardStats({ processos, faturamento }: DashboardStatsProps) {
  const percentualGanhos = processos.total > 0 
    ? ((processos.ganhos / (processos.ganhos + processos.perdidos)) * 100).toFixed(1)
    : "0"

  const percentualPerdidos = processos.total > 0
    ? ((processos.perdidos / (processos.ganhos + processos.perdidos)) * 100).toFixed(1)
    : "0"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const stats = [
    {
      title: "Processos Ativos",
      value: processos.ativos.toString(),
      icon: FileText,
      description: "Em andamento",
      color: "text-blue-600"
    },
    {
      title: "Processos Concluídos",
      value: processos.concluidos.toString(),
      icon: CheckCircle,
      description: "Finalizados",
      color: "text-green-600"
    },
    {
      title: "Taxa de Sucesso",
      value: `${percentualGanhos}%`,
      icon: TrendingUp,
      description: `${processos.ganhos} ganhos de ${processos.ganhos + processos.perdidos}`,
      color: "text-green-600"
    },
    {
      title: "Taxa de Perdas",
      value: `${percentualPerdidos}%`,
      icon: TrendingDown,
      description: `${processos.perdidos} perdidos de ${processos.ganhos + processos.perdidos}`,
      color: "text-red-600"
    },
    {
      title: "Faturamento Total",
      value: formatCurrency(faturamento.total),
      icon: DollarSign,
      description: "Valor total faturado",
      color: "text-blue-600"
    },
    {
      title: "Recebido",
      value: formatCurrency(faturamento.recebido),
      icon: CheckCircle,
      description: "Pagamentos recebidos",
      color: "text-green-600"
    },
    {
      title: "Pendente",
      value: formatCurrency(faturamento.pendente),
      icon: Clock,
      description: "Aguardando pagamento",
      color: "text-yellow-600"
    },
    {
      title: "Vencido",
      value: formatCurrency(faturamento.vencido),
      icon: XCircle,
      description: "Pagamentos em atraso",
      color: "text-red-600"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}