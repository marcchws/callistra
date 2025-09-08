"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Power, 
  History,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Calendar,
  User as UserIcon,
  FileText,
  CreditCard,
  Building,
  Hash,
  Key,
  Clock,
  UserCheck
} from "lucide-react"
import { useUsers } from "../hooks/use-users"
import { UserStatus, User } from "../types"
import { UserStatusToggle } from "../components/user-status-toggle"
import { AuditHistoryModal } from "../components/audit-history-modal"

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const { 
    getUserById, 
    toggleUserStatus, 
    getUserAuditoriaLogs, 
    perfisAcesso,
    loading: usersLoading,
    users
  } = useUsers()
  
  const [user, setUser] = useState<User | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)

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

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2)
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\+\d{2})\s?(\(\d{2}\))\s?(\d{4,5})-?(\d{4})/, "$1 $2 $3-$4")
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "-"
    const d = new Date(date)
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`
  }

  const getPerfilName = (perfilId: string) => {
    const perfil = perfisAcesso.find(p => p.id === perfilId)
    return perfil?.nome || "Não definido"
  }

  const getPerfilDescription = (perfilId: string) => {
    const perfil = perfisAcesso.find(p => p.id === perfilId)
    return perfil?.descricao || "Sem descrição"
  }

  const handleConfirmToggle = async () => {
    await toggleUserStatus(user.id)
    setShowStatusDialog(false)
    // Atualizar o usuário após mudança de status
    const updatedUser = getUserById(userId)
    if (updatedUser) setUser(updatedUser)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
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
                  Detalhes do Usuário
                </h1>
                <p className="text-muted-foreground">
                  Visualizando informações de {user.nome}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  onClick={() => router.push(`/cliente/usuarios-internos/${userId}/editar`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>

            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Nome:</strong> {user.nome}
                  </div>
                  <div>
                    <strong>Cargo:</strong> {user.cargo}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Telefone:</strong> {user.telefone}
                  </div>
                  <div>
                    <strong>Status:</strong> {user.status}
                  </div>
                  <div>
                    <strong>Perfil de Acesso:</strong> {getPerfilName(user.perfilAcesso)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especialidades */}
            {user.especialidades && user.especialidades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.especialidades.map((esp, idx) => (
                      <Badge key={idx} variant="secondary">
                        {esp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações Financeiras */}
            {(user.banco || user.agencia || user.contaCorrente || user.chavePix) && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Financeiras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.banco && (
                      <div>
                        <strong>Banco:</strong> {user.banco}
                      </div>
                    )}
                    {user.agencia && (
                      <div>
                        <strong>Agência:</strong> {user.agencia}
                      </div>
                    )}
                    {user.contaCorrente && (
                      <div>
                        <strong>Conta Corrente:</strong> {user.contaCorrente}
                      </div>
                    )}
                    {user.chavePix && (
                      <div>
                        <strong>Chave PIX:</strong> {user.chavePix}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            {user.observacao && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{user.observacao}</p>
                </CardContent>
              </Card>
            )}

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Criado por:</strong> {user.criadoPor || "Sistema"}
                  </div>
                  <div>
                    <strong>Criado em:</strong> {formatDate(user.criadoEm)}
                  </div>
                  {user.modificadoPor && (
                    <div>
                      <strong>Modificado por:</strong> {user.modificadoPor}
                    </div>
                  )}
                  {user.modificadoEm && (
                    <div>
                      <strong>Modificado em:</strong> {formatDateTime(user.modificadoEm)}
                    </div>
                  )}
                  {user.inativadoPor && (
                    <div>
                      <strong>Inativado por:</strong> {user.inativadoPor}
                    </div>
                  )}
                  {user.inativadoEm && (
                    <div>
                      <strong>Inativado em:</strong> {formatDate(user.inativadoEm)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modais */}
      <UserStatusToggle
        user={user}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmToggle}
      />

      <AuditHistoryModal
        user={user}
        logs={getUserAuditoriaLogs(user.id)}
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
    </div>
  )
}
