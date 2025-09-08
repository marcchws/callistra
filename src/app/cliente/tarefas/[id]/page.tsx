"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TaskForm } from "../components/task-form"
import { useTasks } from "../hooks/use-tasks"
import { Task, TaskFormData } from "../types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function EditarTarefaPage() {
  const router = useRouter()
  const params = useParams()
  const { getTaskById, updateTask, loading, checkPermission } = useTasks()
  const [task, setTask] = useState<Task | null>(null)
  const [loadingTask, setLoadingTask] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Verificar permissão
      if (!checkPermission("edit")) {
        toast.error("Acesso negado", { 
          description: "Você não tem permissão para editar tarefas",
          duration: 3000 
        })
        router.push("/cliente/tarefas")
        return
      }

      // Buscar tarefa
      const foundTask = getTaskById(params.id as string)
      if (foundTask) {
        setTask(foundTask)
      } else {
        toast.error("Tarefa não encontrada", { duration: 3000 })
        router.push("/cliente/tarefas")
      }
      setLoadingTask(false)
    }
  }, [params.id, getTaskById, checkPermission, router])

  const handleSubmit = async (data: TaskFormData) => {
    if (task) {
      try {
        await updateTask(task.id, data)
        router.push("/cliente/tarefas")
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error)
      }
    }
  }

  const handleCancel = () => {
    router.push("/cliente/tarefas")
  }

  if (loadingTask) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!task) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Editar Tarefa
              </h1>
              <p className="text-muted-foreground">
                Atualize as informações da tarefa
              </p>
            </div>

            {/* Formulário */}
            <TaskForm 
              task={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
