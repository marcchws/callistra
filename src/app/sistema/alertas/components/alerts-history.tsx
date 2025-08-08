"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { History, Calendar, Download, Search, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { Alert, AlertFilters, AlertStatus, AlertType, ALERT_TYPE_LABELS, ALERT_STATUS_LABELS, ALERT_CHANNEL_LABELS } from "../types"

interface AlertsHistoryProps {
  alerts: Alert[]
  filters: AlertFilters
  onFiltersChange: (filters: AlertFilters) => void
  loading: boolean
}

export function AlertsHistory({
  alerts,
  filters,
  onFiltersChange,
  loading
}: AlertsHistoryProps) {
  const [searchTerm, setSearchTerm] = useState(filters.busca || "")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({ ...filters, busca: value || undefined })
  }

  const clearFilters = () => {
    setSearchTerm("")
    onFiltersChange({})
  }

  const exportHistory = () => {
    // Implementar exportação (CSV, PDF, etc.)
    console.log("Exportar histórico:", alerts)
  }

  const getStatusBadgeVariant = (status: AlertStatus) => {
    switch (status) {
      case "pendente":
        return "destructive"
      case "enviado":
        return "secondary"
      case "lido":
        return "outline"
      case "arquivado":
        return "outline"
      default:
        return "secondary"
    }
  }

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof AlertFilters])

  // Ordenar por data mais recente
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.dataHoraEvento).getTime() - new Date(a.dataHoraEvento).getTime()
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-slate-600" />
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800">Histórico de Alertas</CardTitle>
              <CardDescription className="text-slate-600">
                Registro completo de todos os alertas recebidos
              </CardDescription>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={exportHistory}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filtros de Histórico</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs text-slate-600 hover:text-slate-800"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar no histórico..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Tipo</label>
              <Select
                value={filters.tipo || "todos"}
                onValueChange={(value) => 
                  onFiltersChange({ 
                    ...filters, 
                    tipo: value === "todos" ? undefined : value as AlertType 
                  })
                }
              >
                <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {Object.entries(ALERT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Status</label>
              <Select
                value={filters.status || "todos"}
                onValueChange={(value) => 
                  onFiltersChange({ 
                    ...filters, 
                    status: value === "todos" ? undefined : value as AlertStatus 
                  })
                }
              >
                <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {Object.entries(ALERT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Período</label>
              <Select
                value="todos"
                onValueChange={(value) => {
                  const now = new Date()
                  let dataInicio: Date | undefined
                  
                  switch (value) {
                    case "hoje":
                      dataInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                      break
                    case "semana":
                      dataInicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                      break
                    case "mes":
                      dataInicio = new Date(now.getFullYear(), now.getMonth(), 1)
                      break
                    case "todos":
                    default:
                      dataInicio = undefined
                  }
                  
                  onFiltersChange({ ...filters, dataInicio })
                }}
              >
                <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de Histórico */}
        <div className="rounded-lg border border-slate-200">
          {sortedAlerts.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum registro encontrado</h3>
              <p className="text-slate-500">
                {hasActiveFilters 
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Ainda não há alertas no histórico."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700 font-medium">Data/Hora</TableHead>
                  <TableHead className="text-slate-700 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-700 font-medium">Mensagem</TableHead>
                  <TableHead className="text-slate-700 font-medium">Canal</TableHead>
                  <TableHead className="text-slate-700 font-medium">Status</TableHead>
                  <TableHead className="text-slate-700 font-medium">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAlerts.map((alert) => (
                  <TableRow key={alert.id} className="border-slate-200 hover:bg-slate-50">
                    <TableCell className="text-slate-800">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {format(alert.dataHoraEvento, "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format(alert.dataHoraEvento, "HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {ALERT_TYPE_LABELS[alert.tipo]}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-slate-800 max-w-md">
                      <div className="truncate" title={alert.mensagem}>
                        {alert.mensagem}
                      </div>
                      {alert.confidencialidadeVinculada && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 mt-1">
                          Confidencial
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {ALERT_CHANNEL_LABELS[alert.canal]}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(alert.status)} className="text-xs">
                        {ALERT_STATUS_LABELS[alert.status]}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-xs text-slate-500">
                        Atualizado em {format(alert.updatedAt, "dd/MM HH:mm", { locale: ptBR })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Estatísticas do Histórico */}
        {sortedAlerts.length > 0 && (
          <>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{sortedAlerts.length}</div>
                <div className="text-sm text-slate-600">Total de Alertas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {sortedAlerts.filter(a => a.status === "lido").length}
                </div>
                <div className="text-sm text-slate-600">Lidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {sortedAlerts.filter(a => a.status === "arquivado").length}
                </div>
                <div className="text-sm text-slate-600">Arquivados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {sortedAlerts.filter(a => a.status === "pendente" || a.status === "enviado").length}
                </div>
                <div className="text-sm text-slate-600">Pendentes</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}