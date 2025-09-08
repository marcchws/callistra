import { z } from "zod"

// Enum para Status do usuário
export enum UserStatus {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO"
}

// Enum para Tipo de Honorário
export enum TipoHonorario {
  FIXO = "FIXO",
  PERCENTUAL = "PERCENTUAL",
  HORA_TRABALHADA = "HORA_TRABALHADA"
}

// Interface para o usuário interno
export interface User {
  id: string
  nome: string
  cargo: string
  telefone: string
  email: string
  perfilAcesso: string
  especialidades: string[]
  fotoPerfil?: string
  status: UserStatus
  tipoHonorario?: TipoHonorario
  banco?: string
  agencia?: string
  contaCorrente?: string
  chavePix?: string
  observacao?: string
  documentosAnexos?: DocumentoAnexo[]
  criadoPor?: string
  criadoEm?: Date
  modificadoPor?: string
  modificadoEm?: Date
  inativadoPor?: string
  inativadoEm?: Date
}

// Interface para documentos anexos
export interface DocumentoAnexo {
  id: string
  nome: string
  tipo: "OAB" | "TERMO_CONFIDENCIALIDADE" | "CPF" | "PASSAPORTE"
  url: string
  tamanho: number
  uploadEm: Date
  uploadPor: string
}

// Interface para histórico de auditoria
export interface AuditoriaLog {
  id: string
  usuarioId: string
  acao: "CRIACAO" | "EDICAO" | "EXCLUSAO" | "ATIVACAO" | "INATIVACAO"
  campo?: string
  valorAnterior?: string
  valorNovo?: string
  realizadoPor: string
  realizadoEm: Date
  detalhes?: string
}

// Interface para perfis de acesso
export interface PerfilAcesso {
  id: string
  nome: string
  descricao: string
  permissoes: string[]
}

// Schema de validação para formulário de usuário
export const userFormSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  
  cargo: z.string()
    .min(1, "Cargo é obrigatório"),
  
  telefone: z.string()
    .min(14, "Telefone inválido")
    .regex(/^\+\d{2}\s?\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Formato inválido. Use: +55 (11) 98765-4321"),
  
  email: z.string()
    .email("E-mail inválido"),
  
  perfilAcesso: z.string()
    .min(1, "Perfil de acesso é obrigatório"),
  
  especialidades: z.array(z.string()).optional(),
  
  status: z.nativeEnum(UserStatus),
  
  tipoHonorario: z.nativeEnum(TipoHonorario).optional(),
  
  banco: z.string().optional(),
  
  agencia: z.string().optional(),
  
  contaCorrente: z.string().optional(),
  
  chavePix: z.string().optional(),
  
  observacao: z.string().max(500, "Observação muito longa").optional(),
})

export type UserFormData = z.infer<typeof userFormSchema>

// Lista de especialidades jurídicas (baseado no anexo mencionado no PRD)
export const ESPECIALIDADES_JURIDICAS = [
  "Direito Administrativo",
  "Direito Ambiental",
  "Direito Bancário",
  "Direito Civil",
  "Direito Constitucional",
  "Direito do Consumidor",
  "Direito Contratual",
  "Direito Digital",
  "Direito Empresarial",
  "Direito de Família",
  "Direito Imobiliário",
  "Direito Internacional",
  "Direito Penal",
  "Direito Previdenciário",
  "Direito do Trabalho",
  "Direito Tributário",
  "Direito Médico e da Saúde",
  "Propriedade Intelectual",
  "Compliance",
  "Arbitragem e Mediação"
]

// Lista de cargos comuns em escritórios de advocacia
export const CARGOS_PADRAO = [
  "Sócio",
  "Advogado Sênior",
  "Advogado Pleno",
  "Advogado Júnior",
  "Estagiário",
  "Paralegal",
  "Secretária",
  "Assistente Administrativo",
  "Gerente Administrativo",
  "Controller",
  "Recepcionista"
]

// Interface para filtros de listagem
export interface UserFilters {
  search?: string
  status?: UserStatus
  cargo?: string
}
