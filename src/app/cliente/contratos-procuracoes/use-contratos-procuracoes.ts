"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { 
  Documento, 
  FiltrosBusca, 
  Renegociacao, 
  UploadModelo,
  ModeloSistema,
  HistoricoPagamento,
  OpcoesExportacao,
  TipoDocumento,
  StatusPagamento
} from "./types"

// Mock data para modelos do sistema
const modelosSistemaMock: ModeloSistema[] = [
  {
    id: "1",
    nome: "Contrato de Prestação de Serviços Advocatícios",
    tipoDocumento: "contrato",
    descricao: "Modelo padrão para prestação de serviços jurídicos",
    campos: [
      { id: "cliente", nome: "Cliente", tipo: "texto", obrigatorio: true, placeholder: "Nome do cliente" },
      { id: "servicos", nome: "Serviços", tipo: "textarea", obrigatorio: true, placeholder: "Descrição dos serviços" },
      { id: "valor", nome: "Valor", tipo: "numero", obrigatorio: true, placeholder: "Valor do contrato" }
    ]
  },
  {
    id: "2", 
    nome: "Procuração Ad Judicia",
    tipoDocumento: "procuracao",
    descricao: "Procuração para representação em processos judiciais",
    campos: [
      { id: "outorgante", nome: "Outorgante", tipo: "texto", obrigatorio: true, placeholder: "Nome do outorgante" },
      { id: "poderes", nome: "Poderes", tipo: "textarea", obrigatorio: true, placeholder: "Poderes outorgados" }
    ]
  }
]

// Mock data para documentos
const documentosMock: Documento[] = [
  {
    id: "1",
    tipoDocumento: "contrato",
    modelo: "Contrato de Prestação de Serviços Advocatícios",
    cliente: "João Silva",
    responsavel: "Dr. Maria Santos",
    oab: "SP123456",
    enderecoComercial: "Rua das Flores, 123, São Paulo - SP",
    valorNegociado: 5000,
    formatoPagamento: "parcelado",
    parcelas: "5x R$ 1.000,00",
    dataInicio: new Date("2024-01-15"),
    dataTermino: new Date("2024-06-15"),
    statusPagamento: "pago",
    assinaturas: ["João Silva", "Dr. Maria Santos"],
    dataCriacao: new Date("2024-01-01"),
    ultimaAtualizacao: new Date("2024-01-15")
  },
  {
    id: "2",
    tipoDocumento: "procuracao",
    modelo: "Procuração Ad Judicia",
    cliente: "Empresa XYZ Ltda",
    responsavel: "Dr. Carlos Oliveira",
    oab: "RJ789012",
    valorNegociado: 3000,
    formatoPagamento: "a_vista",
    dataInicio: new Date("2024-02-01"),
    statusPagamento: "pendente",
    assinaturas: ["Representante Legal", "Dr. Carlos Oliveira"],
    dataCriacao: new Date("2024-01-28"),
    ultimaAtualizacao: new Date("2024-02-01")
  }
]

export function useContratosEProcuracoes() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [modelosSistema, setModelosSistema] = useState<ModeloSistema[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosBusca>({})

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDocumentos(documentosMock)
      setModelosSistema(modelosSistemaMock)
      
      toast.success("Dados carregados com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao carregar dados"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  const criarDocumento = async (novoDocumento: Omit<Documento, "id" | "dataCriacao" | "ultimaAtualizacao">) => {
    setLoading(true)
    setError(null)

    try {
      // Simular criação na API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const documento: Documento = {
        ...novoDocumento,
        id: Math.random().toString(36).substr(2, 9),
        dataCriacao: new Date(),
        ultimaAtualizacao: new Date()
      }

      setDocumentos(prev => [documento, ...prev])
      
      toast.success("Documento criado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      
      return documento
    } catch (err) {
      const message = "Erro ao criar documento"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editarDocumento = async (id: string, dadosAtualizados: Partial<Documento>) => {
    setLoading(true)
    setError(null)

    try {
      // Simular edição na API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setDocumentos(prev => prev.map(doc => 
        doc.id === id 
          ? { ...doc, ...dadosAtualizados, ultimaAtualizacao: new Date() }
          : doc
      ))

      toast.success("Documento atualizado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao atualizar documento"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const excluirDocumento = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simular exclusão na API
      await new Promise(resolve => setTimeout(resolve, 800))

      setDocumentos(prev => prev.filter(doc => doc.id !== id))

      toast.success("Documento excluído com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao excluir documento"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const registrarRenegociacao = async (renegociacao: Renegociacao) => {
    setLoading(true)
    setError(null)

    try {
      // Simular registro de renegociação na API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setDocumentos(prev => prev.map(doc => 
        doc.id === renegociacao.documentoId
          ? {
              ...doc,
              valorNegociado: renegociacao.novoValor,
              formatoPagamento: renegociacao.novoFormatoPagamento,
              parcelas: renegociacao.novasParcelas,
              renegociacao: renegociacao.observacoes,
              ultimaAtualizacao: new Date()
            }
          : doc
      ))

      toast.success("Renegociação registrada com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao registrar renegociação"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const uploadModelo = async (dadosUpload: UploadModelo) => {
    setLoading(true)
    setError(null)

    try {
      // Simular upload na API
      await new Promise(resolve => setTimeout(resolve, 2000))

      const novoModelo: ModeloSistema = {
        id: Math.random().toString(36).substr(2, 9),
        nome: dadosUpload.nome,
        tipoDocumento: dadosUpload.tipoDocumento,
        descricao: dadosUpload.descricao,
        campos: [] // Campos seriam extraídos do arquivo
      }

      setModelosSistema(prev => [...prev, novoModelo])

      toast.success("Modelo enviado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao enviar modelo"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const exportarDocumento = async (documentoId: string, opcoes: OpcoesExportacao) => {
    setLoading(true)
    setError(null)

    try {
      // Simular exportação na API
      await new Promise(resolve => setTimeout(resolve, 1500))

      const documento = documentos.find(d => d.id === documentoId)
      if (!documento) {
        throw new Error("Documento não encontrado")
      }

      // Simular download do arquivo
      const filename = `${documento.tipoDocumento}_${documento.cliente.replace(/\s+/g, '_')}.${opcoes.formato}`
      
      toast.success(`Documento exportado: ${filename}`, {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const message = "Erro ao exportar documento"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros aos documentos
  const documentosFiltrados = documentos.filter(documento => {
    if (filtros.cliente && !documento.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) {
      return false
    }
    if (filtros.tipoDocumento && documento.tipoDocumento !== filtros.tipoDocumento) {
      return false
    }
    if (filtros.statusPagamento && documento.statusPagamento !== filtros.statusPagamento) {
      return false
    }
    if (filtros.responsavel && !documento.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) {
      return false
    }
    if (filtros.dataInicio && documento.dataInicio < filtros.dataInicio) {
      return false
    }
    if (filtros.dataFim && documento.dataInicio > filtros.dataFim) {
      return false
    }
    return true
  })

  return {
    // Estados
    documentos: documentosFiltrados,
    modelosSistema,
    loading,
    error,
    filtros,

    // Ações
    carregarDados,
    criarDocumento,
    editarDocumento,
    excluirDocumento,
    registrarRenegociacao,
    uploadModelo,
    exportarDocumento,
    setFiltros,

    // Derived states
    totalDocumentos: documentosFiltrados.length,
    totalContratos: documentosFiltrados.filter(d => d.tipoDocumento === "contrato").length,
    totalProcuracoes: documentosFiltrados.filter(d => d.tipoDocumento === "procuracao").length,
    valorTotalNegociado: documentosFiltrados.reduce((acc, doc) => acc + doc.valorNegociado, 0),
    documentosPendentes: documentosFiltrados.filter(d => d.statusPagamento === "pendente").length,
    documentosPagos: documentosFiltrados.filter(d => d.statusPagamento === "pago").length,
    documentosInadimplentes: documentosFiltrados.filter(d => d.statusPagamento === "inadimplente").length
  }
}
