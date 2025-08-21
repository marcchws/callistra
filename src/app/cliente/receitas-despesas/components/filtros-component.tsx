"use client"

import { useState } from "react"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
  FiltrosLancamento,
  TipoAgrupamento,
  TipoLancamento,
  StatusLancamento,
  categoriasReceitas,
  categoriasDespesas
} from "../types"

interface FiltrosComponentProps {
  filtros: FiltrosLancamento
  agrupamento: TipoAgrupamento
  onFiltrosChange: (filtros: FiltrosLancamento) => void
  onAgrupamentoChange: (agrupamento: TipoAgrupamento) => void
}

export function FiltrosComponent({
  filtros,
  agrupamento,
  onFiltrosChange,
  onAgrupamentoChange
}: FiltrosComponentProps) {
  const [expandido, setExpandido] = useState(false)

  // Todas as categorias disponíveis
  const todasCategorias = [...categoriasReceitas, ...categoriasDespesas]

  const updateFiltro = <K extends keyof FiltrosLancamento>(
    key: K,
    value: FiltrosLancamento[K]
  ) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    })
  }

  const limparFiltros = () => {
    onFiltrosChange({})
  }

  // Contar filtros ativos
  const filtrosAtivos = Object.values(filtros).filter(
    (value) => value !== undefined && value !== "" && value !== null
  ).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-medium">Filtros e Agrupamento</CardTitle>
            {filtrosAtivos > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filtrosAtivos} ativo{filtrosAtivos > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filtrosAtivos > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limparFiltros}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandido(!expandido)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {expandido ? "Ocultar" : "Mostrar"} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>

      {expandido && (
        <CardContent className="space-y-4">
          {/* Primeira linha de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={filtros.tipo || "todos"}
                onValueChange={(value) => 
                  updateFiltro("tipo", value === "todos" ? undefined : value as TipoLancamento)
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filtros.status || "todos"}
                onValueChange={(value) => 
                  updateFiltro("status", value === "todos" ? undefined : value as StatusLancamento)
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="historico">Histórico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={filtros.categoria || "todas"}
                onValueChange={(value) => 
                  updateFiltro("categoria", value === "todas" ? undefined : value)
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {todasCategorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Agrupamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Agrupar por</label>
              <Select
                value={agrupamento}
                onValueChange={(value) => onAgrupamentoChange(value as TipoAgrupamento)}
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Nenhum</SelectItem>
                  <SelectItem value="processo">Processo</SelectItem>
                  <SelectItem value="beneficiario">Beneficiário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda linha de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Processo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Processo</label>
              <Input
                placeholder="Filtrar por processo"
                value={filtros.processo || ""}
                onChange={(e) => updateFiltro("processo", e.target.value || undefined)}
                className="focus:ring-blue-500"
              />
            </div>

            {/* Beneficiário */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Beneficiário</label>
              <Input
                placeholder="Filtrar por beneficiário"
                value={filtros.beneficiario || ""}
                onChange={(e) => updateFiltro("beneficiario", e.target.value || undefined)}
                className="focus:ring-blue-500"
              />
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal focus:ring-blue-500",
                      !filtros.dataInicio && "text-muted-foreground"
                    )}
                  >
                    {filtros.dataInicio ? (
                      format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filtros.dataInicio}
                    onSelect={(date) => updateFiltro("dataInicio", date)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal focus:ring-blue-500",
                      !filtros.dataFim && "text-muted-foreground"
                    )}
                  >
                    {filtros.dataFim ? (
                      format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filtros.dataFim}
                    onSelect={(date) => updateFiltro("dataFim", date)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Terceira linha - Filtros de valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valor Mínimo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Mínimo</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={filtros.valorMinimo || ""}
                onChange={(e) => updateFiltro("valorMinimo", e.target.value ? Number(e.target.value) : undefined)}
                className="focus:ring-blue-500"
              />
            </div>

            {/* Valor Máximo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Máximo</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={filtros.valorMaximo || ""}
                onChange={(e) => updateFiltro("valorMaximo", e.target.value ? Number(e.target.value) : undefined)}
                className="focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
