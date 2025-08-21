"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Send, 
  Paperclip, 
  X, 
  Download,
  User,
  Headphones,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Ticket, 
  TicketInteraction, 
  messageTicketSchema, 
  MessageTicketFormData,
  statusLabels,
  statusColors
} from "../types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TicketChatProps {
  ticket: Ticket
  interactions: TicketInteraction[]
  onSendMessage: (ticketId: string, data: MessageTicketFormData & { file?: File }) => Promise<void>
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => Promise<void>
  loading: boolean
}

export function TicketChat({
  ticket,
  interactions,
  onSendMessage,
  onUpdateStatus,
  loading
}: TicketChatProps) {
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<MessageTicketFormData>({
    resolver: zodResolver(messageTicketSchema),
    defaultValues: {
      content: "",
      type: "text"
    }
  })

  // Auto scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [interactions])

  const handleSubmit = async (data: MessageTicketFormData) => {
    if (!data.content.trim() && !attachedFile) return

    try {
      await onSendMessage(ticket.id, {
        content: data.content || "Arquivo anexado",
        type: attachedFile ? "file" : "text",
        file: attachedFile || undefined
      })
      
      form.reset()
      setAttachedFile(null)
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Arquivo muito grande. Máximo permitido: 10MB")
        return
      }
      setAttachedFile(file)
    }
  }

  const removeAttachment = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="h-4 w-4" />
      case 'em_atendimento':
        return <Clock className="h-4 w-4" />
      case 'resolvido':
      case 'fechado':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Ticket #{ticket.id}</CardTitle>
            <p className="text-sm font-medium text-blue-600">{ticket.motivoSuporte}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{ticket.nomeCliente}</span>
              <span>{ticket.emailCliente}</span>
              <span>
                Aberto {formatDistanceToNow(ticket.dataHoraAbertura, {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${statusColors[ticket.status]} flex items-center gap-1`}
            >
              {getStatusIcon(ticket.status)}
              {statusLabels[ticket.status]}
            </Badge>
            
            {/* Controle de status baseado no Cenário 7 */}
            <Select 
              value={ticket.status} 
              onValueChange={(value) => onUpdateStatus(ticket.id, value as Ticket['status'])}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* Histórico de mensagens baseado no AC4 - histórico completo */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {interactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Headphones className="mx-auto h-8 w-8 mb-2" />
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Envie a primeira mensagem para iniciar o atendimento</p>
            </div>
          ) : (
            interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`flex gap-3 ${
                  interaction.senderType === 'atendente' 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div className={`max-w-[70%] ${
                  interaction.senderType === 'atendente' 
                    ? 'order-2' 
                    : 'order-1'
                }`}>
                  <div className={`p-3 rounded-lg ${
                    interaction.senderType === 'atendente'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {/* Header da mensagem */}
                    <div className="flex items-center gap-2 mb-1">
                      {interaction.senderType === 'cliente' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Headphones className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {interaction.senderName}
                      </span>
                    </div>

                    {/* Conteúdo da mensagem */}
                    {interaction.type === 'file' && interaction.fileName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Paperclip className="h-4 w-4" />
                          <span>{interaction.fileName}</span>
                          {interaction.fileSize && (
                            <span className="text-xs">
                              ({(interaction.fileSize / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={interaction.senderType === 'atendente' ? 'secondary' : 'outline'}
                          className="gap-2"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm">{interaction.content}</p>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <p className={`text-xs mt-1 ${
                    interaction.senderType === 'atendente'
                      ? 'text-right text-muted-foreground'
                      : 'text-left text-muted-foreground'
                  }`}>
                    {formatDistanceToNow(interaction.timestamp, {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Input de mensagem baseado no Cenário 2 e AC3 - suportar anexos */}
      {ticket.status !== 'fechado' && (
        <div className="border-t p-4">
          {attachedFile && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <Paperclip className="h-4 w-4 text-blue-600" />
              <span className="text-sm flex-1">{attachedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeAttachment}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Digite sua mensagem..."
                        {...field}
                        className="focus:ring-blue-500"
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button 
                type="submit" 
                size="icon"
                disabled={loading || (!form.watch('content')?.trim() && !attachedFile)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileAttach}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            className="hidden"
          />
        </div>
      )}
    </Card>
  )
}
