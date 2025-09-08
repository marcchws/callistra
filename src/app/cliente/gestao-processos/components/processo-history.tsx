"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock, 
  User, 
  Edit, 
  Plus, 
  Trash2, 
  Eye, 
  Shield,
  FileText
} from "lucide-react"
import { HistoricoAlteracao } from "../types"

interface ProcessoHistoryProps {
  historico: HistoricoAlteracao[]
  loading?: boolean
}

export function ProcessoHistory({ historico, loading = false }: ProcessoHistoryProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "criacao":
        return <Plus className="h-4 w-4" />
      case "edicao":
        return <Edit className="h-4 w-4" />
      case "exclusao":
        return <Trash2 className="h-4 w-4" />
      case "visualizacao":
        return <Eye className="h-4 w-4" />
      case "alteracao_acesso":
        return <Shield className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "criacao":
        return "Processo criado"
      case "edicao":
        return "Processo editado"
      case "exclusao":
        return "Processo excluído"
      case "visualizacao":
        return "Processo visualizado"
      case "alteracao_acesso":
        return "Acesso alterado"
      default:
        return "Ação realizada"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "criacao":
        return "bg-green-100 text-green-800"
      case "edicao":
        return "bg-blue-100 text-blue-800"
      case "exclusao":
        return "bg-red-100 text-red-800"
      case "alteracao_acesso":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return {
        date: date.toLocaleDateString("pt-BR"),
        time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      }
    } catch {
      return {
        date: dateTime,
        time: ""
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
          <CardDescription>Carregando histórico...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (historico.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
          <CardDescription>
            Todas as alterações realizadas neste processo serão registradas aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma alteração registrada ainda
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="historico">
      <CardHeader>
        <CardTitle>Histórico de Alterações</CardTitle>
        <CardDescription>
          Registro completo de todas as alterações realizadas neste processo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {historico.map((entrada) => {
              const { date, time } = formatDateTime(entrada.dataHora)
              
              return (
                <div 
                  key={entrada.id} 
                  className="border-l-2 border-gray-200 pl-4 relative"
                >
                  {/* Marcador do timeline */}
                  <div className="absolute -left-2 top-2 h-4 w-4 rounded-full bg-white border-2 border-gray-300" />
                  
                  <div className="space-y-2">
                    {/* Header da entrada */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Badge 
                          variant="secondary" 
                          className={`${getActionColor(entrada.acao)} gap-1`}
                        >
                          {getActionIcon(entrada.acao)}
                          {getActionLabel(entrada.acao)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date}
                        </div>
                        <div>{time}</div>
                      </div>
                    </div>

                    {/* Usuário */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{entrada.usuario}</span>
                    </div>

                    {/* Detalhes */}
                    {entrada.detalhes && (
                      <p className="text-sm text-muted-foreground">
                        {entrada.detalhes}
                      </p>
                    )}

                    {/* Campos alterados */}
                    {entrada.camposAlterados && entrada.camposAlterados.length > 0 && (
                      <div className="bg-gray-50 rounded-md p-3 space-y-2">
                        <p className="text-xs font-medium text-gray-600">
                          Campos alterados:
                        </p>
                        {entrada.camposAlterados.map((campo, index) => (
                          <div key={index} className="text-xs space-y-1">
                            <div className="font-medium text-gray-700">
                              {campo.campo}:
                            </div>
                            <div className="pl-3 space-y-0.5">
                              {campo.valorAnterior && (
                                <div className="text-red-600 line-through">
                                  Antes: {campo.valorAnterior}
                                </div>
                              )}
                              {campo.valorNovo && (
                                <div className="text-green-600">
                                  Depois: {campo.valorNovo}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}