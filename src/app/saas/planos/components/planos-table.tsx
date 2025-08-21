"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star, StarOff, Power, PowerOff } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plano } from "../types"

interface PlanosTableProps {
  planos: Plano[]
  loading: boolean
  onNovoPlano: () => void
  onEditarPlano: (plano: Plano) => void
  onExcluirPlano: (plano: Plano) => void
  onAlterarStatus: (id: string, status: "ativo" | "inativo") => void
  onAlterarVisibilidade: (id: string, visivel: boolean) => void
  onAlterarRecomendado: (id: string, recomendado: boolean) => void
}

// Componente de tabela baseado no Table Layout do callistra-patterns.md
export function PlanosTable({
  planos,
  loading,
  onNovoPlano,
  onEditarPlano,
  onExcluirPlano,
  onAlterarStatus,
  onAlterarVisibilidade,
  onAlterarRecomendado
}: PlanosTableProps) {
  const [planoExcluir, setPlanoExcluir] = useState<Plano | null>(null)

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data?: Date) => {
    if (!data) return "Sem vencimento"
    return format(data, "dd/MM/yyyy", { locale: ptBR })
  }

  const getStatusBadge = (status: "ativo" | "inativo") => {
    return status === "ativo" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    )
  }

  const getVigenciaBadge = (vigencia?: Date) => {
    if (!vigencia) {
      return <Badge variant="outline">Permanente</Badge>
    }
    
    const hoje = new Date()
    const isExpirado = vigencia < hoje
    
    return isExpirado ? (
      <Badge variant="destructive">Expirado</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Vigente</Badge>
    )
  }

  // Simular verificação de assinantes (Standard e Premium têm assinantes)
  const temAssinantes = (id: string) => ["2", "3"].includes(id)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Gerenciamento de Planos</CardTitle>
            <CardDescription>
              Cadastro e gerenciamento de planos disponíveis no sistema
            </CardDescription>
          </div>
          <Button 
            onClick={onNovoPlano}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Adicionar Plano
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Table tradicional para maior densidade de dados jurídicos */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Forma Pagamento</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Processos</TableHead>
                <TableHead>Tokens IA</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Recomendado</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    Nenhum plano encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                planos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {plano.nome}
                        {plano.planoRecomendado && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>{getStatusBadge(plano.status)}</TableCell>
                    
                    <TableCell>{getVigenciaBadge(plano.vigencia)}</TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatarMoeda(plano.valor)}</div>
                        {plano.valorComDesconto && (
                          <div className="text-sm text-green-600">
                            Desconto: {formatarMoeda(plano.valorComDesconto)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-sm">{plano.formaPagamento}</TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">{plano.quantidadeUsuarios}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">{plano.quantidadeProcessos}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">
                        {plano.quantidadeTokensMensais.toLocaleString()}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAlterarVisibilidade(plano.id, !plano.visivelSite)}
                        className="h-8 w-8 p-0"
                      >
                        {plano.visivelSite ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAlterarRecomendado(plano.id, !plano.planoRecomendado)}
                        className="h-8 w-8 p-0"
                      >
                        {plano.planoRecomendado ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditarPlano(plano)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => onAlterarStatus(
                              plano.id, 
                              plano.status === "ativo" ? "inativo" : "ativo"
                            )}
                          >
                            {plano.status === "ativo" ? (
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
                          
                          {/* Verificação de assinantes antes de permitir exclusão */}
                          {temAssinantes(plano.id) ? (
                            <DropdownMenuItem disabled className="text-gray-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir (há assinantes)
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => setPlanoExcluir(plano)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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
        </div>

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!planoExcluir} onOpenChange={() => setPlanoExcluir(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o plano "{planoExcluir?.nome}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPlanoExcluir(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (planoExcluir) {
                    onExcluirPlano(planoExcluir)
                    setPlanoExcluir(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
