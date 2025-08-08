import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type {
  Cobranca,
  Cliente,
  HistoricoCobranca,
  EstatisticasCobranca,
  FiltrosCobranca,
  NovaCobrancaForm,
  ReenvioCobrancaForm,
  AtualizarStatusForm,
  GerenciarClienteForm,
  ApiResponse
} from './types'

// Dados mockados para demonstração
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cpfCnpj: '123.456.789-00',
    status: 'inadimplente',
    totalPendente: 2500.00,
    diasAtrasoMaximo: 25,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 88888-8888',
    cpfCnpj: '987.654.321-00',
    status: 'bloqueado',
    dataBloqueio: new Date('2024-02-01'),
    motivoBloqueio: 'Atraso superior a 15 dias',
    totalPendente: 3200.00,
    diasAtrasoMaximo: 32,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos@email.com',
    telefone: '(11) 77777-7777',
    cpfCnpj: '111.222.333-44',
    status: 'ativo',
    totalPendente: 0,
    diasAtrasoMaximo: 0,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05')
  }
]

const mockCobrancas: Cobranca[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'João Silva',
    clienteEmail: 'joao@email.com',
    valor: 1500.00,
    dataVencimento: new Date('2024-01-15'),
    dataEmissao: new Date('2024-01-05'),
    status: 'vencida',
    tipo: 'boleto',
    urlBoleto: 'https://example.com/boleto/1',
    diasAtraso: 25,
    ultimoEnvio: new Date('2024-01-14'),
    tentativasEnvio: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '2',
    clienteId: '1',
    clienteNome: 'João Silva',
    clienteEmail: 'joao@email.com',
    valor: 1000.00,
    dataVencimento: new Date('2024-02-01'),
    dataEmissao: new Date('2024-01-20'),
    status: 'vencida',
    tipo: 'pix',
    chavePix: 'joao@email.com',
    diasAtraso: 9,
    ultimoEnvio: new Date('2024-01-31'),
    tentativasEnvio: 2,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    clienteId: '2',
    clienteNome: 'Maria Santos',
    clienteEmail: 'maria@email.com',
    valor: 3200.00,
    dataVencimento: new Date('2024-01-10'),
    dataEmissao: new Date('2023-12-30'),
    status: 'vencida',
    tipo: 'link_pagamento',
    linkPagamento: 'https://example.com/pagamento/3',
    diasAtraso: 32,
    ultimoEnvio: new Date('2024-01-09'),
    tentativasEnvio: 5,
    createdAt: new Date('2023-12-30'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    clienteId: '3',
    clienteNome: 'Carlos Oliveira',
    clienteEmail: 'carlos@email.com',
    valor: 800.00,
    dataVencimento: new Date('2024-02-15'),
    dataEmissao: new Date('2024-02-01'),
    status: 'paga',
    tipo: 'boleto',
    urlBoleto: 'https://example.com/boleto/4',
    diasAtraso: 0,
    ultimoEnvio: new Date('2024-02-14'),
    tentativasEnvio: 1,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  }
]

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [historico, setHistorico] = useState<HistoricoCobranca[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasCobranca | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCobrancas(mockCobrancas)
      setClientes(mockClientes)
      calcularEstatisticas(mockCobrancas)
      
      toast.success("Dados carregados com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao carregar dados"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [])

  const calcularEstatisticas = (cobrancasList: Cobranca[]) => {
    const stats: EstatisticasCobranca = {
      totalPendente: cobrancasList.filter(c => c.status === 'pendente').length,
      valorTotalPendente: cobrancasList
        .filter(c => c.status === 'pendente')
        .reduce((sum, c) => sum + c.valor, 0),
      totalVencidas: cobrancasList.filter(c => c.status === 'vencida').length,
      valorTotalVencido: cobrancasList
        .filter(c => c.status === 'vencida')
        .reduce((sum, c) => sum + c.valor, 0),
      totalPagas: cobrancasList.filter(c => c.status === 'paga').length,
      valorTotalPago: cobrancasList
        .filter(c => c.status === 'paga')
        .reduce((sum, c) => sum + c.valor, 0),
      clientesBloqueados: clientes.filter(c => c.status === 'bloqueado').length,
      cobrancasEnviadas: cobrancasList.filter(c => c.ultimoEnvio).length,
      taxaSucesso: (cobrancasList.filter(c => c.status === 'paga').length / cobrancasList.length) * 100,
      tempoMedioRecebimento: 7.5 // dias
    }
    setEstatisticas(stats)
  }

  // Cenário 1: Emitir boleto e link de pagamento
  const emitirCobranca = async (dados: NovaCobrancaForm): Promise<ApiResponse<Cobranca>> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const cliente = clientes.find(c => c.id === dados.clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado')
      }

      const novaCobranca: Cobranca = {
        id: Date.now().toString(),
        clienteId: dados.clienteId,
        clienteNome: cliente.nome,
        clienteEmail: cliente.email,
        valor: dados.valor,
        dataVencimento: dados.dataVencimento,
        dataEmissao: new Date(),
        status: 'pendente',
        tipo: dados.tipo,
        urlBoleto: dados.tipo === 'boleto' ? `https://example.com/boleto/${Date.now()}` : undefined,
        linkPagamento: dados.tipo === 'link_pagamento' ? `https://example.com/pagamento/${Date.now()}` : undefined,
        chavePix: dados.tipo === 'pix' ? cliente.email : undefined,
        observacoes: dados.observacoes,
        diasAtraso: 0,
        tentativasEnvio: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setCobrancas(prev => [novaCobranca, ...prev])
      
      // Registrar no histórico
      const novoHistorico: HistoricoCobranca = {
        id: Date.now().toString(),
        cobrancaId: novaCobranca.id,
        acao: 'emitida',
        detalhes: `Cobrança emitida - ${dados.tipo} no valor de R$ ${dados.valor.toFixed(2)}`,
        usuarioId: 'admin',
        usuarioNome: 'Administrador',
        dataAcao: new Date(),
        dadosAdicionais: { tipo: dados.tipo, valor: dados.valor }
      }
      setHistorico(prev => [novoHistorico, ...prev])

      toast.success("Cobrança emitida com sucesso!", { duration: 2000 })
      return { success: true, data: novaCobranca }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao emitir cobrança"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cenário 2: Enviar cobrança por e-mail e sistema
  const enviarCobranca = async (cobrancaId: string): Promise<ApiResponse<boolean>> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const cobranca = cobrancas.find(c => c.id === cobrancaId)
      if (!cobranca) {
        throw new Error('Cobrança não encontrada')
      }

      // Atualizar cobrança
      setCobrancas(prev => prev.map(c => 
        c.id === cobrancaId 
          ? { 
              ...c, 
              status: 'enviada' as const, 
              ultimoEnvio: new Date(),
              tentativasEnvio: c.tentativasEnvio + 1,
              updatedAt: new Date()
            }
          : c
      ))

      // Registrar no histórico
      const novoHistorico: HistoricoCobranca = {
        id: Date.now().toString(),
        cobrancaId,
        acao: 'enviada',
        detalhes: `Cobrança enviada por e-mail para ${cobranca.clienteEmail}`,
        usuarioId: 'admin',
        usuarioNome: 'Administrador',
        dataAcao: new Date(),
        dadosAdicionais: { email: cobranca.clienteEmail, tentativa: cobranca.tentativasEnvio + 1 }
      }
      setHistorico(prev => [novoHistorico, ...prev])

      toast.success("Cobrança enviada por e-mail e notificação no sistema!", { duration: 2000 })
      return { success: true, data: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao enviar cobrança"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cenário 3 & 4: Gerar alerta de inadimplência e confirmar pagamento
  const gerarAlertaInadimplencia = async (): Promise<ApiResponse<number>> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const cobrancasVencidas = cobrancas.filter(c => 
        c.status === 'vencida' && 
        new Date() > c.dataVencimento
      )

      // Simular envio de alertas
      for (const cobranca of cobrancasVencidas) {
        const novoHistorico: HistoricoCobranca = {
          id: `${Date.now()}-${Math.random()}`,
          cobrancaId: cobranca.id,
          acao: 'enviada',
          detalhes: `Alerta de inadimplência enviado - ${cobranca.diasAtraso} dias de atraso`,
          usuarioId: 'system',
          usuarioNome: 'Sistema Automático',
          dataAcao: new Date(),
          dadosAdicionais: { tipo: 'alerta_inadimplencia', diasAtraso: cobranca.diasAtraso }
        }
        setHistorico(prev => [novoHistorico, ...prev])
      }

      toast.info(`${cobrancasVencidas.length} alertas de inadimplência enviados`, { duration: 2500 })
      return { success: true, data: cobrancasVencidas.length }
    } catch (err) {
      const errorMessage = "Erro ao gerar alertas de inadimplência"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cenário 4: Confirmar pagamento recebido
  const confirmarPagamento = async (dados: AtualizarStatusForm): Promise<ApiResponse<boolean>> => {
    console.log('confirmarPagamento chamada com:', dados)
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const cobranca = cobrancas.find(c => c.id === dados.cobrancaId)
      console.log('Cobrança encontrada:', cobranca)
      if (!cobranca) {
        throw new Error('Cobrança não encontrada')
      }

      // Atualizar status da cobrança
      const cobrancasAtualizadas = cobrancas.map(c => 
        c.id === dados.cobrancaId 
          ? { 
              ...c, 
              status: dados.novoStatus,
              observacoes: dados.observacoes,
              updatedAt: new Date()
            }
          : c
      )
      setCobrancas(cobrancasAtualizadas)
      
      // Recalcular estatísticas
      calcularEstatisticas(cobrancasAtualizadas)

      // Registrar no histórico
      const novoHistorico: HistoricoCobranca = {
        id: Date.now().toString(),
        cobrancaId: dados.cobrancaId,
        acao: dados.novoStatus === 'paga' ? 'paga' : 'enviada',
        detalhes: dados.novoStatus === 'paga' 
          ? `Pagamento confirmado - R$ ${cobranca.valor.toFixed(2)}`
          : `Status atualizado para ${dados.novoStatus}`,
        usuarioId: 'admin',
        usuarioNome: 'Administrador',
        dataAcao: new Date(),
        dadosAdicionais: { 
          statusAnterior: cobranca.status, 
          novoStatus: dados.novoStatus,
          dataPagamento: dados.dataPagamento
        }
      }
      setHistorico(prev => [novoHistorico, ...prev])

      if (dados.novoStatus === 'paga') {
        toast.success("Pagamento confirmado! Alerta enviado ao cliente.", { duration: 2000 })
      } else {
        toast.success("Status da cobrança atualizado!", { duration: 2000 })
      }
      
      return { success: true, data: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar status"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cenário 5: Bloquear cliente inadimplente
  const bloquearCliente = async (dados: GerenciarClienteForm): Promise<ApiResponse<boolean>> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const cliente = clientes.find(c => c.id === dados.clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado')
      }

      if (dados.acao === 'bloquear') {
        // Verificar se tem atraso superior a 15 dias
        const cobrancasVencidas = cobrancas.filter(c => 
          c.clienteId === dados.clienteId && 
          c.status === 'vencida' && 
          c.diasAtraso > 15
        )

        if (cobrancasVencidas.length === 0) {
          throw new Error('Cliente não tem cobranças com atraso superior a 15 dias')
        }

        // Bloquear cliente
        setClientes(prev => prev.map(c => 
          c.id === dados.clienteId 
            ? { 
                ...c, 
                status: 'bloqueado' as const,
                dataBloqueio: new Date(),
                motivoBloqueio: dados.motivo,
                updatedAt: new Date()
              }
            : c
        ))

        toast.warning(`Cliente ${cliente.nome} bloqueado por atraso superior a 15 dias`, { duration: 2500 })
      } else {
        // Desbloquear cliente (apenas admin)
        setClientes(prev => prev.map(c => 
          c.id === dados.clienteId 
            ? { 
                ...c, 
                status: 'ativo' as const,
                dataBloqueio: undefined,
                motivoBloqueio: undefined,
                updatedAt: new Date()
              }
            : c
        ))

        toast.success(`Cliente ${cliente.nome} desbloqueado pelo administrador`, { duration: 2000 })
      }

      // Registrar no histórico
      const novoHistorico: HistoricoCobranca = {
        id: Date.now().toString(),
        cobrancaId: '',
        acao: dados.acao === 'bloquear' ? 'bloqueio' : 'desbloqueio',
        detalhes: `Cliente ${dados.acao === 'bloquear' ? 'bloqueado' : 'desbloqueado'}: ${dados.motivo}`,
        usuarioId: 'admin',
        usuarioNome: 'Administrador',
        dataAcao: new Date(),
        dadosAdicionais: { clienteId: dados.clienteId, motivo: dados.motivo }
      }
      setHistorico(prev => [novoHistorico, ...prev])

      return { success: true, data: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerenciar cliente"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Cenário 7: Reenviar cobrança
  const reenviarCobranca = async (dados: ReenvioCobrancaForm): Promise<ApiResponse<boolean>> => {
    setLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const cobranca = cobrancas.find(c => c.id === dados.cobrancaId)
      if (!cobranca) {
        throw new Error('Cobrança não encontrada')
      }

      // Atualizar tentativas de envio
      setCobrancas(prev => prev.map(c => 
        c.id === dados.cobrancaId 
          ? { 
              ...c, 
              ultimoEnvio: new Date(),
              tentativasEnvio: c.tentativasEnvio + 1,
              updatedAt: new Date()
            }
          : c
      ))

      // Registrar no histórico
      const novoHistorico: HistoricoCobranca = {
        id: Date.now().toString(),
        cobrancaId: dados.cobrancaId,
        acao: 'reenviada',
        detalhes: `Cobrança reenviada${dados.incluirWhatsapp ? ' (incluindo WhatsApp)' : ''}`,
        usuarioId: 'admin',
        usuarioNome: 'Administrador',
        dataAcao: new Date(),
        dadosAdicionais: { 
          incluirWhatsapp: dados.incluirWhatsapp,
          mensagemPersonalizada: dados.mensagemPersonalizada,
          tentativa: cobranca.tentativasEnvio + 1
        }
      }
      setHistorico(prev => [novoHistorico, ...prev])

      const canais = dados.incluirWhatsapp ? 'e-mail e WhatsApp' : 'e-mail'
      toast.success(`Cobrança reenviada por ${canais}!`, { duration: 2000 })
      
      return { success: true, data: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao reenviar cobrança"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Filtrar cobranças
  const filtrarCobrancas = (filtros: FiltrosCobranca): Cobranca[] => {
    let resultado = [...cobrancas]

    if (filtros.status?.length) {
      resultado = resultado.filter(c => filtros.status!.includes(c.status))
    }

    if (filtros.cliente) {
      const termo = filtros.cliente.toLowerCase()
      resultado = resultado.filter(c => 
        c.clienteNome.toLowerCase().includes(termo) ||
        c.clienteEmail.toLowerCase().includes(termo)
      )
    }

    if (filtros.dataInicio) {
      resultado = resultado.filter(c => c.dataVencimento >= filtros.dataInicio!)
    }

    if (filtros.dataFim) {
      resultado = resultado.filter(c => c.dataVencimento <= filtros.dataFim!)
    }

    if (filtros.valorMinimo !== undefined) {
      resultado = resultado.filter(c => c.valor >= filtros.valorMinimo!)
    }

    if (filtros.valorMaximo !== undefined) {
      resultado = resultado.filter(c => c.valor <= filtros.valorMaximo!)
    }

    if (filtros.diasAtrasoMinimo !== undefined) {
      resultado = resultado.filter(c => c.diasAtraso >= filtros.diasAtrasoMinimo!)
    }

    if (filtros.tipo?.length) {
      resultado = resultado.filter(c => filtros.tipo!.includes(c.tipo))
    }

    // Ordenação
    if (filtros.ordenarPor) {
      resultado.sort((a, b) => {
        let aVal: any, bVal: any
        
        switch (filtros.ordenarPor) {
          case 'dataVencimento':
            aVal = a.dataVencimento.getTime()
            bVal = b.dataVencimento.getTime()
            break
          case 'valor':
            aVal = a.valor
            bVal = b.valor
            break
          case 'diasAtraso':
            aVal = a.diasAtraso
            bVal = b.diasAtraso
            break
          case 'cliente':
            aVal = a.clienteNome.toLowerCase()
            bVal = b.clienteNome.toLowerCase()
            break
          default:
            return 0
        }

        if (filtros.ordem === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        }
      })
    }

    return resultado
  }

  return {
    // Estados
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
    gerarAlertaInadimplencia,
    confirmarPagamento,
    bloquearCliente,
    reenviarCobranca,
    filtrarCobrancas,

    // Utilidades
    calcularEstatisticas
  }
}
