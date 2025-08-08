"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, CreditCard, BarChart3, History, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useCobrancas } from "./use-cobrancas"
import { DashboardCobrancas } from "./components/dashboard-cobrancas"
import { FormCobranca } from "./components/form-cobranca"
import { TabelaCobrancas } from "./components/tabela-cobrancas"
import { HistoricoCobrancas } from "./components/historico-cobrancas"

export default function GerenciamentoCobrancasPage() {
  const {
    cobrancas,
    clientes,
    historico,
    estatisticas,
    loading,
    error,
    carregarDados,
    emitirCobranca,
    enviarCobranca,
    gerarAlertaInadimplencia,
    confirmarPagamento,
    bloquearCliente,
    reenviarCobranca
  } = useCobrancas()

  const [tabAtiva, setTabAtiva] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation Pattern */}
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
                <CreditCard className="mr-2 h-4 w-4" />
                Cobranças
              </Button>
            </div>
          </nav>
        </aside>
        
        {/* Main Content Pattern */}
        <main className="flex-1">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-6">
              <div className="flex items-center gap-4">
                {/* Breadcrumbs always visible */}
                <nav className="flex items-center space-x-2 text-sm text-slate-500">
                  <span>Sistema</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Infraestrutura</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-slate-800 font-medium">Gerenciamento de Cobranças</span>
                </nav>
              </div>
            </div>
          </header>
          
          <div className="container py-6">
            <div className="space-y-6">
              {/* Page Title Pattern */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                      Gerenciamento de Cobranças em Atraso
                    </h1>
                    <p className="text-muted-foreground">
                      Centralize e automatize emissão de boletos, links de pagamento e controle de inadimplência
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FormCobranca 
                      clientes={clientes}
                      loading={loading}
                      onSubmit={async (data) => {
                        await emitirCobranca(data)
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={carregarDados}
                      disabled={loading}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      {loading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Atualizar
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    <strong>Erro:</strong> {error}
                  </p>
                </div>
              )}

              {/* Content Area */}
              <div className="space-y-6">
                <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="dashboard" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="cobrancas" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cobranças
                    </TabsTrigger>
                    <TabsTrigger value="historico" className="gap-2">
                      <History className="h-4 w-4" />
                      Histórico
                    </TabsTrigger>
                  </TabsList>

                  {/* Dashboard Tab */}
                  <TabsContent value="dashboard" className="space-y-6">
                    <DashboardCobrancas
                      estatisticas={estatisticas}
                      loading={loading}
                      onRefresh={carregarDados}
                      onGerarAlertas={async () => {
                        await gerarAlertaInadimplencia()
                      }}
                    />
                  </TabsContent>

                  {/* Cobranças Tab */}
                  <TabsContent value="cobrancas" className="space-y-6">
                    <TabelaCobrancas
                      cobrancas={cobrancas}
                      clientes={clientes}
                      loading={loading}
                      onEnviarCobranca={async (id) => {
                        await enviarCobranca(id)
                      }}
                      onReenviarCobranca={async (data) => {
                        await reenviarCobranca(data)
                      }}
                      onAtualizarStatus={async (data) => {
                        await confirmarPagamento(data)
                      }}
                      onGerenciarCliente={async (data) => {
                        await bloquearCliente(data)
                      }}
                    />
                  </TabsContent>

                  {/* Histórico Tab */}
                  <TabsContent value="historico" className="space-y-6">
                    <HistoricoCobrancas
                      historico={historico}
                      loading={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
