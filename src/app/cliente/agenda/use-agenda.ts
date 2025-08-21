"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { EventoAgenda, NovoEvento, FiltrosAgenda, ConfiguracoesVisualizacao, TipoEvento, StatusEvento } from "./types"

// Mock data - em produção viria de uma API
const eventosInitial: EventoAgenda[] = [
  {
    id: "1",
    titulo: "Reunião com cliente Silva",
    tipo: "reuniao",
    participantes: [
      { id: "1", nome: "João Silva", email: "joao@email.com", resposta: "sim" },
      { id: "2", nome: "Maria Santos", email: "maria@email.com", resposta: "pendente" }
    ],
    dataHoraInicio: "2024-12-20T10:00:00",
    dataHoraTermino: "2024-12-20T11:00:00",
    respostaObrigatoria: true,
    linkVideoconferencia: "https://meet.google.com/abc-123",
    clienteId: "cliente1",
    processoId: "processo1",
    descricao: "Discussão sobre andamento do processo",
    anexos: [],
    status: "pendente",
    criadoPor: "Usuario Atual",
    criadoEm: "2024-12-15T09:00:00"
  },
  {
    id: "2", 
    titulo: "Bloqueio - Almoço",
    tipo: "bloqueio",
    participantes: [],
    dataHoraInicio: "2024-12-20T12:00:00",
    dataHoraTermino: "2024-12-20T13:00:00",
    respostaObrigatoria: false,
    descricao: "Horário de almoço - indisponível",
    anexos: [],
    status: "bloqueio",
    criadoPor: "Usuario Atual",
    criadoEm: "2024-12-15T09:00:00"
  }
]

const configuracaoInicial: ConfiguracoesVisualizacao = {
  inicioSemana: "segunda",
  mostrarFinsDeSeemana: true,
  formatoDataHora: "24h"
}

export function useAgenda() {
  const [eventos, setEventos] = useState<EventoAgenda[]>(eventosInitial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosAgenda>({
    status: [],
    tipo: [],
    respostaParticipante: []
  })
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesVisualizacao>(configuracaoInicial)
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoAgenda | null>(null)
  const [modoVisualizacao, setModoVisualizacao] = useState<"mensal" | "diaria">("mensal")

  // Filtrar eventos baseado nos filtros aplicados
  const eventosFiltrados = eventos.filter(evento => {
    if (filtros.status.length > 0 && !filtros.status.includes(evento.status)) return false
    if (filtros.tipo.length > 0 && !filtros.tipo.includes(evento.tipo)) return false
    if (filtros.busca && !evento.titulo.toLowerCase().includes(filtros.busca.toLowerCase())) return false
    
    // Filtro por resposta do participante (apenas para eventos do usuário)
    if (filtros.respostaParticipante.length > 0) {
      const usuarioParticipante = evento.participantes.find(p => p.email === "usuario@atual.com")
      if (usuarioParticipante && !filtros.respostaParticipante.includes(usuarioParticipante.resposta)) return false
    }

    return true
  })

  const criarEvento = async (novoEvento: NovoEvento) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular validação de conflito de horários
      const conflito = eventos.some(evento => {
        if (evento.tipo === "bloqueio" || novoEvento.tipo === "bloqueio") {
          const inicio = new Date(novoEvento.dataHoraInicio)
          const fim = new Date(novoEvento.dataHoraTermino)
          const eventoInicio = new Date(evento.dataHoraInicio)
          const eventoFim = new Date(evento.dataHoraTermino)
          
          return (inicio < eventoFim && fim > eventoInicio)
        }
        return false
      })

      if (conflito && novoEvento.tipo === "bloqueio") {
        throw new Error("Já existe um bloqueio neste horário")
      }

      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const evento: EventoAgenda = {
        id: Date.now().toString(),
        ...novoEvento,
        participantes: novoEvento.participantes.map(email => ({
          id: Date.now().toString(),
          nome: email.split("@")[0],
          email,
          resposta: "pendente"
        })),
        anexos: [], // Em produção, faria upload dos arquivos
        status: novoEvento.tipo === "bloqueio" ? "bloqueio" : "pendente",
        criadoPor: "Usuario Atual",
        criadoEm: new Date().toISOString()
      }

      setEventos(prev => [...prev, evento])
      toast.success("Evento criado com sucesso!", { position: "bottom-right", duration: 2000 })
      
      return evento
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar evento"
      setError(errorMessage)
      toast.error(errorMessage, { position: "bottom-right", duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editarEvento = async (id: string, dadosAtualizados: Partial<NovoEvento>) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setEventos(prev => prev.map(evento => 
        evento.id === id 
          ? { 
              ...evento, 
              ...dadosAtualizados,
              alteradoPor: "Usuario Atual",
              alteradoEm: new Date().toISOString()
            }
          : evento
      ))
      
      toast.success("Evento atualizado com sucesso!", { position: "bottom-right", duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao atualizar evento"
      setError(errorMessage)
      toast.error(errorMessage, { position: "bottom-right", duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removerEvento = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setEventos(prev => prev.filter(evento => evento.id !== id))
      toast.success("Evento removido com sucesso!", { position: "bottom-right", duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao remover evento"
      setError(errorMessage)
      toast.error(errorMessage, { position: "bottom-right", duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const responderEvento = async (eventoId: string, resposta: "sim" | "nao" | "talvez") => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId 
          ? {
              ...evento,
              participantes: evento.participantes.map(p => 
                p.email === "usuario@atual.com" 
                  ? { ...p, resposta }
                  : p
              )
            }
          : evento
      ))
      
      toast.success("Resposta registrada com sucesso!", { position: "bottom-right", duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao registrar resposta"
      setError(errorMessage)
      toast.error(errorMessage, { position: "bottom-right", duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const atualizarConfiguracoes = (novasConfiguracoes: Partial<ConfiguracoesVisualizacao>) => {
    setConfiguracoes(prev => ({ ...prev, ...novasConfiguracoes }))
    toast.success("Configurações atualizadas!", { position: "bottom-right", duration: 2000 })
  }

  const buscarEventos = (termo: string) => {
    setFiltros(prev => ({ ...prev, busca: termo }))
  }

  const aplicarFiltros = (novosFiltros: Partial<FiltrosAgenda>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }))
  }

  const limparFiltros = () => {
    setFiltros({
      status: [],
      tipo: [],
      respostaParticipante: []
    })
  }

  return {
    // Data
    eventos: eventosFiltrados,
    eventoSelecionado,
    configuracoes,
    filtros,
    modoVisualizacao,
    
    // State
    loading,
    error,
    
    // Actions
    criarEvento,
    editarEvento,
    removerEvento,
    responderEvento,
    buscarEventos,
    aplicarFiltros,
    limparFiltros,
    atualizarConfiguracoes,
    setEventoSelecionado,
    setModoVisualizacao,
    setError
  }
}
