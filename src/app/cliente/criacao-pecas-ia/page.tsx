"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Bot, RotateCcw } from "lucide-react"
import { toast } from "sonner"

// Hooks e tipos
import { useCriacaoPecasIA } from "./use-criacao-pecas-ia"
import type { TipoFuncionalidade } from "./types"

// Componentes
import { ControleTokensComponent } from "./components/controle-tokens"
import { RevisaoOrtografica } from "./components/revisao-ortografica"
import { PesquisaJurisprudencia } from "./components/pesquisa-jurisprudencia"
import { CriacaoPecaJuridica } from "./components/criacao-peca-juridica"
import { ChatIA } from "./components/chat-ia"
import { IntegracaoCliente } from "./components/integracao-cliente"
import { CompartilhamentoPeca } from "./components/compartilhamento-peca"
import { HistoricoPecas } from "./components/historico-pecas"

export default function CriacaoPecasIAPage() {
  const {
    // Estado
    loading,
    error,
    pecaAtual,
    controleTokens,
    historicoPecas,
    clientesDisponiveis,
    tipoAtivo,
    pecaSelecionada,
    promptEditado,
    arquivoUpload,
    
    // Dados estáticos
    promptsPadrao,
    tiposPecas,
    
    // Ações
    enviarParaIA,
    integrarComCliente,
    compartilharPeca,
    excluirPeca,
    downloadArquivo,
    resetarPeca,
    
    // Setters
    setTipoAtivo,
    setPecaSelecionada,
    setPromptEditado,
    setArquivoUpload
  } = useCriacaoPecasIA()

  // Controle da aba ativa
  const [abaAtiva, setAbaAtiva] = useState<TipoFuncionalidade>("revisao_ortografica")

  // Handles para mudança de tipo
  const handleMudancaTipo = (novoTipo: TipoFuncionalidade) => {
    setTipoAtivo(novoTipo)
    setAbaAtiva(novoTipo)
    // Reset dos estados específicos ao mudar de tipo
    setPromptEditado("")
    setPecaSelecionada(null)
    setArquivoUpload(null)
  }

  // Handle para seleção de peça do histórico
  const handleSelecionarPecaHistorico = (peca: any) => {
    // Implementar lógica para carregar peça selecionada
    toast.info("Peça carregada do histórico", { duration: 2000, position: "bottom-right" })
  }

  // Handle para exclusão de peça (apenas criador)
  const handleExcluirPeca = async () => {
    if (pecaAtual) {
      await excluirPeca(pecaAtual.id)
      resetarPeca()
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Criação de peças com IA</h1>
        <p className="text-muted-foreground">
          Revisão ortográfica, pesquisa de jurisprudência e criação de peças jurídicas com auxílio de IA, 
          controle de tokens por plano e compartilhamento
        </p>
      </div>

      {/* Controle de Tokens */}
      <ControleTokensComponent controleTokens={controleTokens} />

      {/* Erro geral */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm font-medium text-red-800">Erro no sistema</div>
          <div className="text-xs text-red-600 mt-1">{error}</div>
        </div>
      )}

      {/* Layout principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda - Controles principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seletor de funcionalidade */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Selecione a funcionalidade</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={abaAtiva} onValueChange={(value) => handleMudancaTipo(value as TipoFuncionalidade)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="revisao_ortografica" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Revisão
                  </TabsTrigger>
                  <TabsTrigger value="pesquisa_jurisprudencia" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Pesquisa
                  </TabsTrigger>
                  <TabsTrigger value="criacao_peca_juridica" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Peça Jurídica
                  </TabsTrigger>
                </TabsList>

                {/* Conteúdo das abas */}
                <div className="mt-6">
                  <TabsContent value="revisao_ortografica" className="space-y-0">
                    <RevisaoOrtografica
                      promptPadrao={promptsPadrao.revisao_ortografica}
                      promptEditado={promptEditado}
                      setPromptEditado={setPromptEditado}
                      arquivoUpload={arquivoUpload}
                      setArquivoUpload={setArquivoUpload}
                      onEnviarParaIA={enviarParaIA}
                      loading={loading.enviando_ia}
                      arquivoRevisado={pecaAtual?.arquivo_revisado}
                      onDownload={downloadArquivo}
                      loadingDownload={loading.exportando_arquivo}
                    />
                  </TabsContent>

                  <TabsContent value="pesquisa_jurisprudencia" className="space-y-0">
                    <PesquisaJurisprudencia
                      promptPadrao={promptsPadrao.pesquisa_jurisprudencia}
                      promptEditado={promptEditado}
                      setPromptEditado={setPromptEditado}
                      onEnviarParaIA={enviarParaIA}
                      loading={loading.enviando_ia}
                      resultadoPesquisa={pecaAtual?.resultado_pesquisa}
                    />
                  </TabsContent>

                  <TabsContent value="criacao_peca_juridica" className="space-y-0">
                    <CriacaoPecaJuridica
                      promptPadrao={promptsPadrao.criacao_peca_juridica}
                      promptEditado={promptEditado}
                      setPromptEditado={setPromptEditado}
                      tiposPecas={tiposPecas}
                      pecaSelecionada={pecaSelecionada}
                      setPecaSelecionada={setPecaSelecionada}
                      onEnviarParaIA={enviarParaIA}
                      loading={loading.enviando_ia}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Chat com IA - aparece após envio */}
          {(pecaAtual?.chat_peca_juridica.length > 0 || loading.enviando_ia) && (
            <ChatIA
              mensagens={pecaAtual?.chat_peca_juridica || []}
              loading={loading.enviando_ia}
            />
          )}

          {/* Integração com Cliente - aparece após resposta da IA para peças jurídicas */}
          {pecaAtual && (abaAtiva === "criacao_peca_juridica" || pecaAtual.tipo_funcionalidade === "criacao_peca_juridica") && (
            <IntegracaoCliente
              clientesDisponiveis={clientesDisponiveis}
              clienteIntegrado={pecaAtual.dados_cliente_integrado}
              arquivoExportado={pecaAtual.arquivo_exportado}
              onIntegrarCliente={integrarComCliente}
              onDownload={downloadArquivo}
              loading={loading.integrando_cliente}
              loadingDownload={loading.exportando_arquivo}
            />
          )}

          {/* Compartilhamento - aparece quando há peça ativa */}
          {pecaAtual && (
            <CompartilhamentoPeca
              compartilhamentos={pecaAtual.compartilhamento}
              onCompartilhar={compartilharPeca}
              onExcluirPeca={handleExcluirPeca}
              loading={loading.compartilhando}
              loadingExclusao={loading.excluindo}
              isCreator={pecaAtual.usuario_criador === "usuario_atual"} // Substituir por lógica real
            />
          )}
        </div>

        {/* Coluna direita - Histórico */}
        <div className="space-y-6">
          <HistoricoPecas
            pecas={historicoPecas}
            pecaAtual={pecaAtual}
            onSelecionarPeca={handleSelecionarPecaHistorico}
            loading={loading.carregando_historico}
          />

          {/* Ações rápidas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={resetarPeca}
                disabled={Object.values(loading).some(Boolean)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Nova Peça
              </Button>

              {controleTokens && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status do Plano</div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{controleTokens.plano_atual}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {controleTokens.tokens_disponiveis.toLocaleString()} tokens
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
