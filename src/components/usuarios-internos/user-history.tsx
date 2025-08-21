"use client"

// Componente de Histórico de Alterações
// Atende ao requisito de rastreabilidade completa

import { HistoricoAlteracao } from "@/lib/usuarios-internos/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  UserPlus, 
  Edit, 
  Power, 
  Trash, 
  Clock,
  User
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface UserHistoryProps {
  historico: HistoricoAlteracao[]
  nomeUsuario?: string
}

export function UserHistory({ historico, nomeUsuario }: UserHistoryProps) {
  const getActionIcon = (acao: HistoricoAlteracao['acao']) => {
    const icons = {
      criacao: <UserPlus className="h-4 w-4" />,
      edicao: <Edit className="h-4 w-4" />,
      desativacao: <Power className="h-4 w-4 text-destructive" />,
      ativacao: <Power className="h-4 w-4 text-green-600" />,
      exclusao: <Trash className="h-4 w-4 text-destructive" />
    }
    return icons[acao]
  }

  const getActionLabel = (acao: HistoricoAlteracao['acao']) => {
    const labels = {
      criacao: 'Criação',
      edicao: 'Edição',
      desativacao: 'Desativação',
      ativacao: 'Ativação',
      exclusao: 'Exclusão'
    }
    return labels[acao]
  }

  const getActionColor = (acao: HistoricoAlteracao['acao']) => {
    const colors = {
      criacao: 'bg-green-100 text-green-700',
      edicao: 'bg-blue-100 text-blue-700',
      desativacao: 'bg-red-100 text-red-700',
      ativacao: 'bg-green-100 text-green-700',
      exclusao: 'bg-red-100 text-red-700'
    }
    return colors[acao]
  }

  if (historico.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma alteração registrada</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Alterações
          {nomeUsuario && (
            <span className="text-sm font-normal text-muted-foreground">
              - {nomeUsuario}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {historico.map((item) => (
              <div 
                key={item.id}
                className="relative pl-6 pb-4 border-b last:border-0"
              >
                {/* Linha do tempo */}
                <div className="absolute left-0 top-0 h-full w-px bg-border" />
                <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-blue-600" />
                
                <div className="space-y-2">
                  {/* Header da alteração */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(item.acao)}
                      <Badge 
                        variant="secondary" 
                        className={getActionColor(item.acao)}
                      >
                        {getActionLabel(item.acao)}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.realizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>

                  {/* Detalhes da alteração */}
                  <div className="space-y-1">
                    {item.campoAlterado && (
                      <p className="text-sm">
                        <span className="font-medium">Campo alterado:</span> {item.campoAlterado}
                      </p>
                    )}
                    
                    {item.valorAnterior && item.valorNovo && (
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">De:</span>{' '}
                          <span className="text-muted-foreground line-through">
                            {item.valorAnterior}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Para:</span>{' '}
                          <span className="text-green-600">{item.valorNovo}</span>
                        </p>
                      </div>
                    )}
                    
                    {item.detalhes && (
                      <p className="text-sm text-muted-foreground italic">
                        {item.detalhes}
                      </p>
                    )}
                    
                    {/* Quem realizou a ação */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <User className="h-3 w-3" />
                      <span>Por {item.realizadoPor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}