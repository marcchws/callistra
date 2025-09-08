"use client"

import { useState, useCallback, useMemo } from "react"
import { Processo, ProcessoFilter, HistoricoAlteracao } from "../types"

// Mock de dados para desenvolvimento
const mockProcessos: Processo[] = [
  {
    id: "1",
    pasta: "2024/001",
    nomeCliente: "João da Silva",
    qualificacaoCliente: "autor",
    outrosEnvolvidos: "Empresa XYZ Ltda",
    qualificacaoOutros: "reu",
    titulo: "Ação Trabalhista - Horas Extras",
    instancia: "1_grau",
    numero: "1001234-56.2024.8.26.0100",
    juizo: "1ª Vara do Trabalho",
    vara: "1ª Vara",
    foro: "Foro Central",
    acao: "Reclamação Trabalhista",
    tribunal: "tjsp",
    linkTribunal: "https://esaj.tjsp.jus.br",
    objeto: "Pagamento de horas extras não pagas",
    valorCausa: "R$ 25.000,00",
    distribuidoEm: "2024-01-15",
    responsavel: "Dr. Carlos Oliveira",
    honorarios: ["contratual_percentual"],
    acesso: "publico",
    criadoEm: "2024-01-15T10:00:00",
    criadoPor: "admin@escritorio.com"
  },
  {
    id: "2",
    pasta: "2024/002",
    nomeCliente: "Maria Santos",
    qualificacaoCliente: "autor",
    outrosEnvolvidos: "Banco ABC S.A.",
    qualificacaoOutros: "reu",
    titulo: "Revisão Contratual",
    instancia: "1_grau",
    numero: "2002345-67.2024.8.26.0200",
    juizo: "2ª Vara Cível",
    vara: "2ª Vara",
    foro: "Foro Regional II",
    acao: "Ação Revisional",
    tribunal: "tjsp",
    linkTribunal: "https://esaj.tjsp.jus.br",
    objeto: "Revisão de cláusulas abusivas em contrato bancário",
    valorCausa: "R$ 50.000,00",
    distribuidoEm: "2024-02-01",
    responsavel: "Dra. Ana Costa",
    honorarios: ["contratual_fixo", "sucumbencia"],
    acesso: "privado",
    criadoEm: "2024-02-01T14:30:00",
    criadoPor: "admin@escritorio.com"
  }
]

const mockHistorico: HistoricoAlteracao[] = [
  {
    id: "h1",
    processoId: "1",
    acao: "criacao",
    usuario: "admin@escritorio.com",
    dataHora: "2024-01-15T10:00:00",
    detalhes: "Processo cadastrado no sistema"
  },
  {
    id: "h2",
    processoId: "1",
    acao: "edicao",
    usuario: "carlos@escritorio.com",
    dataHora: "2024-01-16T14:30:00",
    detalhes: "Valor da causa atualizado",
    camposAlterados: [
      {
        campo: "valorCausa",
        valorAnterior: "R$ 20.000,00",
        valorNovo: "R$ 25.000,00"
      }
    ]
  }
]

export function useProcessos() {
  const [processos, setProcessos] = useState<Processo[]>(mockProcessos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Adicionar processo
  const addProcesso = useCallback(async (processo: Omit<Processo, "id" | "criadoEm" | "criadoPor">) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const novoProcesso: Processo = {
        ...processo,
        id: String(processos.length + 1),
        criadoEm: new Date().toISOString(),
        criadoPor: "user@escritorio.com" // Em produção, pegar do contexto de auth
      }
      
      setProcessos(prev => [...prev, novoProcesso])
      return { success: true, data: novoProcesso }
    } catch (err) {
      setError("Erro ao cadastrar processo")
      return { success: false, error: "Erro ao cadastrar processo" }
    } finally {
      setLoading(false)
    }
  }, [processos.length])

  // Atualizar processo
  const updateProcesso = useCallback(async (id: string, processo: Partial<Processo>) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProcessos(prev => prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              ...processo,
              atualizadoEm: new Date().toISOString(),
              atualizadoPor: "user@escritorio.com"
            }
          : p
      ))
      
      return { success: true }
    } catch (err) {
      setError("Erro ao atualizar processo")
      return { success: false, error: "Erro ao atualizar processo" }
    } finally {
      setLoading(false)
    }
  }, [])

  // Deletar processo
  const deleteProcesso = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProcessos(prev => prev.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      setError("Erro ao excluir processo")
      return { success: false, error: "Erro ao excluir processo" }
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar processo por ID
  const getProcesso = useCallback((id: string) => {
    return processos.find(p => p.id === id)
  }, [processos])

  // Buscar histórico de alterações
  const getHistorico = useCallback(async (processoId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const historico = mockHistorico.filter(h => h.processoId === processoId)
      return { success: true, data: historico }
    } catch (err) {
      return { success: false, error: "Erro ao buscar histórico" }
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar entrada no histórico
  const addHistorico = useCallback(async (entrada: Omit<HistoricoAlteracao, "id" | "dataHora">) => {
    try {
      const novaEntrada: HistoricoAlteracao = {
        ...entrada,
        id: `h${Date.now()}`,
        dataHora: new Date().toISOString()
      }
      
      mockHistorico.push(novaEntrada)
      return { success: true, data: novaEntrada }
    } catch (err) {
      return { success: false, error: "Erro ao adicionar histórico" }
    }
  }, [])

  // Verificar permissão de acesso
  const checkPermissao = useCallback((processo: Processo, userId: string = "user@escritorio.com") => {
    // Em produção, implementar lógica real de permissões
    if (processo.acesso === "publico") return true
    if (processo.acesso === "privado") {
      // Verificar se o usuário é o responsável ou tem permissão especial
      return processo.responsavel === userId || processo.criadoPor === userId
    }
    if (processo.acesso === "envolvidos") {
      // Verificar se o usuário está entre os envolvidos
      return processo.responsavel === userId || 
             processo.nomeCliente.includes(userId) ||
             processo.outrosEnvolvidos.includes(userId)
    }
    return false
  }, [])

  return {
    processos,
    loading,
    error,
    addProcesso,
    updateProcesso,
    deleteProcesso,
    getProcesso,
    getHistorico,
    addHistorico,
    checkPermissao
  }
}