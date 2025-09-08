"use client"

import { useState } from "react"
import { Plus, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { ContractList } from "./contract-list"
import { ContractForm } from "./contract-form"
import { ContractDetail } from "./contract-detail"
import { useContracts } from "./use-contracts"
import { Contract, ContractFormData } from "./types"

export default function ContratosEProcuracoesPage() {
  const [view, setView] = useState<"list" | "create" | "edit" | "detail">("list")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  
  const {
    contracts,
    loading,
    error,
    applyFilters,
    createContract,
    updateContract,
    deleteContract,
    addRenegotiation,
    updatePaymentStatus,
    exportDocument,
  } = useContracts()

  const handleSelectContract = (contract: Contract) => {
    setSelectedContract(contract)
    setView("detail")
  }

  const handleCreateContract = async (data: ContractFormData) => {
    try {
      await createContract(data)
      setView("list")
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleUpdateContract = async (data: ContractFormData) => {
    if (!selectedContract) return
    try {
      await updateContract(selectedContract.id, data)
      setView("list")
      setSelectedContract(null)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleDeleteContract = async () => {
    if (!selectedContract) return
    try {
      await deleteContract(selectedContract.id)
      setView("list")
      setSelectedContract(null)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleExportDocument = async (format: "pdf" | "word") => {
    if (!selectedContract) return
    try {
      await exportDocument(selectedContract.id, format)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleAddRenegotiation = async (renegotiation: any) => {
    if (!selectedContract) return
    try {
      await addRenegotiation(selectedContract.id, renegotiation)
      // Atualizar o contrato selecionado
      const updated = contracts.find(c => c.id === selectedContract.id)
      if (updated) setSelectedContract(updated)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleUpdatePaymentStatus = async (status: "pago" | "inadimplente", valorPago?: number) => {
    if (!selectedContract) return
    try {
      await updatePaymentStatus(
        selectedContract.id, 
        status,
        valorPago,
        status === "pago" ? new Date() : undefined
      )
      // Atualizar o contrato selecionado
      const updated = contracts.find(c => c.id === selectedContract.id)
      if (updated) setSelectedContract(updated)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleEditContract = () => {
    setView("edit")
  }

  const handleCancel = () => {
    setView("list")
    setSelectedContract(null)
  }

  // Renderização condicional baseada na view
  const renderContent = () => {
    // View de criação
    if (view === "create") {
      return (
        <ContractForm
          onSubmit={handleCreateContract}
          onCancel={handleCancel}
          loading={loading}
        />
      )
    }

    // View de edição
    if (view === "edit" && selectedContract) {
      return (
        <ContractForm
          contract={selectedContract}
          onSubmit={handleUpdateContract}
          onCancel={handleCancel}
          loading={loading}
        />
      )
    }

    // View de detalhes
    if (view === "detail" && selectedContract) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView("list")}
            >
              Voltar
            </Button>
          </div>
          <ContractDetail
            contract={selectedContract}
            onEdit={handleEditContract}
            onDelete={handleDeleteContract}
            onExport={handleExportDocument}
            onAddRenegotiation={handleAddRenegotiation}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            loading={loading}
          />
        </div>
      )
    }

    // View de listagem (padrão)
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contratos e Procurações</CardTitle>
              <CardDescription>
                Gerencie contratos e procurações do escritório
              </CardDescription>
            </div>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => setView("create")}
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Novo Documento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && contracts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : (
            <ContractList
              contracts={contracts}
              onSelectContract={handleSelectContract}
              onApplyFilters={applyFilters}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header da página */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-semibold tracking-tight">
                  Gestão de Contratos e Procurações
                </h1>
              </div>
              <p className="text-muted-foreground">
                Crie, edite e gerencie contratos e procurações com modelos do sistema ou personalizados, 
                acompanhe valores negociados, renegociações e status de pagamentos integrados ao financeiro.
              </p>
            </div>

            {/* Conteúdo dinâmico */}
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
