"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useProcessos } from "./use-processos"
import { ProcessosFilters } from "./components/processos-filters"
import { ProcessosList } from "./components/processos-list"
import { ProcessoForm } from "./components/processo-form"
import { ProcessoHistoricoComponent } from "./components/processo-historico"

export default function GestaoProcessosPage() {
  const {
    // Estado
    processos,
    loading,
    filtros,
    processoSelecionado,
    modalAberto,
    modoEdicao,
    historicoAberto,

    // Ações CRUD
    criarProcesso,
    editarProcesso,
    excluirProcesso,

    // Controles de filtro e busca
    setFiltros,

    // Controles de UI
    abrirModal,
    fecharModal,
    abrirHistorico,
    fecharHistorico
  } = useProcessos()

  // Total de processos sem filtros para estatísticas
  const totalProcessos = 20 // Simular total geral

  const handleSubmitForm = async (data: any) => {
    if (modoEdicao && processoSelecionado) {
      await editarProcesso(processoSelecionado.id, data)
    } else {
      await criarProcesso(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Gestão de Processos</h1>
        <p className="text-muted-foreground">
          Cadastre, consulte e gerencie processos jurídicos do escritório com controle 
          de acesso e rastreabilidade completa.
        </p>
      </div>

      {/* Filtros e busca */}
      <ProcessosFilters
        filtros={filtros}
        onFiltersChange={setFiltros}
        onAddNew={() => abrirModal()}
        totalProcessos={totalProcessos}
        processosEncontrados={processos.length}
      />

      {/* Lista de processos */}
      <ProcessosList
        processos={processos}
        onEdit={(processo) => abrirModal(processo)}
        onDelete={excluirProcesso}
        onViewHistory={abrirHistorico}
        loading={loading}
      />

      {/* Modal de formulário */}
      <Dialog open={modalAberto} onOpenChange={fecharModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <ProcessoForm
            processo={processoSelecionado || undefined}
            onSubmit={handleSubmitForm}
            onCancel={fecharModal}
            loading={loading}
            processos={processos}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de histórico */}
      <ProcessoHistoricoComponent
        open={historicoAberto}
        onClose={fecharHistorico}
        processo={processoSelecionado}
      />
    </div>
  )
}
