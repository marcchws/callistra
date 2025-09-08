"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Search, X, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { FilterData, Usuario, Cargo } from "../types"

interface DashboardFiltersProps {
  filters: FilterData
  usuarios: Usuario[]
  cargos: Cargo[]
  onApplyFilters: (filters: Partial<FilterData>) => void
  onResetFilters: () => void
  onRefresh: () => void
}

export function DashboardFilters({
  filters,
  usuarios,
  cargos,
  onApplyFilters,
  onResetFilters,
  onRefresh
}: DashboardFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterData>(filters)
  const [searchTerm, setSearchTerm] = useState(filters.busca || "")

  const handleDateSelect = (type: "inicio" | "fim", date: Date | undefined) => {
    const newPeriodo = { ...localFilters.periodo }
    newPeriodo[type] = date || null
    setLocalFilters({ ...localFilters, periodo: newPeriodo })
    onApplyFilters({ periodo: newPeriodo })
  }

  const handleUsuarioChange = (value: string) => {
    const newFilters = { ...localFilters }
    if (value === "todos") {
      delete newFilters.usuario
      delete newFilters.cargo
    } else {
      newFilters.usuario = value
      delete newFilters.cargo
    }
    setLocalFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const handleCargoChange = (value: string) => {
    const newFilters = { ...localFilters }
    if (value === "todos") {
      delete newFilters.cargo
      delete newFilters.usuario
    } else {
      newFilters.cargo = value
      delete newFilters.usuario
    }
    setLocalFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const handleStatusChange = (value: "todos" | "ativo" | "concluido" | "ganho" | "perdido") => {
    setLocalFilters({ ...localFilters, status: value })
    onApplyFilters({ status: value })
  }

  const handleSearch = () => {
    setLocalFilters({ ...localFilters, busca: searchTerm })
    onApplyFilters({ busca: searchTerm })
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    const newFilters = { ...localFilters }
    delete newFilters.busca
    setLocalFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const handleReset = () => {
    setSearchTerm("")
    onResetFilters()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Primeira linha: Período e Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Período Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !localFilters.periodo.inicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.periodo.inicio ? (
                      format(localFilters.periodo.inicio, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilters.periodo.inicio || undefined}
                    onSelect={(date) => handleDateSelect("inicio", date)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Período Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !localFilters.periodo.fim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.periodo.fim ? (
                      format(localFilters.periodo.fim, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilters.periodo.fim || undefined}
                    onSelect={(date) => handleDateSelect("fim", date)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={localFilters.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="concluido">Concluídos</SelectItem>
                  <SelectItem value="ganho">Ganhos</SelectItem>
                  <SelectItem value="perdido">Perdidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda linha: Usuário, Cargo e Busca */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Select 
                value={localFilters.usuario || "todos"} 
                onValueChange={handleUsuarioChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.nome}>
                      {usuario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select 
                value={localFilters.cargo || "todos"} 
                onValueChange={handleCargoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os cargos</SelectItem>
                  {cargos.map((cargo) => (
                    <SelectItem key={cargo.id} value={cargo.nome}>
                      {cargo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar Processo</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pr-8"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-2"
                      onClick={handleClearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between items-center pt-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button 
              onClick={onRefresh}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar Dados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}