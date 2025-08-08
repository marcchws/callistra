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
  Clock
} from "lucide-react"

export interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  module: string
  description?: string
}

export const sidebarConfig: SidebarItem[] = [
  // Sistema e Infraestrutura
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    module: "sistema",
    description: "Visão geral do sistema"
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
  
  // Escritório como Cliente
  {
    title: "Usuários",
    href: "/escritorio/usuarios",
    icon: Users,
    module: "escritorio",
    description: "Gerenciar usuários internos"
  },
  {
    title: "Clientes",
    href: "/escritorio/clientes",
    icon: UserCheck,
    module: "escritorio",
    description: "Cadastro de clientes"
  },
  {
    title: "Processos",
    href: "/escritorio/processos",
    icon: FileText,
    module: "escritorio",
    description: "Gestão de processos"
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
    href: "/escritorio/agenda",
    icon: Calendar,
    module: "escritorio",
    description: "Agenda de compromissos"
  },
  {
    title: "Contratos e Procurações",
    href: "/escritorio/contratos",
    icon: Briefcase,
    module: "escritorio",
    description: "Gestão de contratos"
  },
  {
    title: "Tarefas",
    href: "/escritorio/tarefas",
    icon: Clock,
    module: "escritorio",
    description: "Gerenciamento de tarefas"
  },
  {
    title: "Chat Interno",
    href: "/escritorio/chat-interno",
    icon: MessageSquare,
    module: "escritorio",
    description: "Comunicação interna"
  },
  {
    title: "Helpdesk",
    href: "/escritorio/helpdesk",
    icon: HelpCircle,
    module: "escritorio",
    description: "Suporte interno"
  },
  {
    title: "Receitas e Despesas",
    href: "/escritorio/receitas-despesas",
    icon: Receipt,
    module: "escritorio",
    description: "Gestão financeira"
  },
  {
    title: "Balancete",
    href: "/escritorio/balancete",
    icon: BarChart3,
    module: "escritorio",
    description: "Relatórios financeiros"
  },
]

export const moduleLabels = {
  sistema: "Sistema e Infraestrutura",
  saas: "Callistra SaaS",
  escritorio: "Escritório"
}
