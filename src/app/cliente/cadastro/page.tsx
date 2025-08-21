'use client'

import { useClientes } from './use-clientes'
import { ClienteForm } from './components/cliente-form'
import { ClienteList } from './components/cliente-list'
import { ClienteDetails } from './components/cliente-details'
import { HistoricoFinanceiroModal } from './components/historico-financeiro'

export default function CadastroClientesPage() {
  const {
    // Estados principais
    clientes,
    loading,
    error,
    
    // Estados de formulário
    mostrarFormulario,
    clienteEditando,
    modoFormulario,
    
    // Estados de visualização
    clienteSelecionado,
    mostrarDetalhes,
    mostrarHistorico,
    historicoFinanceiro,
    
    // Estados de busca/filtros
    filtros,
    paginacao,
    
    // Ações de CRUD
    criarCliente,
    editarCliente,
    excluirCliente,
    
    // Ações de interface
    abrirFormularioCriacao,
    abrirFormularioEdicao,
    fecharFormulario,
    abrirDetalhes,
    fecharDetalhes,
    abrirHistorico,
    fecharHistorico,
    
    // Ações de filtro
    setFiltros,
    setPaginacao
  } = useClientes()

  const handleSubmitFormulario = async (dados: any) => {
    if (modoFormulario === 'criar') {
      return await criarCliente(dados)
    } else {
      return await editarCliente(dados)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Cadastro de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie o cadastro de clientes pessoa física e jurídica, com controle de informações cadastrais, 
          financeiras e documentais.
        </p>
      </div>

      {/* Mensagem de Erro Global */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Lista de Clientes */}
      <ClienteList
        clientes={clientes}
        filtros={filtros}
        paginacao={paginacao}
        loading={loading}
        onFiltrosChange={setFiltros}
        onPaginacaoChange={(novaPaginacao) => setPaginacao(prev => ({ ...prev, ...novaPaginacao }))}
        onAbrirFormulario={abrirFormularioCriacao}
        onVisualizar={abrirDetalhes}
        onEditar={abrirFormularioEdicao}
        onExcluir={excluirCliente}
        onVerHistorico={abrirHistorico}
      />

      {/* Formulário de Cliente */}
      {mostrarFormulario && (
        <ClienteForm
          cliente={clienteEditando}
          loading={loading}
          onSubmit={handleSubmitFormulario}
          onCancel={fecharFormulario}
        />
      )}

      {/* Modal de Detalhes do Cliente */}
      <ClienteDetails
        cliente={clienteSelecionado}
        open={mostrarDetalhes}
        onClose={fecharDetalhes}
        onEditar={abrirFormularioEdicao}
      />

      {/* Modal de Histórico Financeiro */}
      <HistoricoFinanceiroModal
        cliente={clienteSelecionado}
        historico={historicoFinanceiro}
        loading={loading}
        open={mostrarHistorico}
        onClose={fecharHistorico}
      />
    </div>
  )
}