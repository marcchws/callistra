"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Paperclip,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  AlertCircle,
  FileText,
  Download,
  Eye,
  HandshakeIcon,
  Calendar,
  Users,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useFinanceiro } from "./use-financeiro"
import { LancamentoForm } from "./components/lancamento-form"
import { RenegociacaoDialog } from "./components/renegociacao-dialog"
import { FiltrosComponent } from "./components/filtros"
import { 
  Lancamento, 
  TipoLancamento, 
  StatusLancamento,
  LancamentoFormData,
  RenegociacaoFormData
} from "./types"
import { 
  formatCurrency, 
  formatDate, 
  isAtrasada, 
  getDiasAtraso 
} from "./utils"

export default function ReceitasDespesasPage() {
  const {
    lancamentos,
    lancamentosAgrupados,
    resumo,
    loading,
    filtros,
    abaAtiva,
    setFiltros,
    setAbaAtiva,
    adicionarLancamento,
    editarLancamento,
    removerLancamento,
    anexarArquivo,
    renegociarConta
  } = useFinanceiro()

  const [formOpen, setFormOpen] = useState(false)
  const [renegociacaoOpen, setRenegociacaoOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<Lancamento | null>(null)

  // Handlers
  const handleNovoLancamento = (tipo: TipoLancamento) => {
    setLancamentoSelecionado(null)
    setAbaAtiva(tipo)
    setFormOpen(true)
  }

  const handleEditarLancamento = (lancamento: Lancamento) => {
    setLancamentoSelecionado(lancamento)
    setFormOpen(true)
  }

  const handleRenegociar = (lancamento: Lancamento) => {
    setLancamentoSelecionado(lancamento)
    setRenegociacaoOpen(true)
  }

  const handleExcluir = (lancamento: Lancamento) => {
    setLancamentoSelecionado(lancamento)
    setDeleteDialogOpen(true)
  }

  const confirmarExclusao = async () => {
    if (lancamentoSelecionado) {
      await removerLancamento(lancamentoSelecionado.id)
      setDeleteDialogOpen(false)
      setLancamentoSelecionado(null)
    }
  }

  const handleSubmitForm = async (data: LancamentoFormData) => {
    if (lancamentoSelecionado) {
      await editarLancamento(lancamentoSelecionado.id, data)
    } else {
      const novoLancamento = await adicionarLancamento(data)
      return novoLancamento
    }
  }

  const handleAnexarArquivo = async (file: File) => {
    if (lancamentoSelecionado) {
      return await anexarArquivo(lancamentoSelecionado.id, file)
    }
    throw new Error("Nenhum lançamento selecionado")
  }

  const handleRenegociacaoSubmit = async (data: RenegociacaoFormData) => {
    if (lancamentoSelecionado) {
      await renegociarConta(lancamentoSelecionado.id, data)
    }
  }

  // Renderização da tabela de lançamentos
  const renderTabelaLancamentos = () => {
    if (lancamentosAgrupados.length === 0) {
      return (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum lançamento encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece adicionando uma {abaAtiva === TipoLancamento.RECEITA ? "receita" : "despesa"}
          </p>
          <Button 
            onClick={() => handleNovoLancamento(abaAtiva)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar {abaAtiva === TipoLancamento.RECEITA ? "Receita" : "Despesa"}
          </Button>
        </div>
      )
    }

    return lancamentosAgrupados.map((grupo, index) => (
      <div key={index} className="space-y-4">
        {filtros.agrupamento && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {filtros.agrupamento === "processo" ? (
                  <FileText className="h-5 w-5 text-blue-600" />
                ) : (
                  <Users className="h-5 w-5 text-blue-600" />
                )}
                <h3 className="font-medium text-blue-900">{grupo.titulo}</h3>
                <Badge variant="secondary" className="ml-2">
                  {grupo.lancamentos.length} {grupo.lancamentos.length === 1 ? "item" : "itens"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{formatCurrency(grupo.total)}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-amber-600">
                  Pendente: {formatCurrency(grupo.totalPendente)}
                </span>
                <span className="text-green-600">
                  Pago: {formatCurrency(grupo.totalPago)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Beneficiário</TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grupo.lancamentos.map((lancamento) => {
              const atrasada = isAtrasada(lancamento)
              const diasAtraso = getDiasAtraso(lancamento)
              
              return (
                <TableRow 
                  key={lancamento.id}
                  className={cn(
                    atrasada && "bg-red-50 hover:bg-red-100"
                  )}
                >
                  <TableCell className="font-medium">
                    {lancamento.categoria}
                  </TableCell>
                  <TableCell>{lancamento.subcategoria}</TableCell>
                  <TableCell>{lancamento.beneficiario || "—"}</TableCell>
                  <TableCell>{lancamento.processo || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(lancamento.dataVencimento)}</span>
                      {atrasada && (
                        <span className="text-xs text-red-600">
                          {diasAtraso} dias em atraso
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(lancamento.valor)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lancamento.status === StatusLancamento.PENDENTE
                          ? "secondary"
                          : "default"
                      }
                      className={cn(
                        lancamento.status === StatusLancamento.PENDENTE
                          ? atrasada 
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      )}
                    >
                      {lancamento.status === StatusLancamento.PENDENTE
                        ? "Pendente"
                        : lancamento.tipo === TipoLancamento.RECEITA
                          ? "Recebido"
                          : "Pago"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditarLancamento(lancamento)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {lancamento.anexos && lancamento.anexos.length > 0 && (
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver anexos ({lancamento.anexos.length})
                          </DropdownMenuItem>
                        )}
                        {atrasada && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleRenegociar(lancamento)}
                              className="text-amber-600"
                            >
                              <HandshakeIcon className="mr-2 h-4 w-4" />
                              Renegociar
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleExcluir(lancamento)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    ))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Receitas e Despesas
              </h1>
              <p className="text-muted-foreground">
                Gerencie receitas, despesas, categorizações e renegociações do escritório
              </p>
            </div>

            {/* Cards de Resumo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Receitas
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(resumo.totalReceitas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(resumo.receitasPendentes)} pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Despesas
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(resumo.totalDespesas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(resumo.despesasPendentes)} pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Saldo Atual
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-2xl font-bold",
                    resumo.saldo >= 0 ? "text-blue-600" : "text-red-600"
                  )}>
                    {formatCurrency(resumo.saldo)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas recebidas - Despesas pagas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Contas Atrasadas
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {lancamentos.filter(isAtrasada).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Necessitam atenção imediata
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <FiltrosComponent
              filtros={filtros}
              onFiltrosChange={setFiltros}
              tipoAtivo={abaAtiva}
            />

            {/* Tabs de Receitas e Despesas */}
            <Tabs value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as TipoLancamento)}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value={TipoLancamento.RECEITA}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Receitas
                  </TabsTrigger>
                  <TabsTrigger value={TipoLancamento.DESPESA}>
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Despesas
                  </TabsTrigger>
                </TabsList>
                <Button 
                  onClick={() => handleNovoLancamento(abaAtiva)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {abaAtiva === TipoLancamento.RECEITA ? "Receita" : "Despesa"}
                </Button>
              </div>

              <TabsContent value={TipoLancamento.RECEITA}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Receitas</CardTitle>
                    <CardDescription>
                      Gerencie todas as receitas do escritório
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderTabelaLancamentos()}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value={TipoLancamento.DESPESA}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Despesas</CardTitle>
                    <CardDescription>
                      Gerencie todas as despesas do escritório
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderTabelaLancamentos()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <LancamentoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitForm}
        onAnexar={handleAnexarArquivo}
        lancamento={lancamentoSelecionado}
        tipo={abaAtiva}
        loading={loading}
      />

      <RenegociacaoDialog
        open={renegociacaoOpen}
        onOpenChange={setRenegociacaoOpen}
        onSubmit={handleRenegociacaoSubmit}
        lancamento={lancamentoSelecionado}
        loading={loading}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}