"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { 
  AccessProfile, 
  ProfileFormData, 
  ProfileStatus,
  systemModules,
  ScreenPermission,
  PermissionType,
  permissionLabels
} from "./types"

// Mock de dados inicial com perfis que podem ser testados
// 
// CENÁRIOS DE TESTE PARA EXCLUSÃO:
// 1. "Perfil Teste Inativo" (ID: 4) - Inativo, 0 usuários → Pode excluir diretamente
// 2. "Perfil Vazio" (ID: 5) - Ativo, 0 usuários → Desativar primeiro, depois excluir
// 3. "Administrador", "Financeiro", "Advogado Associado" - Ativos com usuários → Desativar primeiro
//
const mockProfiles: AccessProfile[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Perfil com acesso total ao sistema",
    status: ProfileStatus.ATIVO,
    screenPermissions: systemModules.flatMap(module => 
      module.screens.map(screen => ({
        screenId: screen.id,
        screenName: screen.name,
        module: module.name,
        permissions: screen.availablePermissions.map(type => ({
          type,
          label: permissionLabels[type],
          enabled: true
        }))
      }))
    ),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    usersCount: 5
  },
  {
    id: "2",
    name: "Financeiro",
    description: "Perfil para equipe financeira",
    status: ProfileStatus.ATIVO,
    screenPermissions: systemModules.flatMap(module => 
      module.screens
        .filter(screen => ["cobrancas", "receitas-despesas", "balancete"].includes(screen.id))
        .map(screen => ({
          screenId: screen.id,
          screenName: screen.name,
          module: module.name,
          permissions: screen.availablePermissions.map(type => ({
            type,
            label: permissionLabels[type],
            enabled: true
          }))
        }))
    ),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    usersCount: 3
  },
  {
    id: "3",
    name: "Advogado Associado",
    description: "Perfil para advogados parceiros",
    status: ProfileStatus.ATIVO,
    screenPermissions: systemModules.flatMap(module => 
      module.screens
        .filter(screen => ["clientes", "processos", "agenda", "tarefas"].includes(screen.id))
        .map(screen => ({
          screenId: screen.id,
          screenName: screen.name,
          module: module.name,
          permissions: screen.availablePermissions.map(type => ({
            type,
            label: permissionLabels[type],
            enabled: type === PermissionType.VISUALIZAR || type === PermissionType.CRIAR || type === PermissionType.EDITAR
          }))
        }))
    ),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    usersCount: 8
  },
  // Perfil inativo sem usuários - pode ser excluído
  {
    id: "4",
    name: "Perfil Teste Inativo",
    description: "Perfil inativo sem usuários - pode ser excluído",
    status: ProfileStatus.INATIVO,
    screenPermissions: systemModules.flatMap(module => 
      module.screens
        .filter(screen => ["clientes"].includes(screen.id))
        .map(screen => ({
          screenId: screen.id,
          screenName: screen.name,
          module: module.name,
          permissions: screen.availablePermissions.map(type => ({
            type,
            label: permissionLabels[type],
            enabled: type === PermissionType.VISUALIZAR
          }))
        }))
    ),
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    usersCount: 0
  },
  // Perfil ativo sem usuários - pode ser desativado e depois excluído
  {
    id: "5",
    name: "Perfil Vazio",
    description: "Perfil ativo sem usuários - pode ser desativado e excluído",
    status: ProfileStatus.ATIVO,
    screenPermissions: systemModules.flatMap(module => 
      module.screens
        .filter(screen => ["tarefas"].includes(screen.id))
        .map(screen => ({
          screenId: screen.id,
          screenName: screen.name,
          module: module.name,
          permissions: screen.availablePermissions.map(type => ({
            type,
            label: permissionLabels[type],
            enabled: type === PermissionType.VISUALIZAR || type === PermissionType.CRIAR
          }))
        }))
    ),
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    usersCount: 0
  }
]

export function useNiveisAcesso() {
  const [profiles, setProfiles] = useState<AccessProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProfileStatus | "todos">("todos")

  // Simula carregamento inicial
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setProfiles(mockProfiles)
      setLoading(false)
    }, 500)
  }, [])

  // Criar novo perfil
  const createProfile = useCallback(async (data: ProfileFormData) => {
    setLoading(true)
    try {
      // Validação de nome duplicado
      const exists = profiles.some(p => 
        p.name.toLowerCase() === data.name.toLowerCase()
      )
      
      if (exists) {
        throw new Error("Nome já existe no sistema")
      }

      const newProfile: AccessProfile = {
        id: String(Date.now()),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        usersCount: 0
      }

      setProfiles(prev => [...prev, newProfile])
      toast.success("Perfil criado com sucesso")
      return newProfile
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar perfil")
      throw error
    } finally {
      setLoading(false)
    }
  }, [profiles])

  // Atualizar perfil existente
  const updateProfile = useCallback(async (id: string, data: ProfileFormData) => {
    setLoading(true)
    try {
      // Validação de nome duplicado (exceto o próprio perfil)
      const exists = profiles.some(p => 
        p.id !== id && p.name.toLowerCase() === data.name.toLowerCase()
      )
      
      if (exists) {
        throw new Error("Nome já existe no sistema")
      }

      setProfiles(prev => prev.map(profile => 
        profile.id === id 
          ? { ...profile, ...data, updatedAt: new Date() }
          : profile
      ))
      
      toast.success("Permissões atualizadas com sucesso")
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil")
      throw error
    } finally {
      setLoading(false)
    }
  }, [profiles])

  // Deletar perfil
  const deleteProfile = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const profile = profiles.find(p => p.id === id)
      
      if (!profile) {
        throw new Error("Perfil não encontrado")
      }

      // Só permite exclusão se:
      // 1. Perfil está inativo E não tem usuários, OU
      // 2. Perfil não tem usuários (independente do status)
      if (profile.status === ProfileStatus.ATIVO && profile.usersCount && profile.usersCount > 0) {
        throw new Error("Não é possível excluir perfil ativo com usuários. Desative o perfil primeiro.")
      }

      setProfiles(prev => prev.filter(p => p.id !== id))
      toast.success("Perfil excluído com sucesso")
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir perfil")
      throw error
    } finally {
      setLoading(false)
    }
  }, [profiles])

  // Alternar status do perfil
  const toggleProfileStatus = useCallback(async (id: string) => {
    setLoading(true)
    try {
      setProfiles(prev => prev.map(profile => {
        if (profile.id === id) {
          const newStatus = profile.status === ProfileStatus.ATIVO 
            ? ProfileStatus.INATIVO 
            : ProfileStatus.ATIVO
          
          // Se está desativando um perfil com usuários, simula transferência para Admin Master
          if (newStatus === ProfileStatus.INATIVO && profile.usersCount && profile.usersCount > 0) {
            // Simula transferência de usuários para o perfil Administrador (ID: "1")
            const adminProfile = prev.find(p => p.id === "1")
            if (adminProfile) {
              // Atualiza o perfil Admin Master com os usuários transferidos
              setProfiles(currentProfiles => currentProfiles.map(p => 
                p.id === "1" 
                  ? { ...p, usersCount: (p.usersCount || 0) + profile.usersCount! }
                  : p
              ))
            }
            
            toast.success(
              `Perfil desativado com sucesso. ${profile.usersCount} usuário(s) transferido(s) para Admin Master.`
            )
          } else {
            toast.success(
              newStatus === ProfileStatus.INATIVO 
                ? "Perfil desativado com sucesso" 
                : "Perfil ativado com sucesso"
            )
          }
          
          return { 
            ...profile, 
            status: newStatus, 
            updatedAt: new Date(),
            // Se desativou, zera o contador de usuários (foram transferidos)
            usersCount: newStatus === ProfileStatus.INATIVO ? 0 : profile.usersCount
          }
        }
        return profile
      }))
    } catch (error: any) {
      toast.error("Erro ao alterar status do perfil")
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar perfil por ID
  const getProfileById = useCallback((id: string) => {
    return profiles.find(p => p.id === id)
  }, [profiles])

  // Filtrar perfis
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "todos" || profile.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Gerar permissões vazias para todas as telas
  const generateEmptyPermissions = useCallback((): ScreenPermission[] => {
    return systemModules.flatMap(module => 
      module.screens.map(screen => ({
        screenId: screen.id,
        screenName: screen.name,
        module: module.name,
        permissions: screen.availablePermissions.map(type => ({
          type,
          label: permissionLabels[type],
          enabled: false
        }))
      }))
    )
  }, [])

  // Selecionar todas as permissões
  const selectAllPermissions = useCallback((permissions: ScreenPermission[]): ScreenPermission[] => {
    return permissions.map(screen => ({
      ...screen,
      permissions: screen.permissions.map(perm => ({
        ...perm,
        enabled: true
      }))
    }))
  }, [])

  // Selecionar todas as permissões de um módulo
  const selectModulePermissions = useCallback(
    (permissions: ScreenPermission[], moduleId: string): ScreenPermission[] => {
      const module = systemModules.find(m => m.id === moduleId)
      if (!module) return permissions

      return permissions.map(screen => {
        const isInModule = module.screens.some(s => s.id === screen.screenId)
        return {
          ...screen,
          permissions: screen.permissions.map(perm => ({
            ...perm,
            enabled: isInModule ? true : perm.enabled
          }))
        }
      })
    }, []
  )

  // Selecionar todas as permissões de uma tela
  const selectScreenPermissions = useCallback(
    (permissions: ScreenPermission[], screenId: string): ScreenPermission[] => {
      return permissions.map(screen => {
        if (screen.screenId === screenId) {
          return {
            ...screen,
            permissions: screen.permissions.map(perm => ({
              ...perm,
              enabled: true
            }))
          }
        }
        return screen
      })
    }, []
  )

  return {
    profiles: filteredProfiles,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createProfile,
    updateProfile,
    deleteProfile,
    toggleProfileStatus,
    getProfileById,
    generateEmptyPermissions,
    selectAllPermissions,
    selectModulePermissions,
    selectScreenPermissions,
    totalProfiles: profiles.length
  }
}
