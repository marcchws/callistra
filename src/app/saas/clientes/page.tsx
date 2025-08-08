"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Search, Download, MoreVertical, Eye, Edit, ToggleLeft, ToggleRight, RefreshCw, Settings, Users, FileText, Zap, X, Filter } from "lucide-react"
import { useClientes } from "./use-clientes"
import { Cliente, ClienteOperation } from "./types"
import { CadastroClienteDialog } from "./cadastro-cliente-dialog"
import { TrocaPlanoDialog } from "./troca-plano-dialog"
import { AlteracaoTitularidadeDialog } from "./alteracao-titularidade-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const statusConfig = {
  ativa: { label: "Ativa", variant: "default" as const, className: "bg-green-100 text-green-800" },
  inativa: { label: "Inativa", variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
  inadimplente: { label: "Inadimplente", variant: "destructive" as const, className: "bg-red-100 text-red-800" }
}

export default function ClientesPage() {
  const {
    clientes,
    loading,
    error,
    filters,
    setFilters,
    toggleStatusCliente,
    exportarDados,
    limparFiltros,
    totalFiltrados
  } = useClientes()

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [operation, setOperation] = useState<ClienteOperation | null>(null)
  const [showCadastro, setShowCadastro] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [showConfirmToggle, setShowConfirmToggle] = useState(false)

  // HANDLERS BASEADOS NOS ACCEPTANCE CRITERIA
  const handleBusca = (value: string) => {
    setFilters(prev => ({ ...prev, busca: value }))
  }

  const handleFiltroPlano = (value: string) => {
    setFilters(prev => ({ ...prev, plano: value }))
  }

  const handleFiltroStatus = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as any }))
  }

  const handleToggleStatus = async () => {
    if (!selectedCliente) return
    
    await toggleStatusCliente(selectedCliente.id)
    setShowConfirmToggle(false)
    setSelectedCliente(null)
  }

  const handleExportar = async (format: 'pdf' | 'excel') => {
    await exportarDados({ format, filters })
  }

  const openOperation = (cliente: Cliente, op: ClienteOperation) => {
    setSelectedCliente(cliente)
    setOperation(op)
    
    if (op === 'toggle-status') {
      setShowConfirmToggle(true)
    }
  }

  const closeDialogs = () => {
    setSelectedCliente(null)
    setOperation(null)
    setShowDetalhes(false)
    setShowConfirmToggle(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  const temFiltrosAtivos = filters.busca || filters.plano !== "todos" || filters.status !== "todos"

  return (
    <div className="space-y-6">
      {/* HEADER - BASEADO NO LAYOUT TEMPLATE */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes SaaS</h1>
        <p className="text-muted-foreground">
          Gerenciamento completo dos escritórios clientes cadastrados no sistema
        </p>
      </div>

      {/* FILTROS E AÇÕES - BASEADO NOS ACCEPTANCE CRITERIA */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {totalFiltrados} cliente{totalFiltrados !== 1 ? 's' : ''} encontrado{totalFiltrados !== 1 ? 's' : ''}
                {temFiltrosAtivos && " (filtrado)"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExportar('pdf')}>
                    Exportar PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportar('excel')}>
                    Exportar Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={() => setShowCadastro(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Cliente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* FILTROS - BASEADOS NOS CENÁRIOS DE USO */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, nome da empresa ou e-mail..."
                value={filters.busca}
                onChange={(e) => handleBusca(e.target.value)}
                className="pl-10 focus:ring-blue-500"
              />
            </div>
            <Select value={filters.plano} onValueChange={handleFiltroPlano}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os planos</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={handleFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="inativa">Inativa</SelectItem>
                <SelectItem value="inadimplente">Inadimplente</SelectItem>
              </SelectContent>
            </Select>
            {temFiltrosAtivos && (
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* TABELA - BASEADA NO TABLE STYLE TRADICIONAL */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Escritório</TableHead>
                  <TableHead>Contratante</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Processos</TableHead>
                  <TableHead>Tokens IA</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Carregando clientes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      {temFiltrosAtivos ? "Nenhum cliente encontrado com os filtros aplicados" : "Nenhum cliente cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={cliente.nomeEscritorio}>
                        {cliente.nomeEscritorio}
                      </TableCell>
                      <TableCell>{cliente.nomeContratante}</TableCell>
                      <TableCell>{cliente.emailContratante}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cliente.nomePlano}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig[cliente.status].variant}
                          className={statusConfig[cliente.status].className}
                        >
                          {statusConfig[cliente.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(cliente.vigenciaPlano)}</TableCell>
                      <TableCell>{formatCurrency(cliente.valorPlano)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {cliente.quantidadeUsuarios.usado}/{cliente.quantidadeUsuarios.disponivel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {cliente.quantidadeProcessos.usado}/{cliente.quantidadeProcessos.disponivel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          {cliente.tokensIA.usado}/{cliente.tokensIA.disponivel}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedCliente(cliente)
                              setShowDetalhes(true)
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openOperation(cliente, 'change-plan')}>
                              <Settings className="mr-2 h-4 w-4" />
                              Trocar plano
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openOperation(cliente, 'change-ownership')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Alterar titularidade
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openOperation(cliente, 'toggle-status')}>
                              {cliente.status === 'ativa' ? (
                                <>
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                  Inativar cliente
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                  Ativar cliente
                                </>
                              )}
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

      {/* DIALOGS - BASEADOS NOS ACCEPTANCE CRITERIA */}
      
      {/* Cadastro de Cliente */}
      <CadastroClienteDialog 
        open={showCadastro}
        onClose={() => setShowCadastro(false)}
      />

      {/* Troca de Plano */}
      {operation === 'change-plan' && selectedCliente && (
        <TrocaPlanoDialog
          open={true}
          onClose={closeDialogs}
          cliente={selectedCliente}
        />
      )}

      {/* Alteração de Titularidade */}
      {operation === 'change-ownership' && selectedCliente && (
        <AlteracaoTitularidadeDialog
          open={true}
          onClose={closeDialogs}
          cliente={selectedCliente}
        />
      )}

      {/* Confirmação de Toggle Status */}
      <AlertDialog open={showConfirmToggle} onOpenChange={setShowConfirmToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCliente?.status === 'ativa' ? 'Inativar' : 'Ativar'} Cliente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {selectedCliente?.status === 'ativa' ? 'inativar' : 'ativar'} o cliente{' '}
              <strong>{selectedCliente?.nomeEscritorio}</strong>?
              {selectedCliente?.status === 'ativa' && (
                <> O acesso do escritório será bloqueado.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialogs}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus}
              disabled={loading}
              className={selectedCliente?.status === 'ativa' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {loading ? 'Processando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Detalhes do Cliente */}
      <Dialog open={showDetalhes} onOpenChange={setShowDetalhes}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do escritório cliente
            </DialogDescription>
          </DialogHeader>
          {selectedCliente && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge 
                      variant={statusConfig[selectedCliente.status].variant}
                      className={statusConfig[selectedCliente.status].className}
                    >
                      {statusConfig[selectedCliente.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Nome do Escritório</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.nomeEscritorio}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contratante</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.nomeContratante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">E-mail</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.emailContratante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.telefone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">CNPJ</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Plano</label>
                  <p className="text-sm text-muted-foreground">{selectedCliente.nomePlano}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Vigência</label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedCliente.vigenciaPlano)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Valor</label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedCliente.valorPlano)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Forma de Pagamento</label>
                <p className="text-sm text-muted-foreground">{selectedCliente.formaPagamento}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição do Plano</label>
                <p className="text-sm text-muted-foreground">{selectedCliente.descricaoPlano}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Usuários</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedCliente.quantidadeUsuarios.usado}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {selectedCliente.quantidadeUsuarios.disponivel}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Processos</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedCliente.quantidadeProcessos.usado}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {selectedCliente.quantidadeProcessos.disponivel}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Tokens IA</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedCliente.tokensIA.usado}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    de {selectedCliente.tokensIA.disponivel}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetalhes(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
