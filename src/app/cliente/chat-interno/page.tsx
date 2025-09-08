"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { toast } from "sonner"
import { useChat } from "./use-chat"
import { ChatList } from "./components/chat-list"
import { ChatWindow } from "./components/chat-window"
import { ExternalChatDialog } from "./components/external-chat-dialog"
import { ClientAuthDialog } from "./components/client-auth-dialog"

export default function ChatInternoPage() {
  const searchParams = useSearchParams()
  const secureToken = searchParams.get("token")
  const chatIdFromUrl = searchParams.get("chat")
  
  const [showExternalChatDialog, setShowExternalChatDialog] = useState(false)
  const [showClientAuthDialog, setShowClientAuthDialog] = useState(false)
  const [pendingChatId, setPendingChatId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const {
    chats,
    selectedChatId,
    messages,
    loading,
    searchQuery,
    typingUsers,
    notifications,
    isRecording,
    setSelectedChatId,
    setSearchQuery,
    setIsRecording,
    sendMessage,
    sendAudio,
    sendAttachment,
    startExternalChat,
    authenticateClient,
    closeChat,
    sendTypingIndicator
  } = useChat()

  // Verificar se é acesso externo via link seguro
  useEffect(() => {
    if (secureToken && chatIdFromUrl) {
      // Cliente acessando via link seguro
      setPendingChatId(chatIdFromUrl)
      setShowClientAuthDialog(true)
    }
  }, [secureToken, chatIdFromUrl])

  // Lidar com autenticação de cliente externo
  const handleClientAuth = async (data: any) => {
    if (pendingChatId) {
      const success = await authenticateClient(data, pendingChatId)
      if (success) {
        setIsAuthenticated(true)
        setSelectedChatId(pendingChatId)
        setShowClientAuthDialog(false)
        return true
      }
    }
    return false
  }

  const selectedChat = chats.find(c => c.id === selectedChatId)

  // Se for cliente externo e não autenticado, mostrar apenas dialog de autenticação
  if (secureToken && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl font-bold text-blue-600">C</span>
            </div>
            <h1 className="text-2xl font-bold">Callistra Chat</h1>
            <p className="mt-2 text-muted-foreground">
              Você precisa se autenticar para acessar esta conversa
            </p>
          </div>
          
          <ClientAuthDialog
            open={showClientAuthDialog}
            onOpenChange={setShowClientAuthDialog}
            onSubmit={handleClientAuth}
            chatId={pendingChatId || ""}
          />
          
          <Button
            onClick={() => setShowClientAuthDialog(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
          >
            Acessar Chat
          </Button>
        </Card>
      </div>
    )
  }

  // Interface para cliente externo autenticado (simplificada)
  if (secureToken && isAuthenticated && selectedChat) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1">
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            loading={loading}
            isRecording={isRecording}
            typingUsers={typingUsers}
            onSendMessage={sendMessage}
            onSendAudio={sendAudio}
            onSendAttachment={sendAttachment}
            onCloseChat={closeChat}
            onTyping={sendTypingIndicator}
            setIsRecording={setIsRecording}
          />
        </div>
      </div>
    )
  }

  // Interface completa para usuários internos
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64">
        <div className="flex h-full">
          {/* Lista de Chats */}
          <div className="w-80 border-r">
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              searchQuery={searchQuery}
              onSelectChat={setSelectedChatId}
              onSearchChange={setSearchQuery}
              onNewChat={() => setShowExternalChatDialog(true)}
            />
          </div>

          {/* Área de Chat */}
          <div className="flex-1">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                messages={messages}
                loading={loading}
                isRecording={isRecording}
                typingUsers={typingUsers}
                onSendMessage={sendMessage}
                onSendAudio={sendAudio}
                onSendAttachment={sendAttachment}
                onCloseChat={closeChat}
                onTyping={sendTypingIndicator}
                setIsRecording={setIsRecording}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Nenhuma conversa selecionada</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selecione uma conversa existente ou inicie uma nova
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => setShowExternalChatDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Iniciar Nova Conversa
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notificações Badge (canto superior direito) */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => {
                // Implementar dropdown de notificações
                toast.info(`Você tem ${notifications.length} novas mensagens`)
              }}
            >
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              >
                {notifications.length}
              </Badge>
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ExternalChatDialog
        open={showExternalChatDialog}
        onOpenChange={setShowExternalChatDialog}
        onSubmit={startExternalChat}
      />
    </div>
  )
}