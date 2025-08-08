"use client"

import { useState, useMemo } from "react"
import { Cliente, ClienteFilters, ClienteFormData, ClienteOperation, TrocaPlanoData, AlteracaoTitularidadeData, ExportOptions } from "./types"
import { toast } from "sonner"

// DADOS MOCKADOS BASEADOS NOS REQUIREMENTS - CENÁRIOS DE TESTE
const mockClientes: Cliente[] = [
  {
    id: "CLI001",
    nomeEscritorio: "Escritório Silva & Associados",
    nomeContratante: "João Silva",
    emailContratante: "joao@silvaeassociados.com.br",
    cnpj: "12.345.678/0001-90",
    telefone: "+55 11 99999-1234",
    nomePlano: "Standard",
    vigenciaPlano: "2025-02-15",
    valorPlano: 299.99,
    formaPagamento: "Mensal, cartão de crédito",
    descricaoPlano: "Plano Standard mensal para até 10 usuários",
    status: "ativa",
    quantidadeUsuarios: { usado: 8, disponivel: 10 },
    quantidadeProcessos: { usado: 150, disponivel: 500 },
    tokensIA: { usado: 800, disponivel: 1000 },
    dataCriacao: "2024-01-15T10:00:00Z",
    dataAtualizacao: "2024-12-01T15:30:00Z"
  },
  {
    id: "CLI002",
    nomeEscritorio: "Advocacia Pereira Ltda",
    nomeContratante: "Maria Pereira",
    emailContratante: "maria@advocaciapereira.com.br",
    cnpj: "98.765.432/0001-10",
    telefone: "+55 21 98888-5678",
    nomePlano: "Premium",
    vigenciaPlano: "2025-08-10",
    valorPlano: 2399.99,
    formaPagamento: "Anual, à vista",
    descricaoPlano: "Plano Premium anual para até 25 usuários",
    status: "ativa",
    quantidadeUsuarios: { usado: 22, disponivel: 25 },
    quantidadeProcessos: { usado: 1200, disponivel: 2000 },
    tokensIA: { usado: 4500, disponivel: 5000 },
    dataCriacao: "2023-08-10T14:20:00Z",
    dataAtualizacao: "2024-12-05T09:15:00Z"
  },
  {
    id: "CLI003",
    nomeEscritorio: "Costa & Santos Advogados",
    nomeContratante: "Carlos Costa",
    emailContratante: "carlos@costasantos.adv.br",
    cnpj: "11.222.333/0001-44",
    telefone: "+55 31 97777-9012",
    nomePlano: "Free",
    vigenciaPlano: "2025-01-20",
    valorPlano: 0,
    formaPagamento: "Gratuito",
    descricaoPlano: "Plano gratuito para até 3 usuários",
    status: "inadimplente",
    quantidadeUsuarios: { usado: 3, disponivel: 3 },
    quantidadeProcessos: { usado: 45, disponivel: 50 },
    tokensIA: { usado: 95, disponivel: 100 },
    dataCriacao: "2024-11-20T16:45:00Z",
    dataAtualizacao: "2024-12-20T11:00:00Z"
  },
  {
    id: "CLI004",
    nomeEscritorio: "Oliveira Advocacia",
    nomeContratante: "Ana Oliveira",
    emailContratante: "ana@oliveiraadv.com.br",
    cnpj: "44.555.666/0001-77",
    telefone: "+55 85 96666-3456",
    nomePlano: "Enterprise",
    vigenciaPlano: "2025-05-30",
    valorPlano: 4999.99,
    formaPagamento: "Anual, 12x no cartão",
    descricaoPlano: "Plano Enterprise anual para usuários ilimitados",
    status: "inativa",
    quantidadeUsuarios: { usado: 0, disponivel: 999 },
    quantidadeProcessos: { usado: 0, disponivel: 10000 },
    tokensIA: { usado: 0, disponivel: 20000 },
    dataCriacao: "2024-05-30T08:30:00Z",
    dataAtualizacao: "2024-11-15T13:20:00Z"
  }
]

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // FILTROS BASEADOS NOS ACCEPTANCE CRITERIA
  const [filters, setFilters] = useState<ClienteFilters>({
    busca: "",
    plano: "todos",
    status: "todos"
  })

  // APLICAR FILTROS - BASEADO NOS CENÁRIOS DE USO
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      // Filtro de busca (ID, nome empresa, e-mail)
      const buscaLower = filters.busca.toLowerCase()
      const matchBusca = !filters.busca || 
        cliente.id.toLowerCase().includes(buscaLower) ||
        cliente.nomeEscritorio.toLowerCase().includes(buscaLower) ||
        cliente.emailContratante.toLowerCase().includes(buscaLower)

      // Filtro por plano
      const matchPlano = filters.plano === "todos" || 
        cliente.nomePlano.toLowerCase() === filters.plano.toLowerCase()

      // Filtro por status
      const matchStatus = filters.status === "todos" || 
        cliente.status === filters.status

      return matchBusca && matchPlano && matchStatus
    })
  }, [clientes, filters])

  // CRIAR CLIENTE - BASEADO NOS ACCEPTANCE CRITERIA
  const criarCliente = async (data: ClienteFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const novoCliente: Cliente = {
        id: `CLI${String(clientes.length + 1).padStart(3, '0')}`,
        ...data,
        quantidadeUsuarios: { usado: 0, disponivel: 10 }, // Default baseado no plano
        quantidadeProcessos: { usado: 0, disponivel: 500 },
        tokensIA: { usado: 0, disponivel: 1000 },
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      }
      
      setClientes(prev => [...prev, novoCliente])
      toast.success("Cliente cadastrado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Cliente criado com sucesso", data: novoCliente }
    } catch (err) {
      const message = "Erro ao criar cliente"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // ATUALIZAR CLIENTE
  const atualizarCliente = async (id: string, data: Partial<ClienteFormData>) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === id 
          ? { ...cliente, ...data, dataAtualizacao: new Date().toISOString() }
          : cliente
      ))
      
      toast.success("Cliente atualizado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Cliente atualizado com sucesso" }
    } catch (err) {
      const message = "Erro ao atualizar cliente"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // ATIVAR/INATIVAR CLIENTE - BASEADO NOS ACCEPTANCE CRITERIA
  const toggleStatusCliente = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setClientes(prev => prev.map(cliente => {
        if (cliente.id === id) {
          const novoStatus = cliente.status === 'ativa' ? 'inativa' : 'ativa'
          return { 
            ...cliente, 
            status: novoStatus,
            dataAtualizacao: new Date().toISOString()
          }
        }
        return cliente
      }))
      
      toast.success("Status do cliente alterado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Status alterado com sucesso" }
    } catch (err) {
      const message = "Erro ao alterar status do cliente"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // TROCAR PLANO - BASEADO NOS ACCEPTANCE CRITERIA
  const trocarPlano = async (data: TrocaPlanoData) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === data.clienteId 
          ? { 
              ...cliente, 
              nomePlano: data.novoPlano,
              dataAtualizacao: new Date().toISOString()
            }
          : cliente
      ))
      
      toast.success("Plano alterado com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Plano alterado com sucesso" }
    } catch (err) {
      const message = "Erro ao alterar plano"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // ALTERAR TITULARIDADE - BASEADO NOS ACCEPTANCE CRITERIA
  const alterarTitularidade = async (data: AlteracaoTitularidadeData) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === data.clienteId 
          ? { 
              ...cliente, 
              emailContratante: data.novoEmail,
              nomeContratante: data.novoNome,
              telefone: data.novoTelefone,
              dataAtualizacao: new Date().toISOString()
            }
          : cliente
      ))
      
      toast.success("Titularidade alterada com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Titularidade alterada com sucesso" }
    } catch (err) {
      const message = "Erro ao alterar titularidade"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // EXPORTAR DADOS - BASEADO NOS ACCEPTANCE CRITERIA
  const exportarDados = async (options: ExportOptions) => {
    setLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const dadosExportar = options.selectedIds?.length 
        ? clientes.filter(c => options.selectedIds!.includes(c.id))
        : clientesFiltrados
      
      // Simular download
      console.log(`Exportando ${dadosExportar.length} clientes em formato ${options.format}`)
      
      toast.success(`Dados exportados em ${options.format.toUpperCase()} com sucesso!`, { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return { success: true, message: "Dados exportados com sucesso" }
    } catch (err) {
      const message = "Erro ao exportar dados"
      setError(message)
      toast.error(message, { duration: 3000, position: "bottom-right" })
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  // LIMPAR FILTROS - BASEADO NOS CENÁRIOS DE USO
  const limparFiltros = () => {
    setFilters({
      busca: "",
      plano: "todos",
      status: "todos"
    })
  }

  return {
    clientes: clientesFiltrados,
    loading,
    error,
    filters,
    setFilters,
    criarCliente,
    atualizarCliente,
    toggleStatusCliente,
    trocarPlano,
    alterarTitularidade,
    exportarDados,
    limparFiltros,
    totalClientes: clientes.length,
    totalFiltrados: clientesFiltrados.length
  }
}
