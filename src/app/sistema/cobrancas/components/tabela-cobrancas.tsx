"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  MoreHorizontal, 
  Mail, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  UserX, 
  UserCheck,
  Download,
  Copy,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  Ban,
  Shield
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
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
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import type { 
  Cobranca, 
  Cliente, 
  FiltrosCobranca, 
  ReenvioCobrancaForm, 
  AtualizarStatusForm,
  GerenciarClienteForm 
} from "../types"
import { ReenvioCobrancaSchema, AtualizarStatusSchema, GerenciarClienteSchema } from "../types"

interface TabelaCobrancasProps {
  cobrancas: Cobranca[]
  clientes: Cliente[]
  loading: boolean
  onEnviarCobranca: (id: string) => Promise<void>
  onReenviarCobranca: (data: ReenvioCobrancaForm) => Promise<void>
  onAtualizarStatus: (data: AtualizarStatusForm) => Promise<void>
  onGerenciarCliente: (data: GerenciarClienteForm) => Promise<void>
}

export function TabelaCobrancas({
  cobrancas,
  clientes,
  loading,
  onEnviarCobranca,
  onReenviarCobranca,
  onAtualizarStatus,
  onGerenciarCliente
}: TabelaCobrancasProps) {
  const [filtros, setFiltros] = useState<FiltrosCobranca>({})
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<Cobranca | null>(null)
  const [dialogReenvio, setDialogReenvio] = useState(false)
  const [dialogStatus, setDialogStatus] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Forms
  const formReenvio = useForm<ReenvioCobrancaForm>({
    resolver: zodResolver(ReenvioCobrancaSchema),
    defaultValues: {
      incluirWhatsapp: false,
      mensagemPersonalizada: ""
    }
  })

  const formStatus = useForm<AtualizarStatusForm>({
    resolver: zodResolver(AtualizarStatusSchema),
    defaultValues: {
      cobrancaId: "",
      novoStatus: "paga",
      observacoes: ""
    }
  })

  const getStatusColor = (status: Cobranca['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'enviada':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'vencida':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'paga':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelada':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getTipoIcon = (tipo: Cobranca['tipo']) => {
    switch (tipo) {
      case 'boleto':
        return '📄'
      case 'pix':
        return '📱'
      case 'link_pagamento':
        return '🔗'
      default:
        return '💳'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filtrarCobrancas = () => {
    let resultado = [...cobrancas]

    if (filtros.status?.length) {
      resultado = resultado.filter(c => filtros.status!.includes(c.status))
    }

    if (filtros.cliente) {
      const termo = filtros.cliente.toLowerCase()
      resultado = resultado.filter(c => 
        c.clienteNome.toLowerCase().includes(termo) ||
        c.clienteEmail.toLowerCase().includes(termo)
      )
    }

    if (filtros.tipo?.length) {
      resultado = resultado.filter(c => filtros.tipo!.includes(c.tipo))
    }

    if (filtros.diasAtrasoMinimo !== undefined) {
      resultado = resultado.filter(c => c.diasAtraso >= filtros.diasAtrasoMinimo!)
    }

    return resultado.sort((a, b) => {
      // Priorizar vencidas com mais dias de atraso
      if (a.status === 'vencida' && b.status !== 'vencida') return -1
      if (b.status === 'vencida' && a.status !== 'vencida') return 1
      if (a.status === 'vencida' && b.status === 'vencida') {
        return b.diasAtraso - a.diasAtraso
      }
      return new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime()
    })
  }

  const cobrancasFiltradas = filtrarCobrancas()

  const handleEnviarCobranca = async (cobranca: Cobranca) => {
    setLoadingAction(cobranca.id)
    try {
      await onEnviarCobranca(cobranca.id)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleReenviarCobranca = async (data: ReenvioCobrancaForm) => {
    if (!cobrancaSelecionada) return
    
    setLoadingAction(cobrancaSelecionada.id)
    try {
      await onReenviarCobranca({
        ...data,
        cobrancaId: cobrancaSelecionada.id
      })
      setDialogReenvio(false)
      formReenvio.reset()
      setCobrancaSelecionada(null)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleAtualizarStatus = async (data: AtualizarStatusForm) => {
    if (!cobrancaSelecionada) return
    
    console.log('Dados do form:', data)
    console.log('Cobrança selecionada:', cobrancaSelecionada)
    
    setLoadingAction(cobrancaSelecionada.id)
    try {
      await onAtualizarStatus(data)
      setDialogStatus(false)
      formStatus.reset({
        cobrancaId: "",
        novoStatus: "paga",
        observacoes: ""
      })
      setCobrancaSelecionada(null)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleGerenciarCliente = async (clienteId: string, acao: 'bloquear' | 'desbloquear', motivo: string) => {
    setLoadingAction(clienteId)
    try {
      await onGerenciarCliente({
        clienteId,
        acao,
        motivo
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const copiarLink = (cobranca: Cobranca) => {
    const link = cobranca.urlBoleto || cobranca.linkPagamento || cobranca.chavePix
    if (link) {
      navigator.clipboard.writeText(link)
      toast.success("Link copiado para a área de transferência!", { duration: 2000 })
    }
  }

  const getClienteStatus = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.status || 'ativo'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Cobranças
          </CardTitle>
          <CardDescription className="text-slate-600">
            Carregando cobranças...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse"></div>
            ))}
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
              <CardTitle className="text-xl font-semibold text-slate-800">
                Gerenciamento de Cobranças
              </CardTitle>
              <CardDescription className="text-slate-600">
                Controle de boletos, PIX e links de pagamento
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {cobrancasFiltradas.length} cobranças
            </Badge>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por cliente..."
                value={filtros.cliente || ""}
                onChange={(e) => setFiltros(prev => ({ ...prev, cliente: e.target.value }))}
                className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
            <div className="w-full sm:w-40">
              <Select 
                value={filtros.status?.[0] || ""} 
                onValueChange={(value) => setFiltros(prev => ({ 
                  ...prev, 
                  status: value ? [value as Cobranca['status']] : undefined 
                }))}
              >
                <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="paga">Paga</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select 
                value={filtros.tipo?.[0] || ""} 
                onValueChange={(value) => setFiltros(prev => ({ 
                  ...prev, 
                  tipo: value ? [value as Cobranca['tipo']] : undefined 
                }))}
              >
                <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="link_pagamento">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {cobrancasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-sm">
                {cobrancas.length === 0 
                  ? "Nenhuma cobrança encontrada"
                  : "Nenhuma cobrança encontrada com os filtros aplicados"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700 font-medium">Cliente</TableHead>
                  <TableHead className="text-slate-700 font-medium">Valor</TableHead>
                  <TableHead className="text-slate-700 font-medium">Vencimento</TableHead>
                  <TableHead className="text-slate-700 font-medium">Status</TableHead>
                  <TableHead className="text-slate-700 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-700 font-medium">Atraso</TableHead>
                  <TableHead className="text-slate-700 font-medium">Envios</TableHead>
                  <TableHead className="text-slate-700 font-medium w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobrancasFiltradas.map((cobranca) => {
                  const clienteStatus = getClienteStatus(cobranca.clienteId)
                  
                  return (
                    <TableRow key={cobranca.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{cobranca.clienteNome}</span>
                          <span className="text-xs text-slate-500">{cobranca.clienteEmail}</span>
                          {clienteStatus === 'bloqueado' && (
                            <Badge variant="outline" className="mt-1 w-fit bg-orange-100 text-orange-700 border-orange-200">
                              <UserX className="h-3 w-3 mr-1" />
                              Bloqueado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {formatCurrency(cobranca.valor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-800">
                            {format(cobranca.dataVencimento, "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          {cobranca.diasAtraso > 0 && (
                            <span className="text-xs text-red-500">
                              {cobranca.diasAtraso} dias atrás
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(cobranca.status)} capitalize`}>
                          {cobranca.status === 'vencida' && cobranca.diasAtraso > 15 && (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {cobranca.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getTipoIcon(cobranca.tipo)}</span>
                          <span className="text-sm text-slate-600 capitalize">
                            {cobranca.tipo.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cobranca.diasAtraso > 0 ? (
                          <Badge 
                            variant="outline" 
                            className={
                              cobranca.diasAtraso > 15 
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }
                          >
                            {cobranca.diasAtraso} dias
                          </Badge>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-800">{cobranca.tentativasEnvio}x</span>
                          {cobranca.ultimoEnvio && (
                            <span className="text-xs text-slate-500">
                              {format(cobranca.ultimoEnvio, "dd/MM HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={loadingAction === cobranca.id}
                            >
                              <span className="sr-only">Abrir menu</span>
                              {loadingAction === cobranca.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Ações da Cobrança</DropdownMenuLabel>
                            
                            {/* Enviar/Reenviar */}
                            {cobranca.status !== 'paga' && cobranca.status !== 'cancelada' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleEnviarCobranca(cobranca)}
                                  className="cursor-pointer"
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  {cobranca.tentativasEnvio === 0 ? 'Enviar' : 'Reenviar'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setCobrancaSelecionada(cobranca)
                                    setDialogReenvio(true)
                                  }}
                                  className="cursor-pointer"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Reenvio Personalizado
                                </DropdownMenuItem>
                              </>
                            )}

                            {/* Copiar Link */}
                            {(cobranca.urlBoleto || cobranca.linkPagamento || cobranca.chavePix) && (
                              <DropdownMenuItem 
                                onClick={() => copiarLink(cobranca)}
                                className="cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar Link
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Atualizar Status */}
                            <DropdownMenuItem 
                              onClick={() => {
                                setCobrancaSelecionada(cobranca)
                                formStatus.reset({
                                  cobrancaId: cobranca.id,
                                  novoStatus: "paga",
                                  observacoes: ""
                                })
                                setDialogStatus(true)
                              }}
                              className="cursor-pointer"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Atualizar Status
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Gerenciar Cliente */}
                            {clienteStatus !== 'bloqueado' && cobranca.diasAtraso > 15 && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserX className="mr-2 h-4 w-4 text-red-500" />
                                    <span className="text-red-600">Bloquear Cliente</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Bloquear Cliente</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      O cliente {cobranca.clienteNome} tem {cobranca.diasAtraso} dias de atraso. 
                                      Deseja bloqueá-lo para novos contratos?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleGerenciarCliente(
                                        cobranca.clienteId, 
                                        'bloquear', 
                                        `Atraso superior a 15 dias (${cobranca.diasAtraso} dias)`
                                      )}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Bloquear Cliente
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {clienteStatus === 'bloqueado' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                    <span className="text-green-600">Desbloquear Cliente</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Desbloquear Cliente</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Deseja desbloquear o cliente {cobranca.clienteNome}? 
                                      Esta ação requer autorização de administrador.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleGerenciarCliente(
                                        cobranca.clienteId, 
                                        'desbloquear', 
                                        'Liberação autorizada pelo administrador'
                                      )}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Desbloquear Cliente
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Reenvio Personalizado */}
      <Dialog open={dialogReenvio} onOpenChange={setDialogReenvio}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Reenvio Personalizado
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Configure as opções de reenvio da cobrança
            </DialogDescription>
          </DialogHeader>

          <Form {...formReenvio}>
            <form onSubmit={formReenvio.handleSubmit(handleReenviarCobranca)} className="space-y-4">
              <div className="py-4 space-y-4">
                <FormField
                  control={formReenvio.control}
                  name="incluirWhatsapp"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Incluir WhatsApp
                        </FormLabel>
                        <p className="text-xs text-slate-500">
                          Enviar também via WhatsApp além do e-mail
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formReenvio.control}
                  name="mensagemPersonalizada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Mensagem Personalizada
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mensagem adicional (opcional)"
                          className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogReenvio(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loadingAction === cobrancaSelecionada?.id}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  {loadingAction === cobrancaSelecionada?.id && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reenviar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Atualização de Status */}
      <Dialog open={dialogStatus} onOpenChange={setDialogStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Atualizar Status da Cobrança
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Altere o status da cobrança manualmente
            </DialogDescription>
          </DialogHeader>

          <Form {...formStatus}>
            <form onSubmit={formStatus.handleSubmit(handleAtualizarStatus)} className="space-y-4">
              <div className="py-4 space-y-4">
                {/* Campo hidden para cobrancaId */}
                <FormField
                  control={formStatus.control}
                  name="cobrancaId"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStatus.control}
                  name="novoStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Novo Status *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="enviada">Enviada</SelectItem>
                          <SelectItem value="paga">Paga</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStatus.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Observações
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Motivo da alteração (opcional)"
                          className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogStatus(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loadingAction === cobrancaSelecionada?.id}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  {loadingAction === cobrancaSelecionada?.id && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Atualizar Status
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
