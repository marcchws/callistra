"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { 
  Lancamento, 
  TipoLancamento, 
  StatusLancamento, 
  Filtros, 
  LancamentoFormData,
  RenegociacaoFormData,
  Anexo,
  Renegociacao
} from "./types"
import { generateId, agruparLancamentos, calcularResumo } from "./utils"

// Mock de dados iniciais
const mockLancamentos: Lancamento[] = [
  {
    id: "1",
    tipo: TipoLancamento.RECEITA,
    categoria: "Honorários Advocatícios",
    subcategoria: "Consultoria Jurídica",
    valor: 5000,
    dataVencimento: new Date("2025-09-15"),
    status: StatusLancamento.PENDENTE,
    processo: "PROC-001",
    beneficiario: "Cliente ABC Ltda",
    observacoes: "Consultoria mensal",
    criadoEm: new Date("2025-08-01"),
    criadoPor: "Admin"
  },
  {
    id: "2",
    tipo: TipoLancamento.DESPESA,
    categoria: "Infraestrutura",
    subcategoria: "Aluguel",
    valor: 3500,
    dataVencimento: new Date("2025-09-10"),
    dataPagamento: new Date("2025-09-08"),
    status: StatusLancamento.PAGO,
    beneficiario: "Imobiliária XYZ",
    observacoes: "Aluguel mensal do escritório",
    criadoEm: new Date("2025-08-01"),
    criadoPor: "Admin"
  },
  {
    id: "3",
    tipo: TipoLancamento.RECEITA,
    categoria: "Honorários de Êxito",
    subcategoria: "Trabalhista",
    valor: 15000,
    dataVencimento: new Date("2025-08-20"),
    status: StatusLancamento.PENDENTE,
    processo: "PROC-002",
    beneficiario: "João Silva",
    observacoes: "Causa trabalhista ganha",
    criadoEm: new Date("2025-08-01"),
    criadoPor: "Admin",
    renegociacoes: []
  }
]

export function useFinanceiro() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(mockLancamentos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Filtros>({})
  const [abaAtiva, setAbaAtiva] = useState<TipoLancamento>(TipoLancamento.RECEITA)

  // Filtrar lançamentos
  const lancamentosFiltrados = useMemo(() => {
    let resultado = lancamentos.filter(l => l.tipo === abaAtiva)

    if (filtros.categoria) {
      resultado = resultado.filter(l => l.categoria === filtros.categoria)
    }

    if (filtros.status) {
      resultado = resultado.filter(l => l.status === filtros.status)
    }

    if (filtros.processo) {
      resultado = resultado.filter(l => 
        l.processo?.toLowerCase().includes(filtros.processo.toLowerCase())
      )
    }

    if (filtros.beneficiario) {
      resultado = resultado.filter(l => 
        l.beneficiario?.toLowerCase().includes(filtros.beneficiario.toLowerCase())
      )
    }

    if (filtros.dataInicio) {
      resultado = resultado.filter(l => 
        new Date(l.dataVencimento) >= filtros.dataInicio!
      )
    }

    if (filtros.dataFim) {
      resultado = resultado.filter(l => 
        new Date(l.dataVencimento) <= filtros.dataFim!
      )
    }

    return resultado
  }, [lancamentos, abaAtiva, filtros])

  // Lançamentos agrupados
  const lancamentosAgrupados = useMemo(() => {
    return agruparLancamentos(lancamentosFiltrados, filtros.agrupamento || null)
  }, [lancamentosFiltrados, filtros.agrupamento])

  // Resumo financeiro
  const resumo = useMemo(() => {
    return calcularResumo(lancamentos)
  }, [lancamentos])

  // Adicionar lançamento
  const adicionarLancamento = useCallback(async (data: LancamentoFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      const novoLancamento: Lancamento = {
        id: generateId(),
        ...data,
        status: data.dataPagamento 
          ? (data.tipo === TipoLancamento.RECEITA ? StatusLancamento.RECEBIDO : StatusLancamento.PAGO)
          : StatusLancamento.PENDENTE,
        anexos: [],
        renegociacoes: [],
        criadoEm: new Date(),
        criadoPor: "Usuário Atual"
      }

      setLancamentos(prev => [...prev, novoLancamento])
      
      const tipoTexto = data.tipo === TipoLancamento.RECEITA ? "Receita" : "Despesa"
      toast.success(`${tipoTexto} cadastrada com sucesso!`)
      
      return novoLancamento
    } catch (err) {
      const message = "Erro ao adicionar lançamento"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Editar lançamento
  const editarLancamento = useCallback(async (id: string, data: Partial<LancamentoFormData>) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setLancamentos(prev => prev.map(l => {
        if (l.id === id) {
          const atualizado = {
            ...l,
            ...data,
            status: data.dataPagamento 
              ? (l.tipo === TipoLancamento.RECEITA ? StatusLancamento.RECEBIDO : StatusLancamento.PAGO)
              : StatusLancamento.PENDENTE,
            atualizadoEm: new Date(),
            atualizadoPor: "Usuário Atual"
          }
          return atualizado
        }
        return l
      }))

      toast.success("Lançamento atualizado com sucesso!")
    } catch (err) {
      const message = "Erro ao editar lançamento"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover lançamento
  const removerLancamento = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setLancamentos(prev => prev.filter(l => l.id !== id))
      toast.success("Lançamento removido com sucesso!")
    } catch (err) {
      const message = "Erro ao remover lançamento"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Anexar arquivo
  const anexarArquivo = useCallback(async (lancamentoId: string, file: File): Promise<Anexo> => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const novoAnexo: Anexo = {
        id: generateId(),
        nome: file.name,
        url: URL.createObjectURL(file), // Em produção seria URL do servidor
        tamanho: file.size,
        tipo: file.type,
        uploadedAt: new Date()
      }

      setLancamentos(prev => prev.map(l => {
        if (l.id === lancamentoId) {
          return {
            ...l,
            anexos: [...(l.anexos || []), novoAnexo]
          }
        }
        return l
      }))

      toast.success("Arquivo anexado com sucesso!")
      return novoAnexo
    } catch (err) {
      const message = "Erro ao anexar arquivo"
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover anexo
  const removerAnexo = useCallback(async (lancamentoId: string, anexoId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setLancamentos(prev => prev.map(l => {
        if (l.id === lancamentoId) {
          return {
            ...l,
            anexos: l.anexos?.filter(a => a.id !== anexoId) || []
          }
        }
        return l
      }))

      toast.success("Anexo removido com sucesso!")
    } catch (err) {
      toast.error("Erro ao remover anexo")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Renegociar conta
  const renegociarConta = useCallback(async (
    lancamentoId: string, 
    data: RenegociacaoFormData
  ) => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const lancamento = lancamentos.find(l => l.id === lancamentoId)
      if (!lancamento) throw new Error("Lançamento não encontrado")

      const novaRenegociacao: Renegociacao = {
        id: generateId(),
        dataRenegociacao: new Date(),
        valorOriginal: lancamento.valor,
        valorNovo: data.valorNovo,
        juros: data.juros,
        motivo: data.motivo,
        responsavel: "Usuário Atual"
      }

      setLancamentos(prev => prev.map(l => {
        if (l.id === lancamentoId) {
          return {
            ...l,
            valor: data.valorNovo,
            renegociacoes: [...(l.renegociacoes || []), novaRenegociacao],
            observacoes: `${l.observacoes || ""}\n[Renegociado] ${data.motivo || ""}`.trim(),
            atualizadoEm: new Date(),
            atualizadoPor: "Usuário Atual"
          }
        }
        return l
      }))

      toast.success("Conta renegociada com sucesso!")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao renegociar conta"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [lancamentos])

  return {
    // Estados
    lancamentos: lancamentosFiltrados,
    lancamentosAgrupados,
    resumo,
    loading,
    error,
    filtros,
    abaAtiva,

    // Ações
    setFiltros,
    setAbaAtiva,
    adicionarLancamento,
    editarLancamento,
    removerLancamento,
    anexarArquivo,
    removerAnexo,
    renegociarConta
  }
}