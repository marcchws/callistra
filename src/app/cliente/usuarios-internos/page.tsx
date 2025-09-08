"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import { useUsers } from "./hooks/use-users"
import { UserTable } from "./components/user-table"
import { UserFiltersComponent } from "./components/user-filters"
import { UserStatusToggle } from "./components/user-status-toggle"
import { AuditHistoryModal } from "./components/audit-history-modal"
import { User, UserFilters } from "./types"

export default function UsersPage() {
  const router = useRouter()
  const { 
    filteredUsers, 
    loading, 
    toggleUserStatus,
    getUserAuditoriaLogs,
    applyFilters
  } = useUsers()

  const [statusToggleUser, setStatusToggleUser] = useState<User | null>(null)
  const [historyUser, setHistoryUser] = useState<User | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)

  const handleToggleStatus = (userId: string) => {
    const user = filteredUsers.find(u => u.id === userId)
    if (user) {
      setStatusToggleUser(user)
      setShowStatusDialog(true)
    }
  }

  const handleConfirmToggle = async () => {
    if (statusToggleUser) {
      await toggleUserStatus(statusToggleUser.id)
      setShowStatusDialog(false)
      setStatusToggleUser(null)
    }
  }

  const handleViewHistory = (user: User) => {
    setHistoryUser(user)
    setShowHistoryDialog(true)
  }

  const handleFiltersChange = useCallback((filters: UserFilters) => {
    applyFilters(filters)
  }, [applyFilters])

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
                Cadastro, edição, busca, filtragem e gerenciamento completo de usuários internos com controle de permissões e rastreabilidade
              </p>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários Internos</CardTitle>
                    <CardDescription>
                      Gerencie os usuários do sistema, suas permissões e status
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/cliente/usuarios-internos/novo")}
                  >
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros */}
                <UserFiltersComponent onFiltersChange={handleFiltersChange} />
                
                {/* Tabela */}
                <UserTable 
                  users={filteredUsers}
                  loading={loading}
                  onToggleStatus={handleToggleStatus}
                  onViewHistory={handleViewHistory}
                />

                {/* Indicadores */}
                {!loading && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      Total de {filteredUsers.length} usuário{filteredUsers.length !== 1 ? "s" : ""}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>
                          {filteredUsers.filter(u => u.status === "ATIVO").length} Ativos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>
                          {filteredUsers.filter(u => u.status === "INATIVO").length} Inativos
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modais */}
            <UserStatusToggle
              user={statusToggleUser}
              open={showStatusDialog}
              onOpenChange={setShowStatusDialog}
              onConfirm={handleConfirmToggle}
            />

            <AuditHistoryModal
              user={historyUser}
              logs={historyUser ? getUserAuditoriaLogs(historyUser.id) : []}
              open={showHistoryDialog}
              onOpenChange={setShowHistoryDialog}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
