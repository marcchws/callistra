"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Send,
  Paperclip,
  Download,
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  Headphones,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Ticket, 
  TicketStatus, 
  Message,
  Attachment,
} from "@/app/cliente/helpdesk/types"

interface TicketChatProps {
  ticket: Ticket
  onSendMessage: (content: string, attachments: File[]) => Promise<void>
  onStatusChange: (status: typeof TicketStatus[keyof typeof TicketStatus]) => Promise<void>
  isTyping?: boolean
  currentUserType: "cliente" | "atendente"
  loading?: boolean
}

export function TicketChat({
  ticket,
  onSendMessage,
  onStatusChange,
  isTyping = false,
  currentUserType,
  loading = false,
}: TicketChatProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showReopenDialog, setShowReopenDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [ticket.messages])

  const handleSendMessage = async () => {
    if (message.trim() === "" && attachments.length === 0) return
    
    setSending(true)
    try {
      await onSendMessage(message, attachments)
      setMessage("")
      setAttachments([])
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    return FileText
  }

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR })
  }

  const canReopen = ticket.status === TicketStatus.FECHADO && currentUserType === "cliente"
  const canClose = ticket.status !== TicketStatus.FECHADO && currentUserType === "atendente"
  const canResolve = ticket.status === TicketStatus.EM_ATENDIMENTO && currentUserType === "atendente"

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Ticket #{ticket.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{ticket.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            {canResolve && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(TicketStatus.RESOLVIDO)}
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolver
              </Button>
            )}
            {canClose && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCloseDialog(true)}
                disabled={loading}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Fechar
              </Button>
            )}
            {canReopen && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReopenDialog(true)}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reabrir
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Informações do Cliente */}
      <div className="px-6 py-3 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{ticket.clientName}</span>
            <span className="text-muted-foreground">({ticket.clientEmail})</span>
          </div>
          <Badge variant={
            ticket.status === TicketStatus.ABERTO ? "secondary" :
            ticket.status === TicketStatus.EM_ATENDIMENTO ? "default" :
            ticket.status === TicketStatus.RESOLVIDO ? "outline" :
            "secondary"
          }>
            {ticket.status === TicketStatus.ABERTO && "Aberto"}
            {ticket.status === TicketStatus.EM_ATENDIMENTO && "Em Atendimento"}
            {ticket.status === TicketStatus.RESOLVIDO && "Resolvido"}
            {ticket.status === TicketStatus.FECHADO && "Fechado"}
          </Badge>
        </div>
      </div>

      {/* Descrição Inicial */}
      <div className="px-6 py-4 border-b bg-blue-50/50">
        <p className="text-sm font-medium mb-2">Descrição inicial:</p>
        <p className="text-sm text-gray-700">{ticket.description}</p>
        {ticket.initialAttachment && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(ticket.initialAttachment!.url, "_blank")}
            >
              <Download className="h-4 w-4" />
              {ticket.initialAttachment.name}
              <span className="text-xs text-muted-foreground">
                ({formatFileSize(ticket.initialAttachment.size)})
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Mensagens */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {ticket.messages.map((msg) => {
            const isCurrentUser = 
              (currentUserType === "cliente" && msg.senderType === "cliente") ||
              (currentUserType === "atendente" && msg.senderType === "atendente")
            
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  isCurrentUser ? "flex-row-reverse" : ""
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(
                    "text-xs",
                    msg.senderType === "cliente" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-green-100 text-green-600"
                  )}>
                    {msg.senderType === "cliente" ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn(
                  "flex-1 space-y-1",
                  isCurrentUser ? "items-end" : ""
                )}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "rounded-lg p-3 max-w-[80%] inline-block",
                    isCurrentUser 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-900"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {msg.attachments.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {msg.attachments.map((att) => {
                        const FileIcon = getFileIcon(att.type)
                        return (
                          <Button
                            key={att.id}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(att.url, "_blank")}
                          >
                            <FileIcon className="h-4 w-4" />
                            {att.name}
                            <span className="text-xs text-muted-foreground">
                              ({formatFileSize(att.size)})
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                  <Headphones className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input de Mensagem */}
      {ticket.status !== TicketStatus.FECHADO && (
        <>
          <Separator />
          
          {/* Anexos pendentes */}
          {attachments.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b">
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => {
                  const FileIcon = getFileIcon(file.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2"
                    >
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={sending || (message.trim() === "" && attachments.length === 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dialog de Fechar Ticket */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fechar este ticket? O cliente será notificado sobre o encerramento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onStatusChange(TicketStatus.FECHADO)
                setShowCloseDialog(false)
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Reabrir Ticket */}
      <AlertDialog open={showReopenDialog} onOpenChange={setShowReopenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reabrir Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja reabrir este ticket? O atendente será notificado sobre a reabertura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onStatusChange(TicketStatus.ABERTO)
                setShowReopenDialog(false)
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
