"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock,
  Users,
  Video,
  FileText,
  Ban,
  Calendar,
  Edit,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { EventoAgenda, TipoEvento, StatusEvento, RespostaParticipante } from "../types"
import { useAgenda } from "../use-agenda"

interface ListaEventosProps {
  eventos: EventoAgenda[]
  onEventoClick: (evento: EventoAgenda) => void
  onEditarEvento: (evento: EventoAgenda) => void
}

export function ListaEventos({ eventos, onEventoClick, onEditarEvento }: ListaEventosProps) {
  const { configuracoes } = useAgenda()
  const [expandido, setExpandido] = useState(true)
  const [filtroRapido, setFiltroRapido] = useState<"todos" | "hoje" | "semana">("hoje")

  const hoje = new Date()
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay() + (configuracoes.inicioSemana === "segunda" ? 1 : 0))
  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(inicioSemana.getDate() + 6)

  // Filtrar eventos baseado no filtro rápido
  const eventosFiltrados = eventos.filter(evento => {
    const eventoData = new Date(evento.dataHoraInicio)
    
    switch (filtroRapido) {
      case "hoje":
        return eventoData.toDateString() === hoje.toDateString()
      case "semana":
        return eventoData >= inicioSemana && eventoData <= fimSemana
      default:
        return true
    }
  }).sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())

  const getTipoIcon = (tipo: TipoEvento) => {
    switch (tipo) {
      case "reuniao":
        return <Users className="h-4 w-4" />
      case "tarefa":
        return <FileText className="h-4 w-4" />
      case "bloqueio":
        return <Ban className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: TipoEvento) => {
    switch (tipo) {
      case "evento": return "Evento"
      case "reuniao": return "Reunião"
      case "tarefa": return "Tarefa"
      case "bloqueio": return "Bloqueio"
    }
  }

  const getStatusIcon = (status: StatusEvento) => {
    switch (status) {
      case "pendente":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "em_andamento":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "concluido":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "bloqueio":
        return <Ban className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusLabel = (status: StatusEvento) => {
    switch (status) {
      case "pendente": return "Pendente"
      case "em_andamento": return "Em andamento"
      case "concluido": return "Concluído"
      case "bloqueio": return "Bloqueio"
    }
  }

  const getRespostaIcon = (resposta: RespostaParticipante) => {
    switch (resposta) {
      case "sim":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "nao":
        return <XCircle className="h-3 w-3 text-red-500" />
      case "talvez":
        return <AlertCircle className="h-3 w-3 text-amber-500" />
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />
    }
  }

  const formatarHorario = (evento: EventoAgenda) => {
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
      minute: "2-digit" 
    })} - ${fim.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })}`
  }

  const formatarData = (data: string) => {
    const evento = new Date(data)
    const ehHoje = evento.toDateString() === hoje.toDateString()
    const ehAmanha = evento.toDateString() === new Date(hoje.getTime() + 24 * 60 * 60 * 1000).toDateString()
    const ehOntem = evento.toDateString() === new Date(hoje.getTime() - 24 * 60 * 60 * 1000).toDateString()
    
    if (ehHoje) return "Hoje"
    if (ehAmanha) return "Amanhã"
    if (ehOntem) return "Ontem"
    
    return evento.toLocaleDateString("pt-BR", { 
      weekday: "short", 
      day: "numeric", 
      month: "short" 
    })
  }

  const contarEventosPorStatus = () => {
    const hoje = eventosFiltrados.filter(e => 
      new Date(e.dataHoraInicio).toDateString() === new Date().toDateString()
    )
    
    return {
      total: hoje.length,
      pendente: hoje.filter(e => e.status === "pendente").length,
      andamento: hoje.filter(e => e.status === "em_andamento").length,
      concluido: hoje.filter(e => e.status === "concluido").length,
      bloqueio: hoje.filter(e => e.status === "bloqueio").length,
    }
  }

  const statusCount = contarEventosPorStatus()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividades
              <Badge variant="secondary" className="px-2 py-1">
                {eventosFiltrados.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              {filtroRapido === "hoje" && "Eventos de hoje"}
              {filtroRapido === "semana" && "Eventos desta semana"}
              {filtroRapido === "todos" && "Todos os eventos"}
            </CardDescription>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Filtros rápidos */}
        <div className="flex items-center gap-1 mt-3">
          {["hoje", "semana", "todos"].map((filtro) => (
            <Button
              key={filtro}
              variant={filtroRapido === filtro ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroRapido(filtro as any)}
              className={`text-xs ${filtroRapido === filtro ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            >
              {filtro === "hoje" && "Hoje"}
              {filtro === "semana" && "Semana"}
              {filtro === "todos" && "Todos"}
            </Button>
          ))}
        </div>

        {/* Resumo rápido para hoje */}
        {filtroRapido === "hoje" && statusCount.total > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            {statusCount.pendente > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                {statusCount.pendente} pendente{statusCount.pendente > 1 ? 's' : ''}
              </Badge>
            )}
            {statusCount.andamento > 0 && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {statusCount.andamento} em andamento
              </Badge>
            )}
            {statusCount.concluido > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                {statusCount.concluido} concluído{statusCount.concluido > 1 ? 's' : ''}
              </Badge>
            )}
            {statusCount.bloqueio > 0 && (
              <Badge variant="outline" className="text-red-600 border-red-300">
                {statusCount.bloqueio} bloqueio{statusCount.bloqueio > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      {expandido && (
        <CardContent className="pt-0">
          <ScrollArea className="h-[400px]">
            {eventosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {filtroRapido === "hoje" && "Nenhum evento hoje"}
                  {filtroRapido === "semana" && "Nenhum evento esta semana"}
                  {filtroRapido === "todos" && "Nenhum evento encontrado"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {eventosFiltrados.map((evento) => (
                  <div
                    key={evento.id}
                    className="group p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onEventoClick(evento)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex items-center gap-2 mt-0.5">
                          {getTipoIcon(evento.tipo)}
                          {getStatusIcon(evento.status)}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {evento.titulo}
                            </h4>
                            {evento.linkVideoconferencia && (
                              <Video className="h-3 w-3 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>{formatarData(evento.dataHoraInicio)}</span>
                            <span>•</span>
                            <span>{formatarHorario(evento)}</span>
                            <span>•</span>
                            <span>{getTipoLabel(evento.tipo)}</span>
                          </div>

                          {evento.participantes.length > 0 && evento.tipo !== "bloqueio" && (
                            <div className="flex items-center gap-1 mt-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {evento.participantes.length} participante{evento.participantes.length > 1 ? 's' : ''}
                              </span>
                              
                              {/* Mostrar status de resposta obrigatória */}
                              {evento.respostaObrigatoria && (
                                <div className="flex items-center gap-1 ml-2">
                                  {evento.participantes.slice(0, 3).map((participante, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                      {getRespostaIcon(participante.resposta)}
                                    </div>
                                  ))}
                                  {evento.participantes.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{evento.participantes.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {evento.clienteId && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">
                                Cliente: João Silva
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditarEvento(evento)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {evento.descricao && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 pl-8">
                        {evento.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  )
}
