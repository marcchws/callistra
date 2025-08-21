"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  LancamentoFinanceiro, 
  LancamentoFinanceiroForm, 
  RenegociacaoForm,
  FiltrosLancamento,
  TipoAgrupamento,
  LancamentoAgrupado,
  Anexo,
  TipoLancamento,
  StatusLancamento
} from "./types"

// Hook principal seguindo Requirements Lock
export function useReceitasDespesas() {
  // Estados defensivos obrigatórios
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para filtros conforme critérios de aceite
  const [filtros, setFiltros] = useState<FiltrosLancamento>({})
  const [agrupamento, setAgrupamento] = useState<TipoAgrupamento>("nenhum")
  
  // Estados para modais
  const [modalAberto, setModalAberto] = useState(false)
  const [modalRenegociacao, setModalRenegociacao] = useState(false)
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<LancamentoFinanceiro | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Simulação de dados - substituir por API real
  useEffect(() => {
    carregarLancamentos()
  }, [])

  const carregarLancamentos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulação de dados conforme especificado
      const dadosSimulados: LancamentoFinanceiro[] = [
        {
          id: "1",
          tipo: "receita",
          categoria: "Honorários Advocatícios",
          subcategoria: "Sucesso",
          valor: 5000,
          dataVencimento: new Date("2024-12-15"),
          status: "pendente",
          processo: "PROC-2024-001",
          beneficiario: "Cliente A",
          observacoes: "Honorários de sucesso - processo trabalhista",
          criadoPor: "Admin",
          criadoEm: new Date("2024-11-01")
        },
        {
          id: "2",
          tipo: "despesa",
          categoria: "Taxas e Custas Judiciais",
          subcategoria: "Custas Processuais",
          valor: 150,
          dataVencimento: new Date("2024-11-30"),
          dataPagamento: new Date("2024-11-28"),
          status: "historico",
          processo: "PROC-2024-001",
          beneficiario: "Tribunal de Justiça",
          criadoPor: "Admin",
          criadoEm: new Date("2024-11-01")
        }
      ]
      
      setLancamentos(dadosSimulados)
    } catch (err) {
      setError("Erro ao carregar lançamentos")
      toast.error("Erro ao carregar lançamentos")
    } finally {
      setLoading(false)
    }
  }

  // Criar lançamento - Cenários 1 e 2
  const criarLancamento = async (dados: LancamentoFinanceiroForm) => {
    setLoading(true)
    setError(null)

    try {
      const novoLancamento: LancamentoFinanceiro = {
        id: Date.now().toString(),
        ...dados,
        status: dados.dataPagamento ? "historico" : "pendente", // Status automático baseado em data
        criadoPor: "Usuário Atual", // Substituir por usuário logado
        criadoEm: new Date()
      }

      setLancamentos(prev => [...prev, novoLancamento])
      
      // Toast discreto conforme patterns
      toast.success(
        `${dados.tipo === "receita" ? "Receita" : "Despesa"} cadastrada com sucesso!`,
        { duration: 2000, position: "bottom-right" }
      )
      
      setModalAberto(false)
    } catch (err) {
      setError("Erro ao criar lançamento")
      toast.error("Erro ao criar lançamento", { duration: 3000, position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  // Editar lançamento - Cenário 3
  const editarLancamento = async (id: string, dados: LancamentoFinanceiroForm) => {
    setLoading(true)
    setError(null)

    try {
      setLancamentos(prev => prev.map(lancamento => 
        lancamento.id === id 
          ? {
              ...lancamento,
              ...dados,
              status: dados.dataPagamento ? "historico" : "pendente",
              modificadoPor: "Usuário Atual",
              modificadoEm: new Date()
            }
          : lancamento
      ))

      toast.success("Lançamento atualizado com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
      
      setModalAberto(false)
      setLancamentoSelecionado(null)
      setModoEdicao(false)
    } catch (err) {
      setError("Erro ao editar lançamento")
      toast.error("Erro ao editar lançamento", { duration: 3000, position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  // Remover lançamento - Cenário 4
  const removerLancamento = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      setLancamentos(prev => prev.filter(lancamento => lancamento.id !== id))
      
      toast.success("Lançamento removido com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      setError("Erro ao remover lançamento")
      toast.error("Erro ao remover lançamento", { duration: 3000, position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  // Anexar documento - Cenário 5
  const anexarDocumento = async (lancamentoId: string, arquivo: File) => {
    setLoading(true)
    setError(null)

    try {
      const novoAnexo: Anexo = {
        id: Date.now().toString(),
        nome: arquivo.name,
        url: URL.createObjectURL(arquivo), // Simulação - substituir por upload real
        tipo: arquivo.type,
        tamanho: arquivo.size,
        dataUpload: new Date()
      }

      setLancamentos(prev => prev.map(lancamento => 
        lancamento.id === lancamentoId
          ? {
              ...lancamento,
              anexos: [...(lancamento.anexos || []), novoAnexo]
            }
          : lancamento
      ))

      toast.success("Documento anexado ao lançamento", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      setError("Erro ao anexar documento")
      toast.error("Erro ao anexar documento", { duration: 3000, position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  // Renegociar conta - Cenário 6
  const renegociarConta = async (lancamentoId: string, dados: RenegociacaoForm) => {
    setLoading(true)
    setError(null)

    try {
      const lancamento = lancamentos.find(l => l.id === lancamentoId)
      if (!lancamento) {
        throw new Error("Lançamento não encontrado")
      }

      const novaRenegociacao = {
        id: Date.now().toString(),
        dataRenegociacao: new Date(),
        valorOriginal: lancamento.valor,
        novoValor: dados.novoValor,
        jurosAplicados: dados.jurosAplicados,
        observacoes: dados.observacoes,
        usuarioResponsavel: "Usuário Atual"
      }

      setLancamentos(prev => prev.map(l => 
        l.id === lancamentoId
          ? {
              ...l,
              valor: dados.novoValor,
              renegociacoes: [...(l.renegociacoes || []), novaRenegociacao],
              modificadoPor: "Usuário Atual",
              modificadoEm: new Date()
            }
          : l
      ))

      toast.success("Registro de renegociação salvo e valores atualizados", {
        duration: 2000,
        position: "bottom-right"
      })
      
      setModalRenegociacao(false)
      setLancamentoSelecionado(null)
    } catch (err) {
      setError("Erro ao renegociar conta")
      toast.error("Erro ao renegociar conta", { duration: 3000, position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar lançamentos - Cenário 8
  const lancamentosFiltrados = lancamentos.filter(lancamento => {
    if (filtros.tipo && lancamento.tipo !== filtros.tipo) return false
    if (filtros.categoria && lancamento.categoria !== filtros.categoria) return false
    if (filtros.status && lancamento.status !== filtros.status) return false
    if (filtros.processo && !lancamento.processo?.includes(filtros.processo)) return false
    if (filtros.beneficiario && !lancamento.beneficiario?.toLowerCase().includes(filtros.beneficiario.toLowerCase())) return false
    if (filtros.dataInicio && lancamento.dataVencimento < filtros.dataInicio) return false
    if (filtros.dataFim && lancamento.dataVencimento > filtros.dataFim) return false
    if (filtros.valorMinimo && lancamento.valor < filtros.valorMinimo) return false
    if (filtros.valorMaximo && lancamento.valor > filtros.valorMaximo) return false
    
    return true
  })

  // Agrupar contas - Cenário 7
  const lancamentosAgrupados: LancamentoAgrupado[] = (() => {
    if (agrupamento === "nenhum") return []

    const grupos = new Map<string, LancamentoFinanceiro[]>()
    
    lancamentosFiltrados.forEach(lancamento => {
      const chave = agrupamento === "processo" 
        ? lancamento.processo || "Sem Processo"
        : lancamento.beneficiario || "Sem Beneficiário"
      
      if (!grupos.has(chave)) {
        grupos.set(chave, [])
      }
      grupos.get(chave)!.push(lancamento)
    })

    return Array.from(grupos.entries()).map(([chave, lancamentos]) => {
      const receitas = lancamentos.filter(l => l.tipo === "receita")
      const despesas = lancamentos.filter(l => l.tipo === "despesa")
      
      const totalReceitas = receitas.reduce((sum, l) => sum + l.valor, 0)
      const totalDespesas = despesas.reduce((sum, l) => sum + l.valor, 0)
      
      return {
        chave,
        lancamentos,
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas
      }
    })
  })()

  // Separar por tipo para abas
  const receitas = lancamentosFiltrados.filter(l => l.tipo === "receita")
  const despesas = lancamentosFiltrados.filter(l => l.tipo === "despesa")
  
  // Separar por status - Cenário 9
  const pendentes = lancamentosFiltrados.filter(l => l.status === "pendente")
  const historico = lancamentosFiltrados.filter(l => l.status === "historico")

  // Funções auxiliares para controle de modal
  const abrirModalCriacao = (tipo: TipoLancamento) => {
    setLancamentoSelecionado(null)
    setModoEdicao(false)
    setModalAberto(true)
  }

  const abrirModalEdicao = (lancamento: LancamentoFinanceiro) => {
    setLancamentoSelecionado(lancamento)
    setModoEdicao(true)
    setModalAberto(true)
  }

  const abrirModalRenegociacao = (lancamento: LancamentoFinanceiro) => {
    if (lancamento.status !== "pendente") {
      toast.error("Apenas contas pendentes podem ser renegociadas", {
        duration: 3000,
        position: "bottom-right"
      })
      return
    }
    setLancamentoSelecionado(lancamento)
    setModalRenegociacao(true)
  }

  return {
    // Estados
    lancamentos: lancamentosFiltrados,
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

    // Ações - baseadas nos cenários
    criarLancamento,
    editarLancamento,
    removerLancamento,
    anexarDocumento,
    renegociarConta,
    carregarLancamentos,

    // Controle de filtros
    setFiltros,
    setAgrupamento,

    // Controle de modais
    setModalAberto,
    setModalRenegociacao,
    abrirModalCriacao,
    abrirModalEdicao,
    abrirModalRenegociacao,
    setLancamentoSelecionado,
    setModoEdicao
  }
}
