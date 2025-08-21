"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Usuario, UsuarioFormData, UsuarioFilters, AuditLog, PerfilAcesso } from './types'

// Mock data - Em produção viria de uma API
const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cargo: 'Advogado Sênior',
    telefone: '+55 11 99999-9999',
    email: 'joao.silva@escritorio.com',
    perfilAcesso: 'Advogado Completo',
    status: 'Ativo',
    salario: 15000,
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    contaCorrente: '12345-6',
    chavePix: 'joao.silva@escritorio.com',
    observacao: 'Especialista em direito civil',
    criadoEm: new Date('2024-01-15'),
    criadoPor: 'Admin Sistema',
    atualizadoEm: new Date('2024-03-10'),
    atualizadoPor: 'Admin Sistema'
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cargo: 'Secretária Jurídica',
    telefone: '+55 11 88888-8888',
    email: 'maria.oliveira@escritorio.com',
    perfilAcesso: 'Secretária',
    status: 'Ativo',
    salario: 4500,
    observacao: 'Responsável pela organização de processos',
    criadoEm: new Date('2024-02-01'),
    criadoPor: 'Admin Sistema'
  },
  {
    id: '3',
    nome: 'Carlos Eduardo Lima',
    cargo: 'Estagiário',
    telefone: '+55 11 77777-7777',
    email: 'carlos.lima@escritorio.com',
    perfilAcesso: 'Estagiário',
    status: 'Inativo',
    criadoEm: new Date('2024-01-20'),
    criadoPor: 'Admin Sistema',
    atualizadoEm: new Date('2024-03-15'),
    atualizadoPor: 'João Silva Santos'
  }
]

const mockPerfisAcesso: PerfilAcesso[] = [
  {
    id: '1',
    nome: 'Advogado Completo',
    descricao: 'Acesso completo a todos os recursos do sistema',
    permissoes: ['criar_processo', 'editar_processo', 'deletar_processo', 'gerenciar_clientes', 'visualizar_financeiro']
  },
  {
    id: '2',
    nome: 'Secretária',
    descricao: 'Acesso à organização de processos e agenda',
    permissoes: ['visualizar_processo', 'editar_agenda', 'gerenciar_documentos']
  },
  {
    id: '3',
    nome: 'Estagiário',
    descricao: 'Acesso limitado para aprendizado',
    permissoes: ['visualizar_processo', 'criar_tarefa']
  }
]

const mockCargos = ['Advogado Sênior', 'Advogado Júnior', 'Secretária Jurídica', 'Estagiário', 'Paralegal', 'Contador']

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [perfisAcesso, setPerfisAcesso] = useState<PerfilAcesso[]>([])
  const [cargos] = useState<string[]>(mockCargos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UsuarioFilters>({
    status: 'Todos',
    cargo: 'todos',
    searchTerm: ''
  })

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
        setUsuarios(mockUsuarios)
        setPerfisAcesso(mockPerfisAcesso)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar usuários')
        toast.error('Erro ao carregar usuários', {
          duration: 3000,
          position: "bottom-right"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchStatus = filters.status === 'Todos' || usuario.status === filters.status
    const matchCargo = filters.cargo === 'todos' || !filters.cargo || usuario.cargo === filters.cargo
    const matchSearch = !filters.searchTerm || 
      usuario.nome.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      usuario.cargo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
    
    return matchStatus && matchCargo && matchSearch
  })

  // Criar usuário
  const criarUsuario = async (dados: UsuarioFormData): Promise<boolean> => {
    setLoading(true)
    try {
      // Validar e-mail único
      const emailExiste = usuarios.some(u => u.email === dados.email)
      if (emailExiste) {
        toast.error('E-mail já cadastrado no sistema', {
          duration: 3000,
          position: "bottom-right"
        })
        return false
      }

      // Simular criação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const novoUsuario: Usuario = {
        ...dados,
        id: Date.now().toString(),
        criadoEm: new Date(),
        criadoPor: 'Usuário Atual', // Em produção viria do contexto de auth
        documentosAnexos: []
      }

      setUsuarios(prev => [...prev, novoUsuario])
      
      toast.success('Usuário criado com sucesso', {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error('Erro ao criar usuário', {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Atualizar usuário
  const atualizarUsuario = async (id: string, dados: Partial<UsuarioFormData>): Promise<boolean> => {
    setLoading(true)
    try {
      // Validar e-mail único (exceto o próprio usuário)
      if (dados.email) {
        const emailExiste = usuarios.some(u => u.email === dados.email && u.id !== id)
        if (emailExiste) {
          toast.error('E-mail já cadastrado no sistema', {
            duration: 3000,
            position: "bottom-right"
          })
          return false
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsuarios(prev => prev.map(usuario => 
        usuario.id === id 
          ? { 
              ...usuario, 
              ...dados, 
              atualizadoEm: new Date(),
              atualizadoPor: 'Usuário Atual'
            }
          : usuario
      ))
      
      toast.success('Dados atualizados com sucesso', {
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error('Erro ao atualizar usuário', {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Alternar status do usuário
  const alternarStatus = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setUsuarios(prev => prev.map(usuario => {
        if (usuario.id === id) {
          const novoStatus = usuario.status === 'Ativo' ? 'Inativo' : 'Ativo'
          const acao = novoStatus === 'Ativo' ? 'ativado' : 'desativado'
          
          toast.success(`Usuário ${acao} com sucesso`, {
            duration: 2000,
            position: "bottom-right"
          })
          
          return {
            ...usuario,
            status: novoStatus,
            atualizadoEm: new Date(),
            atualizadoPor: 'Usuário Atual'
          }
        }
        return usuario
      }))
      
      return true
    } catch (err) {
      toast.error('Erro ao alterar status do usuário', {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Obter usuário por ID
  const obterUsuario = (id: string): Usuario | undefined => {
    return usuarios.find(u => u.id === id)
  }

  // Atualizar filtros
  const atualizarFiltros = (novosFiltros: Partial<UsuarioFilters>) => {
    setFilters(prev => ({ ...prev, ...novosFiltros }))
  }

  // Limpar filtros
  const limparFiltros = () => {
    setFilters({
      status: 'Todos',
      cargo: 'todos',
      searchTerm: ''
    })
  }

  return {
    usuarios: usuariosFiltrados,
    todosUsuarios: usuarios,
    perfisAcesso,
    cargos,
    loading,
    error,
    filters,
    criarUsuario,
    atualizarUsuario,
    alternarStatus,
    obterUsuario,
    atualizarFiltros,
    limparFiltros
  }
}
