"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Balancete } from "../types"
import { cn } from "@/lib/utils"

interface BalanceteTableProps {
  balancete: Balancete | null
  loading?: boolean
}

export function BalanceteTable({ balancete, loading }: BalanceteTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Detalhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!balancete) return null

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "secondary", label: string }> = {
      adimplente: { variant: "default", label: "Adimplente" },
      inadimplente: { variant: "destructive", label: "Inadimplente" },
      parcial: { variant: "secondary", label: "Parcial" }
    }
    
    const config = variants[status] || variants.adimplente
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Detalhamento</CardTitle>
        <CardDescription>
          Análise detalhada por cliente, serviço e categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resumo" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resumo">Resumo Geral</TabsTrigger>
            <TabsTrigger value="clientes">Por Cliente</TabsTrigger>
            <TabsTrigger value="servicos">Por Serviço</TabsTrigger>
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          </TabsList>

          {/* Resumo Geral */}
          <TabsContent value="resumo" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Resumo Financeiro */}
              <div>
                <h3 className="font-medium mb-3">Resumo Financeiro</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ganhos Totais</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(balancete.financeiro.ganhos)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Honorários</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(balancete.financeiro.honorarios)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Despesas</TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(balancete.financeiro.despesas)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Custas Processuais</TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(balancete.financeiro.custasProcessuais)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Inadimplência</TableCell>
                      <TableCell className="text-right text-orange-600">
                        {formatCurrency(balancete.financeiro.inadimplencia.valor)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({balancete.financeiro.inadimplencia.percentual}%)
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-bold">Lucro Líquido</TableCell>
                      <TableCell className="text-right text-blue-600 font-bold">
                        {formatCurrency(
                          balancete.financeiro.ganhos - 
                          balancete.financeiro.despesas - 
                          balancete.financeiro.custasProcessuais
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Receitas e Despesas Fixas/Recorrentes */}
              <div>
                <h3 className="font-medium mb-3">Receitas e Despesas</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium bg-gray-50">
                        Fixas
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Receitas</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(balancete.receitasDespesas.fixas.receitas)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Despesas</TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(balancete.receitasDespesas.fixas.despesas)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium bg-gray-50">
                        Recorrentes
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Receitas</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(balancete.receitasDespesas.recorrentes.receitas)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Despesas</TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(balancete.receitasDespesas.recorrentes.despesas)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Processos */}
            <div>
              <h3 className="font-medium mb-3">Processos</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">
                      {balancete.totalProcessos.total}
                    </div>
                    <p className="text-xs text-muted-foreground">Total de Processos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {balancete.totalProcessos.ativos}
                    </div>
                    <p className="text-xs text-muted-foreground">Processos Ativos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-gray-600">
                      {balancete.totalProcessos.encerrados}
                    </div>
                    <p className="text-xs text-muted-foreground">Processos Encerrados</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Por Cliente */}
          <TabsContent value="clientes" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-center">Processos</TableHead>
                  <TableHead className="text-right">Receitas</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Inadimplência</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balancete.detalhamento.porCliente.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell className="text-center">{cliente.totalProcessos}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(cliente.receitas)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(cliente.despesas)}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      cliente.inadimplencia > 0 && "text-orange-600"
                    )}>
                      {formatCurrency(cliente.inadimplencia)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(cliente.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Por Tipo de Serviço */}
          <TabsContent value="servicos" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Receitas</TableHead>
                  <TableHead className="text-right">Despesas</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                  <TableHead className="text-center">Margem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balancete.detalhamento.porTipoServico.map((servico) => {
                  const margem = ((servico.lucro / servico.receitas) * 100).toFixed(1)
                  return (
                    <TableRow key={servico.tipo}>
                      <TableCell className="font-medium">{servico.label}</TableCell>
                      <TableCell className="text-center">{servico.quantidade}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(servico.receitas)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(servico.despesas)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 font-medium">
                        {formatCurrency(servico.lucro)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={parseFloat(margem) > 50 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {margem}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Por Categoria */}
          <TabsContent value="categorias" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Receitas por Categoria */}
              <div>
                <h3 className="font-medium mb-3 text-green-600">Receitas por Categoria</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balancete.detalhamento.porCategoria
                      .filter(cat => cat.tipo === 'receita')
                      .map((categoria) => (
                        <TableRow key={categoria.categoria}>
                          <TableCell className="font-medium">
                            {categoria.categoria}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(categoria.valor)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default" className="text-xs">
                              {categoria.percentual.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Despesas por Categoria */}
              <div>
                <h3 className="font-medium mb-3 text-red-600">Despesas por Categoria</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balancete.detalhamento.porCategoria
                      .filter(cat => cat.tipo === 'despesa')
                      .map((categoria) => (
                        <TableRow key={categoria.categoria}>
                          <TableCell className="font-medium">
                            {categoria.categoria}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(categoria.valor)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="destructive" className="text-xs">
                              {categoria.percentual.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
