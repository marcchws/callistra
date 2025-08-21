"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { 
  Ticket, 
  TicketInteraction, 
  CreateTicketFormData, 
  MessageTicketFormData,
  HelpdeskState,
  TicketSearchFormData
} from "./types"

// Mock data para demonstração - baseado nos cenários de uso especificados
const mockTickets: Ticket[] = [
  {
    id: "1",
    nomeCliente: "Maria Silva",
    emailCliente: "maria.silva@email.com",
    motivoSuporte: "Problema com acesso ao sistema",
    descricao: "Não consigo fazer login na minha conta há 2 dias",
    status: "aberto",
    dataHoraAbertura: new Date(2024, 0, 15, 9, 30),
    historicoInteracoes: [],
    createdAt: new Date(2024, 0, 15, 9, 30),
    updatedAt: new Date(2024, 0, 15, 9, 30)
  },
  {
    id: "2", 
    nomeCliente: "João Santos",
    emailCliente: "joao.santos@empresa.com",
    motivoSuporte: "Dúvida sobre funcionalidade",
    descricao: "Como faço para anexar documentos nos processos?",
    status: "em_atendimento",
    dataHoraAbertura: new Date(2024, 0, 14, 14, 15),
    historicoInteracoes: [],
    createdAt: new Date(2024, 0, 14, 14, 15),
    updatedAt: new Date(2024, 0, 15, 10, 45)
  }
]

const mockInteractions: Record<string, TicketInteraction[]> = {
  "1": [
    {
      id: "1",
      ticketId: "1",
      senderId: "maria-id",
      senderName: "Maria Silva",
      senderType: "cliente",
      content: "Não consigo fazer login na minha conta há 2 dias",
      type: "text",
      timestamp: new Date(2024, 0, 15, 9, 30),
      isRead: true
    }
  ],
  "2": [
    {
      id: "2",
      ticketId: "2", 
      senderId: "joao-id",
      senderName: "João Santos",
      senderType: "cliente",
      content: "Como faço para anexar documentos nos processos?",
      type: "text",
      timestamp: new Date(2024, 0, 14, 14, 15),
      isRead: true
    },
    {
      id: "3",
      ticketId: "2",
      senderId: "atendente-1",
      senderName: "Ana Suporte",
      senderType: "atendente", 
      content: "Olá João! Para anexar documentos, acesse o processo e clique em 'Anexar Arquivo'. Posso te ajudar com mais alguma coisa?",
      type: "text",
      timestamp: new Date(2024, 0, 15, 10, 45),
      isRead: false
    }
  ]
}

export function useHelpdesk() {
  const [state, setState] = useState<HelpdeskState>({
    tickets: mockTickets,
    selectedTicket: null,
    interactions: mockInteractions,
    loading: false,
    error: null,
    searchTerm: "",
    statusFilter: "todos",
    motivoFilter: ""
  })

  // Criar novo ticket - Cenário 1
  const createTicket = useCallback(async (data: CreateTicketFormData & { anexoInicial?: File }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newTicket: Ticket = {
        id: String(Date.now()),
        nomeCliente: data.nomeCliente,
        emailCliente: data.emailCliente,
        motivoSuporte: data.motivoSuporte,
        descricao: data.descricao,
        anexoInicial: data.anexoInicial?.name,
        status: "aberto",
        dataHoraAbertura: new Date(),
        historicoInteracoes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Criar interação inicial com a descrição
      const initialInteraction: TicketInteraction = {
        id: String(Date.now()),
        ticketId: newTicket.id,
        senderId: "cliente-id",
        senderName: data.nomeCliente,
        senderType: "cliente",
        content: data.descricao,
        type: "text",
        timestamp: new Date(),
        isRead: true
      }

      setState(prev => ({
        ...prev,
        tickets: [newTicket, ...prev.tickets],
        interactions: {
          ...prev.interactions,
          [newTicket.id]: [initialInteraction]
        },
        loading: false
      }))

      toast.success("Ticket criado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      return newTicket
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Erro ao criar ticket" 
      }))
      toast.error("Erro ao criar ticket", {
        duration: 3000,
        position: "bottom-right"
      })
      throw error
    }
  }, [])

  // Enviar mensagem no chat - Cenário 2
  const sendMessage = useCallback(async (ticketId: string, data: MessageTicketFormData & { file?: File }) => {
    if (!state.selectedTicket) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newInteraction: TicketInteraction = {
        id: String(Date.now()),
        ticketId,
        senderId: "user-id",
        senderName: "Atendente",
        senderType: "atendente",
        content: data.content,
        type: data.type,
        fileName: data.file?.name,
        fileSize: data.file?.size,
        timestamp: new Date(),
        isRead: false
      }

      setState(prev => ({
        ...prev,
        interactions: {
          ...prev.interactions,
          [ticketId]: [...(prev.interactions[ticketId] || []), newInteraction]
        },
        tickets: prev.tickets.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status: 'em_atendimento', updatedAt: new Date() }
            : ticket
        ),
        loading: false
      }))

      toast.success("Mensagem enviada!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao enviar mensagem", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [state.selectedTicket])

  // Alterar status do ticket - Cenário 7
  const updateTicketStatus = useCallback(async (ticketId: string, newStatus: Ticket['status']) => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        tickets: prev.tickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: newStatus, updatedAt: new Date() }
            : ticket
        ),
        selectedTicket: prev.selectedTicket?.id === ticketId 
          ? { ...prev.selectedTicket, status: newStatus, updatedAt: new Date() }
          : prev.selectedTicket,
        loading: false
      }))

      toast.success(`Ticket ${newStatus === 'fechado' ? 'fechado' : 'atualizado'} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao atualizar status", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // Buscar tickets - Cenário 5
  const searchTickets = useCallback((filters: TicketSearchFormData) => {
    setState(prev => ({
      ...prev,
      searchTerm: filters.searchTerm || "",
      statusFilter: filters.status,
      motivoFilter: filters.motivo || ""
    }))
  }, [])

  // Selecionar ticket - Cenário 6
  const selectTicket = useCallback((ticket: Ticket) => {
    setState(prev => ({ ...prev, selectedTicket: ticket }))
  }, [])

  // Filtrar tickets baseado nos filtros atuais
  const filteredTickets = state.tickets.filter(ticket => {
    const matchesSearch = !state.searchTerm || 
      ticket.nomeCliente.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      ticket.motivoSuporte.toLowerCase().includes(state.searchTerm.toLowerCase())
    
    const matchesStatus = state.statusFilter === 'todos' || ticket.status === state.statusFilter
    
    const matchesMotivo = !state.motivoFilter || 
      ticket.motivoSuporte.toLowerCase().includes(state.motivoFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesMotivo
  })

  return {
    ...state,
    filteredTickets,
    createTicket,
    sendMessage,
    updateTicketStatus,
    searchTickets,
    selectTicket
  }
}
