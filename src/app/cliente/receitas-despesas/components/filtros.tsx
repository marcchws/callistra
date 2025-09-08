"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X, Calendar as CalendarIcon, Users, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { StatusLancamento, TipoLancamento, Filtros } from "../types"
import { categoriasReceitas, categoriasDespesas } from "../categorias"

interface FiltrosProps {
  filtros: Filtros
  onFiltrosChange: (filtros: Filtros) => void
  tipoAtivo: TipoLancamento
}

export function FiltrosComponent({ filtros, onFiltrosChange, tipoAtivo }: FiltrosProps) {
  const categorias = tipoAtivo === TipoLancamento.RECEITA ? categoriasReceitas : categoriasDespesas

  const handleCategoriaChange = (categoria: string) => {
    onFiltrosChange({ ...filtros, categoria: categoria === "todas" ? undefined : categoria })
  }

  const handleStatusChange = (status: string) => {
    onFiltrosChange({ 
      ...filtros, 
      status: status === "todos" ? undefined : status as StatusLancamento 
    })
  }

  const handleAgrupamentoChange = (agrupamento: string) => {
    onFiltrosChange({ 
      ...filtros, 
      agrupamento: agrupamento === "nenhum" ? null : agrupamento as "processo" | "beneficiario"
    })
  }

  const handleProcessoChange = (processo: string) => {
    onFiltrosChange({ ...filtros, processo: processo || undefined })
  }

  const handleBeneficiarioChange = (beneficiario: string) => {
    onFiltrosChange({ ...filtros, beneficiario: beneficiario || undefined })
  }

  const handleDataInicioChange = (date: Date | undefined) => {
    onFiltrosChange({ ...filtros, dataInicio: date })
  }

  const handleDataFimChange = (date: Date | undefined) => {
    onFiltrosChange({ ...filtros, dataFim: date })
  }

  const limparFiltros = () => {
    onFiltrosChange({})
  }

  const temFiltrosAtivos = Object.keys(filtros).some(key => 
    filtros[key as keyof Filtros] !== undefined && filtros[key as keyof Filtros] !== null
  )

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm">Filtros</span>
          {temFiltrosAtivos && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limparFiltros}
              className="ml-auto h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Categoria */}
          <div className="space-y-2">
            <Label className="text-xs">Categoria</Label>
            <Select value={filtros.categoria || "todas"} onValueChange={handleCategoriaChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.nome} value={cat.nome}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs">Status</Label>
            <Select value={filtros.status || "todos"} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={StatusLancamento.PENDENTE}>Pendente</SelectItem>
                {tipoAtivo === TipoLancamento.RECEITA ? (
                  <SelectItem value={StatusLancamento.RECEBIDO}>Recebido</SelectItem>
                ) : (
                  <SelectItem value={StatusLancamento.PAGO}>Pago</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Agrupamento */}
          <div className="space-y-2">
            <Label className="text-xs">Agrupar por</Label>
            <Select 
              value={filtros.agrupamento || "nenhum"} 
              onValueChange={handleAgrupamentoChange}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nenhum">Nenhum</SelectItem>
                <SelectItem value="processo">
                  <span className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    Processo
                  </span>
                </SelectItem>
                <SelectItem value="beneficiario">
                  <span className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Beneficiário
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Processo */}
          <div className="space-y-2">
            <Label className="text-xs">Processo</Label>
            <Input
              placeholder="Buscar..."
              value={filtros.processo || ""}
              onChange={(e) => handleProcessoChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Beneficiário */}
          <div className="space-y-2">
            <Label className="text-xs">Beneficiário</Label>
            <Input
              placeholder="Buscar..."
              value={filtros.beneficiario || ""}
              onChange={(e) => handleBeneficiarioChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Data Inicial */}
          <div className="space-y-2">
            <Label className="text-xs">Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal text-sm",
                    !filtros.dataInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filtros.dataInicio ? (
                    format(filtros.dataInicio, "dd/MM/yyyy")
                  ) : (
                    "Selecionar"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filtros.dataInicio}
                  onSelect={handleDataInicioChange}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Final */}
          <div className="space-y-2 lg:col-start-1 xl:col-start-auto">
            <Label className="text-xs">Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal text-sm",
                    !filtros.dataFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filtros.dataFim ? (
                    format(filtros.dataFim, "dd/MM/yyyy")
                  ) : (
                    "Selecionar"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filtros.dataFim}
                  onSelect={handleDataFimChange}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}