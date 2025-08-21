"use client"

import { useState } from "react"
import { Plus, Receipt, TrendingUp, TrendingDown, Upload } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useReceitasDespesas } from "./use-receitas-despesas"
import { LancamentosTable } from "./components/lancamentos-table"
import { LancamentoForm } from "./components/lancamento-form"
import { FiltrosComponent } from "./components/filtros-component"
import { RenegociacaoModal } from "./components/renegociacao-modal"
import { AgrupamentoView } from "./components/agrupamento-view"
import { TipoLancamento } from "./types"

export default function ReceitasDespesasPage() {
  const {
    // Estados
    lancamentos,
    receitas,
    despesas,
    pendentes,
    historico,
    lancamentosAgrupados,
    loading,
    error,
    filtros,
    agrupamento,
    modalAberto,
    modalRenegociacao,
    lancamentoSelecionado,
    modoEdicao,

    // Ações
    criarLancamento,
    editarLancamento,
    removerLancamento,
    anexarDocumento,
    renegociarConta,

    // Controles
    setFiltros,
    setAgrupamento,
    setModalAberto,
    abrirModalCriacao,
    abrirModalEdicao,
    abrirModalRenegociacao,
    setModalRenegociacao
  } = useReceitasDespesas()

  const [tipoSelecionado, setTipoSelecionado] = useState<TipoLancamento>("receita")
  const [uploadModalAberto, setUploadModalAberto] = useState(false)
  const [lancamentoParaAnexo, setLancamentoParaAnexo] = useState<string | null>(null)

  // Função para formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  // Calcular totais
  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0)
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)
  const saldo = totalReceitas - totalDespesas

  const totalReceitasPendentes = receitas.filter(r => r.status === "pendente").reduce((sum, r) => sum + r.valor, 0)
  const totalDespesasPendentes = despesas.filter(d => d.status === "pendente").reduce((sum, d) => sum + d.valor, 0)

  // Controle de anexos
  const handleAnexar = (lancamentoId: string) => {
    setLancamentoParaAnexo(lancamentoId)
    setUploadModalAberto(true)
  }

  const handleUploadAnexo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0]
    if (arquivo && lancamentoParaAnexo) {
      await anexarDocumento(lancamentoParaAnexo, arquivo)
      setUploadModalAberto(false)
      setLancamentoParaAnexo(null)
    }
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Receitas e Despesas</h1>
          <p className="text-muted-foreground">
            Registre, categorize e gerencie receitas e despesas com anexos, renegociações e agrupamentos por processo ou beneficiário.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(totalReceitas)}
              </div>
              <p className="text-xs text-muted-foreground">
                {receitas.length} lançamento{receitas.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(totalDespesas)}
              </div>
              <p className="text-xs text-muted-foreground">
                {despesas.length} lançamento{despesas.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <Receipt className={`h-4 w-4 ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatarMoeda(saldo)}
              </div>
              <p className="text-xs text-muted-foreground">
                Receitas - Despesas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendências</CardTitle>
              <Badge variant="destructive" className="text-xs">
                {pendentes.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">
                    {formatarMoeda(totalReceitasPendentes)}
                  </span>
                  <span className="text-muted-foreground"> a receber</span>
                </div>
                <div className="text-sm">
                  <span className="text-orange-600 font-medium">
                    {formatarMoeda(totalDespesasPendentes)}
                  </span>
                  <span className="text-muted-foreground"> a pagar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <FiltrosComponent
          filtros={filtros}
          agrupamento={agrupamento}
          onFiltrosChange={setFiltros}
          onAgrupamentoChange={setAgrupamento}
        />

        {/* Conteúdo Principal */}
        {agrupamento !== "nenhum" ? (
          // Visualização Agrupada
          <AgrupamentoView
            grupos={lancamentosAgrupados}
            tipoAgrupamento={agrupamento}
            loading={loading}
            onEditar={abrirModalEdicao}
            onRemover={removerLancamento}
            onRenegociar={abrirModalRenegociacao}
            onAnexar={handleAnexar}
          />
        ) : (
          // Visualização em Abas
          <Tabs defaultValue="receitas" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="receitas">
                  Receitas ({receitas.length})
                </TabsTrigger>
                <TabsTrigger value="despesas">
                  Despesas ({despesas.length})
                </TabsTrigger>
                <TabsTrigger value="pendentes">
                  Pendentes ({pendentes.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setTipoSelecionado("receita")
                    abrirModalCriacao("receita")
                  }}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nova Receita
                </Button>
                <Button
                  onClick={() => {
                    setTipoSelecionado("despesa")
                    abrirModalCriacao("despesa")
                  }}
                  className="bg-orange-600 hover:bg-orange-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nova Despesa
                </Button>
              </div>
            </div>

            <TabsContent value="receitas" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Receitas</CardTitle>
                  <CardDescription>
                    Gerencie todas as receitas cadastradas no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LancamentosTable
                    lancamentos={receitas}
                    loading={loading}
                    onEditar={abrirModalEdicao}
                    onRemover={removerLancamento}
                    onRenegociar={abrirModalRenegociacao}
                    onAnexar={handleAnexar}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="despesas" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Despesas</CardTitle>
                  <CardDescription>
                    Gerencie todas as despesas cadastradas no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LancamentosTable
                    lancamentos={despesas}
                    loading={loading}
                    onEditar={abrirModalEdicao}
                    onRemover={removerLancamento}
                    onRenegociar={abrirModalRenegociacao}
                    onAnexar={handleAnexar}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pendentes" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lançamentos Pendentes</CardTitle>
                  <CardDescription>
                    Receitas e despesas aguardando pagamento/recebimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LancamentosTable
                    lancamentos={pendentes}
                    loading={loading}
                    onEditar={abrirModalEdicao}
                    onRemover={removerLancamento}
                    onRenegociar={abrirModalRenegociacao}
                    onAnexar={handleAnexar}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Modal de Lançamento */}
        <LancamentoForm
          aberto={modalAberto}
          onClose={() => setModalAberto(false)}
          onSubmit={modoEdicao ? (dados) => editarLancamento(lancamentoSelecionado!.id, dados) : criarLancamento}
          lancamento={lancamentoSelecionado}
          modoEdicao={modoEdicao}
          tipoInicial={tipoSelecionado}
          loading={loading}
        />

        {/* Modal de Renegociação */}
        <RenegociacaoModal
          aberto={modalRenegociacao}
          onClose={() => setModalRenegociacao(false)}
          onSubmit={(dados) => renegociarConta(lancamentoSelecionado!.id, dados)}
          lancamento={lancamentoSelecionado}
          loading={loading}
        />

        {/* Input oculto para upload de anexos */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleUploadAnexo}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onClick={() => {
            if (uploadModalAberto) {
              document.getElementById('file-upload')?.click()
            }
          }}
        />

        {/* Trigger para o input de anexos */}
        {uploadModalAberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Anexar Documento</CardTitle>
                <CardDescription>
                  Selecione um arquivo para anexar ao lançamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Arquivo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadModalAberto(false)
                    setLancamentoParaAnexo(null)
                  }}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Erro */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
