import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from 'lucide-react'
import { FilterState } from '../types'

interface AccessLevelFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  totalCount: number
  filteredCount: number
}

export function AccessLevelFilters({ 
  filters, 
  onFiltersChange,
  totalCount,
  filteredCount
}: AccessLevelFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search)

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ search: searchValue })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Busca */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 focus:ring-blue-500"
        />
      </div>

      {/* Filtro de Status */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filters.status}
          onValueChange={(value: 'todos' | 'ativo' | 'inativo') => 
            onFiltersChange({ status: value })
          }
        >
          <SelectTrigger className="w-[140px] focus:ring-blue-500">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contador de resultados */}
      {(filters.search || filters.status !== 'todos') && (
        <div className="flex items-center text-sm text-muted-foreground">
          {filteredCount === 0 ? (
            <span>Nenhum perfil encontrado</span>
          ) : (
            <span>
              {filteredCount} de {totalCount} {filteredCount === 1 ? 'perfil' : 'perfis'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
