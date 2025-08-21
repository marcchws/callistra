"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BalanceteFilters } from "@/types/balancete"
import { Filter, X, Search } from "lucide-react"

interface BalanceteFiltersProps {
  filters: BalanceteFilters
  onFiltersChange: (filters: BalanceteFilters) => void
  loading?: boolean
}

export function BalanceteFiltersComponent({ filters, onFiltersChange, loading }: BalanceteFiltersProps) {
  const [localFilters, setLocalFilters] = useState<BalanceteFilters>(filters)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleResetFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const formatDateForInput = (date?: Date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
            <CardDescription>
              Personalize a análise por período, cliente e tipo de serviço
            </CardDescription>
          </div>
          {(Object.keys(filters).length > 0) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Filtro por Data Início */}
          <div className="space-y-2">
            <Label htmlFor="data-inicio">Data Início</Label>
            <Input
              id="data-inicio"
              type="date"
              value={formatDateForInput(localFilters.dataInicio)}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                dataInicio: e.target.value ? new Date(e.target.value) : undefined
              }))}
              className="focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Data Fim */}
          <div className="space-y-2">
            <Label htmlFor="data-fim">Data Fim</Label>
            <Input
              id="data-fim"
              type="date"
              value={formatDateForInput(localFilters.dataFim)}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                dataFim: e.target.value ? new Date(e.target.value) : undefined
              }))}
              className="focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Cliente */}
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select 
              value={localFilters.cliente || "todos"} 
              onValueChange={(value) => setLocalFilters(prev => ({
                ...prev,
                cliente: value === "todos" ? undefined : value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                <SelectItem value="empresa-abc">Empresa ABC Ltda</SelectItem>
                <SelectItem value="joao-silva">João Silva</SelectItem>
                <SelectItem value="maria-santos">Maria Santos</SelectItem>
                <SelectItem value="construtora-xyz">Construtora XYZ</SelectItem>
                <SelectItem value="comercio-123">Comércio 123</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Tipo de Serviço */}
          <div className="space-y-2">
            <Label htmlFor="tipo-servico">Tipo de Serviço</Label>
            <Select 
              value={localFilters.tipoServico || "todos"} 
              onValueChange={(value) => setLocalFilters(prev => ({
                ...prev,
                tipoServico: value === "todos" ? undefined : value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="civel">Cível</SelectItem>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="tributario">Tributário</SelectItem>
                <SelectItem value="consultivo">Consultivo</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="previdenciario">Previdenciário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            disabled={loading}
          >
            Resetar
          </Button>
          <Button 
            onClick={handleApplyFilters}
            disabled={loading}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>Aplicando...</>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Aplicar Filtros
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
