"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { UserStatus, UserFilters, CARGOS_PADRAO } from "../types"

interface UserFiltersProps {
  onFiltersChange: (filters: UserFilters) => void
}

export function UserFiltersComponent({ onFiltersChange }: UserFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<UserStatus | "">("")
  const [cargo, setCargo] = useState<string>("todos")
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Aplicar filtros quando mudarem
  useEffect(() => {
    const filters: UserFilters = {}
    
    if (search) filters.search = search
    if (status) filters.status = status as UserStatus
    if (cargo && cargo !== "todos") filters.cargo = cargo
    
    onFiltersChange(filters)
    setHasActiveFilters(!!(search || status || (cargo && cargo !== "todos")))
  }, [search, status, cargo, onFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setCargo("todos")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cargo ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtro de status */}
        <Select value={status} onValueChange={(value) => setStatus(value as UserStatus | "")}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value={UserStatus.ATIVO}>Ativo</SelectItem>
            <SelectItem value={UserStatus.INATIVO}>Inativo</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de cargo */}
        <Select value={cargo} onValueChange={setCargo}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os cargos</SelectItem>
            {CARGOS_PADRAO.map((cargoOption) => (
              <SelectItem key={cargoOption} value={cargoOption}>
                {cargoOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botão limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            className="shrink-0"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>Filtros ativos</span>
          {search && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
              Busca: "{search}"
            </div>
          )}
          {status && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
              Status: {status}
            </div>
          )}
          {cargo && cargo !== "todos" && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
              Cargo: {cargo}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
