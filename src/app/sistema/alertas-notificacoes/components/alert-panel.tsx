"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertStatistics, alertTypeLabels, alertStatusLabels } from "../types"
import { 
  Bell, 
  CheckCircle2, 
  Archive, 
  MoreVertical, 
  Eye, 
  Clock,
  Mail,
  Monitor,
  Smartphone,
  AlertTriangle,
  FileText,
  MessageSquare,
  Calendar,
  CreditCard,
  Shield
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AlertPanelProps {
  alerts: Alert[]
  statistics: AlertStatistics
  onMarkAsRead: (alertId: string) => void
  onArchiveAlert: (alertId: string) => void
  onMarkMultipleAsRead: (alertIds: string[]) => void
  loading: boolean
}

export function AlertPanel({ 
  alerts, 
  statistics, 
  onMarkAsRead, 
  onArchiveAlert, 
  onMarkMultipleAsRead,
  loading 
}: AlertPanelProps) {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "confidencialidade":
        return <Shield className="h-4 w-4" />
      case "contas_a_vencer":
        return <CreditCard className="h-4 w-4" />
      case "movimentacao_processos":
        return <FileText className="h-4 w-4" />
      case "chat_interno":
      case "chat_cliente":
        return <MessageSquare className="h-4 w-4" />
      case "prazos_atividades":
        return <Clock className="h-4 w-4" />
      case "agendas":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sistema":
        return <Monitor className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "ambos":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="destructive">Pendente</Badge>
      case "enviado":
        return <Badge variant="secondary">Enviado</Badge>
      case "lido":
        return <Badge variant="default">Lido</Badge>
      case "arquivado":
        return <Badge variant="outline">Arquivado</Badge>
      default:
        return <Badge variant="secondary">{alertStatusLabels[status as keyof typeof alertStatusLabels]}</Badge>
    }
  }

  const getPriorityColor = (type: string) => {
    switch (type) {
      case "confidencialidade":
      case "prazos_atividades":
        return "text-red-600"
      case "contas_a_vencer":
        return "text-orange-600"
      default:
        return "text-blue-600"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(alerts.map(alert => alert.id))
    } else {
      setSelectedAlerts([])
    }
  }

  const handleSelectAlert = (alertId: string, checked: boolean) => {
    if (checked) {
      setSelectedAlerts(prev => [...prev, alertId])
    } else {
      setSelectedAlerts(prev => prev.filter(id => id !== alertId))
    }
  }

  const handleMarkSelectedAsRead = () => {
    onMarkMultipleAsRead(selectedAlerts)
    setSelectedAlerts([])
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.total}</p>
                <p className="text-xs text-muted-foreground">Total de Alertas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{statistics.pending}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.unread}</p>
                <p className="text-xs text-muted-foreground">Não Lidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{statistics.read}</p>
                <p className="text-xs text-muted-foreground">Lidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Alertas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Painel de Alertas</CardTitle>
              <CardDescription>
                Gerencie todos os seus alertas e notificações
              </CardDescription>
            </div>
            
            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedAlerts.length} selecionados
                </span>
                <Button
                  size="sm"
                  onClick={handleMarkSelectedAsRead}
                  disabled={loading}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar como Lidos
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum alerta encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedAlerts.length === alerts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow 
                    key={alert.id}
                    className={alert.status === "lido" ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAlerts.includes(alert.id)}
                        onCheckedChange={(checked) => handleSelectAlert(alert.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={getPriorityColor(alert.type)}>
                          {getTypeIcon(alert.type)}
                        </span>
                        <span className="text-sm font-medium">
                          {alertTypeLabels[alert.type]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{alert.message}</p>
                        {alert.confidentialityLinked && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Confidencial
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getChannelIcon(alert.channel)}
                        <span className="text-sm">{alert.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(alert.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(alert.eventDateTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {alert.status !== "lido" && (
                            <DropdownMenuItem onClick={() => onMarkAsRead(alert.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Marcar como Lido
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onArchiveAlert(alert.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
