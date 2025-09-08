"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  Target,
  Users,
  BarChart3
} from "lucide-react"
import { Balancete } from "../types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BalanceteIndicatorsProps {
  balancete: Balancete | null
  loading?: boolean
}

export function BalanceteIndicators({ balancete, loading }: BalanceteIndicatorsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!balancete) return null

  const indicadores = [
    {
      titulo: "ROI",
      valor: `${balancete.indicadores.roi}%`,
      descricao: "Retorno sobre investimento",
      icon: BarChart3,
      cor: "text-green-600",
      bgCor: "bg-green-100",
      tooltip: "Retorno sobre Investimento - Relação entre lucro e investimento"
    },
    {
      titulo: "Ticket Médio",
      valor: `R$ ${balancete.indicadores.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      descricao: "Valor médio por cliente",
      icon: DollarSign,
      cor: "text-blue-600",
      bgCor: "bg-blue-100",
      tooltip: "Valor médio de receita por cliente"
    },
    {
      titulo: "Tempo de Pagamento",
      valor: `${balancete.indicadores.tempoMedioPagamento} dias`,
      descricao: "Média de dias",
      icon: Clock,
      cor: "text-orange-600",
      bgCor: "bg-orange-100",
      tooltip: "Tempo médio que os clientes levam para pagar"
    },
    {
      titulo: "Inadimplência",
      valor: `${balancete.indicadores.taxaInadimplencia}%`,
      descricao: "Taxa de inadimplência",
      icon: AlertCircle,
      cor: balancete.indicadores.taxaInadimplencia > 10 ? "text-red-600" : "text-yellow-600",
      bgCor: balancete.indicadores.taxaInadimplencia > 10 ? "bg-red-100" : "bg-yellow-100",
      tooltip: "Percentual de clientes inadimplentes"
    },
    {
      titulo: "Conversão",
      valor: `${balancete.indicadores.conversaoCasos}%`,
      descricao: "Taxa de conversão",
      icon: Target,
      cor: "text-purple-600",
      bgCor: "bg-purple-100",
      tooltip: "Taxa de conversão de propostas em casos ativos"
    },
    {
      titulo: "Retenção",
      valor: `${balancete.indicadores.retencaoClientes}%`,
      descricao: "Retenção de clientes",
      icon: Users,
      cor: "text-indigo-600",
      bgCor: "bg-indigo-100",
      tooltip: "Percentual de clientes que continuam ativos"
    }
  ]

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {indicadores.map((indicador, index) => {
          const Icon = indicador.icon
          const isPositive = indicador.titulo === "ROI" || 
                           indicador.titulo === "Conversão" || 
                           indicador.titulo === "Retenção"
          const TrendIcon = isPositive ? TrendingUp : null

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Card className="cursor-help hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {indicador.titulo}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${indicador.bgCor}`}>
                        <Icon className={`h-4 w-4 ${indicador.cor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">{indicador.valor}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {indicador.descricao}
                        </p>
                      </div>
                      {TrendIcon && (
                        <TrendIcon className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{indicador.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
