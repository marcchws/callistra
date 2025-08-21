"use client"

import React, { useState } from "react"
import { 
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  Shield,
  Users,
  Activity,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useNiveisAcesso } from "./use-niveis-acesso"
import { FormPerfilAcesso } from "./form-perfil-acesso"
import { PerfilAcesso } from "./types"

export default function NiveisAcessoPage() {
  const {
    perfis,
    loading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    criarPerfil,
    editarPerfil,
    alterarStatus,
    excluirPerfil,
    totalPerfis,
    perfisAtivos,
    perfisInativos
  } = useNiveisAcesso()

  const [formOpen, setFormOpen] = useState(false)
  const [perfilEdicao, setPerfilEdicao] = useState<PerfilAcesso | undefined>()

  // Abrir formulário para criar novo perfil
  const handleNovoPerfil = () => {
    setPerfilEdicao(undefined)
    setFormOpen(true)
  }

  // Abrir formulário para editar perfil
  const handleEditarPerfil = (perfil: PerfilAcesso) => {
    setPerfilEdicao(perfil)
    setFormOpen(true)
  }

  // Submeter formulário (criar ou editar)
  const handleSubmitForm = async (data: any) => {
    if (perfilEdicao) {
      return await editarPerfil(perfilEdicao.id, data)
    } else {
      return await criarPerfil(data)
    }
  }

  // Alternar status do perfil
  const handleAlterarStatus = async (perfil: PerfilAcesso) => {
    const novoStatus = perfil.status === "ativo" ? "inativo" : "ativo"
    await alterarStatus(perfil.id, novoStatus)
  }

  // Excluir perfil
  const handleExcluirPerfil = async (id: string) => {
    await excluirPerfil(id)
  }

  // Formatação de data
  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(data)
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Níveis de Acesso</h1>
              <p className="text-muted-foreground">
                Gerencie perfis de acesso e permissões do sistema de forma granular
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Perfis</p>
                      <p className="text-2xl font-bold">{totalPerfis}</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Perfis Ativos</p>
                      <p className="text-2xl font-bold text-green-600">{perfisAtivos}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Perfis Inativos</p>
                      <p className="text-2xl font-bold text-red-600">{perfisInativos}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Em Uso</p>
                      <p className="text-2xl font-bold text-blue-600">{perfisAtivos}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Perfis de Acesso</CardTitle>
                    <CardDescription>
                      Configure permissões específicas para diferentes tipos de usuários
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleNovoPerfil}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Perfil
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="ativo">Apenas Ativos</SelectItem>
                      <SelectItem value="inativo">Apenas Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome do Perfil</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <Activity className="h-4 w-4 animate-spin mr-2" />
                            Carregando perfis...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : perfis.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm || statusFilter !== "todos" 
                            ? "Nenhum perfil encontrado com os filtros aplicados"
                            : "Nenhum perfil cadastrado ainda"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      perfis.map((perfil) => (
                        <TableRow key={perfil.id}>
                          <TableCell className="font-medium">#{perfil.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{perfil.nome}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {perfil.descricao || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={perfil.status === "ativo" ? "default" : "secondary"}
                              className={perfil.status === "ativo" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                              }
                            >
                              {perfil.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {perfil.permissoes.length} telas configuradas
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatarData(perfil.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditarPerfil(perfil)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleAlterarStatus(perfil)}
                                >
                                  {perfil.status === "ativo" ? (
                                    <>
                                      <PowerOff className="mr-2 h-4 w-4" />
                                      Desativar
                                    </>
                                  ) : (
                                    <>
                                      <Power className="mr-2 h-4 w-4" />
                                      Ativar
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir Perfil
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir o perfil "{perfil.nome}"? 
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleExcluirPerfil(perfil.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Modal de formulário */}
            <FormPerfilAcesso
              open={formOpen}
              onClose={() => setFormOpen(false)}
              onSubmit={handleSubmitForm}
              perfil={perfilEdicao}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
