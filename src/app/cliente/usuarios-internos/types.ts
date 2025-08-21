import { z } from "zod"

// Validation schemas baseados nos Requirements exatos
export const usuarioInternoFormSchema = z.object({
  // Campos obrigatórios conforme PRD
  nome: z.string().min(1, "Nome é obrigatório"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  telefone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\+\d{1,4}\d{2}\d{8,9}$/, "Formato: DDI+DDD+NÚMERO (ex: +5511999999999)"),
  email: z.string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  perfilAcesso: z.string().min(1, "Perfil de acesso é obrigatório"),
  status: z.enum(["ATIVO", "INATIVO"], {
    required_error: "Status é obrigatório"
  }),

  // Campos opcionais conforme PRD
  especialidades: z.array(z.string()).optional().default([]),
  tipoHonorario: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  contaCorrente: z.string().optional(),
  chavePix: z.string().optional(),
  observacao: z.string().optional(),
})

export type UsuarioInternoFormData = z.infer<typeof usuarioInternoFormSchema>

// Interface completa do usuário interno
export interface UsuarioInterno {
  id: string
  nome: string
  cargo: string
  telefone: string
  email: string
  perfilAcesso: string
  status: "ATIVO" | "INATIVO"
  especialidades: string[]
  tipoHonorario?: string
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  observacao?: string
  fotoPerfil?: string
  documentos: DocumentoAnexo[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

// Interface para documentos anexos
export interface DocumentoAnexo {
  id: string
  tipo: "OAB" | "TERMO_CONFIDENCIALIDADE" | "CPF" | "PASSAPORTE"
  nomeArquivo: string
  url: string
  uploadedAt: Date
  uploadedBy: string
}

// Interface para histórico de auditoria
export interface HistoricoAuditoria {
  id: string
  usuarioId: string
  acao: "CRIACAO" | "EDICAO" | "DESATIVACAO" | "ATIVACAO" | "EXCLUSAO"
  dadosAnteriores?: Partial<UsuarioInterno>
  dadosNovos?: Partial<UsuarioInterno>
  realizadoPor: string
  realizadoEm: Date
  observacoes?: string
}

// Interface para perfis de acesso (vindos do módulo níveis de acesso)
export interface PerfilAcesso {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
}

// Interface para especialidades (conforme anexo mencionado no PRD)
export interface Especialidade {
  id: string
  nome: string
  codigo?: string
  descricao?: string
}

// Interface para cargos personalizáveis
export interface Cargo {
  id: string
  nome: string
  descricao?: string
  ativo: boolean
}

// Filtros para busca e listagem
export interface FiltrosUsuarios {
  busca?: string // Nome, Cargo ou E-mail conforme PRD
  status?: "ATIVO" | "INATIVO" | "TODOS"
  cargo?: string
  perfilAcesso?: string
  especialidade?: string
}

// Interface para upload de arquivos
export interface UploadResponse {
  url: string
  nomeArquivo: string
  tamanho: number
  tipo: string
}

// Interface para transferência de atividades (quando usuário é desativado)
export interface TransferenciaAtividades {
  usuarioDesativado: string
  adminMaster: string
  atividades: {
    processos: number
    tarefas: number
    compromissos: number
  }
  dataTransferencia: Date
}

// Estados do componente
export interface UsuariosInternosState {
  usuarios: UsuarioInterno[]
  loading: boolean
  error: string | null
  filtros: FiltrosUsuarios
  paginacao: {
    pagina: number
    itensPorPagina: number
    total: number
  }
  modalAberto: "CRIAR" | "EDITAR" | "VISUALIZAR" | "DESATIVAR" | null
  usuarioSelecionado: UsuarioInterno | null
  historicoAberto: boolean
}

// Responses da API
export interface UsuariosResponse {
  usuarios: UsuarioInterno[]
  total: number
  pagina: number
  totalPaginas: number
}

export interface CreateUsuarioRequest {
  dados: UsuarioInternoFormData
  fotoPerfil?: File
  documentos?: Array<{
    arquivo: File
    tipo: DocumentoAnexo["tipo"]
  }>
}

export interface UpdateUsuarioRequest extends CreateUsuarioRequest {
  id: string
}

// Mock data para desenvolvimento (será substituída por API real)
export const mockEspecialidades: Especialidade[] = [
  { id: "1", nome: "Direito Civil", codigo: "CIV" },
  { id: "2", nome: "Direito Penal", codigo: "PEN" },
  { id: "3", nome: "Direito Trabalhista", codigo: "TRA" },
  { id: "4", nome: "Direito Empresarial", codigo: "EMP" },
  { id: "5", nome: "Direito Tributário", codigo: "TRI" },
  { id: "6", nome: "Direito Previdenciário", codigo: "PRE" },
  { id: "7", nome: "Direito Administrativo", codigo: "ADM" },
  { id: "8", nome: "Direito Constitucional", codigo: "CON" },
]

export const mockCargos: Cargo[] = [
  { id: "1", nome: "Advogado Sênior", ativo: true },
  { id: "2", nome: "Advogado Pleno", ativo: true },
  { id: "3", nome: "Advogado Júnior", ativo: true },
  { id: "4", nome: "Estagiário", ativo: true },
  { id: "5", nome: "Paralegal", ativo: true },
  { id: "6", nome: "Secretário Jurídico", ativo: true },
  { id: "7", nome: "Analista Jurídico", ativo: true },
  { id: "8", nome: "Coordenador Jurídico", ativo: true },
]

export const mockPerfisAcesso: PerfilAcesso[] = [
  { id: "1", nome: "Admin Master", descricao: "Acesso total ao sistema", permissoes: ["*"] },
  { id: "2", nome: "Advogado Senior", descricao: "Acesso a processos e clientes", permissoes: ["processos.*", "clientes.*"] },
  { id: "3", nome: "Advogado Junior", descricao: "Acesso limitado a processos", permissoes: ["processos.visualizar", "processos.editar"] },
  { id: "4", nome: "Secretário", descricao: "Acesso a agenda e documentos", permissoes: ["agenda.*", "documentos.*"] },
  { id: "5", nome: "Estagiário", descricao: "Acesso apenas leitura", permissoes: ["*.visualizar"] },
]