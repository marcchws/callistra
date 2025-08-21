"use client"

import { useState, useEffect, useReducer, useCallback } from "react"
import { toast } from "sonner"
import type { 
  PecaDocumento, 
  TipoFuncionalidade, 
  TipoPecaJuridica,
  MensagemChat,
  DadosClienteIntegrado,
  ControleTokens,
  LoadingStates,
  PecaAction,
  Compartilhamento
} from "./types"

// Estado inicial das operações de loading
const initialLoadingState: LoadingStates = {
  enviando_ia: false,
  integrando_cliente: false,
  exportando_arquivo: false,
  compartilhando: false,
  excluindo: false,
  carregando_historico: false
}

// Reducer para gerenciar estado complexo
function pecaReducer(state: any, action: PecaAction) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      }
    case "SET_PECA":
      return {
        ...state,
        pecaAtual: action.payload
      }
    case "ADD_MENSAGEM":
      return {
        ...state,
        pecaAtual: state.pecaAtual ? {
          ...state.pecaAtual,
          chat_peca_juridica: [...state.pecaAtual.chat_peca_juridica, action.payload]
        } : null
      }
    case "SET_TOKENS":
      return {
        ...state,
        controleTokens: action.payload
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export function useCriacaoPecasIA() {
  // Estado principal usando reducer
  const [state, dispatch] = useReducer(pecaReducer, {
    loading: initialLoadingState,
    pecaAtual: null as PecaDocumento | null,
    controleTokens: null as ControleTokens | null,
    error: null as string | null
  })

  // Estados específicos
  const [historicoPecas, setHistoricoPecas] = useState<PecaDocumento[]>([])
  const [clientesDisponiveis, setClientesDisponiveis] = useState<DadosClienteIntegrado[]>([])
  const [tipoAtivo, setTipoAtivo] = useState<TipoFuncionalidade>("revisao_ortografica")
  const [pecaSelecionada, setPecaSelecionada] = useState<TipoPecaJuridica | null>(null)
  const [promptEditado, setPromptEditado] = useState<string>("") 
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null)

  // Prompts pré-configurados conforme especificado no PRD
  const promptsPadrao = {
    revisao_ortografica: "Por favor, revise este documento jurídico corrigindo erros ortográficos, gramaticais e de concordância, mantendo o tom formal e a terminologia jurídica apropriada. Preserve a estrutura original do documento.",
    pesquisa_jurisprudencia: "Realize uma pesquisa detalhada de jurisprudência sobre o tema solicitado, incluindo decisões de tribunais superiores, súmulas aplicáveis e precedentes relevantes. Organize as informações por relevância e inclua as fontes.",
    criacao_peca_juridica: "Crie uma peça jurídica profissional seguindo as normas técnicas e formais da advocacia, com estrutura adequada, fundamentos legais sólidos e linguagem jurídica apropriada."
  }

  // Tipos de peças jurídicas disponíveis
  const tiposPecas: { value: TipoPecaJuridica; label: string }[] = [
    { value: "petição_inicial", label: "Petição Inicial" },
    { value: "contestação", label: "Contestação" },
    { value: "recurso_apelação", label: "Recurso de Apelação" },
    { value: "embargos_declaração", label: "Embargos de Declaração" },
    { value: "agravo_instrumento", label: "Agravo de Instrumento" },
    { value: "mandado_segurança", label: "Mandado de Segurança" },
    { value: "habeas_corpus", label: "Habeas Corpus" },
    { value: "ação_trabalhista", label: "Ação Trabalhista" },
    { value: "defesa_trabalhista", label: "Defesa Trabalhista" },
    { value: "recurso_trabalhista", label: "Recurso Trabalhista" }
  ]

  // Carregamento inicial
  useEffect(() => {
    carregarDadosIniciais()
  }, [])

  const carregarDadosIniciais = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: { key: "carregando_historico", value: true } })
      
      // Simular carregamento de dados (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock de controle de tokens
      const mockTokens: ControleTokens = {
        plano_atual: "Profissional",
        tokens_disponiveis: 8500,
        tokens_utilizados_mes: 1500,
        limite_mensal: 10000,
        data_renovacao: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      }
      
      // Mock de clientes disponíveis
      const mockClientes: DadosClienteIntegrado[] = [
        {
          id: "1",
          nome: "João Silva Santos",
          documento: "123.456.789-00",
          endereco: "Rua das Flores, 123, São Paulo, SP",
          telefone: "(11) 99999-9999",
          email: "joao.silva@email.com"
        },
        {
          id: "2",
          nome: "Empresa ABC Ltda",
          documento: "12.345.678/0001-90",
          endereco: "Av. Paulista, 1000, São Paulo, SP",
          telefone: "(11) 3333-3333",
          email: "contato@empresaabc.com.br"
        }
      ]
      
      dispatch({ type: "SET_TOKENS", payload: mockTokens })
      setClientesDisponiveis(mockClientes)
      setHistoricoPecas([])
      
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro ao carregar dados iniciais" })
      toast.error("Erro ao carregar dados iniciais", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "carregando_historico", value: false } })
    }
  }

  // Enviar prompt para IA
  const enviarParaIA = useCallback(async (prompt: string, arquivo?: File) => {
    if (!state.controleTokens) {
      toast.error("Erro: informações de tokens não carregadas", { duration: 3000, position: "bottom-right" })
      return
    }

    if (state.controleTokens.tokens_disponiveis <= 0) {
      toast.error("Limite de tokens atingido, aguarde renovação do plano", { duration: 3000, position: "bottom-right" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: { key: "enviando_ia", value: true } })
      
      // Simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock de resposta da IA
      const respostaIA = gerarRespostaMock(tipoAtivo, prompt)
      
      // Criar nova peça/documento
      const novaPeca: PecaDocumento = {
        id: `peca_${Date.now()}`,
        tipo_funcionalidade: tipoAtivo,
        lista_pecas_juridicas: pecaSelecionada || undefined,
        prompt_preconfigurado: prompt,
        chat_peca_juridica: [
          {
            id: `msg_user_${Date.now()}`,
            tipo: "user",
            conteudo: prompt,
            timestamp: new Date()
          },
          {
            id: `msg_ai_${Date.now()}`,
            tipo: "assistant",
            conteudo: respostaIA,
            timestamp: new Date(),
            tokens_consumidos: Math.floor(Math.random() * 500) + 100
          }
        ],
        compartilhamento: [],
        usuario_criador: "usuario_atual", // Substituir por usuário logado
        tokens_utilizados: Math.floor(Math.random() * 500) + 100,
        data_criacao: new Date()
      }
      
      if (tipoAtivo === "revisao_ortografica" && arquivo) {
        novaPeca.arquivo_revisado = {
          nome: `${arquivo.name.split('.')[0]}_revisado.${arquivo.name.split('.').pop()}`,
          url: `/temp/revisados/${novaPeca.id}.${arquivo.name.split('.').pop()}`,
          tipo: arquivo.type.includes('pdf') ? 'pdf' : 'docx',
          data_revisao: new Date()
        }
      }
      
      if (tipoAtivo === "pesquisa_jurisprudencia") {
        novaPeca.resultado_pesquisa = {
          conteudo: respostaIA,
          fontes: [
            "STJ - REsp 1.234.567/SP",
            "STF - RE 987.654/RJ",
            "TRT-2 - RO 456.789/SP"
          ],
          data_pesquisa: new Date()
        }
      }
      
      dispatch({ type: "SET_PECA", payload: novaPeca })
      setHistoricoPecas(prev => [novaPeca, ...prev])
      
      // Atualizar tokens
      const novosTokens = {
        ...state.controleTokens,
        tokens_disponiveis: state.controleTokens.tokens_disponiveis - novaPeca.tokens_utilizados,
        tokens_utilizados_mes: state.controleTokens.tokens_utilizados_mes + novaPeca.tokens_utilizados
      }
      dispatch({ type: "SET_TOKENS", payload: novosTokens })
      
      toast.success("Processamento concluído com sucesso!", { duration: 2000, position: "bottom-right" })
      
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Erro ao processar com IA" })
      toast.error("Erro ao processar com IA", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "enviando_ia", value: false } })
    }
  }, [tipoAtivo, pecaSelecionada, state.controleTokens])

  // Integrar com dados do cliente
  const integrarComCliente = useCallback(async (clienteId: string) => {
    if (!state.pecaAtual) {
      toast.error("Nenhuma peça selecionada para integração", { duration: 3000, position: "bottom-right" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: { key: "integrando_cliente", value: true } })
      
      const cliente = clientesDisponiveis.find(c => c.id === clienteId)
      if (!cliente) {
        throw new Error("Cliente não encontrado")
      }
      
      // Simular integração
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const pecaAtualizada: PecaDocumento = {
        ...state.pecaAtual,
        dados_cliente_integrado: cliente,
        arquivo_exportado: {
          nome: `${state.pecaAtual.tipo_funcionalidade}_${cliente.nome.replace(/\s+/g, '_')}.docx`,
          url: `/temp/exportados/${state.pecaAtual.id}_${clienteId}.docx`,
          tipo: "docx",
          data_geracao: new Date()
        }
      }
      
      dispatch({ type: "SET_PECA", payload: pecaAtualizada })
      toast.success("Dados do cliente integrados com sucesso!", { duration: 2000, position: "bottom-right" })
      
    } catch (error) {
      toast.error("Erro ao integrar dados do cliente", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "integrando_cliente", value: false } })
    }
  }, [state.pecaAtual, clientesDisponiveis])

  // Compartilhar peça
  const compartilharPeca = useCallback(async (usuarioDestino: string) => {
    if (!state.pecaAtual) {
      toast.error("Nenhuma peça selecionada para compartilhamento", { duration: 3000, position: "bottom-right" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: { key: "compartilhando", value: true } })
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const novoCompartilhamento: Compartilhamento = {
        id: `share_${Date.now()}`,
        usuario_destinatario: usuarioDestino,
        data_compartilhamento: new Date(),
        pode_integrar_cliente: true,
        pode_exportar: true
      }
      
      const pecaAtualizada: PecaDocumento = {
        ...state.pecaAtual,
        compartilhamento: [...state.pecaAtual.compartilhamento, novoCompartilhamento]
      }
      
      dispatch({ type: "SET_PECA", payload: pecaAtualizada })
      toast.success("Peça compartilhada com sucesso!", { duration: 2000, position: "bottom-right" })
      
    } catch (error) {
      toast.error("Erro ao compartilhar peça", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "compartilhando", value: false } })
    }
  }, [state.pecaAtual])

  // Excluir peça (apenas criador)
  const excluirPeca = useCallback(async (pecaId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: { key: "excluindo", value: true } })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHistoricoPecas(prev => prev.filter(p => p.id !== pecaId))
      
      if (state.pecaAtual?.id === pecaId) {
        dispatch({ type: "SET_PECA", payload: null as any })
      }
      
      toast.success("Peça excluída com sucesso!", { duration: 2000, position: "bottom-right" })
      
    } catch (error) {
      toast.error("Erro ao excluir peça", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "excluindo", value: false } })
    }
  }, [state.pecaAtual])

  // Download de arquivo
  const downloadArquivo = useCallback(async (url: string, nome: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: { key: "exportando_arquivo", value: true } })
      
      // Simular download
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Em implementação real, fazer download do arquivo
      const link = document.createElement('a')
      link.href = url
      link.download = nome
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Download realizado com sucesso!", { duration: 2000, position: "bottom-right" })
      
    } catch (error) {
      toast.error("Erro ao fazer download", { duration: 3000, position: "bottom-right" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "exportando_arquivo", value: false } })
    }
  }, [])

  // Função para gerar resposta mock da IA
  const gerarRespostaMock = (tipo: TipoFuncionalidade, prompt: string): string => {
    switch (tipo) {
      case "revisao_ortografica":
        return "Documento revisado com correções ortográficas e gramaticais aplicadas. Foram corrigidos 12 erros de concordância, 8 erros ortográficos e 5 ajustes de pontuação. O documento mantém o tom formal e a terminologia jurídica apropriada."
      
      case "pesquisa_jurisprudencia":
        return `Com base na pesquisa realizada sobre o tema "${prompt.substring(0, 50)}...", foram encontrados os seguintes precedentes relevantes:

1. STJ - REsp 1.234.567/SP - Decisão que estabelece entendimento sobre...

2. STF - RE 987.654/RJ - Precedente vinculante que determina...

3. TRT-2 - RO 456.789/SP - Jurisprudência trabalhista consolidada...

Essas decisões formam um conjunto sólido de fundamentação jurídica para o caso em análise.`
      
      case "criacao_peca_juridica":
        return `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL DE [COMARCA]

[NOME DO CLIENTE], [qualificação], vem, respeitosamente, perante Vossa Excelência, por meio de seu procurador que esta subscreve, com fulcro no artigo [base legal], propor a presente

[TIPO DA AÇÃO]

contra [REQUERIDO], pelos fatos e fundamentos jurídicos a seguir expostos:

I - DOS FATOS

[Narrativa dos fatos relevantes]

II - DO DIREITO

[Fundamentação jurídica]

Termos em que,
Pede deferimento.

[Local], [data].

[Nome do advogado]
OAB/[UF] nº [número]`
      
      default:
        return "Processamento concluído com sucesso."
    }
  }

  // Resetar para nova peça
  const resetarPeca = useCallback(() => {
    dispatch({ type: "SET_PECA", payload: null as any })
    setPromptEditado("")
    setPecaSelecionada(null)
    setArquivoUpload(null)
  }, [])

  return {
    // Estado
    loading: state.loading,
    error: state.error,
    pecaAtual: state.pecaAtual,
    controleTokens: state.controleTokens,
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
  }
}
