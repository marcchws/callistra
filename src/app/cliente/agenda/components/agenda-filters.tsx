"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X, Calendar } from "lucide-react"
import { StatusEvento, TipoItem, RespostaParticipante, FiltrosAgenda } from "../types"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface AgendaFiltersProps {
  filtros: FiltrosAgenda
  onFiltrosChange: (filtros: FiltrosAgenda) => void
  onLimparFiltros: () => void
}

export function AgendaFilters({
  filtros,
  onFiltrosChange,
  onLimparFiltros
}: AgendaFiltersProps) {
  const [busca, setBusca] = useState(filtros.busca || "")

  const handleBuscaChange = (value: string) => {
    setBusca(value)
    onFiltrosChange({ ...filtros, busca: value || undefined })
  }

  const handleFiltroChange = (campo: keyof FiltrosAgenda, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor === "todos" ? undefined : valor
    })
  }

  const temFiltrosAtivos = () => {
    return !!(
      filtros.busca ||
      (filtros.status && filtros.status !== "todos") ||
      (filtros.tipoItem && filtros.tipoItem !== "todos") ||
      (filtros.resposta && filtros.resposta !== "todos") ||
      filtros.dataInicio ||
      filtros.dataFim
    )
  }

  const contarFiltrosAtivos = () => {
    let count = 0
    if (filtros.busca) count++
    if (filtros.status && filtros.status !== "todos") count++
    if (filtros.tipoItem && filtros.tipoItem !== "todos") count++
    if (filtros.resposta && filtros.resposta !== "todos") count++
    if (filtros.dataInicio) count++
    if (filtros.dataFim) count++
    return count
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
          {temFiltrosAtivos() && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {contarFiltrosAtivos()} filtro(s) ativo(s)
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLimparFiltros}
                className="h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título, descrição, cliente ou processo..."
            value={busca}
            onChange={(e) => handleBuscaChange(e.target.value)}
            className="pl-10 focus:ring-blue-500"
          />
        </div>

        {/* Filtros em grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={filtros.status || "todos"}
              onValueChange={(value) => handleFiltroChange("status", value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={StatusEvento.EM_ANDAMENTO}>Em andamento</SelectItem>
                <SelectItem value={StatusEvento.PENDENTE}>Pendente</SelectItem>
                <SelectItem value={StatusEvento.CONCLUIDO}>Concluído</SelectItem>
                <SelectItem value={StatusEvento.BLOQUEIO}>Bloqueio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Item */}
          <div>
            <label className="text-sm font-medium mb-1 block">Tipo</label>
            <Select
              value={filtros.tipoItem || "todos"}
              onValueChange={(value) => handleFiltroChange("tipoItem", value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={TipoItem.EVENTO}>Evento</SelectItem>
                <SelectItem value={TipoItem.REUNIAO}>Reunião</SelectItem>
                <SelectItem value={TipoItem.TAREFA}>Tarefa</SelectItem>
                <SelectItem value={TipoItem.BLOQUEIO}>Bloqueio de agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resposta */}
          <div>
            <label className="text-sm font-medium mb-1 block">Resposta</label>
            <Select
              value={filtros.resposta || "todos"}
              onValueChange={(value) => handleFiltroChange("resposta", value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Todas as respostas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={RespostaParticipante.SIM}>Sim</SelectItem>
                <SelectItem value={RespostaParticipante.NAO}>Não</SelectItem>
                <SelectItem value={RespostaParticipante.TALVEZ}>Talvez</SelectItem>
                <SelectItem value={RespostaParticipante.PENDENTE}>Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros de data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Data inicial</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={filtros.dataInicio 
                  ? new Date(filtros.dataInicio).toISOString().split('T')[0]
                  : ""
                }
                onChange={(e) => handleFiltroChange("dataInicio", 
                  e.target.value ? new Date(e.target.value) : undefined
                )}
                className="pl-10 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Data final</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={filtros.dataFim 
                  ? new Date(filtros.dataFim).toISOString().split('T')[0]
                  : ""
                }
                onChange={(e) => handleFiltroChange("dataFim", 
                  e.target.value ? new Date(e.target.value) : undefined
                )}
                className="pl-10 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
