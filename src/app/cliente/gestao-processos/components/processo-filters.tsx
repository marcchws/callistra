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
import { Label } from "@/components/ui/label"
import { Search, X, Filter } from "lucide-react"
import {
  ProcessoFilter,
  InstanciaLabels,
  TribunalLabels,
  NivelAcessoLabels
} from "../types"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"

interface ProcessoFiltersProps {
  filters: ProcessoFilter
  onFilterChange: <K extends keyof ProcessoFilter>(key: K, value: ProcessoFilter[K]) => void
  onClearFilters: () => void
  stats?: {
    total: number
    filtered: number
  }
}

const camposOptions = [
  { value: "todos", label: "Todos os campos" },
  { value: "pasta", label: "Pasta" },
  { value: "nomeCliente", label: "Nome do Cliente" },
  { value: "outrosEnvolvidos", label: "Outros Envolvidos" },
  { value: "vara", label: "Vara" },
  { value: "foro", label: "Foro" },
  { value: "acao", label: "Tipo de Ação" },
  { value: "responsavel", label: "Responsável" }
]

export function ProcessoFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  stats 
}: ProcessoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Contar quantos filtros estão ativos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "campo" && value === "todos") return false
    return value && value !== ""
  }).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros de Busca</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeFiltersCount} filtro(s) ativo(s)
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Busca Principal */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar processos..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              className="pl-10 focus:ring-blue-500"
            />
          </div>
          <Select 
            value={filters.campo} 
            onValueChange={(value) => onFilterChange("campo", value as any)}
          >
            <SelectTrigger className="w-[200px] focus:ring-blue-500">
              <SelectValue placeholder="Campo de busca" />
            </SelectTrigger>
            <SelectContent>
              {camposOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtros Avançados Colapsáveis */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </span>
              <span className="text-xs text-muted-foreground">
                {isExpanded ? "Recolher" : "Expandir"}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Filtro por Instância */}
              <div className="space-y-2">
                <Label htmlFor="instancia">Instância</Label>
                <Select 
                  value={filters.instancia || ""} 
                  onValueChange={(value) => onFilterChange("instancia", value as any)}
                >
                  <SelectTrigger id="instancia" className="focus:ring-blue-500">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {Object.entries(InstanciaLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Tribunal */}
              <div className="space-y-2">
                <Label htmlFor="tribunal">Tribunal</Label>
                <Select 
                  value={filters.tribunal || ""} 
                  onValueChange={(value) => onFilterChange("tribunal", value as any)}
                >
                  <SelectTrigger id="tribunal" className="focus:ring-blue-500">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {Object.entries(TribunalLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Nível de Acesso */}
              <div className="space-y-2">
                <Label htmlFor="acesso">Nível de Acesso</Label>
                <Select 
                  value={filters.acesso || ""} 
                  onValueChange={(value) => onFilterChange("acesso", value as any)}
                >
                  <SelectTrigger id="acesso" className="focus:ring-blue-500">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {Object.entries(NivelAcessoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtro por Data */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Distribuição (Início)</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => onFilterChange("dataInicio", e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Distribuição (Fim)</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => onFilterChange("dataFim", e.target.value)}
                  className="focus:ring-blue-500"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Estatísticas */}
        {stats && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Exibindo {stats.filtered} de {stats.total} processo(s)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}