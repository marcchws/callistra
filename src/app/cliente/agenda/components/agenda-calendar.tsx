"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  AlertCircle,
  Ban,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EventoAgenda, TipoItem, StatusEvento, ViewMode } from "../types"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AgendaCalendarProps {
  eventos: EventoAgenda[]
  viewMode: ViewMode
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onEventClick: (evento: EventoAgenda) => void
  onCreateEvent: (date?: Date) => void
  showWeekends: boolean
}

export function AgendaCalendar({
  eventos,
  viewMode,
  selectedDate,
  onDateSelect,
  onEventClick,
  onCreateEvent,
  showWeekends
}: AgendaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  // Sincronizar currentMonth com selectedDate quando mudar
  useEffect(() => {
    setCurrentMonth(selectedDate)
  }, [selectedDate])

  // Gerar dias do mês
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { locale: ptBR })
    const end = endOfWeek(endOfMonth(currentMonth), { locale: ptBR })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Filtrar eventos por dia
  const getEventosNoDia = (date: Date) => {
    return eventos.filter(evento => {
      const eventoInicio = new Date(evento.dataHoraInicio)
      const eventoFim = new Date(evento.dataHoraTermino)
      
      // Verificar se o evento ocorre neste dia
      return (
        isSameDay(eventoInicio, date) || 
        isSameDay(eventoFim, date) ||
        (eventoInicio < date && eventoFim > date)
      )
    })
  }

  // Cores por tipo de item
  const getCorTipoItem = (tipo: TipoItem) => {
    switch (tipo) {
      case TipoItem.EVENTO:
        return "bg-blue-100 text-blue-700 border-blue-200"
      case TipoItem.REUNIAO:
        return "bg-green-100 text-green-700 border-green-200"
      case TipoItem.TAREFA:
        return "bg-orange-100 text-orange-700 border-orange-200"
      case TipoItem.BLOQUEIO:
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  // Ícone por tipo
  const getIconeTipo = (tipo: TipoItem) => {
    switch (tipo) {
      case TipoItem.EVENTO:
        return CalendarIcon
      case TipoItem.REUNIAO:
        return tipo === TipoItem.REUNIAO ? Video : Users
      case TipoItem.TAREFA:
        return Clock
      case TipoItem.BLOQUEIO:
        return Ban
      default:
        return CalendarIcon
    }
  }

  const navegarMes = (direcao: "anterior" | "proximo") => {
    setCurrentMonth(prev => 
      direcao === "anterior" ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  const navegarDia = (direcao: "anterior" | "proximo") => {
    const novaData = new Date(selectedDate)
    if (direcao === "anterior") {
      novaData.setDate(novaData.getDate() - 1)
    } else {
      novaData.setDate(novaData.getDate() + 1)
    }
    onDateSelect(novaData)
  }

  // Renderizar visualização mensal
  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {/* Header com dias da semana */}
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, idx) => {
        if (!showWeekends && (idx === 0 || idx === 6)) return null
        return (
          <div
            key={dia}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700"
          >
            {dia}
          </div>
        )
      })}

      {/* Dias do mês */}
      {days.map((day, idx) => {
        const isWeekend = day.getDay() === 0 || day.getDay() === 6
        if (!showWeekends && isWeekend) return null

        const eventosNoDia = getEventosNoDia(day)
        const isCurrentMonth = isSameMonth(day, currentMonth)
        const isSelectedDay = isSameDay(day, selectedDate)
        const isTodayDate = isToday(day)

        return (
          <div
            key={idx}
            className={cn(
              "min-h-[100px] bg-white p-2 hover:bg-gray-50 cursor-pointer transition-colors",
              !isCurrentMonth && "bg-gray-50 text-gray-400",
              isSelectedDay && "ring-2 ring-blue-600",
              isTodayDate && "bg-blue-50"
            )}
            onClick={() => onDateSelect(day)}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  isTodayDate && "text-blue-600 font-bold"
                )}
              >
                {format(day, "d")}
              </span>
              {eventosNoDia.length > 0 && (
                <Badge variant="secondary" className="text-xs px-1">
                  {eventosNoDia.length}
                </Badge>
              )}
            </div>

            <ScrollArea className="h-16">
              <div className="space-y-1">
                {eventosNoDia.slice(0, 3).map((evento) => {
                  const Icon = getIconeTipo(evento.tipoItem)
                  return (
                    <div
                      key={evento.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(evento)
                      }}
                      className={cn(
                        "text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1",
                        getCorTipoItem(evento.tipoItem)
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="truncate flex-1">{evento.titulo}</span>
                      {evento.respostaObrigatoria && (
                        <AlertCircle className="h-3 w-3" />
                      )}
                    </div>
                  )
                })}
                {eventosNoDia.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{eventosNoDia.length - 3} mais
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )
      })}
    </div>
  )

  // Renderizar visualização diária
  const renderDayView = () => {
    const eventosDoDia = getEventosNoDia(selectedDate)
    const horas = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex h-[600px]">
        {/* Coluna de horas */}
        <div className="w-20 border-r">
          <div className="h-10 border-b" /> {/* Espaço para header */}
          {horas.map(hora => (
            <div
              key={hora}
              className="h-[50px] border-b text-xs text-gray-500 pr-2 pt-1 text-right"
            >
              {hora.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Área de eventos */}
        <div className="flex-1 relative">
          <div className="h-10 border-b bg-gray-50 flex items-center px-4">
            <h3 className="font-medium">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h3>
          </div>
          
          <ScrollArea className="h-[550px]">
            <div className="relative">
              {horas.map(hora => (
                <div
                  key={hora}
                  className="h-[50px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const date = new Date(selectedDate)
                    date.setHours(hora, 0, 0, 0)
                    onCreateEvent(date)
                  }}
                />
              ))}

              {/* Renderizar eventos posicionados */}
              {eventosDoDia.map(evento => {
                const inicio = new Date(evento.dataHoraInicio)
                const fim = new Date(evento.dataHoraTermino)
                const topPosition = inicio.getHours() * 50 + (inicio.getMinutes() / 60) * 50
                const height = ((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)) * 50
                const Icon = getIconeTipo(evento.tipoItem)

                return (
                  <div
                    key={evento.id}
                    className={cn(
                      "absolute left-2 right-2 rounded-lg border-2 p-2 cursor-pointer hover:shadow-lg transition-shadow",
                      getCorTipoItem(evento.tipoItem)
                    )}
                    style={{
                      top: `${topPosition}px`,
                      height: `${Math.max(height, 30)}px`,
                      minHeight: "30px"
                    }}
                    onClick={() => onEventClick(evento)}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-4 w-4 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {evento.titulo}
                        </div>
                        <div className="text-xs opacity-90">
                          {format(inicio, "HH:mm")} - {format(fim, "HH:mm")}
                        </div>
                        {evento.clienteNome && (
                          <div className="text-xs truncate mt-1">
                            {evento.clienteNome}
                          </div>
                        )}
                      </div>
                      {evento.respostaObrigatoria && (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {viewMode === "month" ? "Calendário Mensal" : "Visualização Diária"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => viewMode === "month" ? navegarMes("anterior") : navegarDia("anterior")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-40 text-center">
              {viewMode === "month" 
                ? format(currentMonth, "MMMM yyyy", { locale: ptBR })
                : format(selectedDate, "EEEE, dd/MM/yyyy", { locale: ptBR })
              }
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => viewMode === "month" ? navegarMes("proximo") : navegarDia("proximo")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {viewMode === "day" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDateSelect(new Date())}
                className="gap-1"
              >
                <Home className="h-4 w-4" />
                Hoje
              </Button>
            )}
            <Button
              onClick={() => onCreateEvent()}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {viewMode === "month" ? renderMonthView() : renderDayView()}
      </CardContent>
    </Card>
  )
}
