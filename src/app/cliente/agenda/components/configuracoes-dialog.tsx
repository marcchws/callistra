"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Eye, Settings } from "lucide-react"
import { useAgenda } from "../use-agenda"
import { ConfiguracoesVisualizacao } from "../types"

interface ConfiguracoesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfiguracoesDialog({ open, onOpenChange }: ConfiguracoesDialogProps) {
  const { configuracoes, atualizarConfiguracoes } = useAgenda()
  
  const [configuracoesLocais, setConfiguracoesLocais] = useState<ConfiguracoesVisualizacao>(configuracoes)

  // Sincronizar com configurações externas quando o dialog abrir
  useEffect(() => {
    if (open) {
      setConfiguracoesLocais(configuracoes)
    }
  }, [open, configuracoes])

  const handleSalvar = () => {
    atualizarConfiguracoes(configuracoesLocais)
    onOpenChange(false)
  }

  const handleRestaurarPadrao = () => {
    const configuracoesPadrao: ConfiguracoesVisualizacao = {
      inicioSemana: "segunda",
      mostrarFinsDeSeemana: true,
      formatoDataHora: "24h"
    }
    setConfiguracoesLocais(configuracoesPadrao)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da Agenda
          </DialogTitle>
          <DialogDescription>
            Personalize a visualização e comportamento da sua agenda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações de Calendário */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendário
              </CardTitle>
              <CardDescription>
                Configurações de exibição do calendário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Início da Semana */}
              <div className="space-y-2">
                <Label htmlFor="inicio-semana">Início da Semana</Label>
                <Select 
                  value={configuracoesLocais.inicioSemana} 
                  onValueChange={(value: "domingo" | "segunda") => 
                    setConfiguracoesLocais(prev => ({ ...prev, inicioSemana: value }))
                  }
                >
                  <SelectTrigger id="inicio-semana">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domingo">Domingo</SelectItem>
                    <SelectItem value="segunda">Segunda-feira</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Define qual dia da semana aparece primeiro no calendário
                </p>
              </div>

              {/* Mostrar Fins de Semana */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar Fins de Semana</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir sábado e domingo no calendário
                  </p>
                </div>
                <Switch
                  checked={configuracoesLocais.mostrarFinsDeSeemana}
                  onCheckedChange={(checked) => 
                    setConfiguracoesLocais(prev => ({ ...prev, mostrarFinsDeSeemana: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Horário */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário
              </CardTitle>
              <CardDescription>
                Formato de exibição de data e hora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formato Data/Hora */}
              <div className="space-y-2">
                <Label htmlFor="formato-hora">Formato de Hora</Label>
                <Select 
                  value={configuracoesLocais.formatoDataHora} 
                  onValueChange={(value: "12h" | "24h") => 
                    setConfiguracoesLocais(prev => ({ ...prev, formatoDataHora: value }))
                  }
                >
                  <SelectTrigger id="formato-hora">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                    <SelectItem value="24h">24 horas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {configuracoesLocais.formatoDataHora === "12h" 
                    ? "Exemplo: 2:30 PM" 
                    : "Exemplo: 14:30"
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visualização Atual */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Eye className="h-4 w-4" />
                Visualização Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Início da semana:</span>
                <span className="font-medium text-blue-800">
                  {configuracoesLocais.inicioSemana === "domingo" ? "Domingo" : "Segunda-feira"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Fins de semana:</span>
                <span className="font-medium text-blue-800">
                  {configuracoesLocais.mostrarFinsDeSeemana ? "Visíveis" : "Ocultos"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Formato de hora:</span>
                <span className="font-medium text-blue-800">
                  {configuracoesLocais.formatoDataHora === "12h" ? "12 horas (AM/PM)" : "24 horas"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="text-sm space-y-1">
                <p className="font-medium text-amber-800">💡 Dicas:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Use início da semana na segunda-feira para ambiente corporativo</li>
                  <li>Oculte fins de semana se trabalha apenas em dias úteis</li>
                  <li>Formato 24h é mais preciso para horários profissionais</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleRestaurarPadrao}
          >
            Restaurar Padrão
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
