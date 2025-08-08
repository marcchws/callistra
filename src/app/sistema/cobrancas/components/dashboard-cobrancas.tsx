"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  UserX,
  Mail,
  BarChart3,
  RefreshCw
} from "lucide-react"
import type { EstatisticasCobranca } from "../types"

interface DashboardCobrancasProps {
  estatisticas: EstatisticasCobranca | null
  loading: boolean
  onRefresh: () => void
  onGerarAlertas: () => void
}

export function DashboardCobrancas({ 
  estatisticas, 
  loading, 
  onRefresh, 
  onGerarAlertas 
}: DashboardCobrancasProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!estatisticas) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-slate-600">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p>Carregue os dados para visualizar as estatísticas</p>
            <Button onClick={onRefresh} className="mt-4 bg-slate-600 hover:bg-slate-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Carregar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Dashboard de Cobranças</h2>
          <p className="text-slate-600">Visão geral das cobranças e inadimplência</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button 
            onClick={onGerarAlertas}
            className="bg-slate-600 hover:bg-slate-700 gap-2"
          >
            <Mail className="h-4 w-4" />
            Enviar Alertas
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Cobranças Pendentes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Cobranças Pendentes
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-800">
                {estatisticas.totalPendente}
              </div>
              <div className="text-sm text-slate-600">
                {formatCurrency(estatisticas.valorTotalPendente)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cobranças Vencidas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Cobranças Vencidas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {estatisticas.totalVencidas}
              </div>
              <div className="text-sm text-slate-600">
                {formatCurrency(estatisticas.valorTotalVencido)}
              </div>
              {estatisticas.totalVencidas > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Ação necessária
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cobranças Pagas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Cobranças Pagas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {estatisticas.totalPagas}
              </div>
              <div className="text-sm text-slate-600">
                {formatCurrency(estatisticas.valorTotalPago)}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {estatisticas.taxaSucesso.toFixed(1)}% taxa de sucesso
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clientes Bloqueados */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">
                Clientes Bloqueados
              </CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">
                {estatisticas.clientesBloqueados}
              </div>
              <div className="text-sm text-slate-600">
                Atraso &gt; 15 dias
              </div>
              {estatisticas.clientesBloqueados > 0 && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  Requer liberação admin
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Taxa de Conversão */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-slate-800">
              Taxa de Conversão
            </CardTitle>
            <CardDescription className="text-slate-600">
              Percentual de cobranças pagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Taxa de Sucesso</span>
                <span className="text-sm font-medium text-slate-800">
                  {estatisticas.taxaSucesso.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(estatisticas.taxaSucesso, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500">
                {estatisticas.totalPagas} de {estatisticas.totalPagas + estatisticas.totalPendente + estatisticas.totalVencidas} cobranças
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cobranças Enviadas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-slate-800">
              Cobranças Enviadas
            </CardTitle>
            <CardDescription className="text-slate-600">
              Total de envios realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-800">
                {estatisticas.cobrancasEnviadas}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-1" />
                E-mails e notificações
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio de Recebimento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-slate-800">
              Tempo Médio
            </CardTitle>
            <CardDescription className="text-slate-600">
              Dias para recebimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-800">
                {estatisticas.tempoMedioRecebimento}
              </div>
              <div className="text-sm text-slate-600">
                dias em média
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                Melhor que o período anterior
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Rápidas */}
      {(estatisticas.totalVencidas > 0 || estatisticas.clientesBloqueados > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg font-medium text-orange-800">
                Atenção Necessária
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estatisticas.totalVencidas > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-orange-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {estatisticas.totalVencidas} cobrança(s) vencida(s)
                    </p>
                    <p className="text-xs text-slate-600">
                      {formatCurrency(estatisticas.valorTotalVencido)} em atraso
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={onGerarAlertas}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Enviar Alertas
                  </Button>
                </div>
              )}
              
              {estatisticas.clientesBloqueados > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-md border border-orange-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {estatisticas.clientesBloqueados} cliente(s) bloqueado(s)
                    </p>
                    <p className="text-xs text-slate-600">
                      Aguardando liberação do administrador
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Admin necessário
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
