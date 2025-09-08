"use client"

import { User, AuditoriaLog } from "../types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  UserPlus, 
  Edit, 
  Trash, 
  Power, 
  Clock,
  User as UserIcon
} from "lucide-react"

interface AuditHistoryModalProps {
  user: User | null
  logs: AuditoriaLog[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditHistoryModal({ 
  user, 
  logs, 
  open, 
  onOpenChange 
}: AuditHistoryModalProps) {
  if (!user) return null

  const getActionIcon = (acao: AuditoriaLog["acao"]) => {
    switch (acao) {
      case "CRIACAO":
        return <UserPlus className="h-4 w-4 text-green-600" />
      case "EDICAO":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "EXCLUSAO":
        return <Trash className="h-4 w-4 text-red-600" />
      case "ATIVACAO":
        return <Power className="h-4 w-4 text-green-600" />
      case "INATIVACAO":
        return <Power className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionLabel = (acao: AuditoriaLog["acao"]) => {
    switch (acao) {
      case "CRIACAO":
        return "Criação"
      case "EDICAO":
        return "Edição"
      case "EXCLUSAO":
        return "Exclusão"
      case "ATIVACAO":
        return "Ativação"
      case "INATIVACAO":
        return "Inativação"
      default:
        return acao
    }
  }

  const getActionColor = (acao: AuditoriaLog["acao"]) => {
    switch (acao) {
      case "CRIACAO":
      case "ATIVACAO":
        return "bg-green-100 text-green-700"
      case "EDICAO":
        return "bg-blue-100 text-blue-700"
      case "EXCLUSAO":
        return "bg-red-100 text-red-700"
      case "INATIVACAO":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('pt-BR')
    const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${dateStr} às ${timeStr}`
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2)
  }

  // Dados mockados de exemplo
  const mockLogs: AuditoriaLog[] = [
    {
      id: "1",
      usuarioId: user.id,
      acao: "CRIACAO",
      realizadoPor: "Admin",
      realizadoEm: user.criadoEm || new Date(),
      detalhes: "Usuário criado com sucesso"
    },
    ...(user.modificadoEm ? [{
      id: "2",
      usuarioId: user.id,
      acao: "EDICAO" as const,
      campo: "cargo",
      valorAnterior: "Advogado Júnior",
      valorNovo: user.cargo,
      realizadoPor: user.modificadoPor || "Admin",
      realizadoEm: user.modificadoEm,
      detalhes: "Cargo atualizado"
    }] : []),
    ...(user.inativadoEm ? [{
      id: "3",
      usuarioId: user.id,
      acao: "INATIVACAO" as const,
      realizadoPor: user.inativadoPor || "Admin",
      realizadoEm: user.inativadoEm,
      detalhes: "Usuário desativado. Atividades transferidas ao Admin Master."
    }] : [])
  ]

  const displayLogs = logs.length > 0 ? logs : mockLogs

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Histórico de Auditoria
          </DialogTitle>
          <DialogDescription>
            Histórico completo de alterações do usuário{" "}
            <span className="font-medium text-foreground">{user.nome}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum registro de auditoria encontrado
              </div>
            ) : (
              displayLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4 pb-4 border-b last:border-0"
                >
                  {/* Ícone da ação */}
                  <div className="shrink-0 mt-1">
                    {getActionIcon(log.acao)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={getActionColor(log.acao)}
                          >
                            {getActionLabel(log.acao)}
                          </Badge>
                          {log.campo && (
                            <span className="text-sm text-muted-foreground">
                              Campo: {log.campo}
                            </span>
                          )}
                        </div>
                        
                        {log.valorAnterior && log.valorNovo && (
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">De:</span>
                              <span className="font-mono text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                                {log.valorAnterior}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Para:</span>
                              <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                {log.valorNovo}
                              </span>
                            </div>
                          </div>
                        )}

                        {log.detalhes && (
                          <p className="text-sm text-muted-foreground">
                            {log.detalhes}
                          </p>
                        )}
                      </div>

                      <div className="text-right text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              {getInitials(log.realizadoPor).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{log.realizadoPor}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(log.realizadoEm)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
