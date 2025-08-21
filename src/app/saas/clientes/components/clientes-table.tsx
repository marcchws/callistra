"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { Cliente, ClienteFilters, formatCurrency, getStatusColor, getPlanoColor, PlanoTipo } from "../types"
import { ClienteActions } from "./cliente-actions"
import { ClienteForm } from "./cliente-form"

interface ClientesTableProps {
  clientes: Cliente[]
  filters: ClienteFilters
  onFiltersChange: (filters: ClienteFilters) => void
  onEdit: (cliente: Cliente) => void
  onDelete: (id: string) => Promise<void>
  onToggleStatus: (id: string) => Promise<void>
  onAlterarTitularidade: (id: string, data: any) => Promise<void>
  onTrocarPlano: (id: string, data: any) => Promise<void>
}

export function ClientesTable({ 
  clientes, 
  filters, 
  onFiltersChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onAlterarTitularidade,
  onTrocarPlano
}: ClientesTableProps) {
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const handleSort = (column: keyof Cliente) => {
    if (filters.sortBy === column) {
      onFiltersChange({
        ...filters,
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
      })
    } else {
      onFiltersChange({
        ...filters,
        sortBy: column,
        sortOrder: 'asc'
      })
    }
  }

  const getSortIcon = (column: keyof Cliente) => {
    if (filters.sortBy !== column) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />
    }
    return filters.sortOrder === 'asc' 
      ? <ChevronUp className="ml-2 h-4 w-4" />
      : <ChevronDown className="ml-2 h-4 w-4" />
  }

  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-blue-100 p-3 mb-4">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Nenhum cliente encontrado</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filters.search || filters.plano || filters.status 
            ? "Tente ajustar os filtros de busca"
            : "Cadastre o primeiro cliente para começar"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('id')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  ID
                  {getSortIcon('id')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('nomeEscritorio')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Escritório
                  {getSortIcon('nomeEscritorio')}
                </Button>
              </TableHead>
              <TableHead>Contratante</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('nomePlano')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Plano
                  {getSortIcon('nomePlano')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('valorPlano')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Valor
                  {getSortIcon('valorPlano')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('vigenciaPlano')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Vigência
                  {getSortIcon('vigenciaPlano')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Status
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead>Recursos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">{cliente.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{cliente.nomeEscritorio}</div>
                    <div className="text-xs text-muted-foreground">{cliente.cnpj}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{cliente.nomeContratante}</div>
                    <div className="text-xs text-muted-foreground">{cliente.telefone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{cliente.emailContratante}</TableCell>
                <TableCell>
                  <Badge className={getPlanoColor(cliente.nomePlano)}>
                    {PlanoTipo[cliente.nomePlano]}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(cliente.valorPlano)}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(cliente.vigenciaPlano).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cliente.status)}>
                    {cliente.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Usuários:</span>
                      <span className="font-medium">
                        {cliente.usuariosUsados}/{cliente.usuariosDisponiveis}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Processos:</span>
                      <span className="font-medium">
                        {cliente.processosUsados}/{cliente.processosDisponiveis}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Tokens IA:</span>
                      <span className="font-medium">
                        {cliente.tokensIAUsados}/{cliente.tokensIADisponiveis}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ClienteActions
                    cliente={cliente}
                    onEdit={() => setEditingCliente(cliente)}
                    onDelete={() => onDelete(cliente.id)}
                    onToggleStatus={() => onToggleStatus(cliente.id)}
                    onAlterarTitularidade={(data) => onAlterarTitularidade(cliente.id, data)}
                    onTrocarPlano={(data) => onTrocarPlano(cliente.id, data)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      {editingCliente && (
        <ClienteForm
          open={!!editingCliente}
          onOpenChange={(open) => !open && setEditingCliente(null)}
          onSubmit={async (data) => {
            await onEdit({ ...editingCliente, ...data })
            setEditingCliente(null)
          }}
          initialData={editingCliente}
          mode="edit"
        />
      )}
    </>
  )
}