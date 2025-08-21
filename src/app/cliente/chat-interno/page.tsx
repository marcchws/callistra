"use client"

import { MessageSquare, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useChat } from "./use-chat"
import { ChatList } from "./components/chat-list"
import { ChatWindow } from "./components/chat-window"

export default function ChatInternoPage() {
  const {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    searchTerm,
    isConnected,
    selectChat,
    sendMessage,
    createExternalChat,
    searchChats,
    closeChat
  } = useChat()

  return (
    <div className="space-y-6">
      {/* Page Header - Seguindo padrão Global Layout Structure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Chat Interno</h1>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
              isConnected 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            )}>
              {isConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              {isConnected ? "Conectado" : "Desconectado"}
            </div>
          </div>
          
          {chats.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {chats.length} conversa{chats.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground">
          Troque mensagens em tempo real com usuários da plataforma e clientes externos. 
          Envie áudios, anexos e mantenha histórico completo de todas as conversas.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">Erro no Chat</p>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Chat List - Sidebar */}
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          searchTerm={searchTerm}
          onSelectChat={selectChat}
          onSearchChange={searchChats}
          onCreateExternalChat={createExternalChat}
          loading={loading}
        />

        {/* Chat Window - Main Content */}
        <ChatWindow
          chat={selectedChat}
          messages={messages}
          onSendMessage={sendMessage}
          onCloseChat={closeChat}
          isConnected={isConnected}
          loading={loading}
        />
      </div>

      {/* Connection Status Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-4">
          <span>
            Status: {isConnected ? "Conectado ao servidor" : "Reconectando..."}
          </span>
          
          {selectedChat && (
            <span>
              Conversa com: {selectedChat.participants
                .filter(p => p.id !== "user1")
                .map(p => p.name)
                .join(", ")}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <span>{messages.length} mensagem{messages.length !== 1 ? 's' : ''}</span>
          )}
          
          <span className="text-xs">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  )
}