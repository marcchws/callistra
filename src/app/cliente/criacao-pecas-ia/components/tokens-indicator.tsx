"use client"

import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { AlertCircle, Zap } from "lucide-react"
import { PlanoTokens } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TokensIndicatorProps {
  planoTokens: PlanoTokens
  className?: string
}

export function TokensIndicator({ planoTokens, className }: TokensIndicatorProps) {
  const percentualUsado = (planoTokens.tokensUtilizados / planoTokens.tokensTotal) * 100
  const diasRestantes = Math.ceil((planoTokens.dataRenovacao.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  const getProgressColor = () => {
    if (percentualUsado >= 90) return "bg-red-500"
    if (percentualUsado >= 70) return "bg-yellow-500"
    return "bg-blue-600"
  }

  const getAlertLevel = () => {
    if (percentualUsado >= 90) return "critical"
    if (percentualUsado >= 70) return "warning"
    return "normal"
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">Tokens Disponíveis</h3>
          </div>
          {getAlertLevel() !== "normal" && (
            <AlertCircle className={cn(
              "h-5 w-5",
              getAlertLevel() === "critical" ? "text-red-500" : "text-yellow-500"
            )} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {planoTokens.tokensRestantes.toLocaleString()} tokens restantes
            </span>
            <span className="font-medium">
              {percentualUsado.toFixed(1)}% usado
            </span>
          </div>
          
          <Progress 
            value={percentualUsado} 
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {planoTokens.tokensUtilizados.toLocaleString()} / {planoTokens.tokensTotal.toLocaleString()} tokens
            </span>
            <span>
              Renova em {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{planoTokens.planoNome}</p>
              <p className="text-xs text-muted-foreground">
                Renovação: {planoTokens.dataRenovacao.toLocaleDateString("pt-BR")}
              </p>
            </div>
            {percentualUsado >= 70 && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                Fazer Upgrade
              </Button>
            )}
          </div>
        </div>

        {getAlertLevel() === "critical" && (
          <div className="pt-2 border-t">
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Você está próximo do limite. Considere fazer upgrade do plano.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}