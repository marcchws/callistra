"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Clock, 
  Mail,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  BarChart3,
  TrendingDown,
  Shield
} from "lucide-react"
import type { DashboardInadimplenciaProps } from "../types"
import { formatCurrency, formatDateTime } from "../utils"

export function DashboardInadimplencia({ data, loading, onExecutarAcaoAutomatica }: DashboardInadimplenciaProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Resumo Geral Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[120px] mb-1" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Alertas Automáticos Loading */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <Skeleton className="h-4 w-[80px] mb-2" />
                  <Skeleton className="h-6 w-[40px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível carregar os dados de inadimplência.
        </AlertDescription>
      </Alert>
    )
  }

  const { resumoGeral, alertasAutomaticos, acoesPendentes, integracaoFinanceira } = data

  return (
    <div className="space-y-6">
      {/* Resumo Geral de Inadimplência */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Cobranças Vencidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {resumoGeral.totalCobrancasVencidas}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-600">
                {formatCurrency(resumoGeral.valorTotalVencido)} em atraso
              </p>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <TrendingDown className="h-3 w-3 mr-1" />
                Crítico
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Clientes Inadimplentes
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {resumoGeral.clientesInadimplentes}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-600">
                {resumoGeral.clientesBloqueados} bloqueados
              </p>
              {resumoGeral.clientesBloqueados > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Bloqueados
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Taxa de Recuperação
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {resumoGeral.taxaRecuperacao.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-600">
                Cobranças pagas após vencimento
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Bom
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Valor Total Vencido
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {formatCurrency(resumoGeral.valorTotalVencido)}
            </div>
            <p className="text-xs text-slate-600">
              Incluindo juros e multas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Automáticos do Sistema */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Sistema de Alertas Automáticos
              </CardTitle>
              <CardDescription className="text-slate-600">
                Monitoramento automático e alertas de inadimplência
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExecutarAcaoAutomatica("processar_alertas")}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Processar Agora
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700">0-15 dias</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {alertasAutomaticos.cobranças0a15dias}
              </div>
              <p className="text-xs text-slate-500">Primeiros alertas</p>
            </div>

            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">+15 dias</span>
              </div>
              <div className="text-xl font-bold text-red-800">
                {alertasAutomaticos.cobrancas15dias}
              </div>
              <p className="text-xs text-red-600">Para bloqueio automático</p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Últimas 24h</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                {alertasAutomaticos.alertasEnviados24h}
              </div>
              <p className="text-xs text-slate-500">Alertas enviados</p>
            </div>

            <div className="p-3 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Entrega</span>
              </div>
              <div className="text-xl font-bold text-green-800">
                {alertasAutomaticos.sucessoEntrega}%
              </div>
              <p className="text-xs text-green-600">Taxa de sucesso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Pendentes e Integração */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ações Pendentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ações Pendentes
            </CardTitle>
            <CardDescription className="text-slate-600">
              Ações que requerem intervenção manual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Geração de Boletos</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {acoesPendentes.geracaoBoletos} cobranças sem boleto atualizado
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onExecutarAcaoAutomatica("gerar_boletos")}>
                Gerar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Envios Pendentes</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {acoesPendentes.enviosPendentes} cobranças não enviadas
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onExecutarAcaoAutomatica("enviar_cobrancas")}>
                Enviar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Confirmações de Pagamento</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {acoesPendentes.confirmacoesPagamento} pagamentos para confirmar
                </p>
              </div>
              <Button variant="outline" size="sm">
                Revisar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Liberações Pendentes</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {acoesPendentes.liberacoesPendentes} clientes aguardando liberação
                </p>
              </div>
              <Button variant="outline" size="sm">
                Revisar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integração Financeira */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Integração Financeira
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sincronização com contas a receber
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-700">Última Sincronização</span>
                <p className="text-xs text-slate-500">
                  {formatDateTime(integracaoFinanceira.ultimaSincronizacao)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExecutarAcaoAutomatica("sincronizar_financeiro")}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sincronizar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Lançamentos Atualizados</span>
                  <span className="text-lg font-bold text-slate-800">
                    {integracaoFinanceira.lancamentosAtualizados}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Cobranças sincronizadas</p>
              </div>

              <div className={`p-3 border rounded-lg ${
                integracaoFinanceira.divergenciasDetectadas > 0 
                  ? "border-orange-200 bg-orange-50" 
                  : "border-green-200 bg-green-50"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Divergências</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      integracaoFinanceira.divergenciasDetectadas > 0 ? "text-orange-800" : "text-green-800"
                    }`}>
                      {integracaoFinanceira.divergenciasDetectadas}
                    </span>
                    {integracaoFinanceira.divergenciasDetectadas === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                </div>
                <p className={`text-xs ${
                  integracaoFinanceira.divergenciasDetectadas > 0 ? "text-orange-600" : "text-green-600"
                }`}>
                  {integracaoFinanceira.divergenciasDetectadas === 0 
                    ? "Tudo sincronizado" 
                    : "Requer atenção"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}