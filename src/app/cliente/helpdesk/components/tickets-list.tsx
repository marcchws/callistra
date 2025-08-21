"use client"

import { useState } from "react"
import { Search, Filter, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Ticket, statusLabels, statusColors } from "../types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TicketsListProps {
  tickets: Ticket[]
  selectedTicket: Ticket | null
  onSelectTicket: (ticket: Ticket) => void
  onNewTicket: () => void
  searchTerm: string
  statusFilter: string
  onSearch: (term: string) => void
  onStatusFilter: (status: string) => void
}

export function TicketsList({
  tickets,
  selectedTicket,
  onSelectTicket,
  onNewTicket,
  searchTerm,
  statusFilter,
  onSearch,
  onStatusFilter
}: TicketsListProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tickets de Suporte</CardTitle>
            <p className="text-sm text-muted-foreground">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} encontrado{tickets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={onNewTicket} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Novo Ticket
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtros baseados no AC6 - busca e filtro por status/motivo */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou motivo..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={onStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Lista de tickets baseada no AC2 - interface de chat */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum ticket encontrado</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onSelectTicket(ticket)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{ticket.nomeCliente}</p>
                      <Badge 
                        variant="secondary" 
                        className={statusColors[ticket.status]}
                      >
                        {statusLabels[ticket.status]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-blue-600">
                      {ticket.motivoSuporte}
                    </p>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ticket.descricao}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>#{ticket.id}</span>
                      <span>
                        {formatDistanceToNow(ticket.dataHoraAbertura, {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                      {ticket.anexoInicial && (
                        <span className="text-blue-600">📎 Anexo</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
