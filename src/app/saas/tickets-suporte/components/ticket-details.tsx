"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  Paperclip,
  Send,
  Download,
  UserPlus,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Ticket, TicketStatus, STATUS_CONFIG, formatTimeAgo, getInitials, Attendant } from "../types"
import { TicketHistory } from "./ticket-history"

interface TicketDetailsProps {
  ticket: Ticket
  attendants: Attendant[]
  currentUser: {
    name: string
    accessLevel: 'total' | 'restrito'
  }
  onChangeStatus: (status: TicketStatus) => void
  onChangeResponsible: (responsible: string) => void
  onAddInteraction: (message: string, attachments?: any[]) => void
  onAssumeTicket: () => void
}

export function TicketDetails({
  ticket,
  attendants,
  currentUser,
  onChangeStatus,
  onChangeResponsible,
  onAddInteraction,
  onAssumeTicket
}: TicketDetailsProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [showChangeResponsible, setShowChangeResponsible] = useState(false)
  const [selectedResponsible, setSelectedResponsible] = useState(ticket.responsavel || "")
  const [sendingMessage, setSendingMessage] = useState(false)

  const statusConfig = STATUS_CONFIG[ticket.status]
  const isResponsible = ticket.responsavel === currentUser.name
  const canChangeResponsible = currentUser.accessLevel === 'total'
  const canAssume = !ticket.responsavel

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setSendingMessage(true)
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onAddInteraction(message)
    setMessage("")
    setSendingMessage(false)
  }

  const handleChangeResponsible = () => {
    if (selectedResponsible && selectedResponsible !== ticket.responsavel) {
      onChangeResponsible(selectedResponsible)
      setShowChangeResponsible(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/saas/tickets-suporte')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Ticket {ticket.id}
            </h1>
            <p className="text-muted-foreground">
              Detalhes e histórico do ticket de suporte
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {canAssume && (
            <Button 
              onClick={onAssumeTicket}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Assumir Ticket
            </Button>
          )}
          
          {canChangeResponsible && !canAssume && (
            <Button
              variant="outline"
              onClick={() => setShowChangeResponsible(true)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Trocar Responsável
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Ticket Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informações do Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status and Responsible */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge 
                      variant="outline"
                      className={`${statusConfig.color} border font-medium`}
                    >
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <Separator orientation="vertical" className="h-10" />
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Responsável</p>
                    {ticket.responsavel ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className={`text-xs ${isResponsible ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {getInitials(ticket.responsavel)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {ticket.responsavel}
                          {isResponsible && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Você
                            </Badge>
                          )}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Sem responsável
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Change Status */}
                {ticket.responsavel && (
                  <Select 
                    value={ticket.status} 
                    onValueChange={(value) => onChangeStatus(value as TicketStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                )}
              </div>

              <Separator />

              {/* Ticket Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{ticket.motivo}</h3>
                  <p className="text-muted-foreground">{ticket.descricao}</p>
                </div>

                {/* Attachments */}
                {ticket.anexos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Anexos</p>
                    <div className="space-y-2">
                      {ticket.anexos.map(anexo => (
                        <Button
                          key={anexo.id}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Paperclip className="h-3 w-3" />
                          {anexo.name}
                          <Download className="h-3 w-3 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interaction Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="history"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                  >
                    Histórico
                  </TabsTrigger>
                  <TabsTrigger
                    value="reply"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                  >
                    Responder
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="p-6">
                  <TicketHistory interactions={ticket.historico} />
                </TabsContent>
                
                <TabsContent value="reply" className="p-6 space-y-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] resize-none focus:ring-blue-500"
                    />
                    
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Paperclip className="h-4 w-4" />
                        Anexar arquivo
                      </Button>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendingMessage}
                        className="bg-blue-600 hover:bg-blue-700 gap-2"
                      >
                        {sendingMessage ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar Resposta
                          </>
                        )}
                      </Button>
                    </div>

                    {canAssume && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Ao enviar a primeira resposta, você será automaticamente designado como responsável por este ticket.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Client Info */}
        <div className="space-y-6">
          {/* Client Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{ticket.cliente}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  E-mail
                </p>
                <p className="font-medium text-sm">{ticket.emailCliente}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Data de Abertura
                </p>
                <p className="font-medium text-sm">
                  {new Date(ticket.dataAbertura).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(ticket.dataAbertura).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Última Ação
                </p>
                <p className="font-medium text-sm">
                  {formatTimeAgo(ticket.ultimaAcao)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Interações</span>
                <Badge variant="secondary">{ticket.historico.length}</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tempo Aberto</span>
                <span className="text-sm font-medium">
                  {(() => {
                    const diff = Date.now() - ticket.dataAbertura.getTime()
                    const hours = Math.floor(diff / (1000 * 60 * 60))
                    const days = Math.floor(hours / 24)
                    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
                    return `${hours} hora${hours !== 1 ? 's' : ''}`
                  })()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Anexos</span>
                <Badge variant="secondary">{ticket.anexos.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Responsible Dialog */}
      <AlertDialog open={showChangeResponsible} onOpenChange={setShowChangeResponsible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar Responsável</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o novo responsável para este ticket. O atendente selecionado será notificado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um atendente" />
              </SelectTrigger>
              <SelectContent>
                {attendants.map(attendant => (
                  <SelectItem key={attendant.id} value={attendant.name}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                          {getInitials(attendant.name)}
                        </AvatarFallback>
                      </Avatar>
                      {attendant.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleChangeResponsible}
              disabled={!selectedResponsible || selectedResponsible === ticket.responsavel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}