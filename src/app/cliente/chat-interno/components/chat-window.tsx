"use client"

import { useEffect, useRef, useState } from "react"
import { MoreVertical, Users, Link2, X, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { Chat, ChatMessage, MessageFormData } from "../types"
import { MessageItem } from "./message-item"
import { MessageInput } from "./message-input"
import { toast } from "sonner"

interface ChatWindowProps {
  chat: Chat | null
  messages: ChatMessage[]
  onSendMessage: (message: MessageFormData, file?: File) => Promise<void>
  onCloseChat: (chatId: string) => Promise<void>
  isConnected: boolean
  loading: boolean
}

export function ChatWindow({ 
  chat, 
  messages, 
  onSendMessage, 
  onCloseChat,
  isConnected,
  loading 
}: ChatWindowProps) {
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!chat) {
    return (
      <Card className="flex-1 h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Selecione uma conversa
            </h3>
            <p className="text-sm text-gray-600">
              Escolha uma conversa da lista para começar a enviar mensagens
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const otherParticipants = chat.participants.filter(p => p.id !== "user1")
  const displayName = otherParticipants.map(p => p.name).join(", ")

  const handleCopyLink = () => {
    if (chat.secureLink) {
      navigator.clipboard.writeText(chat.secureLink)
      toast.success("Link copiado para a área de transferência", { duration: 2000 })
    }
  }

  const handleCloseChat = async () => {
    try {
      await onCloseChat(chat.id)
      setShowCloseDialog(false)
    } catch (error) {
      // Error handling done in hook
    }
  }

  const groupMessages = (messages: ChatMessage[]) => {
    const grouped: (ChatMessage & { showAvatar?: boolean })[] = []
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      const prevMessage = messages[i - 1]
      const nextMessage = messages[i + 1]
      
      // Show avatar if it's the first message from this sender or sender changes
      const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId
      
      grouped.push({
        ...message,
        showAvatar
      })
    }
    
    return grouped
  }

  const groupedMessages = groupMessages(messages)

  return (
    <Card className="flex-1 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              {chat.type === 'external' ? (
                <Users className="h-5 w-5 text-blue-600" />
              ) : (
                <span className="text-sm font-medium text-blue-600">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {displayName}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant={chat.type === 'external' ? 'default' : 'secondary'}>
                  {chat.type === 'external' ? 'Cliente Externo' : 'Conversa Interna'}
                </Badge>
                
                {!chat.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Histórico
                  </Badge>
                )}
                
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isConnected ? "bg-green-500" : "bg-gray-400"
                )} />
                <span className="text-xs text-gray-600">
                  {isConnected ? "Online" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {chat.type === 'external' && chat.secureLink && (
                <>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Copiar Link Seguro
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {chat.isActive && (
                <DropdownMenuItem 
                  onClick={() => setShowCloseDialog(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Encerrar Chat
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* External Chat Info */}
        {chat.type === 'external' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Chat Seguro com Cliente</p>
                <p className="text-blue-700">
                  Cliente autenticado com: {chat.clientEmail} • 
                  Documento: *****{chat.clientDocumentDigits?.slice(-2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-600">Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Nenhuma mensagem ainda</p>
              <p className="text-sm text-gray-500">
                Seja o primeiro a enviar uma mensagem!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {groupedMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.senderId === "user1"}
                showAvatar={message.showAvatar}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      {chat.isActive && (
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={!isConnected || loading}
        />
      )}

      {/* Close Chat Confirmation Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja encerrar esta conversa? Ela será movida para o histórico
              e não será possível enviar novas mensagens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseChat}
              className="bg-red-600 hover:bg-red-700"
            >
              Encerrar Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}