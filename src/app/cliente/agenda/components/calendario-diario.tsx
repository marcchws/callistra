"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Users,
  Video,
  FileText,
  Ban,
  Calendar
} from "lucide-react"
import { EventoAgenda, TipoEvento, StatusEvento } from "../types"
import { useAgenda } from "../use-agenda"

interface CalendarioDiarioProps {
  eventos: EventoAgenda[]
  onEventoClick: (evento: EventoAgenda) => void
  onCriarEvento: () => void
}

export function CalendarioDiario({ eventos, onEventoClick, onCriarEvento }: CalendarioDiarioProps) {
  const { configuracoes } = useAgenda()
  const [dataAtual, setDataAtual] = useState(new Date())

  const hoje = new Date()

  // Gerar horários do dia (6h às 22h)
  const horariosIniciais = Array.from({ length: 17 }, (_, i) => i + 6) // 6 até 22
  
  // Obter eventos do dia atual
  const eventosDoDia = eventos.filter(evento => {
    const eventoData = new Date(evento.dataHoraInicio).toDateString()
    const diaAtual = dataAtual.toDateString()
    return eventoData === diaAtual
  })

  // Obter eventos de um horário específico
  const getEventosDoHorario = (hora: number) => {
    return eventosDoDia.filter(evento => {
      const eventoHora = new Date(evento.dataHoraInicio).getHours()
      const eventoHoraFim = new Date(evento.dataHoraTermino).getHours()
      return hora >= eventoHora && hora < eventoHoraFim
    })
  }

  // Navegação
  const diaAnterior = () => {
    const novaData = new Date(dataAtual)
    novaData.setDate(novaData.getDate() - 1)
    setDataAtual(novaData)
  }

  const proximoDia = () => {
    const novaData = new Date(dataAtual)
    novaData.setDate(novaData.getDate() + 1)
    setDataAtual(novaData)
  }

  const voltarHoje = () => {
    setDataAtual(new Date())
  }

  const getTipoIcon = (tipo: TipoEvento) => {
    switch (tipo) {
      case "reuniao":
        return <Users className="h-3 w-3" />
      case "tarefa":
        return <FileText className="h-3 w-3" />
      case "bloqueio":
        return <Ban className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusCor = (status: StatusEvento) => {
    switch (status) {
      case "pendente":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "concluido":
        return "bg-green-100 text-green-800 border-green-200"
      case "bloqueio":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const formatarHora = (hora: number) => {
    if (configuracoes.formatoDataHora === "12h") {
      const periodo = hora >= 12 ? "PM" : "AM"
      const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora
      return `${hora12}:00 ${periodo}`
    }
    return `${hora.toString().padStart(2, '0')}:00`
  }

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", { 
      weekday: "long",
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    })
  }

  const formatarEventoHorario = (evento: EventoAgenda) => {
    const inicio = new Date(evento.dataHoraInicio)
    const fim = new Date(evento.dataHoraTermino)
    
    if (configuracoes.formatoDataHora === "12h") {
      return `${inicio.toLocaleTimeString("pt-BR", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      })} - ${fim.toLocaleTimeString("pt-BR", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      })}`
    }
    
    return `${inicio.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    })} - ${fim.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    })}`
  }

  const ehHoje = dataAtual.toDateString() === hoje.toDateString()
  const horaAtual = hoje.getHours()

  const calcularDuracaoEvento = (evento: EventoAgenda) => {
    const inicio = new Date(evento.dataHoraInicio)
    const fim = new Date(evento.dataHoraTermino)
    const duracaoMinutos = (fim.getTime() - inicio.getTime()) / (1000 * 60)
    
    // Calcular altura baseada na duração (altura mínima de 40px)
    const alturaPorMinuto = 1.5 // px por minuto
    return Math.max(40, duracaoMinutos * alturaPorMinuto)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold capitalize">
              {formatarData(dataAtual)}
            </CardTitle>
            {ehHoje && (
              <p className="text-sm text-blue-600 mt-1">Hoje</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={voltarHoje}
              className="text-sm"
              disabled={ehHoje}
            >
              Hoje
            </Button>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={diaAnterior}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={proximoDia}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Resumo do dia */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{eventosDoDia.length} eventos</span>
          </div>
          {eventosDoDia.some(e => e.tipo === "reuniao") && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{eventosDoDia.filter(e => e.tipo === "reuniao").length} reuniões</span>
            </div>
          )}
          {eventosDoDia.some(e => e.tipo === "bloqueio") && (
            <div className="flex items-center gap-1">
              <Ban className="h-4 w-4" />
              <span>{eventosDoDia.filter(e => e.tipo === "bloqueio").length} bloqueios</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-0 max-h-[600px] overflow-y-auto">
          {horariosIniciais.map((hora) => {
            const eventosDoHorario = getEventosDoHorario(hora)
            const isHoraAtual = ehHoje && hora === horaAtual
            
            return (
              <div
                key={hora}
                className={`
                  border-b border-muted/50 min-h-[60px] flex
                  ${isHoraAtual ? "bg-blue-50/50" : ""}
                `}
              >
                {/* Coluna de horário */}
                <div className="w-20 p-3 text-right border-r border-muted/50">
                  <span className={`
                    text-sm font-medium
                    ${isHoraAtual ? "text-blue-600" : "text-muted-foreground"}
                  `}>
                    {formatarHora(hora)}
                  </span>
                  {isHoraAtual && (
                    <div className="text-xs text-blue-600 mt-1">Agora</div>
                  )}
                </div>

                {/* Coluna de eventos */}
                <div 
                  className="flex-1 p-2 min-h-[60px] cursor-pointer hover:bg-muted/20 transition-colors relative"
                  onClick={onCriarEvento}
                >
                  {eventosDoHorario.length === 0 ? (
                    <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Plus className="h-3 w-3" />
                        <span>Criar evento às {formatarHora(hora)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {eventosDoHorario.map((evento) => (
                        <div
                          key={evento.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventoClick(evento)
                          }}
                          className={`
                            p-2 rounded border cursor-pointer transition-all hover:shadow-sm
                            ${getStatusCor(evento.status)}
                          `}
                          style={{ 
                            minHeight: `${Math.min(calcularDuracaoEvento(evento), 120)}px` 
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {getTipoIcon(evento.tipo)}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">
                                  {evento.titulo}
                                </p>
                                <p className="text-xs opacity-75">
                                  {formatarEventoHorario(evento)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {evento.linkVideoconferencia && (
                                <Video className="h-3 w-3" />
                              )}
                              {evento.participantes.length > 0 && (
                                <Badge variant="outline" className="text-xs px-1">
                                  {evento.participantes.length}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {evento.descricao && (
                            <p className="text-xs mt-1 opacity-75 line-clamp-2">
                              {evento.descricao}
                            </p>
                          )}

                          {evento.clienteId && (
                            <p className="text-xs mt-1 opacity-75">
                              Cliente: João Silva
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Eventos fora do horário comercial */}
        {eventosDoDia.some(evento => {
          const hora = new Date(evento.dataHoraInicio).getHours()
          return hora < 6 || hora >= 22
        }) && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Eventos fora do horário comercial:</h4>
            <div className="space-y-1">
              {eventosDoDia
                .filter(evento => {
                  const hora = new Date(evento.dataHoraInicio).getHours()
                  return hora < 6 || hora >= 22
                })
                .map((evento) => (
                  <div
                    key={evento.id}
                    onClick={() => onEventoClick(evento)}
                    className={`
                      p-2 rounded border cursor-pointer text-sm flex items-center gap-2
                      ${getStatusCor(evento.status)}
                    `}
                  >
                    {getTipoIcon(evento.tipo)}
                    <span className="flex-1">{evento.titulo}</span>
                    <span className="text-xs opacity-75">
                      {formatarEventoHorario(evento)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
