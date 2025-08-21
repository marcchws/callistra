"use client"

// Página principal de Gerenciamento de Usuários Internos
// Implementa todos os requisitos do PRD

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserTable } from "@/components/usuarios-internos/user-table"
import { UserFilters } from "@/components/usuarios-internos/user-filters"
import { Sidebar } from "@/components/sidebar"
import { Plus, Users } from "lucide-react"
import { UsuarioInterno } from "@/lib/usuarios-internos/types"
import { buscarUsuarios, mockUsuarios } from "@/lib/usuarios-internos/mock-data"
import { toast } from "sonner"

export default function UsuariosInternosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<UsuarioInterno[]>(mockUsuarios)
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioInterno[]>(mockUsuarios)
  const [loading, setLoading] = useState(false)

  const handleFilterChange = (filters: {
    busca?: string
    status?: string
    cargo?: string
    perfilAcesso?: string
  }) => {
    const resultado = buscarUsuarios(filters)
    setUsuariosFiltrados(resultado)
  }

  const handleStatusChange = (id: string, newStatus: 'ativo' | 'inativo') => {
    setUsuarios(prev => 
      prev.map(u => 
        u.id === id ? { ...u, status: newStatus } : u
      )
    )
    setUsuariosFiltrados(prev =>
      prev.map(u =>
        u.id === id ? { ...u, status: newStatus } : u
      )
    )
  }

  const refreshData = () => {
    setLoading(true)
    // Simular refresh
    setTimeout(() => {
      setUsuarios([...mockUsuarios])
      setUsuariosFiltrados([...mockUsuarios])
      setLoading(false)
    }, 500)
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
                Gerenciar Usuários Internos
              </h1>
              <p className="text-muted-foreground">
                Cadastro, edição, busca, filtragem e gerenciamento completo de usuários internos do sistema Callistra
              </p>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuarios.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Cadastrados no sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuários Ativos
                  </CardTitle>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usuarios.filter(u => u.status === 'ativo').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Com acesso liberado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuários Inativos
                  </CardTitle>
                  <div className="h-2 w-2 rounded-full bg-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usuarios.filter(u => u.status === 'inativo').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Com login bloqueado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários do Sistema</CardTitle>
                    <CardDescription>
                      Lista completa de usuários internos com suas informações e permissões
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/saas/usuarios-internos/novo')}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros e Busca */}
                <UserFilters 
                  onFilterChange={handleFilterChange}
                  totalResults={usuariosFiltrados.length}
                />

                {/* Tabela de Usuários */}
                <UserTable 
                  usuarios={usuariosFiltrados}
                  onStatusChange={handleStatusChange}
                  onRefresh={refreshData}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}