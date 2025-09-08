"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Settings, Calendar, Clock, Globe } from "lucide-react"
import { ConfiguracoesExibicao } from "../types"
import { toast } from "sonner"

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  configuracoes: ConfiguracoesExibicao
  onSave: (configuracoes: ConfiguracoesExibicao) => void
}

export function SettingsDialog({
  open,
  onClose,
  configuracoes,
  onSave
}: SettingsDialogProps) {
  const [config, setConfig] = useState<ConfiguracoesExibicao>(configuracoes)

  const handleSave = () => {
    onSave(config)
    toast.success("Configurações salvas com sucesso!", { duration: 2000 })
    onClose()
  }

  const handleReset = () => {
    const defaultConfig: ConfiguracoesExibicao = {
      inicioSemana: "domingo",
      mostrarFinaisSemana: true,
      formatoData: "DD/MM/YYYY",
      formatoHora: "24h"
    }
    setConfig(defaultConfig)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Exibição
            </div>
          </DialogTitle>
          <DialogDescription>
            Personalize como a agenda é exibida para você
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Configurações de Calendário */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-blue-600" />
              Calendário
            </div>
            
            <div className="space-y-4 pl-6">
              {/* Início da semana */}
              <div className="space-y-2">
                <Label htmlFor="inicio-semana">Início da semana</Label>
                <Select
                  value={config.inicioSemana}
                  onValueChange={(value: "domingo" | "segunda") => 
                    setConfig(prev => ({ ...prev, inicioSemana: value }))
                  }
                >
                  <SelectTrigger id="inicio-semana" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domingo">Domingo</SelectItem>
                    <SelectItem value="segunda">Segunda-feira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mostrar finais de semana */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="finais-semana">Mostrar finais de semana</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir sábado e domingo no calendário
                  </p>
                </div>
                <Switch
                  id="finais-semana"
                  checked={config.mostrarFinaisSemana}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, mostrarFinaisSemana: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações de Data e Hora */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-blue-600" />
              Data e Hora
            </div>
            
            <div className="space-y-4 pl-6">
              {/* Formato de data */}
              <div className="space-y-2">
                <Label htmlFor="formato-data">Formato de data</Label>
                <Select
                  value={config.formatoData}
                  onValueChange={(value: "DD/MM/YYYY" | "MM/DD/YYYY") => 
                    setConfig(prev => ({ ...prev, formatoData: value }))
                  }
                >
                  <SelectTrigger id="formato-data" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">
                      DD/MM/AAAA (31/12/2024)
                    </SelectItem>
                    <SelectItem value="MM/DD/YYYY">
                      MM/DD/AAAA (12/31/2024)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Formato de hora */}
              <div className="space-y-2">
                <Label htmlFor="formato-hora">Formato de hora</Label>
                <Select
                  value={config.formatoHora}
                  onValueChange={(value: "24h" | "12h") => 
                    setConfig(prev => ({ ...prev, formatoHora: value }))
                  }
                >
                  <SelectTrigger id="formato-hora" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas (14:30)</SelectItem>
                    <SelectItem value="12h">12 horas (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações Regionais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-blue-600" />
              Regional
            </div>
            
            <div className="space-y-4 pl-6">
              {/* Fuso horário */}
              <div className="space-y-2">
                <Label htmlFor="fuso-horario">Fuso horário</Label>
                <Select defaultValue="brasilia">
                  <SelectTrigger id="fuso-horario" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brasilia">
                      (GMT-03:00) Brasília
                    </SelectItem>
                    <SelectItem value="sao-paulo">
                      (GMT-03:00) São Paulo
                    </SelectItem>
                    <SelectItem value="fortaleza">
                      (GMT-03:00) Fortaleza
                    </SelectItem>
                    <SelectItem value="manaus">
                      (GMT-04:00) Manaus
                    </SelectItem>
                    <SelectItem value="fernando-noronha">
                      (GMT-02:00) Fernando de Noronha
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Idioma */}
              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="idioma" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
