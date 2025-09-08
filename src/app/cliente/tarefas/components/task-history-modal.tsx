"use client"

import { Task } from "../types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Clock, 
  User, 
  Calendar,
  FileText, 
  Paperclip, 
  History as HistoryIcon,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { mockClientes, mockProcessos, mockResponsaveis, mockAtividades, mockSubAtividades, mockSegmentos } from "../types"
import { Button } from "@/components/ui/button"

interface TaskHistoryModalProps {
  task: Task | null
  open: boolean
  onClose: () => void
}

export function TaskHistoryModal({ task, open, onClose }: TaskHistoryModalProps) {
  if (!task) return null

  const getClienteName = (clienteId: string) => {
    return mockClientes.find(c => c.value === clienteId)?.label || clienteId
  }

  const getProcessoName = (processoId: string) => {
    return mockProcessos.find(p => p.value === processoId)?.label || processoId
  }

  const getResponsavelName = (responsavelId: string) => {
    return mockResponsaveis.find(r => r.value === responsavelId)?.label || responsavelId
  }

  const getAtividadeName = (atividadeId?: string) => {
    if (!atividadeId) return "-"
    return mockAtividades.find(a => a.value === atividadeId)?.label || atividadeId
  }

  const getSubAtividadeName = (subId?: string) => {
    if (!subId) return "-"
    return mockSubAtividades.find(s => s.value === subId)?.label || subId
  }

  const getSegmentoName = (segId?: string) => {
    if (!segId) return "-"
    return mockSegmentos.find(s => s.value === segId)?.label || segId
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

  const getHistoryIcon = (action: string) => {
    switch (action) {
      case "criacao":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "edicao":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "remocao":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "status_change":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "anexo_adicionado":
        return <Paperclip className="h-4 w-4 text-purple-500" />
      case "anexo_removido":
        return <Paperclip className="h-4 w-4 text-gray-500" />
      default:
        return <HistoryIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.nomeAtividade}
            <Badge className={getPriorityColor(task.prioridade)}>
              {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização completa da tarefa e histórico de alterações
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="detalhes" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="anexos">
              Anexos {task.anexos && task.anexos.length > 0 && `(${task.anexos.length})`}
            </TabsTrigger>
            <TabsTrigger value="historico">
              Histórico {task.historico && task.historico.length > 0 && `(${task.historico.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {/* Status e Tipo */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(task.status)}
                      <span>{getStatusLabel(task.status)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Atividade</label>
                    <p className="mt-1">{getActivityTypeLabel(task.tipoAtividade)}</p>
                  </div>
                </div>

                <Separator />

                {/* Datas e Horários */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Período de Execução</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Início</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{format(new Date(task.dataInicio), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{task.horaInicio}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Término</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{format(new Date(task.dataFim), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{task.horaFim}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Vínculos */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Vínculos</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Responsável</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{getResponsavelName(task.responsavel)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Cliente</label>
                      <p className="mt-1">{getClienteName(task.cliente)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Processo</label>
                      <p className="mt-1">{getProcessoName(task.processo)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Descrição */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Descrição</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.descricao}</p>
                </div>

                {/* Categorização */}
                {(task.atividade || task.subAtividade || task.tipoSegmento) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-3">Categorização</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Atividade</label>
                          <p className="mt-1 text-sm">{getAtividadeName(task.atividade)}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Sub Atividade</label>
                          <p className="mt-1 text-sm">{getSubAtividadeName(task.subAtividade)}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Segmento</label>
                          <p className="mt-1 text-sm">{getSegmentoName(task.tipoSegmento)}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Valor */}
                {task.valor && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm text-muted-foreground">Valor</label>
                      <p className="mt-1 text-lg font-semibold">
                        R$ {task.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </>
                )}

                {/* Etiquetas */}
                {task.etiquetas && task.etiquetas.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm text-muted-foreground">Etiquetas</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.etiquetas.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Observações */}
                {task.observacoes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Observações</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.observacoes}</p>
                    </div>
                  </>
                )}

                {/* Metadados */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Informações do Sistema</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Criado em</label>
                      <p>{format(new Date(task.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Criado por</label>
                      <p>{task.criadoPor}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Última atualização</label>
                      <p>{format(new Date(task.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Atualizado por</label>
                      <p>{task.atualizadoPor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="anexos" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {task.anexos && task.anexos.length > 0 ? (
                <div className="space-y-3">
                  {task.anexos.map((anexo) => (
                    <div key={anexo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{anexo.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(anexo.tamanho)} • Enviado por {anexo.uploadedBy} em{" "}
                            {format(new Date(anexo.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Paperclip className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-muted-foreground">Nenhum anexo disponível</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              {task.historico && task.historico.length > 0 ? (
                <div className="space-y-4">
                  {task.historico.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getHistoryIcon(item.acao)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.descricao}</p>
                        <p className="text-sm text-muted-foreground">
                          Por {item.usuario} em{" "}
                          {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {item.acao === "status_change" && item.dadosAnteriores && item.dadosNovos && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <p>
                              <span className="font-medium">De:</span> {getStatusLabel(item.dadosAnteriores.status as string)}
                            </p>
                            <p>
                              <span className="font-medium">Para:</span> {getStatusLabel(item.dadosNovos.status as string)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <HistoryIcon className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-muted-foreground">Nenhum histórico disponível</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
