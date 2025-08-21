"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  Settings,
  Clock,
  Users,
  Calendar,
  Video,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban
} from "lucide-react"
import { useAgenda } from "./use-agenda"
import { CriarEventoDialog } from "./components/criar-evento-dialog"
import { EditarEventoDialog } from "./components/editar-evento-dialog"
import { FiltrosDialog } from "./components/filtros-dialog"
import { ConfiguracoesDialog } from "./components/configuracoes-dialog"
import { CalendarioMensal } from "./components/calendario-mensal"
import { CalendarioDiario } from "./components/calendario-diario"
import { ListaEventos } from "./components/lista-eventos"
import { DetalheEvento } from "./components/detalhe-evento"
import { TipoEvento, StatusEvento } from "./types"

export default function AgendaPage() {
  const {
    eventos,
    eventoSelecionado,
    loading,
    error,
    filtros,
    modoVisualizacao,
    buscarEventos,
    setEventoSelecionado,
    setModoVisualizacao
  } = useAgenda()

  const [dialogCriarAberto, setDialogCriarAberto] = useState(false)
  const [dialogEditarAberto, setDialogEditarAberto] = useState(false)
  const [dialogFiltrosAberto, setDialogFiltrosAberto] = useState(false)
  const [dialogConfiguracoesAberto, setDialogConfiguracoesAberto] = useState(false)
  const [termoBusca, setTermoBusca] = useState("")

  const handleBusca = (termo: string) => {
    setTermoBusca(termo)
    buscarEventos(termo)
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

  const getTipoLabel = (tipo: TipoEvento) => {
    switch (tipo) {
      case "evento":
        return "Evento"
      case "reuniao":
        return "Reunião"
      case "tarefa":
        return "Tarefa"
      case "bloqueio":
        return "Bloqueio"
    }
  }

  const getStatusLabel = (status: StatusEvento) => {
    switch (status) {
      case "pendente":
        return "Pendente"
      case "em_andamento":
        return "Em andamento"
      case "concluido":
        return "Concluído"
      case "bloqueio":
        return "Bloqueio"
    }
  }

  const eventosComRespostaPendente = eventos.filter(evento => 
    evento.respostaObrigatoria && 
    evento.participantes.some(p => p.resposta === "pendente")
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie compromissos, reuniões, tarefas e bloqueios de agenda com controle completo e notificações.
        </p>
      </div>

      {/* Alertas de resposta pendente */}
      {eventosComRespostaPendente.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Respostas Pendentes
            </CardTitle>
            <CardDescription className="text-amber-700">
              Você tem {eventosComRespostaPendente.length} evento(s) aguardando resposta obrigatória
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eventosComRespostaPendente.slice(0, 3).map(evento => (
                <div key={evento.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{evento.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(evento.dataHoraInicio).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(evento.dataHoraInicio).toLocaleTimeString("pt-BR", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEventoSelecionado(evento)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Responder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Busca e Filtros */}
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  className="pl-9 focus:ring-blue-500"
                  value={termoBusca}
                  onChange={(e) => handleBusca(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setDialogFiltrosAberto(true)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {(filtros.status.length + filtros.tipo.length + filtros.respostaParticipante.length) > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {filtros.status.length + filtros.tipo.length + filtros.respostaParticipante.length}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDialogConfiguracoesAberto(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Controles de Visualização */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={modoVisualizacao === "mensal" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setModoVisualizacao("mensal")}
                  className={modoVisualizacao === "mensal" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Mensal
                </Button>
                <Button
                  variant={modoVisualizacao === "diaria" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setModoVisualizacao("diaria")}
                  className={modoVisualizacao === "diaria" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Diária
                </Button>
              </div>
              
              <Button 
                onClick={() => setDialogCriarAberto(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                Novo Evento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Principal */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendário Principal */}
        <div className="lg:col-span-3">
          {modoVisualizacao === "mensal" ? (
            <CalendarioMensal 
              eventos={eventos}
              onEventoClick={setEventoSelecionado}
              onCriarEvento={() => setDialogCriarAberto(true)}
            />
          ) : (
            <CalendarioDiario 
              eventos={eventos}
              onEventoClick={setEventoSelecionado}
              onCriarEvento={() => setDialogCriarAberto(true)}
            />
          )}
        </div>

        {/* Sidebar com Lista de Eventos e Detalhes */}
        <div className="space-y-6">
          {/* Lista de Eventos do Dia */}
          <ListaEventos 
            eventos={eventos}
            onEventoClick={setEventoSelecionado}
            onEditarEvento={(evento) => {
              setEventoSelecionado(evento)
              setDialogEditarAberto(true)
            }}
          />

          {/* Detalhe do Evento Selecionado */}
          {eventoSelecionado && (
            <DetalheEvento 
              evento={eventoSelecionado}
              onEditar={() => setDialogEditarAberto(true)}
              onFechar={() => setEventoSelecionado(null)}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CriarEventoDialog 
        open={dialogCriarAberto}
        onOpenChange={setDialogCriarAberto}
      />

      {eventoSelecionado && (
        <EditarEventoDialog 
          open={dialogEditarAberto}
          onOpenChange={setDialogEditarAberto}
          evento={eventoSelecionado}
        />
      )}

      <FiltrosDialog 
        open={dialogFiltrosAberto}
        onOpenChange={setDialogFiltrosAberto}
        filtros={filtros}
      />

      <ConfiguracoesDialog 
        open={dialogConfiguracoesAberto}
        onOpenChange={setDialogConfiguracoesAberto}
      />

      {/* Estado de Erro */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
