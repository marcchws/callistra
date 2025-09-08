"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Ticket, TicketStatus } from "@/app/cliente/helpdesk/types"

interface TicketListProps {
  tickets: Ticket[]
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  onTicketSelect: (ticket: Ticket) => void
  selectedTicketId?: string
}

const statusConfig = {
  [TicketStatus.ABERTO]: {
    label: "Aberto",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [TicketStatus.EM_ATENDIMENTO]: {
    label: "Em Atendimento",
    icon: Clock,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [TicketStatus.RESOLVIDO]: {
    label: "Resolvido",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  [TicketStatus.FECHADO]: {
    label: "Fechado",
    icon: XCircle,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

export function TicketList({
  tickets,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onTicketSelect,
  selectedTicketId,
}: TicketListProps) {
  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge 
        variant="outline" 
        className={cn("gap-1", config.color)}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    return "Agora"
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por motivo ou cliente..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value={TicketStatus.ABERTO}>Aberto</SelectItem>
            <SelectItem value={TicketStatus.EM_ATENDIMENTO}>Em Atendimento</SelectItem>
            <SelectItem value={TicketStatus.RESOLVIDO}>Resolvido</SelectItem>
            <SelectItem value={TicketStatus.FECHADO}>Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Tickets */}
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-2 pr-4">
          {tickets.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground">
                  Nenhum ticket encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedTicketId === ticket.id && "border-blue-600 bg-blue-50/50"
                )}
                onClick={() => onTicketSelect(ticket)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            #{ticket.id}
                          </span>
                          {getStatusBadge(ticket.status)}
                          {ticket.unreadCount > 0 && (
                            <Badge className="bg-blue-600 hover:bg-blue-700">
                              {ticket.unreadCount} nova{ticket.unreadCount > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium line-clamp-1">
                          {ticket.subject}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(ticket.updatedAt)}
                      </span>
                    </div>

                    {/* Cliente */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{ticket.clientName}</span>
                      <span className="text-muted-foreground">
                        ({ticket.clientEmail})
                      </span>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{ticket.messages.length} mensagens</span>
                        </div>
                        {(ticket.initialAttachment || 
                          ticket.messages.some(m => m.attachments.length > 0)) && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>Com anexos</span>
                          </div>
                        )}
                      </div>
                      {ticket.attendantName && (
                        <span className="text-xs text-muted-foreground">
                          Atendente: {ticket.attendantName}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
