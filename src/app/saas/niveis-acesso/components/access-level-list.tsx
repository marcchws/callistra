import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Edit, Trash2, MoreHorizontal, Power, Users, Shield, AlertCircle } from 'lucide-react'
import { AccessLevel } from '../types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AccessLevelListProps {
  accessLevels: AccessLevel[]
  onEdit: (accessLevel: AccessLevel) => void
  onDelete: (id: string) => Promise<boolean>
  onToggleStatus: (id: string) => Promise<boolean>
  loading?: boolean
}

export function AccessLevelList({ 
  accessLevels, 
  onEdit, 
  onDelete,
  onToggleStatus,
  loading = false 
}: AccessLevelListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  // Handle delete confirmation
  const handleDeleteClick = (level: AccessLevel) => {
    setSelectedLevel(level)
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!selectedLevel) return
    
    setIsDeleting(true)
    const success = await onDelete(selectedLevel.id)
    setIsDeleting(false)
    
    if (success) {
      setDeleteDialogOpen(false)
      setSelectedLevel(null)
    }
  }

  // Toggle status
  const handleToggleStatus = async (level: AccessLevel) => {
    setIsToggling(level.id)
    await onToggleStatus(level.id)
    setIsToggling(null)
  }

  // Conta permissões ativas
  const countActivePermissions = (level: AccessLevel): number => {
    let count = 0
    Object.values(level.permissoes || {}).forEach(perm => {
      if (perm.visualizar) count++
      if (perm.criar) count++
      if (perm.editar) count++
      if (perm.excluir) count++
    })
    return count
  }

  if (accessLevels.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Nenhum perfil encontrado</p>
          <p className="text-sm text-muted-foreground">
            Crie seu primeiro perfil de acesso para começar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Perfil</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Permissões</TableHead>
                <TableHead className="text-center">Usuários</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">
                    {level.nome}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {level.descricao || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={level.status === 'ativo' ? 'default' : 'secondary'}
                      className={cn(
                        "font-normal",
                        level.status === 'ativo' 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {level.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium">
                      {countActivePermissions(level)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {level.usuariosVinculados || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(level.atualizadoEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          disabled={isToggling === level.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onEdit(level)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(level)}
                          disabled={isToggling === level.id}
                          className="cursor-pointer"
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {level.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(level)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          disabled={level.usuariosVinculados && level.usuariosVinculados > 0}
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
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedLevel?.usuariosVinculados && selectedLevel.usuariosVinculados > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Não é possível excluir este perfil</span>
                  </div>
                  <p>
                    O perfil <strong>{selectedLevel?.nome}</strong> possui{' '}
                    <strong>{selectedLevel?.usuariosVinculados}</strong>{' '}
                    {selectedLevel?.usuariosVinculados === 1 ? 'usuário vinculado' : 'usuários vinculados'}.
                  </p>
                  <p>
                    Para excluir este perfil, primeiro remova todos os usuários vinculados a ele.
                  </p>
                </div>
              ) : (
                <>
                  Tem certeza que deseja excluir o perfil <strong>{selectedLevel?.nome}</strong>?
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            {(!selectedLevel?.usuariosVinculados || selectedLevel.usuariosVinculados === 0) && (
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
