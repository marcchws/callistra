"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ProcessoForm } from "../components/processo-form"
import { useProcessos } from "../hooks/use-processos"
import { toast } from "sonner"
import { Processo } from "../types"

export default function NovoProcessoPage() {
  const router = useRouter()
  const { addProcesso, addHistorico } = useProcessos()

  const handleSubmit = async (data: Processo) => {
    const result = await addProcesso(data)
    
    if (result.success && result.data) {
      // Registrar no histórico
      await addHistorico({
        processoId: result.data.id!,
        acao: "criacao",
        usuario: "user@escritorio.com",
        detalhes: "Processo cadastrado no sistema"
      })
      
      toast.success("Processo cadastrado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      
      // Redirecionar para a visualização do processo
      router.push(`/cliente/gestao-processos/${result.data.id}`)
    } else {
      toast.error(result.error || "Erro ao cadastrar processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
    
    return result
  }

  const handleCancel = () => {
    router.push("/cliente/gestao-processos")
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
                Novo Processo
              </h1>
              <p className="text-muted-foreground">
                Preencha todos os dados essenciais do processo jurídico
              </p>
            </div>

            {/* Formulário */}
            <ProcessoForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={false}
            />
          </div>
        </div>
      </main>
    </div>
  )
}