"use client"

import { Sidebar } from "@/components/sidebar"
import { ProcessoTable } from "./components/processo-table"
import { ProcessoFilters } from "./components/processo-filters"
import { useProcessos } from "./hooks/use-processos"
import { useProcessoFilters } from "./hooks/use-processo-filters"
import { toast } from "sonner"

export default function GestaoProcessosPage() {
  const {
    processos,
    loading,
    error,
    deleteProcesso,
    updateProcesso,
    addHistorico
  } = useProcessos()

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredProcessos,
    stats
  } = useProcessoFilters(processos)

  const handleDelete = async (id: string) => {
    const result = await deleteProcesso(id)
    
    if (result.success) {
      toast.success("Processo excluído com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      
      // Adicionar ao histórico (em produção seria feito no backend)
      await addHistorico({
        processoId: id,
        acao: "exclusao",
        usuario: "user@escritorio.com",
        detalhes: "Processo excluído do sistema"
      })
    } else {
      toast.error(result.error || "Erro ao excluir processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
    
    return result
  }

  const handleUpdateAccess = async (id: string, access: string) => {
    const result = await updateProcesso(id, { acesso: access as any })
    
    if (result.success) {
      const accessLabel = access === "privado" ? "privado" : "público"
      toast.success(`Processo alterado para ${accessLabel} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })
      
      // Registrar no histórico
      await addHistorico({
        processoId: id,
        acao: "alteracao_acesso",
        usuario: "user@escritorio.com",
        detalhes: `Nível de acesso alterado para ${accessLabel}`,
        camposAlterados: [
          {
            campo: "acesso",
            valorAnterior: access === "privado" ? "publico" : "privado",
            valorNovo: access
          }
        ]
      })
    } else {
      toast.error(result.error || "Erro ao alterar acesso", {
        duration: 3000,
        position: "bottom-right"
      })
    }
    
    return result
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Gestão de Processos
              </h1>
              <p className="text-muted-foreground">
                Cadastre, consulte e gerencie processos jurídicos com controle de acesso e rastreabilidade completa
              </p>
            </div>

            {/* Filtros */}
            <ProcessoFilters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              stats={stats}
            />

            {/* Tabela de Processos */}
            <ProcessoTable
              processos={filteredProcessos}
              onDelete={handleDelete}
              onUpdateAccess={handleUpdateAccess}
            />
          </div>
        </div>
      </main>
    </div>
  )
}