"use client"

import { useRouter } from "next/navigation"
import { Clock, Mail, User, AlertCircle, CheckCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Ticket, STATUS_CONFIG, formatTimeAgo, getInitials } from "../types"
import { Skeleton } from "@/components/ui/skeleton"

interface TicketListProps {
  tickets: Ticket[]
  loading: boolean
  onAssumeTicket: (ticketId: string) => void
  currentUserName: string
}

export function TicketList({ 
  tickets, 
  loading, 
  onAssumeTicket,
  currentUserName 
}: TicketListProps) {
  const router = useRouter()

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tickets de Suporte</CardTitle>
          <CardDescription>Gerenciamento de solicitações de suporte dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tickets de Suporte</CardTitle>
          <CardDescription>Gerenciamento de solicitações de suporte dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Não há tickets que correspondam aos filtros selecionados.
              Tente ajustar os filtros ou aguarde novos tickets.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tickets de Suporte</CardTitle>
            <CardDescription>
              {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} encontrado{tickets.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-[120px]">Última Ação</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const statusConfig = STATUS_CONFIG[ticket.status]
                const isMyTicket = ticket.responsavel === currentUserName
                const canAssume = !ticket.responsavel
                
                return (
                  <TableRow 
                    key={ticket.id}
                    className="cursor-pointer hover:bg-blue-50/50"
                    onClick={(e) => {
                      // Evitar navegação se clicar em botão
                      if ((e.target as HTMLElement).closest('button')) return
                      router.push(`/saas/tickets-suporte/${ticket.id}`)
                    }}
                  >
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="font-mono">
                        {ticket.id}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.cliente}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {ticket.emailCliente}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium truncate">{ticket.motivo}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {ticket.descricao}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={`${statusConfig.color} border font-medium`}
                      >
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {ticket.responsavel ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-xs ${isMyTicket ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                              {getInitials(ticket.responsavel)}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`text-sm ${isMyTicket ? 'font-medium' : ''}`}>
                            {ticket.responsavel}
                            {isMyTicket && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Você
                              </Badge>
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Sem responsável</span>
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(ticket.ultimaAcao)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {canAssume ? (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAssumeTicket(ticket.id)
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Assumir
                        </Button>
                      ) : isMyTicket ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Seu ticket
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/saas/tickets-suporte/${ticket.id}`)
                          }}
                        >
                          Visualizar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}