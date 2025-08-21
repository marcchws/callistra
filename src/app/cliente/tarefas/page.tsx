"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTarefas } from "./use-tarefas"
import { TarefaFiltersComponent } from "./components/tarefa-filters"
import { TarefaTable } from "./components/tarefa-table"
import { TarefaForm } from "./components/tarefa-form"
import { Tarefa } from "./types"

// REQUIREMENTS LOCK: Página principal baseada nos 10 cenários especificados
// CORRIGIDO: Apenas conteúdo da página - Sidebar é global no layout.tsx
export default function TarefasPage() {
  const [showForm, setShowForm] = useState(false)
  const [tarefaEdicao, setTarefaEdicao] = useState<Tarefa | null>(null)

  const {
    tarefas,
    clientes,
    processos,
    usuarios,
    loading,
    error,
    filters,
    criarTarefa,
    editarTarefa,
    removerTarefa,
    anexarArquivo,
    setFilters,
    getClienteNome,
    getProcessoNumero,
    getUsuarioNome
  } = useTarefas()

  // CENÁRIO 1 + 2: Criar e Editar tarefas
  const handleSubmit = async (data: any) => {
    if (tarefaEdicao) {
      return await editarTarefa(tarefaEdicao.id, data)
    } else {
      return await criarTarefa(data)
    }
  }

  // CENÁRIO 2: Abrir formulário para edição
  const handleEdit = (tarefa: Tarefa) => {
    setTarefaEdicao(tarefa)
    setShowForm(true)
  }

  // CENÁRIO 3: Remover tarefa
  const handleDelete = async (id: string) => {
    await removerTarefa(id)
  }

  // LIMPAR ESTADO DO FORMULÁRIO
  const handleCloseForm = () => {
    setShowForm(false)
    setTarefaEdicao(null)
  }

  // NOVA TAREFA
  const handleNewTarefa = () => {
    setTarefaEdicao(null)
    setShowForm(true)
  }

  return (
    // CONTEÚDO DA PÁGINA - Sidebar e container são globais no layout.tsx
    <div className="space-y-6">
        
        {/* HEADER DA PÁGINA - Baseado no callistra-patterns.md */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Cadastro e Gerenciamento de Tarefas
              </h1>
              <p className="text-muted-foreground">
                Gerencie tarefas com anexos, priorização e categorização detalhada, 
                vinculando-as a processos, clientes e advogados responsáveis
              </p>
            </div>
            
            {/* BOTÃO NOVA TAREFA - Cenário 1 */}
            <Button 
              onClick={handleNewTarefa}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* MENSAGEM DE ERRO - UX Enhancement para feedback */}
        {error && (
          <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* FILTROS DE BUSCA - Cenários 6, 7 */}
        <TarefaFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          clientes={clientes}
          processos={processos}
          usuarios={usuarios}
        />

        {/* TABELA DE TAREFAS - Cenários 1-10, incluindo histórico */}
        <TarefaTable
          tarefas={tarefas}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getClienteNome={getClienteNome}
          getProcessoNumero={getProcessoNumero}
          getUsuarioNome={getUsuarioNome}
        />

        {/* FORMULÁRIO DE TAREFA - Cenários 1, 2, 4, 5, 8 */}
        <TarefaForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          tarefa={tarefaEdicao}
          loading={loading}
          clientes={clientes}
          processos={processos}
          usuarios={usuarios}
          onAnexarArquivo={anexarArquivo}
        />
    </div>
  )
}