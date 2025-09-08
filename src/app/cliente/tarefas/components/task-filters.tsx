"use client"

import { useState } from "react"
import { TaskFilters } from "../types"
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
import { Search, Filter, X } from "lucide-react"
import { mockClientes, mockProcessos, mockResponsaveis } from "../types"
import { Badge } from "@/components/ui/badge"

interface TaskFiltersProps {
  onFilter: (filters: TaskFilters) => void
  onClear: () => void
}

export function TaskFiltersComponent({ onFilter, onClear }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilters>({})
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilter(filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    onClear()
  }

  const hasActiveFilters = Object.values(filters).some(value => value)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="gap-1">
                {Object.values(filters).filter(v => v).length} filtros ativos
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Busca sempre visível */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 focus:ring-blue-500"
              />
            </div>
            <Button 
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buscar
            </Button>
          </div>

          {/* Filtros expandidos */}
          {isExpanded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Select
                    value={filters.responsavel || ""}
                    onValueChange={(value) => handleFilterChange("responsavel", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {mockResponsaveis.map(resp => (
                        <SelectItem key={resp.value} value={resp.value}>
                          {resp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <Select
                    value={filters.cliente || ""}
                    onValueChange={(value) => handleFilterChange("cliente", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {mockClientes.map(cliente => (
                        <SelectItem key={cliente.value} value={cliente.value}>
                          {cliente.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Processo</label>
                  <Select
                    value={filters.processo || ""}
                    onValueChange={(value) => handleFilterChange("processo", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {mockProcessos.map(processo => (
                        <SelectItem key={processo.value} value={processo.value}>
                          {processo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select
                    value={filters.prioridade || ""}
                    onValueChange={(value) => handleFilterChange("prioridade", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="baixa">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          Baixa
                        </span>
                      </SelectItem>
                      <SelectItem value="media">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                          Média
                        </span>
                      </SelectItem>
                      <SelectItem value="alta">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                          Alta
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="nao_iniciada">Não iniciada</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Atividade</label>
                  <Select
                    value={filters.tipoAtividade || ""}
                    onValueChange={(value) => handleFilterChange("tipoAtividade", value)}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="administrativa">Administrativa</SelectItem>
                      <SelectItem value="juridica">Jurídica</SelectItem>
                      <SelectItem value="financeira">Financeira</SelectItem>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Início</label>
                  <Input
                    type="date"
                    value={filters.dataInicio || ""}
                    onChange={(e) => handleFilterChange("dataInicio", e.target.value)}
                    className="focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Fim</label>
                  <Input
                    type="date"
                    value={filters.dataFim || ""}
                    onChange={(e) => handleFilterChange("dataFim", e.target.value)}
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
                <Button 
                  onClick={handleApplyFilters}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
