"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsers } from "../hooks/use-users"
import { UserForm } from "../components/user-form"
import { UserFormData } from "../types"

export default function NewUserPage() {
  const router = useRouter()
  const { createUser, perfisAcesso, loading, uploadProfilePhoto, uploadDocument } = useUsers()

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createUser(data)
      router.push("/cliente/usuarios-internos")
    } catch (error) {
      // Erro já tratado no hook
      console.error(error)
    }
  }

  const handleUploadPhoto = async (file: File) => {
    // Como é novo usuário, salvar temporariamente
    // Em produção, fazer upload para storage temporário
    console.log("Upload de foto para novo usuário:", file)
  }

  const handleUploadDocument = async (file: File, tipo: string) => {
    // Como é novo usuário, salvar temporariamente
    // Em produção, fazer upload para storage temporário
    console.log("Upload de documento para novo usuário:", file, tipo)
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
                onClick={() => router.push("/cliente/usuarios-internos")}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Button>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Cadastrar Novo Usuário
                </h1>
                <p className="text-muted-foreground">
                  Preencha os dados para criar um novo usuário interno
                </p>
              </div>
            </div>

            {/* Formulário */}
            <Card className="max-w-4xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Dados do Usuário</CardTitle>
                <CardDescription>
                  Todos os campos marcados com * são obrigatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm
                  perfisAcesso={perfisAcesso}
                  onSubmit={handleSubmit}
                  onUploadPhoto={handleUploadPhoto}
                  onUploadDocument={handleUploadDocument}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
