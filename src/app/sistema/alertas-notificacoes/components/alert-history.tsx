"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, alertTypeLabels, alertStatusLabels } from "../types"
import { 
  History, 
  Clock,
  CheckCircle2,
  Mail,
  Monitor,
  Smartphone,
  Shield,
  FileText,
  MessageSquare,
  Calendar,
  CreditCard,
  Bell
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AlertHistoryProps {
  alerts: Alert[]
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  // Ordenar alertas por data (mais recentes primeiro)
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime()
  )

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "text-red-600"
      case "enviado":
        return "text-blue-600"
      case "lido":
        return "text-green-600"
      case "arquivado":
        return "text-gray-600"
      default:
        return "text-gray-600"
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-xl font-semibold">Histórico de Alertas</CardTitle>
            <CardDescription>
              Timeline completo de todas as notificações
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum histórico de alertas encontrado</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {sortedAlerts.map((alert, index) => (
                <div key={alert.id}>
                  <div className="flex items-start space-x-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full border-2 ${getPriorityColor(alert.type)} bg-background`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      {index < sortedAlerts.length - 1 && (
                        <div className="w-px h-16 bg-border mt-2" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {alertTypeLabels[alert.type]}
                          </span>
                          <Badge 
                            variant={alert.status === "lido" ? "default" : "secondary"}
                            className={`text-xs ${getStatusColor(alert.status)}`}
                          >
                            {alertStatusLabels[alert.status]}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(alert.eventDateTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getChannelIcon(alert.channel)}
                          <span>Canal: {alert.channel}</span>
                        </div>
                        
                        {alert.confidentialityLinked && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            <span>Confidencial</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>
                            Atualizado em {format(alert.updatedAt, "dd/MM HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < sortedAlerts.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
