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
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, X } from "lucide-react"
import { useAgenda } from "../use-agenda"
import { FiltrosAgenda, StatusEvento, TipoEvento, RespostaParticipante } from "../types"

interface FiltrosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filtros: FiltrosAgenda
}

export function FiltrosDialog({ open, onOpenChange, filtros }: FiltrosDialogProps) {
  const { aplicarFiltros, limparFiltros } = useAgenda()
  
  const [filtrosLocais, setFiltrosLocais] = useState<FiltrosAgenda>(filtros)

  // Sincronizar com filtros externos quando o dialog abrir
  useEffect(() => {
    if (open) {
      setFiltrosLocais(filtros)
    }
  }, [open, filtros])

  const statusOptions: { value: StatusEvento; label: string }[] = [
    { value: "pendente", label: "Pendente" },
    { value: "em_andamento", label: "Em andamento" },
    { value: "concluido", label: "Concluído" },
    { value: "bloqueio", label: "Bloqueio" }
  ]

  const tipoOptions: { value: TipoEvento; label: string }[] = [
    { value: "evento", label: "Evento" },
    { value: "reuniao", label: "Reunião" },
    { value: "tarefa", label: "Tarefa" },
    { value: "bloqueio", label: "Bloqueio de Agenda" }
  ]

  const respostaOptions: { value: RespostaParticipante; label: string }[] = [
    { value: "sim", label: "Confirmado" },
    { value: "nao", label: "Não vai" },
    { value: "talvez", label: "Talvez" },
    { value: "pendente", label: "Pendente" }
  ]

  const handleStatusChange = (status: StatusEvento, checked: boolean) => {
    setFiltrosLocais(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, status]
        : prev.status.filter(s => s !== status)
    }))
  }

  const handleTipoChange = (tipo: TipoEvento, checked: boolean) => {
    setFiltrosLocais(prev => ({
      ...prev,
      tipo: checked 
        ? [...prev.tipo, tipo]
        : prev.tipo.filter(t => t !== tipo)
    }))
  }

  const handleRespostaChange = (resposta: RespostaParticipante, checked: boolean) => {
    setFiltrosLocais(prev => ({
      ...prev,
      respostaParticipante: checked 
        ? [...prev.respostaParticipante, resposta]
        : prev.respostaParticipante.filter(r => r !== resposta)
    }))
  }

  const handleAplicar = () => {
    aplicarFiltros(filtrosLocais)
    onOpenChange(false)
  }

  const handleLimpar = () => {
    const filtrosVazios: FiltrosAgenda = {
      status: [],
      tipo: [],
      respostaParticipante: [],
      dataInicio: "",
      dataFim: "",
      busca: ""
    }
    setFiltrosLocais(filtrosVazios)
    limparFiltros()
  }

  const totalFiltrosAtivos = 
    filtrosLocais.status.length + 
    filtrosLocais.tipo.length + 
    filtrosLocais.respostaParticipante.length +
    (filtrosLocais.dataInicio ? 1 : 0) +
    (filtrosLocais.dataFim ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Filtros da Agenda
            {totalFiltrosAtivos > 0 && (
              <Badge variant="secondary" className="px-2 py-1">
                {totalFiltrosAtivos}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure filtros para visualizar eventos específicos na agenda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-medium">Status</Label>
              <div className="mt-3 space-y-3">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filtrosLocais.status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleStatusChange(option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`status-${option.value}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipo */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-medium">Tipo de Item</Label>
              <div className="mt-3 space-y-3">
                {tipoOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${option.value}`}
                      checked={filtrosLocais.tipo.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleTipoChange(option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`tipo-${option.value}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resposta do Participante */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-medium">Minha Resposta</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Filtrar por sua resposta aos eventos
              </p>
              <div className="mt-3 space-y-3">
                {respostaOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`resposta-${option.value}`}
                      checked={filtrosLocais.respostaParticipante.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleRespostaChange(option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`resposta-${option.value}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Período */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-base font-medium">Período</Label>
              <div className="mt-3 space-y-3">
                <div>
                  <Label htmlFor="data-inicio" className="text-sm">Data de Início</Label>
                  <Input
                    id="data-inicio"
                    type="date"
                    value={filtrosLocais.dataInicio || ""}
                    onChange={(e) => setFiltrosLocais(prev => ({ 
                      ...prev, 
                      dataInicio: e.target.value 
                    }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="data-fim" className="text-sm">Data de Fim</Label>
                  <Input
                    id="data-fim"
                    type="date"
                    value={filtrosLocais.dataFim || ""}
                    onChange={(e) => setFiltrosLocais(prev => ({ 
                      ...prev, 
                      dataFim: e.target.value 
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo dos Filtros Ativos */}
          {totalFiltrosAtivos > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <Label className="text-base font-medium text-blue-800">
                  Filtros Ativos ({totalFiltrosAtivos})
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filtrosLocais.status.map(status => (
                    <Badge key={status} variant="outline" className="text-blue-700 border-blue-300">
                      Status: {statusOptions.find(s => s.value === status)?.label}
                    </Badge>
                  ))}
                  {filtrosLocais.tipo.map(tipo => (
                    <Badge key={tipo} variant="outline" className="text-blue-700 border-blue-300">
                      Tipo: {tipoOptions.find(t => t.value === tipo)?.label}
                    </Badge>
                  ))}
                  {filtrosLocais.respostaParticipante.map(resposta => (
                    <Badge key={resposta} variant="outline" className="text-blue-700 border-blue-300">
                      Resposta: {respostaOptions.find(r => r.value === resposta)?.label}
                    </Badge>
                  ))}
                  {filtrosLocais.dataInicio && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      De: {new Date(filtrosLocais.dataInicio).toLocaleDateString("pt-BR")}
                    </Badge>
                  )}
                  {filtrosLocais.dataFim && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Até: {new Date(filtrosLocais.dataFim).toLocaleDateString("pt-BR")}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleLimpar}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Tudo
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAplicar}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
