import { useState, useCallback, useEffect } from "react"
import { 
  PecaJuridica, 
  PlanoTokens, 
  Cliente, 
  ResultadoPesquisa,
  TipoFuncionalidade,
  TipoPecaJuridica,
  StatusPeca
} from "../types"
import { toast } from "sonner"

// Mock data para desenvolvimento
const MOCK_PECAS: PecaJuridica[] = [
  {
    id: "1",
    tipo: "criacao_peca",
    tipoPeca: "peticao_inicial",
    titulo: "Petição Inicial - Ação de Cobrança",
    conteudo: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO...",
    promptUtilizado: "Criar petição inicial de ação de cobrança...",
    status: "concluida",
    tokensUtilizados: 1250,
    usuarioCriadorId: "user1",
    usuarioCriadorNome: "Dr. João Silva",
    dataCriacao: new Date("2025-09-05"),
    dataUltimaModificacao: new Date("2025-09-05"),
    compartilhamentos: []
  },
  {
    id: "2",
    tipo: "revisao_ortografica",
    titulo: "Revisão - Contrato de Prestação de Serviços",
    conteudo: "Contrato revisado ortograficamente...",
    promptUtilizado: "Revisar ortograficamente o documento...",
    status: "concluida",
    tokensUtilizados: 450,
    usuarioCriadorId: "user1",
    usuarioCriadorNome: "Dr. João Silva",
    dataCriacao: new Date("2025-09-04"),
    dataUltimaModificacao: new Date("2025-09-04"),
    arquivoOriginal: {
      nome: "contrato_original.pdf",
      tipo: "application/pdf",
      tamanho: 256000
    },
    arquivoProcessado: {
      nome: "contrato_revisado.pdf",
      url: "/downloads/contrato_revisado.pdf"
    },
    compartilhamentos: [
      {
        id: "share1",
        usuarioDestinoId: "user2",
        usuarioDestinoNome: "Dra. Maria Santos",
        dataCompartilhamento: new Date("2025-09-04"),
        permissoes: {
          podeExportar: true,
          podeIntegrarCliente: true
        }
      }
    ]
  }
]

const MOCK_CLIENTES: Cliente[] = [
  {
    id: "cli1",
    nome: "João da Silva",
    cpfCnpj: "123.456.789-00",
    email: "joao@email.com",
    telefone: "(11) 98765-4321",
    endereco: {
      logradouro: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    }
  },
  {
    id: "cli2",
    nome: "Empresa ABC Ltda",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@empresaabc.com",
    telefone: "(11) 3333-4444",
    endereco: {
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100"
    }
  }
]

const MOCK_PLANO: PlanoTokens = {
  planoId: "plano1",
  planoNome: "Plano Profissional",
  tokensTotal: 50000,
  tokensUtilizados: 12500,
  tokensRestantes: 37500,
  dataRenovacao: new Date("2025-10-01")
}

export function usePecasIA() {
  const [pecas, setPecas] = useState<PecaJuridica[]>(MOCK_PECAS)
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES)
  const [planoTokens, setPlanoTokens] = useState<PlanoTokens>(MOCK_PLANO)
  const [loading, setLoading] = useState(false)
  const [processando, setProcessando] = useState(false)

  // Buscar peças do backend
  const carregarPecas = useCallback(async () => {
    setLoading(true)
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 500))
      setPecas(MOCK_PECAS)
    } catch (error) {
      toast.error("Erro ao carregar peças")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar nova peça com IA
  const criarPeca = useCallback(async (
    tipo: TipoFuncionalidade,
    prompt: string,
    tipoPeca?: TipoPecaJuridica,
    arquivo?: File
  ) => {
    // Verificar tokens disponíveis
    const tokensEstimados = tipo === "revisao_ortografica" ? 500 : 1500
    
    if (planoTokens.tokensRestantes < tokensEstimados) {
      toast.error("Tokens insuficientes. Faça upgrade do seu plano ou aguarde a renovação mensal.")
      return null
    }

    setProcessando(true)
    try {
      // Simular processamento IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const novaPeca: PecaJuridica = {
        id: Date.now().toString(),
        tipo,
        tipoPeca,
        titulo: `${tipo === "revisao_ortografica" ? "Revisão" : tipo === "pesquisa_jurisprudencia" ? "Pesquisa" : "Peça"} - ${new Date().toLocaleDateString()}`,
        conteudo: "Conteúdo gerado pela IA...",
        promptUtilizado: prompt,
        status: "concluida",
        tokensUtilizados: tokensEstimados,
        usuarioCriadorId: "user1",
        usuarioCriadorNome: "Usuário Atual",
        dataCriacao: new Date(),
        dataUltimaModificacao: new Date(),
        compartilhamentos: [],
        ...(arquivo && {
          arquivoOriginal: {
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size
          },
          arquivoProcessado: {
            nome: arquivo.name.replace(/\.[^/.]+$/, "_processado.pdf"),
            url: `/downloads/${arquivo.name}`
          }
        })
      }
      
      setPecas(prev => [novaPeca, ...prev])
      
      // Atualizar tokens
      setPlanoTokens(prev => ({
        ...prev,
        tokensUtilizados: prev.tokensUtilizados + tokensEstimados,
        tokensRestantes: prev.tokensRestantes - tokensEstimados
      }))
      
      toast.success(tipo === "revisao_ortografica" 
        ? "Documento revisado com sucesso!" 
        : tipo === "pesquisa_jurisprudencia"
        ? "Pesquisa concluída!"
        : "Peça criada com sucesso!")
      
      return novaPeca
    } catch (error) {
      toast.error("Erro ao processar solicitação")
      console.error(error)
      return null
    } finally {
      setProcessando(false)
    }
  }, [planoTokens.tokensRestantes])

  // Compartilhar peça
  const compartilharPeca = useCallback(async (
    pecaId: string, 
    usuarioDestinoId: string
  ) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPecas(prev => prev.map(peca => {
        if (peca.id === pecaId) {
          return {
            ...peca,
            compartilhamentos: [
              ...peca.compartilhamentos,
              {
                id: Date.now().toString(),
                usuarioDestinoId,
                usuarioDestinoNome: "Usuário Destinatário",
                dataCompartilhamento: new Date(),
                permissoes: {
                  podeExportar: true,
                  podeIntegrarCliente: true
                }
              }
            ]
          }
        }
        return peca
      }))
      
      toast.success("Peça compartilhada com sucesso!")
    } catch (error) {
      toast.error("Erro ao compartilhar peça")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Excluir peça
  const excluirPeca = useCallback(async (pecaId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPecas(prev => prev.filter(peca => peca.id !== pecaId))
      toast.success("Peça excluída com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir peça")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Integrar com dados do cliente
  const integrarCliente = useCallback(async (
    pecaId: string,
    clienteId: string
  ): Promise<string | null> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const cliente = clientes.find(c => c.id === clienteId)
      if (!cliente) {
        throw new Error("Cliente não encontrado")
      }
      
      // Simular geração de documento com dados do cliente
      const urlDocumento = `/downloads/peca_${pecaId}_cliente_${clienteId}.docx`
      
      toast.success("Documento gerado com dados do cliente!")
      return urlDocumento
    } catch (error) {
      toast.error("Erro ao integrar dados do cliente")
      console.error(error)
      return null
    } finally {
      setLoading(false)
    }
  }, [clientes])

  // Pesquisar jurisprudência
  const pesquisarJurisprudencia = useCallback(async (
    prompt: string
  ): Promise<ResultadoPesquisa[]> => {
    setProcessando(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular resultados de pesquisa
      const resultados: ResultadoPesquisa[] = [
        {
          id: "1",
          titulo: "REsp 1.234.567/SP",
          tribunal: "STJ",
          relator: "Min. João Silva",
          dataJulgamento: new Date("2025-08-15"),
          ementa: "CIVIL. PROCESSO CIVIL. AÇÃO DE COBRANÇA...",
          link: "https://stj.jus.br/..."
        },
        {
          id: "2",
          titulo: "AC 98765432-12.2025.8.26.0100",
          tribunal: "TJSP",
          relator: "Des. Maria Santos",
          dataJulgamento: new Date("2025-08-20"),
          ementa: "APELAÇÃO CÍVEL. COBRANÇA. PRESTAÇÃO DE SERVIÇOS...",
          link: "https://tjsp.jus.br/..."
        }
      ]
      
      return resultados
    } catch (error) {
      toast.error("Erro na pesquisa de jurisprudência")
      console.error(error)
      return []
    } finally {
      setProcessando(false)
    }
  }, [])

  // Fazer download de arquivo
  const downloadArquivo = useCallback(async (url: string, nomeArquivo: string) => {
    try {
      // Simular download
      const link = document.createElement('a')
      link.href = url
      link.download = nomeArquivo
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Download iniciado!")
    } catch (error) {
      toast.error("Erro ao fazer download")
      console.error(error)
    }
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    carregarPecas()
  }, [carregarPecas])

  return {
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
  }
}