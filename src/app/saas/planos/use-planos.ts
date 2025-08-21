"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Plano, PlanoFormData, PlanoFilters, PlanoState } from "./types"

// Hook para gerenciamento de planos seguindo Requirements Lock
export function usePlanos() {
  // Estados defensivos sempre
  const [state, setState] = useState<PlanoState>({
    planos: [],
    loading: false,
    error: null,
    filters: {},
    selectedPlano: null,
    showForm: false,
    showDeleteDialog: false
  })

  // Dados mockados para demonstração (seguindo exatamente os campos especificados)
  const planosIniciais: Plano[] = [
    {
      id: "1",
      nome: "Free",
      status: "ativo",
      valor: 0,
      formaPagamento: "Gratuito",
      descricao: "Plano gratuito para teste com funcionalidades básicas",
      periodoFree: 30,
      quantidadeUsuarios: 2,
      quantidadeProcessos: 10,
      quantidadeTokensMensais: 100,
      diasInadimplencia: 0,
      diasBloqueio: 0,
      visivelSite: true,
      planoRecomendado: false,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15")
    },
    {
      id: "2", 
      nome: "Standard",
      status: "ativo",
      vigencia: new Date("2024-12-31"),
      valor: 299.90,
      formaPagamento: "Mensal à vista",
      descricao: "Plano Standard mensal para até 10 usuários",
      periodoFree: 15,
      quantidadeUsuarios: 10,
      quantidadeProcessos: 100,
      quantidadeTokensMensais: 1000,
      diasInadimplencia: 5,
      diasBloqueio: 15,
      visivelSite: true,
      planoRecomendado: true,
      valorComDesconto: 249.90,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-15")
    },
    {
      id: "3",
      nome: "Premium",
      status: "ativo", 
      valor: 2999.90,
      formaPagamento: "Anual, 12x no cartão",
      descricao: "Plano Premium anual para até 50 usuários",
      periodoFree: 30,
      quantidadeUsuarios: 50,
      quantidadeProcessos: 1000,
      quantidadeTokensMensais: 5000,
      diasInadimplencia: 7,
      diasBloqueio: 21,
      visivelSite: true,
      planoRecomendado: false,
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-02-10")
    },
    {
      id: "4",
      nome: "Enterprise",
      status: "inativo",
      valor: 9999.90,
      formaPagamento: "Anual à vista",
      descricao: "Plano Enterprise para usuários ilimitados - DESCONTINUADO",
      periodoFree: 45,
      quantidadeUsuarios: 999,
      quantidadeProcessos: 9999,
      quantidadeTokensMensais: 50000,
      diasInadimplencia: 10,
      diasBloqueio: 30,
      visivelSite: false,
      planoRecomendado: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-03-01")
    }
  ]

  // Carregar planos iniciais
  useEffect(() => {
    setState(prev => ({ ...prev, planos: planosIniciais }))
  }, [])

  // Filtrar planos baseado nos critérios especificados
  const planosFiltrados = state.planos.filter(plano => {
    // Filtro por nome do plano
    if (state.filters.nome) {
      if (!plano.nome.toLowerCase().includes(state.filters.nome.toLowerCase())) {
        return false
      }
    }

    // Filtro por status do plano
    if (state.filters.status && state.filters.status !== "todos") {
      if (plano.status !== state.filters.status) {
        return false
      }
    }

    // Filtro por vigência do plano
    if (state.filters.vigencia && state.filters.vigencia !== "todos") {
      const hoje = new Date()
      const temVigencia = plano.vigencia

      if (state.filters.vigencia === "vigente") {
        if (!temVigencia || temVigencia < hoje) return false
      } else if (state.filters.vigencia === "expirado") {
        if (!temVigencia || temVigencia >= hoje) return false
      }
    }

    return true
  })

  // CENÁRIO 1 & 2: Criar novo plano com validação
  const criarPlano = useCallback(async (data: PlanoFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Se marcar como recomendado, desmarcar outros (regra de negócio)
      if (data.planoRecomendado) {
        setState(prev => ({
          ...prev,
          planos: prev.planos.map(p => ({ ...p, planoRecomendado: false }))
        }))
      }

      const novoPlano: Plano = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setState(prev => ({
        ...prev,
        planos: [...prev.planos, novoPlano],
        loading: false,
        showForm: false
      }))

      // CENÁRIO 1: Mensagem "Plano criado com sucesso"
      toast.success("Plano criado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao criar plano"
      }))

      toast.error("Erro ao criar plano.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // CENÁRIO 3: Editar plano existente
  const editarPlano = useCallback(async (id: string, data: PlanoFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Se marcar como recomendado, desmarcar outros
      if (data.planoRecomendado) {
        setState(prev => ({
          ...prev,
          planos: prev.planos.map(p => ({ ...p, planoRecomendado: false }))
        }))
      }

      setState(prev => ({
        ...prev,
        planos: prev.planos.map(plano =>
          plano.id === id
            ? { ...plano, ...data, updatedAt: new Date() }
            : plano
        ),
        loading: false,
        showForm: false,
        selectedPlano: null
      }))

      // CENÁRIO 3: Mensagem "Plano atualizado com sucesso"
      toast.success("Plano atualizado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao atualizar plano"
      }))

      toast.error("Erro ao atualizar plano.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // CENÁRIO 4: Desativar/Ativar plano
  const alterarStatusPlano = useCallback(async (id: string, novoStatus: "ativo" | "inativo") => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        planos: prev.planos.map(plano =>
          plano.id === id
            ? { ...plano, status: novoStatus, updatedAt: new Date() }
            : plano
        ),
        loading: false
      }))

      // CENÁRIO 4: Mensagem "Plano desativado/ativado com sucesso"
      const acao = novoStatus === "ativo" ? "ativado" : "desativado"
      toast.success(`Plano ${acao} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao alterar status do plano.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // CENÁRIO 5 & 6: Excluir plano com validação de assinantes
  const excluirPlano = useCallback(async (id: string) => {
    // Verificar se plano tem assinantes ativos (simulação)
    const plano = state.planos.find(p => p.id === id)
    if (!plano) return

    // CENÁRIO 6: Simular planos com assinantes (Standard e Premium têm assinantes)
    const temAssinantes = ["2", "3"].includes(id)
    
    if (temAssinantes) {
      // CENÁRIO 6: Mensagem "Não é possível excluir plano com assinantes ativos"
      toast.error("Não é possível excluir plano com assinantes ativos", {
        duration: 3000,
        position: "bottom-right"
      })
      setState(prev => ({ ...prev, showDeleteDialog: false }))
      return
    }

    setState(prev => ({ ...prev, loading: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        planos: prev.planos.filter(plano => plano.id !== id),
        loading: false,
        showDeleteDialog: false
      }))

      // CENÁRIO 5: Mensagem "Plano excluído com sucesso"
      toast.success("Plano excluído com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao excluir plano.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [state.planos])

  // CENÁRIO 7: Controlar visibilidade no site
  const alterarVisibilidadeSite = useCallback(async (id: string, visivel: boolean) => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        planos: prev.planos.map(plano =>
          plano.id === id
            ? { ...plano, visivelSite: visivel, updatedAt: new Date() }
            : plano
        ),
        loading: false
      }))

      // CENÁRIO 7: Feedback sobre exibição no site
      const acao = visivel ? "exibido" : "removido"
      toast.success(`Plano ${acao} no site com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao alterar visibilidade no site.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // CENÁRIO 8: Marcar plano como recomendado
  const alterarPlanoRecomendado = useCallback(async (id: string, recomendado: boolean) => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setState(prev => ({
        ...prev,
        planos: prev.planos.map(plano => ({
          ...plano,
          planoRecomendado: plano.id === id ? recomendado : false, // Apenas um pode ser recomendado
          updatedAt: new Date()
        })),
        loading: false
      }))

      // CENÁRIO 8: Feedback sobre plano recomendado
      const acao = recomendado ? "marcado como recomendado" : "desmarcado como recomendado"
      toast.success(`Plano ${acao} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao alterar recomendação do plano.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // Aplicar filtros
  const aplicarFiltros = useCallback((filters: PlanoFilters) => {
    setState(prev => ({ ...prev, filters }))
  }, [])

  // Limpar filtros
  const limparFiltros = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} }))
  }, [])

  // Controles de UI
  const abrirFormulario = useCallback((plano?: Plano) => {
    setState(prev => ({
      ...prev,
      selectedPlano: plano || null,
      showForm: true
    }))
  }, [])

  const fecharFormulario = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedPlano: null,
      showForm: false
    }))
  }, [])

  const abrirDialogExclusao = useCallback((plano: Plano) => {
    setState(prev => ({
      ...prev,
      selectedPlano: plano,
      showDeleteDialog: true
    }))
  }, [])

  const fecharDialogExclusao = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedPlano: null,
      showDeleteDialog: false
    }))
  }, [])

  return {
    // Estados
    planos: planosFiltrados,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    selectedPlano: state.selectedPlano,
    showForm: state.showForm,
    showDeleteDialog: state.showDeleteDialog,

    // Ações CRUD
    criarPlano,
    editarPlano,
    excluirPlano,
    alterarStatusPlano,
    alterarVisibilidadeSite,
    alterarPlanoRecomendado,

    // Filtros
    aplicarFiltros,
    limparFiltros,

    // Controles UI
    abrirFormulario,
    fecharFormulario,
    abrirDialogExclusao,
    fecharDialogExclusao
  }
}
