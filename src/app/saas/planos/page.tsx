"use client"

import { PlanosTable } from "./components/planos-table"
import { PlanoForm } from "./components/plano-form"
import { PlanoFiltersComponent } from "./components/plano-filters"
import { usePlanos } from "./use-planos"

// Página principal de Gerenciamento de Planos seguindo Global Layout Structure
export default function PlanosPage() {
  const {
    // Estados
    planos,
    loading,
    error,
    filters,
    selectedPlano,
    showForm,
    
    // Ações CRUD - implementando TODOS os cenários especificados
    criarPlano,
    editarPlano,
    excluirPlano,
    alterarStatusPlano,
    alterarVisibilidadeSite,
    alterarPlanoRecomendado,
    
    // Filtros - implementando critérios de aceite de filtros
    aplicarFiltros,
    limparFiltros,
    
    // Controles UI
    abrirFormulario,
    fecharFormulario
  } = usePlanos()

  return (
    <div className="space-y-6">
      {/* Header da página baseado no Layout Template */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gerenciamento de Planos
        </h1>
        <p className="text-muted-foreground">
          Cadastro e gerenciamento de planos disponíveis no sistema
        </p>
      </div>

      {/* Filtros baseados nos critérios de aceite especificados */}
      <PlanoFiltersComponent
        filters={filters}
        onFiltersChange={aplicarFiltros}
        onClearFilters={limparFiltros}
      />

      {/* Tabela principal com TODOS os campos especificados */}
      <PlanosTable
        planos={planos}
        loading={loading}
        onNovoPlano={() => abrirFormulario()}
        onEditarPlano={(plano) => abrirFormulario(plano)}
        onExcluirPlano={(plano) => excluirPlano(plano.id)}
        onAlterarStatus={alterarStatusPlano}
        onAlterarVisibilidade={alterarVisibilidadeSite}
        onAlterarRecomendado={alterarPlanoRecomendado}
      />

      {/* Modal de formulário seguindo Dialog Layout */}
      <PlanoForm
        plano={selectedPlano}
        isOpen={showForm}
        loading={loading}
        onClose={fecharFormulario}
        onSubmit={(data) => {
          if (selectedPlano) {
            editarPlano(selectedPlano.id, data)
          } else {
            criarPlano(data)
          }
        }}
      />

      {/* Exibição de erro se houver */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
