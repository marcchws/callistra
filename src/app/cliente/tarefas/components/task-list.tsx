"use client"

import { useState } from "react"
import { Task } from "../types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { mockClientes, mockProcessos, mockResponsaveis } from "../types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MoreHorizontal, Edit, Trash, Eye, Paperclip, History, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onView: (task: Task) => void
  canEdit: boolean
  canDelete: boolean
}

export function TaskList({ tasks, onEdit, onDelete, onView, canEdit, canDelete }: TaskListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getClienteName = (clienteId: string) => {
    return mockClientes.find(c => c.value === clienteId)?.label || clienteId
  }

  const getProcessoName = (processoId: string) => {
    return mockProcessos.find(p => p.value === processoId)?.label || processoId
  }

  const getResponsavelName = (responsavelId: string) => {
    return mockResponsaveis.find(r => r.value === responsavelId)?.label || responsavelId
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "nao_iniciada":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "em_andamento":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "concluida":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "nao_iniciada":
        return "Não iniciada"
      case "em_andamento":
        return "Em andamento"
      case "concluida":
        return "Concluída"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "baixa":
        return "bg-green-100 text-green-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "alta":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "administrativa":
        return "Administrativa"
      case "juridica":
        return "Jurídica"
      case "financeira":
        return "Financeira"
      case "atendimento":
        return "Atendimento"
      case "outros":
        return "Outros"
      default:
        return type
    }
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    setDeleteId(null)
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>
            {tasks.length} {tasks.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Nome da Atividade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Anexos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span className="text-sm">{getStatusLabel(task.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{task.nomeAtividade}</p>
                        {task.etiquetas && task.etiquetas.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {task.etiquetas.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {task.etiquetas.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{task.etiquetas.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {getActivityTypeLabel(task.tipoAtividade)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px]">
                        <p className="text-sm truncate">{getResponsavelName(task.responsavel)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px]">
                        <p className="text-sm truncate">{getClienteName(task.cliente)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[180px]">
                        <p className="text-sm truncate">{getProcessoName(task.processo)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", getPriorityColor(task.prioridade))}>
                        {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(task.dataFim + "T" + task.horaFim), "dd/MM/yyyy", { locale: ptBR })}</p>
                        <p className="text-muted-foreground">{task.horaFim}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.anexos && task.anexos.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{task.anexos.length}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onView(task)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          {task.historico && task.historico.length > 0 && (
                            <DropdownMenuItem onClick={() => onView(task)}>
                              <History className="mr-2 h-4 w-4" />
                              Ver Histórico
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {canEdit ? (
                            <DropdownMenuItem onClick={() => onEdit(task)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar (Sem permissão)
                            </DropdownMenuItem>
                          )}
                          {canDelete ? (
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(task.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>
                              <Trash className="mr-2 h-4 w-4" />
                              Remover (Sem permissão)
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
