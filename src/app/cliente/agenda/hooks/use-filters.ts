"use client"

import { useState, useCallback } from "react"
import { FiltrosAgenda, StatusEvento, TipoItem, RespostaParticipante } from "../types"

export function useFilters() {
  const [filtros, setFiltros] = useState<FiltrosAgenda>({
    status: "todos",
    tipoItem: "todos",
    resposta: "todos"
  })

  const aplicarFiltro = useCallback((
    campo: keyof FiltrosAgenda,
    valor: any
  ) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor === "todos" ? undefined : valor
    }))
  }, [])

  const limparFiltros = useCallback(() => {
    setFiltros({
      status: "todos",
      tipoItem: "todos",
      resposta: "todos"
    })
  }, [])

  const setBusca = useCallback((busca: string) => {
    setFiltros(prev => ({ ...prev, busca: busca || undefined }))
  }, [])

  const setDataRange = useCallback((dataInicio?: Date, dataFim?: Date) => {
    setFiltros(prev => ({
      ...prev,
      dataInicio,
      dataFim
    }))
  }, [])

  const setClienteProcesso = useCallback((clienteId?: string, processoId?: string) => {
    setFiltros(prev => ({
      ...prev,
      clienteId,
      processoId
    }))
  }, [])

  return {
    filtros,
    aplicarFiltro,
    limparFiltros,
    setBusca,
    setDataRange,
    setClienteProcesso
  }
}
