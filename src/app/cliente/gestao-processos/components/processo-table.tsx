"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Eye, Edit, Trash2, History, Shield, ShieldOff } from "lucide-react"
import { 
  Processo,
  QualificacaoLabels,
  InstanciaLabels,
  NivelAcessoLabels
} from "../types"
import { ProcessoDeleteDialog } from "./processo-delete-dialog"
import { useRouter } from "next/navigation"

interface ProcessoTableProps {
  processos: Processo[]
  onDelete: (id: string) => Promise<{ success: boolean }>
  onUpdateAccess?: (id: string, access: string) => Promise<{ success: boolean }>
  userId?: string
}

export function ProcessoTable({ 
  processos, 
  onDelete, 
  onUpdateAccess,
  userId = "user@escritorio.com" 
}: ProcessoTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    
    const result = await onDelete(deleteId)
    if (result.success) {
      setDeleteId(null)
      setSelectedProcesso(null)
    }
  }

  const getAccessBadgeVariant = (access: string) => {
    switch (access) {
      case "publico":
        return "secondary"
      case "privado":
        return "destructive"
      case "envolvidos":
        return "outline"
      default:
        return "default"
    }
  }

  const formatCurrency = (value: string | undefined) => {
    if (!value) return "-"
    return value
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return "-"
    try {
      return new Date(date).toLocaleDateString("pt-BR")
    } catch {
      return date
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Processos Cadastrados</CardTitle>
              <CardDescription>
                Total de {processos.length} processo(s) encontrado(s)
              </CardDescription>
            </div>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push("/cliente/gestao-processos/novo")}
            >
              <Plus className="h-4 w-4" />
              Novo Processo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Pasta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Vara/Foro</TableHead>
                  <TableHead>Valor da Causa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="w-[100px]">Acesso</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum processo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  processos.map((processo) => (
                    <TableRow key={processo.id}>
                      <TableCell className="font-medium">
                        {processo.pasta}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{processo.nomeCliente}</div>
                          <div className="text-sm text-muted-foreground">
                            {QualificacaoLabels[processo.qualificacaoCliente]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{processo.titulo || processo.acao || "Sem título"}</div>
                          <div className="text-sm text-muted-foreground">
                            {processo.numero || "Sem número"}
                          </div>
                          {processo.instancia && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {InstanciaLabels[processo.instancia]}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{processo.vara || "-"}</div>
                          <div className="text-muted-foreground">{processo.foro || "-"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatCurrency(processo.valorCausa)}</div>
                          {processo.distribuidoEm && (
                            <div className="text-sm text-muted-foreground">
                              Dist: {formatDate(processo.distribuidoEm)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{processo.responsavel}</TableCell>
                      <TableCell>
                        <Badge variant={getAccessBadgeVariant(processo.acesso)}>
                          {NivelAcessoLabels[processo.acesso]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/cliente/gestao-processos/${processo.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/cliente/gestao-processos/${processo.id}/editar`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/cliente/gestao-processos/${processo.id}#historico`}>
                                <History className="mr-2 h-4 w-4" />
                                Histórico
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {processo.acesso === "privado" ? (
                              <DropdownMenuItem
                                onClick={() => onUpdateAccess?.(processo.id!, "publico")}
                              >
                                <ShieldOff className="mr-2 h-4 w-4" />
                                Tornar Público
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => onUpdateAccess?.(processo.id!, "privado")}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Tornar Privado
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedProcesso(processo)
                                setDeleteId(processo.id!)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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
        </CardContent>
      </Card>

      <ProcessoDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null)
            setSelectedProcesso(null)
          }
        }}
        onConfirm={handleDelete}
        processoTitle={selectedProcesso?.titulo || selectedProcesso?.pasta || ""}
      />
    </>
  )
}