"use client"

import { DollarSign, TrendingUp, TrendingDown, Calendar, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cliente, TransacaoFinanceira } from "../types"

interface ClienteFinancialHistoryProps {
  cliente: Cliente
  onClose?: () => void
}

export function ClienteFinancialHistory({ cliente, onClose }: ClienteFinancialHistoryProps) {
  const transacoes = cliente.historicoFinanceiro || []

  // Calcular totais
  const totalReceitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0)

  const totalDespesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0)

  const totalPendente = transacoes
    .filter(t => t.status === "pendente")
    .reduce((acc, t) => acc + t.valor, 0)

  const totalPago = transacoes
    .filter(t => t.status === "pago")
    .reduce((acc, t) => acc + t.valor, 0)

  const saldo = totalReceitas - totalDespesas

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "cancelado":
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === "receita" ? (
      <Badge className="bg-blue-100 text-blue-800">
        <TrendingUp className="mr-1 h-3 w-3" />
        Receita
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <TrendingDown className="mr-1 h-3 w-3" />
        Despesa
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Histórico Financeiro</CardTitle>
            <CardDescription>
              {cliente.nome} - Contas a pagar e receber
            </CardDescription>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Receitas
                </span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(totalReceitas)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Despesas
                </span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(totalDespesas)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Saldo
                </span>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pendente
                </span>
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xl font-bold text-yellow-600">
                {formatCurrency(totalPendente)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de transações */}
        {transacoes.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium mb-3">Transações</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell>{getTipoBadge(transacao.tipo)}</TableCell>
                      <TableCell className="font-medium">
                        {transacao.descricao}
                      </TableCell>
                      <TableCell className={transacao.tipo === "receita" ? "text-green-600" : "text-red-600"}>
                        {transacao.tipo === "receita" ? "+" : "-"} {formatCurrency(transacao.valor)}
                      </TableCell>
                      <TableCell>{formatDate(transacao.dataVencimento)}</TableCell>
                      <TableCell>
                        {transacao.dataPagamento ? formatDate(transacao.dataPagamento) : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(transacao.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50/50">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium">Nenhuma transação registrada</p>
            <p className="text-xs text-muted-foreground mt-1">
              As transações financeiras aparecerão aqui quando forem lançadas
            </p>
          </div>
        )}

        {/* Observações */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            * Este histórico mostra apenas transações vinculadas diretamente a este cliente.
            Para ver todas as transações do escritório, acesse o módulo Financeiro.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}