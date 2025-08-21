import { useState, useEffect } from "react"
import { PerfilAcesso, PerfilAcessoForm, telasDisponiveis } from "./types"
import { toast } from "sonner"

// Mock data para desenvolvimento
const mockPerfis: PerfilAcesso[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    status: "ativo",
    permissoes: telasDisponiveis.map(tela => ({
      telaId: tela.id,
      telaNome: tela.nome,
      modulo: tela.modulo,
      permissoes: {
        visualizar: true,
        criar: true,
        editar: true,
        excluir: true,
        editarConfidencialidade: true,
        exportar: true
      }
    })),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2", 
    nome: "Advogado Associado",
    descricao: "Acesso limitado para advogados parceiros",
    status: "ativo",
    permissoes: [
      {
        telaId: "escritorio-processos",
        telaNome: "Gestão de Processos",
        modulo: "Escritório",
        permissoes: {
          visualizar: true,
          criar: true,
          editar: true,
          excluir: false,
          editarConfidencialidade: false,
          exportar: true
        }
      },
      {
        telaId: "escritorio-clientes",
        telaNome: "Cadastro de Clientes",
        modulo: "Escritório", 
        permissoes: {
          visualizar: true,
          criar: false,
          editar: true,
          excluir: false,
          editarConfidencialidade: false,
          exportar: false
        }
      }
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "3",
    nome: "Financeiro",
    descricao: "Perfil para setor financeiro",
    status: "inativo",
    permissoes: [
      {
        telaId: "escritorio-financeiro",
        telaNome: "Receitas e Despesas",
        modulo: "Escritório",
        permissoes: {
          visualizar: true,
          criar: true,
          editar: true,
          excluir: true,
          editarConfidencialidade: true,
          exportar: true
        }
      }
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10")
  }
]

export function useNiveisAcesso() {
  const [perfis, setPerfis] = useState<PerfilAcesso[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"todos" | "ativo" | "inativo">("todos")

  // Simular carregamento inicial
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setPerfis(mockPerfis)
      setLoading(false)
    }, 500)
  }, [])

  // Filtrar perfis baseado na busca e filtro de status
  const perfisFiltrados = perfis.filter(perfil => {
    const matchesSearch = perfil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "todos" || perfil.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Criar novo perfil
  const criarPerfil = async (data: PerfilAcessoForm): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Validar se nome já existe
      const nomeExiste = perfis.some(perfil => 
        perfil.nome.toLowerCase() === data.nome.toLowerCase()
      )

      if (nomeExiste) {
        setError("Nome já existe no sistema")
        toast.error("Nome já existe no sistema", {
          duration: 3000,
          position: "bottom-right"
        })
        return false
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const novoPerfil: PerfilAcesso = {
        id: Date.now().toString(),
        nome: data.nome,
        descricao: data.descricao,
        status: data.status,
        permissoes: data.permissoes,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setPerfis(prev => [...prev, novoPerfil])
      
      toast.success("Perfil criado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      return true
    } catch (err) {
      const errorMessage = "Erro ao criar perfil"
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Editar perfil existente
  const editarPerfil = async (id: string, data: PerfilAcessoForm): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Validar se nome já existe (exceto o próprio perfil)
      const nomeExiste = perfis.some(perfil => 
        perfil.id !== id && perfil.nome.toLowerCase() === data.nome.toLowerCase()
      )

      if (nomeExiste) {
        setError("Nome já existe no sistema")
        toast.error("Nome já existe no sistema", {
          duration: 3000,
          position: "bottom-right"
        })
        return false
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPerfis(prev => prev.map(perfil => 
        perfil.id === id 
          ? { 
              ...perfil, 
              nome: data.nome,
              descricao: data.descricao,
              status: data.status,
              permissoes: data.permissoes,
              updatedAt: new Date() 
            }
          : perfil
      ))

      toast.success("Permissões atualizadas com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      return true
    } catch (err) {
      const errorMessage = "Erro ao atualizar perfil"
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Alterar status do perfil (ativar/desativar)
  const alterarStatus = async (id: string, novoStatus: "ativo" | "inativo"): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      setPerfis(prev => prev.map(perfil => 
        perfil.id === id 
          ? { ...perfil, status: novoStatus, updatedAt: new Date() }
          : perfil
      ))

      const statusLabel = novoStatus === "ativo" ? "ativado" : "desativado"
      toast.success(`Perfil ${statusLabel} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })

      return true
    } catch (err) {
      const errorMessage = "Erro ao alterar status do perfil"
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Excluir perfil (apenas se não estiver em uso)
  const excluirPerfil = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simular verificação se perfil está em uso
      // Em uma implementação real, verificaria no backend se há usuários vinculados
      const perfilEmUso = Math.random() > 0.7 // 30% chance de estar em uso

      if (perfilEmUso) {
        setError("Não é possível excluir perfil em uso")
        toast.error("Não é possível excluir perfil em uso", {
          duration: 3000,
          position: "bottom-right"
        })
        return false
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      setPerfis(prev => prev.filter(perfil => perfil.id !== id))

      toast.success("Perfil excluído com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      return true
    } catch (err) {
      const errorMessage = "Erro ao excluir perfil"
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Buscar perfil por ID
  const buscarPerfilPorId = (id: string): PerfilAcesso | undefined => {
    return perfis.find(perfil => perfil.id === id)
  }

  return {
    // Estados
    perfis: perfisFiltrados,
    loading,
    error,
    searchTerm,
    statusFilter,
    
    // Actions  
    setSearchTerm,
    setStatusFilter,
    criarPerfil,
    editarPerfil,
    alterarStatus,
    excluirPerfil,
    buscarPerfilPorId,
    
    // Utils
    totalPerfis: perfis.length,
    perfisAtivos: perfis.filter(p => p.status === "ativo").length,
    perfisInativos: perfis.filter(p => p.status === "inativo").length
  }
}
