import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Tarefa, TarefaFormData, TarefaFilters, Cliente, Processo, Usuario } from './types'

// REQUIREMENTS LOCK: Hook baseado nos 10 cenários de uso especificados
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [processos, setProcessos] = useState<Processo[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TarefaFilters>({})

  // MOCK DATA - Simula integrações conforme especificado
  const mockClientes: Cliente[] = [
    { id: '1', nome: 'João Silva Advocacia', tipo: 'juridica' },
    { id: '2', nome: 'Maria Santos', tipo: 'fisica' },
    { id: '3', nome: 'Empresa ABC Ltda', tipo: 'juridica' },
    { id: '4', nome: 'Pedro Oliveira', tipo: 'fisica' }
  ]

  const mockProcessos: Processo[] = [
    { id: '1', numero: '1001234-12.2024.5.01.0001', titulo: 'Ação Trabalhista - João Silva', clienteId: '1' },
    { id: '2', numero: '2001234-12.2024.8.26.0100', titulo: 'Ação de Cobrança - Maria Santos', clienteId: '2' },
    { id: '3', numero: '3001234-12.2024.4.03.6100', titulo: 'Mandado de Segurança - Empresa ABC', clienteId: '3' },
    { id: '4', numero: '4001234-12.2024.5.15.0001', titulo: 'Reclamação Trabalhista - Pedro Oliveira', clienteId: '4' }
  ]

  const mockUsuarios: Usuario[] = [
    { id: '1', nome: 'Dr. Carlos Mendes', email: 'carlos@escritorio.com', ativo: true },
    { id: '2', nome: 'Dra. Ana Costa', email: 'ana@escritorio.com', ativo: true },
    { id: '3', nome: 'Dr. Ricardo Souza', email: 'ricardo@escritorio.com', ativo: true },
    { id: '4', nome: 'Assistente Legal - Julia', email: 'julia@escritorio.com', ativo: true }
  ]

  const mockTarefas: Tarefa[] = [
    {
      id: '1',
      tipoAtividade: 'juridica',
      nomeAtividade: 'Elaborar petição inicial',
      responsavel: '1',
      prioridade: 'alta',
      status: 'em_andamento',
      etiquetas: ['urgente', 'trabalhista'],
      dataInicio: '2024-08-12',
      horaInicio: '09:00',
      dataFim: '2024-08-15',
      horaFim: '18:00',
      descricao: 'Elaborar petição inicial para ação trabalhista do cliente João Silva',
      cliente: '1',
      processo: '1',
      atividade: 'Peticionamento',
      valor: 2500.00,
      tipoSegmento: 'Trabalhista',
      criadoEm: '2024-08-10T10:00:00Z',
      atualizadoEm: '2024-08-11T14:30:00Z',
      criadoPor: '1',
      atualizadoPor: '1'
    },
    {
      id: '2',
      tipoAtividade: 'administrativa',
      nomeAtividade: 'Organizar documentos do processo',
      responsavel: '4',
      prioridade: 'media',
      status: 'nao_iniciada',
      etiquetas: ['documentos'],
      dataInicio: '2024-08-13',
      horaInicio: '08:00',
      dataFim: '2024-08-14',
      horaFim: '17:00',
      descricao: 'Organizar e digitalizar documentos físicos do processo de Maria Santos',
      cliente: '2',
      processo: '2',
      atividade: 'Organização',
      tipoSegmento: 'Cível',
      criadoEm: '2024-08-10T11:00:00Z',
      atualizadoEm: '2024-08-10T11:00:00Z',
      criadoPor: '2'
    }
  ]

  // CENÁRIO 1: Buscar e filtrar tarefas
  const filteredTarefas = tarefas.filter(tarefa => {
    if (filters.busca) {
      const busca = filters.busca.toLowerCase()
      const nomeMatch = tarefa.nomeAtividade.toLowerCase().includes(busca)
      const responsavelNome = usuarios.find(u => u.id === tarefa.responsavel)?.nome.toLowerCase()
      const responsavelMatch = responsavelNome?.includes(busca) || false
      if (!nomeMatch && !responsavelMatch) return false
    }
    
    if (filters.responsavel && tarefa.responsavel !== filters.responsavel) return false
    if (filters.cliente && tarefa.cliente !== filters.cliente) return false
    if (filters.processo && tarefa.processo !== filters.processo) return false
    if (filters.prioridade && tarefa.prioridade !== filters.prioridade) return false
    if (filters.status && tarefa.status !== filters.status) return false
    if (filters.tipoAtividade && tarefa.tipoAtividade !== filters.tipoAtividade) return false
    
    return true
  })

  // CENÁRIO 2: Criar tarefa
  const criarTarefa = async (data: TarefaFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula validação de permissões
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const novaTarefa: Tarefa = {
        id: Date.now().toString(),
        ...data,
        status: 'nao_iniciada',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        criadoPor: '1' // Usuário atual mockado
      }
      
      setTarefas(prev => [novaTarefa, ...prev])
      
      // FEEDBACK DISCRETO conforme callistra-patterns.md
      toast.success("Tarefa criada com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      setError('Erro ao criar tarefa')
      toast.error("Erro ao criar tarefa.", { 
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // CENÁRIO 3: Editar tarefa
  const editarTarefa = async (id: string, data: TarefaFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula validação de permissões
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setTarefas(prev => prev.map(tarefa => 
        tarefa.id === id 
          ? { 
              ...tarefa, 
              ...data,
              atualizadoEm: new Date().toISOString(),
              atualizadoPor: '1' // Usuário atual mockado
            }
          : tarefa
      ))
      
      toast.success("Tarefa atualizada com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      setError('Erro ao atualizar tarefa')
      toast.error("Erro ao atualizar tarefa.", { 
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // CENÁRIO 4: Remover tarefa (com controle de permissão)
  const removerTarefa = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula validação de permissões
      const tarefa = tarefas.find(t => t.id === id)
      if (!tarefa) {
        throw new Error('Tarefa não encontrada')
      }
      
      // Simula verificação de permissão (usuário pode editar apenas suas próprias tarefas ou se for admin)
      const podeRemover = tarefa.criadoPor === '1' // Mockado: usuário atual
      if (!podeRemover) {
        toast.error("Acesso negado", { 
          duration: 3000,
          position: "bottom-right"
        })
        return false
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTarefas(prev => prev.filter(tarefa => tarefa.id !== id))
      
      toast.success("Tarefa removida com sucesso!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      setError('Erro ao remover tarefa')
      toast.error("Erro ao remover tarefa.", { 
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // ANEXAR ARQUIVOS - Cenário 5
  const anexarArquivo = async (tarefaId: string, arquivo: File): Promise<boolean> => {
    setLoading(true)
    
    try {
      // Simula upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const novoAnexo = {
        id: Date.now().toString(),
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size,
        url: URL.createObjectURL(arquivo),
        uploadedAt: new Date().toISOString()
      }
      
      setTarefas(prev => prev.map(tarefa => 
        tarefa.id === tarefaId 
          ? { 
              ...tarefa, 
              anexos: [...(tarefa.anexos || []), novoAnexo],
              atualizadoEm: new Date().toISOString()
            }
          : tarefa
      ))
      
      toast.success("Documento anexado à tarefa!", { 
        duration: 2000,
        position: "bottom-right"
      })
      
      return true
    } catch (err) {
      toast.error("Erro ao anexar documento.", { 
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // LOAD INITIAL DATA
  useEffect(() => {
    setClientes(mockClientes)
    setProcessos(mockProcessos)
    setUsuarios(mockUsuarios)
    setTarefas(mockTarefas)
  }, [])

  return {
    // Data
    tarefas: filteredTarefas,
    clientes,
    processos,
    usuarios,
    
    // State
    loading,
    error,
    filters,
    
    // Actions - Baseados nos cenários especificados
    criarTarefa,
    editarTarefa,
    removerTarefa,
    anexarArquivo,
    setFilters,
    
    // Utils
    getTarefaById: (id: string) => tarefas.find(t => t.id === id),
    getClienteNome: (id: string) => clientes.find(c => c.id === id)?.nome || 'Cliente não encontrado',
    getProcessoNumero: (id: string) => processos.find(p => p.id === id)?.numero || 'Processo não encontrado',
    getUsuarioNome: (id: string) => usuarios.find(u => u.id === id)?.nome || 'Usuário não encontrado'
  }
}