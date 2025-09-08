"use client"

import { User, UserStatus } from "../types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Edit, 
  MoreVertical, 
  Power, 
  History, 
  Eye,
  UserRound
} from "lucide-react"
import { useRouter } from "next/navigation"

interface UserTableProps {
  users: User[]
  loading: boolean
  onToggleStatus: (id: string) => void
  onViewHistory: (user: User) => void
}

export function UserTable({ 
  users, 
  loading, 
  onToggleStatus,
  onViewHistory
}: UserTableProps) {
  const router = useRouter()

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2)
  }

  const formatPhone = (phone: string) => {
    // Formatar telefone para exibição
    return phone.replace(/(\+\d{2})\s?(\(\d{2}\))\s?(\d{4,5})-?(\d{4})/, "$1 $2 $3-$4")
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Carregando usuários...</div>
      </div>
    )
  }

  if (!loading && users.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <UserRound className="h-12 w-12 text-muted-foreground" />
        <div className="text-muted-foreground">Nenhum usuário encontrado</div>
      </div>
    )
  }

  return (
    <TooltipProvider>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.fotoPerfil} alt={user.nome} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {getInitials(user.nome).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                
                <TableCell className="font-medium">
                  <div>
                    <div>{user.nome}</div>
                    {user.especialidades && user.especialidades.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.especialidades.slice(0, 2).map((esp, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                        {user.especialidades.length > 2 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="text-xs">
                                +{user.especialidades.length - 2}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                {user.especialidades.slice(2).map((esp, idx) => (
                                  <div key={idx}>{esp}</div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>{user.cargo}</TableCell>
                
                <TableCell className="text-sm">{user.email}</TableCell>
                
                <TableCell className="text-sm">{formatPhone(user.telefone)}</TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {user.perfilAcesso}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={
                      user.status === UserStatus.ATIVO 
                        ? "bg-green-100 text-green-700 hover:bg-green-100" 
                        : ""
                    }
                  >
                    {user.status}
                  </Badge>
                  {user.status === UserStatus.INATIVO && user.inativadoEm && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-muted-foreground mt-1 cursor-help">
                          Desde {new Date(user.inativadoEm).toLocaleDateString('pt-BR')}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        Inativado por {user.inativadoPor}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem
                        onClick={() => router.push(`/cliente/usuarios-internos/${user.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => router.push(`/cliente/usuarios-internos/${user.id}/editar`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(user.id)}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {user.status === UserStatus.ATIVO ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => onViewHistory(user)}
                      >
                        <History className="mr-2 h-4 w-4" />
                        Ver Histórico
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
