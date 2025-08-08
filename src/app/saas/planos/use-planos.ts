"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plano, PlanoFormData, PlanoFilters, PlanoOperationResult } from "./types"

// HOOK PERSONALIZADO - BASEADO NOS REQUIREMENTS MATRIX
export function usePlanos() {
  // ESTADOS DEFENSIVOS SEMPRE
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // CARREGAR DADOS INICIAIS
  useEffect(() => {
    loadPlanos()
  }, [])

  const loadPlanos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulação de dados para demonstração - baseados nos requisitos
      const mockPlanos: Plano[] = [
        {
          id: "1",
          nome: "Plano Básico",
          descricao: "Ideal para escritórios pequenos com funcionalidades essenciais",
          precoMensal: 89.90,
          precoAnual: 899.00,
          ativo: true,
          limitacoes: {
            maxUsuarios: 3,
            maxProcessos: 100,
            storageGB: 5
          },
          recursos: {
            gestaoUsuarios: true,
            gestaoClientes: true,
            gestaoProcessos: true,
            agenda: false,
            contratos: false,
            tarefas: false,
            chatInterno: false,
            helpdesk: false,
            financeiro: false,
            relatorios: false
          },
          dataCriacao: "2024-01-15",
          dataAtualizacao: "2024-01-15"
        },
        {
          id: "2",
          nome: "Plano Profissional",
          descricao: "Para escritórios médios com recursos avançados de gestão",
          precoMensal: 179.90,
          precoAnual: 1799.00,
          ativo: true,
          limitacoes: {
            maxUsuarios: 10,
            maxProcessos: 500,
            storageGB: 20
          },
          recursos: {
            gestaoUsuarios: true,
            gestaoClientes: true,
            gestaoProcessos: true,
            agenda: true,
            contratos: true,
            tarefas: true,
            chatInterno: false,
            helpdesk: false,
            financeiro: true,
            relatorios: true
          },
          dataCriacao: "2024-01-15",
          dataAtualizacao: "2024-02-10"
        },
        {
          id: "3",
          nome: "Plano Enterprise",
          descricao: "Solução completa para grandes escritórios com todos os recursos",
          precoMensal: 349.90,
          precoAnual: 3499.00,
          ativo: true,
          limitacoes: {
            maxUsuarios: 50,
            maxProcessos: 2000,
            storageGB: 100
          },
          recursos: {
            gestaoUsuarios: true,
            gestaoClientes: true,
            gestaoProcessos: true,
            agenda: true,
            contratos: true,
            tarefas: true,
            chatInterno: true,
            helpdesk: true,
            financeiro: true,
            relatorios: true
          },
          dataCriacao: "2024-01-15",
          dataAtualizacao: "2024-03-05"
        }
      ]
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      setPlanos(mockPlanos)
      
    } catch (err) {
      const errorMessage = "Erro ao carregar planos"
      setError(errorMessage)
      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  const createPlano = async (data: PlanoFormData): Promise<PlanoOperationResult> => {
    try {
      setLoading(true)
      setError(null)

      // Simular criação - baseado nos acceptance criteria
      const novoPlano: Plano = {
        id: Date.now().toString(),
        nome: data.nome,
        descricao: data.descricao,
        precoMensal: data.precoMensal,
        precoAnual: data.precoAnual,
        ativo: data.ativo,
        limitacoes: data.limitacoes,
        recursos: data.recursos,
        dataCriacao: new Date().toISOString().split('T')[0],
        dataAtualizacao: new Date().toISOString().split('T')[0]
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPlanos(prev => [...prev, novoPlano])
      
      toast.success("Plano criado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return {
        success: true,
        message: "Plano criado com sucesso",
        data: novoPlano
      }
      
    } catch (err) {
      const errorMessage = "Erro ao criar plano"
      setError(errorMessage)
      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const updatePlano = async (id: string, data: PlanoFormData): Promise<PlanoOperationResult> => {
    try {
      setLoading(true)
      setError(null)

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPlanos(prev => prev.map(plano => 
        plano.id === id 
          ? {
              ...plano,
              nome: data.nome,
              descricao: data.descricao,
              precoMensal: data.precoMensal,
              precoAnual: data.precoAnual,
              ativo: data.ativo,
              limitacoes: data.limitacoes,
              recursos: data.recursos,
              dataAtualizacao: new Date().toISOString().split('T')[0]
            }
          : plano
      ))
      
      toast.success("Plano atualizado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return {
        success: true,
        message: "Plano atualizado com sucesso"
      }
      
    } catch (err) {
      const errorMessage = "Erro ao atualizar plano"
      setError(errorMessage)
      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string): Promise<PlanoOperationResult> => {
    try {
      setLoading(true)
      setError(null)

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Encontrar plano antes de alterar estado
      const plano = planos.find(p => p.id === id)
      const message = plano?.ativo ? "Plano desativado" : "Plano ativado"
      
      setPlanos(prev => prev.map(plano => 
        plano.id === id 
          ? {
              ...plano,
              ativo: !plano.ativo,
              dataAtualizacao: new Date().toISOString().split('T')[0]
            }
          : plano
      ))
      
      toast.success(message, { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return {
        success: true,
        message
      }
      
    } catch (err) {
      const errorMessage = "Erro ao alterar status do plano"
      setError(errorMessage)
      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const deletePlano = async (id: string): Promise<PlanoOperationResult> => {
    try {
      setLoading(true)
      setError(null)

      // Simular verificação se plano pode ser excluído
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simular regra de negócio: não permite excluir se houver clientes vinculados
      const plano = planos.find(p => p.id === id)
      if (plano && ["1", "2"].includes(id)) {
        throw new Error("Não é possível excluir plano com clientes vinculados")
      }
      
      setPlanos(prev => prev.filter(plano => plano.id !== id))
      
      toast.success("Plano excluído com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return {
        success: true,
        message: "Plano excluído com sucesso"
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir plano"
      setError(errorMessage)
      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  // FILTROS PARA LISTAGEM - baseados nos requirements
  const filtrarPlanos = (filters: PlanoFilters) => {
    return planos.filter(plano => {
      const matchBusca = !filters.busca || 
        plano.nome.toLowerCase().includes(filters.busca.toLowerCase()) ||
        plano.descricao.toLowerCase().includes(filters.busca.toLowerCase())
      
      const matchStatus = filters.status === 'todos' || 
        (filters.status === 'ativo' && plano.ativo) ||
        (filters.status === 'inativo' && !plano.ativo)
      
      const matchPrecoMin = !filters.precoMin || plano.precoMensal >= filters.precoMin
      const matchPrecoMax = !filters.precoMax || plano.precoMensal <= filters.precoMax
      
      return matchBusca && matchStatus && matchPrecoMin && matchPrecoMax
    })
  }

  return {
    planos,
    loading,
    error,
    createPlano,
    updatePlano,
    toggleStatus,
    deletePlano,
    filtrarPlanos,
    loadPlanos
  }
}
