import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Cobranca, 
  ClienteCobranca, 
  HistoricoCobranca, 
  EstatisticasCobranca, 
  FiltrosCobranca,
  EmissaoCobrancaForm,
  AtualizacaoStatusForm,
  LiberacaoClienteForm
} from './types'

// Mock data - Em produção seria substituído por API real
const mockCobrancas: Cobranca[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'João Silva & Advogados',
    valor: 2500.00,
    dataVencimento: new Date('2024-01-15'),
    dataCriacao: new Date('2024-01-01'),
    dataUltimoEnvio: new Date('2024-01-20'),
    status: 'vencida',
    boleto: 'BOL001',
    linkPagamento: 'https://pay.example.com/link1',
    tentativasEnvio: 3,
    diasAtraso: 25,
    observacoes: 'Cobrança de honorários advocatícios'
  },
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'Maria Santos Empresarial',
    valor: 1800.00,
    dataVencimento: new Date('2024-02-10'),
    dataCriacao: new Date('2024-01-25'),
    status: 'enviada',
    boleto: 'BOL002',
    linkPagamento: 'https://pay.example.com/link2',
    tentativasEnvio: 1,
    diasAtraso: 0
  },
  {
    id: '3',
    clienteId: '3',
    clienteNome: 'Pedro Costa Tributário',
    valor: 3200.00,
    dataVencimento: new Date('2024-01-05'),
    dataCriacao: new Date('2023-12-20'),
    status: 'bloqueado',
    boleto: 'BOL003',
    linkPagamento: 'https://pay.example.com/link3',
    tentativasEnvio: 5,
    diasAtraso: 35,
    observacoes: 'Cliente bloqueado por atraso superior a 15 dias'
  }
]

const mockClientes: ClienteCobranca[] = [
  {
    id: '1',
    nome: 'João Silva & Advogados',
    email: 'contato@joaosilva.adv.br',
    telefone: '(11) 99999-9999',
    status: 'ativo',
    totalDevedor: 2500.00,
    diasMaximoAtraso: 25
  },
  {
    id: '2',
    nome: 'Maria Santos Empresarial',
    email: 'financeiro@mariasantos.com.br',
    telefone: '(11) 88888-8888',
    status: 'ativo',
    totalDevedor: 1800.00,
    diasMaximoAtraso: 0
  },
  {
    id: '3',
    nome: 'Pedro Costa Tributário',
    email: 'pedro@costaagrario.adv.br',
    status: 'bloqueado',
    dataBloqueio: new Date('2024-01-10'),
    motivoBloqueio: 'Atraso superior a 15 dias',
    usuarioBloqueio: 'admin@callistra.com',
    totalDevedor: 3200.00,
    diasMaximoAtraso: 35
  }
]

// Mock data para histórico - AC5
const mockHistorico: HistoricoCobranca[] = [
  {
    id: 'h1',
    cobrancaId: '1',
    acao: 'criada',
    dataAcao: new Date('2024-01-01T09:00:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cobrança criada automaticamente pelo sistema'
  },
  {
    id: 'h2',
    cobrancaId: '1',
    acao: 'enviada',
    dataAcao: new Date('2024-01-02T14:30:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cobrança enviada por e-mail para contato@joaosilva.adv.br'
  },
  {
    id: 'h3',
    cobrancaId: '1',
    acao: 'reenviada',
    dataAcao: new Date('2024-01-10T10:15:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Reenvio solicitado pelo cliente'
  },
  {
    id: 'h4',
    cobrancaId: '1',
    acao: 'alerta_enviado',
    dataAcao: new Date('2024-01-20T16:45:00'),
    usuario: 'sistema@callistra.com',
    detalhes: 'Alerta automático de inadimplência enviado'
  },
  {
    id: 'h5',
    cobrancaId: '2',
    acao: 'criada',
    dataAcao: new Date('2024-01-25T11:20:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cobrança criada para cliente Maria Santos'
  },
  {
    id: 'h6',
    cobrancaId: '2',
    acao: 'enviada',
    dataAcao: new Date('2024-01-26T08:00:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cobrança enviada por e-mail para financeiro@mariasantos.com.br'
  },
  {
    id: 'h7',
    cobrancaId: '3',
    acao: 'criada',
    dataAcao: new Date('2023-12-20T15:30:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cobrança criada para honorários advocatícios'
  },
  {
    id: 'h8',
    cobrancaId: '3',
    acao: 'enviada',
    dataAcao: new Date('2023-12-21T09:00:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Primeira tentativa de cobrança enviada'
  },
  {
    id: 'h9',
    cobrancaId: '3',
    acao: 'reenviada',
    dataAcao: new Date('2024-01-05T14:20:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Reenvio após vencimento'
  },
  {
    id: 'h10',
    cobrancaId: '3',
    acao: 'bloqueado',
    dataAcao: new Date('2024-01-10T17:00:00'),
    usuario: 'admin@callistra.com',
    detalhes: 'Cliente bloqueado por atraso superior a 15 dias'
  }
]

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [clientes, setClientes] = useState<ClienteCobranca[]>([])
  const [historico, setHistorico] = useState<HistoricoCobranca[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasCobranca>({
    totalEmAberto: 0,
    totalVencido: 0,
    totalRecebido: 0,
    clientesBloqueados: 0,
    cobrancasEnviadas: 0,
    ticketMedio: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  // Calcular estatísticas sempre que cobrancas mudarem
  useEffect(() => {
    calcularEstatisticas()
  }, [cobrancas, clientes])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCobrancas(mockCobrancas)
      setClientes(mockClientes)
      setHistorico(mockHistorico)
      
      toast.success("Dados carregados com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = "Erro ao carregar dados de cobrança"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  const calcularEstatisticas = () => {
    const totalEmAberto = cobrancas
      .filter(c => ['pendente', 'enviada', 'vencida'].includes(c.status))
      .reduce((sum, c) => sum + c.valor, 0)
    
    const totalVencido = cobrancas
      .filter(c => c.status === 'vencida')
      .reduce((sum, c) => sum + c.valor, 0)
    
    const totalRecebido = cobrancas
      .filter(c => c.status === 'pago')
      .reduce((sum, c) => sum + c.valor, 0)
    
    const clientesBloqueados = clientes.filter(c => c.status === 'bloqueado').length
    const cobrancasEnviadas = cobrancas.filter(c => c.tentativasEnvio > 0).length
    const ticketMedio = cobrancas.length > 0 ? 
      cobrancas.reduce((sum, c) => sum + c.valor, 0) / cobrancas.length : 0

    setEstatisticas({
      totalEmAberto,
      totalVencido,
      totalRecebido,
      clientesBloqueados,
      cobrancasEnviadas,
      ticketMedio
    })
  }

  // AC1: Emitir boleto e link de pagamento
  const emitirCobranca = async (dados: EmissaoCobrancaForm) => {
    try {
      setLoading(true)
      setError(null)

      const cliente = clientes.find(c => c.id === dados.clienteId)
      if (!cliente) {
        throw new Error("Cliente não encontrado")
      }

      const novaCobranca: Cobranca = {
        id: Date.now().toString(),
        clienteId: dados.clienteId,
        clienteNome: cliente.nome,
        valor: dados.valor,
        dataVencimento: dados.dataVencimento,
        dataCriacao: new Date(),
        status: 'pendente',
        boleto: `BOL${Date.now()}`,
        linkPagamento: `https://pay.callistra.com/${Date.now()}`,
        tentativasEnvio: 0,
        diasAtraso: 0,
        observacoes: dados.observacoes
      }

      await new Promise(resolve => setTimeout(resolve, 1500))
      setCobrancas(prev => [...prev, novaCobranca])
      
      adicionarHistorico(novaCobranca.id, 'criada', 'Sistema automaticamente gerou boleto e link')

      toast.success("Cobrança emitida com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })

      return novaCobranca
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao emitir cobrança"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  // AC2: Enviar cobrança por e-mail e sistema
  const enviarCobranca = async (cobrancaId: string) => {
    try {
      setLoading(true)
      setError(null)

      const cobranca = cobrancas.find(c => c.id === cobrancaId)
      if (!cobranca) {
        throw new Error("Cobrança não encontrada")
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      setCobrancas(prev => prev.map(c => 
        c.id === cobrancaId 
          ? { 
              ...c, 
              status: 'enviada' as const,
              dataUltimoEnvio: new Date(),
              tentativasEnvio: c.tentativasEnvio + 1
            }
          : c
      ))

      adicionarHistorico(cobrancaId, 'enviada', `Cobrança enviada por e-mail para ${cobranca.clienteNome}`)

      toast.success("Cobrança enviada por e-mail e sistema!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao enviar cobrança"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC6: Reenviar cobrança
  const reenviarCobranca = async (cobrancaId: string) => {
    try {
      setLoading(true)
      setError(null)

      await new Promise(resolve => setTimeout(resolve, 1500))

      setCobrancas(prev => prev.map(c => 
        c.id === cobrancaId 
          ? { 
              ...c, 
              dataUltimoEnvio: new Date(),
              tentativasEnvio: c.tentativasEnvio + 1
            }
          : c
      ))

      adicionarHistorico(cobrancaId, 'reenviada', 'Cobrança reenviada a pedido do cliente')

      toast.success("Cobrança reenviada com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = "Erro ao reenviar cobrança"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC6: Atualizar status de pagamento
  const atualizarStatus = async (dados: AtualizacaoStatusForm) => {
    try {
      setLoading(true)
      setError(null)

      await new Promise(resolve => setTimeout(resolve, 1000))

      setCobrancas(prev => prev.map(c => 
        c.id === dados.cobrancaId 
          ? { ...c, status: dados.novoStatus, observacoes: dados.observacoes }
          : c
      ))

      const acao = dados.novoStatus === 'pago' ? 'pago' : 'alerta_enviado'
      adicionarHistorico(dados.cobrancaId, acao, dados.observacoes || 'Status atualizado manualmente')

      toast.success("Status atualizado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = "Erro ao atualizar status"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC4: Bloquear cliente após 15 dias
  const bloquearCliente = async (clienteId: string, motivo: string) => {
    try {
      setLoading(true)
      setError(null)

      await new Promise(resolve => setTimeout(resolve, 1000))

      setClientes(prev => prev.map(c => 
        c.id === clienteId 
          ? { 
              ...c, 
              status: 'bloqueado' as const,
              dataBloqueio: new Date(),
              motivoBloqueio: motivo,
              usuarioBloqueio: 'admin@callistra.com'
            }
          : c
      ))

      // Atualizar cobranças do cliente para status bloqueado
      setCobrancas(prev => prev.map(c => 
        c.clienteId === clienteId && c.status !== 'pago'
          ? { ...c, status: 'bloqueado' as const }
          : c
      ))

      const cobrancasCliente = cobrancas.filter(c => c.clienteId === clienteId)
      cobrancasCliente.forEach(cobranca => {
        adicionarHistorico(cobranca.id, 'bloqueado', motivo)
      })

      toast.success("Cliente bloqueado por inadimplência!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = "Erro ao bloquear cliente"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC4: Liberar cliente bloqueado (apenas administrador)
  const liberarCliente = async (dados: LiberacaoClienteForm) => {
    try {
      setLoading(true)
      setError(null)

      await new Promise(resolve => setTimeout(resolve, 1000))

      setClientes(prev => prev.map(c => 
        c.id === dados.clienteId 
          ? { 
              ...c, 
              status: 'liberado' as const,
              motivoBloqueio: undefined,
              dataBloqueio: undefined
            }
          : c
      ))

      const cobrancasCliente = cobrancas.filter(c => c.clienteId === dados.clienteId)
      cobrancasCliente.forEach(cobranca => {
        adicionarHistorico(cobranca.id, 'liberado', dados.motivo)
      })

      toast.success("Cliente liberado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (err) {
      const errorMsg = "Erro ao liberar cliente"
      setError(errorMsg)
      toast.error(errorMsg, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC5: Adicionar ao histórico
  const adicionarHistorico = (cobrancaId: string, acao: HistoricoCobranca['acao'], detalhes?: string) => {
    const novoHistorico: HistoricoCobranca = {
      id: Date.now().toString(),
      cobrancaId,
      acao,
      dataAcao: new Date(),
      usuario: 'admin@callistra.com',
      detalhes
    }
    
    setHistorico(prev => [...prev, novoHistorico])
  }

  // Filtrar cobranças
  const filtrarCobrancas = (filtros: FiltrosCobranca) => {
    return cobrancas.filter(cobranca => {
      if (filtros.status && cobranca.status !== filtros.status) return false
      if (filtros.clienteId && cobranca.clienteId !== filtros.clienteId) return false
      if (filtros.diasAtraso && cobranca.diasAtraso < filtros.diasAtraso) return false
      if (filtros.dataInicio && cobranca.dataCriacao < filtros.dataInicio) return false
      if (filtros.dataFim && cobranca.dataCriacao > filtros.dataFim) return false
      return true
    })
  }

  return {
    // Estado
    cobrancas,
    clientes,
    historico,
    estatisticas,
    loading,
    error,
    
    // Ações
    carregarDados,
    emitirCobranca,
    enviarCobranca,
    reenviarCobranca,
    atualizarStatus,
    bloquearCliente,
    liberarCliente,
    filtrarCobrancas,
  }
}
