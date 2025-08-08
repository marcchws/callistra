"use client"

import { useState } from "react"
import { Plano, PlanoFilters } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, Filter } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PlanoListProps {
  planos: Plano[]
  loading?: boolean
  onAdd: () => void
  onEdit: (plano: Plano) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

// COMPONENTE SEGUINDO TABLE LAYOUT DO CALLISTRA-PATTERNS.MD
export function PlanoList({ planos, loading = false, onAdd, onEdit, onDelete, onToggleStatus }: PlanoListProps) {
  const [filters, setFilters] = useState<PlanoFilters>({
    busca: "",
    status: "todos",
    precoMin: null,
    precoMax: null
  })

  // FILTRAR PLANOS BASEADO NOS FILTROS
  const planosFiltrados = planos.filter(plano => {
    const matchBusca = !filters.busca || 
      plano.nome.toLowerCase().includes(filters.busca.toLowerCase()) ||
      plano.descricao.toLowerCase().includes(filters.busca.toLowerCase())
    
    const matchStatus = filters.status === "todos" || 
      (filters.status === "ativo" && plano.ativo) ||
      (filters.status === "inativo" && !plano.ativo)
    
    const matchPrecoMin = !filters.precoMin || plano.precoMensal >= filters.precoMin
    const matchPrecoMax = !filters.precoMax || plano.precoMensal <= filters.precoMax
    
    return matchBusca && matchStatus && matchPrecoMin && matchPrecoMax
  })

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR })
  }

  const contarRecursos = (recursos: Plano['recursos']) => {
    return Object.values(recursos).filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      {/* FILTROS */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome ou descrição..."
                  value={filters.busca}
                  onChange={(e) => setFilters(prev => ({ ...prev, busca: e.target.value }))}
                  className="pl-10 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value: 'todos' | 'ativo' | 'inativo') => 
                  setFilters(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço Mín. (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.precoMin || ""}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  precoMin: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                className="focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço Máx. (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.precoMax || ""}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  precoMax: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                className="focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABELA - SEGUINDO TABLE LAYOUT PATTERN */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Planos</CardTitle>
              <CardDescription>
                {planosFiltrados.length} de {planos.length} planos encontrados
              </CardDescription>
            </div>
            <Button 
              onClick={onAdd}
              disabled={loading}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar Plano
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* TABLE TRADICIONAL PARA MAIOR DENSIDADE DE DADOS */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço Mensal</TableHead>
                <TableHead>Preço Anual</TableHead>
                <TableHead>Limitações</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Carregando planos...
                    </div>
                  </TableCell>
                </TableRow>
              ) : planosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {planos.length === 0 ? "Nenhum plano cadastrado" : "Nenhum plano encontrado com os filtros aplicados"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                planosFiltrados.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{plano.nome}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {plano.descricao}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={plano.ativo ? "default" : "secondary"}>
                        {plano.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">
                        {formatarMoeda(plano.precoMensal)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatarMoeda(plano.precoAnual)}
                        </div>
                        <div className="text-sm text-green-600">
                          Economia: {formatarMoeda((plano.precoMensal * 12) - plano.precoAnual)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{plano.limitacoes.maxUsuarios} usuários</div>
                        <div>{plano.limitacoes.maxProcessos} processos</div>
                        <div>{plano.limitacoes.storageGB} GB</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {contarRecursos(plano.recursos)}/10
                        </span>
                        <span className="text-sm text-muted-foreground">recursos</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatarData(plano.dataAtualizacao)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(plano.id)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          {plano.ativo ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(plano)}
                          disabled={loading}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={loading}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o plano "{plano.nome}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(plano.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
