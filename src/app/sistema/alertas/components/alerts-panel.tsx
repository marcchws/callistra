"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Bell, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  Archive, 
  Undo2,
  Calendar,
  Mail,
  Monitor,
  Loader2,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Alert, AlertFilters, AlertStatus, AlertType, ALERT_TYPE_LABELS, ALERT_STATUS_LABELS } from "../types"

interface AlertsPanelProps {
  alerts: Alert[]
  filters: AlertFilters
  onFiltersChange: (filters: AlertFilters) => void
  onMarkAsRead: (alertId: string) => void
  onArchive: (alertId: string) => void
  onUnarchive: (alertId: string) => void
  loading: boolean
  unreadCount: number
  totalCount: number
}

export function AlertsPanel({
  alerts,
  filters,
  onFiltersChange,
  onMarkAsRead,
  onArchive,
  onUnarchive,
  loading,
  unreadCount,
  totalCount
}: AlertsPanelProps) {
  const [searchTerm, setSearchTerm] = useState(filters.busca || "")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({ ...filters, busca: value || undefined })
  }

  const clearFilters = () => {
    setSearchTerm("")
    onFiltersChange({})
  }

  const getAlertIcon = (alert: Alert) => {
    const iconClass = "h-4 w-4"
    
    switch (alert.tipo) {
      case "chat_interno":
      case "chat_cliente":
        return <Bell className={iconClass} />
      case "contas_vencer":
        return <Calendar className={iconClass} />
      case "agendas":
        return <Calendar className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
  }

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case "email":
        return <Mail className="h-3 w-3" />
      case "sistema":
        return <Monitor className="h-3 w-3" />
      case "ambos":
        return (
          <div className="flex gap-1">
            <Monitor className="h-3 w-3" />
            <Mail className="h-3 w-3" />
          </div>
        )
      default:
        return <Monitor className="h-3 w-3" />
    }
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-slate-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800">Central de Alertas</CardTitle>
              <CardDescription className="text-slate-600">
                {totalCount} alertas • {unreadCount} não lidos
              </CardDescription>
            </div>
          </div>
          
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filtros</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar alertas..."
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
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum alerta encontrado</h3>
              <p className="text-slate-500">
                {hasActiveFilters 
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Você não possui alertas no momento."
                }
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3 pr-4">
                {alerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`transition-colors ${
                      alert.status === "pendente" || alert.status === "enviado"
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getAlertIcon(alert)}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {ALERT_TYPE_LABELS[alert.tipo]}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(alert.status)} className="text-xs">
                                {ALERT_STATUS_LABELS[alert.status]}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {getChannelIcon(alert.canal)}
                              </div>
                              {alert.confidencialidadeVinculada && (
                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                  Confidencial
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-800 leading-relaxed">
                              {alert.mensagem}
                            </p>
                            
                            <p className="text-xs text-slate-500">
                              {format(alert.dataHoraEvento, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(alert.status === "pendente" || alert.status === "enviado") && (
                              <DropdownMenuItem onClick={() => onMarkAsRead(alert.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marcar como lido
                              </DropdownMenuItem>
                            )}
                            
                            {alert.status !== "arquivado" ? (
                              <DropdownMenuItem onClick={() => onArchive(alert.id)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Arquivar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onUnarchive(alert.id)}>
                                <Undo2 className="mr-2 h-4 w-4" />
                                Desarquivar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}