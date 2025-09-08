"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  Download,
  Copy,
  ExternalLink
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Chat, Message } from "../types"
import { MessageItem } from "./message-item"
import { MessageInput } from "./message-input"

interface ChatWindowProps {
  chat: Chat
  messages: Message[]
  loading: boolean
  isRecording: boolean
  typingUsers: Record<string, boolean>
  onSendMessage: (content: string) => void
  onSendAudio: (audioBlob: Blob) => void
  onSendAttachment: (file: File) => void
  onCloseChat: (chatId: string) => void
  onTyping: (isTyping: boolean) => void
  setIsRecording: (isRecording: boolean) => void
}

export function ChatWindow({
  chat,
  messages,
  loading,
  isRecording,
  typingUsers,
  onSendMessage,
  onSendAudio,
  onSendAttachment,
  onCloseChat,
  onTyping,
  setIsRecording
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showChatInfo, setShowChatInfo] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getChatName = () => {
    const otherParticipant = chat.participants.find(p => p.id !== "user1")
    return otherParticipant?.name || "Chat"
  }

  const getChatAvatar = () => {
    const otherParticipant = chat.participants.find(p => p.id !== "user1")
    return otherParticipant?.avatar
  }

  const otherParticipant = chat.participants.find(p => p.id !== "user1")
  const isTyping = Object.values(typingUsers).some(typing => typing)

  const handleCopyLink = () => {
    if (chat.secureLink) {
      navigator.clipboard.writeText(chat.secureLink)
      toast.success("Link copiado para a área de transferência")
    }
  }

  const handleShareWhatsApp = () => {
    if (chat.secureLink) {
      const message = `Olá! Acesse nosso chat através do link: ${chat.secureLink}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleShareEmail = () => {
    if (chat.secureLink && chat.clientEmail) {
      const subject = "Link de acesso ao chat - Callistra"
      const body = `Olá!\n\nVocê pode acessar nosso chat através do seguinte link:\n${chat.secureLink}\n\nPara acessar, você precisará informar seu e-mail e os 5 primeiros dígitos do seu documento.\n\nAtenciosamente,\nEquipe Callistra`
      const mailtoUrl = `mailto:${chat.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoUrl)
    }
  }

  const handleCloseChat = () => {
    setShowCloseDialog(false)
    onCloseChat(chat.id)
  }

  // Agrupar mensagens por data
  const messagesByDate = messages.reduce((acc, message) => {
    const date = format(new Date(message.timestamp), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(message)
    return acc
  }, {} as Record<string, Message[]>)

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getChatAvatar()} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(getChatName())}
              </AvatarFallback>
            </Avatar>
            {otherParticipant?.isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{getChatName()}</h3>
              {chat.type === "external" && (
                <Badge variant="secondary" className="text-xs">
                  Cliente Externo
                </Badge>
              )}
              {chat.status === "closed" && (
                <Badge variant="outline" className="text-xs">
                  Encerrado
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {otherParticipant?.isOnline 
                ? "Online" 
                : otherParticipant?.lastSeen
                  ? `Visto por último ${format(new Date(otherParticipant.lastSeen), "HH:mm", { locale: ptBR })}`
                  : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chat.type === "external" && chat.secureLink && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Compartilhar Link
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Compartilhar link seguro</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                  <Phone className="h-4 w-4 mr-2" />
                  Enviar via WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareEmail}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Enviar por e-mail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowChatInfo(true)}>
                <Info className="h-4 w-4 mr-2" />
                Informações do chat
              </DropdownMenuItem>
              {chat.status === "active" && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => setShowCloseDialog(true)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Encerrar chat
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground font-medium px-2 bg-white">
                  {date}
                </span>
                <Separator className="flex-1" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-2">
                {dateMessages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isMe={message.senderId === "user1"}
                    showAvatar={chat.type === "internal"}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                      style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                      style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                      style={{ animationDelay: "300ms" }} />
              </div>
              <span>{otherParticipant?.name} está digitando...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {chat.status === "active" && (
        <MessageInput
          onSendMessage={onSendMessage}
          onSendAudio={onSendAudio}
          onSendAttachment={onSendAttachment}
          onTyping={onTyping}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      )}

      {/* Closed Chat Message */}
      {chat.status === "closed" && (
        <div className="border-t p-4 bg-gray-50">
          <p className="text-center text-sm text-muted-foreground">
            Este chat foi encerrado e não aceita novas mensagens.
          </p>
        </div>
      )}

      {/* Chat Info Dialog */}
      <Dialog open={showChatInfo} onOpenChange={setShowChatInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informações do Chat</DialogTitle>
            <DialogDescription>
              Detalhes sobre esta conversa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Participantes</h4>
              <div className="space-y-2">
                {chat.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">{participant.email}</p>
                    </div>
                    {participant.isOnline && (
                      <Badge variant="secondary" className="text-xs">Online</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Informações Gerais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{chat.type === "internal" ? "Interno" : "Externo"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{chat.status === "active" ? "Ativo" : "Encerrado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{format(new Date(chat.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última atualização:</span>
                  <span>{format(new Date(chat.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de mensagens:</span>
                  <span>{messages.length}</span>
                </div>
              </div>
            </div>

            {chat.type === "external" && chat.secureLink && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Link Seguro</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">E-mail do cliente:</span>
                      <span>{chat.clientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dígitos do documento:</span>
                      <span>{chat.clientDocumentDigits}</span>
                    </div>
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyLink}
                        className="w-full"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link Seguro
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Chat Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O chat será movido para o histórico e não será possível enviar novas mensagens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseChat}
              className="bg-red-600 hover:bg-red-700"
            >
              Encerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}