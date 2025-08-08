"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { 
  CobrancaEmAtraso,
  ClienteInadimplente,
  DashboardInadimplencia,
  EmitirBoleto,
  EnviarCobranca,
  ConfirmarPagamento,
  LiberarCliente,
  FiltrosCobrancasAtraso,
  AlertaInadimplencia
} from "./types"

// Mock data específico para COBRANÇAS EM ATRASO
const mockCobrancasEmAtraso: CobrancaEmAtraso[] = [
  {
    id: "cob001",
    clienteId: "cli001",
    clienteNome: "Silva & Associados Ltda",
    clienteEmail: "financeiro@silvaassociados.com.br",
    clienteTelefone: "(11) 99999-9999",
    contratoOriginal: "CONT-2024-001",
    valorOriginal: 2500.00,
    valorAtualizado: 2750.00, // Com juros e multa
    dataVencimentoOriginal: new Date("2024-01-15"),
    dataUltimoEnvio: new Date("2024-01-20"),
    diasAtraso: 15,
    status: "cobranca_enviada",
    
    boletoAtualizado: {
      codigo: "23793.38286.64428.000012.47000",
      linkPagamento: "https://pagamento.banco.com.br/boleto/cob001",
      dataGeracao: new Date("2024-01-20")
    },
    
    alertasEnviados: [
      {
        id: "alert001",
        tipo: "primeira_cobranca",
        dataEnvio: new Date("2024-01-16"),
        destinatarios: ["financeiro@silvaassociados.com.br"],
        canalEnvio: "ambos",
        conteudo: "Primeira cobrança de inadimplência",
        entregue: true
      },
      {
        id: "alert002", 
        tipo: "segunda_cobranca",
        dataEnvio: new Date("2024-01-20"),
        destinatarios: ["financeiro@silvaassociados.com.br"],
        canalEnvio: "email",
        conteudo: "Segunda tentativa de cobrança",
        entregue: true
      }
    ],
    
    historicoAcoes: [
      {
        id: "hist001",
        data: new Date("2024-01-16"),
        acao: "cobranca_identificada",
        usuario: "Sistema",
        detalhes: "Cobrança identificada automaticamente como vencida",
        automatica: true
      },
      {
        id: "hist002",
        data: new Date("2024-01-16"),
        acao: "boleto_gerado",
        usuario: "Sistema", 
        detalhes: "Boleto atualizado gerado automaticamente",
        automatica: true
      },
      {
        id: "hist003",
        data: new Date("2024-01-16"),
        acao: "envio_automatico",
        usuario: "Sistema",
        detalhes: "Primeira cobrança enviada automaticamente",
        automatica: true
      }
    ],
    
    clienteBloqueado: false,
    
    lancamentoFinanceiro: {
      id: "lanc001",
      contaReceberOriginal: "CR-2024-001",
      situacao: "pendente"
    }
  },
  
  {
    id: "cob002",
    clienteId: "cli002", 
    clienteNome: "Empresa ABC Ltda",
    clienteEmail: "contato@empresaabc.com.br",
    contratoOriginal: "CONT-2023-045",
    valorOriginal: 5000.00,
    valorAtualizado: 5800.00,
    dataVencimentoOriginal: new Date("2023-12-20"),
    dataUltimoEnvio: new Date("2024-01-10"),
    diasAtraso: 40,
    status: "bloqueada",
    
    boletoAtualizado: {
      codigo: "23793.38286.64428.000013.48000", 
      linkPagamento: "https://pagamento.banco.com.br/boleto/cob002",
      dataGeracao: new Date("2024-01-10")
    },
    
    alertasEnviados: [
      {
        id: "alert003",
        tipo: "primeira_cobranca",
        dataEnvio: new Date("2023-12-21"),
        destinatarios: ["contato@empresaabc.com.br"],
        canalEnvio: "ambos",
        conteudo: "Primeira cobrança de inadimplência",
        entregue: true
      },
      {
        id: "alert004",
        tipo: "cliente_bloqueado",
        dataEnvio: new Date("2024-01-05"),
        destinatarios: ["contato@empresaabc.com.br"],
        canalEnvio: "ambos", 
        conteudo: "Cliente bloqueado por inadimplência superior a 15 dias",
        entregue: true
      }
    ],
    
    historicoAcoes: [
      {
        id: "hist004",
        data: new Date("2023-12-21"),
        acao: "cobranca_identificada",
        usuario: "Sistema",
        detalhes: "Cobrança vencida identificada automaticamente",
        automatica: true
      },
      {
        id: "hist005",
        data: new Date("2024-01-05"),
        acao: "cliente_bloqueado",
        usuario: "Sistema",
        detalhes: "Cliente bloqueado automaticamente por atraso superior a 15 dias",
        automatica: true
      }
    ],
    
    clienteBloqueado: true,
    motivoBloqueio: "Inadimplência superior a 15 dias",
    dataBloqueio: new Date("2024-01-05"),
    
    lancamentoFinanceiro: {
      id: "lanc002",
      contaReceberOriginal: "CR-2023-045", 
      situacao: "pendente"
    }
  },
  
  {
    id: "cob003",
    clienteId: "cli003",
    clienteNome: "João da Silva Advogados",
    clienteEmail: "joao@silvaadvogados.com.br",
    contratoOriginal: "CONT-2024-012",
    valorOriginal: 1200.00,
    valorAtualizado: 1260.00,
    dataVencimentoOriginal: new Date("2024-01-25"),
    diasAtraso: 5,
    status: "vencida",
    
    alertasEnviados: [],
    
    historicoAcoes: [
      {
        id: "hist006",
        data: new Date("2024-01-26"),
        acao: "cobranca_identificada", 
        usuario: "Sistema",
        detalhes: "Cobrança vencida identificada pelo sistema automático",
        automatica: true
      }
    ],
    
    clienteBloqueado: false,
    
    lancamentoFinanceiro: {
      id: "lanc003",
      contaReceberOriginal: "CR-2024-012",
      situacao: "pendente"
    }
  }
]

interface CobrancasAtrasoState {
  cobrancasEmAtraso: CobrancaEmAtraso[]
  clientesInadimplentes: ClienteInadimplente[]
  dashboardData: DashboardInadimplencia | null
  loading: boolean
  error: string | null
  filtros: FiltrosCobrancasAtraso
}

export function useCobrancasAtraso() {
  const [state, setState] = useState<CobrancasAtrasoState>({
    cobrancasEmAtraso: [],
    clientesInadimplentes: [],
    dashboardData: null,
    loading: true,
    error: null,
    filtros: {}
  })

  // Carregar dados de cobranças em atraso
  const loadCobrancasAtraso = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Calcular dashboard específico para inadimplência
      const dashboardData: DashboardInadimplencia = {
        resumoGeral: {
          totalCobrancasVencidas: mockCobrancasEmAtraso.length,
          valorTotalVencido: mockCobrancasEmAtraso.reduce((sum, c) => sum + c.valorAtualizado, 0),
          clientesInadimplentes: new Set(mockCobrancasEmAtraso.map(c => c.clienteId)).size,
          clientesBloqueados: mockCobrancasEmAtraso.filter(c => c.clienteBloqueado).length,
          taxaRecuperacao: 15.5 // Mock: % de cobranças pagas após vencimento
        },
        
        alertasAutomaticos: {
          cobranças0a15dias: mockCobrancasEmAtraso.filter(c => c.diasAtraso <= 15).length,
          cobrancas15dias: mockCobrancasEmAtraso.filter(c => c.diasAtraso >= 15 && !c.clienteBloqueado).length,
          alertasEnviados24h: 3,
          sucessoEntrega: 95
        },
        
        acoesPendentes: {
          geracaoBoletos: mockCobrancasEmAtraso.filter(c => !c.boletoAtualizado).length,
          enviosPendentes: mockCobrancasEmAtraso.filter(c => c.status === "vencida").length,
          confirmacoesPagamento: 2,
          liberacoesPendentes: mockCobrancasEmAtraso.filter(c => c.clienteBloqueado).length
        },
        
        integracaoFinanceira: {
          lancamentosAtualizados: mockCobrancasEmAtraso.filter(c => c.lancamentoFinanceiro?.situacao === "pendente").length,
          divergenciasDetectadas: 1,
          ultimaSincronizacao: new Date()
        }
      }

      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: mockCobrancasEmAtraso,
        dashboardData,
        loading: false
      }))
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Erro ao carregar cobranças em atraso",
        loading: false
      }))
      toast.error("Erro ao carregar dados", { duration: 3000 })
    }
  }, [])

  // Emitir boleto para cobrança em atraso (Cenário 1)
  const emitirBoleto = useCallback(async (cobrancaId: string, data: EmitirBoleto) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          c.id === cobrancaId 
            ? {
                ...c,
                boletoAtualizado: {
                  codigo: "23793.38286." + Math.random().toString().substr(2, 10),
                  linkPagamento: `https://pagamento.banco.com.br/boleto/${cobrancaId}`,
                  dataGeracao: new Date()
                },
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "boleto_gerado",
                    usuario: "Admin",
                    detalhes: "Boleto gerado manualmente para cobrança em atraso",
                    automatica: false
                  }
                ]
              }
            : c
        ),
        loading: false
      }))

      toast.success("Boleto gerado com sucesso!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao gerar boleto", { duration: 3000 })
    }
  }, [])

  // Enviar cobrança por email e sistema (Cenário 2)
  const enviarCobranca = useCallback(async (cobrancaIds: string[], tipoEnvio: "email" | "sistema" | "ambos") => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          cobrancaIds.includes(c.id)
            ? {
                ...c,
                status: "cobranca_enviada" as const,
                dataUltimoEnvio: new Date(),
                alertasEnviados: [
                  ...c.alertasEnviados,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    tipo: c.alertasEnviados.length === 0 ? "primeira_cobranca" : "segunda_cobranca",
                    dataEnvio: new Date(),
                    destinatarios: [c.clienteEmail],
                    canalEnvio: tipoEnvio,
                    conteudo: `Cobrança enviada via ${tipoEnvio}`,
                    entregue: true
                  }
                ],
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "envio_automatico",
                    usuario: "Admin",
                    detalhes: `Cobrança enviada via ${tipoEnvio}`,
                    automatica: false
                  }
                ]
              }
            : c
        ),
        loading: false
      }))

      toast.success(`Cobrança(s) enviada(s) via ${tipoEnvio}!`, { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao enviar cobrança", { duration: 3000 })
    }
  }, [])

  // Confirmar pagamento recebido (Cenário 4)  
  const confirmarPagamento = useCallback(async (cobrancaId: string, dadosPagamento: ConfirmarPagamento) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          c.id === cobrancaId
            ? {
                ...c,
                status: "pago" as const,
                alertasEnviados: [
                  ...c.alertasEnviados,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    tipo: "pagamento_confirmado",
                    dataEnvio: new Date(),
                    destinatarios: [c.clienteEmail],
                    canalEnvio: "ambos",
                    conteudo: "Pagamento confirmado e cobrança quitada",
                    entregue: true
                  }
                ],
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "pagamento_confirmado",
                    usuario: "Admin",
                    detalhes: `Pagamento confirmado: ${dadosPagamento.formaPagamento} - R$ ${dadosPagamento.valorPago}`,
                    automatica: false
                  }
                ],
                lancamentoFinanceiro: {
                  ...c.lancamentoFinanceiro!,
                  situacao: "baixado"
                }
              }
            : c
        ),
        loading: false
      }))

      toast.success("Pagamento confirmado com sucesso!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao confirmar pagamento", { duration: 3000 })
    }
  }, [])

  // Bloquear cliente inadimplente automaticamente (Cenário 5)
  const bloquearClienteAutomatico = useCallback(async (clienteId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          c.clienteId === clienteId
            ? {
                ...c,
                clienteBloqueado: true,
                motivoBloqueio: "Inadimplência superior a 15 dias",
                dataBloqueio: new Date(),
                status: "bloqueada" as const,
                alertasEnviados: [
                  ...c.alertasEnviados,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    tipo: "cliente_bloqueado",
                    dataEnvio: new Date(),
                    destinatarios: [c.clienteEmail],
                    canalEnvio: "ambos",
                    conteudo: "Cliente bloqueado por inadimplência superior a 15 dias",
                    entregue: true
                  }
                ],
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "cliente_bloqueado",
                    usuario: "Sistema",
                    detalhes: "Cliente bloqueado automaticamente por atraso superior a 15 dias",
                    automatica: true
                  }
                ]
              }
            : c
        ),
        loading: false
      }))

      toast.success("Cliente bloqueado automaticamente!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao bloquear cliente", { duration: 3000 })
    }
  }, [])

  // Liberar cliente bloqueado por admin (Cenário 6)
  const liberarCliente = useCallback(async (clienteId: string, dadosLiberacao: LiberarCliente) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          c.clienteId === clienteId
            ? {
                ...c,
                clienteBloqueado: false,
                motivoBloqueio: undefined,
                dataBloqueio: undefined,
                status: c.status === "bloqueada" ? "cobranca_enviada" : c.status,
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "cliente_liberado",
                    usuario: "Admin",
                    detalhes: `Cliente liberado por administrador. Motivo: ${dadosLiberacao.motivo}`,
                    automatica: false
                  }
                ]
              }
            : c
        ),
        loading: false
      }))

      toast.success("Cliente liberado com sucesso!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao liberar cliente", { duration: 3000 })
    }
  }, [])

  // Reenviar cobrança (Cenário 7)
  const reenviarCobranca = useCallback(async (cobrancaId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 600))
      
      setState(prev => ({
        ...prev,
        cobrancasEmAtraso: prev.cobrancasEmAtraso.map(c => 
          c.id === cobrancaId
            ? {
                ...c,
                dataUltimoEnvio: new Date(),
                alertasEnviados: [
                  ...c.alertasEnviados,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    tipo: "segunda_cobranca",
                    dataEnvio: new Date(),
                    destinatarios: [c.clienteEmail],
                    canalEnvio: "ambos",
                    conteudo: "Cobrança reenviada por solicitação",
                    entregue: true
                  }
                ],
                historicoAcoes: [
                  ...c.historicoAcoes,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    data: new Date(),
                    acao: "reenvio_manual",
                    usuario: "Admin",
                    detalhes: "Cobrança reenviada manualmente",
                    automatica: false
                  }
                ]
              }
            : c
        ),
        loading: false
      }))

      toast.success("Cobrança reenviada com sucesso!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro ao reenviar cobrança", { duration: 3000 })
    }
  }, [])

  // Sincronizar com contas a receber (Cenário 10)
  const sincronizarContasReceber = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setState(prev => ({
        ...prev,
        dashboardData: prev.dashboardData ? {
          ...prev.dashboardData,
          integracaoFinanceira: {
            ...prev.dashboardData.integracaoFinanceira,
            ultimaSincronizacao: new Date(),
            divergenciasDetectadas: 0
          }
        } : null,
        loading: false
      }))

      toast.success("Sincronização com contas a receber concluída!", { duration: 2000 })

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
      toast.error("Erro na sincronização", { duration: 3000 })
    }
  }, [])

  // Aplicar filtros
  const aplicarFiltros = useCallback((filtros: FiltrosCobrancasAtraso) => {
    setState(prev => ({ ...prev, filtros }))
  }, [])

  // Carregar dados iniciais
  useEffect(() => {
    loadCobrancasAtraso()
  }, [loadCobrancasAtraso])

  // Filtrar cobranças baseado nos filtros
  const cobrancasFiltradas = state.cobrancasEmAtraso.filter(cobranca => {
    const { status, diasAtraso, valorMin, valorMax, clienteBloqueado } = state.filtros

    if (status && status !== "todas" && cobranca.status !== status) {
      return false
    }

    if (diasAtraso && diasAtraso !== "todos") {
      const dias = cobranca.diasAtraso
      switch (diasAtraso) {
        case "0-15":
          if (dias > 15) return false
          break
        case "15-30":
          if (dias <= 15 || dias > 30) return false
          break
        case "30-60":
          if (dias <= 30 || dias > 60) return false
          break
        case "60+":
          if (dias <= 60) return false
          break
      }
    }

    if (valorMin && cobranca.valorAtualizado < valorMin) {
      return false
    }

    if (valorMax && cobranca.valorAtualizado > valorMax) {
      return false
    }

    if (clienteBloqueado && clienteBloqueado !== "todos") {
      if (clienteBloqueado === "bloqueados" && !cobranca.clienteBloqueado) return false
      if (clienteBloqueado === "nao_bloqueados" && cobranca.clienteBloqueado) return false
    }

    return true
  })

  return {
    ...state,
    cobrancasFiltradas,
    actions: {
      loadCobrancasAtraso,
      emitirBoleto,
      enviarCobranca,
      confirmarPagamento,
      bloquearClienteAutomatico,
      liberarCliente,
      reenviarCobranca,
      sincronizarContasReceber,
      aplicarFiltros
    }
  }
}