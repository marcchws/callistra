"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { ClienteFilters, PlanoTipo, StatusAssinatura } from "../types"

interface ClienteFiltersProps {
  filters: ClienteFilters
  onFiltersChange: (filters: ClienteFilters) => void
}

export function ClienteFilters({ filters, onFiltersChange }: ClienteFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handlePlanoChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      plano: value === "todos" ? undefined : value 
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === "todos" ? undefined : value 
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    })
  }

  const hasActiveFilters = filters.search || filters.plano || filters.status

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, nome, e-mail..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por Plano */}
        <Select
          value={filters.plano || "todos"}
          onValueChange={handlePlanoChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] focus:ring-blue-500">
            <SelectValue placeholder="Filtrar por plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os planos</SelectItem>
            {Object.entries(PlanoTipo).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por Status */}
        <Select
          value={filters.status || "todos"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] focus:ring-blue-500">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="inativa">Inativa</SelectItem>
            <SelectItem value="inadimplente">Inadimplente</SelectItem>
          </SelectContent>
        </Select>

        {/* Limpar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filtros ativos:</span>
          {filters.search && (
            <span className="font-medium">Busca: "{filters.search}"</span>
          )}
          {filters.plano && (
            <span className="font-medium">Plano: {PlanoTipo[filters.plano as keyof typeof PlanoTipo]}</span>
          )}
          {filters.status && (
            <span className="font-medium">Status: {filters.status}</span>
          )}
        </div>
      )}
    </div>
  )
}