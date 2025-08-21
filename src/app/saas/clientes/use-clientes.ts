"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Cliente, ClienteFilters, ClienteFormData, AlterarTitularidadeData, TrocarPlanoData } from "./types"
import { toast } from "sonner"

// Mock data para desenvolvimento
const mockClientes: Cliente[] = [
  {
    id: "1",
    nomeEscritorio: "Advocacia Silva & Associados",
    nomeContratante: "João Silva",
    emailContratante: "joao.silva@advocaciasilva.com.br",
    cnpj: "12.345.678/0001-90",
    telefone: "+55 (11) 98765-4321",
    nomePlano: "PREMIUM",
    vigenciaPlano: new Date("2025-09-12"),
    valorPlano: 599.90,
    formaPagamento: "Plano mensal, à vista no cartão",
    descricaoPlano: "Plano Premium mensal para até 20 usuários/mês",
    status: "ativa",
    usuariosUsados: 12,
    usuariosDisponiveis: 20,
    processosUsados: 150,
    processosDisponiveis: 500,
    tokensIAUsados: 3500,
    tokensIADisponiveis: 10000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-08-01")
  },
  {
    id: "2",
    nomeEscritorio: "Martins Advogados",
    nomeContratante: "Maria Martins",
    emailContratante: "maria@martinsadvogados.com",
    cnpj: "98.765.432/0001-10",
    telefone: "+55 (21) 99876-5432",
    nomePlano: "STANDARD",
    vigenciaPlano: new Date("2025-12-31"),
    valorPlano: 299.90,
    formaPagamento: "Plano anual, 12x no cartão",
    descricaoPlano: "Plano Standard anual para entre 5 e 10 usuários",
    status: "ativa",
    usuariosUsados: 6,
    usuariosDisponiveis: 10,
    processosUsados: 75,
    processosDisponiveis: 200,
    tokensIAUsados: 1200,
    tokensIADisponiveis: 5000,
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2025-07-15")
  },
  {
    id: "3",
    nomeEscritorio: "Costa & Lima Advocacia",
    nomeContratante: "Pedro Costa",
    emailContratante: "pedro.costa@costalima.adv.br",
    cnpj: "45.678.901/0001-23",
    telefone: "+55 (31) 91234-5678",
    nomePlano: "FREE",
    vigenciaPlano: new Date("2025-08-20"),
    valorPlano: 0,
    formaPagamento: "Plano gratuito",
    descricaoPlano: "Plano Free para 1 usuário",
    status: "inadimplente",
    usuariosUsados: 1,
    usuariosDisponiveis: 1,
    processosUsados: 8,
    processosDisponiveis: 10,
    tokensIAUsados: 0,
    tokensIADisponiveis: 0,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2025-08-10")
  },
  {
    id: "4",
    nomeEscritorio: "Ferreira & Partners",
    nomeContratante: "Ana Ferreira",
    emailContratante: "ana@ferreirapartners.com",
    cnpj: "56.789.012/0001-34",
    telefone: "+55 (41) 92345-6789",
    nomePlano: "ENTERPRISE",
    vigenciaPlano: new Date("2026-01-15"),
    valorPlano: 1299.90,
    formaPagamento: "Plano anual, à vista",
    descricaoPlano: "Plano Enterprise anual para usuários ilimitados",
    status: "ativa",
    usuariosUsados: 45,
    usuariosDisponiveis: 999,
    processosUsados: 850,
    processosDisponiveis: 9999,
    tokensIAUsados: 25000,
    tokensIADisponiveis: 100000,
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2025-08-05")
  },
  {
    id: "5",
    nomeEscritorio: "Oliveira Consultoria Jurídica",
    nomeContratante: "Carlos Oliveira",
    emailContratante: "carlos@oliveiraconsultoria.com.br",
    cnpj: "67.890.123/0001-45",
    telefone: "+55 (51) 93456-7890",
    nomePlano: "STANDARD",
    vigenciaPlano: new Date("2025-09-30"),
    valorPlano: 299.90,
    formaPagamento: "Plano mensal, à vista no cartão",
    descricaoPlano: "Plano Standard mensal para entre 5 e 10 usuários",
    status: "inativa",
    usuariosUsados: 3,
    usuariosDisponiveis: 10,
    processosUsados: 45,
    processosDisponiveis: 200,
    tokensIAUsados: 800,
    tokensIADisponiveis: 5000,
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date("2025-07-30")
  }
]

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ClienteFilters>({
    sortBy: 'nomeEscritorio',
    sortOrder: 'asc'
  })

  // Carrega os clientes
  const loadClientes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Em produção, aqui seria uma chamada à API
      setClientes(mockClientes)
    } catch (err) {
      setError("Erro ao carregar clientes")
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtra e ordena clientes
  const filteredClientes = useMemo(() => {
    let result = [...clientes]
    
    // Aplica busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(cliente => 
        cliente.id.toLowerCase().includes(searchLower) ||
        cliente.nomeEscritorio.toLowerCase().includes(searchLower) ||
        cliente.emailContratante.toLowerCase().includes(searchLower) ||
        cliente.nomeContratante.toLowerCase().includes(searchLower)
      )
    }
    
    // Aplica filtro de plano
    if (filters.plano) {
      result = result.filter(cliente => cliente.nomePlano === filters.plano)
    }
    
    // Aplica filtro de status
    if (filters.status) {
      result = result.filter(cliente => cliente.status === filters.status)
    }
    
    // Aplica ordenação
    if (filters.sortBy) {
      result.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Cliente]
        const bValue = b[filters.sortBy as keyof Cliente]
        
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        return filters.sortOrder === 'asc' ? comparison : -comparison
      })
    }
    
    return result
  }, [clientes, filters])

  // Adiciona novo cliente
  const addCliente = useCallback(async (data: ClienteFormData) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const novoCliente: Cliente = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setClientes(prev => [...prev, novoCliente])
      toast.success("Cliente cadastrado com sucesso!")
      
      return novoCliente
    } catch (err) {
      toast.error("Erro ao cadastrar cliente")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualiza cliente existente
  const updateCliente = useCallback(async (id: string, data: Partial<ClienteFormData>) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === id 
          ? { ...cliente, ...data, updatedAt: new Date() }
          : cliente
      ))
      
      toast.success("Cliente atualizado com sucesso!")
    } catch (err) {
      toast.error("Erro ao atualizar cliente")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remove cliente
  const deleteCliente = useCallback(async (id: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClientes(prev => prev.filter(cliente => cliente.id !== id))
      toast.success("Cliente removido com sucesso!")
    } catch (err) {
      toast.error("Erro ao remover cliente")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Altera titularidade
  const alterarTitularidade = useCallback(async (id: string, data: AlterarTitularidadeData) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === id 
          ? { 
              ...cliente, 
              nomeContratante: data.novoNome,
              emailContratante: data.novoEmail,
              telefone: data.novoTelefone,
              updatedAt: new Date() 
            }
          : cliente
      ))
      
      toast.success("Titularidade alterada com sucesso!")
    } catch (err) {
      toast.error("Erro ao alterar titularidade")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Troca plano do cliente
  const trocarPlano = useCallback(async (id: string, data: TrocarPlanoData) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === id 
          ? { 
              ...cliente, 
              nomePlano: data.novoPlano,
              valorPlano: data.novoValor,
              descricaoPlano: data.novaDescricao,
              updatedAt: new Date() 
            }
          : cliente
      ))
      
      toast.success("Plano alterado com sucesso!")
    } catch (err) {
      toast.error("Erro ao alterar plano")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Ativa/Inativa cliente
  const toggleStatus = useCallback(async (id: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClientes(prev => prev.map(cliente => {
        if (cliente.id === id) {
          const newStatus = cliente.status === 'ativa' ? 'inativa' : 'ativa'
          toast.success(`Cliente ${newStatus === 'ativa' ? 'ativado' : 'inativado'} com sucesso!`)
          return { 
            ...cliente, 
            status: newStatus as keyof typeof cliente.status,
            updatedAt: new Date() 
          }
        }
        return cliente
      }))
    } catch (err) {
      toast.error("Erro ao alterar status do cliente")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Exporta dados
  const exportData = useCallback(async (format: 'pdf' | 'excel') => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Em produção, aqui seria a geração real do arquivo
      toast.success(`Exportação em ${format.toUpperCase()} iniciada!`)
      
      // Simula download
      const blob = new Blob([JSON.stringify(filteredClientes, null, 2)], 
        { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clientes.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      a.click()
      URL.revokeObjectURL(url)
      
    } catch (err) {
      toast.error(`Erro ao exportar em ${format.toUpperCase()}`)
      throw err
    } finally {
      setLoading(false)
    }
  }, [filteredClientes])

  // Carrega clientes ao montar
  useEffect(() => {
    loadClientes()
  }, [loadClientes])

  return {
    clientes: filteredClientes,
    loading,
    error,
    filters,
    setFilters,
    addCliente,
    updateCliente,
    deleteCliente,
    alterarTitularidade,
    trocarPlano,
    toggleStatus,
    exportData,
    reload: loadClientes
  }
}