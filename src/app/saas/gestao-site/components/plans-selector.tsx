"use client"

import { useState, useEffect } from "react"
import { Check, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PlansBlock, Plan } from "../types"

interface PlansSelectorProps {
  block: PlansBlock
  plans: Plan[]
  isEditing: boolean
  onUpdate: (updates: Partial<PlansBlock>) => void
  onStartEdit: () => void
  onEndEdit: () => void
}

export function PlansSelector({
  block,
  plans,
  isEditing,
  onUpdate,
  onStartEdit,
  onEndEdit,
}: PlansSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(block.selectedPlanIds)

  useEffect(() => {
    setSelectedIds(block.selectedPlanIds)
  }, [block.selectedPlanIds])

  const handleTogglePlan = (planId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      }
      return [...prev, planId]
    })
  }

  const handleSave = () => {
    onUpdate({ selectedPlanIds: selectedIds })
    onEndEdit()
  }

  const handleCancel = () => {
    setSelectedIds(block.selectedPlanIds)
    onEndEdit()
  }

  // Filtrar planos selecionados para exibição
  const displayPlans = plans.filter(plan => block.selectedPlanIds.includes(plan.id))

  if (!isEditing) {
    return (
      <div
        className={cn(
          "p-4 rounded-lg border-2 border-dashed border-transparent",
          "hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer",
          "transition-all duration-200 group"
        )}
        onClick={onStartEdit}
      >
        {displayPlans.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayPlans.map(plan => (
              <Card key={plan.id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-blue-600">
                      R$ {plan.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {plan.isActive && (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Ativo
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
            <Package className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">Nenhum plano selecionado</p>
            <p className="text-xs mt-1">Clique para selecionar planos</p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-center">
          Clique para gerenciar planos exibidos
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50/30 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Selecione os planos para exibir na landing page:</h3>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto p-1">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                "bg-white hover:bg-gray-50 transition-colors",
                selectedIds.includes(plan.id) && "border-blue-600 bg-blue-50/50"
              )}
            >
              <Checkbox
                id={`plan-${plan.id}`}
                checked={selectedIds.includes(plan.id)}
                onCheckedChange={() => handleTogglePlan(plan.id)}
                className="mt-1"
              />
              
              <label
                htmlFor={`plan-${plan.id}`}
                className="flex-1 cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{plan.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">
                      R$ {plan.price.toFixed(2).replace(".", ",")}
                    </span>
                    {plan.isActive && (
                      <Badge variant="outline" className="text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {plan.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{plan.features.length - 3} mais
                    </Badge>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>

        {selectedIds.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
            ⚠️ Nenhum plano selecionado. A seção de planos não aparecerá na landing page.
          </p>
        )}
      </div>

      {/* Resumo da seleção */}
      <div className="p-3 bg-white rounded-md border">
        <p className="text-sm text-muted-foreground">
          <strong>{selectedIds.length}</strong> plano(s) selecionado(s) para exibição
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Aplicar Seleção
        </Button>
      </div>
    </div>
  )
}
