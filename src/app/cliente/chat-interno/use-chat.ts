"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { 
  Chat, 
  ChatMessage, 
  ChatState, 
  CreateExternalChatFormData,
  MessageFormData,
  ExternalAccessFormData,
  WebSocketMessage 
} from "./types"

// Mock data para demonstração - em produção viria de API/WebSocket
const mockChats: Chat[] = [
  {
    id: "1",
    type: "internal",
    participants: [
      { id: "user1", name: "João Silva", email: "joao@callistra.com", type: "user" },
      { id: "user2", name: "Maria Santos", email: "maria@callistra.com", type: "user" }
    ],
    lastMessage: {
      id: "msg1",
      chatId: "1",
      senderId: "user2",
      senderName: "Maria Santos",
      content: "Podemos revisar o contrato hoje?",
      type: "text",
      timestamp: new Date(),
      isRead: false
    },
    unreadCount: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2", 
    type: "external",
    participants: [
      { id: "user1", name: "João Silva", email: "joao@callistra.com", type: "user" },
      { id: "client1", name: "Carlos Mendes", email: "carlos@email.com", type: "external_client" }
    ],
    lastMessage: {
      id: "msg2",
      chatId: "2",
      senderId: "client1",
      senderName: "Carlos Mendes",
      content: "Obrigado pelas informações!",
      type: "text",
      timestamp: new Date(Date.now() - 300000),
      isRead: true
    },
    unreadCount: 0,
    isActive: true,
    secureLink: "https://callistra.com/chat/secure/abc123",
    clientEmail: "carlos@email.com",
    clientDocumentDigits: "12345",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "msg1-1",
      chatId: "1",
      senderId: "user1",
      senderName: "João Silva",
      content: "Oi Maria, como está o processo do cliente X?",
      type: "text",
      timestamp: new Date(Date.now() - 600000),
      isRead: true
    },
    {
      id: "msg1-2",
      chatId: "1", 
      senderId: "user2",
      senderName: "Maria Santos",
      content: "Está em andamento. Preciso de alguns documentos.",
      type: "text",
      timestamp: new Date(Date.now() - 300000),
      isRead: true
    },
    {
      id: "msg1-3",
      chatId: "1",
      senderId: "user2", 
      senderName: "Maria Santos",
      content: "Podemos revisar o contrato hoje?",
      type: "text",
      timestamp: new Date(),
      isRead: false
    }
  ],
  "2": [
    {
      id: "msg2-1",
      chatId: "2",
      senderId: "user1", 
      senderName: "João Silva",
      content: "Olá Carlos, como posso ajudá-lo hoje?",
      type: "text",
      timestamp: new Date(Date.now() - 600000),
      isRead: true
    },
    {
      id: "msg2-2",
      chatId: "2",
      senderId: "client1",
      senderName: "Carlos Mendes", 
      content: "Gostaria de saber sobre o andamento do meu processo.",
      type: "text",
      timestamp: new Date(Date.now() - 400000),
      isRead: true
    },
    {
      id: "msg2-3",
      chatId: "2",
      senderId: "user1",
      senderName: "João Silva",
      content: "Seu processo está na fase de análise. Em breve teremos novidades.",
      type: "text", 
      timestamp: new Date(Date.now() - 350000),
      isRead: true
    },
    {
      id: "msg2-4",
      chatId: "2",
      senderId: "client1",
      senderName: "Carlos Mendes",
      content: "Obrigado pelas informações!",
      type: "text",
      timestamp: new Date(Date.now() - 300000),
      isRead: true
    }
  ]
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    chats: [],
    selectedChat: null,
    messages: {},
    loading: true,
    error: null,
    searchTerm: "",
    isConnected: false
  })

  const wsRef = useRef<WebSocket | null>(null)

  // Simular conexão WebSocket
  const connectWebSocket = useCallback(() => {
    // Em produção, conectaria ao WebSocket real
    // wsRef.current = new WebSocket('ws://localhost:8080/chat')
    
    // Simular conexão
    setTimeout(() => {
      setState(prev => ({ ...prev, isConnected: true }))
      toast.success("Conectado ao chat em tempo real", { duration: 2000 })
    }, 1000)
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }))
        
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setState(prev => ({
          ...prev,
          chats: mockChats,
          messages: mockMessages,
          loading: false
        }))
        
        connectWebSocket()
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: "Erro ao carregar conversas",
          loading: false
        }))
        toast.error("Erro ao carregar conversas")
      }
    }

    loadInitialData()
  }, [connectWebSocket])

  // Selecionar conversa
  const selectChat = useCallback((chat: Chat) => {
    setState(prev => ({ ...prev, selectedChat: chat }))
    
    // Marcar mensagens como lidas
    if (chat.unreadCount > 0) {
      setState(prev => ({
        ...prev,
        chats: prev.chats.map(c => 
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        )
      }))
    }
  }, [])

  // Enviar mensagem
  const sendMessage = useCallback(async (messageData: MessageFormData, file?: File) => {
    if (!state.selectedChat) return

    try {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        chatId: state.selectedChat.id,
        senderId: "user1", // Em produção, viria do contexto de usuário
        senderName: "Usuário Atual",
        content: messageData.content,
        type: messageData.type,
        fileName: file?.name,
        fileSize: file?.size,
        timestamp: new Date(),
        isRead: false
      }

      // Se for arquivo, simular upload
      if (file) {
        toast.success("Arquivo enviado com sucesso", { duration: 2000 })
      }

      // Atualizar estado
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [state.selectedChat!.id]: [
            ...(prev.messages[state.selectedChat!.id] || []),
            newMessage
          ]
        },
        chats: prev.chats.map(chat => 
          chat.id === state.selectedChat!.id 
            ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
            : chat
        )
      }))

      // Simular envio via WebSocket
      if (wsRef.current && state.isConnected) {
        const wsMessage: WebSocketMessage = {
          type: 'message',
          data: newMessage,
          chatId: state.selectedChat.id,
          timestamp: new Date()
        }
        // wsRef.current.send(JSON.stringify(wsMessage))
      }

      toast.success("Mensagem enviada", { duration: 1500 })
    } catch (error) {
      toast.error("Erro ao enviar mensagem")
    }
  }, [state.selectedChat, state.isConnected])

  // Criar chat com cliente externo
  const createExternalChat = useCallback(async (data: CreateExternalChatFormData) => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      // Gerar link seguro
      const secureLink = `https://callistra.com/chat/secure/${Math.random().toString(36).substr(2, 9)}`
      
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        type: "external",
        participants: [
          { id: "user1", name: "Usuário Atual", email: "usuario@callistra.com", type: "user" },
          { id: `client-${Date.now()}`, name: data.clientName, email: data.clientEmail, type: "external_client" }
        ],
        unreadCount: 0,
        isActive: true,
        secureLink,
        clientEmail: data.clientEmail,
        clientDocumentDigits: data.documentDigits,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setState(prev => ({
        ...prev,
        chats: [newChat, ...prev.chats],
        loading: false
      }))

      // Simular envio do link
      if (data.sendMethod === 'email') {
        toast.success(`Link enviado para ${data.clientEmail}`, { duration: 3000 })
      } else {
        toast.success("Link enviado via WhatsApp", { duration: 3000 })
      }

      return newChat
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao criar chat com cliente")
      throw error
    }
  }, [])

  // Buscar conversas
  const searchChats = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }, [])

  // Filtrar conversas baseado na busca
  const filteredChats = state.chats.filter(chat => {
    if (!state.searchTerm) return true
    
    const searchLower = state.searchTerm.toLowerCase()
    return (
      chat.participants.some(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
      ) ||
      chat.lastMessage?.content.toLowerCase().includes(searchLower)
    )
  })

  // Validar acesso de cliente externo
  const validateExternalAccess = useCallback(async (data: ExternalAccessFormData, chatId: string) => {
    try {
      const chat = state.chats.find(c => c.id === chatId && c.type === 'external')
      
      if (!chat) {
        throw new Error("Chat não encontrado")
      }

      if (chat.clientEmail !== data.email || chat.clientDocumentDigits !== data.documentDigits) {
        throw new Error("Acesso negado. Verifique seus dados.")
      }

      return chat
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro de validação")
      throw error
    }
  }, [state.chats])

  // Encerrar chat
  const closeChat = useCallback(async (chatId: string) => {
    try {
      setState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => 
          chat.id === chatId ? { ...chat, isActive: false } : chat
        ),
        selectedChat: prev.selectedChat?.id === chatId ? null : prev.selectedChat
      }))

      toast.success("Chat encerrado e movido para histórico", { duration: 2000 })
    } catch (error) {
      toast.error("Erro ao encerrar chat")
    }
  }, [])

  // Cleanup WebSocket
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    // State
    chats: filteredChats,
    selectedChat: state.selectedChat,
    messages: state.selectedChat ? state.messages[state.selectedChat.id] || [] : [],
    loading: state.loading,
    error: state.error,
    searchTerm: state.searchTerm,
    isConnected: state.isConnected,
    
    // Actions
    selectChat,
    sendMessage,
    createExternalChat,
    searchChats,
    validateExternalAccess,
    closeChat
  }
}