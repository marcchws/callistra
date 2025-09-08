// Exemplo de integração com API real
// Substitua o conteúdo de use-clientes.ts com esta implementação quando a API estiver pronta

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Cliente, ClienteFilters, ClienteFormData } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export function useClientesAPI() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ClienteFilters>({})

  // Headers com autenticação
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  })

  // Carregar clientes
  const loadClientes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.tipo) queryParams.append('tipo', filters.tipo)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.confidencial !== undefined) {
        queryParams.append('confidencial', filters.confidencial.toString())
      }

      const response = await fetch(`${API_BASE_URL}/clientes?${queryParams}`, {
        headers: getHeaders()
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar clientes')
      }

      const data = await response.json()
      setClientes(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar clientes"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Criar cliente
  const createCliente = useCallback(async (data: ClienteFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar cliente')
      }

      const newCliente = await response.json()
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
      // Verificar mudança de confidencialidade
      const clienteAtual = clientes.find(c => c.id === id)
      if (clienteAtual?.confidencial && data.confidencial === false) {
        // Enviar alerta para administradores
        await fetch(`${API_BASE_URL}/alertas/confidencialidade`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            clienteId: id,
            clienteNome: clienteAtual.nome,
            acao: 'remocao_confidencialidade'
          })
        })
        
        toast.warning("Alerta enviado aos administradores sobre remoção de confidencialidade", {
          duration: 5000
        })
      }

      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao atualizar cliente')
      }

      const updatedCliente = await response.json()
      await loadClientes()
      
      toast.success("Dados atualizados com sucesso")
      return updatedCliente
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar cliente"
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [clientes, loadClientes])

  // Excluir cliente
  const deleteCliente = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao excluir cliente')
      }

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
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_BASE_URL}/clientes/${clienteId}/documentos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao anexar documento')
      }

      const anexo = await response.json()
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
      
      // Usar API externa de CEP (ViaCEP)
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      
      if (!response.ok) {
        throw new Error("Erro ao buscar CEP")
      }
      
      const data = await response.json()
      
      if (data.erro) {
        throw new Error("CEP não encontrado")
      }
      
      return {
        cep: cleanCep,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar CEP"
      toast.error(message)
      throw err
    }
  }, [])

  // Carregar clientes ao montar
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

// Exemplo de configuração de API endpoints esperados:
/*
API Endpoints necessários:

GET    /api/clientes                 - Listar clientes com filtros
POST   /api/clientes                 - Criar novo cliente
GET    /api/clientes/:id             - Buscar cliente específico
PUT    /api/clientes/:id             - Atualizar cliente
DELETE /api/clientes/:id             - Excluir cliente
POST   /api/clientes/:id/documentos  - Upload de documento
DELETE /api/clientes/:id/documentos/:docId - Excluir documento
POST   /api/alertas/confidencialidade - Enviar alerta de confidencialidade

Query Parameters (GET /api/clientes):
- search: string (busca em nome, cpfCnpj, email)
- tipo: 'pessoa_fisica' | 'pessoa_juridica' | 'parceiro'
- status: 'ativo' | 'inativo'
- confidencial: boolean

Headers necessários:
- Authorization: Bearer {token}
- Content-Type: application/json (exceto para upload de arquivos)

Respostas esperadas:
- 200: Sucesso com dados
- 201: Criado com sucesso
- 400: Erro de validação
- 401: Não autorizado
- 404: Não encontrado
- 500: Erro interno do servidor
*/