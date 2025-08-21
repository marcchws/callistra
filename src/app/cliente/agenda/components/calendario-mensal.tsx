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
  Ban
} from "lucide-react"
import { EventoAgenda, TipoEvento, StatusEvento } from "../types"
import { useAgenda } from "../use-agenda"

interface CalendarioMensalProps {
  eventos: EventoAgenda[]
  onEventoClick: (evento: EventoAgenda) => void
  onCriarEvento: () => void
}

export function CalendarioMensal({ eventos, onEventoClick, onCriarEvento }: CalendarioMensalProps) {
  const { configuracoes } = useAgenda()
  const [dataAtual, setDataAtual] = useState(new Date())

  const hoje = new Date()
  const ano = dataAtual.getFullYear()
  const mes = dataAtual.getMonth()

  // Primeiro dia do mês
  const primeiroDiaMes = new Date(ano, mes, 1)
  // Último dia do mês
  const ultimoDiaMes = new Date(ano, mes + 1, 0)
  
  // Ajustar início da semana conforme configuração
  const diasSemanaOffset = configuracoes.inicioSemana === "domingo" ? 0 : 1
  
  // Primeiro dia a ser exibido no calendário
  const primeiroDiaCalendario = new Date(primeiroDiaMes)
  const diaSemanaInicio = (primeiroDiaMes.getDay() - diasSemanaOffset + 7) % 7
  primeiroDiaCalendario.setDate(primeiroDiaMes.getDate() - diaSemanaInicio)

  // Último dia a ser exibido no calendário
  const ultimoDiaCalendario = new Date(ultimoDiaMes)
  const diaSemanaFim = (ultimoDiaMes.getDay() - diasSemanaOffset + 7) % 7
  ultimoDiaCalendario.setDate(ultimoDiaMes.getDate() + (6 - diaSemanaFim))

  // Gerar array de dias
  const dias: Date[] = []
  const dataIteracao = new Date(primeiroDiaCalendario)
  while (dataIteracao <= ultimoDiaCalendario) {
    dias.push(new Date(dataIteracao))
    dataIteracao.setDate(dataIteracao.getDate() + 1)
  }

  // Filtrar dias de fim de semana se configurado
  const diasFiltrados = configuracoes.mostrarFinsDeSeemana 
    ? dias 
    : dias.filter(dia => dia.getDay() !== 0 && dia.getDay() !== 6)

  // Organizar em semanas
  const semanas: Date[][] = []
  const diasPorSemana = configuracoes.mostrarFinsDeSeemana ? 7 : 5
  
  for (let i = 0; i < diasFiltrados.length; i += diasPorSemana) {
    semanas.push(diasFiltrados.slice(i, i + diasPorSemana))
  }

  // Obter eventos de um dia específico
  const getEventosDoDia = (data: Date) => {
    const dataString = data.toISOString().split('T')[0]
    return eventos.filter(evento => {
      const eventoData = new Date(evento.dataHoraInicio).toISOString().split('T')[0]
      return eventoData === dataString
    })
  }

  // Navegação
  const mesAnterior = () => {
    setDataAtual(new Date(ano, mes - 1, 1))
  }

  const proximoMes = () => {
    setDataAtual(new Date(ano, mes + 1, 1))
  }

  const voltarHoje = () => {
    setDataAtual(new Date())
  }

  // Labels dos dias da semana
  const labelsDiasSemana = configuracoes.inicioSemana === "domingo"
    ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  const labelsFiltrados = configuracoes.mostrarFinsDeSeemana
    ? labelsDiasSemana
    : labelsDiasSemana.filter((_, index) => 
        configuracoes.inicioSemana === "domingo" 
          ? index !== 0 && index !== 6
          : index !== 5 && index !== 6
      )

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

  const formatarMesAno = (data: Date) => {
    return data.toLocaleDateString("pt-BR", { 
      month: "long", 
      year: "numeric" 
    })
  }

  const ehHoje = (data: Date) => {
    return data.toDateString() === hoje.toDateString()
  }

  const ehMesAtual = (data: Date) => {
    return data.getMonth() === mes
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold capitalize">
            {formatarMesAno(dataAtual)}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={voltarHoje}
              className="text-sm"
            >
              Hoje
            </Button>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon"
                onClick={mesAnterior}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={proximoMes}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Header dos dias da semana */}
          <div className="grid grid-cols-5 lg:grid-cols-7 gap-1">
            {labelsFiltrados.map((dia, index) => (
              <div 
                key={index}
                className="p-2 text-center text-sm font-medium text-muted-foreground border-b"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Calendário */}
          <div className="space-y-1">
            {semanas.map((semana, semanaIndex) => (
              <div key={semanaIndex} className="grid grid-cols-5 lg:grid-cols-7 gap-1">
                {semana.map((dia, diaIndex) => {
                  const eventosDoDia = getEventosDoDia(dia)
                  const isHoje = ehHoje(dia)
                  const isMesAtual = ehMesAtual(dia)
                  
                  return (
                    <div
                      key={diaIndex}
                      className={`
                        min-h-[100px] p-2 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer
                        ${isHoje ? "bg-blue-50 border-blue-200" : ""}
                        ${!isMesAtual ? "text-muted-foreground bg-muted/20" : ""}
                      `}
                      onClick={onCriarEvento}
                    >
                      {/* Número do dia */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`
                          text-sm font-medium
                          ${isHoje ? "text-blue-600 font-semibold" : ""}
                        `}>
                          {dia.getDate()}
                        </span>
                        
                        {eventosDoDia.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-1">
                            +{eventosDoDia.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Eventos do dia */}
                      <div className="space-y-1">
                        {eventosDoDia.slice(0, 3).map((evento) => (
                          <div
                            key={evento.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventoClick(evento)
                            }}
                            className={`
                              text-xs p-1 rounded border cursor-pointer transition-colors
                              hover:opacity-80 flex items-center gap-1
                              ${getStatusCor(evento.status)}
                            `}
                          >
                            {getTipoIcon(evento.tipo)}
                            <span className="truncate flex-1">
                              {evento.titulo}
                            </span>
                            {evento.linkVideoconferencia && (
                              <Video className="h-2 w-2 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Indicador de criação rápida */}
                      {eventosDoDia.length === 0 && isMesAtual && (
                        <div className="text-center mt-2 opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="h-4 w-4 text-muted-foreground mx-auto" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 pt-4 border-t text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
              <span>Pendente</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span>Em andamento</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Bloqueio</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
