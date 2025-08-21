// filtros-dashboard.tsx - Componente de filtros do dashboard
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FiltrosDashboard, TipoPlano } from '../types'

interface FiltrosDashboardProps {
  filtros: FiltrosDashboard
  onFiltrosChange: (filtros: FiltrosDashboard) => void
  onExportar: () => void
  loading?: boolean
}

export function FiltrosDashboard({
  filtros,
  onFiltrosChange,
  onExportar,
  loading = false
}: FiltrosDashboardProps) {
  const [periodo, setPeriodo] = useState(filtros.periodo.tipo)
  const [plano, setPlano] = useState(filtros.plano)
  const [dataInicio, setDataInicio] = useState<Date | undefined>(filtros.periodo.dataInicio)
  const [dataFim, setDataFim] = useState<Date | undefined>(filtros.periodo.dataFim)
  const [mostrarCalendario, setMostrarCalendario] = useState(false)

  // Aplicar filtros quando mudarem
  useEffect(() => {
    const novosFiltros: FiltrosDashboard = {
      periodo: {
        tipo: periodo,
        ...(periodo === 'custom' && {
          dataInicio,
          dataFim
        })
      },
      plano
    }
    
    onFiltrosChange(novosFiltros)
  }, [periodo, plano, dataInicio, dataFim])

  const handlePeriodoChange = (value: string) => {
    setPeriodo(value as FiltrosDashboard['periodo']['tipo'])
    
    // Limpar datas customizadas se não for período custom
    if (value !== 'custom') {
      setDataInicio(undefined)
      setDataFim(undefined)
      setMostrarCalendario(false)
    } else {
      setMostrarCalendario(true)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Filtro de Período */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select
              value={periodo}
              onValueChange={handlePeriodoChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full focus:ring-blue-500">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Mensal</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de datas customizadas */}
          {mostrarCalendario && (
            <>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Data Início</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dataInicio ? (
                        format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione a data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dataInicio}
                      onSelect={setDataInicio}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Data Fim</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading || !dataInicio}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dataFim ? (
                        format(dataFim, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione a data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dataFim}
                      onSelect={setDataFim}
                      disabled={(date) => dataInicio ? date < dataInicio : false}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {/* Filtro de Plano */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Plano</label>
            <Select
              value={plano || 'todos'}
              onValueChange={(value) => setPlano(value === 'todos' ? undefined : value as TipoPlano)}
              disabled={loading}
            >
              <SelectTrigger className="w-full focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todos os planos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Planos</SelectItem>
                <SelectItem value={TipoPlano.FREE}>Free</SelectItem>
                <SelectItem value={TipoPlano.BASICO}>Básico</SelectItem>
                <SelectItem value={TipoPlano.PROFISSIONAL}>Profissional</SelectItem>
                <SelectItem value={TipoPlano.EMPRESARIAL}>Empresarial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de Exportar */}
          <Button 
            onClick={onExportar}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}