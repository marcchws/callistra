"use client"

import { Search, Filter, CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { SurveyStatus, SurveyFilters, UserProfile } from "../types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { DateRange } from "react-day-picker"

interface PesquisaFiltersProps {
  filters: SurveyFilters
  onFilterChange: (filters: SurveyFilters) => void
  perfis: UserProfile[]
}

export function PesquisaFiltersComponent({ 
  filters, 
  onFilterChange,
  perfis 
}: PesquisaFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.period?.start && filters.period?.end) {
      try {
        const startDate = new Date(filters.period.start)
        const endDate = new Date(filters.period.end)
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          return { from: startDate, to: endDate }
        }
      } catch (error) {
        // Se houver erro ao criar as datas, retorna undefined
      }
    }
    return undefined
  })

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      onFilterChange({
        ...filters,
        period: {
          start: range.from.toISOString(),
          end: range.to.toISOString()
        }
      })
    }
  }

  const clearFilters = () => {
    setDateRange(undefined)
    onFilterChange({})
  }

  const activeFiltersCount = 
    (filters.status ? 1 : 0) +
    (filters.profile ? 1 : 0) +
    (filters.period ? 1 : 0) +
    (filters.name ? 1 : 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca por nome */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pesquisa por nome..."
            value={filters.name || ""}
            onChange={(e) => onFilterChange({ ...filters, name: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Filtro por status */}
        <Select
          value={filters.status || "todos"}
          onValueChange={(value) => 
            onFilterChange({ 
              ...filters, 
              status: value === "todos" ? undefined : value
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value={SurveyStatus.ACTIVE}>Ativa</SelectItem>
            <SelectItem value={SurveyStatus.INACTIVE}>Inativa</SelectItem>
            <SelectItem value={SurveyStatus.DRAFT}>Rascunho</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por perfil */}
        <Select
          value={filters.profile || "todos"}
          onValueChange={(value) => 
            onFilterChange({ 
              ...filters, 
              profile: value === "todos" ? undefined : value 
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os perfis</SelectItem>
            {perfis.map(perfil => (
              <SelectItem key={perfil.id} value={perfil.id}>
                {perfil.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por período */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {dateRange ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from!, "dd/MM/yy", { locale: ptBR })} -{" "}
                    {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from!, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                "Período"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from || new Date()}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        {/* Limpar filtros */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="h-10"
          >
            Limpar filtros
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.name && (
            <Badge variant="secondary" className="gap-1">
              Nome: {filters.name}
              <button
                onClick={() => onFilterChange({ ...filters, name: undefined })}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button
                onClick={() => onFilterChange({ ...filters, status: undefined })}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.profile && (
            <Badge variant="secondary" className="gap-1">
              Perfil: {perfis.find(p => p.id === filters.profile)?.name}
              <button
                onClick={() => onFilterChange({ ...filters, profile: undefined })}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.period && (
            <Badge variant="secondary" className="gap-1">
              Período: {
                (() => {
                  try {
                    const startDate = new Date(filters.period.start)
                    const endDate = new Date(filters.period.end)
                    
                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                      return "Data inválida"
                    }
                    
                    return `${format(startDate, "dd/MM", { locale: ptBR })} - ${format(endDate, "dd/MM", { locale: ptBR })}`
                  } catch (error) {
                    return "Data inválida"
                  }
                })()
              }
              <button
                onClick={() => {
                  onFilterChange({ ...filters, period: undefined })
                  setDateRange(undefined)
                }}
                className="ml-1 hover:bg-gray-300 rounded"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}