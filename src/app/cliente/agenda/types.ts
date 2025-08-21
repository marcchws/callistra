export type TipoEvento = "evento" | "reuniao" | "tarefa" | "bloqueio"

export type StatusEvento = "em_andamento" | "pendente" | "concluido" | "bloqueio"

export type RespostaParticipante = "sim" | "nao" | "talvez" | "pendente"

export interface Participante {
  id: string
  nome: string
  email: string
  resposta: RespostaParticipante
}

export interface EventoAgenda {
  id: string
  titulo: string
  tipo: TipoEvento
  participantes: Participante[]
  dataHoraInicio: string
  dataHoraTermino: string
  recorrencia?: {
    tipo: "diario" | "semanal" | "mensal" | "anual"
    intervalo: number
    fimRecorrencia?: string
  }
  respostaObrigatoria: boolean
  linkVideoconferencia?: string
  clienteId?: string
  processoId?: string
  descricao?: string
  anexos: {
    id: string
    nome: string
    url: string
    tamanho: number
  }[]
  status: StatusEvento
  criadoPor: string
  criadoEm: string
  alteradoPor?: string
  alteradoEm?: string
}

export interface ConfiguracoesVisualizacao {
  inicioSemana: "domingo" | "segunda"
  mostrarFinsDeSeemana: boolean
  formatoDataHora: "12h" | "24h"
}

export interface FiltrosAgenda {
  status: StatusEvento[]
  tipo: TipoEvento[]
  respostaParticipante: RespostaParticipante[]
  dataInicio?: string
  dataFim?: string
  busca?: string
}

export interface NovoEvento {
  titulo: string
  tipo: TipoEvento
  participantes: string[]
  dataHoraInicio: string
  dataHoraTermino: string
  recorrencia?: {
    tipo: "diario" | "semanal" | "mensal" | "anual"
    intervalo: number
    fimRecorrencia?: string
  }
  respostaObrigatoria: boolean
  linkVideoconferencia?: string
  clienteId?: string
  processoId?: string
  descricao?: string
  anexos: File[]
}
