"use client"

import { useState } from "react"
import { Settings, Bell, History, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { useAlerts } from "./use-alerts"
import { AlertsPanel } from "./components/alerts-panel"
import { AlertsSettings } from "./components/alerts-settings"
import { AlertsHistory } from "./components/alerts-history"

export default function AlertasPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("alertas")
  
  const {
    alerts,
    preferences,
    filters,
    loading,
    error,
    unreadCount,
    totalCount,
    savePreferences,
    markAsRead,
    archiveAlert,
    unarchiveAlert,
    setFilters
  } = useAlerts()

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
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sistema</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-700 hover:bg-slate-100 bg-slate-100"
              >
                <Bell className="mr-2 h-4 w-4" />
                Alertas e Notificações
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
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
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="text-slate-500">Sistema</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-slate-800 font-medium">Alertas e Notificações</span>
                </nav>
              </div>
            </div>
          </header>
          
          <div className="container py-6">
            <div className="space-y-6">
              {/* Page Title Pattern */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                    Sistema de Alertas e Notificações
                  </h1>
                  <p className="text-muted-foreground">
                    Centralize e configure como receber alertas sobre atividades importantes do sistema
                  </p>
                </div>
                
                <Button 
                  onClick={() => setSettingsOpen(true)}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </div>
              
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-800 font-medium">Erro</p>
                  </div>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              )}
              
              {/* Content Area */}
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="alertas" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Central de Alertas
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="historico" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Histórico
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="alertas">
                    <AlertsPanel
                      alerts={alerts}
                      filters={filters}
                      onFiltersChange={setFilters}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveAlert}
                      onUnarchive={unarchiveAlert}
                      loading={loading}
                      unreadCount={unreadCount}
                      totalCount={totalCount}
                    />
                  </TabsContent>
                  
                  <TabsContent value="historico">
                    <AlertsHistory
                      alerts={alerts}
                      filters={filters}
                      onFiltersChange={setFilters}
                      loading={loading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <AlertsSettings
        preferences={preferences}
        onSave={savePreferences}
        loading={loading}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  )
}