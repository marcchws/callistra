"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Download, 
  Trash2,
  DollarSign,
  FileText,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Documento, 
  OpcoesExportacao,
  TIPO_DOCUMENTO_LABELS,
  STATUS_PAGAMENTO_LABELS,
  FORMATO_PAGAMENTO_LABELS
} from "../types"

interface TabelaDocumentosProps {
  documentos: Documento[]
  loading: boolean
  onEditar: (documento: Documento) => void
  onExcluir: (id: string) => void
  onExportar: (documentoId: string, opcoes: OpcoesExportacao) => void
  onVisualizarFinanceiro: (documento: Documento) => void
  onRenegociar: (documento: Documento) => void
}

export function TabelaDocumentos({
  documentos,
  loading,
  onEditar,
  onExcluir,
  onExportar,
  onVisualizarFinanceiro,
  onRenegociar
}: TabelaDocumentosProps) {
  const [documentoParaExcluir, setDocumentoParaExcluir] = useState<Documento | null>(null)

  const confirmarExclusao = () => {
    if (documentoParaExcluir) {
      onExcluir(documentoParaExcluir.id!)
      setDocumentoParaExcluir(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pago":
        return "default" // Verde
      case "pendente":
        return "secondary" // Amarelo/Neutro
      case "inadimplente":
        return "destructive" // Vermelho
      default:
        return "secondary"
    }
  }

  const getTipoDocumentoBadge = (tipo: string) => {
    return tipo === "contrato" ? "outline" : "secondary"
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando documentos...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (documentos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contratos e Procurações</CardTitle>
          <CardDescription>
            Nenhum documento encontrado com os filtros aplicados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Comece criando seu primeiro contrato ou procuração.
            </p>
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
              <CardTitle>Contratos e Procurações</CardTitle>
              <CardDescription>
                Gerencie contratos e procurações com acompanhamento financeiro integrado.
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{documentos.length}</p>
              <p className="text-sm text-muted-foreground">documentos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((documento) => (
                  <TableRow key={documento.id}>
                    <TableCell>
                      <Badge variant={getTipoDocumentoBadge(documento.tipoDocumento)}>
                        {TIPO_DOCUMENTO_LABELS[documento.tipoDocumento]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p>{documento.cliente}</p>
                        {documento.oab && (
                          <p className="text-xs text-muted-foreground">
                            OAB: {documento.oab}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{documento.responsavel}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatarMoeda(documento.valorNegociado)}</p>
                        <p className="text-xs text-muted-foreground">
                          {FORMATO_PAGAMENTO_LABELS[documento.formatoPagamento]}
                        </p>
                        {documento.parcelas && (
                          <p className="text-xs text-muted-foreground">
                            {documento.parcelas}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(documento.statusPagamento)}>
                        {STATUS_PAGAMENTO_LABELS[documento.statusPagamento]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(documento.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        {documento.dataTermino && (
                          <p className="text-xs text-muted-foreground">
                            até {format(documento.dataTermino, "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Botões de ação rápida */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onVisualizarFinanceiro(documento)}
                          title="Visualizar financeiro"
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onExportar(documento.id!, { formato: "pdf", incluirAnexos: false, incluirHistoricoFinanceiro: true })}
                          title="Exportar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {/* Menu de ações */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEditar(documento)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar documento
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onVisualizarFinanceiro(documento)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes financeiros
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRenegociar(documento)}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Registrar renegociação
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onExportar(documento.id!, { formato: "pdf", incluirAnexos: true, incluirHistoricoFinanceiro: true })}>
                              <Download className="mr-2 h-4 w-4" />
                              Exportar PDF completo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExportar(documento.id!, { formato: "word", incluirAnexos: false, incluirHistoricoFinanceiro: false })}>
                              <Download className="mr-2 h-4 w-4" />
                              Exportar Word
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDocumentoParaExcluir(documento)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir documento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Informações adicionais */}
          {documentos.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total de Documentos</p>
                  <p className="text-2xl font-bold text-blue-600">{documentos.length}</p>
                </div>
                <div>
                  <p className="font-medium">Valor Total Negociado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatarMoeda(documentos.reduce((acc, doc) => acc + doc.valorNegociado, 0))}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {documentos.filter(d => d.statusPagamento === "pendente").length}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Inadimplentes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {documentos.filter(d => d.statusPagamento === "inadimplente").length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!documentoParaExcluir} onOpenChange={() => setDocumentoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o {documentoParaExcluir?.tipoDocumento} do cliente{" "}
              <strong>{documentoParaExcluir?.cliente}</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Documento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
