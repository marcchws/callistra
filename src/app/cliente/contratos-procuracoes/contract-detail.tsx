"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  User,
  Building,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  History,
  FileDown,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Contract, Renegotiation } from "./types"

interface ContractDetailProps {
  contract: Contract
  onEdit: () => void
  onDelete: () => Promise<void>
  onExport: (format: "pdf" | "word") => Promise<void>
  onAddRenegotiation: (renegotiation: Omit<Renegotiation, "id">) => Promise<void>
  onUpdatePaymentStatus: (status: "pago" | "inadimplente", valorPago?: number) => Promise<void>
  loading?: boolean
}

export function ContractDetail({
  contract,
  onEdit,
  onDelete,
  onExport,
  onAddRenegotiation,
  onUpdatePaymentStatus,
  loading = false
}: ContractDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenegotiationDialog, setShowRenegotiationDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportingWord, setExportingWord] = useState(false)
  
  // Estados para renegociação
  const [renegotiationData, setRenegotiationData] = useState({
    descricao: "",
    novoValor: contract.valorNegociado,
    motivoRenegociacao: "",
    responsavel: contract.responsavel
  })
  
  // Estados para pagamento
  const [paymentData, setPaymentData] = useState({
    valorPago: contract.valorNegociado,
    status: "pago" as "pago" | "inadimplente"
  })

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      await onExport("pdf")
    } finally {
      setExportingPdf(false)
    }
  }

  const handleExportWord = async () => {
    setExportingWord(true)
    try {
      await onExport("word")
    } finally {
      setExportingWord(false)
    }
  }

  const handleAddRenegotiation = async () => {
    await onAddRenegotiation({
      data: new Date(),
      descricao: renegotiationData.descricao,
      valorAnterior: contract.valorNegociado,
      novoValor: renegotiationData.novoValor,
      motivoRenegociacao: renegotiationData.motivoRenegociacao,
      responsavel: renegotiationData.responsavel
    })
    setShowRenegotiationDialog(false)
    setRenegotiationData({
      descricao: "",
      novoValor: contract.valorNegociado,
      motivoRenegociacao: "",
      responsavel: contract.responsavel
    })
  }

  const handleUpdatePayment = async () => {
    await onUpdatePaymentStatus(
      paymentData.status,
      paymentData.status === "pago" ? paymentData.valorPago : undefined
    )
    setShowPaymentDialog(false)
    setPaymentData({
      valorPago: contract.valorNegociado,
      status: "pago"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        )
      case "inadimplente":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Inadimplente
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {contract.tipoDocumento === "contrato" ? "Contrato" : "Procuração"}
              </CardTitle>
              <CardDescription>
                {contract.modelo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(contract.statusPagamento)}
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
                disabled={loading}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="space-y-4">
              {/* Dados das Partes */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dados das Partes</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Cliente
                    </div>
                    <p className="font-medium">{contract.cliente}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Responsável
                    </div>
                    <p className="font-medium">{contract.responsavel}</p>
                  </div>
                  {contract.oab && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">OAB</div>
                      <p className="font-medium">{contract.oab}</p>
                    </div>
                  )}
                  {contract.enderecoComercial && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        Endereço Comercial
                      </div>
                      <p className="font-medium">{contract.enderecoComercial}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vigência */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Vigência</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Data de Início
                    </div>
                    <p className="font-medium">
                      {format(contract.dataInicio, "dd/MM/yyyy")}
                    </p>
                  </div>
                  {contract.dataTermino && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Data de Término
                      </div>
                      <p className="font-medium">
                        {format(contract.dataTermino, "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assinaturas */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Assinaturas</h3>
                <Separator />
                <div className="space-y-2">
                  {contract.assinaturas.map((assinatura) => (
                    <div key={assinatura.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{assinatura.ordem}º</span>
                          <Badge variant="outline" className="text-xs">
                            {assinatura.tipo === "cliente" ? "Cliente" : 
                             assinatura.tipo === "advogado" ? "Advogado" : "Terceiro"}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{assinatura.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {assinatura.status === "assinado" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Assinado
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pendente</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              {contract.observacoes && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Observações</h3>
                  <Separator />
                  <p className="text-sm">{contract.observacoes}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="financeiro" className="space-y-4">
              {/* Valores */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Valores e Pagamento</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Valor Negociado
                    </div>
                    <p className="text-xl font-semibold">
                      {formatCurrency(contract.valorNegociado)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Formato de Pagamento
                    </div>
                    <p className="font-medium">
                      {contract.formatoPagamento.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  {contract.parcelas && (
                    <>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Parcelas</div>
                        <p className="font-medium">{contract.parcelas}x</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Valor da Parcela</div>
                        <p className="font-medium">
                          {formatCurrency(contract.valorParcela || 0)}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Status de Pagamento */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Status de Pagamento</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPaymentDialog(true)}
                      disabled={loading || contract.statusPagamento === "pago"}
                    >
                      Atualizar Status
                    </Button>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Status Atual</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contract.statusPagamento)}
                        </div>
                      </div>
                      {contract.valorPago !== undefined && (
                        <div className="space-y-1 text-right">
                          <p className="text-sm text-muted-foreground">Valor Pago</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(contract.valorPago)}
                          </p>
                        </div>
                      )}
                    </div>
                    {contract.dataPagamento && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          Pago em: {format(contract.dataPagamento, "dd/MM/yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Renegociações */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Renegociações</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRenegotiationDialog(true)}
                      disabled={loading}
                    >
                      Adicionar Renegociação
                    </Button>
                  </div>
                  {contract.renegociacoes.length > 0 ? (
                    <div className="space-y-2">
                      {contract.renegociacoes.map((reneg) => (
                        <div key={reneg.id} className="rounded-lg border p-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{reneg.descricao}</p>
                              <p className="text-sm text-muted-foreground">
                                {reneg.motivoRenegociacao}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  De: <strong>{formatCurrency(reneg.valorAnterior)}</strong>
                                </span>
                                <span>
                                  Para: <strong className="text-blue-600">
                                    {formatCurrency(reneg.novoValor)}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {format(reneg.data, "dd/MM/yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                por {reneg.responsavel}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma renegociação registrada
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="historico" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Histórico do Documento</h3>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <History className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Documento criado</p>
                      <p className="text-sm text-muted-foreground">
                        {format(contract.dataCriacao, "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                  
                  {contract.ultimaAtualizacao && 
                   contract.ultimaAtualizacao.getTime() !== contract.dataCriacao.getTime() && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Última atualização</p>
                        <p className="text-sm text-muted-foreground">
                          {format(contract.ultimaAtualizacao, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {contract.dataPagamento && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pagamento confirmado</p>
                        <p className="text-sm text-muted-foreground">
                          {format(contract.dataPagamento, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            ID: {contract.id}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportWord}
              disabled={exportingWord}
            >
              {exportingWord ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Exportar Word
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onDelete()
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Renegociação */}
      <Dialog open={showRenegotiationDialog} onOpenChange={setShowRenegotiationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Renegociação</DialogTitle>
            <DialogDescription>
              Adicione os detalhes da renegociação do contrato
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={renegotiationData.descricao}
                onChange={(e) => setRenegotiationData({
                  ...renegotiationData,
                  descricao: e.target.value
                })}
                placeholder="Descrição da renegociação"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="novoValor">Novo Valor</Label>
              <Input
                id="novoValor"
                type="number"
                step="0.01"
                value={renegotiationData.novoValor}
                onChange={(e) => setRenegotiationData({
                  ...renegotiationData,
                  novoValor: parseFloat(e.target.value)
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                value={renegotiationData.motivoRenegociacao}
                onChange={(e) => setRenegotiationData({
                  ...renegotiationData,
                  motivoRenegociacao: e.target.value
                })}
                placeholder="Motivo da renegociação"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={renegotiationData.responsavel}
                onChange={(e) => setRenegotiationData({
                  ...renegotiationData,
                  responsavel: e.target.value
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenegotiationDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddRenegotiation}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Atualização de Pagamento */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atualizar Status de Pagamento</DialogTitle>
            <DialogDescription>
              Confirme o status do pagamento deste documento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button
                  variant={paymentData.status === "pago" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentData({ ...paymentData, status: "pago" })}
                  className={paymentData.status === "pago" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  Pago
                </Button>
                <Button
                  variant={paymentData.status === "inadimplente" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentData({ ...paymentData, status: "inadimplente" })}
                  className={paymentData.status === "inadimplente" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  Inadimplente
                </Button>
              </div>
            </div>
            {paymentData.status === "pago" && (
              <div className="space-y-2">
                <Label htmlFor="valorPago">Valor Pago</Label>
                <Input
                  id="valorPago"
                  type="number"
                  step="0.01"
                  value={paymentData.valorPago}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    valorPago: parseFloat(e.target.value)
                  })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdatePayment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
