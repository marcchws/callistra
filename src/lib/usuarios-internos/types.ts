// Types para Gerenciamento de Usuários Internos
// Todos os campos conforme especificado no PRD

export interface UsuarioInterno {
  id: string
  nome: string
  cargo: string
  telefone: string
  email: string
  perfilAcesso: string
  fotoPerfil?: string
  status: 'ativo' | 'inativo'
  salario?: number
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  observacao?: string
  documentosAnexos?: DocumentoAnexo[]
  // Campos de auditoria
  criadoPor?: string
  criadoEm?: Date
  modificadoPor?: string
  modificadoEm?: Date
}

export interface DocumentoAnexo {
  id: string
  nome: string
  tipo: 'termo_confidencialidade' | 'rg_cpf' | 'passaporte' | 'outro'
  url: string
  tamanho: number
  uploadEm: Date
  uploadPor: string
}

export interface HistoricoAlteracao {
  id: string
  usuarioId: string
  acao: 'criacao' | 'edicao' | 'desativacao' | 'ativacao' | 'exclusao'
  campoAlterado?: string
  valorAnterior?: string
  valorNovo?: string
  realizadoPor: string
  realizadoEm: Date
  detalhes?: string
}

export interface FiltrosUsuario {
  busca?: string
  status?: 'todos' | 'ativo' | 'inativo'
  cargo?: string
  perfilAcesso?: string
}

export interface PerfilAcesso {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
}

// Mock de cargos disponíveis
export const CARGOS_DISPONIVEIS = [
  'Administrador',
  'Gerente de Contas',
  'Analista de Suporte',
  'Desenvolvedor',
  'Designer',
  'Analista Financeiro',
  'Coordenador',
  'Assistente Administrativo'
]

// Mock de perfis de acesso
export const PERFIS_ACESSO: PerfilAcesso[] = [
  {
    id: '1',
    nome: 'Administrador',
    descricao: 'Acesso total ao sistema',
    permissoes: ['criar_usuarios', 'editar_usuarios', 'excluir_usuarios', 'gerenciar_planos', 'visualizar_relatorios']
  },
  {
    id: '2',
    nome: 'Gerente',
    descricao: 'Acesso de gerenciamento',
    permissoes: ['criar_usuarios', 'editar_usuarios', 'visualizar_relatorios']
  },
  {
    id: '3',
    nome: 'Suporte',
    descricao: 'Acesso para atendimento',
    permissoes: ['visualizar_usuarios', 'gerenciar_tickets']
  },
  {
    id: '4',
    nome: 'Visualizador',
    descricao: 'Apenas visualização',
    permissoes: ['visualizar_usuarios', 'visualizar_relatorios']
  }
]

// Tipos de documento aceitos para upload
export const TIPOS_DOCUMENTO = {
  termo_confidencialidade: 'Termo de Confidencialidade',
  rg_cpf: 'RG/CPF',
  passaporte: 'Passaporte',
  outro: 'Outro'
} as const

// Status labels
export const STATUS_LABELS = {
  ativo: 'Ativo',
  inativo: 'Inativo'
} as const