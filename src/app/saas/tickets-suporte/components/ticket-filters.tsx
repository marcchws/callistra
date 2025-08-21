"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TicketFilters, TicketStatus, Attendant } from "../types"

interface TicketFiltersProps {
  filters: TicketFilters
  setFilters: (filters: TicketFilters) => void
  attendants: Attendant[]
  stats: {
    total: number
    abertos: number
    emAtendimento: number
    resolvidos: number
    fechados: number
    semResponsavel: number
    meus: number
  }
}

export function TicketFiltersComponent({
  filters,
  setFilters,
  attendants,
  stats
}: TicketFiltersProps) {
  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value as TicketStatus | 'todos' })
  }

  const handleResponsibleChange = (value: string) => {
    setFilters({ ...filters, responsavel: value })
  }

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const clearFilters = () => {
    setFilters({
      status: 'todos',
      responsavel: 'todos',
      search: ''
    })
  }

  const hasActiveFilters = 
    filters.status !== 'todos' || 
    filters.responsavel !== 'todos' || 
    filters.search !== ''

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => setFilters({ ...filters, status: 'todos' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de Tickets</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setFilters({ ...filters, status: 'aberto' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.abertos}</div>
            <p className="text-xs text-muted-foreground">Abertos</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setFilters({ ...filters, status: 'em_atendimento' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.emAtendimento}</div>
            <p className="text-xs text-muted-foreground">Em Atendimento</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setFilters({ ...filters, status: 'resolvido' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.resolvidos}</div>
            <p className="text-xs text-muted-foreground">Resolvidos</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setFilters({ ...filters, responsavel: 'sem_responsavel' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.semResponsavel}</div>
            <p className="text-xs text-muted-foreground">Sem Responsável</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.meus}</div>
            <p className="text-xs text-muted-foreground">Meus Tickets</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setFilters({ ...filters, status: 'fechado' })}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.fechados}</div>
            <p className="text-xs text-muted-foreground">Fechados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou motivo..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <Select value={filters.status || 'todos'} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aberto">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Aberto
                  </div>
                </SelectItem>
                <SelectItem value="em_atendimento">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Em Atendimento
                  </div>
                </SelectItem>
                <SelectItem value="resolvido">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Resolvido
                  </div>
                </SelectItem>
                <SelectItem value="fechado">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    Fechado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Responsible Filter */}
            <Select value={filters.responsavel || 'todos'} onValueChange={handleResponsibleChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Responsáveis</SelectItem>
                <SelectItem value="sem_responsavel">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-xs">?</span>
                    </div>
                    Sem Responsável
                  </div>
                </SelectItem>
                {attendants.map(attendant => (
                  <SelectItem key={attendant.id} value={attendant.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs text-blue-600">
                          {attendant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      {attendant.name}
                      {attendant.ticketsCount !== undefined && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {attendant.ticketsCount}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.status && filters.status !== 'todos' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: 'todos' })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.responsavel && filters.responsavel !== 'todos' && (
                <Badge variant="secondary" className="gap-1">
                  Responsável: {filters.responsavel === 'sem_responsavel' ? 'Sem Responsável' : filters.responsavel}
                  <button
                    onClick={() => setFilters({ ...filters, responsavel: 'todos' })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Busca: {filters.search}
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}