"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  Alert, 
  AlertPreferences, 
  AlertFilters, 
  AlertType, 
  AlertChannel,
  AlertStatus,
  ALERT_TYPE_LABELS 
} from "./types"

// Mock data para demonstração
const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    tipo: "contas_vencer",
    canal: "ambos",
    mensagem: "Conta de honorários vence em 3 dias - Cliente Silva & Associados",
    dataHoraEvento: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "pendente",
    usuarioDestinatario: "admin",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    tipo: "movimentacao_processos",
    canal: "sistema",
    mensagem: "Processo 001/2024 teve nova movimentação - Audiência marcada",
    dataHoraEvento: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "lido",
    usuarioDestinatario: "admin",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    tipo: "chat_cliente",
    canal: "email",
    mensagem: "Nova mensagem de João Silva sobre Processo 002/2024",
    dataHoraEvento: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "enviado",
    usuarioDestinatario: "admin",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: "4",
    tipo: "prazos_atividades",
    canal: "ambos",
    mensagem: "Prazo para entrega de petição vence amanhã - Processo 003/2024",
    dataHoraEvento: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "pendente",
    usuarioDestinatario: "admin",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: "5",
    tipo: "confidencialidade",
    canal: "sistema",
    mensagem: "Confidencialidade removida do Cliente Empresa XYZ",
    dataHoraEvento: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: "arquivado",
    usuarioDestinatario: "admin",
    confidencialidadeVinculada: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
]

const DEFAULT_PREFERENCES: AlertPreferences = {
  confidencialidade: "sistema",
  contas_vencer: "ambos",
  movimentacao_processos: "sistema",
  chat_interno: "sistema",
  chat_cliente: "ambos",
  prazos_atividades: "ambos",
  agendas: "sistema"
}

export function useAlerts() {
  // Estados defensivos sempre
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [preferences, setPreferences] = useState<AlertPreferences>(DEFAULT_PREFERENCES)
  const [filters, setFilters] = useState<AlertFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadAlerts()
    loadPreferences()
  }, [])

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      setAlerts(MOCK_ALERTS)
    } catch (err) {
      const errorMessage = "Erro ao carregar alertas"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPreferences = useCallback(async () => {
    try {
      const saved = localStorage.getItem("callistra_alert_preferences")
      if (saved) {
        setPreferences(JSON.parse(saved))
      }
    } catch (err) {
      console.error("Erro ao carregar preferências:", err)
    }
  }, [])

  const savePreferences = useCallback(async (newPreferences: AlertPreferences) => {
    setLoading(true)
    setError(null)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      localStorage.setItem("callistra_alert_preferences", JSON.stringify(newPreferences))
      setPreferences(newPreferences)
      
      toast.success("Preferências salvas com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao salvar preferências"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "lido" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      toast.success("Alerta marcado como lido", { duration: 2000 })
    } catch (err) {
      toast.error("Erro ao marcar alerta como lido", { duration: 3000 })
    }
  }, [])

  const archiveAlert = useCallback(async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "arquivado" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      toast.success("Alerta arquivado com sucesso", { duration: 2000 })
    } catch (err) {
      toast.error("Erro ao arquivar alerta", { duration: 3000 })
    }
  }, [])

  const unarchiveAlert = useCallback(async (alertId: string) => {
    try {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: "lido" as AlertStatus, updatedAt: new Date() }
            : alert
        )
      )
      toast.success("Alerta desarquivado com sucesso", { duration: 2000 })
    } catch (err) {
      toast.error("Erro ao desarquivar alerta", { duration: 3000 })
    }
  }, [])

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    if (filters.tipo && alert.tipo !== filters.tipo) return false
    if (filters.status && alert.status !== filters.status) return false
    if (filters.dataInicio && alert.dataHoraEvento < filters.dataInicio) return false
    if (filters.dataFim && alert.dataHoraEvento > filters.dataFim) return false
    if (filters.busca) {
      const searchTerm = filters.busca.toLowerCase()
      return (
        alert.mensagem.toLowerCase().includes(searchTerm) ||
        ALERT_TYPE_LABELS[alert.tipo].toLowerCase().includes(searchTerm)
      )
    }
    return true
  })

  // Contadores para badges
  const unreadCount = alerts.filter(alert => alert.status === "pendente" || alert.status === "enviado").length
  const totalCount = alerts.length

  return {
    // Dados
    alerts: filteredAlerts,
    preferences,
    filters,
    
    // Estados
    loading,
    error,
    
    // Contadores
    unreadCount,
    totalCount,
    
    // Ações
    loadAlerts,
    savePreferences,
    markAsRead,
    archiveAlert,
    unarchiveAlert,
    setFilters,
    
    // Utilitários
    clearFilters: () => setFilters({}),
    refreshAlerts: loadAlerts
  }
}