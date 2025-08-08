"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  CreditCard, 
  Plus, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  Ban, 
  Unlock,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Loader2,
  History,
  Clock
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useCobrancas } from './use-cobrancas'
import { 
  EmissaoCobrancaSchema, 
  AtualizacaoStatusSchema, 
  LiberacaoClienteSchema,
  type EmissaoCobrancaForm,
  type AtualizacaoStatusForm,
  type LiberacaoClienteForm,
  type Cobranca,
  type StatusCobranca
} from './types'

export default function CobrancasAtrasoPage() {
  const {
    cobrancas,
    clientes,
    historico,
    estatisticas,
    loading,
    error,
    emitirCobranca,
    enviarCobranca,
    reenviarCobranca,
    atualizarStatus,
    bloquearCliente,
    liberarCliente,
    filtrarCobrancas
  } = useCobrancas()

  const [filtroStatus, setFiltroStatus] = useState<StatusCobranca | 'todos'>('todos')
  const [filtroCliente, setFiltroCliente] = useState('')
  const [isEmissaoOpen, setIsEmissaoOpen] = useState(false)
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false)
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<Cobranca | null>(null)

  // Form para emissão de cobrança (AC1)
  const emissaoForm = useForm<EmissaoCobrancaForm>({
    resolver: zodResolver(EmissaoCobrancaSchema),
    defaultValues: {
      valor: 0,
      dataVencimento: new Date(),
    }
  })

  // Form para atualização de status (AC6)
  const statusForm = useForm<AtualizacaoStatusForm>({
    resolver: zodResolver(AtualizacaoStatusSchema)
  })

  // Form para liberação de cliente (AC4)
  const liberacaoForm = useForm<LiberacaoClienteForm>({
    resolver: zodResolver(LiberacaoClienteSchema)
  })

  // Filtrar cobranças baseado nos filtros selecionados
  const cobrancasFiltradas = filtrarCobrancas({
    status: filtroStatus === 'todos' ? undefined : filtroStatus,
    clienteId: filtroCliente || undefined
  })

  // AC1: Submissão de emissão de cobrança
  const handleEmissaoSubmit = async (data: EmissaoCobrancaForm) => {
    try {
      await emitirCobranca(data)
      setIsEmissaoOpen(false)
      emissaoForm.reset()
    } catch (error) {
      // Error já tratado no hook
    }
  }

  // AC6: Submissão de atualização de status
  const handleStatusSubmit = async (data: AtualizacaoStatusForm) => {
    try {
      await atualizarStatus(data)
      statusForm.reset()
    } catch (error) {
      // Error já tratado no hook
    }
  }

  // AC4: Submissão de liberação de cliente
  const handleLiberacaoSubmit = async (data: LiberacaoClienteForm) => {
    try {
      await liberarCliente(data)
      liberacaoForm.reset()
    } catch (error) {
      // Error já tratado no hook
    }
  }

  // AC5: Função para abrir histórico de uma cobrança específica
  const abrirHistorico = (cobranca: Cobranca) => {
    setCobrancaSelecionada(cobranca)
    setIsHistoricoOpen(true)
  }

  // Filtrar histórico pela cobrança selecionada
  const historicoFiltrado = cobrancaSelecionada 
    ? historico.filter(h => h.cobrancaId === cobrancaSelecionada.id)
    : []

  // Função para obter cor do badge baseado no status
  const getStatusBadge = (status: StatusCobranca) => {
    const variants = {
      pendente: 'default',
      enviada: 'secondary',
      pago: 'default',
      vencida: 'destructive',
      bloqueado: 'destructive'
    } as const

    const colors = {
      pendente: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      enviada: 'text-blue-700 bg-blue-50 border-blue-200',
      pago: 'text-green-700 bg-green-50 border-green-200',
      vencida: 'text-red-700 bg-red-50 border-red-200',
      bloqueado: 'text-gray-700 bg-gray-50 border-gray-200'
    }

    const labels = {
      pendente: 'Pendente',
      enviada: 'Enviada',
      pago: 'Pago',
      vencida: 'Vencida',
      bloqueado: 'Bloqueado'
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {labels[status]}
      </Badge>
    )
  }

  // Aplicar padrões do Callistra-patterns.md - Global Layout Structure
  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header seguindo Typography Hierarchy */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Cobranças em Atraso</h1>
          <p className="text-muted-foreground">
            Centralize e automatize emissão de boletos, envio de cobranças e controle de inadimplência
          </p>
        </div>

        {/* AC7: Estatísticas integradas ao painel financeiro */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total em Aberto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(estatisticas.totalEmAberto)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valores pendentes de recebimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vencido</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(estatisticas.totalVencido)}
              </div>
              <p className="text-xs text-muted-foreground">
                Cobranças em atraso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Bloqueados</CardTitle>
              <Ban className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.clientesBloqueados}</div>
              <p className="text-xs text-muted-foreground">
                Acima de 15 dias em atraso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(estatisticas.ticketMedio)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor médio por cobrança
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cobranças Registradas</CardTitle>
                <CardDescription>
                  Gerencie todas as cobranças e acompanhe o status de pagamento
                </CardDescription>
              </div>
              {/* AC1: Botão para emitir nova cobrança */}
              <Dialog open={isEmissaoOpen} onOpenChange={setIsEmissaoOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Cobrança
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Emitir Nova Cobrança</DialogTitle>
                    <DialogDescription>
                      Gere boleto e link de pagamento para cobrança em atraso
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...emissaoForm}>
                    <form onSubmit={emissaoForm.handleSubmit(handleEmissaoSubmit)} className="space-y-4">
                      <FormField
                        control={emissaoForm.control}
                        name="clienteId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Cliente <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="focus:ring-blue-500">
                                  <SelectValue placeholder="Selecione o cliente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clientes.map((cliente) => (
                                  <SelectItem key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={emissaoForm.control}
                        name="valor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Valor <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                step="0.01"
                                placeholder="0,00" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormDescription>
                              Valor em reais da cobrança
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emissaoForm.control}
                        name="dataVencimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Data de Vencimento <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field}
                                value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                className="focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emissaoForm.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informações adicionais sobre a cobrança"
                                {...field}
                                className="focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEmissaoOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {loading ? "Emitindo..." : "Emitir Cobrança"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {/* Filtros */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="filtro-status" className="text-sm font-medium">Status</Label>
                <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as StatusCobranca | 'todos')}>
                  <SelectTrigger id="filtro-status" className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="filtro-cliente" className="text-sm font-medium">Cliente</Label>
                <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                  <SelectTrigger id="filtro-cliente" className="focus:ring-blue-500">
                    <SelectValue placeholder="Todos os clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AC5 + AC7: Tabela tradicional para dados jurídicos complexos */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dias Atraso</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-muted-foreground mt-2">Carregando cobranças...</p>
                    </TableCell>
                  </TableRow>
                ) : cobrancasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma cobrança encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  cobrancasFiltradas.map((cobranca) => (
                    <TableRow key={cobranca.id}>
                      <TableCell className="font-medium">{cobranca.clienteNome}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(cobranca.valor)}
                      </TableCell>
                      <TableCell>
                        {format(cobranca.dataVencimento, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getStatusBadge(cobranca.status)}</TableCell>
                      <TableCell>
                        {cobranca.diasAtraso > 0 ? (
                          <span className={cobranca.diasAtraso > 15 ? 'text-red-600 font-medium' : 'text-yellow-600'}>
                            {cobranca.diasAtraso} dias
                          </span>
                        ) : (
                          <span className="text-green-600">Em dia</span>
                        )}
                      </TableCell>
                      <TableCell>{cobranca.tentativasEnvio}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {/* AC5: Visualizar histórico */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirHistorico(cobranca)}
                            className="gap-1"
                          >
                            <History className="h-3 w-3" />
                            Histórico
                          </Button>

                          {/* AC2: Enviar cobrança */}
                          {cobranca.status === 'pendente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => enviarCobranca(cobranca.id)}
                              disabled={loading}
                              className="gap-1"
                            >
                              <Send className="h-3 w-3" />
                              Enviar
                            </Button>
                          )}

                          {/* AC6: Reenviar cobrança */}
                          {(cobranca.status === 'enviada' || cobranca.status === 'vencida') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reenviarCobranca(cobranca.id)}
                              disabled={loading}
                              className="gap-1"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Reenviar
                            </Button>
                          )}

                          {/* AC6: Marcar como pago */}
                          {cobranca.status !== 'pago' && cobranca.status !== 'bloqueado' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Pago
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja marcar esta cobrança como paga? 
                                    Esta ação atualizará o status e será registrada no histórico.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleStatusSubmit({
                                      cobrancaId: cobranca.id,
                                      novoStatus: 'pago',
                                      observacoes: 'Pagamento confirmado manualmente'
                                    })}
                                  >
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {/* AC4: Bloquear cliente após 15 dias */}
                          {cobranca.diasAtraso > 15 && cobranca.status !== 'bloqueado' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="gap-1">
                                  <Ban className="h-3 w-3" />
                                  Bloquear
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Bloquear Cliente</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Este cliente possui atraso superior a 15 dias. 
                                    Deseja bloqueá-lo para novos contratos?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => bloquearCliente(
                                      cobranca.clienteId, 
                                      'Atraso superior a 15 dias'
                                    )}
                                  >
                                    Bloquear Cliente
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AC4: Seção de liberação de clientes bloqueados */}
        {clientes.filter(c => c.status === 'bloqueado').length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Clientes Bloqueados
              </CardTitle>
              <CardDescription>
                Clientes bloqueados por atraso superior a 15 dias (liberação apenas por administrador)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientes
                  .filter(c => c.status === 'bloqueado')
                  .map((cliente) => (
                    <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{cliente.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Bloqueado em: {cliente.dataBloqueio ? format(cliente.dataBloqueio, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não informada'}
                        </p>
                        <p className="text-sm text-red-600">
                          Motivo: {cliente.motivoBloqueio}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total devedor: {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(cliente.totalDevedor)}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Unlock className="h-4 w-4" />
                            Liberar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Liberar Cliente Bloqueado</DialogTitle>
                            <DialogDescription>
                              Informe o motivo da liberação do cliente {cliente.nome}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...liberacaoForm}>
                            <form onSubmit={liberacaoForm.handleSubmit(handleLiberacaoSubmit)}>
                              <input type="hidden" {...liberacaoForm.register('clienteId')} value={cliente.id} />
                              <FormField
                                control={liberacaoForm.control}
                                name="motivo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Motivo da Liberação <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Descreva o motivo da liberação do cliente"
                                        {...field}
                                        className="focus:ring-blue-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter className="mt-4">
                                <Button type="button" variant="outline">
                                  Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  {loading ? "Liberando..." : "Liberar Cliente"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AC5: Modal do Histórico de Cobranças */}
        <Dialog open={isHistoricoOpen} onOpenChange={setIsHistoricoOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico da Cobrança
              </DialogTitle>
              <DialogDescription>
                {cobrancaSelecionada && (
                  <>
                    Cliente: <strong>{cobrancaSelecionada.clienteNome}</strong> | 
                    Valor: <strong>
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(cobrancaSelecionada.valor)}
                    </strong>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {historicoFiltrado.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum histórico registrado para esta cobrança</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historicoFiltrado
                      .sort((a, b) => b.dataAcao.getTime() - a.dataAcao.getTime())
                      .map((item) => {
                        const acaoLabels = {
                          criada: 'Cobrança Criada',
                          enviada: 'Enviada por E-mail',
                          reenviada: 'Reenviada',
                          pago: 'Pagamento Confirmado',
                          bloqueado: 'Cliente Bloqueado',
                          liberado: 'Cliente Liberado',
                          alerta_enviado: 'Alerta Enviado'
                        }

                        const acaoCores = {
                          criada: 'text-blue-600',
                          enviada: 'text-green-600',
                          reenviada: 'text-yellow-600',
                          pago: 'text-green-700',
                          bloqueado: 'text-red-600',
                          liberado: 'text-green-600',
                          alerta_enviado: 'text-orange-600'
                        }

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="text-sm">
                                {format(item.dataAcao, 'dd/MM/yyyy', { locale: ptBR })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(item.dataAcao, 'HH:mm:ss', { locale: ptBR })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`${acaoCores[item.acao]} border-current`}
                              >
                                {acaoLabels[item.acao]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {item.usuario}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.detalhes || '-'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsHistoricoOpen(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mensagem de erro se houver */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
