import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { 
  Cliente, 
  ClienteFormData, 
  FiltrosCliente, 
  PaginacaoCliente,
  AcaoCliente,
  HistoricoFinanceiro,
  TipoCliente,
  StatusCliente,
  AlertaConfidencialidade
} from './types'

// Mock data inicial para demonstração
const mockClientes: Cliente[] = [
  {
    id: '1',
    tipoCliente: TipoCliente.PESSOA_FISICA,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1985-03-15',
    telefone: '(11) 99999-1234',
    email: 'joao.silva@email.com',
    cep: '01310-100',
    rua: 'Av. Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    confidencial: false,
    status: StatusCliente.ATIVO,
    login: 'joao.silva',
    senha: '******',
    anexos: []
  },
  {
    id: '2',
    tipoCliente: TipoCliente.PESSOA_JURIDICA,
    razaoSocial: 'Empresa XYZ Ltda',
    cnpj: '12.345.678/0001-90',
    responsavel: 'Maria Santos',
    telefone: '(11) 3333-4567',
    email: 'contato@empresaxyz.com',
    cep: '04567-890',
    rua: 'Rua das Empresas',
    numero: '500',
    bairro: 'Vila Empresarial',
    cidade: 'São Paulo',
    estado: 'SP',
    confidencial: true,
    status: StatusCliente.ATIVO,
    login: 'empresa.xyz',
    senha: '******',
    anexos: []
  }
]

const mockHistoricoFinanceiro: HistoricoFinanceiro[] = [
  {
    id: '1',
    tipo: 'receber',
    descricao: 'Honorários - Processo Civil',
    valor: 5000.00,
    dataVencimento: new Date('2024-12-15'),
    status: 'pendente',
    observacoes: 'Primeira parcela'
  },
  {
    id: '2',
    tipo: 'pagar',
    descricao: 'Custas processuais',
    valor: 800.00,
    dataVencimento: new Date('2024-11-30'),
    dataPagamento: new Date('2024-11-25'),
    status: 'pago'
  }
]

export function useClientes() {
  // Estados principais
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes.filter(cliente => cliente !== null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para formulário
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [modoFormulario, setModoFormulario] = useState<'criar' | 'editar'>('criar')
  
  // Estados para visualização e histórico
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)
  const [mostrarHistorico, setMostrarHistorico] = useState(false)
  const [historicoFinanceiro, setHistoricoFinanceiro] = useState<HistoricoFinanceiro[]>([])
  
  // Estados para busca e filtros
  const [filtros, setFiltros] = useState<FiltrosCliente>({
    termo: '',
    tipoCliente: 'todos',
    status: 'todos',
    confidencial: 'todos'
  })
  
  // Estados para paginação
  const [paginacao, setPaginacao] = useState<PaginacaoCliente>({
    página: 1,
    itensPorPagina: 10,
    total: mockClientes.length,
    totalPaginas: Math.ceil(mockClientes.length / 10)
  })

  // Função para validar CPF/CNPJ único - AC-03
  const validarDocumentoUnico = useCallback((documento: string, idExcluir?: string): boolean => {
    const documentoLimpo = documento.replace(/[^\d]/g, '')
    return !clientes.filter(cliente => cliente !== null).some(cliente => {
      if (cliente.id === idExcluir) return false
      const clienteDoc = (cliente.cpf || cliente.cnpj || '').replace(/[^\d]/g, '')
      return clienteDoc === documentoLimpo
    })
  }, [clientes])

  // Função para criar cliente - UC-01, UC-02
  const criarCliente = useCallback(async (dadosCliente: ClienteFormData): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Validar documento único
      const documento = dadosCliente.tipoCliente === TipoCliente.PESSOA_FISICA 
        ? dadosCliente.cpf! 
        : dadosCliente.cnpj!
      
      if (!validarDocumentoUnico(documento)) {
        toast.error("Documento já cadastrado no sistema")
        return false
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const novoCliente: Cliente = {
        ...dadosCliente,
        id: Date.now().toString(),
        anexos: dadosCliente.anexos || []
      }

      setClientes(prev => [...prev.filter(c => c !== null), novoCliente])
      
      toast.success("Cliente criado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      setMostrarFormulario(false)
      return true

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar cliente"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [validarDocumentoUnico])

  // Função para editar cliente - UC-04
  const editarCliente = useCallback(async (dadosCliente: ClienteFormData): Promise<boolean> => {
    if (!clienteEditando) return false

    setLoading(true)
    setError(null)

    try {
      // Validar documento único (excluindo o próprio cliente)
      const documento = dadosCliente.tipoCliente === TipoCliente.PESSOA_FISICA 
        ? dadosCliente.cpf! 
        : dadosCliente.cnpj!
      
      if (!validarDocumentoUnico(documento, clienteEditando.id)) {
        toast.error("Documento já cadastrado no sistema")
        return false
      }

      // Verificar mudança na confidencialidade - AC-04
      const mudouConfidencialidade = clienteEditando.confidencial !== dadosCliente.confidencial
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const clienteAtualizado: Cliente = {
        ...dadosCliente,
        id: clienteEditando.id,
        anexos: dadosCliente.anexos || []
      }

      setClientes(prev => 
        prev.filter(c => c !== null).map(cliente => 
          cliente.id === clienteEditando.id ? clienteAtualizado : cliente
        )
      )

      // Gerar alerta se mudou confidencialidade - AC-04
      if (mudouConfidencialidade) {
        const alerta: AlertaConfidencialidade = {
          clienteId: clienteEditando.id!,
          clienteNome: dadosCliente.nome || dadosCliente.razaoSocial || 'Cliente',
          usuarioId: 'user-1', // Simular usuário logado
          usuarioNome: 'Usuário Atual',
          dataAlteracao: new Date(),
          acao: dadosCliente.confidencial ? 'adicionou' : 'removeu'
        }
        
        // Simular notificação para administradores
        toast.info(
          `Alerta: Confidencialidade ${alerta.acao} para cliente ${alerta.clienteNome}`,
          { duration: 5000 }
        )
      }
      
      toast.success("Dados atualizados com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })

      setMostrarFormulario(false)
      setClienteEditando(null)
      return true

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao editar cliente"
      setError(message)
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [clienteEditando, validarDocumentoUnico])

  // Função para excluir cliente - UC-05
  const excluirCliente = useCallback(async (cliente: Cliente): Promise<boolean> => {
    setLoading(true)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))

      setClientes(prev => prev.filter(c => c !== null && c.id !== cliente.id))
      
      toast.success("Cliente excluído com sucesso", {
        duration: 2000,
        position: "bottom-right"
      })

      return true

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir cliente"
      toast.error(message, {
        duration: 3000,
        position: "bottom-right"
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para buscar histórico financeiro - AC-06
  const buscarHistoricoFinanceiro = useCallback(async (clienteId: string): Promise<void> => {
    setLoading(true)

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))

      // Simular dados do histórico financeiro
      setHistoricoFinanceiro(mockHistoricoFinanceiro)

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar histórico"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para anexar documentos - UC-08
  const anexarDocumento = useCallback(async (clienteId: string, arquivo: File): Promise<boolean> => {
    setLoading(true)

    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1500))

      const novoAnexo = {
        id: Date.now().toString(),
        nome: arquivo.name,
        tipo: arquivo.type,
        url: URL.createObjectURL(arquivo),
        dataUpload: new Date()
      }

      setClientes(prev => 
        prev.filter(c => c !== null).map(cliente => 
          cliente.id === clienteId 
            ? { ...cliente, anexos: [...cliente.anexos, novoAnexo] }
            : cliente
        )
      )

      toast.success("Documento anexado ao perfil do cliente", {
        duration: 2000,
        position: "bottom-right"
      })

      return true

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao anexar documento"
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar clientes baseado nos filtros - UC-06, UC-07
  const clientesFiltrados = clientes.filter(cliente => {
    // Verificar se o cliente não é null
    if (!cliente) return false
    
    // Filtro por termo (nome/documento) - UC-06
    if (filtros.termo) {
      const termo = filtros.termo.toLowerCase()
      const nome = (cliente.nome || cliente.razaoSocial || '').toLowerCase()
      const documento = (cliente.cpf || cliente.cnpj || '').replace(/[^\d]/g, '')
      const termoLimpo = filtros.termo.replace(/[^\d]/g, '')
      
      if (!nome.includes(termo) && !documento.includes(termoLimpo)) {
        return false
      }
    }

    // Filtro por tipo
    if (filtros.tipoCliente && filtros.tipoCliente !== 'todos') {
      if (cliente.tipoCliente !== filtros.tipoCliente) return false
    }

    // Filtro por status - UC-07
    if (filtros.status && filtros.status !== 'todos') {
      if (cliente.status !== filtros.status) return false
    }

    // Filtro por confidencialidade
    if (filtros.confidencial !== 'todos') {
      if (cliente.confidencial !== filtros.confidencial) return false
    }

    return true
  })

  // Atualizar paginação quando filtros mudam
  useEffect(() => {
    const total = clientesFiltrados.length
    const totalPaginas = Math.ceil(total / paginacao.itensPorPagina)
    
    setPaginacao(prev => ({
      ...prev,
      total,
      totalPaginas,
      página: Math.min(prev.página, totalPaginas || 1)
    }))
  }, [clientesFiltrados.length, paginacao.itensPorPagina])

  // Ações da interface
  const abrirFormularioCriacao = useCallback(() => {
    setModoFormulario('criar')
    setClienteEditando(null)
    setMostrarFormulario(true)
  }, [])

  const abrirFormularioEdicao = useCallback((cliente: Cliente) => {
    setModoFormulario('editar')
    setClienteEditando(cliente)
    setMostrarFormulario(true)
  }, [])

  const fecharFormulario = useCallback(() => {
    setMostrarFormulario(false)
    setClienteEditando(null)
    setError(null)
  }, [])

  const abrirDetalhes = useCallback((cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setMostrarDetalhes(true)
  }, [])

  const fecharDetalhes = useCallback(() => {
    setMostrarDetalhes(false)
    setClienteSelecionado(null)
  }, [])

  const abrirHistorico = useCallback((cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setMostrarHistorico(true)
    buscarHistoricoFinanceiro(cliente.id!)
  }, [buscarHistoricoFinanceiro])

  const fecharHistorico = useCallback(() => {
    setMostrarHistorico(false)
    setClienteSelecionado(null)
    setHistoricoFinanceiro([])
  }, [])

  // Manipular ações da tabela - AC-07
  const handleAcaoCliente = useCallback((acao: AcaoCliente) => {
    switch (acao.tipo) {
      case 'visualizar':
        abrirDetalhes(acao.cliente)
        break
      case 'editar':
        abrirFormularioEdicao(acao.cliente)
        break
      case 'excluir':
        // Será tratado pelo componente com AlertDialog
        break
      case 'historico':
        abrirHistorico(acao.cliente)
        break
    }
  }, [abrirDetalhes, abrirFormularioEdicao, abrirHistorico])

  return {
    // Estados principais
    clientes: clientesFiltrados,
    loading,
    error,
    
    // Estados de formulário
    mostrarFormulario,
    clienteEditando,
    modoFormulario,
    
    // Estados de visualização
    clienteSelecionado,
    mostrarDetalhes,
    mostrarHistorico,
    historicoFinanceiro,
    
    // Estados de busca/filtros
    filtros,
    paginacao,
    
    // Ações de CRUD
    criarCliente,
    editarCliente,
    excluirCliente,
    anexarDocumento,
    
    // Ações de interface
    abrirFormularioCriacao,
    abrirFormularioEdicao,
    fecharFormulario,
    abrirDetalhes,
    fecharDetalhes,
    abrirHistorico,
    fecharHistorico,
    handleAcaoCliente,
    
    // Ações de filtro
    setFiltros,
    setPaginacao,
    
    // Utilitários
    validarDocumentoUnico
  }
}