"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, FileText, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { PesquisaForm } from "./components/pesquisa-form"
import { PesquisaResults } from "./components/pesquisa-results"
import { PesquisaFiltersComponent } from "./components/pesquisa-filters"
import { usePesquisasNPS } from "./use-pesquisas-nps"
import { 
  Pesquisa, 
  StatusPesquisa, 
  Periodicidade,
  TipoPergunta,
  PerfilUsuario,
  Usuario
} from "./types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

export default function PesquisasNPSPage() {
  const {
    pesquisas: filteredPesquisas,
    respostas: filteredRespostas,
    perfis,
    usuarios,
    loading,
    filters,
    setFilters,
    respostaFilters,
    setRespostaFilters,
    createPesquisa,
    updatePesquisa,
    deletePesquisa,
    toggleStatus,
    getRespostasPorPesquisa,
    getEstatisticas,
    searchUsuarios,
    exportarDados
  } = usePesquisasNPS()

  // Estados locais do componente
  const [showForm, setShowForm] = useState(false)
  const [editingPesquisa, setEditingPesquisa] = useState<Pesquisa | undefined>()
  const [deletingPesquisa, setDeletingPesquisa] = useState<Pesquisa | undefined>()
  const [selectedPesquisa, setSelectedPesquisa] = useState<Pesquisa | undefined>()
  const [activeTab, setActiveTab] = useState("list")

  // Cenário 1: Criar pesquisa NPS com perguntas
  const handleCreate = () => {
    setEditingPesquisa(undefined)
    setShowForm(true)
  }

  // Cenário 8: Editar pesquisa existente
  const handleEdit = (pesquisa: Pesquisa) => {
    setEditingPesquisa(pesquisa)
    setShowForm(true)
  }

  // Cenário 9: Excluir pesquisa (com confirmação)
  const handleDelete = async () => {
    if (!deletingPesquisa) return
    
    try {
      await deletePesquisa(deletingPesquisa.id)
      setDeletingPesquisa(undefined)
      toast.success("Pesquisa excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir pesquisa")
    }
  }

  // Salvar pesquisa (criar ou atualizar)
  const handleSubmit = async (data: any) => {
    try {
      if (editingPesquisa) {
        await updatePesquisa(editingPesquisa.id, data)
        toast.success("Pesquisa atualizada com sucesso!")
      } else {
        await createPesquisa(data)
        toast.success("Pesquisa criada com sucesso!")
      }
      setShowForm(false)
      setEditingPesquisa(undefined)
    } catch (error) {
      toast.error("Erro ao salvar pesquisa")
    }
  }

  // Cenário 7: Visualizar respostas na aba de resultados
  const handleViewResults = (pesquisa: Pesquisa) => {
    setSelectedPesquisa(pesquisa)
    setActiveTab("results")
  }

  // Ativar/Desativar pesquisa
  const handleToggleStatus = async (pesquisa: Pesquisa) => {
    try {
      await toggleStatus(pesquisa.id)
      const action = pesquisa.status === StatusPesquisa.ATIVA ? "desativada" : "ativada"
      toast.success(`Pesquisa ${action} com sucesso!`)
    } catch (error) {
      toast.error("Erro ao alterar status da pesquisa")
    }
  }

  // Cenário 10: Exportar resultados
  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!selectedPesquisa) return
    try {
      await exportarDados(selectedPesquisa.id, format)
      toast.success(`Resultados exportados em ${format.toUpperCase()}`)
    } catch (error) {
      toast.error("Erro ao exportar resultados")
    }
  }

  // Mapear periodicidade para texto
  const getPeriodicityText = (periodicity: string, months?: number) => {
    switch (periodicity) {
      case Periodicidade.UNICA:
        return "Única"
      case Periodicidade.RECORRENTE:
        return `Recorrente (${months || 0} meses)`
      case Periodicidade.POR_LOGIN:
        return "Após login"
      default:
        return periodicity
    }
  }

  // Mapear status para badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case StatusPesquisa.ATIVA:
        return "default"
      case StatusPesquisa.INATIVA:
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Mapear status para texto
  const getStatusText = (status: string) => {
    switch (status) {
      case StatusPesquisa.ATIVA:
        return "Ativa"
      case StatusPesquisa.INATIVA:
        return "Inativa"
      case StatusPesquisa.RASCUNHO:
        return "Rascunho"
      default:
        return status
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Pesquisas NPS</h1>
              <p className="text-muted-foreground">
                Crie e gerencie pesquisas de satisfação para medir o NPS dos seus clientes
              </p>
            </div>

            {/* Tabs principais */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="list">
                    <FileText className="h-4 w-4 mr-2" />
                    Pesquisas
                  </TabsTrigger>
                  <TabsTrigger value="results" disabled={!selectedPesquisa}>
                    <BarChart className="h-4 w-4 mr-2" />
                    Resultados
                  </TabsTrigger>
                </TabsList>
                
                {activeTab === "list" && (
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Pesquisa
                  </Button>
                )}
              </div>

              {/* Tab: Lista de Pesquisas */}
              <TabsContent value="list" className="space-y-4">
                {/* Filtros */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PesquisaFiltersComponent
                      filters={filters}
                      onFilterChange={setFilters}
                      perfis={perfis}
                    />
                  </CardContent>
                </Card>

                {/* Tabela de Pesquisas */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">
                      Pesquisas Cadastradas ({filteredPesquisas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Perguntas</TableHead>
                          <TableHead>Periodicidade</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Respostas</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPesquisas.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nenhuma pesquisa cadastrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPesquisas.map((pesquisa) => (
                            <TableRow key={pesquisa.id}>
                              <TableCell className="font-medium">{pesquisa.nome}</TableCell>
                              <TableCell>{pesquisa.perguntas.length}</TableCell>
                              <TableCell>
                                {getPeriodicityText(pesquisa.periodicidade, pesquisa.intervaloMeses)}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{format(pesquisa.dataInicio, "dd/MM/yyyy", { locale: ptBR })}</div>
                                  {pesquisa.dataTermino && (
                                    <div className="text-muted-foreground">
                                      até {format(pesquisa.dataTermino, "dd/MM/yyyy", { locale: ptBR })}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {pesquisa.totalRespostas}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(pesquisa.status)}>
                                  {getStatusText(pesquisa.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewResults(pesquisa)}
                                    disabled={pesquisa.totalRespostas === 0}
                                  >
                                    <BarChart className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleStatus(pesquisa)}
                                  >
                                    {pesquisa.status === StatusPesquisa.ATIVA ? (
                                      <ToggleRight className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(pesquisa)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingPesquisa(pesquisa)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Resultados */}
              <TabsContent value="results">
                {selectedPesquisa && (
                  <div className="space-y-4">
                    {/* Header da pesquisa selecionada */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold">
                              {selectedPesquisa.nome}
                            </CardTitle>
                            <CardDescription>
                              {selectedPesquisa.perguntas.length} perguntas • 
                              {getPeriodicityText(selectedPesquisa.periodicidade, selectedPesquisa.intervaloMeses)} • 
                              Status: {getStatusText(selectedPesquisa.status)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedPesquisa(undefined)
                              setActiveTab("list")
                            }}
                          >
                            Voltar
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Componente de Resultados */}
                    <PesquisaResults
                      pesquisa={selectedPesquisa}
                      respostas={getRespostasPorPesquisa(selectedPesquisa.id)}
                      perfis={perfis}
                      filters={respostaFilters}
                      onFilterChange={setRespostaFilters}
                      onExport={handleExport}
                      getEstatisticas={getEstatisticas}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Dialog para criar/editar pesquisa */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPesquisa ? "Editar Pesquisa" : "Nova Pesquisa NPS"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados abaixo para {editingPesquisa ? "atualizar" : "criar"} a pesquisa
                  </DialogDescription>
                </DialogHeader>
                <PesquisaForm
                  pesquisa={editingPesquisa}
                  perfis={perfis}
                  usuarios={usuarios}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingPesquisa(undefined)
                  }}
                  searchUsuarios={searchUsuarios}
                />
              </DialogContent>
            </Dialog>

            {/* Dialog de confirmação para exclusão */}
            <AlertDialog open={!!deletingPesquisa} onOpenChange={(open) => !open && setDeletingPesquisa(undefined)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a pesquisa "{deletingPesquisa?.nome}"? 
                    Esta ação não pode ser desfeita e todas as respostas serão perdidas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeletingPesquisa(undefined)}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  )
}
