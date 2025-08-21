"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { PlanoFilters } from "../types"

interface PlanoFiltersProps {
  filters: PlanoFilters
  onFiltersChange: (filters: PlanoFilters) => void
  onClearFilters: () => void
}

// Componente de filtros baseado nos critérios de aceite especificados
export function PlanoFiltersComponent({ filters, onFiltersChange, onClearFilters }: PlanoFiltersProps) {
  const handleFilterChange = (key: keyof PlanoFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "todos")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Filtros</h3>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Filtro por nome do plano */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome do Plano
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  placeholder="Buscar por nome..."
                  value={filters.nome || ""}
                  onChange={(e) => handleFilterChange("nome", e.target.value)}
                  className="pl-10 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtro por status do plano */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status do Plano</Label>
              <Select
                value={filters.status || "todos"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Selecionar status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por vigência do plano */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Vigência do Plano</Label>
              <Select
                value={filters.vigencia || "todos"}
                onValueChange={(value) => handleFilterChange("vigencia", value)}
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Selecionar vigência..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Vigências</SelectItem>
                  <SelectItem value="vigente">Vigente</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
