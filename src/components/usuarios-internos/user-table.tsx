"use client"

// Componente de Tabela de Usuários
// Atende aos requisitos de listagem, busca e filtros

import { useState } from "react"
import { UsuarioInterno, STATUS_LABELS } from "@/lib/usuarios-internos/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Edit, Eye, Power, MoreHorizontal, History, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UserTableProps {
  usuarios: UsuarioInterno[]
  onStatusChange: (id: string, status: 'ativo' | 'inativo') => void
  onRefresh?: () => void
}

export function UserTable({ usuarios, onStatusChange, onRefresh }: UserTableProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<UsuarioInterno | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [statusAction, setStatusAction] = useState<'ativar' | 'desativar'>('desativar')

  const handleStatusClick = (user: UsuarioInterno) => {
    setSelectedUser(user)
    setStatusAction(user.status === 'ativo' ? 'desativar' : 'ativar')
    setShowStatusDialog(true)
  }

  const confirmStatusChange = () => {
    if (selectedUser) {
      const newStatus = statusAction === 'ativar' ? 'ativo' : 'inativo'
      onStatusChange(selectedUser.id, newStatus)
      
      toast.success(
        `Usuário ${statusAction === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`,
        { duration: 2000 }
      )
      
      setShowStatusDialog(false)
      setSelectedUser(null)
      onRefresh?.()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getPerfilNome = (perfilId: string) => {
    const perfis: Record<string, string> = {
      '1': 'Administrador',
      '2': 'Gerente',
      '3': 'Suporte',
      '4': 'Visualizador'
    }
    return perfis[perfilId] || 'Sem perfil'
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Perfil de Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={usuario.fotoPerfil} alt={usuario.nome} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(usuario.nome)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.telefone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getPerfilNome(usuario.perfilAcesso)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={usuario.status === 'ativo' ? 'default' : 'secondary'}
                      className={usuario.status === 'ativo' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {STATUS_LABELS[usuario.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}/editar`)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}/historico`)}
                          className="cursor-pointer"
                        >
                          <History className="mr-2 h-4 w-4" />
                          Histórico
                        </DropdownMenuItem>
                        {usuario.documentosAnexos && usuario.documentosAnexos.length > 0 && (
                          <DropdownMenuItem 
                            onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}/documentos`)}
                            className="cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Documentos ({usuario.documentosAnexos.length})
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusClick(usuario)}
                          className={`cursor-pointer ${
                            usuario.status === 'ativo' 
                              ? 'text-destructive' 
                              : 'text-green-600'
                          }`}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de status */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusAction === 'ativar' ? 'Ativar' : 'Desativar'} usuário
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {statusAction} o usuário{' '}
              <span className="font-semibold">{selectedUser?.nome}</span>?
              {statusAction === 'desativar' && (
                <>
                  <br />
                  <span className="text-destructive font-medium">
                    O login do usuário será bloqueado imediatamente.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={statusAction === 'desativar' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}