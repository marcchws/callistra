"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { User, UserStatus, UserFormData, UserFilters, AuditoriaLog, PerfilAcesso } from "../types"

// Dados mockados para desenvolvimento
const MOCK_PERFIS: PerfilAcesso[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    permissoes: ["*"]
  },
  {
    id: "2", 
    nome: "Advogado",
    descricao: "Acesso aos processos e clientes",
    permissoes: ["processos.*", "clientes.view", "agenda.*"]
  },
  {
    id: "3",
    nome: "Secretária",
    descricao: "Acesso administrativo básico",
    permissoes: ["agenda.*", "clientes.view", "tarefas.*"]
  },
  {
    id: "4",
    nome: "Estagiário",
    descricao: "Acesso limitado para consulta",
    permissoes: ["processos.view", "clientes.view"]
  }
]

const MOCK_USERS: User[] = [
  {
    id: "1",
    nome: "João Silva",
    cargo: "Advogado Sênior",
    telefone: "+55 (11) 98765-4321",
    email: "joao.silva@escritorio.com",
    perfilAcesso: "2",
    especialidades: ["Direito Civil", "Direito Empresarial"],
    status: UserStatus.ATIVO,
    banco: "Banco do Brasil",
    agencia: "1234-5",
    contaCorrente: "12345-6",
    chavePix: "joao.silva@escritorio.com",
    observacao: "Especialista em contratos empresariais",
    criadoPor: "Admin",
    criadoEm: new Date("2024-01-01"),
    modificadoPor: "Admin",
    modificadoEm: new Date("2024-01-15")
  },
  {
    id: "2",
    nome: "Maria Santos",
    cargo: "Advogada Pleno",
    telefone: "+55 (11) 98765-5432",
    email: "maria.santos@escritorio.com",
    perfilAcesso: "2",
    especialidades: ["Direito do Trabalho", "Direito Previdenciário"],
    status: UserStatus.ATIVO,
    banco: "Itaú",
    agencia: "5678",
    contaCorrente: "67890-1",
    criadoPor: "Admin",
    criadoEm: new Date("2024-01-10")
  },
  {
    id: "3",
    nome: "Pedro Costa",
    cargo: "Estagiário",
    telefone: "+55 (11) 98765-6543",
    email: "pedro.costa@escritorio.com",
    perfilAcesso: "4",
    especialidades: [],
    status: UserStatus.INATIVO,
    observacao: "Inativo desde 01/12/2024",
    criadoPor: "Admin",
    criadoEm: new Date("2024-01-20"),
    inativadoPor: "Admin",
    inativadoEm: new Date("2024-12-01")
  }
]

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [perfisAcesso, setPerfisAcesso] = useState<PerfilAcesso[]>([])
  const [auditoriaLogs, setAuditoriaLogs] = useState<AuditoriaLog[]>([])

  // Carregar dados iniciais
  useEffect(() => {
    loadUsers()
    loadPerfisAcesso()
  }, [])

  // Aplicar filtros sempre que users ou filtros mudarem
  const applyFilters = useCallback((filters: UserFilters) => {
    let filtered = [...users]

    // Busca por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(user => 
        user.nome.toLowerCase().includes(searchLower) ||
        user.cargo.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    // Filtro por cargo
    if (filters.cargo && filters.cargo !== "todos") {
      filtered = filtered.filter(user => user.cargo === filters.cargo)
    }

    setFilteredUsers(filtered)
  }, [users])

  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Em produção, fazer chamada à API real
      setUsers(MOCK_USERS)
      setFilteredUsers(MOCK_USERS)
    } catch (err) {
      setError("Erro ao carregar usuários")
      toast.error("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  // Carregar perfis de acesso
  const loadPerfisAcesso = async () => {
    try {
      // Em produção, fazer chamada à API real
      setPerfisAcesso(MOCK_PERFIS)
    } catch (err) {
      console.error("Erro ao carregar perfis:", err)
    }
  }

  // Criar novo usuário
  const createUser = async (data: UserFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Verificar se e-mail já existe
      const emailExists = users.some(u => u.email === data.email)
      if (emailExists) {
        throw new Error("E-mail já cadastrado no sistema")
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newUser: User = {
        ...data,
        id: String(users.length + 1),
        criadoPor: "Admin", // Em produção, pegar usuário logado
        criadoEm: new Date()
      }
      
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      
      // Registrar no log de auditoria
      await addAuditoriaLog({
        usuarioId: newUser.id,
        acao: "CRIACAO",
        realizadoPor: "Admin",
        detalhes: "Usuário criado com sucesso"
      })
      
      toast.success("Usuário criado com sucesso")
      return newUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar usuário"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar usuário
  const updateUser = async (id: string, data: Partial<UserFormData>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Verificar se e-mail já existe (exceto para o próprio usuário)
      if (data.email) {
        const emailExists = users.some(u => u.email === data.email && u.id !== id)
        if (emailExists) {
          throw new Error("E-mail já cadastrado no sistema")
        }
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          const oldUser = { ...user }
          const updatedUser = {
            ...user,
            ...data,
            modificadoPor: "Admin", // Em produção, pegar usuário logado
            modificadoEm: new Date()
          }
          
          // Registrar mudanças no log de auditoria
          Object.keys(data).forEach(async (key) => {
            if (oldUser[key as keyof User] !== data[key as keyof UserFormData]) {
              await addAuditoriaLog({
                usuarioId: id,
                acao: "EDICAO",
                campo: key,
                valorAnterior: String(oldUser[key as keyof User]),
                valorNovo: String(data[key as keyof UserFormData]),
                realizadoPor: "Admin",
                detalhes: `Campo ${key} atualizado`
              })
            }
          })
          
          return updatedUser
        }
        return user
      })
      
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      
      toast.success("Dados atualizados com sucesso")
      return updatedUsers.find(u => u.id === id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Ativar/Desativar usuário
  const toggleUserStatus = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          const newStatus = user.status === UserStatus.ATIVO ? UserStatus.INATIVO : UserStatus.ATIVO
          const updatedUser = {
            ...user,
            status: newStatus,
            modificadoPor: "Admin",
            modificadoEm: new Date(),
            ...(newStatus === UserStatus.INATIVO && {
              inativadoPor: "Admin",
              inativadoEm: new Date()
            })
          }
          
          // Registrar no log de auditoria
          addAuditoriaLog({
            usuarioId: id,
            acao: newStatus === UserStatus.ATIVO ? "ATIVACAO" : "INATIVACAO",
            realizadoPor: "Admin",
            detalhes: newStatus === UserStatus.INATIVO 
              ? "Usuário desativado. Atividades transferidas ao Admin Master."
              : "Usuário reativado"
          })
          
          // Se desativar, transferir atividades ao Admin Master
          if (newStatus === UserStatus.INATIVO) {
            // Em produção, implementar lógica de transferência
            console.log("Transferindo atividades para Admin Master...")
          }
          
          return updatedUser
        }
        return user
      })
      
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      
      const user = updatedUsers.find(u => u.id === id)
      const message = user?.status === UserStatus.ATIVO 
        ? "Usuário ativado com sucesso"
        : "Usuário desativado com sucesso"
      
      toast.success(message)
      return user
    } catch (err) {
      const errorMessage = "Erro ao alterar status do usuário"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Buscar usuário por ID
  const getUserById = (id: string) => {
    return users.find(user => user.id === id)
  }

  // Adicionar log de auditoria
  const addAuditoriaLog = async (log: Omit<AuditoriaLog, "id" | "realizadoEm">) => {
    const newLog: AuditoriaLog = {
      ...log,
      id: String(auditoriaLogs.length + 1),
      realizadoEm: new Date()
    }
    
    setAuditoriaLogs(prev => [...prev, newLog])
  }

  // Obter logs de auditoria de um usuário
  const getUserAuditoriaLogs = (userId: string) => {
    return auditoriaLogs.filter(log => log.usuarioId === userId)
  }

  // Upload de foto de perfil
  const uploadProfilePhoto = async (userId: string, file: File) => {
    try {
      // Em produção, fazer upload real
      const photoUrl = URL.createObjectURL(file)
      
      await updateUser(userId, { fotoPerfil: photoUrl } as any)
      
      toast.success("Foto de perfil atualizada")
      return photoUrl
    } catch (err) {
      toast.error("Erro ao fazer upload da foto")
      throw err
    }
  }

  // Upload de documentos
  const uploadDocument = async (userId: string, file: File, tipo: string) => {
    try {
      // Em produção, fazer upload real
      const documentUrl = URL.createObjectURL(file)
      
      const user = getUserById(userId)
      if (user) {
        const newDocument = {
          id: String(Date.now()),
          nome: file.name,
          tipo: tipo as any,
          url: documentUrl,
          tamanho: file.size,
          uploadEm: new Date(),
          uploadPor: "Admin"
        }
        
        const updatedDocuments = [...(user.documentosAnexos || []), newDocument]
        await updateUser(userId, { documentosAnexos: updatedDocuments } as any)
      }
      
      toast.success("Documento anexado com sucesso")
      return documentUrl
    } catch (err) {
      toast.error("Erro ao fazer upload do documento")
      throw err
    }
  }

  return {
    users,
    filteredUsers,
    loading,
    error,
    perfisAcesso,
    auditoriaLogs,
    loadUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    getUserById,
    getUserAuditoriaLogs,
    uploadProfilePhoto,
    uploadDocument,
    applyFilters
  }
}
