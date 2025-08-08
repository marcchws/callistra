"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { 
  Alert, 
  AlertConfiguration, 
  AlertFilters, 
  AlertStatistics,
  AlertType,
  AlertChannel,
  AlertStatus 
} from "../types"

// Mock data para demonstração
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "contas_a_vencer",
    channel: "ambos",
    message: "Conta do cliente João Silva vence em 3 dias",
    eventDateTime: new Date(),
    status: "pendente",
    recipientUserId: "user1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2", 
    type: "movimentacao_processos",
    channel: "sistema",
    message: "Processo 123456 teve nova movimentação",
    eventDateTime: new Date(),
    status: "lido",
    recipientUserId: "user1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    type: "chat_interno",
    channel: "sistema",
    message: "Nova mensagem de Maria Santos",
    eventDateTime: new Date(),
    status: "enviado",
    recipientUserId: "user1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    type: "confidencialidade",
    channel: "email",
    message: "Confidencialidade adicionada ao cliente Pedro Costa",
    eventDateTime: new Date(),
    status: "lido",
    recipientUserId: "user1",
    confidentialityLinked: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    type: "prazos_atividades",
    channel: "ambos",
    message: "Prazo para petição inicial vence amanhã",
    eventDateTime: new Date(),
    status: "pendente",
    recipientUserId: "user1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockConfigurations: AlertConfiguration[] = [
  {
    userId: "user1",
    alertType: "confidencialidade",
    channel: "ambos",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "contas_a_vencer",
    channel: "sistema",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "movimentacao_processos",
    channel: "email",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "chat_interno",
    channel: "sistema",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "chat_cliente",
    channel: "ambos",
    enabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "prazos_atividades",
    channel: "sistema",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "user1",
    alertType: "agendas",
    channel: "email",
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export function useAlerts() {
  // Estados defensivos sempre
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [configurations, setConfigurations] = useState<AlertConfiguration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AlertFilters>({})

  // Simulação de carregamento inicial
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setAlerts(mockAlerts)
        setConfigurations(mockConfigurations)
      } catch (err) {
        setError("Erro ao carregar alertas")
        toast.error("Erro ao carregar alertas")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtros aplicados
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filters.type && alert.type !== filters.type) return false
      if (filters.status && alert.status !== filters.status) return false
      if (filters.search && !alert.message.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.startDate && alert.eventDateTime < filters.startDate) return false
      if (filters.endDate && alert.eventDateTime > filters.endDate) return false
      return true
    })
  }, [alerts, filters])

  // Estatísticas calculadas
  const statistics: AlertStatistics = useMemo(() => {
    const stats = {
      total: filteredAlerts.length,
      pending: 0,
      read: 0,
      unread: 0,
      byType: {} as Record<AlertType, number>
    }

    filteredAlerts.forEach(alert => {
      if (alert.status === "pendente") stats.pending++
      if (alert.status === "lido") stats.read++
      if (alert.status !== "lido") stats.unread++
      
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1
    })

    return stats
  }, [filteredAlerts])

  // Atualizar configuração de alerta
  const updateConfiguration = async (alertType: AlertType, channel: AlertChannel, enabled: boolean) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setConfigurations(prev => 
        prev.map(config => 
          config.alertType === alertType
            ? { ...config, channel, enabled, updatedAt: new Date() }
            : config
        )
      )
      
      toast.success("Configuração atualizada com sucesso!")
    } catch (err) {
      setError("Erro ao atualizar configuração")
      toast.error("Erro ao atualizar configuração")
    } finally {
      setLoading(false)
    }
  }

  // Marcar alerta como lido
  const markAsRead = async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "lido" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      
      toast.success("Alerta marcado como lido")
    } catch (err) {
      toast.error("Erro ao marcar alerta como lido")
    }
  }

  // Arquivar alerta
  const archiveAlert = async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "arquivado" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      
      toast.success("Alerta arquivado")
    } catch (err) {
      toast.error("Erro ao arquivar alerta")
    }
  }

  // Marcar múltiplos alertas como lidos
  const markMultipleAsRead = async (alertIds: string[]) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAlerts(prev => 
        prev.map(alert => 
          alertIds.includes(alert.id) 
            ? { ...alert, status: "lido" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      
      toast.success(`${alertIds.length} alertas marcados como lidos`)
    } catch (err) {
      toast.error("Erro ao marcar alertas como lidos")
    } finally {
      setLoading(false)
    }
  }

  return {
    // Data
    alerts: filteredAlerts,
    configurations,
    statistics,
    
    // States
    loading,
    error,
    filters,
    
    // Actions
    setFilters,
    updateConfiguration,
    markAsRead,
    archiveAlert,
    markMultipleAsRead,
    
    // Computed
    unreadCount: statistics.unread
  }
}
