"use client"

import { useState } from "react"
import { Search, Plus, MessageSquare, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Chat } from "../types"
import { ExternalChatModal } from "./external-chat-modal"

interface ChatListProps {
  chats: Chat[]
  selectedChat: Chat | null
  searchTerm: string
  onSelectChat: (chat: Chat) => void
  onSearchChange: (term: string) => void
  onCreateExternalChat: (data: any) => Promise<Chat>
  loading: boolean
}

export function ChatList({
  chats,
  selectedChat,
  searchTerm,
  onSelectChat,
  onSearchChange,
  onCreateExternalChat,
  loading
}: ChatListProps) {
  const [isExternalChatModalOpen, setIsExternalChatModalOpen] = useState(false)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const handleCreateExternalChat = async (data: any) => {
    try {
      await onCreateExternalChat(data)
      setIsExternalChatModalOpen(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  return (
    <Card className="w-80 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Conversas
          </h2>
          
          <Dialog open={isExternalChatModalOpen} onOpenChange={setIsExternalChatModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ExternalChatModal 
                onSubmit={handleCreateExternalChat}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Carregando conversas...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = selectedChat?.id === chat.id
              const otherParticipants = chat.participants.filter(p => p.id !== "user1")
              const displayName = otherParticipants.map(p => p.name).join(", ")
              
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors border",
                    "hover:bg-blue-50 hover:border-blue-200",
                    isSelected 
                      ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" 
                      : "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                      isSelected ? "bg-blue-500" : "bg-blue-100"
                    )}>
                      {chat.type === 'external' ? (
                        <Users className={cn("h-5 w-5", isSelected ? "text-white" : "text-blue-600")} />
                      ) : (
                        <MessageSquare className={cn("h-5 w-5", isSelected ? "text-white" : "text-blue-600")} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          "font-medium text-sm truncate",
                          isSelected ? "text-white" : "text-gray-900"
                        )}>
                          {displayName}
                        </h3>
                        
                        <div className="flex items-center gap-1">
                          {chat.lastMessage && (
                            <span className={cn(
                              "text-xs",
                              isSelected ? "text-blue-100" : "text-gray-500"
                            )}>
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          )}
                          
                          {chat.unreadCount > 0 && (
                            <Badge 
                              variant={isSelected ? "secondary" : "destructive"} 
                              className="text-xs min-w-[1.25rem] h-5 flex items-center justify-center"
                            >
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Last message */}
                      {chat.lastMessage && (
                        <p className={cn(
                          "text-sm truncate",
                          isSelected ? "text-blue-100" : "text-gray-600"
                        )}>
                          {chat.lastMessage.type === 'file' ? (
                            <span className="flex items-center gap-1">
                              📎 {chat.lastMessage.fileName}
                            </span>
                          ) : chat.lastMessage.type === 'audio' ? (
                            <span className="flex items-center gap-1">
                              🎵 Áudio
                            </span>
                          ) : (
                            chat.lastMessage.content
                          )}
                        </p>
                      )}

                      {/* Type indicator */}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={isSelected ? "secondary" : "outline"} 
                          className="text-xs"
                        >
                          {chat.type === 'external' ? 'Cliente Externo' : 'Interno'}
                        </Badge>
                        
                        {!chat.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Histórico
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}