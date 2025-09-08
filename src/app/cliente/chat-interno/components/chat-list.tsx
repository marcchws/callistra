"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Search, 
  MessageSquarePlus,
  Filter,
  Archive,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Chat } from "../types"

interface ChatListProps {
  chats: Chat[]
  selectedChatId: string | null
  searchQuery: string
  onSelectChat: (chatId: string) => void
  onSearchChange: (query: string) => void
  onNewChat: () => void
}

export function ChatList({
  chats,
  selectedChatId,
  searchQuery,
  onSelectChat,
  onSearchChange,
  onNewChat
}: ChatListProps) {
  const [filter, setFilter] = useState<"all" | "internal" | "external" | "closed">("all")

  // Filtrar chats baseado no filtro selecionado
  const filteredChats = chats.filter(chat => {
    if (filter === "all") return chat.status !== "closed"
    if (filter === "internal") return chat.type === "internal" && chat.status !== "closed"
    if (filter === "external") return chat.type === "external" && chat.status !== "closed"
    if (filter === "closed") return chat.status === "closed"
    return true
  })

  // Separar chats ativos e encerrados
  const activeChats = filteredChats.filter(chat => chat.status === "active")
  const closedChats = filteredChats.filter(chat => chat.status === "closed")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getChatName = (chat: Chat) => {
    const otherParticipant = chat.participants.find(p => p.id !== "user1")
    return otherParticipant?.name || "Chat"
  }

  const getChatAvatar = (chat: Chat) => {
    const otherParticipant = chat.participants.find(p => p.id !== "user1")
    return otherParticipant?.avatar
  }

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "Nenhuma mensagem ainda"
    
    const { type, content, attachmentName, senderName } = chat.lastMessage
    const isMe = chat.lastMessage.senderId === "user1"
    const prefix = isMe ? "Você: " : `${senderName}: `

    switch (type) {
      case "text":
        return `${prefix}${content}`
      case "audio":
        return `${prefix}🎤 Mensagem de voz`
      case "attachment":
        return `${prefix}📎 ${attachmentName}`
      default:
        return "Mensagem"
    }
  }

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Header */}
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  Todas ativas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("internal")}>
                  Chats internos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("external")}>
                  Chats externos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("closed")}>
                  Encerrados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onNewChat}
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 focus:ring-blue-500"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Active Chats */}
          {activeChats.length > 0 && (
            <div className="space-y-1">
              {filter === "closed" && (
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Chats Encerrados
                </p>
              )}
              {activeChats.map(chat => {
                const isSelected = selectedChatId === chat.id
                const chatName = getChatName(chat)
                const chatAvatar = getChatAvatar(chat)
                const otherParticipant = chat.participants.find(p => p.id !== "user1")
                
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full rounded-lg p-3 text-left transition-colors",
                      "hover:bg-gray-50",
                      isSelected && "bg-blue-50 hover:bg-blue-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chatAvatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(chatName)}
                          </AvatarFallback>
                        </Avatar>
                        {otherParticipant?.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                        )}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">
                                {chatName}
                              </p>
                              {chat.type === "external" && (
                                <Badge variant="secondary" className="text-xs">
                                  Externo
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {getLastMessagePreview(chat)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground">
                              {chat.lastMessage && formatDistanceToNow(
                                new Date(chat.lastMessage.timestamp),
                                { addSuffix: false, locale: ptBR }
                              )}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge 
                                variant="default" 
                                className="h-5 min-w-[20px] bg-blue-600 px-1.5"
                              >
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Closed Chats */}
          {closedChats.length > 0 && filter === "closed" && (
            <div className="space-y-1 mt-4">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Archive className="h-3 w-3" />
                Chats Encerrados
              </p>
              {closedChats.map(chat => {
                const isSelected = selectedChatId === chat.id
                const chatName = getChatName(chat)
                const chatAvatar = getChatAvatar(chat)
                
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full rounded-lg p-3 text-left transition-colors opacity-60",
                      "hover:bg-gray-50 hover:opacity-100",
                      isSelected && "bg-blue-50 hover:bg-blue-50 opacity-100"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chatAvatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {getInitials(chatName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">
                              {chatName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              Chat encerrado
                            </p>
                          </div>

                          <span className="text-xs text-muted-foreground">
                            {chat.updatedAt && formatDistanceToNow(
                              new Date(chat.updatedAt),
                              { addSuffix: false, locale: ptBR }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquarePlus className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {searchQuery 
                  ? "Nenhuma conversa encontrada"
                  : filter === "closed"
                  ? "Nenhum chat encerrado"
                  : "Nenhuma conversa ainda"}
              </p>
              {!searchQuery && filter !== "closed" && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={onNewChat}
                  className="mt-2 text-blue-600"
                >
                  Iniciar nova conversa
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}