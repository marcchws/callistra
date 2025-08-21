import { useState, useEffect, useCallback, useMemo } from 'react'
import { AccessLevel, AccessLevelFormData, FilterState } from '../types'
import { toast } from 'sonner'

// Mock de dados iniciais para demonstração
const mockAccessLevels: AccessLevel[] = [
  {
    id: '1',
    nome: 'Administrador',
    descricao: 'Acesso total ao sistema com todas as permissões',
    status: 'ativo',
    permissoes: {},
    usuariosVinculados: 5,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Financeiro',
    descricao: 'Acesso às funcionalidades financeiras e relatórios',
    status: 'ativo',
    permissoes: {},
    usuariosVinculados: 3,
    criadoEm: new Date('2024-01-02'),
    atualizadoEm: new Date('2024-01-02')
  },
  {
    id: '3',
    nome: 'Marketing',
    descricao: 'Acesso à gestão de conteúdo e landing page',
    status: 'inativo',
    permissoes: {},
    usuariosVinculados: 0,
    criadoEm: new Date('2024-01-03'),
    atualizadoEm: new Date('2024-01-03')
  }
]

export function useAccessLevels() {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'todos'
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadAccessLevels()
  }, [])

  // Função para carregar perfis de acesso
  const loadAccessLevels = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      setAccessLevels(mockAccessLevels)
    } catch (err) {
      setError('Erro ao carregar perfis de acesso')
      toast.error('Erro ao carregar perfis de acesso')
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para criar novo perfil
  const createAccessLevel = useCallback(async (data: AccessLevelFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Verifica se o nome já existe
      const exists = accessLevels.some(
        level => level.nome.toLowerCase() === data.nome.toLowerCase()
      )
      
      if (exists) {
        toast.error('Nome já existe no sistema')
        return false
      }

      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newAccessLevel: AccessLevel = {
        id: Date.now().toString(),
        ...data,
        usuariosVinculados: 0,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      }
      
      setAccessLevels(prev => [...prev, newAccessLevel])
      toast.success('Perfil criado com sucesso')
      return true
    } catch (err) {
      setError('Erro ao criar perfil de acesso')
      toast.error('Erro ao criar perfil de acesso')
      return false
    } finally {
      setLoading(false)
    }
  }, [accessLevels])

  // Função para atualizar perfil existente
  const updateAccessLevel = useCallback(async (id: string, data: AccessLevelFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Verifica se o nome já existe (exceto para o próprio perfil)
      const exists = accessLevels.some(
        level => level.id !== id && level.nome.toLowerCase() === data.nome.toLowerCase()
      )
      
      if (exists) {
        toast.error('Nome já existe no sistema')
        return false
      }

      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAccessLevels(prev => prev.map(level =>
        level.id === id
          ? { ...level, ...data, atualizadoEm: new Date() }
          : level
      ))
      
      toast.success('Permissões atualizadas com sucesso')
      return true
    } catch (err) {
      setError('Erro ao atualizar perfil de acesso')
      toast.error('Erro ao atualizar perfil de acesso')
      return false
    } finally {
      setLoading(false)
    }
  }, [accessLevels])

  // Função para deletar perfil
  const deleteAccessLevel = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const level = accessLevels.find(l => l.id === id)
      
      // Verifica se há usuários vinculados
      if (level?.usuariosVinculados && level.usuariosVinculados > 0) {
        toast.error('Não é possível excluir perfil em uso')
        return false
      }

      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAccessLevels(prev => prev.filter(level => level.id !== id))
      toast.success('Perfil excluído com sucesso')
      return true
    } catch (err) {
      setError('Erro ao excluir perfil de acesso')
      toast.error('Erro ao excluir perfil de acesso')
      return false
    } finally {
      setLoading(false)
    }
  }, [accessLevels])

  // Função para alternar status do perfil
  const toggleAccessLevelStatus = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAccessLevels(prev => prev.map(level => {
        if (level.id === id) {
          const newStatus = level.status === 'ativo' ? 'inativo' : 'ativo'
          toast.success(
            newStatus === 'ativo' 
              ? 'Perfil ativado com sucesso'
              : 'Perfil desativado com sucesso'
          )
          return { ...level, status: newStatus, atualizadoEm: new Date() }
        }
        return level
      }))
      
      return true
    } catch (err) {
      setError('Erro ao alterar status do perfil')
      toast.error('Erro ao alterar status do perfil')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Aplicar filtros nos perfis
  const filteredAccessLevels = useMemo(() => {
    let filtered = [...accessLevels]
    
    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(level =>
        level.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        level.descricao?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    // Filtro de status
    if (filters.status !== 'todos') {
      filtered = filtered.filter(level => level.status === filters.status)
    }
    
    // Ordenação alfabética
    filtered.sort((a, b) => a.nome.localeCompare(b.nome))
    
    return filtered
  }, [accessLevels, filters])

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Verificar se nome já existe
  const checkNameExists = useCallback((name: string, excludeId?: string): boolean => {
    return accessLevels.some(
      level => level.id !== excludeId && level.nome.toLowerCase() === name.toLowerCase()
    )
  }, [accessLevels])

  return {
    accessLevels: filteredAccessLevels,
    loading,
    error,
    filters,
    createAccessLevel,
    updateAccessLevel,
    deleteAccessLevel,
    toggleAccessLevelStatus,
    updateFilters,
    checkNameExists,
    reload: loadAccessLevels
  }
}
