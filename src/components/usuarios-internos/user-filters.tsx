"use client"

// Componente de Filtros e Busca
// Atende aos critérios de busca e filtragem do PRD

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
import { Search, X } from "lucide-react"
import { CARGOS_DISPONIVEIS, PERFIS_ACESSO } from "@/lib/usuarios-internos/types"

interface UserFiltersProps {
  onFilterChange: (filters: {
    busca?: string
    status?: string
    cargo?: string
    perfilAcesso?: string
  }) => void
  totalResults?: number
}

export function UserFilters({ onFilterChange, totalResults }: UserFiltersProps) {
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("todos")
  const [cargo, setCargo] = useState("todos")
  const [perfilAcesso, setPerfilAcesso] = useState("todos")
  const [hasFilters, setHasFilters] = useState(false)

  // Debounce na busca para melhor performance
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters()
    }, 300)
    return () => clearTimeout(timer)
  }, [busca])

  // Aplicar filtros imediatamente quando selecionados
  useEffect(() => {
    applyFilters()
  }, [status, cargo, perfilAcesso])

  const applyFilters = () => {
    const filters = {
      ...(busca && { busca }),
      ...(status !== "todos" && { status }),
      ...(cargo !== "todos" && { cargo }),
      ...(perfilAcesso !== "todos" && { perfilAcesso })
    }
    
    onFilterChange(filters)
    setHasFilters(Object.keys(filters).length > 0)
  }

  const clearFilters = () => {
    setBusca("")
    setStatus("todos")
    setCargo("todos")
    setPerfilAcesso("todos")
    onFilterChange({})
    setHasFilters(false)
  }

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, cargo ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cargo || 'todos'} onValueChange={(value) => setCargo(value === 'todos' ? '' : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os cargos</SelectItem>
            {CARGOS_DISPONIVEIS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={perfilAcesso || 'todos'} onValueChange={(value) => setPerfilAcesso(value === 'todos' ? '' : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os perfis</SelectItem>
            {PERFIS_ACESSO.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contador de resultados */}
      {totalResults !== undefined && (
        <div className="text-sm text-muted-foreground">
          {totalResults === 0 
            ? "Nenhum resultado encontrado" 
            : `${totalResults} usuário${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''}`
          }
          {hasFilters && " com os filtros aplicados"}
        </div>
      )}
    </div>
  )
}