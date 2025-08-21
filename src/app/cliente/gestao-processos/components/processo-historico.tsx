"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileText, 
  Edit, 
  Trash2, 
  Clock,
  User
} from "lucide-react"
import { Processo, ProcessoHistorico } from "../types"
import { 
  formatarDataHora,
  gerarTextoAuditoria,
  extrairIniciais
} from "../utils"

interface ProcessoHistoricoProps {
  open: boolean
  onClose: () => void
  processo: Processo | null
}

export function ProcessoHistoricoComponent({ 
  open, 
  onClose, 
  processo 
}: ProcessoHistoricoProps) {
  
  // Simular dados de histórico para o protótipo (AC9)
  const historicoSimulado: ProcessoHistorico[] = processo ? [
    {
      id: "1",
      processoId: processo.id,
      acao: "criacao",
      valoresNovos: processo,
      usuario: processo.criadoPor,
      dataHora: processo.criadoEm,
      observacoes: "Processo criado no sistema"
    },
    {
      id: "2", 
      processoId: processo.id,
      acao: "edicao",
      camposAlterados: ["observacoes", "valorCausa"],
      valoresAnteriores: {
        observacoes: "Observação anterior",
        valorCausa: 45000
      },
      valoresNovos: {
        observacoes: processo.observacoes,
        valorCausa: processo.valorCausa
      },
      usuario: processo.atualizadoPor,
      dataHora: processo.atualizadoEm,
      observacoes: "Atualização de valores e observações"
    }
  ] : []

  const getIconeAcao = (acao: string) => {
    switch (acao) {
      case 'criacao':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'edicao':
        return <Edit className="h-4 w-4 text-blue-600" />
      case 'exclusao':
        return <Trash2 className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getCorAcao = (acao: string) => {
    switch (acao) {
      case 'criacao':
        return 'default' as const
      case 'edicao':
        return 'secondary' as const
      case 'exclusao':
        return 'destructive' as const
      default:
        return 'outline' as const
    }
  }

  const getTextoAcao = (acao: string) => {
    switch (acao) {
      case 'criacao':
        return 'Criação'
      case 'edicao':
        return 'Edição'
      case 'exclusao':
        return 'Exclusão'
      default:
        return 'Ação'
    }
  }

  const formatarCampoAlterado = (campo: string) => {
    const labels: Record<string, string> = {
      pasta: "Pasta",
      nomeCliente: "Nome do Cliente",
      qualificacaoCliente: "Qualificação do Cliente",
      outrosEnvolvidos: "Outros Envolvidos",
      qualificacaoEnvolvidos: "Qualificação dos Envolvidos",
      tituloProcesso: "Título do Processo",
      instancia: "Instância",
      numero: "Número do Processo",
      juizo: "Juízo",
      vara: "Vara",
      foro: "Foro",
      acao: "Ação",
      tribunal: "Tribunal",
      linkTribunal: "Link do Tribunal",
      objeto: "Objeto",
      valorCausa: "Valor da Causa",
      distribuidoEm: "Distribuído em",
      valorCondenacao: "Valor da Condenação",
      observacoes: "Observações",
      responsavel: "Responsável",
      honorarios: "Honorários",
      acesso: "Nível de Acesso"
    }
    return labels[campo] || campo
  }

  const formatarValor = (valor: any) => {
    if (valor === null || valor === undefined) return "—"
    if (typeof valor === "number") return valor.toLocaleString('pt-BR')
    if (typeof valor === "boolean") return valor ? "Sim" : "Não"
    if (valor instanceof Date) return formatarDataHora(valor)
    if (Array.isArray(valor)) return valor.join(", ")
    return String(valor)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Alterações
          </DialogTitle>
          <DialogDescription>
            {processo && (
              <>
                Processo: <strong>{processo.pasta || processo.nomeCliente}</strong>
                {processo.numero && (
                  <> • Número: <strong>{processo.numero}</strong></>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {historicoSimulado.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum histórico de alterações encontrado
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoSimulado.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getIconeAcao(item.acao)}
                          <Badge variant={getCorAcao(item.acao)}>
                            {getTextoAcao(item.acao)}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                            {extrairIniciais(item.usuario)}
                          </div>
                          <span className="text-sm">{item.usuario}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {formatarDataHora(item.dataHora)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-2 max-w-md">
                          {item.observacoes && (
                            <div className="text-sm text-muted-foreground">
                              {item.observacoes}
                            </div>
                          )}
                          
                          {item.camposAlterados && item.camposAlterados.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground">
                                Campos alterados:
                              </div>
                              {item.camposAlterados.map((campo) => (
                                <div key={campo} className="text-xs bg-gray-50 p-2 rounded">
                                  <div className="font-medium">
                                    {formatarCampoAlterado(campo)}
                                  </div>
                                  {item.valoresAnteriores?.[campo as keyof Processo] !== undefined && (
                                    <div className="text-red-600">
                                      De: {formatarValor(item.valoresAnteriores[campo as keyof Processo])}
                                    </div>
                                  )}
                                  {item.valoresNovos?.[campo as keyof Processo] !== undefined && (
                                    <div className="text-green-600">
                                      Para: {formatarValor(item.valoresNovos[campo as keyof Processo])}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {item.acao === 'criacao' && (
                            <div className="text-xs text-green-600">
                              ✓ Processo criado com sucesso
                            </div>
                          )}

                          {item.acao === 'exclusao' && (
                            <div className="text-xs text-red-600">
                              ⚠ Processo removido do sistema
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
