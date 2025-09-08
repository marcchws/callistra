"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  Contract, 
  ContractFilters, 
  ContractFormData,
  Renegotiation,
  mockContracts 
} from "./types"

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ContractFilters>({})

  // Carregar contratos (simulando API)
  const loadContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      setContracts(mockContracts)
      setFilteredContracts(mockContracts)
    } catch (err) {
      setError("Erro ao carregar contratos")
      toast.error("Erro ao carregar contratos", {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: ContractFilters) => {
    setFilters(newFilters)
    
    let filtered = [...contracts]
    
    if (newFilters.cliente) {
      filtered = filtered.filter(c => 
        c.cliente.toLowerCase().includes(newFilters.cliente!.toLowerCase())
      )
    }
    
    if (newFilters.tipoDocumento) {
      filtered = filtered.filter(c => c.tipoDocumento === newFilters.tipoDocumento)
    }
    
    if (newFilters.statusPagamento) {
      filtered = filtered.filter(c => c.statusPagamento === newFilters.statusPagamento)
    }
    
    if (newFilters.dataInicio) {
      filtered = filtered.filter(c => 
        c.dataInicio >= newFilters.dataInicio!
      )
    }
    
    if (newFilters.dataFim) {
      filtered = filtered.filter(c => 
        c.dataInicio <= newFilters.dataFim!
      )
    }
    
    if (newFilters.valorMin !== undefined) {
      filtered = filtered.filter(c => c.valorNegociado >= newFilters.valorMin!)
    }
    
    if (newFilters.valorMax !== undefined) {
      filtered = filtered.filter(c => c.valorNegociado <= newFilters.valorMax!)
    }
    
    setFilteredContracts(filtered)
  }, [contracts])

  // Criar novo contrato/procuração
  const createContract = useCallback(async (data: ContractFormData) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newContract: Contract = {
        id: String(Date.now()),
        tipoDocumento: data.tipoDocumento,
        modelo: data.modelo,
        cliente: data.cliente,
        responsavel: data.responsavel,
        oab: data.oab,
        enderecoComercial: data.enderecoComercial,
        valorNegociado: data.valorNegociado,
        formatoPagamento: data.formatoPagamento,
        parcelas: data.parcelas,
        valorParcela: data.valorParcela,
        dataInicio: data.dataInicio,
        dataTermino: data.dataTermino,
        statusPagamento: data.statusPagamento || "pendente",
        renegociacoes: [],
        assinaturas: data.assinaturas,
        anexos: [],
        observacoes: data.observacoes,
        conteudoDocumento: data.conteudoDocumento,
        dataCriacao: new Date(),
        ultimaAtualizacao: new Date(),
      }
      
      // Se tem valor negociado, criar conta a receber
      if (newContract.valorNegociado > 0) {
        // Aqui integraria com o módulo de contas a receber
        newContract.contasReceberId = `rec_${Date.now()}`
      }
      
      const updatedContracts = [...contracts, newContract]
      setContracts(updatedContracts)
      setFilteredContracts(updatedContracts)
      
      toast.success("Documento criado com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
      
      return newContract
    } catch (err) {
      setError("Erro ao criar documento")
      toast.error("Erro ao criar documento", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Atualizar contrato/procuração
  const updateContract = useCallback(async (id: string, data: Partial<ContractFormData>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedContracts = contracts.map(contract => {
        if (contract.id === id) {
          const updated = {
            ...contract,
            ...data,
            ultimaAtualizacao: new Date()
          }
          
          // Se mudou o valor, atualizar contas a receber
          if (data.valorNegociado && data.valorNegociado !== contract.valorNegociado) {
            // Integração com contas a receber
          }
          
          return updated
        }
        return contract
      })
      
      setContracts(updatedContracts)
      setFilteredContracts(updatedContracts)
      
      toast.success("Documento atualizado com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
      
      return updatedContracts.find(c => c.id === id)
    } catch (err) {
      setError("Erro ao atualizar documento")
      toast.error("Erro ao atualizar documento", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Excluir contrato/procuração
  const deleteContract = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedContracts = contracts.filter(c => c.id !== id)
      setContracts(updatedContracts)
      setFilteredContracts(updatedContracts)
      
      toast.success("Documento excluído com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      setError("Erro ao excluir documento")
      toast.error("Erro ao excluir documento", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Registrar renegociação
  const addRenegotiation = useCallback(async (contractId: string, renegotiation: Omit<Renegotiation, "id">) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedContracts = contracts.map(contract => {
        if (contract.id === contractId) {
          const newRenegotiation: Renegotiation = {
            ...renegotiation,
            id: String(Date.now())
          }
          
          return {
            ...contract,
            renegociacoes: [...contract.renegociacoes, newRenegotiation],
            valorNegociado: renegotiation.novoValor,
            ultimaAtualizacao: new Date()
          }
        }
        return contract
      })
      
      setContracts(updatedContracts)
      setFilteredContracts(updatedContracts)
      
      toast.success("Renegociação registrada com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error("Erro ao registrar renegociação", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Atualizar status de pagamento (integração com contas a receber)
  const updatePaymentStatus = useCallback(async (
    contractId: string, 
    status: "pendente" | "pago" | "inadimplente",
    valorPago?: number,
    dataPagamento?: Date
  ) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedContracts = contracts.map(contract => {
        if (contract.id === contractId) {
          return {
            ...contract,
            statusPagamento: status,
            valorPago: valorPago || contract.valorPago,
            dataPagamento: dataPagamento || contract.dataPagamento,
            ultimaAtualizacao: new Date()
          }
        }
        return contract
      })
      
      setContracts(updatedContracts)
      setFilteredContracts(updatedContracts)
      
      const statusMessage = status === "pago" 
        ? "Pagamento confirmado" 
        : status === "inadimplente"
        ? "Status atualizado para inadimplente"
        : "Status atualizado para pendente"
      
      toast.success(statusMessage, {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error("Erro ao atualizar status de pagamento", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Exportar documento
  const exportDocument = useCallback(async (id: string, format: "pdf" | "word") => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const contract = contracts.find(c => c.id === id)
      if (!contract) throw new Error("Documento não encontrado")
      
      // Simular download
      const fileName = `${contract.tipoDocumento}_${contract.cliente.replace(/\s/g, "_")}.${format === "pdf" ? "pdf" : "docx"}`
      
      // Em produção, aqui seria feita a chamada para API de geração de PDF/Word
      console.log(`Exportando documento: ${fileName}`)
      
      toast.success(`Documento exportado: ${fileName}`, {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error("Erro ao exportar documento", {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [contracts])

  // Buscar contrato por ID
  const getContractById = useCallback((id: string) => {
    return contracts.find(c => c.id === id)
  }, [contracts])

  // Carregar contratos ao montar
  useEffect(() => {
    loadContracts()
  }, [loadContracts])

  return {
    contracts: filteredContracts,
    loading,
    error,
    filters,
    loadContracts,
    applyFilters,
    createContract,
    updateContract,
    deleteContract,
    addRenegotiation,
    updatePaymentStatus,
    exportDocument,
    getContractById,
  }
}
