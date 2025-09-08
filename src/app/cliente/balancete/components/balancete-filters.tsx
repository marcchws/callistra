"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, FilterX, Search } from "lucide-react"
import { FiltrosBalancete, PeriodoReferencia } from "../types"

interface BalanceteFiltersProps {
  filtros: FiltrosBalancete
  onFiltrar: (filtros: FiltrosBalancete) => void
  onLimpar: () => void
  loading?: boolean
}

export function BalanceteFilters({ 
  filtros, 
  onFiltrar, 
  onLimpar,
  loading 
}: BalanceteFiltersProps) {
  const [dataInicio, setDataInicio] = useState<Date | undefined>(filtros.dataInicio)
  const [dataFim, setDataFim] = useState<Date | undefined>(filtros.dataFim)
  const [periodo, setPeriodo] = useState<PeriodoReferencia | undefined>(filtros.periodo)
  const [clienteId, setClienteId] = useState<string>(filtros.clienteId || '')
  const [tipoServico, setTipoServico] = useState<string>(filtros.tipoServico || 'todos')

  const handlePeriodoChange = (value: string) => {
    const now = new Date()
    let inicio: Date | undefined
    let fim: Date | undefined

    switch (value) {
      case 'mensal':
        inicio = new Date(now.getFullYear(), now.getMonth(), 1)
        fim = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'trimestral':
        const trimestre = Math.floor(now.getMonth() / 3)
        inicio = new Date(now.getFullYear(), trimestre * 3, 1)
        fim = new Date(now.getFullYear(), trimestre * 3 + 3, 0)
        break
      case 'anual':
        inicio = new Date(now.getFullYear(), 0, 1)
        fim = new Date(now.getFullYear(), 11, 31)
        break
      case 'personalizado':
        // Mantém as datas selecionadas manualmente
        break
    }

    if (value !== 'personalizado') {
      setDataInicio(inicio)
      setDataFim(fim)
    }
    setPeriodo(value as PeriodoReferencia)
  }

  const handleFiltrar = () => {
    const novosFiltros: FiltrosBalancete = {}
    
    if (dataInicio) novosFiltros.dataInicio = dataInicio
    if (dataFim) novosFiltros.dataFim = dataFim
    if (periodo) novosFiltros.periodo = periodo
    if (clienteId && clienteId !== 'todos') novosFiltros.clienteId = clienteId
    if (tipoServico && tipoServico !== 'todos') novosFiltros.tipoServico = tipoServico as any
    
    onFiltrar(novosFiltros)
  }

  const handleLimpar = () => {
    setDataInicio(undefined)
    setDataFim(undefined)
    setPeriodo(undefined)
    setClienteId('')
    setTipoServico('todos')
    onLimpar()
  }

  const temFiltrosAtivos = dataInicio || dataFim || periodo || 
    (clienteId && clienteId !== 'todos') || 
    (tipoServico && tipoServico !== 'todos')

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Período */}
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={periodo} onValueChange={handlePeriodoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Início */}
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicio && "text-muted-foreground"
                  )}
                  disabled={periodo && periodo !== 'personalizado'}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFim && "text-muted-foreground"
                  )}
                  disabled={periodo && periodo !== 'personalizado'}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFim}
                  onSelect={setDataFim}
                  initialFocus
                  locale={ptBR}
                  disabled={(date) =>
                    dataInicio ? date < dataInicio : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                <SelectItem value="cli-001">Empresa ABC Ltda</SelectItem>
                <SelectItem value="cli-002">João Silva & Associados</SelectItem>
                <SelectItem value="cli-003">Construtora XYZ</SelectItem>
                <SelectItem value="cli-004">Maria Santos</SelectItem>
                <SelectItem value="cli-005">Tech Solutions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-2">
            <Label>Tipo de Serviço</Label>
            <Select value={tipoServico} onValueChange={setTipoServico}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os serviços</SelectItem>
                <SelectItem value="civel">Cível</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="consultivo">Consultivo</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="tributario">Tributário</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 mt-4">
          {temFiltrosAtivos && (
            <Button
              variant="outline"
              onClick={handleLimpar}
              disabled={loading}
              className="gap-2"
            >
              <FilterX className="h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
          <Button 
            onClick={handleFiltrar}
            disabled={loading}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
