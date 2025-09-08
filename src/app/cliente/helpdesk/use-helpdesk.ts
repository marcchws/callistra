"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { 
  Ticket, 
  TicketStatus, 
  TicketStatusType,
  Message,
  Attachment,
  NewTicketData,
  MessageData,
  SearchData 
} from "./types"

// Dados mockados para demonstração
const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    clientName: "João Silva",
    clientEmail: "joao@email.com",
    subject: "Dúvida sobre processo 2025/001",
    description: "Preciso de informações sobre o andamento do processo e próximas etapas.",
    status: TicketStatus.ABERTO,
    messages: [
      {
        id: "msg1",
        ticketId: "1",
        content: "Olá! Vi que há uma audiência marcada, podem confirmar a data?",
        senderId: "client1",
        senderName: "João Silva",
        senderType: "cliente",
        attachments: [],
        createdAt: new Date("2025-09-04T10:00:00"),
        read: true,
      }
    ],
    createdAt: new Date("2025-09-04T09:00:00"),
    updatedAt: new Date("2025-09-04T10:00:00"),
    unreadCount: 1,
  },
  {
    id: "2",
    clientName: "Maria Santos",
    clientEmail: "maria@email.com",
    subject: "Documentação pendente",
    description: "Preciso enviar documentos adicionais para o processo.",
    status: TicketStatus.EM_ATENDIMENTO,
    messages: [
      {
        id: "msg2",
        ticketId: "2",
        content: "Boa tarde! Estou enviando os documentos solicitados em anexo.",
        senderId: "client2",
        senderName: "Maria Santos",
        senderType: "cliente",
        attachments: [
          {
            id: "att1",
            name: "documento.pdf",
            url: "/attachments/documento.pdf",
            size: 1024000,
            type: "application/pdf",
            uploadedAt: new Date("2025-09-03T14:00:00"),
          }
        ],
        createdAt: new Date("2025-09-03T14:00:00"),
        read: true,
      },
      {
        id: "msg3",
        ticketId: "2",
        content: "Documentos recebidos! Vamos analisar e retornamos em breve.",
        senderId: "att1",
        senderName: "Dr. Carlos",
        senderType: "atendente",
        attachments: [],
        createdAt: new Date("2025-09-03T15:00:00"),
        read: false,
      }
    ],
    createdAt: new Date("2025-09-03T13:00:00"),
    updatedAt: new Date("2025-09-03T15:00:00"),
    attendantId: "att1",
    attendantName: "Dr. Carlos",
    unreadCount: 0,
  },
  {
    id: "3",
    clientName: "Pedro Oliveira",
    clientEmail: "pedro@email.com",
    subject: "Urgente: Prazo processual",
    description: "Preciso de orientação sobre prazo que vence amanhã.",
    status: TicketStatus.RESOLVIDO,
    messages: [],
    createdAt: new Date("2025-09-02T08:00:00"),
    updatedAt: new Date("2025-09-02T12:00:00"),
    closedAt: new Date("2025-09-02T12:00:00"),
    unreadCount: 0,
  },
]

export function useHelpdesk() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({})

  // Filtrar tickets baseado em busca e status
  const filteredTickets = useCallback(() => {
    return tickets.filter(ticket => {
      const matchesSearch = searchQuery === "" || 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "todos" || ticket.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [tickets, searchQuery, statusFilter])

  // Criar novo ticket
  const createTicket = useCallback(async (data: NewTicketData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newTicket: Ticket = {
        id: String(Date.now()),
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        subject: data.subject,
        description: data.description,
        status: TicketStatus.ABERTO,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        unreadCount: 0,
      }
      
      // Se houver anexo inicial
      if (data.attachment) {
        newTicket.initialAttachment = {
          id: String(Date.now()),
          name: data.attachment.name,
          url: URL.createObjectURL(data.attachment),
          size: data.attachment.size,
          type: data.attachment.type,
          uploadedAt: new Date(),
        }
      }
      
      setTickets(prev => [newTicket, ...prev])
      toast.success("Ticket criado com sucesso!", {
        description: `Ticket #${newTicket.id} foi aberto`,
        duration: 2000,
        position: "bottom-right",
      })
      
      return newTicket
    } catch (err) {
      const errorMsg = "Erro ao criar ticket"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Enviar mensagem em um ticket
  const sendMessage = useCallback(async (ticketId: string, data: MessageData, senderType: "cliente" | "atendente") => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newMessage: Message = {
        id: String(Date.now()),
        ticketId,
        content: data.content,
        senderId: senderType === "cliente" ? "client" : "att",
        senderName: senderType === "cliente" ? "Cliente" : "Atendente",
        senderType,
        attachments: [],
        createdAt: new Date(),
        read: false,
      }
      
      // Processar anexos se houver
      if (data.attachments && data.attachments.length > 0) {
        newMessage.attachments = data.attachments.map((file: File) => ({
          id: String(Date.now() + Math.random()),
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        }))
      }
      
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          const updatedTicket = {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updatedAt: new Date(),
            status: ticket.status === TicketStatus.ABERTO ? TicketStatus.EM_ATENDIMENTO : ticket.status,
          }
          
          // Notificar sobre nova mensagem
          const recipient = senderType === "cliente" ? "atendente" : "cliente"
          toast.success("Mensagem enviada", {
            description: `Nova mensagem para o ${recipient}`,
            duration: 2000,
            position: "bottom-right",
          })
          
          return updatedTicket
        }
        return ticket
      }))
      
      return newMessage
    } catch (err) {
      const errorMsg = "Erro ao enviar mensagem"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Alterar status do ticket
  const updateTicketStatus = useCallback(async (ticketId: string, newStatus: TicketStatusType) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTickets(prev => prev.map(ticket => {
        if (ticket.id === ticketId) {
          const updatedTicket = {
            ...ticket,
            status: newStatus,
            updatedAt: new Date(),
          }
          
          if (newStatus === TicketStatus.FECHADO) {
            updatedTicket.closedAt = new Date()
            toast.success("Ticket fechado", {
              description: "O cliente foi notificado sobre o encerramento",
              duration: 2000,
              position: "bottom-right",
            })
          } else if (newStatus === TicketStatus.ABERTO && ticket.status === TicketStatus.FECHADO) {
            updatedTicket.reopenedAt = new Date()
            toast.success("Ticket reaberto", {
              description: "O atendente foi notificado",
              duration: 2000,
              position: "bottom-right",
            })
          }
          
          return updatedTicket
        }
        return ticket
      }))
    } catch (err) {
      const errorMsg = "Erro ao atualizar status"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Marcar mensagens como lidas
  const markMessagesAsRead = useCallback((ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: ticket.messages.map(msg => ({ ...msg, read: true })),
          unreadCount: 0,
        }
      }
      return ticket
    }))
  }, [])

  // Simular indicador de digitação
  const setTypingIndicator = useCallback((ticketId: string, typing: boolean) => {
    setIsTyping(prev => ({ ...prev, [ticketId]: typing }))
    
    // Auto remover indicador após 3 segundos
    if (typing) {
      setTimeout(() => {
        setIsTyping(prev => ({ ...prev, [ticketId]: false }))
      }, 3000)
    }
  }, [])

  // Obter ticket por ID
  const getTicketById = useCallback((id: string) => {
    return tickets.find(ticket => ticket.id === id)
  }, [tickets])

  return {
    tickets: filteredTickets(),
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isTyping,
    createTicket,
    sendMessage,
    updateTicketStatus,
    markMessagesAsRead,
    setTypingIndicator,
    getTicketById,
  }
}
