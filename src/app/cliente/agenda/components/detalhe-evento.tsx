"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Clock,
  Users,
  Video,
  FileText,
  Ban,
  Edit,
  X,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EventoAgenda, TipoEvento, StatusEvento, RespostaParticipante } from "../types"
import { useAgenda } from "../use-agenda"

interface DetalheEventoProps {
  evento: EventoAgenda
  onEditar: () => void
  onFechar: () => void
}

export function DetalheEvento({ evento, onEditar, onFechar }: DetalheEventoProps) {
  const { configuracoes, responderEvento, loading } = useAgenda()
  const [respondendoEvento, setRespondendoEvento] = useState(false)

  const getTipoIcon = (tipo: TipoEvento) => {
    switch (tipo) {
      case "reuniao":
        return <Users className="h-5 w-5" />
      case "tarefa":
        return <FileText className="h-5 w-5" />
      case "bloqueio":
        return <Ban className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getTipoLabel = (tipo: TipoEvento) => {
    switch (tipo) {
      case "evento": return "Evento"
      case "reuniao": return "Reunião"
      case "tarefa": return "Tarefa"
      case "bloqueio": return "Bloqueio de Agenda"
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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "nao":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "talvez":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRespostaLabel = (resposta: RespostaParticipante) => {
    switch (resposta) {
      case "sim": return "Confirmado"
      case "nao": return "Não vai"
      case "talvez": return "Talvez"
      default: return "Pendente"
    }
  }

  const formatarDataHora = (dataHora: string) => {
    const data = new Date(dataHora)
    
    const opcoesTempo = configuracoes.formatoDataHora === "12h" 
      ? { hour: "numeric" as const, minute: "2-digit" as const, hour12: true }
      : { hour: "2-digit" as const, minute: "2-digit" as const, hour12: false }
    
    return {
      data: data.toLocaleDateString("pt-BR", { 
        weekday: "long", 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      }),
      hora: data.toLocaleTimeString("pt-BR", opcoesTempo)
    }
  }

  const calcularDuracao = () => {
    const inicio = new Date(evento.dataHoraInicio)
    const fim = new Date(evento.dataHoraTermino)
    const duracaoMs = fim.getTime() - inicio.getTime()
    const horas = Math.floor(duracaoMs / (1000 * 60 * 60))
    const minutos = Math.floor((duracaoMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (horas > 0) {
      return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`
    }
    return `${minutos}min`
  }

  const handleResponder = async (resposta: "sim" | "nao" | "talvez") => {
    setRespondendoEvento(true)
    try {
      await responderEvento(evento.id, resposta)
    } finally {
      setRespondendoEvento(false)
    }
  }

  // Verificar se usuário atual é participante e precisa responder
  const usuarioParticipante = evento.participantes.find(p => p.email === "usuario@atual.com")
  const precisaResponder = evento.respostaObrigatoria && usuarioParticipante?.resposta === "pendente"

  const inicioFormatado = formatarDataHora(evento.dataHoraInicio)
  const fimFormatado = formatarDataHora(evento.dataHoraTermino)
  const duracao = calcularDuracao()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {getTipoIcon(evento.tipo)}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight">
                {evento.titulo}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                {getStatusIcon(evento.status)}
                <span>{getTipoLabel(evento.tipo)} • {getStatusLabel(evento.status)}</span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditar}
              className="gap-1"
            >
              <Edit className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFechar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alerta de resposta obrigatória */}
        {precisaResponder && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Resposta obrigatória pendente</p>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Você precisa confirmar sua presença neste evento.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => handleResponder("sim")}
                disabled={respondendoEvento}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Vou participar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResponder("talvez")}
                disabled={respondendoEvento}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Talvez
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResponder("nao")}
                disabled={respondendoEvento}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Não vou
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Data e Horário */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium capitalize">{inicioFormatado.data}</p>
              <p className="text-muted-foreground">
                {inicioFormatado.hora} - {fimFormatado.hora} ({duracao})
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Participantes */}
        {evento.participantes.length > 0 && evento.tipo !== "bloqueio" && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Participantes ({evento.participantes.length})
                </span>
                {evento.respostaObrigatoria && (
                  <Badge variant="outline" className="text-xs">
                    Resposta obrigatória
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 pl-6">
                {evento.participantes.map((participante, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{participante.nome}</span>
                      <span className="text-muted-foreground">({participante.email})</span>
                    </div>
                    
                    {evento.respostaObrigatoria && (
                      <div className="flex items-center gap-1">
                        {getRespostaIcon(participante.resposta)}
                        <span className="text-xs">{getRespostaLabel(participante.resposta)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Links e Recursos */}
        {evento.linkVideoconferencia && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Videoconferência</span>
              </div>
              
              <div className="pl-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(evento.linkVideoconferencia, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                  Participar da reunião
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Cliente e Processo */}
        {(evento.clienteId || evento.processoId) && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Relacionado</span>
              </div>
              
              <div className="space-y-1 pl-6 text-sm">
                {evento.clienteId && (
                  <p><strong>Cliente:</strong> João Silva</p>
                )}
                {evento.processoId && (
                  <p><strong>Processo:</strong> Processo 001/2024</p>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Descrição */}
        {evento.descricao && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {evento.tipo === "bloqueio" ? "Motivo do Bloqueio" : "Descrição"}
                </span>
              </div>
              
              <div className="pl-6">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {evento.descricao}
                </p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Anexos */}
        {evento.anexos.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Anexos ({evento.anexos.length})
                </span>
              </div>
              
              <div className="space-y-1 pl-6">
                {evento.anexos.map((anexo) => (
                  <div key={anexo.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Paperclip className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{anexo.nome}</span>
                      <span className="text-muted-foreground text-xs flex-shrink-0">
                        ({(anexo.tamanho / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 flex-shrink-0"
                    >
                      <Download className="h-3 w-3" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Recorrência */}
        {evento.recorrencia && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recorrência</span>
              </div>
              
              <div className="pl-6 text-sm text-muted-foreground">
                <p>
                  Repete {evento.recorrencia.tipo} a cada {evento.recorrencia.intervalo} 
                  {evento.recorrencia.intervalo > 1 ? ` ${evento.recorrencia.tipo}s` : ` ${evento.recorrencia.tipo}`}
                </p>
                {evento.recorrencia.fimRecorrencia && (
                  <p>
                    Até {new Date(evento.recorrencia.fimRecorrencia).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Informações de Auditoria */}
        <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
          <p><strong>Criado por:</strong> {evento.criadoPor}</p>
          <p><strong>Data de criação:</strong> {new Date(evento.criadoEm).toLocaleString("pt-BR")}</p>
          {evento.alteradoPor && (
            <>
              <p><strong>Última alteração por:</strong> {evento.alteradoPor}</p>
              <p><strong>Data da alteração:</strong> {new Date(evento.alteradoEm!).toLocaleString("pt-BR")}</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
