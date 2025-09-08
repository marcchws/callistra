import { LucideIcon, 
  LayoutDashboard, 
  Settings, 
  Bell,
  CreditCard,
  Building,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  HelpCircle,
  Receipt,
  BarChart3,
  Shield,
  Briefcase,
  UserCheck,
  BookOpen,
  Clock,
  Target,
  Headphones,
  UserCog,
  Globe,
  Edit,
  LogIn,
  KeyRound,
  Bot,
  Upload,
  Brain,
  MonitorSpeaker,
  PlayCircle
} from "lucide-react"

export interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  module: string
  description?: string
}

export const sidebarConfig: SidebarItem[] = [
  // DEMOS COMERCIAIS
  {
    title: "🎭 Demo: IA Recursos OAB",
    href: "/demo-oab-recurso",
    icon: PlayCircle,
    module: "demo",
    description: "Demo baseada na reunião João Paula & Pedro (Pivot) - 29/08/2025"
  },
  {
    title: "📤 Upload de Prova",
    href: "/demo-oab-recurso/upload",
    icon: Upload,
    module: "demo",
    description: "Upload e processamento OCR da prova manuscrita"
  },
  {
    title: "🧠 Análise Prévia IA",
    href: "/demo-oab-recurso/analise",
    icon: Brain,
    module: "demo",
    description: "Análise de viabilidade do recurso por IA (R$ 50)"
  },
  {
    title: "📄 Recurso Gerado",
    href: "/demo-oab-recurso/recurso",
    icon: FileText,
    module: "demo",
    description: "Recurso administrativo gerado automaticamente"
  },
  {
    title: "📊 Painel Administrativo",
    href: "/demo-oab-recurso/admin",
    icon: MonitorSpeaker,
    module: "demo",
    description: "Dashboard gerencial da operação Pivot (Holanda)"
  },

  // Sistema e Infraestrutura
  {
    title: "Login: Autenticação",
    href: "/sistema/auth/login",
    icon: LogIn,
    module: "sistema",
    description: "Sistema de autenticação de usuários"
  },
  {
    title: "Recuperação de Senha",
    href: "/sistema/auth/recuperar-senha",
    icon: KeyRound,
    module: "sistema",
    description: "Recuperação de senha via e-mail"
  },
  {
    title: "Alertas e Notificações",
    href: "/sistema/alertas-notificacoes",
    icon: Bell,
    module: "sistema",
    description: "Central de alertas e notificações"
  },
  {
    title: "Cobranças em Atraso",
    href: "/sistema/cobrancas-atraso",
    icon: CreditCard,
    module: "sistema",
    description: "Gerenciamento de cobranças"
  },
  
  // SaaS Admin (Callistra)
  {
    title: "Landing Page - Site",
    href: "/saas/landing-page",
    icon: Globe,
    module: "saas",
    description: "Landing Page institucional responsiva com conformidade LGPD"
  },
  {
    title: "Gestão do Site: Edição de Conteúdo",
    href: "/saas/gestao-site",
    icon: Edit,
    module: "saas",
    description: "Editor simplificado de conteúdo da Landing Page com formatação básica e gestão de imagens"
  },
  {
    title: "Dashboard de Assinaturas",
    href: "/saas/dashboard-assinaturas",
    icon: BarChart3,
    module: "saas",
    description: "Visão geral das métricas de assinaturas"
  },
  {
    title: "Gestão de Planos",
    href: "/saas/planos",
    icon: Settings,
    module: "saas",
    description: "Administração de planos"
  },
  {
    title: "Clientes SaaS",
    href: "/saas/clientes",
    icon: Building,
    module: "saas",
    description: "Gestão de escritórios clientes"
  },
  {
    title: "Usuários Internos",
    href: "/saas/usuarios-internos",
    icon: UserCog,
    module: "saas",
    description: "Gerenciamento de usuários internos do SaaS"
  },
  {
    title: "Níveis de Acesso",
    href: "/saas/niveis-acesso",
    icon: Shield,
    module: "saas",
    description: "Criação e gestão de perfis de acesso"
  },
  {
    title: "Pesquisas NPS",
    href: "/saas/pesquisas-nps",
    icon: Target,
    module: "saas",
    description: "Criação e análise de pesquisas de satisfação"
  },
  {
    title: "Tickets de Suporte",
    href: "/saas/tickets-suporte",
    icon: Headphones,
    module: "saas",
    description: "Gestão de tickets de suporte dos clientes"
  },
  
  // Escritório como Cliente
  {
    title: "Registro de Escritório",
    href: "/cliente/registro",
    icon: Building,
    module: "escritorio",
    description: "Cadastro de novo escritório no sistema"
  },
  {
    title: "Selecionar Plano de Assinatura",
    href: "/cliente/selecionar-plano",
    icon: CreditCard,
    module: "escritorio",
    description: "Seleção e contratação de planos de assinatura"
  },
  {
    title: "Níveis de Acesso",
    href: "/cliente/niveis-acesso",
    icon: Shield,
    module: "escritorio",
    description: "Criação e gestão de perfis de acesso com permissões granulares"
  },
  {
    title: "Gerenciar Usuários Internos",
    href: "/cliente/usuarios-internos",
    icon: Users,
    module: "escritorio",
    description: "Cadastro, edição, busca, filtragem e gerenciamento completo de usuários internos com controle de permissões e rastreabilidade"
  },
  {
    title: "Cadastro de Clientes",
    href: "/cliente/cadastro",
    icon: UserCheck,
    module: "escritorio",
    description: "Cadastro, edição e gerenciamento de clientes pessoa física, jurídica e parceiros, com controle de confidencialidade e histórico financeiro"
  },
  {
    title: "Gestão de Processos",
    href: "/cliente/gestao-processos",
    icon: FileText,
    module: "escritorio",
    description: "Cadastre, consulte e gerencie processos jurídicos com controle de acesso e rastreabilidade completa"
  },
  {
    title: "Especialidades",
    href: "/escritorio/especialidades",
    icon: BookOpen,
    module: "escritorio",
    description: "Cadastro de especialidades"
  },
  {
    title: "Agenda",
    href: "/cliente/agenda",
    icon: Calendar,
    module: "escritorio",
    description: "Agendamento, visualização e gerenciamento de compromissos, reuniões, tarefas e bloqueios com eventos recorrentes, notificações, anexos e integração com clientes e processos"
  },
  {
    title: "Contratos e Procurações",
    href: "/cliente/contratos-procuracoes",
    icon: Briefcase,
    module: "escritorio",
    description: "Criação, edição e gerenciamento de contratos e procurações com modelos do sistema, upload de modelos próprios, integração financeira, acompanhamento de valores negociados, renegociações, status de pagamentos e exportação em PDF/Word"
  },
  {
    title: "Tarefas",
    href: "/cliente/tarefas",
    icon: Clock,
    module: "escritorio",
    description: "Cadastro e gerenciamento de tarefas com anexos, priorização, categorização detalhada e vinculação a processos, clientes e advogados responsáveis"
  },
  {
    title: "Chat Interno",
    href: "/cliente/chat-interno",
    icon: MessageSquare,
    module: "escritorio",
    description: "Troca de mensagens em tempo real entre usuários e clientes externos com áudios, anexos e histórico completo"
  },
  {
    title: "Helpdesk",
    href: "/cliente/helpdesk",
    icon: HelpCircle,
    module: "escritorio",
    description: "Sistema de tickets de suporte com chat em tempo real para comunicação entre clientes e atendentes"
  },
  {
    title: "Receitas e Despesas",
    href: "/cliente/receitas-despesas",
    icon: Receipt,
    module: "escritorio",
    description: "Cadastro e gerenciamento de receitas e despesas com categorizações, anexos, renegociações e agrupamentos por processo ou beneficiário"
  },
  {
    title: "Criação de peças com IA",
    href: "/cliente/criacao-pecas-ia",
    icon: Bot,
    module: "escritorio",
    description: "Revisão ortográfica, pesquisa de jurisprudência e criação de peças jurídicas com auxílio de IA, controle de tokens por plano e compartilhamento"
  },
  {
    title: "Dashboard Analítico",
    href: "/cliente/dashboard-analitico",
    icon: BarChart3,
    module: "escritorio",
    description: "Indicadores estratégicos e operacionais com visualização de processos, faturamento, produtividade e exportação de dados"
  },
  {
    title: "Balancete",
    href: "/cliente/balancete",
    icon: BarChart3,
    module: "escritorio",
    description: "Relatório centralizado da posição financeira com ganhos, honorários, despesas, inadimplência e indicadores de performance com exportação PDF/CSV"
  },
]

export const moduleLabels = {
  demo: "Demos Comerciais",
  sistema: "Sistema e Infraestrutura",
  saas: "Callistra SaaS",
  escritorio: "Escritório"
}