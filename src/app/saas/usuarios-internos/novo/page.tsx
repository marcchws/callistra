"use client"

// Página de Criação de Novo Usuário
// Cenário 1: Criar novo usuário com dados válidos

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserForm } from "@/components/usuarios-internos/user-form"
import { Sidebar } from "@/components/sidebar"
import { UserPlus } from "lucide-react"

export default function NovoUsuarioPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Adicionar Novo Usuário
              </h1>
              <p className="text-muted-foreground">
                Preencha os dados para cadastrar um novo usuário interno no sistema
              </p>
            </div>

            {/* Form Card */}
            <Card className="max-w-4xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">
                  Dados do Usuário
                </CardTitle>
                <CardDescription>
                  Campos marcados com <span className="text-red-500">*</span> são obrigatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm mode="create" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}