"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, FileText, DollarSign, Plus, Paperclip } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Cliente, formatarCpfCnpj, formatarTelefone } from "../types"

interface ClienteListProps {
  clientes: Cliente[]
  loading: boolean
  onView: (cliente: Cliente) => void
  onEdit: (cliente: Cliente) => void
  onDelete: (id: string) => void
  onViewFinanceiro: (cliente: Cliente) => void
  onViewDocumentos: (cliente: Cliente) => void
  onAdd: () => void
}

export function ClienteList({ 
  clientes, 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onViewFinanceiro,
  onViewDocumentos,
  onAdd 
}: ClienteListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "pessoa_fisica":
        return "Pessoa Física"
      case "pessoa_juridica":
        return "Pessoa Jurídica"
      case "parceiro":
        return "Parceiro"
      default:
        return tipo
    }
  }

  if (loading && clientes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando clientes...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>
                Gerencie os clientes do escritório
              </CardDescription>
            </div>
            <Button 
              onClick={onAdd}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar Cliente
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {clientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum cliente cadastrado ainda
              </p>
              <Button 
                onClick={onAdd}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Cliente
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome/Razão Social</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Confidencial</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.nome}
                        {cliente.responsavel && (
                          <span className="block text-xs text-muted-foreground">
                            Resp: {cliente.responsavel}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatarCpfCnpj(cliente.cpfCnpj)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTipoLabel(cliente.tipo)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatarTelefone(cliente.telefone)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {cliente.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={cliente.status === "ativo" ? "default" : "secondary"}
                          className={cliente.status === "ativo" ? "bg-green-100 text-green-800" : ""}
                        >
                          {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {cliente.confidencial && (
                          <Badge variant="destructive">
                            Confidencial
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onView(cliente)}
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visualizar detalhes</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEdit(cliente)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar cliente</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onViewDocumentos(cliente)}
                                  className="h-8 w-8"
                                >
                                  <Paperclip className="h-4 w-4" />
                                  {cliente.anexos && cliente.anexos.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center">
                                      {cliente.anexos.length}
                                    </span>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Documentos anexados</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onViewFinanceiro(cliente)}
                                  className="h-8 w-8"
                                >
                                  <DollarSign className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Histórico financeiro</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteId(cliente.id)}
                                  className="h-8 w-8 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Excluir cliente</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              Todos os dados relacionados ao cliente serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}