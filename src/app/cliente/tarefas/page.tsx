"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskList } from "./components/task-list"
import { TaskFiltersComponent } from "./components/task-filters"
import { TaskHistoryModal } from "./components/task-history-modal"
import { useTasks } from "./hooks/use-tasks"
import { Task, TaskFilters } from "./types"
import { toast } from "sonner"

export default function TarefasPage() {
  const router = useRouter()
  const { tasks, loading, deleteTask, filterTasks, checkPermission } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)

  const handleNewTask = () => {
    router.push("/cliente/tarefas/nova")
  }

  const handleEditTask = (task: Task) => {
    if (!checkPermission("edit")) {
      toast.error("Acesso negado", { 
        description: "Você não tem permissão para editar tarefas",
        duration: 3000 
      })
      return
    }
    router.push(`/cliente/tarefas/${task.id}`)
  }

  const handleDeleteTask = async (id: string) => {
    if (!checkPermission("delete")) {
      toast.error("Acesso negado", { 
        description: "Você não tem permissão para remover tarefas",
        duration: 3000 
      })
      return
    }
    await deleteTask(id)
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setHistoryModalOpen(true)
  }

  const handleFilter = (filters: TaskFilters) => {
    filterTasks(filters)
  }

  const handleClearFilters = () => {
    filterTasks({})
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Cadastro e Gerenciamento de Tarefas
                </h1>
                <p className="text-muted-foreground">
                  Registre, edite, remova e acompanhe tarefas vinculadas a processos, clientes e advogados responsáveis
                </p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={handleNewTask}
              >
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
            </div>

            {/* Filtros */}
            <TaskFiltersComponent 
              onFilter={handleFilter}
              onClear={handleClearFilters}
            />

            {/* Lista de Tarefas */}
            <TaskList 
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onView={handleViewTask}
              canEdit={checkPermission("edit")}
              canDelete={checkPermission("delete")}
            />

            {/* Modal de Histórico */}
            <TaskHistoryModal 
              task={selectedTask}
              open={historyModalOpen}
              onClose={() => {
                setHistoryModalOpen(false)
                setSelectedTask(null)
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
