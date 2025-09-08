"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Bot, Sparkles } from "lucide-react"
import { toast } from "sonner"

// Componentes
import { TokensIndicator } from "./components/tokens-indicator"
import { PecasList } from "./components/pecas-list"
import { NovaPecaDialog } from "./components/nova-peca-dialog"
import { RevisaoDialog } from "./components/revisao-dialog"
import { PesquisaDialog } from "./components/pesquisa-dialog"
import { CriacaoDialog } from "./components/criacao-dialog"
import { CompartilharDialog } from "./components/compartilhar-dialog"
import { VisualizarPecaDialog } from "./components/visualizar-peca-dialog"

// Hooks e tipos
import { usePecasIA } from "./hooks/use-pecas-ia"
import { 
  TipoFuncionalidade, 
  PecaJuridica,
  TipoPecaJuridica
} from "./types"

export default function CriacaoPecasIAPage() {
  // Estados dos dialogs
  const [novaPecaOpen, setNovaPecaOpen] = useState(false)
  const [revisaoOpen, setRevisaoOpen] = useState(false)
  const [pesquisaOpen, setPesquisaOpen] = useState(false)
  const [criacaoOpen, setCriacaoOpen] = useState(false)
  const [compartilharOpen, setCompartilharOpen] = useState(false)
  const [visualizarOpen, setVisualizarOpen] = useState(false)
  
  // Estados de dados
  const [pecaSelecionada, setPecaSelecionada] = useState<PecaJuridica | null>(null)
  
  // Hook principal
  const {
    pecas,
    clientes,
    planoTokens,
    loading,
    processando,
    criarPeca,
    compartilharPeca,
    excluirPeca,
    integrarCliente,
    pesquisarJurisprudencia,
    downloadArquivo
  } = usePecasIA()

  // Handlers de seleção de tipo
  const handleSelectType = (tipo: TipoFuncionalidade) => {
    switch (tipo) {
      case "revisao_ortografica":
        setRevisaoOpen(true)
        break
      case "pesquisa_jurisprudencia":
        setPesquisaOpen(true)
        break
      case "criacao_peca":
        setCriacaoOpen(true)
        break
    }
  }

  // Handler de revisão ortográfica
  const handleRevisao = async (prompt: string, arquivo?: File) => {
    const result = await criarPeca("revisao_ortografica", prompt, undefined, arquivo)
    if (result) {
      setRevisaoOpen(false)
      toast.success("Documento revisado com sucesso! Você pode fazer o download na lista de peças.")
    }
    return result
  }

  // Handler de pesquisa de jurisprudência
  const handlePesquisa = async (prompt: string) => {
    const resultados = await pesquisarJurisprudencia(prompt)
    
    if (resultados.length > 0) {
      // Salvar pesquisa no histórico
      await criarPeca("pesquisa_jurisprudencia", prompt)
    }
    
    return resultados
  }

  // Handler de criação de peça
  const handleCriacao = async (prompt: string, tipoPeca: TipoPecaJuridica) => {
    const result = await criarPeca("criacao_peca", prompt, tipoPeca)
    return result
  }

  // Handler de visualização
  const handleView = (peca: PecaJuridica) => {
    setPecaSelecionada(peca)
    setVisualizarOpen(true)
  }

  // Handler de compartilhamento
  const handleShare = (peca: PecaJuridica) => {
    setPecaSelecionada(peca)
    setCompartilharOpen(true)
  }

  // Handler de download
  const handleDownload = (peca: PecaJuridica) => {
    if (peca.arquivoProcessado) {
      downloadArquivo(peca.arquivoProcessado.url, peca.arquivoProcessado.nome)
    } else {
      toast.error("Arquivo não disponível para download")
    }
  }

  // Handler de exclusão
  const handleDelete = async (pecaId: string) => {
    await excluirPeca(pecaId)
  }

  // Handler de compartilhamento confirmado
  const handleCompartilharConfirm = async (pecaId: string, usuarioId: string) => {
    await compartilharPeca(pecaId, usuarioId)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <Bot className="h-6 w-6 text-blue-600" />
                    Criação de Peças com IA
                  </h1>
                  <p className="text-muted-foreground">
                    Crie, revise e pesquise documentos jurídicos com auxílio de inteligência artificial
                  </p>
                </div>
                <Button 
                  onClick={() => setNovaPecaOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                  disabled={planoTokens.tokensRestantes < 500}
                >
                  <Plus className="h-4 w-4" />
                  Nova Criação com IA
                </Button>
              </div>
            </div>

            {/* Indicador de tokens */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-1">
                <TokensIndicator planoTokens={planoTokens} />
              </div>
              
              {/* Cards de estatísticas */}
              <div className="md:col-span-3 grid gap-4 md:grid-cols-3">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Peças Criadas</p>
                      <p className="text-2xl font-bold">{pecas.length}</p>
                    </div>
                    <Sparkles className="h-8 w-8 text-blue-600 opacity-20" />
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Compartilhadas</p>
                      <p className="text-2xl font-bold">
                        {pecas.filter(p => p.compartilhamentos.length > 0).length}
                      </p>
                    </div>
                    <Sparkles className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tokens Hoje</p>
                      <p className="text-2xl font-bold">
                        {pecas
                          .filter(p => 
                            p.dataCriacao.toDateString() === new Date().toDateString()
                          )
                          .reduce((acc, p) => acc + p.tokensUtilizados, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <Sparkles className="h-8 w-8 text-yellow-600 opacity-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de peças */}
            <PecasList
              pecas={pecas}
              onView={handleView}
              onShare={handleShare}
              onDelete={handleDelete}
              onDownload={handleDownload}
              loading={loading}
            />

            {/* Dialogs */}
            <NovaPecaDialog
              open={novaPecaOpen}
              onOpenChange={setNovaPecaOpen}
              onSelectType={handleSelectType}
            />

            <RevisaoDialog
              open={revisaoOpen}
              onOpenChange={setRevisaoOpen}
              onSubmit={handleRevisao}
              processando={processando}
            />

            <PesquisaDialog
              open={pesquisaOpen}
              onOpenChange={setPesquisaOpen}
              onSubmit={handlePesquisa}
              processando={processando}
            />

            <CriacaoDialog
              open={criacaoOpen}
              onOpenChange={setCriacaoOpen}
              onSubmit={handleCriacao}
              onIntegrarCliente={integrarCliente}
              clientes={clientes}
              processando={processando}
            />

            <CompartilharDialog
              open={compartilharOpen}
              onOpenChange={setCompartilharOpen}
              peca={pecaSelecionada}
              onCompartilhar={handleCompartilharConfirm}
            />

            <VisualizarPecaDialog
              open={visualizarOpen}
              onOpenChange={setVisualizarOpen}
              peca={pecaSelecionada}
              onDownload={handleDownload}
              onShare={handleShare}
              onIntegrarCliente={integrarCliente}
              clientes={clientes}
            />
          </div>
        </div>
      </main>
    </div>
  )
}