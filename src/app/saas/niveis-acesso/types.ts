import { z } from "zod"

// Definição de permissões para cada tela
export interface Permission {
  visualizar: boolean
  criar: boolean
  editar: boolean
  excluir: boolean
}

// Interface principal do perfil de acesso
export interface AccessLevel {
  id: string
  nome: string
  descricao?: string
  status: 'ativo' | 'inativo'
  permissoes: Record<string, Permission>
  usuariosVinculados?: number // contador de usuários usando este perfil
  criadoEm: Date
  atualizadoEm: Date
}

// Schema de validação com Zod
export const AccessLevelSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  status: z.enum(['ativo', 'inativo']),
  permissoes: z.record(z.object({
    visualizar: z.boolean(),
    criar: z.boolean(),
    editar: z.boolean(),
    excluir: z.boolean()
  }))
})

export type AccessLevelFormData = z.infer<typeof AccessLevelSchema>

// Estrutura das telas do sistema organizadas por módulo
export interface SystemScreen {
  id: string
  nome: string
  modulo: string
  descricao?: string
}

// Módulos e suas telas (baseado no sidebar-config.ts)
export const systemScreens: SystemScreen[] = [
  // Sistema e Infraestrutura
  { id: 'auth-login', nome: 'Login: Autenticação', modulo: 'Sistema e Infraestrutura', descricao: 'Sistema de autenticação de usuários' },
  { id: 'auth-recuperar-senha', nome: 'Recuperação de Senha', modulo: 'Sistema e Infraestrutura', descricao: 'Recuperação de senha via e-mail' },
  { id: 'alertas-notificacoes', nome: 'Alertas e Notificações', modulo: 'Sistema e Infraestrutura', descricao: 'Central de alertas e notificações' },
  { id: 'cobrancas-atraso', nome: 'Cobranças em Atraso', modulo: 'Sistema e Infraestrutura', descricao: 'Gerenciamento de cobranças' },
  
  // SaaS Admin (Callistra)
  { id: 'landing-page', nome: 'Landing Page - Site', modulo: 'Callistra SaaS', descricao: 'Landing Page institucional' },
  { id: 'gestao-site', nome: 'Gestão do Site', modulo: 'Callistra SaaS', descricao: 'Editor de conteúdo da Landing Page' },
  { id: 'dashboard-assinaturas', nome: 'Dashboard de Assinaturas', modulo: 'Callistra SaaS', descricao: 'Visão geral das métricas' },
  { id: 'gestao-planos', nome: 'Gestão de Planos', modulo: 'Callistra SaaS', descricao: 'Administração de planos' },
  { id: 'clientes-saas', nome: 'Clientes SaaS', modulo: 'Callistra SaaS', descricao: 'Gestão de escritórios clientes' },
  { id: 'usuarios-internos-saas', nome: 'Usuários Internos', modulo: 'Callistra SaaS', descricao: 'Gerenciamento de usuários do SaaS' },
  { id: 'niveis-acesso-saas', nome: 'Níveis de Acesso', modulo: 'Callistra SaaS', descricao: 'Criação e gestão de perfis de acesso' },
  { id: 'pesquisas-nps', nome: 'Pesquisas NPS', modulo: 'Callistra SaaS', descricao: 'Pesquisas de satisfação' },
  { id: 'tickets-suporte', nome: 'Tickets de Suporte', modulo: 'Callistra SaaS', descricao: 'Gestão de tickets de suporte' },
  
  // Escritório como Cliente
  { id: 'registro-escritorio', nome: 'Registro de Escritório', modulo: 'Escritório', descricao: 'Cadastro de novo escritório' },
  { id: 'selecionar-plano', nome: 'Selecionar Plano', modulo: 'Escritório', descricao: 'Seleção de planos de assinatura' },
  { id: 'niveis-acesso-cliente', nome: 'Níveis de Acesso', modulo: 'Escritório', descricao: 'Gestão de perfis de acesso' },
  { id: 'usuarios-internos-cliente', nome: 'Usuários Internos', modulo: 'Escritório', descricao: 'Gerenciamento de usuários internos' },
  { id: 'cadastro-clientes', nome: 'Cadastro de Clientes', modulo: 'Escritório', descricao: 'Cadastro e gerenciamento de clientes' },
  { id: 'gestao-processos', nome: 'Gestão de Processos', modulo: 'Escritório', descricao: 'Gerenciamento de processos jurídicos' },
  { id: 'especialidades', nome: 'Especialidades', modulo: 'Escritório', descricao: 'Cadastro de especialidades' },
  { id: 'agenda', nome: 'Agenda', modulo: 'Escritório', descricao: 'Agendamento e gerenciamento de compromissos' },
  { id: 'contratos-procuracoes', nome: 'Contratos e Procurações', modulo: 'Escritório', descricao: 'Gestão de contratos e procurações' },
  { id: 'tarefas', nome: 'Tarefas', modulo: 'Escritório', descricao: 'Cadastro e gerenciamento de tarefas' },
  { id: 'chat-interno', nome: 'Chat Interno', modulo: 'Escritório', descricao: 'Comunicação em tempo real' },
  { id: 'helpdesk', nome: 'Helpdesk', modulo: 'Escritório', descricao: 'Sistema de tickets de suporte' },
  { id: 'receitas-despesas', nome: 'Receitas e Despesas', modulo: 'Escritório', descricao: 'Gestão financeira' },
  { id: 'criacao-pecas-ia', nome: 'Criação de Peças com IA', modulo: 'Escritório', descricao: 'Criação de peças jurídicas com IA' },
  { id: 'dashboard-analitico', nome: 'Dashboard Analítico', modulo: 'Escritório', descricao: 'Indicadores estratégicos' },
  { id: 'balancete', nome: 'Balancete', modulo: 'Escritório', descricao: 'Relatório de posição financeira' }
]

// Agrupa telas por módulo para exibição organizada
export function getScreensByModule(): Record<string, SystemScreen[]> {
  return systemScreens.reduce((acc, screen) => {
    if (!acc[screen.modulo]) {
      acc[screen.modulo] = []
    }
    acc[screen.modulo].push(screen)
    return acc
  }, {} as Record<string, SystemScreen[]>)
}

// Filtros disponíveis
export interface FilterState {
  search: string
  status: 'todos' | 'ativo' | 'inativo'
}
