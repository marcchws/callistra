"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Settings, AlertTriangle, Activity } from "lucide-react"
import { useCobrancasAtraso } from "./use-cobrancas"
import { DashboardInadimplencia } from "./components/cobrancas-dashboard"
import { CobrancasAtrasoTable } from "./components/cobrancas-table"
import { CobrancaHistoricoDialog } from "./components/cobranca-details"
import { ConfirmarPagamentoDialog } from "./components/confirmar-pagamento-dialog"
import type { CobrancaEmAtraso, EmitirBoleto, ConfirmarPagamento, LiberarCliente } from "./types"
import { toast } from "sonner"

export default function CobrancasAtrasoPage() {
  const {
    cobrancasFiltradas,
    dashboardData,
    loading,
    error,
    actions
  } = useCobrancasAtraso()

  const [viewingCobranca, setViewingCobranca] = useState<CobrancaEmAtraso | null>(null)
  const [confirmarPagamentoData, setConfirmarPagamentoData] = useState<{
    open: boolean
    cobranca: {
      id: string
      clienteNome: string
      valorAtualizado: number
      contratoOriginal: string
    } | null
  }>({ open: false, cobranca: null })

  // Handlers para ações específicas de cobranças em atraso

  // Cenário 1: Emitir boleto para cliente inadimplente
  const handleEmitirBoleto = (cobrancaId: string) => {
    const cobranca = cobrancasFiltradas.find(c => c.id === cobrancaId)
    if (!cobranca) return

    const dadosEmissao: EmitirBoleto = {
      cobrancaId,
      incluirJurosMulta: true,
      observacoes: "Boleto gerado para cobrança em atraso"
    }

    actions.emitirBoleto(cobrancaId, dadosEmissao)
  }

  // Cenário 2: Enviar cobrança por email e sistema
  const handleEnviarCobrancas = (cobrancaIds: string[]) => {
    actions.enviarCobranca(cobrancaIds, "ambos")
  }

  // Cenário 4: Confirmar pagamento recebido  
  const handleAbrirConfirmarPagamento = (cobrancaId: string) => {
    const cobranca = cobrancasFiltradas.find(c => c.id === cobrancaId)
    if (!cobranca) return

    setConfirmarPagamentoData({
      open: true,
      cobranca: {
        id: cobranca.id,
        clienteNome: cobranca.clienteNome,
        valorAtualizado: cobranca.valorAtualizado,
        contratoOriginal: cobranca.contratoOriginal
      }
    })
  }

  const handleConfirmarPagamento = (cobrancaId: string, dados: ConfirmarPagamento) => {
    actions.confirmarPagamento(cobrancaId, dados)
    setConfirmarPagamentoData({ open: false, cobranca: null })
  }

  // Cenário 5: Bloquear cliente inadimplente (automático >15 dias)
  const handleBloquearCliente = (clienteId: string) => {
    actions.bloquearClienteAutomatico(clienteId)
  }

  // Cenário 6: Liberar cliente bloqueado por admin
  const handleLiberarCliente = (clienteId: string) => {
    const dadosLiberacao: LiberarCliente = {
      clienteId,
      motivo: "Liberação autorizada por administrador",
      liberarTodasCobrancas: false,
      condicoes: "Cliente regularizou situação"
    }

    actions.liberarCliente(clienteId, dadosLiberacao)
  }

  // Cenário 7: Reenviar cobrança
  const handleReenviar = (cobrancaId: string) => {
    actions.reenviarCobranca(cobrancaId)
  }

  // Cenário 8: Ver histórico de cobranças
  const handleVerHistorico = (cobranca: CobrancaEmAtraso) => {
    setViewingCobranca(cobranca)
  }

  // Ações automáticas do dashboard
  const handleExecutarAcaoAutomatica = (acao: string) => {
    switch (acao) {
      case "processar_alertas":
        toast.info("Processando alertas automáticos...", { duration: 2000 })
        // Implementar processamento de alertas
        break
      case "gerar_boletos":
        toast.info("Gerando boletos para cobranças em atraso...", { duration: 2000 })
        // Implementar geração em lote
        break
      case "enviar_cobrancas":
        toast.info("Enviando cobranças pendentes...", { duration: 2000 })
        // Implementar envio em lote
        break
      case "sincronizar_financeiro":
        actions.sincronizarContasReceber()
        break
      default:
        toast.info(`Executando ação: ${acao}`, { duration: 2000 })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation Pattern - seguindo callistra-patterns.md */}
      <div className="flex">
        <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold text-slate-700">Callistra</h2>
          </div>
          <nav className="p-4 space-y-2">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Sistema
              </h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-700 hover:bg-slate-100"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-700 hover:bg-slate-100"
              >
                <Activity className="mr-2 h-4 w-4" />
                Alertas e Notificações
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-700 hover:bg-slate-100 bg-slate-100"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Cobranças em Atraso
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-700 hover:bg-slate-100"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </nav>
        </aside>
        
        {/* Main Content Pattern - seguindo callistra-patterns.md */}
        <main className="flex-1">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-6">
              <div className="flex items-center gap-4">
                {/* Breadcrumbs sempre visível - seguindo callistra-patterns.md */}
                <nav className="flex items-center space-x-2 text-sm text-slate-500">
                  <span>Sistema</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Infraestrutura</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-slate-800 font-medium">Cobranças em Atraso</span>
                </nav>
              </div>
            </div>
          </header>
          
          <div className="container py-6">
            <div className="space-y-6">
              {/* Page Title Pattern - seguindo callistra-patterns.md */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                      Gerenciamento de Cobranças em Atraso
                    </h1>
                    <p className="text-muted-foreground">
                      Centralize e automatize a emissão de boletos, envio de cobranças e controle de inadimplência
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleExecutarAcaoAutomatica("processar_alertas")} 
                      className="gap-2"
                    >
                      <Activity className="h-4 w-4" />
                      Processar Alertas
                    </Button>
                    <Button 
                      onClick={() => actions.sincronizarContasReceber()} 
                      className="gap-2 bg-slate-600 hover:bg-slate-700"
                    >
                      <Settings className="h-4 w-4" />
                      Sincronizar Financeiro
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Content Area - seguindo callistra-patterns.md */}
              <div className="space-y-6">
                {error && (
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Dashboard de Inadimplência */}
                <DashboardInadimplencia 
                  data={dashboardData} 
                  loading={loading}
                  onExecutarAcaoAutomatica={handleExecutarAcaoAutomatica}
                />
                
                {/* Tabela de Cobranças em Atraso */}
                <CobrancasAtrasoTable
                  cobrancas={cobrancasFiltradas}
                  loading={loading}
                  onEmitirBoleto={handleEmitirBoleto}
                  onEnviarCobranca={handleEnviarCobrancas}
                  onConfirmarPagamento={handleAbrirConfirmarPagamento}
                  onReenviar={handleReenviar}
                  onBloquearCliente={handleBloquearCliente}
                  onLiberarCliente={handleLiberarCliente}
                  onVerHistorico={handleVerHistorico}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Histórico da Cobrança em Atraso (Cenário 8) */}
      <CobrancaHistoricoDialog
        cobranca={viewingCobranca}
        onClose={() => setViewingCobranca(null)}
        onReenviar={handleReenviar}
        onEmitirBoleto={handleEmitirBoleto}
      />

      {/* Modal de Confirmação de Pagamento (Cenário 4) */}
      <ConfirmarPagamentoDialog
        open={confirmarPagamentoData.open}
        onClose={() => setConfirmarPagamentoData({ open: false, cobranca: null })}
        cobranca={confirmarPagamentoData.cobranca}
        onConfirmar={handleConfirmarPagamento}
        loading={loading}
      />
    </div>
  )
}