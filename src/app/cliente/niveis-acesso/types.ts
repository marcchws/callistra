import { z } from "zod"

// Enum para tipos de permissão
export enum PermissionType {
  VISUALIZAR = "visualizar",
  CRIAR = "criar",
  EDITAR = "editar",
  EXCLUIR = "excluir",
  EDITAR_CONFIDENCIALIDADE = "editar_confidencialidade",
  EXPORTAR = "exportar"
}

// Enum para status do perfil
export enum ProfileStatus {
  ATIVO = "ativo",
  INATIVO = "inativo"
}

// Tipo para uma permissão individual
export interface Permission {
  type: PermissionType
  label: string
  enabled: boolean
}

// Tipo para permissões de uma tela
export interface ScreenPermission {
  screenId: string
  screenName: string
  module: string
  permissions: Permission[]
}

// Tipo para um perfil de acesso
export interface AccessProfile {
  id: string
  name: string
  description?: string
  status: ProfileStatus
  screenPermissions: ScreenPermission[]
  createdAt: Date
  updatedAt: Date
  usersCount?: number // Quantidade de usuários usando este perfil
}

// Schema de validação para criação/edição de perfil
export const profileSchema = z.object({
  name: z.string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .refine((val) => val.trim().length > 0, "Nome não pode ser vazio"),
  description: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  status: z.nativeEnum(ProfileStatus).default(ProfileStatus.ATIVO),
  screenPermissions: z.array(z.object({
    screenId: z.string(),
    screenName: z.string(),
    module: z.string(),
    permissions: z.array(z.object({
      type: z.nativeEnum(PermissionType),
      label: z.string(),
      enabled: z.boolean()
    }))
  })).min(1, "Selecione pelo menos uma permissão")
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Estrutura de módulos e telas do sistema
export interface SystemModule {
  id: string
  name: string
  screens: SystemScreen[]
}

export interface SystemScreen {
  id: string
  name: string
  moduleId: string
  availablePermissions: PermissionType[]
}

// Mapeamento de permissões para labels em português
export const permissionLabels: Record<PermissionType, string> = {
  [PermissionType.VISUALIZAR]: "Visualizar",
  [PermissionType.CRIAR]: "Criar",
  [PermissionType.EDITAR]: "Editar",
  [PermissionType.EXCLUIR]: "Excluir",
  [PermissionType.EDITAR_CONFIDENCIALIDADE]: "Editar Confidencialidade",
  [PermissionType.EXPORTAR]: "Exportar"
}

// Status labels em português
export const statusLabels: Record<ProfileStatus, string> = {
  [ProfileStatus.ATIVO]: "Ativo",
  [ProfileStatus.INATIVO]: "Inativo"
}

// Módulos e telas do sistema (baseado no sidebar-config)
export const systemModules: SystemModule[] = [
  {
    id: "sistema",
    name: "Sistema e Infraestrutura",
    screens: [
      {
        id: "alertas",
        name: "Alertas e Notificações",
        moduleId: "sistema",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR]
      },
      {
        id: "cobrancas",
        name: "Cobranças em Atraso",
        moduleId: "sistema",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR, PermissionType.EXPORTAR]
      }
    ]
  },
  {
    id: "escritorio",
    name: "Escritório",
    screens: [
      {
        id: "clientes",
        name: "Cadastro de Clientes",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR, PermissionType.EDITAR_CONFIDENCIALIDADE, PermissionType.EXPORTAR]
      },
      {
        id: "processos",
        name: "Gestão de Processos",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR, PermissionType.EDITAR_CONFIDENCIALIDADE]
      },
      {
        id: "contratos",
        name: "Contratos e Procurações",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR, PermissionType.EXPORTAR]
      },
      {
        id: "agenda",
        name: "Agenda",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR]
      },
      {
        id: "tarefas",
        name: "Tarefas",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR]
      },
      {
        id: "receitas-despesas",
        name: "Receitas e Despesas",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.CRIAR, PermissionType.EDITAR, PermissionType.EXCLUIR, PermissionType.EXPORTAR]
      },
      {
        id: "balancete",
        name: "Balancete",
        moduleId: "escritorio",
        availablePermissions: [PermissionType.VISUALIZAR, PermissionType.EXPORTAR]
      }
    ]
  }
]
