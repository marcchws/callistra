"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Zap, TrendingUp } from "lucide-react"
import type { ControleTokens } from "../types"

interface ControleTokensProps {
  controleTokens: ControleTokens | null
}

export function ControleTokensComponent({ controleTokens }: ControleTokensProps) {
  if (!controleTokens) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Controle de Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Carregando informações...</div>
        </CardContent>
      </Card>
    )
  }

  const porcentagemUsada = (controleTokens.tokens_utilizados_mes / controleTokens.limite_mensal) * 100
  const tokensRestantes = controleTokens.tokens_disponiveis
  const diasParaRenovacao = Math.ceil((controleTokens.data_renovacao.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getStatusColor = () => {
    if (porcentagemUsada >= 90) return "destructive"
    if (porcentagemUsada >= 70) return "outline"
    return "default"
  }

  const getProgressColor = () => {
    if (porcentagemUsada >= 90) return "bg-red-500"
    if (porcentagemUsada >= 70) return "bg-yellow-500"
    return "bg-blue-600"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Controle de Tokens
          </CardTitle>
          <Badge variant={getStatusColor()}>
            Plano {controleTokens.plano_atual}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progresso de uso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Uso mensal</span>
            <span className="text-muted-foreground">
              {controleTokens.tokens_utilizados_mes.toLocaleString()} / {controleTokens.limite_mensal.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={porcentagemUsada} 
            className="h-2" 
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{porcentagemUsada.toFixed(1)}% utilizado</span>
            <span>{tokensRestantes.toLocaleString()} disponíveis</span>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Tokens Restantes
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {tokensRestantes.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-blue-600" />
              Renovação
            </div>
            <div className="text-sm text-muted-foreground">
              {diasParaRenovacao > 0 ? `${diasParaRenovacao} dias` : "Hoje"}
            </div>
            <div className="text-xs text-muted-foreground">
              {controleTokens.data_renovacao.toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Alerta de limite */}
        {porcentagemUsada >= 90 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm font-medium text-red-800">Limite quase atingido!</div>
            <div className="text-xs text-red-600 mt-1">
              Você está próximo do limite mensal. Considere fazer upgrade do plano.
            </div>
          </div>
        )}
        
        {tokensRestantes <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm font-medium text-red-800">Limite de uso atingido</div>
            <div className="text-xs text-red-600 mt-1">
              Aguarde a renovação do plano ou faça upgrade para continuar usando.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
