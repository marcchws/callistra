"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileDown, FileSpreadsheet, RefreshCw, Loader2 } from "lucide-react"
import { useClientes } from "./use-clientes"
import { ClientesTable } from "./components/clientes-table"
import { ClienteFilters } from "./components/cliente-filters"
import { ClienteForm } from "./components/cliente-form"
import { toast } from "sonner"

export default function ClientesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState<'pdf' | 'excel' | null>(null)
  
  const {
    clientes,
    loading,
    error,
    filters,
    setFilters,
    addCliente,
    updateCliente,
    deleteCliente,
    alterarTitularidade,
    trocarPlano,
    toggleStatus,
    exportData,
    reload
  } = useClientes()

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExportLoading(format)
    try {
      await exportData(format)
    } catch (error) {
      toast.error(`Erro ao exportar em ${format.toUpperCase()}`)
    } finally {
      setExportLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Visualização de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os escritórios clientes cadastrados no sistema
        </p>
      </div>

      {/* Card Principal */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>
                Lista completa de escritórios clientes com suas informações e status de assinatura
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Botão Recarregar */}
              <Button
                variant="outline"
                size="sm"
                onClick={reload}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Recarregar
              </Button>

              {/* Exportar PDF */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={loading || exportLoading !== null}
                className="gap-2"
              >
                {exportLoading === 'pdf' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Exportar PDF
              </Button>

              {/* Exportar Excel */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                disabled={loading || exportLoading !== null}
                className="gap-2"
              >
                {exportLoading === 'excel' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Exportar Excel
              </Button>

              {/* Adicionar Cliente */}
              <Button 
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => setFormOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar Cliente
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtros */}
          <ClienteFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Tabela */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Erro ao carregar clientes</h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button 
                onClick={reload} 
                className="mt-4 gap-2"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <ClientesTable
              clientes={clientes}
              filters={filters}
              onFiltersChange={setFilters}
              onEdit={updateCliente}
              onDelete={deleteCliente}
              onToggleStatus={toggleStatus}
              onAlterarTitularidade={alterarTitularidade}
              onTrocarPlano={trocarPlano}
            />
          )}

          {/* Informações de Resultados */}
          {!loading && !error && clientes.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Exibindo {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
                {(filters.search || filters.plano || filters.status) && ' (filtrados)'}
              </p>
              
              {/* Resumo de Status */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">
                    Ativos: {clientes.filter(c => c.status === 'ativa').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-muted-foreground">
                    Inativos: {clientes.filter(c => c.status === 'inativa').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-muted-foreground">
                    Inadimplentes: {clientes.filter(c => c.status === 'inadimplente').length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Cadastro */}
      <ClienteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={addCliente}
        mode="create"
      />
    </div>
  )
}