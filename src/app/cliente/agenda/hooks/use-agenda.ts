"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { 
  EventoAgenda, 
  FiltrosAgenda, 
  StatusEvento, 
  TipoItem,
  RespostaParticipante,
  EventoFormData
} from "../types"

// Mock data para desenvolvimento
const mockEventos: EventoAgenda[] = [
  {
    id: "1",
    titulo: "Reunião com Cliente Silva",
    tipoItem: TipoItem.REUNIAO,
    participantes: [
      {
        id: "p1",
        nome: "João Silva",
        email: "joao@example.com",
        resposta: RespostaParticipante.SIM,
        respostaObrigatoria: true
      },
      {
        id: "p2",
        nome: "Maria Santos",
        email: "maria@example.com",
        resposta: RespostaParticipante.PENDENTE,
        respostaObrigatoria: true
      }
    ],
    dataHoraInicio: new Date(2025, 8, 1, 14, 0), // 01/09/2025 às 14:00
    dataHoraTermino: new Date(2025, 8, 1, 15, 30), // 01/09/2025 às 15:30
    recorrencia: { tipo: "Nenhuma" as any },
    respostaObrigatoria: true,
    linkVideoconferencia: "https://meet.google.com/abc-defg-hij",
    clienteId: "cli1",
    clienteNome: "Silva Empreendimentos",
    processoId: "proc1",
    processoNumero: "0001234-45.2024.8.26.0100",
    descricao: "Discussão sobre andamento do processo",
    anexos: [],
    status: StatusEvento.PENDENTE,
    criadoPor: "Usuário Admin",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    notificacaoEnviada: true,
    lembreteMinutos: 15
  },
  {
    id: "2",
    titulo: "Audiência Trabalhista",
    tipoItem: TipoItem.EVENTO,
    participantes: [],
    dataHoraInicio: new Date(2025, 8, 2, 9, 0), // 02/09/2025 às 9:00
    dataHoraTermino: new Date(2025, 8, 2, 11, 0), // 02/09/2025 às 11:00
    recorrencia: { tipo: "Nenhuma" as any },
    respostaObrigatoria: false,
    processoId: "proc2",
    processoNumero: "0002345-56.2024.5.02.0001",
    descricao: "Audiência de instrução e julgamento",
    anexos: [],
    status: StatusEvento.EM_ANDAMENTO,
    criadoPor: "Usuário Admin",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    notificacaoEnviada: true
  },
  {
    id: "3",
    titulo: "Férias - Indisponível",
    tipoItem: TipoItem.BLOQUEIO,
    participantes: [],
    dataHoraInicio: new Date(2025, 8, 3, 0, 0), // 03/09/2025 às 00:00
    dataHoraTermino: new Date(2025, 8, 7, 23, 59), // 07/09/2025 às 23:59
    recorrencia: { tipo: "Nenhuma" as any },
    respostaObrigatoria: false,
    descricao: "Período de férias",
    anexos: [],
    status: StatusEvento.BLOQUEIO,
    criadoPor: "Usuário Admin",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    notificacaoEnviada: false
  },
  {
    id: "4",
    titulo: "Elaborar Petição Inicial",
    tipoItem: TipoItem.TAREFA,
    participantes: [],
    dataHoraInicio: new Date(2025, 8, 8, 8, 0), // 08/09/2025 às 8:00
    dataHoraTermino: new Date(2025, 8, 8, 12, 0), // 08/09/2025 às 12:00
    recorrencia: { tipo: "Nenhuma" as any },
    respostaObrigatoria: false,
    clienteId: "cli2",
    clienteNome: "Tech Solutions Ltda",
    descricao: "Preparar petição inicial para novo processo",
    anexos: [],
    status: StatusEvento.PENDENTE,
    criadoPor: "Usuário Admin",
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    notificacaoEnviada: false
  }
]

export function useAgenda() {
  const [eventos, setEventos] = useState<EventoAgenda[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosAgenda>({})

  // Carregar eventos iniciais
  useEffect(() => {
    carregarEventos()
  }, [])

  const carregarEventos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 500))
      setEventos(mockEventos)
    } catch (err) {
      setError("Erro ao carregar eventos")
      toast.error("Erro ao carregar eventos", { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar eventos
  const eventosFiltrados = useMemo(() => {
    let resultado = [...eventos]

    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      resultado = resultado.filter(e => 
        e.titulo.toLowerCase().includes(termo) ||
        e.descricao?.toLowerCase().includes(termo) ||
        e.clienteNome?.toLowerCase().includes(termo) ||
        e.processoNumero?.toLowerCase().includes(termo)
      )
    }

    if (filtros.status && filtros.status !== "todos") {
      resultado = resultado.filter(e => e.status === filtros.status)
    }

    if (filtros.tipoItem && filtros.tipoItem !== "todos") {
      resultado = resultado.filter(e => e.tipoItem === filtros.tipoItem)
    }

    if (filtros.resposta && filtros.resposta !== "todos") {
      resultado = resultado.filter(e => 
        e.participantes.some(p => p.resposta === filtros.resposta)
      )
    }

    if (filtros.dataInicio) {
      resultado = resultado.filter(e => 
        e.dataHoraInicio >= filtros.dataInicio!
      )
    }

    if (filtros.dataFim) {
      resultado = resultado.filter(e => 
        e.dataHoraTermino <= filtros.dataFim!
      )
    }

    if (filtros.clienteId) {
      resultado = resultado.filter(e => e.clienteId === filtros.clienteId)
    }

    if (filtros.processoId) {
      resultado = resultado.filter(e => e.processoId === filtros.processoId)
    }

    return resultado
  }, [eventos, filtros])

  // Criar evento
  const criarEvento = useCallback(async (dados: EventoFormData) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const novoEvento: EventoAgenda = {
        id: `${Date.now()}`,
        ...dados,
        participantes: [],
        anexos: [],
        status: dados.tipoItem === TipoItem.BLOQUEIO 
          ? StatusEvento.BLOQUEIO 
          : StatusEvento.PENDENTE,
        criadoPor: "Usuário Admin",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        notificacaoEnviada: false
      }
      
      setEventos(prev => [...prev, novoEvento])
      
      // Enviar notificações se necessário
      if (dados.respostaObrigatoria && dados.participantes?.length) {
        toast.success("Convites enviados aos participantes", { duration: 2000 })
      }
      
      toast.success(
        dados.tipoItem === TipoItem.BLOQUEIO 
          ? "Bloqueio de agenda criado com sucesso!" 
          : "Evento criado com sucesso!",
        { duration: 2000 }
      )
      
      return novoEvento
    } catch (err) {
      setError("Erro ao criar evento")
      toast.error("Erro ao criar evento", { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar evento
  const atualizarEvento = useCallback(async (id: string, dados: Partial<EventoFormData>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setEventos(prev => prev.map(e => 
        e.id === id 
          ? { ...e, ...dados, atualizadoEm: new Date() }
          : e
      ))
      
      toast.success("Item atualizado com sucesso", { duration: 2000 })
    } catch (err) {
      setError("Erro ao atualizar evento")
      toast.error("Erro ao atualizar evento", { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover evento
  const removerEvento = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setEventos(prev => prev.filter(e => e.id !== id))
      
      toast.success("Item removido com sucesso", { duration: 2000 })
    } catch (err) {
      setError("Erro ao remover evento")
      toast.error("Erro ao remover evento", { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Responder convite
  const responderConvite = useCallback(async (
    eventoId: string, 
    participanteId: string, 
    resposta: RespostaParticipante
  ) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setEventos(prev => prev.map(evento => {
        if (evento.id === eventoId) {
          const participantesAtualizados = evento.participantes.map(p =>
            p.id === participanteId
              ? { ...p, resposta, respondidoEm: new Date() }
              : p
          )
          return { ...evento, participantes: participantesAtualizados }
        }
        return evento
      }))
      
      toast.success("Resposta registrada com sucesso", { duration: 2000 })
    } catch (err) {
      setError("Erro ao responder convite")
      toast.error("Erro ao responder convite", { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar conflitos de horário
  const verificarConflitos = useCallback((
    dataInicio: Date,
    dataFim: Date,
    eventoId?: string
  ): EventoAgenda[] => {
    return eventos.filter(e => {
      if (eventoId && e.id === eventoId) return false
      if (e.tipoItem === TipoItem.BLOQUEIO) return false
      
      return (
        (dataInicio >= e.dataHoraInicio && dataInicio < e.dataHoraTermino) ||
        (dataFim > e.dataHoraInicio && dataFim <= e.dataHoraTermino) ||
        (dataInicio <= e.dataHoraInicio && dataFim >= e.dataHoraTermino)
      )
    })
  }, [eventos])

  // Enviar notificação de resposta pendente
  const enviarLembrete = useCallback(async (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId)
    if (!evento) return
    
    const participantesPendentes = evento.participantes.filter(
      p => p.respostaObrigatoria && p.resposta === RespostaParticipante.PENDENTE
    )
    
    if (participantesPendentes.length > 0) {
      toast.success(
        `Lembrete enviado para ${participantesPendentes.length} participante(s)`,
        { duration: 2000 }
      )
    }
  }, [eventos])

  return {
    eventos: eventosFiltrados,
    loading,
    error,
    filtros,
    setFiltros,
    criarEvento,
    atualizarEvento,
    removerEvento,
    responderConvite,
    verificarConflitos,
    enviarLembrete,
    recarregar: carregarEventos
  }
}
