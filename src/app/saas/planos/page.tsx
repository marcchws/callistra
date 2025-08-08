"use client"

import { useState } from "react"
import { Plano, PlanoFormData } from "./types"
import { usePlanos } from "./use-planos"
import { PlanoList } from "./components/plano-list"
import { PlanoForm } from "./components/plano-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// PÁGINA PRINCIPAL - SEGUINDO GLOBAL LAYOUT STRUCTURE OBRIGATÓRIO
export default function PlanosPage() {
  const { 
    planos, 
    loading, 
    createPlano, 
    updatePlano, 
    toggleStatus, 
    deletePlano 
  } = usePlanos()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null)

  const handleAdd = () => {
    setEditingPlano(null)
    setIsFormOpen(true)
  }

  const handleEdit = (plano: Plano) => {
    setEditingPlano(plano)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPlano(null)
  }

  const handleSubmit = async (data: PlanoFormData) => {
    try {
      if (editingPlano) {
        await updatePlano(editingPlano.id, data)
      } else {
        await createPlano(data)
      }
      handleCloseForm()
    } catch (error) {
      // Erro já tratado no hook
      console.error('Erro ao salvar plano:', error)
    }
  }

  const handleToggleStatus = async (id: string) => {
    await toggleStatus(id)
  }

  const handleDelete = async (id: string) => {
    await deletePlano(id)
  }

  return (
    // ESTRUTURA GLOBAL OBRIGATÓRIA - space-y-6 conforme patterns
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Gestão de Planos</h1>
        <p className="text-muted-foreground">
          Gerencie os planos de assinatura oferecidos aos escritórios de advocacia
        </p>
      </div>

      <PlanoList
        planos={planos}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* MODAL DE FORMULÁRIO */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <PlanoForm
            plano={editingPlano}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            loading={loading}
            title={editingPlano ? "Editar Plano" : "Novo Plano"}
            description={editingPlano ? "Altere as informações do plano" : "Cadastre um novo plano de assinatura"}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
