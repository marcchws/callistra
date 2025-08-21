"use client"

import React, { useState } from 'react'
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Shield } from 'lucide-react'
import { AccessLevelList } from './components/access-level-list'
import { AccessLevelForm } from './components/access-level-form'
import { AccessLevelFilters } from './components/access-level-filters'
import { useAccessLevels } from './hooks/use-access-levels'
import { AccessLevel } from './types'

export default function AccessLevelsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null)
  
  const {
    accessLevels,
    loading,
    filters,
    createAccessLevel,
    updateAccessLevel,
    deleteAccessLevel,
    toggleAccessLevelStatus,
    updateFilters,
    checkNameExists
  } = useAccessLevels()

  // Handle create/edit submit
  const handleSubmit = async (data: any) => {
    if (selectedLevel) {
      return await updateAccessLevel(selectedLevel.id, data)
    } else {
      return await createAccessLevel(data)
    }
  }

  // Handle edit click
  const handleEdit = (level: AccessLevel) => {
    setSelectedLevel(level)
    setFormOpen(true)
  }

  // Handle create click
  const handleCreate = () => {
    setSelectedLevel(null)
    setFormOpen(true)
  }

  // Handle form close
  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedLevel(null)
  }

  // Contadores para os filtros
  const totalCount = accessLevels.length
  const filteredCount = accessLevels.length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Níveis de Acesso</h1>
                  <p className="text-muted-foreground">
                    Gerencie perfis de acesso e permissões granulares do sistema
                  </p>
                </div>
                <Button 
                  onClick={handleCreate}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Criar Perfil
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AccessLevelFilters
              filters={filters}
              onFiltersChange={updateFilters}
              totalCount={totalCount}
              filteredCount={filteredCount}
            />

            {/* List */}
            <AccessLevelList
              accessLevels={accessLevels}
              onEdit={handleEdit}
              onDelete={deleteAccessLevel}
              onToggleStatus={toggleAccessLevelStatus}
              loading={loading}
            />

            {/* Form Dialog */}
            <AccessLevelForm
              open={formOpen}
              onClose={handleFormClose}
              onSubmit={handleSubmit}
              accessLevel={selectedLevel}
              checkNameExists={checkNameExists}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
