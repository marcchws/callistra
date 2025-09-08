"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import type { 
  Chat, 
  Message, 
  MessageType, 
  MessageStatus,
  Participant,
  WebSocketEvent,
  ExternalChatForm,
  ClientAuthForm,
  Notification
} from "./types"

// Mock de dados inicial
const mockChats: Chat[] = [
  {
    id: "1",
    type: "internal",
    participants: [
      { id: "user1", name: "João Silva", email: "joao@escritorio.com", isOnline: true, isExternal: false },
      { id: "user2", name: "Maria Santos", email: "maria@escritorio.com", isOnline: false, isExternal: false }
    ],
    lastMessage: {
      id: "msg1",
      chatId: "1",
      senderId: "user2",
      senderName: "Maria Santos",
      type: "text",
      content: "Podemos revisar o processo amanhã?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "delivered"
    },
    unreadCount: 2,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "2",
    type: "external",
    participants: [
      { id: "user1", name: "João Silva", email: "joao@escritorio.com", isOnline: true, isExternal: false },
      { id: "client1", name: "Pedro Costa", email: "pedro@gmail.com", isOnline: false, isExternal: true }
    ],
    lastMessage: {
      id: "msg2",
      chatId: "2",
      senderId: "client1",
      senderName: "Pedro Costa",
      type: "attachment",
      attachmentUrl: "/docs/contrato.pdf",
      attachmentName: "contrato.pdf",
      attachmentSize: 256000,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "read"
    },
    unreadCount: 0,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    secureLink: "https://callistra.com/chat/secure/abc123",
    clientEmail: "pedro@gmail.com",
    clientDocumentDigits: "12345"
  }
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "msg10",
      chatId: "1",
      senderId: "user1",
      senderName: "João Silva",
      type: "text",
      content: "Oi Maria, como está o andamento do processo?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "read"
    },
    {
      id: "msg11",
      chatId: "1",
      senderId: "user2",
      senderName: "Maria Santos",
      type: "text",
      content: "Estou finalizando a petição inicial",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "read"
    },
    {
      id: "msg1",
      chatId: "1",
      senderId: "user2",
      senderName: "Maria Santos",
      type: "text",
      content: "Podemos revisar o processo amanhã?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "delivered"
    }
  ],
  "2": [
    {
      id: "msg20",
      chatId: "2",
      senderId: "user1",
      senderName: "João Silva",
      type: "text",
      content: "Olá Pedro, segue o link para acompanhar seu processo",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "read"
    },
    {
      id: "msg21",
      chatId: "2",
      senderId: "client1",
      senderName: "Pedro Costa",
      type: "text",
      content: "Obrigado! Vou verificar os documentos",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: "read"
    },
    {
      id: "msg2",
      chatId: "2",
      senderId: "client1",
      senderName: "Pedro Costa",
      type: "attachment",
      attachmentUrl: "/docs/contrato.pdf",
      attachmentName: "contrato.pdf",
      attachmentSize: 256000,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "read"
    }
  ]
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Simular conexão WebSocket
  useEffect(() => {
    // Simular eventos WebSocket
    const interval = setInterval(() => {
      // Simular nova mensagem ocasionalmente
      if (Math.random() > 0.95 && selectedChatId) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          chatId: selectedChatId,
          senderId: "user2",
          senderName: "Maria Santos",
          type: "text",
          content: "Nova mensagem simulada",
          timestamp: new Date(),
          status: "delivered"
        }
        
        handleWebSocketMessage({
          type: "message",
          payload: newMessage
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedChatId])

  // Carregar mensagens quando selecionar um chat
  useEffect(() => {
    if (selectedChatId) {
      setLoading(true)
      // Simular delay de carregamento
      setTimeout(() => {
        setMessages(mockMessages[selectedChatId] || [])
        // Marcar mensagens como lidas
        setChats(prev => prev.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, unreadCount: 0 }
            : chat
        ))
        setLoading(false)
      }, 300)
    }
  }, [selectedChatId])

  // Função para lidar com eventos WebSocket
  const handleWebSocketMessage = useCallback((event: WebSocketEvent) => {
    switch (event.type) {
      case "message":
        const message = event.payload
        setMessages(prev => [...prev, message])
        
        // Atualizar última mensagem no chat
        setChats(prev => prev.map(chat => 
          chat.id === message.chatId
            ? { 
                ...chat, 
                lastMessage: message,
                unreadCount: chat.id !== selectedChatId ? chat.unreadCount + 1 : 0,
                updatedAt: new Date()
              }
            : chat
        ))

        // Adicionar notificação se não for o chat atual
        if (message.chatId !== selectedChatId) {
          const notification: Notification = {
            id: `notif-${Date.now()}`,
            chatId: message.chatId,
            message,
            timestamp: new Date(),
            read: false
          }
          setNotifications(prev => [...prev, notification])
          toast.success(`Nova mensagem de ${message.senderName}`, {
            duration: 3000
          })
        }
        break

      case "typing":
        const { userId, isTyping } = event.payload
        setTypingUsers(prev => ({ ...prev, [userId]: isTyping }))
        break

      case "status":
        const { userId: statusUserId, isOnline } = event.payload
        setChats(prev => prev.map(chat => ({
          ...chat,
          participants: chat.participants.map(p => 
            p.id === statusUserId ? { ...p, isOnline } : p
          )
        })))
        break

      case "read":
        const { messageId } = event.payload
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: "read" as MessageStatus } : msg
        ))
        break

      case "chat_closed":
        const { chatId } = event.payload
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, status: "closed" } : chat
        ))
        toast.info("Chat encerrado")
        break
    }
  }, [selectedChatId])

  // Enviar mensagem de texto
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChatId || !content.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: selectedChatId,
      senderId: "user1",
      senderName: "João Silva",
      type: "text",
      content: content.trim(),
      timestamp: new Date(),
      status: "sending"
    }

    // Adicionar mensagem otimisticamente
    setMessages(prev => [...prev, newMessage])

    // Simular envio
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: "sent" as MessageStatus }
          : msg
      ))

      // Atualizar última mensagem do chat
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, lastMessage: { ...newMessage, status: "sent" as MessageStatus }, updatedAt: new Date() }
          : chat
      ))

      // Simular status delivered após 1 segundo
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "delivered" as MessageStatus }
            : msg
        ))
      }, 1000)
    }, 500)
  }, [selectedChatId])

  // Enviar áudio
  const sendAudio = useCallback(async (audioBlob: Blob) => {
    if (!selectedChatId) return

    const audioUrl = URL.createObjectURL(audioBlob)
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: selectedChatId,
      senderId: "user1",
      senderName: "João Silva",
      type: "audio",
      audioUrl,
      timestamp: new Date(),
      status: "sending"
    }

    setMessages(prev => [...prev, newMessage])

    // Simular upload
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: "sent" as MessageStatus }
          : msg
      ))

      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, lastMessage: { ...newMessage, status: "sent" as MessageStatus }, updatedAt: new Date() }
          : chat
      ))

      toast.success("Áudio enviado com sucesso")
    }, 1000)
  }, [selectedChatId])

  // Enviar anexo
  const sendAttachment = useCallback(async (file: File) => {
    if (!selectedChatId) return

    const attachmentUrl = URL.createObjectURL(file)
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: selectedChatId,
      senderId: "user1",
      senderName: "João Silva",
      type: "attachment",
      attachmentUrl,
      attachmentName: file.name,
      attachmentSize: file.size,
      timestamp: new Date(),
      status: "sending"
    }

    setMessages(prev => [...prev, newMessage])

    // Simular upload
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: "sent" as MessageStatus }
          : msg
      ))

      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, lastMessage: { ...newMessage, status: "sent" as MessageStatus }, updatedAt: new Date() }
          : chat
      ))

      toast.success("Arquivo enviado com sucesso")
    }, 1500)
  }, [selectedChatId])

  // Iniciar chat com cliente externo
  const startExternalChat = useCallback(async (data: ExternalChatForm) => {
    setLoading(true)
    
    try {
      // Simular criação de chat e geração de link
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        type: "external",
        participants: [
          { id: "user1", name: "João Silva", email: "joao@escritorio.com", isOnline: true, isExternal: false },
          { id: `client-${Date.now()}`, name: data.clientName, email: data.clientEmail, isOnline: false, isExternal: true }
        ],
        unreadCount: 0,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        secureLink: `https://callistra.com/chat/secure/${Math.random().toString(36).substr(2, 9)}`,
        clientEmail: data.clientEmail,
        clientDocumentDigits: data.clientDocument.replace(/\D/g, '').substr(0, 5)
      }

      setChats(prev => [newChat, ...prev])
      setSelectedChatId(newChat.id)

      // Simular envio de link
      if (data.sendMethod === "email") {
        toast.success(`Link enviado para ${data.clientEmail}`)
      } else if (data.whatsappNumber) {
        toast.success(`Link enviado via WhatsApp para ${data.whatsappNumber}`)
      }

      // Enviar mensagem inicial se fornecida
      if (data.initialMessage) {
        setTimeout(() => sendMessage(data.initialMessage!), 500)
      }

      return newChat
    } catch (err) {
      setError("Erro ao criar chat externo")
      toast.error("Erro ao criar chat externo")
      throw err
    } finally {
      setLoading(false)
    }
  }, [sendMessage])

  // Autenticar cliente externo
  const authenticateClient = useCallback(async (data: ClientAuthForm, chatId: string) => {
    setLoading(true)
    
    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 1000))

      const chat = chats.find(c => c.id === chatId)
      
      if (!chat || chat.clientEmail !== data.email || chat.clientDocumentDigits !== data.documentDigits) {
        throw new Error("Acesso negado. Verifique seus dados.")
      }

      toast.success("Autenticado com sucesso!")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro na autenticação"
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [chats])

  // Encerrar chat
  const closeChat = useCallback(async (chatId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, status: "closed" }
          : chat
      ))

      if (selectedChatId === chatId) {
        setSelectedChatId(null)
        setMessages([])
      }

      toast.success("Chat encerrado com sucesso")
    } catch (err) {
      setError("Erro ao encerrar chat")
      toast.error("Erro ao encerrar chat")
    } finally {
      setLoading(false)
    }
  }, [selectedChatId])

  // Indicador de digitação
  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (!selectedChatId) return

    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Simular envio de indicador
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false)
      }, 3000)
    }
  }, [selectedChatId])

  // Buscar conversas
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      chat.participants.some(p => 
        p.name.toLowerCase().includes(query) || 
        p.email.toLowerCase().includes(query)
      ) ||
      chat.lastMessage?.content?.toLowerCase().includes(query)
    )
  })

  return {
    chats: filteredChats,
    selectedChatId,
    messages,
    loading,
    error,
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
  }
}