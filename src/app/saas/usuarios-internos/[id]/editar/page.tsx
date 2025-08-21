"use client"

// Página de Edição de Usuário
// Cenário 4: Editar dados do usuário

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/usuarios-internos/user-form"
import { Sidebar } from "@/components/sidebar"
import { ArrowLeft, Edit } from "lucide-react"
import { UsuarioInterno } from "@/lib/usuarios-internos/types"
import { mockUsuarios } from "@/lib/usuarios-internos/mock-data"

export default function EditarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioInterno | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar dados do usuário
    const user = mockUsuarios.find(u => u.id === params.id)
    if (user) {
      setUsuario(user)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Usuário não encontrado</h2>
            <p className="text-muted-foreground mt-2">O usuário solicitado não existe.</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/saas/usuarios-internos')}
            >
              Voltar para a lista
            </Button>
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
            {/* Header com navegação */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/saas/usuarios-internos')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  <Edit className="h-6 w-6" />
                  Editar Usuário
                </h1>
                <p className="text-muted-foreground">
                  Atualize os dados de {usuario.nome}
                </p>
              </div>
            </div>

            {/* Form Card */}
            <Card className="max-w-4xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">
                  Dados do Usuário
                </CardTitle>
                <CardDescription>
                  Atualize as informações necessárias. Campos marcados com{' '}
                  <span className="text-red-500">*</span> são obrigatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm mode="edit" usuario={usuario} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}