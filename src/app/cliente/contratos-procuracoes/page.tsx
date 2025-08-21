"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, DollarSign, AlertCircle, TrendingUp } from "lucide-react"
import { FiltrosDocumentos } from "./components/filtros-documentos"
import { TabelaDocumentos } from "./components/tabela-documentos"
import { ModalCriarDocumento } from "./components/modal-criar-documento"
import { ModalEditarDocumento } from "./components/modal-editar-documento"
import { ModalRenegociacao } from "./components/modal-renegociacao"
import { ModalVisualizarFinanceiro } from "./components/modal-visualizar-financeiro"
import { useContratosEProcuracoes } from "./use-contratos-procuracoes"
import { Documento, FiltrosBusca, OpcoesExportacao, UploadModelo } from "./types"

export default function ContratosEProcuracoesPage() {
  // Estados dos modais
  const [modalCriarAberto, setModalCriarAberto] = useState(false)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalRenegociacaoAberto, setModalRenegociacaoAberto] = useState(false)
  const [modalFinanceiroAberto, setModalFinanceiroAberto] = useState(false)
  const [documentoSelecionado, setDocumentoSelecionado] = useState<Documento | null>(null)

  // Hook principal com toda a lógica
  const {
    documentos,
    modelosSistema,
    loading,
    error,
    filtros,
    criarDocumento,
    editarDocumento,
    excluirDocumento,
    registrarRenegociacao,
    uploadModelo,
    exportarDocumento,
    setFiltros,
    totalDocumentos,
    totalContratos,
    totalProcuracoes,
    valorTotalNegociado,
    documentosPendentes,
    documentosPagos,
    documentosInadimplentes
  } = useContratosEProcuracoes()

  // Handlers dos modais
  const handleCriarDocumento = async (novoDocumento: Omit<Documento, "id" | "dataCriacao" | "ultimaAtualizacao">) => {
    const documento = await criarDocumento(novoDocumento)
    return documento
  }

  const handleUploadModelo = async (arquivo: File, nome: string, tipo: string) => {
    const uploadData: UploadModelo = {
      nome,
      arquivo,
      tipoDocumento: tipo as any,
      descricao: `Modelo personalizado de ${tipo}`
    }
    await uploadModelo(uploadData)
  }

  const handleEditarDocumento = (documento: Documento) => {
    setDocumentoSelecionado(documento)
    setModalEditarAberto(true)
  }

  const handleVisualizarFinanceiro = (documento: Documento) => {
    setDocumentoSelecionado(documento)
    setModalFinanceiroAberto(true)
  }

  const handleRenegociar = (documento: Documento) => {
    setDocumentoSelecionado(documento)
    setModalRenegociacaoAberto(true)
  }

  const handleLimparFiltros = () => {
    setFiltros({})
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor)
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Contratos e Procurações</h1>
        <p className="text-muted-foreground">
          Gerencie contratos e procurações com acompanhamento financeiro integrado ao contas a receber.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocumentos}</div>
            <p className="text-xs text-muted-foreground">
              {totalContratos} contratos • {totalProcuracoes} procurações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Negociado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatarMoeda(valorTotalNegociado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os valores negociados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documentosPagos}</div>
            <p className="text-xs text-muted-foreground">
              {documentosPendentes} pendentes • {documentosInadimplentes} inadimplentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atenção Necessária</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{documentosInadimplentes}</div>
            <p className="text-xs text-muted-foreground">
              Documentos com pagamento em atraso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão de ação principal */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Seus Documentos</h2>
          <p className="text-sm text-muted-foreground">
            Crie, edite e gerencie contratos e procurações com integração financeira completa.
          </p>
        </div>
        <Button 
          onClick={() => setModalCriarAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      {/* Filtros de busca */}
      <FiltrosDocumentos
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimparFiltros={handleLimparFiltros}
      />

      {/* Mensagem de erro */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de documentos */}
      <TabelaDocumentos
        documentos={documentos}
        loading={loading}
        onEditar={handleEditarDocumento}
        onExcluir={excluirDocumento}
        onExportar={exportarDocumento}
        onVisualizarFinanceiro={handleVisualizarFinanceiro}
        onRenegociar={handleRenegociar}
      />

      {/* Modais */}
      <ModalCriarDocumento
        open={modalCriarAberto}
        onOpenChange={setModalCriarAberto}
        onCriar={handleCriarDocumento}
        onUploadModelo={handleUploadModelo}
        modelosSistema={modelosSistema}
        loading={loading}
      />

      <ModalEditarDocumento
        open={modalEditarAberto}
        onOpenChange={setModalEditarAberto}
        documento={documentoSelecionado}
        onSalvar={editarDocumento}
        loading={loading}
      />

      <ModalRenegociacao
        open={modalRenegociacaoAberto}
        onOpenChange={setModalRenegociacaoAberto}
        documento={documentoSelecionado}
        onRenegociar={registrarRenegociacao}
        loading={loading}
      />

      <ModalVisualizarFinanceiro
        open={modalFinanceiroAberto}
        onOpenChange={setModalFinanceiroAberto}
        documento={documentoSelecionado}
      />
    </div>
  )
}
