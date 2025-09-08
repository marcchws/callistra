"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CalendarDays, 
  CalendarRange, 
  Settings, 
  Download,
  Plus,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"
import { useAgenda } from "./hooks/use-agenda"
import { AgendaCalendar } from "./components/agenda-calendar"
import { AgendaFilters } from "./components/agenda-filters"
import { AgendaForm } from "./components/agenda-form"
import { TaskSidebar } from "./components/task-sidebar"
import { SettingsDialog } from "./components/settings-dialog"
import { 
  EventoAgenda, 
  ViewMode, 
  ConfiguracoesExibicao,
  EventoFormData 
} from "./types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AgendaPage() {
  // Estados principais
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [formOpen, setFormOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedEvento, setSelectedEvento] = useState<EventoAgenda | undefined>()
  const [dataInicialEvento, setDataInicialEvento] = useState<Date | undefined>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Configurações de exibição (persistir no localStorage)
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesExibicao>({
    inicioSemana: "domingo",
    mostrarFinaisSemana: true,
    formatoData: "DD/MM/YYYY",
    formatoHora: "24h"
  })

  // Hook customizado para gerenciar agenda
  const {
    eventos,
    loading,
    error,
    filtros,
    setFiltros,
    criarEvento,
    atualizarEvento,
    removerEvento,
    verificarConflitos,
    recarregar
  } = useAgenda()

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("agenda-configuracoes")
    if (savedConfig) {
      try {
        setConfiguracoes(JSON.parse(savedConfig))
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }
  }, [])

  // Salvar configurações
  const handleSaveSettings = (novasConfiguracoes: ConfiguracoesExibicao) => {
    setConfiguracoes(novasConfiguracoes)
    localStorage.setItem("agenda-configuracoes", JSON.stringify(novasConfiguracoes))
  }

  // Abrir formulário para criar evento
  const handleCreateEvent = (date?: Date) => {
    setDataInicialEvento(date)
    setSelectedEvento(undefined)
    setFormOpen(true)
  }

  // Abrir formulário para editar evento
  const handleEventClick = (evento: EventoAgenda) => {
    setSelectedEvento(evento)
    setDataInicialEvento(undefined)
    setFormOpen(true)
  }

  // Submeter formulário
  const handleFormSubmit = async (data: EventoFormData) => {
    try {
      if (selectedEvento) {
        await atualizarEvento(selectedEvento.id, data)
      } else {
        await criarEvento(data)
      }
      setFormOpen(false)
      setSelectedEvento(undefined)
      setDataInicialEvento(undefined)
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
    }
  }

  // Verificar conflitos ao abrir formulário
  const conflitos = dataInicialEvento 
    ? verificarConflitos(
        dataInicialEvento,
        new Date(dataInicialEvento.getTime() + 60 * 60 * 1000),
        selectedEvento?.id
      )
    : []

  // Exportar eventos
  const handleExportEvents = () => {
    try {
      const dataExport = {
        eventos: eventos,
        exportadoEm: new Date().toISOString(),
        configuracoes: configuracoes
      }
      
      const blob = new Blob([JSON.stringify(dataExport, null, 2)], { 
        type: "application/json" 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `agenda-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Agenda exportada com sucesso!", { duration: 2000 })
    } catch (error) {
      toast.error("Erro ao exportar agenda", { duration: 3000 })
    }
  }

  // Handler para clique em tarefa
  const handleTaskClick = () => {
    // Aqui poderia abrir um modal de detalhes da tarefa
    // ou navegar para a página de tarefas
    toast.info("Funcionalidade de detalhes da tarefa em desenvolvimento", { duration: 2000 })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar global */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
                  <p className="text-muted-foreground">
                    Gerencie compromissos, reuniões, tarefas e bloqueios de agenda
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="gap-2"
                  >
                    {sidebarCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                    {sidebarCollapsed ? "Mostrar Tarefas" : "Ocultar Tarefas"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportEvents}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSettingsOpen(true)}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </Button>
                  <Button
                    onClick={() => handleCreateEvent()}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Evento
                  </Button>
                </div>
              </div>
            </div>

            {/* Layout principal com grid */}
            <div className={cn(
              "grid gap-6 transition-all duration-300 ease-in-out",
              sidebarCollapsed 
                ? "grid-cols-1" 
                : "grid-cols-1 xl:grid-cols-[1fr_400px]"
            )}>
              {/* Coluna principal - Calendário e Filtros */}
              <div className="space-y-6">
                {/* Tabs de visualização */}
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="month" className="gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Mensal
                    </TabsTrigger>
                    <TabsTrigger value="day" className="gap-2">
                      <CalendarRange className="h-4 w-4" />
                      Diário
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={viewMode} className="space-y-6 mt-6">
                    {/* Filtros */}
                    <AgendaFilters
                      filtros={filtros}
                      onFiltrosChange={setFiltros}
                      onLimparFiltros={() => setFiltros({})}
                    />

                    {/* Calendário */}
                    <AgendaCalendar
                      eventos={eventos}
                      viewMode={viewMode}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      onEventClick={handleEventClick}
                      onCreateEvent={handleCreateEvent}
                      showWeekends={configuracoes.mostrarFinaisSemana}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Coluna lateral - Lista de Atividades */}
              <div className={cn(
                "transition-all duration-300 ease-in-out",
                sidebarCollapsed 
                  ? "hidden" 
                  : "xl:sticky xl:top-6 xl:h-[calc(100vh-8rem)]"
              )}>
                <TaskSidebar 
                  selectedDate={selectedDate}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Diálogos */}
      <AgendaForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedEvento(undefined)
          setDataInicialEvento(undefined)
        }}
        onSubmit={handleFormSubmit}
        evento={selectedEvento}
        dataInicial={dataInicialEvento}
        conflitos={conflitos}
      />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        configuracoes={configuracoes}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
