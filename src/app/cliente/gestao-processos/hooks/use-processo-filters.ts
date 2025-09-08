"use client"

import { useState, useCallback, useMemo } from "react"
import { Processo, ProcessoFilter } from "../types"

export function useProcessoFilters(processos: Processo[]) {
  const [filters, setFilters] = useState<ProcessoFilter>({
    searchTerm: "",
    campo: "todos",
    instancia: "",
    tribunal: "",
    acesso: "",
    dataInicio: "",
    dataFim: ""
  })

  // Atualizar filtros
  const updateFilter = useCallback(<K extends keyof ProcessoFilter>(
    key: K,
    value: ProcessoFilter[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      campo: "todos",
      instancia: "",
      tribunal: "",
      acesso: "",
      dataInicio: "",
      dataFim: ""
    })
  }, [])

  // Aplicar filtros aos processos
  const filteredProcessos = useMemo(() => {
    let result = [...processos]

    // Filtro por termo de busca
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      
      result = result.filter(processo => {
        if (filters.campo === "todos") {
          // Buscar em todos os campos pesquisáveis
          return (
            processo.pasta?.toLowerCase().includes(term) ||
            processo.nomeCliente.toLowerCase().includes(term) ||
            processo.outrosEnvolvidos.toLowerCase().includes(term) ||
            processo.vara?.toLowerCase().includes(term) ||
            processo.foro?.toLowerCase().includes(term) ||
            processo.acao?.toLowerCase().includes(term) ||
            processo.responsavel.toLowerCase().includes(term)
          )
        } else {
          // Buscar apenas no campo específico
          switch (filters.campo) {
            case "pasta":
              return processo.pasta?.toLowerCase().includes(term)
            case "nomeCliente":
              return processo.nomeCliente.toLowerCase().includes(term)
            case "outrosEnvolvidos":
              return processo.outrosEnvolvidos.toLowerCase().includes(term)
            case "vara":
              return processo.vara?.toLowerCase().includes(term)
            case "foro":
              return processo.foro?.toLowerCase().includes(term)
            case "acao":
              return processo.acao?.toLowerCase().includes(term)
            case "responsavel":
              return processo.responsavel.toLowerCase().includes(term)
            default:
              return true
          }
        }
      })
    }

    // Filtro por instância
    if (filters.instancia && filters.instancia !== "") {
      result = result.filter(processo => processo.instancia === filters.instancia)
    }

    // Filtro por tribunal
    if (filters.tribunal && filters.tribunal !== "") {
      result = result.filter(processo => processo.tribunal === filters.tribunal)
    }

    // Filtro por nível de acesso
    if (filters.acesso && filters.acesso !== "") {
      result = result.filter(processo => processo.acesso === filters.acesso)
    }

    // Filtro por data de distribuição
    if (filters.dataInicio) {
      result = result.filter(processo => {
        if (!processo.distribuidoEm) return false
        return processo.distribuidoEm >= filters.dataInicio!
      })
    }

    if (filters.dataFim) {
      result = result.filter(processo => {
        if (!processo.distribuidoEm) return false
        return processo.distribuidoEm <= filters.dataFim!
      })
    }

    return result
  }, [processos, filters])

  // Estatísticas dos filtros
  const stats = useMemo(() => {
    return {
      total: processos.length,
      filtered: filteredProcessos.length,
      byInstancia: processos.reduce((acc, p) => {
        const key = p.instancia || "sem_instancia"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byAcesso: processos.reduce((acc, p) => {
        acc[p.acesso] = (acc[p.acesso] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byResponsavel: processos.reduce((acc, p) => {
        acc[p.responsavel] = (acc[p.responsavel] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }, [processos, filteredProcessos])

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredProcessos,
    stats
  }
}