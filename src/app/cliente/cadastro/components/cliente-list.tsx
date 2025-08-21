'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, DollarSign, User, Building, Shield, ShieldOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

import { Cliente, FiltrosCliente, PaginacaoCliente, TipoCliente, StatusCliente } from '../types'

interface ClienteListProps {
  clientes: Cliente[]
  filtros: FiltrosCliente
  paginacao: PaginacaoCliente
  loading?: boolean
  onFiltrosChange: (filtros: FiltrosCliente) => void
  onPaginacaoChange: (paginacao: Partial<PaginacaoCliente>) => void
  onAbrirFormulario: () => void
  onVisualizar: (cliente: Cliente) => void
  onEditar: (cliente: Cliente) => void
  onExcluir: (cliente: Cliente) => void
  onVerHistorico: (cliente: Cliente) => void
}

export function ClienteList({
  clientes,
  filtros,
  paginacao,
  loading = false,
  onFiltrosChange,
  onPaginacaoChange,
  onAbrirFormulario,
  onVisualizar,
  onEditar,
  onExcluir,
  onVerHistorico
}: ClienteListProps) {
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null)

  const handleFiltroChange = (campo: keyof FiltrosCliente, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    })
  }

  const formatarDocumento = (cliente: Cliente | null) => {
    if (!cliente) return ''
    if (cliente.tipoCliente === TipoCliente.PESSOA_FISICA) {
      return cliente.cpf || ''
    }
    return cliente.cnpj || ''
  }

  const formatarNome = (cliente: Cliente | null) => {
    if (!cliente) return ''
    if (cliente.tipoCliente === TipoCliente.PESSOA_FISICA) {
      return cliente.nome || ''
    }
    return cliente.razaoSocial || ''
  }

  const confirmarExclusao = async () => {
    if (clienteParaExcluir) {
      await onExcluir(clienteParaExcluir)
      setClienteParaExcluir(null)
    }
  }

  // Calcular itens da página atual
  const inicio = (paginacao.página - 1) * paginacao.itensPorPagina
  const fim = inicio + paginacao.itensPorPagina
  const clientesPagina = clientes.filter(cliente => cliente !== null).slice(inicio, fim)

  // Gerar páginas para paginação
  const gerarPaginas = () => {
    const páginas = []
    const totalPaginas = paginacao.totalPaginas
    const paginaAtual = paginacao.página

    // Sempre mostrar primeira página
    if (totalPaginas > 0) {
      páginas.push(1)
    }

    // Calcular intervalo de páginas próximas
    let inicioIntervalo = Math.max(2, paginaAtual - 2)
    let fimIntervalo = Math.min(totalPaginas - 1, paginaAtual + 2)

    // Ajustar intervalo se muito próximo do início ou fim
    if (paginaAtual <= 3) {
      fimIntervalo = Math.min(totalPaginas - 1, 5)
    }
    if (paginaAtual >= totalPaginas - 2) {
      inicioIntervalo = Math.max(2, totalPaginas - 4)
    }

    // Adicionar ellipsis no início se necessário
    if (inicioIntervalo > 2) {
      páginas.push('...')
    }

    // Adicionar páginas do intervalo
    for (let i = inicioIntervalo; i <= fimIntervalo; i++) {
      páginas.push(i)
    }

    // Adicionar ellipsis no fim se necessário  
    if (fimIntervalo < totalPaginas - 1) {
      páginas.push('...')
    }

    // Sempre mostrar última página (se não for a primeira)
    if (totalPaginas > 1) {
      páginas.push(totalPaginas)
    }

    return páginas
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Clientes</CardTitle>
            <CardDescription>
              Gerencie os clientes do escritório. Total: {paginacao.total} cliente{paginacao.total !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button 
            onClick={onAbrirFormulario}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Cliente
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou documento..."
              value={filtros.termo || ''}
              onChange={(e) => handleFiltroChange('termo', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={filtros.tipoCliente || 'todos'} 
              onValueChange={(value) => handleFiltroChange('tipoCliente', value === 'todos' ? 'todos' : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value={TipoCliente.PESSOA_FISICA}>Pessoa Física</SelectItem>
                <SelectItem value={TipoCliente.PESSOA_JURIDICA}>Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filtros.status || 'todos'} 
              onValueChange={(value) => handleFiltroChange('status', value === 'todos' ? 'todos' : value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={StatusCliente.ATIVO}>Ativo</SelectItem>
                <SelectItem value={StatusCliente.INATIVO}>Inativo</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filtros.confidencial?.toString() || 'todos'} 
              onValueChange={(value) => handleFiltroChange('confidencial', value === 'todos' ? 'todos' : value === 'true')}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Confidencial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="true">Confidenciais</SelectItem>
                <SelectItem value="false">Não confidenciais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidencial</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : clientesPagina.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {filtros.termo || filtros.tipoCliente !== 'todos' || filtros.status !== 'todos' || filtros.confidencial !== 'todos'
                      ? 'Nenhum cliente encontrado com os filtros aplicados.'
                      : 'Nenhum cliente cadastrado ainda.'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                clientesPagina.filter(cliente => cliente !== null).map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building className="h-4 w-4 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium">{formatarNome(cliente)}</div>
                          <div className="text-sm text-muted-foreground">
                            {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatarDocumento(cliente)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{cliente.telefone}</div>
                        <div className="text-sm text-muted-foreground">{cliente.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={cliente.status === StatusCliente.ATIVO ? "default" : "secondary"}
                        className={cliente.status === StatusCliente.ATIVO ? "bg-green-100 text-green-800" : ""}
                      >
                        {cliente.status === StatusCliente.ATIVO ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cliente.confidencial ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm">Sim</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <ShieldOff className="h-4 w-4" />
                          <span className="text-sm">Não</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onVisualizar(cliente)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditar(cliente)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onVerHistorico(cliente)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Histórico Financeiro
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setClienteParaExcluir(cliente)}
                            className="text-red-600"
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

        {/* Paginação */}
        {paginacao.totalPaginas > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {inicio + 1} a {Math.min(fim, paginacao.total)} de {paginacao.total} resultados
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (paginacao.página > 1) {
                        onPaginacaoChange({ página: paginacao.página - 1 })
                      }
                    }}
                    className={paginacao.página <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {gerarPaginas().map((página, index) => (
                  <PaginationItem key={index}>
                    {página === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPaginacaoChange({ página: página as number })
                        }}
                        isActive={página === paginacao.página}
                      >
                        {página}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (paginacao.página < paginacao.totalPaginas) {
                        onPaginacaoChange({ página: paginacao.página + 1 })
                      }
                    }}
                    className={paginacao.página >= paginacao.totalPaginas ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!clienteParaExcluir} onOpenChange={() => setClienteParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{formatarNome(clienteParaExcluir)}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarExclusao}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}