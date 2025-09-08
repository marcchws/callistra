import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { 
  Balancete, 
  FiltrosBalancete, 
  generateMockBalancete,
  generateEvolucaoMensal,
  EvolucaoFinanceira,
  ExportOptions
} from './types'

export function useBalancete() {
  const [balancete, setBalancete] = useState<Balancete | null>(null)
  const [evolucaoMensal, setEvolucaoMensal] = useState<EvolucaoFinanceira[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosBalancete>({})
  const [exportando, setExportando] = useState(false)

  // Simula carregamento inicial dos dados
  const carregarBalancete = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Gera dados mock baseados nos filtros
      const dadosBalancete = generateMockBalancete()
      const dadosEvolucao = generateEvolucaoMensal()
      
      // Aplica filtros se existirem
      if (filtros.clienteId) {
        // Filtra dados por cliente
        const clienteFiltrado = dadosBalancete.detalhamento.porCliente.find(
          c => c.id === filtros.clienteId
        )
        if (clienteFiltrado) {
          dadosBalancete.financeiro.ganhos = clienteFiltrado.receitas
          dadosBalancete.financeiro.despesas = clienteFiltrado.despesas
          dadosBalancete.financeiro.inadimplencia.valor = clienteFiltrado.inadimplencia
        }
      }
      
      if (filtros.tipoServico && filtros.tipoServico !== 'todos') {
        // Filtra dados por tipo de serviço
        const servicoFiltrado = dadosBalancete.detalhamento.porTipoServico.find(
          s => s.tipo === filtros.tipoServico
        )
        if (servicoFiltrado) {
          dadosBalancete.financeiro.ganhos = servicoFiltrado.receitas
          dadosBalancete.financeiro.despesas = servicoFiltrado.despesas
          dadosBalancete.totalProcessos.total = servicoFiltrado.quantidade
        }
      }
      
      if (filtros.dataInicio && filtros.dataFim) {
        // Ajusta período de referência
        dadosBalancete.dataReferencia.inicio = filtros.dataInicio
        dadosBalancete.dataReferencia.fim = filtros.dataFim
        dadosBalancete.dataReferencia.periodo = 'personalizado'
      }
      
      setBalancete(dadosBalancete)
      setEvolucaoMensal(dadosEvolucao)
      
    } catch (err) {
      setError('Erro ao carregar dados do balancete')
      toast.error('Erro ao carregar dados do balancete', {
        duration: 3000,
        position: 'bottom-right'
      })
    } finally {
      setLoading(false)
    }
  }, [filtros])

  // Função para aplicar filtros
  const aplicarFiltros = useCallback((novosFiltros: FiltrosBalancete) => {
    setFiltros(novosFiltros)
  }, [])

  // Função para limpar filtros
  const limparFiltros = useCallback(() => {
    setFiltros({})
  }, [])

  // Função para exportar relatório
  const exportarRelatorio = useCallback(async (opcoes: ExportOptions) => {
    if (!balancete) {
      toast.error('Nenhum dado para exportar', {
        duration: 2000,
        position: 'bottom-right'
      })
      return
    }

    setExportando(true)
    
    try {
      // Simula processo de exportação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (opcoes.formato === 'pdf') {
        // Simula download de PDF
        const blob = new Blob(['PDF Content'], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `balancete_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Relatório PDF exportado com sucesso!', {
          duration: 2000,
          position: 'bottom-right'
        })
      } else if (opcoes.formato === 'csv') {
        // Simula download de CSV
        const csvContent = generateCSVContent(balancete)
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `balancete_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Relatório CSV exportado com sucesso!', {
          duration: 2000,
          position: 'bottom-right'
        })
      }
    } catch (err) {
      toast.error('Erro ao exportar relatório', {
        duration: 3000,
        position: 'bottom-right'
      })
    } finally {
      setExportando(false)
    }
  }, [balancete])

  // Função para atualizar dados em tempo real
  const atualizarDados = useCallback(async () => {
    if (loading) return
    
    toast.info('Atualizando dados...', {
      duration: 1000,
      position: 'bottom-right'
    })
    
    await carregarBalancete()
    
    toast.success('Dados atualizados com sucesso!', {
      duration: 2000,
      position: 'bottom-right'
    })
  }, [loading, carregarBalancete])

  // Carrega dados iniciais
  useEffect(() => {
    carregarBalancete()
  }, [carregarBalancete])

  // Simula atualização em tempo real (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !exportando) {
        carregarBalancete()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading, exportando, carregarBalancete])

  return {
    balancete,
    evolucaoMensal,
    loading,
    error,
    filtros,
    exportando,
    aplicarFiltros,
    limparFiltros,
    exportarRelatorio,
    atualizarDados
  }
}

// Função auxiliar para gerar conteúdo CSV
function generateCSVContent(balancete: Balancete): string {
  const lines: string[] = []
  
  // Cabeçalho
  lines.push('RELATÓRIO DE BALANCETE')
  lines.push(`Período: ${balancete.dataReferencia.inicio.toLocaleDateString('pt-BR')} a ${balancete.dataReferencia.fim.toLocaleDateString('pt-BR')}`)
  lines.push('')
  
  // Resumo Financeiro
  lines.push('RESUMO FINANCEIRO')
  lines.push('Tipo,Valor')
  lines.push(`Ganhos Totais,R$ ${balancete.financeiro.ganhos.toLocaleString('pt-BR')}`)
  lines.push(`Honorários,R$ ${balancete.financeiro.honorarios.toLocaleString('pt-BR')}`)
  lines.push(`Despesas,R$ ${balancete.financeiro.despesas.toLocaleString('pt-BR')}`)
  lines.push(`Custas Processuais,R$ ${balancete.financeiro.custasProcessuais.toLocaleString('pt-BR')}`)
  lines.push(`Faturamento,R$ ${balancete.financeiro.faturamento.toLocaleString('pt-BR')}`)
  lines.push(`Inadimplência,R$ ${balancete.financeiro.inadimplencia.valor.toLocaleString('pt-BR')} (${balancete.financeiro.inadimplencia.percentual}%)`)
  lines.push('')
  
  // Indicadores
  lines.push('INDICADORES DE PERFORMANCE')
  lines.push('Indicador,Valor')
  lines.push(`ROI,${balancete.indicadores.roi}%`)
  lines.push(`Ticket Médio,R$ ${balancete.indicadores.ticketMedio.toLocaleString('pt-BR')}`)
  lines.push(`Tempo Médio de Pagamento,${balancete.indicadores.tempoMedioPagamento} dias`)
  lines.push(`Taxa de Inadimplência,${balancete.indicadores.taxaInadimplencia}%`)
  lines.push(`Conversão de Casos,${balancete.indicadores.conversaoCasos}%`)
  lines.push(`Retenção de Clientes,${balancete.indicadores.retencaoClientes}%`)
  lines.push('')
  
  // Detalhamento por Cliente
  lines.push('DETALHAMENTO POR CLIENTE')
  lines.push('Cliente,Processos,Receitas,Despesas,Inadimplência,Status')
  balancete.detalhamento.porCliente.forEach(cliente => {
    lines.push(
      `${cliente.nome},${cliente.totalProcessos},R$ ${cliente.receitas.toLocaleString('pt-BR')},R$ ${cliente.despesas.toLocaleString('pt-BR')},R$ ${cliente.inadimplencia.toLocaleString('pt-BR')},${cliente.status}`
    )
  })
  lines.push('')
  
  // Detalhamento por Tipo de Serviço
  lines.push('DETALHAMENTO POR TIPO DE SERVIÇO')
  lines.push('Tipo,Quantidade,Receitas,Despesas,Lucro')
  balancete.detalhamento.porTipoServico.forEach(servico => {
    lines.push(
      `${servico.label},${servico.quantidade},R$ ${servico.receitas.toLocaleString('pt-BR')},R$ ${servico.despesas.toLocaleString('pt-BR')},R$ ${servico.lucro.toLocaleString('pt-BR')}`
    )
  })
  
  return lines.join('\n')
}
