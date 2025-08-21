export interface Usuario {
  id: string
  nome: string
  cargo: string
  telefone: string
  email: string
  perfilAcesso: string
  fotoPerfil?: string
  status: 'Ativo' | 'Inativo'
  salario?: number
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  observacao?: string
  documentosAnexos?: DocumentoAnexo[]
  criadoEm: Date
  criadoPor: string
  atualizadoEm?: Date
  atualizadoPor?: string
}

export interface DocumentoAnexo {
  id: string
  nome: string
  tipo: 'termo-confidencialidade' | 'rg-cpf' | 'passaporte'
  url: string
  uploadEm: Date
  uploadPor: string
}

export interface PerfilAcesso {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
}

export interface AuditLog {
  id: string
  usuarioId: string
  acao: 'criacao' | 'edicao' | 'exclusao' | 'ativacao' | 'desativacao'
  dadosAnteriores?: Partial<Usuario>
  dadosNovos?: Partial<Usuario>
  realizadoPor: string
  realizadoEm: Date
  observacoes?: string
}

export interface UsuarioFilters {
  status?: 'Ativo' | 'Inativo' | 'Todos'
  cargo?: string | 'todos'
  searchTerm?: string
}

export interface UsuarioFormData {
  nome: string
  cargo: string
  telefone: string
  email: string
  perfilAcesso: string
  status: 'Ativo' | 'Inativo'
  salario?: number
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  observacao?: string
}

export interface UploadFile {
  file: File
  tipo: DocumentoAnexo['tipo']
}
