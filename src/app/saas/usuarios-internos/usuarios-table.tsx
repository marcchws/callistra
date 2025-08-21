"use client"

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, UserCheck, UserX, Eye, FileText } from 'lucide-react'
import { Usuario, UsuarioFilters } from './types'

interface UsuariosTableProps {
  usuarios: Usuario[]
  loading: boolean
  filters: UsuarioFilters
  cargos: string[]
  onFiltersChange: (filters: Partial<UsuarioFilters>) => void
  onClearFilters: () => void
  onCreateUser: () => void
  onEditUser: (usuario: Usuario) => void
  onViewUser: (usuario: Usuario) => void
  onToggleStatus: (id: string) => Promise<boolean>
}

export function UsuariosTable({
  usuarios,
  loading,
  filters,
  cargos,
  onFiltersChange,
  onClearFilters,
  onCreateUser,
  onEditUser,
  onViewUser,
  onToggleStatus
}: UsuariosTableProps) {
  const [usuarioParaAlterarStatus, setUsuarioParaAlterarStatus] = useState<Usuario | null>(null)

  const handleToggleStatus = async () => {
    if (!usuarioParaAlterarStatus) return
    
    const sucesso = await onToggleStatus(usuarioParaAlterarStatus.id)
    if (sucesso) {
      setUsuarioParaAlterarStatus(null)
    }
  }

  const getStatusBadge = (status: Usuario['status']) => {
    return status === 'Ativo' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inativo
      </Badge>
    )
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Usuários Internos</CardTitle>
            <CardDescription>
              Gerencie usuários internos do sistema com seus perfis de acesso
            </CardDescription>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onCreateUser}>
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 pt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, cargo ou e-mail..."
                value={filters.searchTerm || ''}
                onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                className="pl-10 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Select 
              value={filters.status || 'Todos'} 
              onValueChange={(value) => onFiltersChange({ status: value as UsuarioFilters['status'] })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.cargo || 'todos'} 
              onValueChange={(value) => onFiltersChange({ cargo: value === 'todos' ? '' : value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos os Cargos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cargos</SelectItem>
                {cargos.map((cargo) => (
                  <SelectItem key={cargo} value={cargo}>
                    {cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filters.searchTerm || filters.status !== 'Todos' || filters.cargo !== 'todos') && (
              <Button variant="outline" onClick={onClearFilters}>
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Carregando usuários...</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil de Acesso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {filters.searchTerm || filters.status !== 'Todos' || filters.cargo !== 'todos'
                          ? 'Nenhum usuário encontrado com os filtros aplicados'
                          : 'Nenhum usuário cadastrado'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={usuario.fotoPerfil} />
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                            {getInitials(usuario.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{usuario.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            {usuario.telefone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{usuario.cargo}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <span className="text-sm">{usuario.perfilAcesso}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(usuario.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewUser(usuario)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditUser(usuario)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setUsuarioParaAlterarStatus(usuario)}
                            className={usuario.status === 'Ativo' ? 'text-red-600' : 'text-green-600'}
                          >
                            {usuario.status === 'Ativo' ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog de confirmação para alterar status */}
      <AlertDialog open={!!usuarioParaAlterarStatus} onOpenChange={() => setUsuarioParaAlterarStatus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {usuarioParaAlterarStatus?.status === 'Ativo' ? 'Desativar' : 'Ativar'} Usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              {usuarioParaAlterarStatus?.status === 'Ativo' ? (
                <>
                  Tem certeza que deseja desativar o usuário <strong>{usuarioParaAlterarStatus?.nome}</strong>?
                  <br />
                  <strong>O usuário não conseguirá mais fazer login no sistema.</strong>
                </>
              ) : (
                <>
                  Tem certeza que deseja ativar o usuário <strong>{usuarioParaAlterarStatus?.nome}</strong>?
                  <br />
                  O usuário poderá fazer login no sistema novamente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus}
              className={usuarioParaAlterarStatus?.status === 'Ativo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
