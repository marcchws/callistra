import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Paperclip, Calendar, Clock, User, AlertCircle } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Tarefa } from "../types"

interface TarefaTableProps {
  tarefas: Tarefa[]
  loading: boolean
  onEdit: (tarefa: Tarefa) => void
  onDelete: (id: string) => void
  getClienteNome: (id: string) => string
  getProcessoNumero: (id: string) => string
  getUsuarioNome: (id: string) => string
}

export function TarefaTable({
  tarefas,
  loading,
  onEdit,
  onDelete,
  getClienteNome,
  getProcessoNumero,
  getUsuarioNome
}: TarefaTableProps) {
  const [tarefaToDelete, setTarefaToDelete] = useState<string | null>(null)

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      baixa: "secondary",
      media: "outline", 
      alta: "destructive"
    }
    
    const labels = {
      baixa: "Baixa",
      media: "Média", 
      alta: "Alta"
    }
    
    return (
      <Badge variant={variants[prioridade as keyof typeof variants] as any}>
        {labels[prioridade as keyof typeof labels]}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      nao_iniciada: "secondary",
      em_andamento: "default",
      concluida: "outline"
    }
    
    const labels = {
      nao_iniciada: "Não Iniciada",
      em_andamento: "Em Andamento", 
      concluida: "Concluída"
    }
    
    const colors = {
      nao_iniciada: "bg-gray-100 text-gray-800",
      em_andamento: "bg-blue-100 text-blue-800",
      concluida: "bg-green-100 text-green-800"
    }
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR')
  }

  const handleDeleteConfirm = () => {
    if (tarefaToDelete) {
      onDelete(tarefaToDelete)
      setTarefaToDelete(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-muted-foreground">Carregando tarefas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Lista de Tarefas</CardTitle>
              <CardDescription>
                {tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''} encontrada{tarefas.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tarefas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Não há tarefas que correspondam aos filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Anexos</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tarefas.map((tarefa) => (
                    <TableRow key={tarefa.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{tarefa.nomeAtividade}</div>
                          <div className="text-sm text-muted-foreground">
                            {tarefa.tipoAtividade}
                          </div>
                          {tarefa.etiquetas && tarefa.etiquetas.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {tarefa.etiquetas.slice(0, 2).map((etiqueta, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {etiqueta}
                                </Badge>
                              ))}
                              {tarefa.etiquetas.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tarefa.etiquetas.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{getUsuarioNome(tarefa.responsavel)}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{getClienteNome(tarefa.cliente)}</span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm font-mono">{getProcessoNumero(tarefa.processo)}</span>
                      </TableCell>
                      
                      <TableCell>
                        {getPrioridadeBadge(tarefa.prioridade)}
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(tarefa.status)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(tarefa.dataFim)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{tarefa.horaFim}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {tarefa.anexos && tarefa.anexos.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{tarefa.anexos.length}</span>
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(tarefa.atualizadoEm)}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEdit(tarefa)}
                              className="gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setTarefaToDelete(tarefa.id)}
                              className="gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CONFIRMAÇÃO DE EXCLUSÃO - Cenário 3 + Cenário 9 (Permissões) */}
      <AlertDialog open={!!tarefaToDelete} onOpenChange={(open) => !open && setTarefaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa será removida permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}