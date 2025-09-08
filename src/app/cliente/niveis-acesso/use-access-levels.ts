import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { 
  AccessLevel, 
  AccessLevelFormData, 
  AccessLevelFilters,
  systemMessages,
  ScreenPermissions
} from "./types"

// Mock data inicial para demonstração
const mockAccessLevels: AccessLevel[] = [
  {
    id: "1",
    name: "Administrador",
    description: "Acesso completo ao sistema",
    status: "ativo",
    permissions: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    usersCount: 5
  },
  {
    id: "2",
    name: "Financeiro",
    description: "Acesso às funcionalidades financeiras",
    status: "ativo",
    permissions: [],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    usersCount: 3
  },
  {
    id: "3",
    name: "Marketing",
    description: "Perfil para equipe de marketing",
    status: "inativo",
    permissions: [],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    usersCount: 0
  },
  {
    id: "4",
    name: "Advogado Associado",
    description: "Perfil para advogados parceiros",
    status: "ativo",
    permissions: [],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    usersCount: 12
  },
  {
    id: "5",
    name: "Contador Parceiro",
    description: "Acesso limitado para contadores externos",
    status: "ativo",
    permissions: [],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    usersCount: 2
  }
]

export function useAccessLevels() {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(mockAccessLevels)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<AccessLevelFilters>({
    search: "",
    status: "todos"
  })

  // Filtrar perfis baseado nos filtros
  const filteredAccessLevels = useMemo(() => {
    let filtered = [...accessLevels]

    // Filtro de busca (Cenário 10 e 11)
    if (filters.search) {
      filtered = filtered.filter(level =>
        level.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        level.description?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    // Filtro de status (Cenário 12)
    if (filters.status && filters.status !== "todos") {
      filtered = filtered.filter(level => level.status === filters.status)
    }

    return filtered
  }, [accessLevels, filters])

  // Criar novo perfil (Cenário 1, 2, 3)
  const createAccessLevel = useCallback(async (data: AccessLevelFormData) => {
    setLoading(true)
    
    try {
      // Validar nome obrigatório (Cenário 2)
      if (!data.name || data.name.trim() === "") {
        toast.error(systemMessages.error.nameRequired)
        setLoading(false)
        return { success: false, error: systemMessages.error.nameRequired }
      }

      // Verificar se nome já existe (Cenário 3)
      const nameExists = accessLevels.some(
        level => level.name.toLowerCase() === data.name.toLowerCase()
      )
      
      if (nameExists) {
        toast.error(systemMessages.error.nameExists)
        setLoading(false)
        return { success: false, error: systemMessages.error.nameExists }
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Criar novo perfil (Cenário 1)
      const newAccessLevel: AccessLevel = {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        status: data.status || "ativo",
        permissions: data.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        usersCount: 0
      }

      setAccessLevels(prev => [...prev, newAccessLevel])
      toast.success(systemMessages.success.create, {
        duration: 2000,
        position: "bottom-right"
      })
      
      setLoading(false)
      return { success: true, data: newAccessLevel }
    } catch (error) {
      toast.error(systemMessages.error.generic)
      setLoading(false)
      return { success: false, error: systemMessages.error.generic }
    }
  }, [accessLevels])

  // Atualizar perfil existente (Cenário 9)
  const updateAccessLevel = useCallback(async (id: string, data: Partial<AccessLevelFormData>) => {
    setLoading(true)
    
    try {
      // Verificar se nome já existe (se estiver alterando o nome)
      if (data.name) {
        const nameExists = accessLevels.some(
          level => level.id !== id && level.name.toLowerCase() === data.name.toLowerCase()
        )
        
        if (nameExists) {
          toast.error(systemMessages.error.nameExists)
          setLoading(false)
          return { success: false, error: systemMessages.error.nameExists }
        }
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      setAccessLevels(prev => prev.map(level => {
        if (level.id === id) {
          return {
            ...level,
            ...data,
            updatedAt: new Date()
          }
        }
        return level
      }))

      toast.success(systemMessages.success.update, {
        duration: 2000,
        position: "bottom-right"
      })
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      toast.error(systemMessages.error.generic)
      setLoading(false)
      return { success: false, error: systemMessages.error.generic }
    }
  }, [accessLevels])

  // Excluir perfil (Cenário 7, 8)
  const deleteAccessLevel = useCallback(async (id: string) => {
    setLoading(true)
    
    try {
      const level = accessLevels.find(l => l.id === id)
      
      if (!level) {
        toast.error(systemMessages.error.notFound)
        setLoading(false)
        return { success: false, error: systemMessages.error.notFound }
      }

      // Verificar se tem usuários vinculados (Cenário 8)
      if (level.usersCount && level.usersCount > 0) {
        toast.error(systemMessages.error.deleteWithUsers)
        setLoading(false)
        return { success: false, error: systemMessages.error.deleteWithUsers }
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Excluir perfil sem vínculo (Cenário 7)
      setAccessLevels(prev => prev.filter(l => l.id !== id))
      toast.success(systemMessages.success.delete, {
        duration: 2000,
        position: "bottom-right"
      })
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      toast.error(systemMessages.error.generic)
      setLoading(false)
      return { success: false, error: systemMessages.error.generic }
    }
  }, [accessLevels])

  // Alternar status do perfil (Cenário 6)
  const toggleAccessLevelStatus = useCallback(async (id: string) => {
    setLoading(true)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      setAccessLevels(prev => prev.map(level => {
        if (level.id === id) {
          const newStatus = level.status === "ativo" ? "inativo" : "ativo"
          
          // Notificar sobre desativação (Cenário 6)
          if (newStatus === "inativo") {
            toast.success(systemMessages.success.deactivate, {
              duration: 2000,
              position: "bottom-right"
            })
          } else {
            toast.success(systemMessages.success.activate, {
              duration: 2000,
              position: "bottom-right"
            })
          }
          
          return {
            ...level,
            status: newStatus,
            updatedAt: new Date()
          }
        }
        return level
      }))
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      toast.error(systemMessages.error.generic)
      setLoading(false)
      return { success: false, error: systemMessages.error.generic }
    }
  }, [])

  // Buscar perfil por ID
  const getAccessLevelById = useCallback((id: string) => {
    return accessLevels.find(level => level.id === id)
  }, [accessLevels])

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<AccessLevelFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Verificar se nome já existe (para validação em tempo real)
  const checkNameExists = useCallback((name: string, excludeId?: string) => {
    return accessLevels.some(
      level => level.id !== excludeId && level.name.toLowerCase() === name.toLowerCase()
    )
  }, [accessLevels])

  return {
    accessLevels: filteredAccessLevels,
    loading,
    filters,
    createAccessLevel,
    updateAccessLevel,
    deleteAccessLevel,
    toggleAccessLevelStatus,
    getAccessLevelById,
    updateFilters,
    checkNameExists,
    totalCount: accessLevels.length,
    filteredCount: filteredAccessLevels.length
  }
}
