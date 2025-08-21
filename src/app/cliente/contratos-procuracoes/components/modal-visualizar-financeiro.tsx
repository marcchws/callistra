"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Documento, 
  HistoricoPagamento,
  STATUS_PAGAMENTO_LABELS,
  FORMATO_PAGAMENTO_LABELS
} from "../types"

interface ModalVisualizarFinanceiroProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: Documento | null
}

// Mock data para histórico de pagamentos (integração com contas a receber)
const historicosPagamentoMock: HistoricoPagamento[] = [
  {
    id: "1",
    documentoId: "1",
    valorOriginal: 1000,
    valorPago: 1000,
    dataPagamento: new Date("2024-02-15"),
    observacoes: "Pagamento da 1ª parcela via PIX"
  },
  {
    id: "2", 
    documentoId: "1",
    valorOriginal: 1000,
    valorPago: 950,
    dataPagamento: new Date("2024-03-15"),
    observacoes: "Pagamento da 2ª parcela com desconto de R$ 50,00",
    descontos: 50
  }
]

export function ModalVisualizarFinanceiro({ 
  open, 
  onOpenChange, 
  documento 
}: ModalVisualizarFinanceiroProps) {
  
  if (!documento) return null

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor)
  }

  const historicoPagamentos = historicosPagamentoMock.filter(
    h => h.documentoId === documento.id
  )

  const valorTotalPago = historicoPagamentos.reduce((acc, h) => acc + h.valorPago, 0)
  const valorTotalOriginal = historicoPagamentos.reduce((acc, h) => acc + h.valorOriginal, 0)
  const valorPendente = documento.valorNegociado - valorTotalPago
  const percentualPago = documento.valorNegociado > 0 ? (valorTotalPago / documento.valorNegociado) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pendente":
        return <Clock className="h-5 w-5 text-orange-600" />
      case "inadimplente":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "text-green-600 bg-green-50 border-green-200"
      case "pendente":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "inadimplente":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Detalhes Financeiros
          </DialogTitle>
          <DialogDescription>
            Acompanhamento financeiro detalhado do {documento.tipoDocumento} do cliente {documento.cliente}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Negociado</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatarMoeda(documento.valorNegociado)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatarMoeda(valorTotalPago)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Pendente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatarMoeda(valorPendente)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">% Pago</p>
                  <p className="text-2xl font-bold">
                    {percentualPago.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso de Pagamento</span>
                  <span>{percentualPago.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentualPago, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Contrato/Procuração */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações do Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{documento.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="font-medium">{documento.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Formato de Pagamento</p>
                  <p className="font-medium">{FORMATO_PAGAMENTO_LABELS[documento.formatoPagamento]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(documento.statusPagamento)}
                    <Badge variant={documento.statusPagamento === "pago" ? "default" : 
                                 documento.statusPagamento === "pendente" ? "secondary" : "destructive"}>
                      {STATUS_PAGAMENTO_LABELS[documento.statusPagamento]}
                    </Badge>
                  </div>
                </div>
                {documento.parcelas && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Parcelas</p>
                    <p className="font-medium">{documento.parcelas}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Data de Início</p>
                  <p className="font-medium">
                    {format(documento.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                {documento.dataTermino && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Término</p>
                    <p className="font-medium">
                      {format(documento.dataTermino, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos (Integração Contas a Receber) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Histórico de Pagamentos
                <Badge variant="outline" className="ml-2">
                  Integrado ao Contas a Receber
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historicoPagamentos.length > 0 ? (
                <div className="space-y-4">
                  {historicoPagamentos.map((pagamento, index) => (
                    <div key={pagamento.id}>
                      <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">Pagamento #{index + 1}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(pagamento.dataPagamento, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="ml-8 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Valor Original:</span>
                              <span className="font-medium">{formatarMoeda(pagamento.valorOriginal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Valor Pago:</span>
                              <span className="font-bold text-green-600">{formatarMoeda(pagamento.valorPago)}</span>
                            </div>
                            
                            {pagamento.descontos && pagamento.descontos > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-green-600">Desconto Aplicado:</span>
                                <span className="text-green-600">-{formatarMoeda(pagamento.descontos)}</span>
                              </div>
                            )}
                            
                            {pagamento.multas && pagamento.multas > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-red-600">Multa Aplicada:</span>
                                <span className="text-red-600">+{formatarMoeda(pagamento.multas)}</span>
                              </div>
                            )}
                            
                            {pagamento.observacoes && (
                              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                {pagamento.observacoes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < historicoPagamentos.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum pagamento registrado ainda.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Os pagamentos serão exibidos automaticamente quando processados no módulo Contas a Receber.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico de Renegociações */}
          {documento.renegociacao && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Histórico de Renegociações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{documento.renegociacao}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Simular navegação para contas a receber
                window.alert("Redirecionando para o módulo Contas a Receber...")
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Ver no Contas a Receber
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Simular exportação do relatório financeiro
                window.alert("Exportando relatório financeiro...")
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
