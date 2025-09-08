"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TaskForm } from "../components/task-form"
import { useTasks } from "../hooks/use-tasks"
import { TaskFormData } from "../types"
import { toast } from "sonner"

export default function NovaTarefaPage() {
  const router = useRouter()
  const { createTask, loading } = useTasks()

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await createTask(data)
      router.push("/cliente/tarefas")
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    }
  }

  const handleCancel = () => {
    router.push("/cliente/tarefas")
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
                Nova Tarefa
              </h1>
              <p className="text-muted-foreground">
                Preencha todos os campos obrigatórios para criar uma nova tarefa
              </p>
            </div>

            {/* Formulário */}
            <TaskForm 
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
