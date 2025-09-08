"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  prioridade: "Alta" | "Média" | "Baixa"
  status: "Pendente" | "Em andamento" | "Concluída"
  prazo: Date
  responsavel?: string
  clienteNome?: string
  processoNumero?: string
  concluida: boolean
}

// Mock de tarefas para desenvolvimento
const mockTarefas: Tarefa[] = [
  {
    id: "t1",
    titulo: "Elaborar Petição Inicial",
    descricao: "Preparar petição para novo processo trabalhista",
    prioridade: "Alta",
    status: "Em andamento",
    prazo: new Date(2025, 8, 25), // Tarefa atrasada - deveria ter sido concluída antes de 01/09/2025
    responsavel: "João Silva",
    clienteNome: "Tech Solutions Ltda",
    concluida: false
  },
  {
    id: "t2",
    titulo: "Revisar Contrato de Prestação",
    descricao: "Análise e revisão de cláusulas contratuais",
    prioridade: "Média",
    status: "Pendente",
    prazo: new Date(2025, 8, 30), // Tarefa em dia - prazo próximo
    responsavel: "Maria Santos",
    processoNumero: "0001234-45.2024.8.26.0100",
    concluida: false
  },
  {
    id: "t3",
    titulo: "Enviar documentos ao cliente",
    prioridade: "Baixa",
    status: "Pendente",
    prazo: new Date(2025, 9, 2), // Tarefa futura - prazo confortável
    clienteNome: "Silva Empreendimentos",
    concluida: false
  },
  {
    id: "t4",
    titulo: "Protocolar recurso",
    descricao: "Prazo fatal - Recurso de apelação",
    prioridade: "Alta",
    status: "Pendente",
    prazo: new Date(2025, 8, 28), // Tarefa urgente - prazo vencido
    processoNumero: "0002345-56.2024.5.02.0001",
    concluida: false
  },
  {
    id: "t5",
    titulo: "Audiência Trabalhista Urgente",
    descricao: "Audiência marcada para hoje às 10:00",
    prioridade: "Alta",
    status: "Em andamento",
    prazo: new Date(2025, 8, 31), // Tarefa para hoje - urgente
    responsavel: "João Silva",
    clienteNome: "Tech Solutions Ltda",
    processoNumero: "0003456-67.2025.5.02.0001",
    concluida: false
  },
  {
    id: "t6",
    titulo: "Preparar Relatório Mensal",
    descricao: "Relatório de atividades para diretoria",
    prioridade: "Média",
    status: "Pendente",
    prazo: new Date(2025, 9, 5), // Tarefa futura - prazo confortável
    responsavel: "Maria Santos",
    concluida: false
  }
]

interface TaskSidebarProps {
  selectedDate?: Date
  onTaskClick?: (tarefa: Tarefa) => void
}

export function TaskSidebar({ selectedDate, onTaskClick }: TaskSidebarProps) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(mockTarefas)
  const [filtro, setFiltro] = useState<"todas" | "hoje" | "semana">("hoje")

  // Filtrar tarefas baseado no filtro selecionado
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === "todas") return true
    
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    const prazoTarefa = new Date(tarefa.prazo)
    prazoTarefa.setHours(0, 0, 0, 0)
    
    if (filtro === "hoje") {
      return prazoTarefa.getTime() === hoje.getTime()
    }
    
    if (filtro === "semana") {
      const umaSemana = new Date(hoje)
      umaSemana.setDate(umaSemana.getDate() + 7)
      return prazoTarefa >= hoje && prazoTarefa <= umaSemana
    }
    
    return false
  })

  // Ordenar por prioridade e prazo
  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
    const prioridadeOrdem = { "Alta": 0, "Média": 1, "Baixa": 2 }
    if (prioridadeOrdem[a.prioridade] !== prioridadeOrdem[b.prioridade]) {
      return prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
    }
    return a.prazo.getTime() - b.prazo.getTime()
  })

  const toggleTarefa = (id: string) => {
    setTarefas(prev => prev.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida, status: !t.concluida ? "Concluída" : "Pendente" } : t
    ))
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-700 border-red-200"
      case "Média":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Baixa":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluída":
        return CheckCircle2
      case "Em andamento":
        return Clock
      default:
        return Circle
    }
  }

  const isPrazoVencido = (prazo: Date) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const prazoDia = new Date(prazo)
    prazoDia.setHours(0, 0, 0, 0)
    return prazoDia < hoje
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <CardTitle className="text-lg font-medium">Atividades e Tarefas</CardTitle>
          
          {/* Filtros rápidos */}
          <div className="flex gap-2">
            <Button
              variant={filtro === "hoje" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro("hoje")}
              className={filtro === "hoje" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Hoje
            </Button>
            <Button
              variant={filtro === "semana" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro("semana")}
              className={filtro === "semana" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Esta Semana
            </Button>
            <Button
              variant={filtro === "todas" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro("todas")}
              className={filtro === "todas" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Todas
            </Button>
          </div>

          {/* Contador de tarefas */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {tarefasOrdenadas.length} tarefa(s)
            </span>
            <span className="text-muted-foreground">
              {tarefasOrdenadas.filter(t => t.concluida).length} concluída(s)
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)] px-4 pb-4">
          <div className="space-y-3">
            {tarefasOrdenadas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Nenhuma tarefa para este período</p>
              </div>
            ) : (
              tarefasOrdenadas.map(tarefa => {
                const StatusIcon = getStatusIcon(tarefa.status)
                const vencido = isPrazoVencido(tarefa.prazo)
                
                return (
                  <div
                    key={tarefa.id}
                    className={cn(
                      "rounded-lg border p-3 space-y-2 cursor-pointer transition-all",
                      "hover:shadow-md hover:border-blue-300",
                      tarefa.concluida && "opacity-60 bg-gray-50"
                    )}
                    onClick={() => onTaskClick?.(tarefa)}
                  >
                    {/* Header da tarefa */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={tarefa.concluida}
                        onCheckedChange={() => toggleTarefa(tarefa.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "text-sm font-medium",
                            tarefa.concluida && "line-through"
                          )}>
                            {tarefa.titulo}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getPrioridadeColor(tarefa.prioridade))}
                          >
                            {tarefa.prioridade}
                          </Badge>
                        </div>
                        
                        {tarefa.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {tarefa.descricao}
                          </p>
                        )}

                        {/* Metadados */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className={cn(
                            "flex items-center gap-1",
                            vencido && !tarefa.concluida && "text-red-600 font-medium"
                          )}>
                            {vencido && !tarefa.concluida && (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <Calendar className="h-3 w-3" />
                            {format(tarefa.prazo, "dd/MM", { locale: ptBR })}
                          </div>
                          
                          {tarefa.responsavel && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {tarefa.responsavel}
                            </div>
                          )}
                          
                          {tarefa.processoNumero && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">
                                {tarefa.processoNumero}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Cliente */}
                        {tarefa.clienteNome && (
                          <div className="text-xs text-blue-600">
                            {tarefa.clienteNome}
                          </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center gap-1">
                          <StatusIcon className={cn(
                            "h-3 w-3",
                            tarefa.status === "Concluída" && "text-green-600",
                            tarefa.status === "Em andamento" && "text-blue-600",
                            tarefa.status === "Pendente" && "text-gray-400"
                          )} />
                          <span className="text-xs text-muted-foreground">
                            {tarefa.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
