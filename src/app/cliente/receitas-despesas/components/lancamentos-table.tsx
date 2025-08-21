"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Edit,
  Trash2,
  Paperclip,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { LancamentoFinanceiro } from "../types"

interface LancamentosTableProps {
  lancamentos: LancamentoFinanceiro[]
  loading: boolean
  onEditar: (lancamento: LancamentoFinanceiro) => void
  onRemover: (id: string) => void
  onRenegociar: (lancamento: LancamentoFinanceiro) => void
  onAnexar: (lancamentoId: string) => void
}

export function LancamentosTable({
  lancamentos,
  loading,
  onEditar,
  onRemover,
  onRenegociar,
  onAnexar
}: LancamentosTableProps) {
  const [idParaRemover, setIdParaRemover] = useState<string | null>(null)

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const obterStatusBadge = (lancamento: LancamentoFinanceiro) => {
    if (lancamento.status === "historico") {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Pago
        </Badge>
      )
    }

    // Verificar se está vencido
    const hoje = new Date()
    const vencido = lancamento.dataVencimento < hoje

    if (vencido) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Vencido
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="gap-1">
        Pendente
      </Badge>
    )
  }

  const obterCorLinha = (lancamento: LancamentoFinanceiro) => {
    if (lancamento.status === "historico") {
      return ""
    }

    const hoje = new Date()
    const vencido = lancamento.dataVencimento < hoje

    return vencido ? "bg-red-50 border-l-4 border-l-red-500" : ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Carregando lançamentos...</p>
        </div>
      </div>
    )
  }

  if (lancamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum lançamento encontrado</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria/Subcategoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Beneficiário</TableHead>
              <TableHead>Anexos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamentos.map((lancamento) => (
              <TableRow 
                key={lancamento.id} 
                className={obterCorLinha(lancamento)}
              >
                <TableCell>
                  <Badge 
                    variant={lancamento.tipo === "receita" ? "default" : "secondary"}
                    className={lancamento.tipo === "receita" ? "bg-green-600" : "bg-orange-600"}
                  >
                    {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{lancamento.categoria}</div>
                    <div className="text-xs text-muted-foreground">{lancamento.subcategoria}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className={`font-medium ${
                    lancamento.tipo === "receita" ? "text-green-600" : "text-orange-600"
                  }`}>
                    {formatarMoeda(lancamento.valor)}
                  </span>
                </TableCell>
                
                <TableCell>
                  {format(lancamento.dataVencimento, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                
                <TableCell>
                  {lancamento.dataPagamento ? (
                    format(lancamento.dataPagamento, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {obterStatusBadge(lancamento)}
                </TableCell>
                
                <TableCell>
                  {lancamento.processo ? (
                    <Badge variant="outline" className="text-xs">
                      {lancamento.processo}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {lancamento.beneficiario || <span className="text-muted-foreground">-</span>}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    {lancamento.anexos && lancamento.anexos.length > 0 ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Paperclip className="h-3 w-3" />
                            {lancamento.anexos.length}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{lancamento.anexos.length} anexo(s)</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAnexar(lancamento.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* Visualizar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visualizar detalhes</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Editar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditar(lancamento)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar lançamento</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Renegociar - apenas para pendentes */}
                    {lancamento.status === "pendente" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRenegociar(lancamento)}
                            className="h-7 w-7 p-0"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Renegociar conta</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Remover */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIdParaRemover(lancamento.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remover lançamento</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de remoção */}
      <AlertDialog open={!!idParaRemover} onOpenChange={() => setIdParaRemover(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este lançamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (idParaRemover) {
                  onRemover(idParaRemover)
                  setIdParaRemover(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
