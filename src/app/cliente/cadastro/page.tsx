"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ClienteForm } from "./components/cliente-form"
import { ClienteList } from "./components/cliente-list"
import { ClienteFiltersComponent } from "./components/cliente-filters"
import { ClienteDocuments } from "./components/cliente-documents"
import { ClienteFinancialHistory } from "./components/cliente-financial-history"
import { useClientes } from "./use-clientes"
import { Cliente, ClienteFormData } from "./types"

export default function CadastroClientesPage() {
  const [view, setView] = useState<"list" | "create" | "edit" | "documents" | "financial">("list")
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  
  const {
    clientes,
    loading,
    filters,
    setFilters,
    createCliente,
    updateCliente,
    deleteCliente,
    attachDocument,
    buscarCep,
    refresh
  } = useClientes()

  // Handlers para navegação
  const handleCreate = () => {
    setSelectedCliente(null)
    setView("create")
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setView("edit")
  }

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setView("edit") // Por enquanto, visualizar é o mesmo que editar em modo readonly
  }

  const handleViewDocuments = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setView("documents")
  }

  const handleViewFinanceiro = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setView("financial")
  }

  const handleCancel = () => {
    setView("list")
    setSelectedCliente(null)
  }

  // Handlers para CRUD
  const handleSubmit = async (data: ClienteFormData) => {
    if (selectedCliente) {
      await updateCliente(selectedCliente.id, data)
    } else {
      await createCliente(data)
    }
    handleCancel()
  }

  const handleDelete = async (id: string) => {
    await deleteCliente(id)
  }

  const handleClearFilters = () => {
    setFilters({})
    refresh()
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
                Cadastro de Clientes
              </h1>
              <p className="text-muted-foreground">
                Gerencie clientes pessoa física, jurídica e parceiros com controle completo de informações e documentos
              </p>
            </div>

            {/* Content */}
            {view === "list" && (
              <div className="space-y-4">
                <ClienteFiltersComponent
                  filters={filters}
                  onChange={setFilters}
                  onClear={handleClearFilters}
                />
                
                <ClienteList
                  clientes={clientes}
                  loading={loading}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewFinanceiro={handleViewFinanceiro}
                  onViewDocumentos={handleViewDocuments}
                  onAdd={handleCreate}
                />
              </div>
            )}

            {(view === "create" || view === "edit") && (
              <ClienteForm
                cliente={view === "edit" ? selectedCliente || undefined : undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onBuscarCep={buscarCep}
              />
            )}

            {view === "documents" && selectedCliente && (
              <ClienteDocuments
                cliente={selectedCliente}
                onUpload={attachDocument}
                onClose={handleCancel}
              />
            )}

            {view === "financial" && selectedCliente && (
              <ClienteFinancialHistory
                cliente={selectedCliente}
                onClose={handleCancel}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}