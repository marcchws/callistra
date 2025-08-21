'use client'

import { DollarSign, TrendingUp, TrendingDown, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

import { Cliente, HistoricoFinanceiro, TipoCliente } from '../types'

interface HistoricoFinanceiroProps {
  cliente: Cliente | null
  historico: HistoricoFinanceiro[]
  loading?: boolean
  open: boolean
  onClose: () => void
}

export function HistoricoFinanceiroModal({ 
  cliente, 
  historico, 
  loading = false, 
  open, 
  onClose 
}: HistoricoFinanceiroProps) {
  if (!cliente) return null

  const formatarNome = () => {
    if (cliente.tipoCliente === TipoCliente.PESSOA_FISICA) {
      return cliente.nome || ''
    }
    return cliente.razaoSocial || ''
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'atrasado':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'receber' 
      ? <TrendingUp className="h-4 w-4 text-green-600" />
      : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  // Calcular resumos
  const resumo = historico.reduce((acc, item) => {
    if (item.tipo === 'receber') {
      acc.totalReceber += item.valor
      if (item.status === 'pendente') acc.pendenteReceber += item.valor
      if (item.status === 'pago') acc.pagoReceber += item.valor
    } else {
      acc.totalPagar += item.valor
      if (item.status === 'pendente') acc.pendentePagar += item.valor
      if (item.status === 'pago') acc.pagoPagar += item.valor
    }
    return acc
  }, {
    totalReceber: 0,
    pendenteReceber: 0,
    pagoReceber: 0,
    totalPagar: 0,
    pendentePagar: 0,
    pagoPagar: 0
  })

  const saldoLiquido = resumo.totalReceber - resumo.totalPagar

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Histórico Financeiro - {formatarNome()}
          </DialogTitle>
          <DialogDescription>
            Visualização completa das movimentações financeiras do cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Receber</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatarMoeda(resumo.totalReceber)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pendente: {formatarMoeda(resumo.pendenteReceber)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatarMoeda(resumo.totalPagar)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pendente: {formatarMoeda(resumo.pendentePagar)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(saldoLiquido)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {saldoLiquido >= 0 ? 'Positivo' : 'Negativo'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatarMoeda(resumo.pagoReceber + resumo.pagoPagar)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Movimentações concluídas
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Tabela de Histórico */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Movimentações</CardTitle>
              <CardDescription>
                Histórico detalhado de contas a pagar e receber
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando histórico...
                </div>
              ) : historico.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma movimentação financeira encontrada para este cliente.
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historico.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTipoIcon(item.tipo)}
                              <span className="text-sm font-medium">
                                {item.tipo === 'receber' ? 'A Receber' : 'A Pagar'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.descricao}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-mono font-medium ${
                              item.tipo === 'receber' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.tipo === 'receber' ? '+' : '-'} {formatarMoeda(item.valor)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatarData(item.dataVencimento)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.dataPagamento ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{formatarData(item.dataPagamento)}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Não pago</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              {getStatusBadge(item.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.observacoes ? (
                              <span className="text-sm text-muted-foreground">{item.observacoes}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rodapé com Informações Adicionais */}
          {historico.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      Resumo do Cliente
                    </p>
                    <p className="text-sm text-blue-700">
                      Total de {historico.length} movimentação{historico.length !== 1 ? 'ões' : ''} registrada{historico.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-900">
                      Saldo: <span className={saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatarMoeda(saldoLiquido)}
                      </span>
                    </p>
                    <p className="text-xs text-blue-700">
                      Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}