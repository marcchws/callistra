"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ClienteFilters, TipoCliente, StatusCliente } from "../types"

interface ClienteFiltersComponentProps {
  filters: ClienteFilters
  onChange: (filters: ClienteFilters) => void
  onClear: () => void
}

export function ClienteFiltersComponent({ 
  filters, 
  onChange, 
  onClear 
}: ClienteFiltersComponentProps) {
  
  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value })
  }

  const handleTipoChange = (value: string) => {
    onChange({ 
      ...filters, 
      tipo: value === "todos" ? undefined : value as TipoCliente 
    })
  }

  const handleStatusChange = (value: string) => {
    onChange({ 
      ...filters, 
      status: value === "todos" ? undefined : value as StatusCliente 
    })
  }

  const handleConfidencialChange = (value: string) => {
    onChange({ 
      ...filters, 
      confidencial: value === "todos" ? undefined : value === "sim" 
    })
  }

  const handleClear = () => {
    onChange({})
    onClear()
  }

  const hasFilters = filters.search || filters.tipo || filters.status || filters.confidencial !== undefined

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Busca */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="text-xs">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nome, CPF/CNPJ ou e-mail..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Tipo */}
        <div>
          <Label htmlFor="tipo" className="text-xs">
            Tipo
          </Label>
          <Select 
            value={filters.tipo || "todos"}
            onValueChange={handleTipoChange}
          >
            <SelectTrigger id="tipo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
              <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
              <SelectItem value="parceiro">Parceiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-xs">
            Status
          </Label>
          <Select 
            value={filters.status || "todos"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Confidencial */}
        <div>
          <Label htmlFor="confidencial" className="text-xs">
            Confidencial
          </Label>
          <Select 
            value={filters.confidencial === undefined ? "todos" : filters.confidencial ? "sim" : "nao"}
            onValueChange={handleConfidencialChange}
          >
            <SelectTrigger id="confidencial">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}