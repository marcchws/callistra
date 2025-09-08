"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ProcessoForm } from "../../components/processo-form"
import { useProcessos } from "../../hooks/use-processos"
import { toast } from "sonner"
import { Processo } from "../../types"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditarProcessoPage() {
  const params = useParams()
  const router = useRouter()
  const { getProcesso, updateProcesso, addHistorico, checkPermissao } = useProcessos()
  
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    loadProcesso()
  }, [params.id])

  const loadProcesso = async () => {
    setLoading(true)
    
    const processoData = getProcesso(params.id as string)
    
    if (processoData) {
      setProcesso(processoData)
      
      // Verificar permissão para editar
      const permission = checkPermissao(processoData)
      setHasPermission(permission)
    }
    
    setLoading(false)
  }

  const handleSubmit = async (data: Processo) => {
    if (!processo) return { success: false, error: "Processo não encontrado" }
    
    // Identificar campos alterados para o histórico
    const camposAlterados = []
    const camposComparar = [
      "pasta", "nomeCliente", "qualificacaoCliente", "outrosEnvolvidos", 
      "qualificacaoOutros", "titulo", "instancia", "numero", "juizo", 
      "vara", "foro", "acao", "tribunal", "linkTribunal", "objeto", 
      "valorCausa", "distribuidoEm", "valorCondenacao", "observacoes", 
      "responsavel", "acesso"
    ]
    
    for (const campo of camposComparar) {
      const valorAnterior = (processo as any)[campo]
      const valorNovo = (data as any)[campo]
      
      if (valorAnterior !== valorNovo) {
        camposAlterados.push({
          campo,
          valorAnterior: String(valorAnterior || ""),
          valorNovo: String(valorNovo || "")
        })
      }
    }
    
    // Comparar arrays de honorários
    const honorariosAnteriores = processo.honorarios?.join(", ") || ""
    const honorariosNovos = data.honorarios?.join(", ") || ""
    if (honorariosAnteriores !== honorariosNovos) {
      camposAlterados.push({
        campo: "honorarios",
        valorAnterior: honorariosAnteriores,
        valorNovo: honorariosNovos
      })
    }
    
    const result = await updateProcesso(params.id as string, data)
    
    if (result.success) {
      // Registrar no histórico com detalhes das alterações
      await addHistorico({
        processoId: params.id as string,
        acao: "edicao",
        usuario: "user@escritorio.com",
        detalhes: `${camposAlterados.length} campo(s) alterado(s)`,
        camposAlterados: camposAlterados.length > 0 ? camposAlterados : undefined
      })
      
      toast.success("Processo atualizado com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      
      // Redirecionar para a visualização do processo
      router.push(`/cliente/gestao-processos/${params.id}`)
    } else {
      toast.error(result.error || "Erro ao atualizar processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
    
    return result
  }

  const handleCancel = () => {
    router.push(`/cliente/gestao-processos/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="text-center py-8">Carregando processo...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!processo) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">Processo não encontrado</p>
              <Button onClick={() => router.push("/cliente/gestao-processos")}>
                Voltar para a lista
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <Card className="max-w-md mx-auto mt-8">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  <p className="font-semibold">Acesso Negado</p>
                </div>
                <p className="text-muted-foreground">
                  Você não tem permissão para editar este processo.
                </p>
                <p className="text-sm">
                  Este processo é {processo.acesso === "privado" ? "privado" : "restrito aos envolvidos"} 
                  e você não é o responsável.
                </p>
                <Button 
                  onClick={() => router.push(`/cliente/gestao-processos/${params.id}`)} 
                  className="w-full"
                >
                  Voltar para visualização
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
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
                Editar Processo
              </h1>
              <p className="text-muted-foreground">
                Atualize as informações do processo {processo.pasta}
              </p>
            </div>

            {/* Formulário */}
            <ProcessoForm
              defaultValues={processo}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
            />
          </div>
        </div>
      </main>
    </div>
  )
}