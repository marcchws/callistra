"use client"

import { useState } from "react"
import { Plus, Search, Filter, User, UserCheck, UserX, Clock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUsuariosInternos } from "./use-usuarios-internos"
import { UsuarioForm } from "./components/usuario-form"
import { UsuarioDetails } from "./components/usuario-details"
import { HistoricoAuditoria } from "./components/historico-auditoria"
import { UsuarioInterno } from "./types"
import { cn } from "@/lib/utils"

export default function UsuariosInternosPage() {
  const {
    usuarios,
    loading,
    error,
    filtros,
    modalAberto,
    usuarioSelecionado,
    historicoAberto,
    dadosApoio,
    atualizarFiltros,
    abrirModal,
    fecharModal,
    abrirHistorico,
    fecharHistorico,
    criarUsuario,
    editarUsuario,
    desativarUsuario,
    ativarUsuario
  } = useUsuariosInternos()

  const [usuarioDesativar, setUsuarioDesativar] = useState<UsuarioInterno | null>(null)
  const [motivoDesativacao, setMotivoDesativacao] = useState("")

  // Estatísticas para dashboard baseadas nos Requirements
  const estatisticas = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === "ATIVO").length,
    inativos: usuarios.filter(u => u.status === "INATIVO").length,
    semFoto: usuarios.filter(u => !u.fotoPerfil).length
  }

  // Aplicar padrões obrigatórios do callistra-patterns.md
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar já está implementada globalmente */}
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header seguindo Typography Hierarchy corporativa */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Usuários Internos</h1>
              <p className="text-muted-foreground">
                Cadastro, edição, busca, filtragem e gerenciamento completo de usuários internos com controle de permissões e rastreabilidade
              </p>
            </div>

            {/* Cards de Estatísticas - Densidade Balanceada */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estatisticas.total}</div>
                  <p className="text-sm text-muted-foreground">usuários cadastrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{estatisticas.ativos}</div>
                  <p className="text-sm text-muted-foreground">usuários ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <UserX className="h-5 w-5 text-red-600" />
                    Inativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{estatisticas.inativos}</div>
                  <p className="text-sm text-muted-foreground">usuários inativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5 text-orange-600" />
                    Sem Foto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{estatisticas.semFoto}</div>
                  <p className="text-sm text-muted-foreground">precisam de foto</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e Busca - Requirements: busca por Nome, Cargo, E-mail + filtros por Status e Cargo */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">Filtros e Busca</CardTitle>
                <CardDescription>
                  Busque por nome, cargo ou e-mail e aplique filtros para encontrar usuários específicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Busca por Nome, Cargo, E-mail conforme Requirements */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome, cargo ou e-mail..."
                        value={filtros.busca}
                        onChange={(e) => atualizarFiltros({ busca: e.target.value })}
                        className="pl-10 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Filtros conforme Requirements */}
                  <div className="flex gap-3">
                    <Select
                      value={filtros.status}
                      onValueChange={(value) => atualizarFiltros({ status: value as any })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="ATIVO">Ativo</SelectItem>
                        <SelectItem value="INATIVO">Inativo</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filtros.cargo}
                      onValueChange={(value) => atualizarFiltros({ cargo: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os cargos</SelectItem>
                        {dadosApoio.cargos.map((cargo) => (
                          <SelectItem key={cargo.id} value={cargo.nome}>
                            {cargo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filtros.perfilAcesso}
                      onValueChange={(value) => atualizarFiltros({ perfilAcesso: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Perfil de Acesso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os perfis</SelectItem>
                        {dadosApoio.perfisAcesso.map((perfil) => (
                          <SelectItem key={perfil.id} value={perfil.nome}>
                            {perfil.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Usuários - Table Style Tradicional para densidade de dados jurídicos */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">Usuários Internos</CardTitle>
                    <CardDescription>
                      Lista completa de usuários com informações de perfil, status e ações disponíveis
                    </CardDescription>
                  </div>
                  <Button 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => abrirModal("CRIAR")}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Perfil de Acesso</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading state
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={8}>
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : usuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <User className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {filtros.busca || filtros.status !== "TODOS" || filtros.cargo || filtros.perfilAcesso
                                ? "Nenhum usuário encontrado com os filtros aplicados"
                                : "Nenhum usuário cadastrado"
                              }
                            </p>
                            {!filtros.busca && filtros.status === "TODOS" && !filtros.cargo && !filtros.perfilAcesso && (
                              <Button 
                                variant="outline" 
                                onClick={() => abrirModal("CRIAR")}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar primeiro usuário
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          {/* Usuário com foto e informações básicas */}
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={usuario.fotoPerfil} alt={usuario.nome} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {usuario.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{usuario.nome}</p>
                                <p className="text-sm text-muted-foreground">ID: {usuario.id}</p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Cargo */}
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {usuario.cargo}
                            </Badge>
                          </TableCell>

                          {/* Contato */}
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{usuario.email}</p>
                              <p className="text-sm text-muted-foreground">{usuario.telefone}</p>
                            </div>
                          </TableCell>

                          {/* Perfil de Acesso */}
                          <TableCell>
                            <Badge variant="secondary" className="font-normal">
                              {usuario.perfilAcesso}
                            </Badge>
                          </TableCell>

                          {/* Especialidades */}
                          <TableCell>
                            {usuario.especialidades.length > 0 ? (
                              <div className="space-y-1">
                                {usuario.especialidades.slice(0, 2).map((esp, index) => (
                                  <Badge key={index} variant="outline" className="text-xs mr-1">
                                    {esp}
                                  </Badge>
                                ))}
                                {usuario.especialidades.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{usuario.especialidades.length - 2} mais
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Badge 
                              variant={usuario.status === "ATIVO" ? "default" : "destructive"}
                              className={cn(
                                "font-medium",
                                usuario.status === "ATIVO" && "bg-green-100 text-green-800 hover:bg-green-200"
                              )}
                            >
                              {usuario.status}
                            </Badge>
                          </TableCell>

                          {/* Última Atualização */}
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">
                                {usuario.updatedAt.toLocaleDateString("pt-BR")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                por {usuario.updatedBy}
                              </p>
                            </div>
                          </TableCell>

                          {/* Ações */}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Ações
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => abrirModal("VISUALIZAR", usuario)}>
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => abrirModal("EDITAR", usuario)}>
                                  Editar dados
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => abrirHistorico(usuario)}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Ver histórico
                                </DropdownMenuItem>
                                <Separator className="my-1" />
                                {usuario.status === "ATIVO" ? (
                                  <DropdownMenuItem 
                                    onClick={() => setUsuarioDesativar(usuario)}
                                    className="text-red-600"
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    Desativar usuário
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => ativarUsuario(usuario.id)}
                                    className="text-green-600"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Ativar usuário
                                  </DropdownMenuItem>
                                )}
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
          </div>
        </div>
      </main>

      {/* Modal de Criação/Edição - Modal Layout padrão */}
      {(modalAberto === "CRIAR" || modalAberto === "EDITAR") && (
        <Dialog open={true} onOpenChange={fecharModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modalAberto === "CRIAR" ? "Criar Novo Usuário" : "Editar Usuário"}
              </DialogTitle>
              <DialogDescription>
                {modalAberto === "CRIAR" 
                  ? "Preencha os dados para criar um novo usuário interno do sistema"
                  : "Atualize as informações do usuário selecionado"
                }
              </DialogDescription>
            </DialogHeader>
            
            <UsuarioForm
              usuario={usuarioSelecionado}
              dadosApoio={dadosApoio}
              onSubmit={modalAberto === "CRIAR" ? criarUsuario : editarUsuario}
              onCancel={fecharModal}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Visualização */}
      {modalAberto === "VISUALIZAR" && usuarioSelecionado && (
        <Dialog open={true} onOpenChange={fecharModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
              <DialogDescription>
                Informações completas do usuário selecionado
              </DialogDescription>
            </DialogHeader>
            
            <UsuarioDetails
              usuario={usuarioSelecionado}
              dadosApoio={dadosApoio}
              onEdit={() => abrirModal("EDITAR", usuarioSelecionado)}
              onViewHistory={() => abrirHistorico(usuarioSelecionado)}
              onClose={fecharModal}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* AlertDialog de Confirmação de Desativação - Cenário 5 */}
      {usuarioDesativar && (
        <AlertDialog open={true} onOpenChange={() => setUsuarioDesativar(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Desativar Usuário</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Tem certeza que deseja desativar o usuário <strong>{usuarioDesativar.nome}</strong>?
                </p>
                <p className="text-sm text-muted-foreground">
                  Esta ação irá:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Bloquear o login do usuário no sistema</li>
                  <li>Transferir todas as atividades para o Admin Master</li>
                  <li>Manter o usuário na listagem por 1 ano para auditoria</li>
                </ul>
                <div className="mt-4">
                  <label className="text-sm font-medium">Motivo da desativação (opcional):</label>
                  <textarea
                    value={motivoDesativacao}
                    onChange={(e) => setMotivoDesativacao(e.target.value)}
                    placeholder="Informe o motivo da desativação..."
                    className="mt-1 w-full p-2 border rounded-md text-sm"
                    rows={3}
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setUsuarioDesativar(null)
                setMotivoDesativacao("")
              }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await desativarUsuario(usuarioDesativar.id, motivoDesativacao || undefined)
                  setUsuarioDesativar(null)
                  setMotivoDesativacao("")
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Desativação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Modal de Histórico de Auditoria */}
      {historicoAberto && usuarioSelecionado && (
        <Dialog open={true} onOpenChange={fecharHistorico}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Histórico de Auditoria</DialogTitle>
              <DialogDescription>
                Registro completo de todas as ações realizadas no usuário {usuarioSelecionado.nome}
              </DialogDescription>
            </DialogHeader>
            
            <HistoricoAuditoria
              usuarioId={usuarioSelecionado.id}
              onClose={fecharHistorico}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}