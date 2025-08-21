"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { 
  Ticket, 
  TicketStatus, 
  TicketFilters, 
  TicketInteraction,
  Attendant,
  UserAccessLevel 
} from './types'

// Hook customizado para gerenciar tickets
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [attendants, setAttendants] = useState<Attendant[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'todos',
    responsavel: 'todos',
    search: ''
  })

  // Simular usuário atual (em produção viria de contexto de auth)
  const currentUser = {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@callistra.com',
    accessLevel: 'total' as UserAccessLevel
  }

  // Carregar dados iniciais (mock)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock de atendentes
      const mockAttendants: Attendant[] = [
        { id: 'user-1', name: 'João Silva', email: 'joao@callistra.com', accessLevel: 'total', ticketsCount: 5 },
        { id: 'user-2', name: 'Maria Santos', email: 'maria@callistra.com', accessLevel: 'restrito', ticketsCount: 3 },
        { id: 'user-3', name: 'Pedro Costa', email: 'pedro@callistra.com', accessLevel: 'restrito', ticketsCount: 2 },
      ]

      // Mock de tickets
      const mockTickets: Ticket[] = [
        {
          id: 'TKT-001',
          cliente: 'Escritório Advocacia Silva',
          emailCliente: 'contato@advocaciasilva.com',
          motivo: 'Erro ao gerar relatório financeiro',
          descricao: 'O sistema não está gerando o relatório mensal de receitas e despesas. Aparece erro 500.',
          anexos: [],
          responsavel: 'João Silva',
          status: 'em_atendimento',
          historico: [
            {
              id: 'int-1',
              type: 'mensagem',
              content: 'Ticket aberto pelo cliente',
              author: 'Sistema',
              authorRole: 'sistema',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              id: 'int-2',
              type: 'mensagem',
              content: 'Estou analisando o problema. Parece ser um erro na geração do PDF.',
              author: 'João Silva',
              authorRole: 'atendente',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ],
          dataAbertura: new Date(Date.now() - 2 * 60 * 60 * 1000),
          ultimaAcao: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'TKT-002',
          cliente: 'Costa & Associados',
          emailCliente: 'suporte@costaassociados.com',
          motivo: 'Dúvida sobre configuração de permissões',
          descricao: 'Como configurar permissões diferentes para cada advogado? Preciso que alguns vejam apenas seus próprios processos.',
          anexos: [],
          responsavel: null,
          status: 'aberto',
          historico: [
            {
              id: 'int-3',
              type: 'mensagem',
              content: 'Ticket aberto pelo cliente',
              author: 'Sistema',
              authorRole: 'sistema',
              createdAt: new Date(Date.now() - 30 * 60 * 1000)
            }
          ],
          dataAbertura: new Date(Date.now() - 30 * 60 * 1000),
          ultimaAcao: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 'TKT-003',
          cliente: 'Martins Advogados',
          emailCliente: 'ti@martinsadvogados.com',
          motivo: 'Solicitação de nova funcionalidade',
          descricao: 'Gostaríamos de ter a opção de exportar os processos em formato Excel.',
          anexos: [],
          responsavel: 'Maria Santos',
          status: 'resolvido',
          historico: [
            {
              id: 'int-4',
              type: 'mensagem',
              content: 'Ticket aberto pelo cliente',
              author: 'Sistema',
              authorRole: 'sistema',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'int-5',
              type: 'mensagem',
              content: 'Funcionalidade já disponível no menu Relatórios > Exportar',
              author: 'Maria Santos',
              authorRole: 'atendente',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'int-6',
              type: 'mudanca_status',
              content: 'Status alterado para Resolvido',
              author: 'Maria Santos',
              authorRole: 'atendente',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
          ],
          dataAbertura: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          ultimaAcao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'TKT-004',
          cliente: 'Pereira & Partners',
          emailCliente: 'admin@pereiralegal.com',
          motivo: 'Sistema lento',
          descricao: 'O sistema está muito lento para carregar a lista de processos.',
          anexos: [],
          responsavel: 'Pedro Costa',
          status: 'em_atendimento',
          historico: [
            {
              id: 'int-7',
              type: 'mensagem',
              content: 'Ticket aberto pelo cliente',
              author: 'Sistema',
              authorRole: 'sistema',
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            {
              id: 'int-8',
              type: 'mensagem',
              content: 'Verificando performance do servidor',
              author: 'Pedro Costa',
              authorRole: 'atendente',
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            }
          ],
          dataAbertura: new Date(Date.now() - 4 * 60 * 60 * 1000),
          ultimaAcao: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: 'TKT-005',
          cliente: 'Oliveira Advocacia',
          emailCliente: 'contato@oliveiraadv.com',
          motivo: 'Não consigo fazer login',
          descricao: 'Esqueci minha senha e o link de recuperação não está funcionando.',
          anexos: [],
          responsavel: null,
          status: 'aberto',
          historico: [
            {
              id: 'int-9',
              type: 'mensagem',
              content: 'Ticket aberto pelo cliente',
              author: 'Sistema',
              authorRole: 'sistema',
              createdAt: new Date(Date.now() - 15 * 60 * 1000)
            }
          ],
          dataAbertura: new Date(Date.now() - 15 * 60 * 1000),
          ultimaAcao: new Date(Date.now() - 15 * 60 * 1000)
        }
      ]

      setAttendants(mockAttendants)
      setTickets(mockTickets)
      setLoading(false)
    }

    loadInitialData()
  }, [])

  // Filtrar tickets baseado em permissões e filtros
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Aplicar controle de acesso
    if (currentUser.accessLevel === 'restrito') {
      result = result.filter(ticket => 
        ticket.responsavel === null || 
        ticket.responsavel === currentUser.name
      )
    }

    // Aplicar filtros
    if (filters.status && filters.status !== 'todos') {
      result = result.filter(ticket => ticket.status === filters.status)
    }

    if (filters.responsavel) {
      if (filters.responsavel === 'sem_responsavel') {
        result = result.filter(ticket => ticket.responsavel === null)
      } else if (filters.responsavel !== 'todos') {
        result = result.filter(ticket => ticket.responsavel === filters.responsavel)
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(ticket => 
        ticket.cliente.toLowerCase().includes(searchLower) ||
        ticket.motivo.toLowerCase().includes(searchLower) ||
        ticket.descricao.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar por data de última ação (mais recente primeiro)
    result.sort((a, b) => b.ultimaAcao.getTime() - a.ultimaAcao.getTime())

    return result
  }, [tickets, filters, currentUser.accessLevel, currentUser.name])

  // Assumir responsabilidade de um ticket
  const assumeTicket = useCallback((ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId && ticket.responsavel === null) {
        const updatedTicket = {
          ...ticket,
          responsavel: currentUser.name,
          status: 'em_atendimento' as TicketStatus,
          ultimaAcao: new Date(),
          historico: [...ticket.historico, {
            id: `int-${Date.now()}`,
            type: 'mudanca_responsavel' as const,
            content: `Ticket assumido por ${currentUser.name}`,
            author: 'Sistema',
            authorRole: 'sistema' as const,
            createdAt: new Date()
          }]
        }
        
        toast.success('Você agora é responsável por este ticket', {
          duration: 2000,
          position: 'bottom-right'
        })
        
        return updatedTicket
      }
      return ticket
    }))
  }, [currentUser.name])

  // Trocar responsável (apenas admin)
  const changeResponsible = useCallback((ticketId: string, newResponsible: string) => {
    if (currentUser.accessLevel !== 'total') {
      toast.error('Apenas administradores podem trocar o responsável', {
        duration: 3000,
        position: 'bottom-right'
      })
      return
    }

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const oldResponsible = ticket.responsavel || 'Sem responsável'
        const updatedTicket = {
          ...ticket,
          responsavel: newResponsible,
          status: newResponsible ? 'em_atendimento' as TicketStatus : 'aberto' as TicketStatus,
          ultimaAcao: new Date(),
          historico: [...ticket.historico, {
            id: `int-${Date.now()}`,
            type: 'mudanca_responsavel' as const,
            content: `Responsável alterado de ${oldResponsible} para ${newResponsible}`,
            author: currentUser.name,
            authorRole: 'atendente' as const,
            createdAt: new Date()
          }]
        }
        
        toast.success('Responsável alterado com sucesso', {
          duration: 2000,
          position: 'bottom-right'
        })
        
        // Simular notificação ao novo responsável
        if (newResponsible && newResponsible !== currentUser.name) {
          setTimeout(() => {
            toast.info(`${newResponsible} foi notificado sobre o novo ticket`, {
              duration: 3000,
              position: 'bottom-right'
            })
          }, 500)
        }
        
        return updatedTicket
      }
      return ticket
    }))
  }, [currentUser.accessLevel, currentUser.name])

  // Alterar status do ticket
  const changeStatus = useCallback((ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = {
          ...ticket,
          status: newStatus,
          ultimaAcao: new Date(),
          historico: [...ticket.historico, {
            id: `int-${Date.now()}`,
            type: 'mudanca_status' as const,
            content: `Status alterado para ${newStatus}`,
            author: currentUser.name,
            authorRole: 'atendente' as const,
            createdAt: new Date()
          }]
        }
        
        toast.success('Status atualizado com sucesso', {
          duration: 2000,
          position: 'bottom-right'
        })
        
        return updatedTicket
      }
      return ticket
    }))
  }, [currentUser.name])

  // Adicionar interação ao ticket
  const addInteraction = useCallback((ticketId: string, message: string, attachments?: any[]) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const isFirstResponse = ticket.responsavel === null
        
        const interaction: TicketInteraction = {
          id: `int-${Date.now()}`,
          type: 'mensagem',
          content: message,
          attachments: attachments || [],
          author: currentUser.name,
          authorRole: 'atendente',
          createdAt: new Date()
        }
        
        const updatedTicket = {
          ...ticket,
          responsavel: isFirstResponse ? currentUser.name : ticket.responsavel,
          status: isFirstResponse ? 'em_atendimento' as TicketStatus : ticket.status,
          ultimaAcao: new Date(),
          historico: [...ticket.historico, interaction]
        }
        
        if (isFirstResponse) {
          updatedTicket.historico.push({
            id: `int-${Date.now()}-2`,
            type: 'mudanca_responsavel',
            content: `Ticket assumido automaticamente por ${currentUser.name} ao responder`,
            author: 'Sistema',
            authorRole: 'sistema',
            createdAt: new Date()
          })
          
          toast.success('Você agora é responsável por este ticket', {
            duration: 2000,
            position: 'bottom-right'
          })
        } else {
          toast.success('Mensagem enviada com sucesso', {
            duration: 2000,
            position: 'bottom-right'
          })
        }
        
        return updatedTicket
      }
      return ticket
    }))
  }, [currentUser.name])

  // Obter ticket por ID
  const getTicketById = useCallback((id: string) => {
    return tickets.find(ticket => ticket.id === id)
  }, [tickets])

  // Estatísticas dos tickets
  const stats = useMemo(() => {
    const total = tickets.length
    const abertos = tickets.filter(t => t.status === 'aberto').length
    const emAtendimento = tickets.filter(t => t.status === 'em_atendimento').length
    const resolvidos = tickets.filter(t => t.status === 'resolvido').length
    const fechados = tickets.filter(t => t.status === 'fechado').length
    const semResponsavel = tickets.filter(t => t.responsavel === null).length
    const meus = tickets.filter(t => t.responsavel === currentUser.name).length

    return {
      total,
      abertos,
      emAtendimento,
      resolvidos,
      fechados,
      semResponsavel,
      meus
    }
  }, [tickets, currentUser.name])

  return {
    tickets: filteredTickets,
    attendants,
    loading,
    filters,
    setFilters,
    currentUser,
    stats,
    assumeTicket,
    changeResponsible,
    changeStatus,
    addInteraction,
    getTicketById
  }
}