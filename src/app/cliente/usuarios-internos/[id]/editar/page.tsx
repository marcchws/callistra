"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsers } from "../../hooks/use-users"
import { UserForm } from "../../components/user-form"
import { UserFormData, User } from "../../types"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const { 
    getUserById, 
    updateUser, 
    perfisAcesso, 
    loading: usersLoading, 
    uploadProfilePhoto, 
    uploadDocument,
    users
  } = useUsers()
  
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Só buscar o usuário quando os dados estiverem carregados
    if (!usersLoading && users.length > 0) {
      const foundUser = getUserById(userId)
      if (foundUser) {
        setUser(foundUser)
      } else {
        // Usuário não encontrado, redirecionar
        router.push("/cliente/usuarios-internos")
      }
    }
  }, [userId, getUserById, router, usersLoading, users])

  // Loading state enquanto aguarda dados
  if (usersLoading || users.length === 0) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center lg:ml-64">
          <div className="text-muted-foreground">Carregando...</div>
        </main>
      </div>
    )
  }

  // Se não há usuário após o carregamento, não renderizar nada (será redirecionado)
  if (!user) {
    return null
  }

  const handleSubmit = async (data: UserFormData) => {
    try {
      await updateUser(userId, data)
      router.push(`/cliente/usuarios-internos/${userId}`)
    } catch (error) {
      // Erro já tratado no hook
      console.error(error)
    }
  }

  const handleUploadPhoto = async (file: File) => {
    try {
      await uploadProfilePhoto(userId, file)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUploadDocument = async (file: File, tipo: string) => {
    try {
      await uploadDocument(userId, file, tipo)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header com botão voltar */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/cliente/usuarios-internos/${userId}`)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Button>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Editar Usuário
                </h1>
                <p className="text-muted-foreground">
                  Atualize os dados do usuário {user.nome}
                </p>
              </div>
            </div>

            {/* Formulário */}
            <Card className="max-w-4xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Dados do Usuário</CardTitle>
                <CardDescription>
                  Atualize as informações necessárias. O ID não pode ser alterado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm
                  user={user}
                  perfisAcesso={perfisAcesso}
                  onSubmit={handleSubmit}
                  onUploadPhoto={handleUploadPhoto}
                  onUploadDocument={handleUploadDocument}
                  loading={usersLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
