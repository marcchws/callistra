"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Cliente, ClienteFilters, ClienteFormData } from "./types"

// Mock data para desenvolvimento
const mockClientes: Cliente[] = [
  {
    id: "1",
    tipo: "pessoa_fisica",
    nome: "João da Silva",
    cpfCnpj: "12345678901",
    dataNascimento: "1985-03-15",
    telefone: "11999999999",
    email: "joao@exemplo.com",
    cep: "01310100",
    rua: "Av. Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    confidencial: false,
    status: "ativo",
    login: "joao.silva",
    anexos: [],
    historicoFinanceiro: [
      {
        id: "1",
        tipo: "receita",
        descricao: "Honorários - Processo 123",
        valor: 5000,
        dataVencimento: new Date("2024-01-15"),
        dataPagamento: new Date("2024-01-10"),
        status: "pago"
      },
      {
        id: "2",
        tipo: "receita",
        descricao: "Consulta jurídica",
        valor: 800,
        dataVencimento: new Date("2024-02-15"),
        status: "pendente"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    tipo: "pessoa_juridica",
    nome: "Empresa XYZ Ltda",
    cpfCnpj: "12345678000190",
    responsavel: "Maria Santos",
    telefone: "11888888888",
    email: "contato@xyz.com",
    banco: "Banco do Brasil",
    agencia: "1234",
    contaCorrente: "56789-0",
    chavePix: "12345678000190",
    cep: "04567000",
    rua: "Rua dos Empresários",
    numero: "500",
    complemento: "Sala 1001",
    bairro: "Vila Olímpia",
    cidade: "São Paulo",
    estado: "SP",
    confidencial: true,
    status: "ativo",
    login: "empresa.xyz",
    anexos: [
      {
        id: "1",
        nome: "Contrato Social.pdf",
        tipo: "application/pdf",
        tamanho: 2048000,
        url: "/docs/contrato-social.pdf",
        dataUpload: new Date()
      }
    ],
    historicoFinanceiro: [
      {
        id: "3",
        tipo: "receita",
        descricao: "Consultoria mensal",
        valor: 15000,
        dataVencimento: new Date("2024-01-05"),
        dataPagamento: new Date("2024-01-05"),
        status: "pago"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    tipo: "parceiro",
    nome: "Advocacia Associada & Cia",
    cpfCnpj: "98765432000187",
    responsavel: "Dr. Carlos Mendes",
    telefone: "11777777777",
    email: "parceria@advocaciaassociada.com",
    banco: "Itaú",
    agencia: "5678",
    contaCorrente: "12345-6",
    chavePix: "parceria@advocaciaassociada.com",
    cep: "01234000",
    rua: "Rua da Consolação",
    numero: "2000",
    complemento: "Conjunto 1501",
    bairro: "Consolação",
    cidade: "São Paulo",
    estado: "SP",
    confidencial: false,
    status: "ativo",
    login: "advocacia.parceira",
    anexos: [
      {
        id: "2",
        nome: "Acordo de Parceria.pdf",
        tipo: "application/pdf",
        tamanho: 1536000,
        url: "/docs/acordo-parceria.pdf",
        dataUpload: new Date()
      },
      {
        id: "3",
        nome: "Certificado OAB.pdf",
        tipo: "application/pdf",
        tamanho: 1024000,
        url: "/docs/certificado-oab.pdf",
        dataUpload: new Date()
      }
    ],
    historicoFinanceiro: [
      {
        id: "4",
        tipo: "receita",
        descricao: "Comissão - Processo 456",
        valor: 3000,
        dataVencimento: new Date("2024-01-20"),
        dataPagamento: new Date("2024-01-18"),
        status: "pago"
      },
      {
        id: "5",
        tipo: "receita",
        descricao: "Comissão - Processo 789",
        valor: 4500,
        dataVencimento: new Date("2024-02-20"),
        status: "pendente"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ClienteFilters>({})

  // Carregar clientes
  const loadClientes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Aplicar filtros
      let filteredClientes = [...mockClientes]
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredClientes = filteredClientes.filter(
          c => c.nome.toLowerCase().includes(searchLower) ||
               c.cpfCnpj.includes(filters.search!) ||
               c.email.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters.tipo) {
        filteredClientes = filteredClientes.filter(c => c.tipo === filters.tipo)
      }
      
      if (filters.status) {
        filteredClientes = filteredClientes.filter(c => c.status === filters.status)
      }
      
      if (filters.confidencial !== undefined) {
        filteredClientes = filteredClientes.filter(c => c.confidencial === filters.confidencial)
      }
      
      setClientes(filteredClientes)
    } catch (err) {
      setError("Erro ao carregar clientes")
      toast.error("Erro ao carregar clientes")
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Criar cliente
  const createCliente = useCallback(async (data: ClienteFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Verificar CPF/CNPJ duplicado
      const exists = mockClientes.some(c => c.cpfCnpj === data.cpfCnpj)
      if (exists) {
        throw new Error("Documento já cadastrado no sistema")
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCliente: Cliente = {
        ...data,
        id: Date.now().toString(),
        anexos: [],
        historicoFinanceiro: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockClientes.push(newCliente)
      await loadClientes()
      
      toast.success("Cliente criado com sucesso")
      return newCliente
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar cliente"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadClientes])

  // Atualizar cliente
  const updateCliente = useCallback(async (id: string, data: Partial<ClienteFormData>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = mockClientes.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error("Cliente não encontrado")
      }
      
      const oldCliente = mockClientes[index]
      
      // Verificar se removeu confidencialidade
      if (oldCliente.confidencial && data.confidencial === false) {
        // Aqui seria enviado alerta para administradores
        console.log("ALERTA: Confidencialidade removida do cliente", oldCliente.nome)
        toast.warning("Alerta enviado aos administradores sobre remoção de confidencialidade", {
          duration: 5000
        })
      }
      
      mockClientes[index] = {
        ...oldCliente,
        ...data,
        updatedAt: new Date()
      }
      
      await loadClientes()
      toast.success("Dados atualizados com sucesso")
      
      return mockClientes[index]
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar cliente"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadClientes])

  // Excluir cliente
  const deleteCliente = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = mockClientes.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error("Cliente não encontrado")
      }
      
      mockClientes.splice(index, 1)
      await loadClientes()
      
      toast.success("Cliente excluído com sucesso")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir cliente"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadClientes])

  // Anexar documento
  const attachDocument = useCallback(async (clienteId: string, file: File) => {
    try {
      const cliente = mockClientes.find(c => c.id === clienteId)
      if (!cliente) {
        throw new Error("Cliente não encontrado")
      }
      
      const anexo: Anexo = {
        id: Date.now().toString(),
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        url: URL.createObjectURL(file),
        dataUpload: new Date()
      }
      
      if (!cliente.anexos) {
        cliente.anexos = []
      }
      cliente.anexos.push(anexo)
      
      await loadClientes()
      toast.success("Documento anexado ao perfil do cliente")
      
      return anexo
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao anexar documento"
      toast.error(message)
      throw err
    }
  }, [loadClientes])

  // Buscar CEP
  const buscarCep = useCallback(async (cep: string) => {
    try {
      const cleanCep = cep.replace(/\D/g, "")
      
      if (cleanCep.length !== 8) {
        throw new Error("CEP inválido")
      }
      
      // Simular busca de CEP
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock de retorno
      return {
        cep: cleanCep,
        rua: "Avenida Paulista",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP"
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar CEP"
      toast.error(message)
      throw err
    }
  }, [])

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadClientes()
  }, [loadClientes])

  return {
    clientes,
    loading,
    error,
    filters,
    setFilters,
    createCliente,
    updateCliente,
    deleteCliente,
    attachDocument,
    buscarCep,
    refresh: loadClientes
  }
}