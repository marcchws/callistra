import { z } from "zod"

export interface PerfilAcesso {
  id: string
  nome: string
  descricao?: string
  status: "ativo" | "inativo"
  permissoes: PermissaoTela[]
  createdAt: Date
  updatedAt: Date
}

export interface PermissaoTela {
  telaId: string
  telaNome: string
  modulo: string
  permissoes: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    excluir: boolean
    editarConfidencialidade: boolean
    exportar: boolean
  }
}

export interface TelaDisponivel {
  id: string
  nome: string
  modulo: string
  descricao?: string
  permissoesDisponiveis: string[]
}

// Schema de validação para criação/edição de perfil
export const perfilAcessoSchema = z.object({
  nome: z.string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .refine((name) => name.trim().length > 0, "Nome não pode ser apenas espaços"),
  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
  permissoes: z.array(z.object({
    telaId: z.string().min(1, "ID da tela é obrigatório"),
    telaNome: z.string().min(1, "Nome da tela é obrigatório"),
    modulo: z.string().min(1, "Módulo é obrigatório"),
    permissoes: z.object({
      visualizar: z.boolean().default(false),
      criar: z.boolean().default(false),
      editar: z.boolean().default(false),
      excluir: z.boolean().default(false),
      editarConfidencialidade: z.boolean().default(false),
      exportar: z.boolean().default(false)
    })
  })).default([])
})

export type PerfilAcessoForm = z.infer<typeof perfilAcessoSchema>

// Dados mock das telas disponíveis no sistema
export const telasDisponiveis: TelaDisponivel[] = [
  // Sistema e Infraestrutura
  {
    id: "sistema-alertas",
    nome: "Alertas e Notificações",
    modulo: "Sistema",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir"]
  },
  {
    id: "sistema-cobrancas",
    nome: "Cobranças em Atraso",
    modulo: "Sistema", 
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "exportar"]
  },
  
  // Escritório
  {
    id: "escritorio-usuarios",
    nome: "Gerenciar Usuários",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "editarConfidencialidade"]
  },
  {
    id: "escritorio-clientes",
    nome: "Cadastro de Clientes", 
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "editarConfidencialidade", "exportar"]
  },
  {
    id: "escritorio-processos",
    nome: "Gestão de Processos",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "editarConfidencialidade", "exportar"]
  },
  {
    id: "escritorio-especialidades",
    nome: "Cadastro de Especialidades",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir"]
  },
  {
    id: "escritorio-agenda",
    nome: "Agenda",
    modulo: "Escritório", 
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "exportar"]
  },
  {
    id: "escritorio-contratos",
    nome: "Contratos e Procurações",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "editarConfidencialidade", "exportar"]
  },
  {
    id: "escritorio-tarefas",
    nome: "Tarefas",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "exportar"]
  },
  {
    id: "escritorio-chat",
    nome: "Chat Interno",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir"]
  },
  {
    id: "escritorio-helpdesk",
    nome: "Helpdesk",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "exportar"]
  },
  {
    id: "escritorio-financeiro",
    nome: "Receitas e Despesas",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir", "editarConfidencialidade", "exportar"]
  },
  {
    id: "escritorio-balancete",
    nome: "Balancete",
    modulo: "Escritório",
    permissoesDisponiveis: ["visualizar", "exportar"]
  },
  {
    id: "escritorio-niveis-acesso",
    nome: "Níveis de Acesso",
    modulo: "Escritório", 
    permissoesDisponiveis: ["visualizar", "criar", "editar", "excluir"]
  }
]

export const permissaoLabels = {
  visualizar: "Visualizar",
  criar: "Criar", 
  editar: "Editar",
  excluir: "Excluir",
  editarConfidencialidade: "Editar Confidencialidade",
  exportar: "Exportar"
}
