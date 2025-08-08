"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAlerts } from "./hooks/use-alerts"
import { AlertConfigurationComponent } from "./components/alert-configuration"
import { AlertPanel } from "./components/alert-panel"
import { AlertHistory } from "./components/alert-history"
import { AlertFiltersComponent } from "./components/alert-filters"
import { Bell, Settings, History, BarChart3, RefreshCw } from "lucide-react"

export default function AlertasNotificacoesPage() {
  const {
    alerts,
    configurations,
    statistics,
    loading,
    error,
    filters,
    setFilters,
    updateConfiguration,
    markAsRead,
    archiveAlert,
    markMultipleAsRead,
    unreadCount
  } = useAlerts()

  const [activeTab, setActiveTab] = useState("painel")

  const clearFilters = () => {
    setFilters({})
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sistema de Alertas e Notificação</h1>
          <p className="text-muted-foreground">
            Centralizar a visualização de alertas e notificações
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Sistema de Alertas e Notificação</h1>
            <p className="text-muted-foreground">
              Centralizar a visualização de alertas e notificações sobre contas a vencer, movimentação de processos, chats, prazos de atividades e agendas
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount} não lidos
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.total}</p>
                <p className="text-xs text-muted-foreground">Total de Alertas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {configurations.filter(c => c.enabled).length}
                </p>
                <p className="text-xs text-muted-foreground">Tipos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.pending}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{statistics.read}</p>
                <p className="text-xs text-muted-foreground">Processados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="painel" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Painel de Alertas
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="painel" className="space-y-6">
          {/* Filtros */}
          <AlertFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
          
          {/* Painel Principal */}
          <AlertPanel
            alerts={alerts}
            statistics={statistics}
            onMarkAsRead={markAsRead}
            onArchiveAlert={archiveAlert}
            onMarkMultipleAsRead={markMultipleAsRead}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <AlertConfigurationComponent
            configurations={configurations}
            onUpdateConfiguration={updateConfiguration}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <AlertHistory alerts={alerts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
