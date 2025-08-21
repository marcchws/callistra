"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Processo, ProcessoFormData, ProcessoFilters, ProcessoHistorico, ProcessosState } from "./types"

// Hook customizado para gestão de processos baseado nos requirements especificados
export function useProcessos() {
  const [state, setState] = useState<ProcessosState>({
    processos: [],
    filtros: {},
    loading: false,
    error: null,
    processoSelecionado: null,
    modalAberto: false,
    modoEdicao: false,
    historicoAberto: false
  })

  // Simular dados iniciais para prototipo
  const processosIniciais: Processo[] = [
    {
      id: "1",
      pasta: "2024/001",
      nomeCliente: "João Silva Santos",
      qualificacaoCliente: "autor",
      outrosEnvolvidos: "Maria Oliveira Lima",
      qualificacaoEnvolvidos: "reu",
      tituloProcesso: "Ação de Cobrança",
      instancia: "1-grau",
      numero: "5001234-56.2024.8.26.0001",
      juizo: "1ª Vara Cível",
      vara: "1ª Vara Cível",
      foro: "Foro Central",
      acao: "Ação de Cobrança",
      tribunal: "tjsp",
      linkTribunal: "https://esaj.tjsp.jus.br/cpopg/show.do?processo.numero=5001234-56.2024.8.26.0001",
      objeto: "Cobrança de valores devidos por contrato de prestação de serviços",
      valorCausa: 50000,
      distribuidoEm: new Date("2024-01-15"),
      valorCondenacao: 0,
      observacoes: "Processo em fase inicial de citação",
      dataModificacao: new Date("2024-01-20"),
      observacaoModificacao: "Citação realizada com sucesso",
      responsavel: "Dr. Carlos Mendes",
      honorarios: ["Contratual 10%", "Sucumbenciais"],
      acesso: "privado",
      criadoEm: new Date("2024-01-10"),
      atualizadoEm: new Date("2024-01-20"),
      criadoPor: "admin",
      atualizadoPor: "carlos.mendes"
    },
    {
      id: "2",
      pasta: "2024/002",
      nomeCliente: "Empresa XYZ Ltda",
      qualificacaoCliente: "reu",
      outrosEnvolvidos: "Banco ABC S.A.",
      qualificacaoEnvolvidos: "autor",
      tituloProcesso: "Ação Revisional de Contrato",
      instancia: "1-grau",
      numero: "5002345-67.2024.8.26.0002",
      juizo: "2ª Vara Empresarial",
      vara: "2ª Vara Empresarial",
      foro: "Foro Central",
      acao: "Ação Revisional",
      tribunal: "tjsp",
      responsavel: "Dra. Ana Paula",
      acesso: "publico",
      criadoEm: new Date("2024-01-12"),
      atualizadoEm: new Date("2024-01-22"),
      criadoPor: "admin",
      atualizadoPor: "ana.paula"
    }
  ]

  // Inicializar processos se vazio
  useState(() => {
    if (state.processos.length === 0) {
      setState(prev => ({ ...prev, processos: processosIniciais }))
    }
  })

  // Criar processo - AC1, AC6
  const criarProcesso = useCallback(async (data: ProcessoFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const novoProcesso: Processo = {
        id: Date.now().toString(),
        ...data,
        distribuidoEm: data.distribuidoEm,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        criadoPor: "usuario.atual",
        atualizadoPor: "usuario.atual"
      }

      setState(prev => ({
        ...prev,
        processos: [...prev.processos, novoProcesso],
        loading: false,
        modalAberto: false,
        modoEdicao: false
      }))

      // AC6: Mensagem de sucesso
      toast.success("Processo cadastrado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      // AC9: Registrar histórico para auditoria
      registrarHistorico({
        id: Date.now().toString(),
        processoId: novoProcesso.id,
        acao: 'criacao',
        valoresNovos: novoProcesso,
        usuario: "usuario.atual",
        dataHora: new Date(),
        observacoes: "Processo criado"
      })

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Erro ao cadastrar processo" 
      }))
      toast.error("Erro ao cadastrar processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // Editar processo - AC1, AC5, AC6
  const editarProcesso = useCallback(async (id: string, data: ProcessoFormData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => {
        const processoIndex = prev.processos.findIndex(p => p.id === id)
        if (processoIndex === -1) return prev

        const processoAntigo = prev.processos[processoIndex]
        const processoAtualizado: Processo = {
          ...processoAntigo,
          ...data,
          atualizadoEm: new Date(),
          atualizadoPor: "usuario.atual"
        }

        const novosProcessos = [...prev.processos]
        novosProcessos[processoIndex] = processoAtualizado

        // AC9: Registrar histórico
        registrarHistorico({
          id: Date.now().toString(),
          processoId: id,
          acao: 'edicao',
          valoresAnteriores: processoAntigo,
          valoresNovos: processoAtualizado,
          usuario: "usuario.atual",
          dataHora: new Date(),
          observacoes: "Processo atualizado"
        })

        return {
          ...prev,
          processos: novosProcessos,
          loading: false,
          modalAberto: false,
          modoEdicao: false,
          processoSelecionado: null
        }
      })

      // AC6: Mensagem de sucesso
      toast.success("Processo atualizado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Erro ao atualizar processo" 
      }))
      toast.error("Erro ao atualizar processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // Excluir processo - AC1, AC6
  const excluirProcesso = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => {
        const processo = prev.processos.find(p => p.id === id)
        if (!processo) return prev

        // AC9: Registrar histórico antes da exclusão
        registrarHistorico({
          id: Date.now().toString(),
          processoId: id,
          acao: 'exclusao',
          valoresAnteriores: processo,
          usuario: "usuario.atual",
          dataHora: new Date(),
          observacoes: "Processo excluído"
        })

        return {
          ...prev,
          processos: prev.processos.filter(p => p.id !== id),
          loading: false,
          processoSelecionado: null
        }
      })

      // AC6: Mensagem de sucesso
      toast.success("Processo excluído com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Erro ao excluir processo" 
      }))
      toast.error("Erro ao excluir processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }, [])

  // Buscar e filtrar processos - AC2, AC8
  const processosFiltrados = useMemo(() => {
    let resultado = state.processos

    // AC8: Filtros por campos pesquisáveis especificados
    if (state.filtros.pasta) {
      resultado = resultado.filter(p => 
        p.pasta?.toLowerCase().includes(state.filtros.pasta!.toLowerCase())
      )
    }

    if (state.filtros.nomeCliente) {
      resultado = resultado.filter(p => 
        p.nomeCliente.toLowerCase().includes(state.filtros.nomeCliente!.toLowerCase())
      )
    }

    if (state.filtros.outrosEnvolvidos) {
      resultado = resultado.filter(p => 
        p.outrosEnvolvidos.toLowerCase().includes(state.filtros.outrosEnvolvidos!.toLowerCase())
      )
    }

    if (state.filtros.vara) {
      resultado = resultado.filter(p => 
        p.vara?.toLowerCase().includes(state.filtros.vara!.toLowerCase())
      )
    }

    if (state.filtros.foro) {
      resultado = resultado.filter(p => 
        p.foro?.toLowerCase().includes(state.filtros.foro!.toLowerCase())
      )
    }

    if (state.filtros.acao) {
      resultado = resultado.filter(p => 
        p.acao?.toLowerCase().includes(state.filtros.acao!.toLowerCase())
      )
    }

    if (state.filtros.responsavel) {
      resultado = resultado.filter(p => 
        p.responsavel.toLowerCase().includes(state.filtros.responsavel!.toLowerCase())
      )
    }

    if (state.filtros.acesso && state.filtros.acesso !== 'todos') {
      resultado = resultado.filter(p => p.acesso === state.filtros.acesso)
    }

    if (state.filtros.instancia) {
      resultado = resultado.filter(p => p.instancia === state.filtros.instancia)
    }

    if (state.filtros.tribunal) {
      resultado = resultado.filter(p => p.tribunal === state.filtros.tribunal)
    }

    // AC7: Filtrar processos privados baseado em autorização
    // Simular controle de acesso
    return resultado.filter(processo => {
      if (processo.acesso === 'privado') {
        // Simular que usuário tem acesso apenas aos próprios processos
        return processo.responsavel === "Dr. Carlos Mendes" || processo.criadoPor === "usuario.atual"
      }
      return true
    })
  }, [state.processos, state.filtros])

  // Funções auxiliares para controle de estado
  const setFiltros = useCallback((filtros: ProcessoFilters) => {
    setState(prev => ({ ...prev, filtros }))
  }, [])

  const abrirModal = useCallback((processo?: Processo) => {
    setState(prev => ({
      ...prev,
      modalAberto: true,
      modoEdicao: !!processo,
      processoSelecionado: processo || null
    }))
  }, [])

  const fecharModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      modalAberto: false,
      modoEdicao: false,
      processoSelecionado: null
    }))
  }, [])

  const abrirHistorico = useCallback((processo: Processo) => {
    setState(prev => ({
      ...prev,
      historicoAberto: true,
      processoSelecionado: processo
    }))
  }, [])

  const fecharHistorico = useCallback(() => {
    setState(prev => ({
      ...prev,
      historicoAberto: false,
      processoSelecionado: null
    }))
  }, [])

  // AC9: Função para registrar histórico de auditoria
  const registrarHistorico = useCallback((historico: ProcessoHistorico) => {
    // Simular salvamento do histórico
    console.log("Histórico registrado:", historico)
  }, [])

  // Busca geral por qualquer campo - AC8
  const buscarProcessos = useCallback((termo: string) => {
    setState(prev => ({
      ...prev,
      filtros: {
        ...prev.filtros,
        pasta: termo,
        nomeCliente: termo,
        outrosEnvolvidos: termo,
        vara: termo,
        foro: termo,
        acao: termo,
        responsavel: termo
      }
    }))
  }, [])

  return {
    // Estado
    processos: processosFiltrados,
    loading: state.loading,
    error: state.error,
    filtros: state.filtros,
    processoSelecionado: state.processoSelecionado,
    modalAberto: state.modalAberto,
    modoEdicao: state.modoEdicao,
    historicoAberto: state.historicoAberto,

    // Ações CRUD
    criarProcesso,
    editarProcesso,
    excluirProcesso,

    // Controles de filtro e busca
    setFiltros,
    buscarProcessos,

    // Controles de UI
    abrirModal,
    fecharModal,
    abrirHistorico,
    fecharHistorico
  }
}
