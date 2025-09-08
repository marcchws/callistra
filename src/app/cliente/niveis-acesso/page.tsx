"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Shield,
  Users,
  Loader2,
  Filter,
  AlertCircle
} from "lucide-react"
import { useNiveisAcesso } from "./use-niveis-acesso"
import { ProfileDialog } from "./components/profile-dialog"
import { 
  AccessProfile, 
  ProfileStatus, 
  statusLabels,
  ProfileFormData
} from "./types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function NiveisAcessoPage() {
  const {
    profiles,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createProfile,
    updateProfile,
    deleteProfile,
    toggleProfileStatus,
    getProfileById,
    generateEmptyPermissions,
    totalProfiles
  } = useNiveisAcesso()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<AccessProfile | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<AccessProfile | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [profileToToggle, setProfileToToggle] = useState<AccessProfile | null>(null)

  // Abrir diálogo para criar novo perfil
  const handleCreateNew = () => {
    setSelectedProfile(null)
    setDialogOpen(true)
  }

  // Abrir diálogo para editar perfil
  const handleEdit = (profile: AccessProfile) => {
    setSelectedProfile(profile)
    setDialogOpen(true)
  }

  // Confirmar exclusão
  const handleDeleteClick = (profile: AccessProfile) => {
    setProfileToDelete(profile)
    setDeleteDialogOpen(true)
  }

  // Executar exclusão
  const handleDeleteConfirm = async () => {
    if (profileToDelete) {
      try {
        await deleteProfile(profileToDelete.id)
        setDeleteDialogOpen(false)
        setProfileToDelete(null)
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  }

  // Confirmar alteração de status
  const handleStatusClick = (profile: AccessProfile) => {
    setProfileToToggle(profile)
    setStatusDialogOpen(true)
  }

  // Executar alteração de status
  const handleStatusConfirm = async () => {
    if (profileToToggle) {
      try {
        await toggleProfileStatus(profileToToggle.id)
        setStatusDialogOpen(false)
        setProfileToToggle(null)
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  }

  // Submit do formulário
  const handleFormSubmit = async (data: ProfileFormData) => {
    if (selectedProfile) {
      await updateProfile(selectedProfile.id, data)
    } else {
      await createProfile(data)
    }
  }

  // Busca
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value && profiles.length === 0) {
      toast.info("Nenhum perfil encontrado")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pl-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Níveis de Acesso
              </h1>
              <p className="text-muted-foreground">
                Gerencie os perfis de acesso e permissões do sistema
              </p>
            </div>

            {/* Card principal */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Perfis de Acesso</CardTitle>
                    <CardDescription className="mt-1">
                      {totalProfiles} {totalProfiles === 1 ? "perfil cadastrado" : "perfis cadastrados"}
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateNew}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Perfil
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar perfil..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9 focus:ring-blue-500"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: any) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] focus:ring-blue-500">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value={ProfileStatus.ATIVO}>
                        {statusLabels[ProfileStatus.ATIVO]}
                      </SelectItem>
                      <SelectItem value={ProfileStatus.INATIVO}>
                        {statusLabels[ProfileStatus.INATIVO]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">
                      {searchQuery || statusFilter !== "todos" 
                        ? "Nenhum perfil encontrado" 
                        : "Nenhum perfil cadastrado"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "todos"
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando seu primeiro perfil de acesso"}
                    </p>
                    {!searchQuery && statusFilter === "todos" && (
                      <Button 
                        onClick={handleCreateNew}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Criar Primeiro Perfil
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Nome do Perfil</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-center">Usuários</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell className="font-mono text-sm">
                              #{profile.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                {profile.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {profile.description || "Sem descrição"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {profile.usersCount ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{profile.usersCount}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <Switch
                                  checked={profile.status === ProfileStatus.ATIVO}
                                  onCheckedChange={() => handleStatusClick(profile)}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(profile)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar Permissões
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(profile)}
                                    className={cn(
                                      "cursor-pointer",
                                      profile.status === ProfileStatus.ATIVO && profile.usersCount && profile.usersCount > 0
                                        ? "text-muted-foreground cursor-not-allowed" 
                                        : "text-red-600"
                                    )}
                                    disabled={profile.status === ProfileStatus.ATIVO && profile.usersCount !== undefined && profile.usersCount > 0}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Diálogo de criação/edição */}
      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={selectedProfile}
        onSubmit={handleFormSubmit}
        generateEmptyPermissions={generateEmptyPermissions}
        loading={loading}
      />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {profileToDelete?.status === ProfileStatus.ATIVO && profileToDelete.usersCount && profileToDelete.usersCount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Não é possível excluir este perfil
                    </span>
                  </div>
                  <p>
                    Este perfil ativo está sendo utilizado por {profileToDelete.usersCount} 
                    {profileToDelete.usersCount === 1 ? " usuário" : " usuários"}.
                    Desative o perfil primeiro para transferir os usuários automaticamente.
                  </p>
                </div>
              ) : (
                <>
                  Tem certeza que deseja excluir o perfil{" "}
                  <span className="font-medium">"{profileToDelete?.name}"</span>?
                  {profileToDelete?.status === ProfileStatus.INATIVO && (
                    <span className="block mt-2 text-sm text-muted-foreground">
                      Este perfil está inativo e não possui usuários vinculados.
                    </span>
                  )}
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {!(profileToDelete?.status === ProfileStatus.ATIVO && profileToDelete.usersCount && profileToDelete.usersCount > 0) && (
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação de alteração de status */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {profileToToggle?.status === ProfileStatus.ATIVO 
                ? "Desativar Perfil" 
                : "Ativar Perfil"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {profileToToggle?.status === ProfileStatus.ATIVO ? (
                <>
                  Tem certeza que deseja desativar o perfil{" "}
                  <span className="font-medium">"{profileToToggle?.name}"</span>?
                  {profileToToggle?.usersCount && profileToToggle.usersCount > 0 && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Atenção:</p>
                          <p>
                            Ao desativar este perfil, todas as atividades dos{" "}
                            {profileToToggle.usersCount} usuário(s) vinculado(s) 
                            serão transferidas para o Admin Master para redistribuição.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  Tem certeza que deseja ativar o perfil{" "}
                  <span className="font-medium">"{profileToToggle?.name}"</span>?
                  Os usuários vinculados poderão utilizar este perfil novamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusConfirm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
