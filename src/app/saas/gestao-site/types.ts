import { z } from "zod"

// Tipos de blocos editáveis
export type BlockType = "text" | "image" | "plans"

// Schema para bloco de texto
export const TextBlockSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  content: z.string(),
  formatting: z.object({
    bold: z.array(z.tuple([z.number(), z.number()])).optional(),
    italic: z.array(z.tuple([z.number(), z.number()])).optional(),
    bullets: z.array(z.number()).optional(),
  }).optional(),
  placeholder: z.string().optional(),
})

// Schema para bloco de imagem
export const ImageBlockSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  src: z.string().url().nullable(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

// Schema para bloco de planos
export const PlansBlockSchema = z.object({
  id: z.string(),
  type: z.literal("plans"),
  selectedPlanIds: z.array(z.string()),
})

// Union de todos os tipos de blocos
export const ContentBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  PlansBlockSchema,
])

// Schema para conteúdo da página
export const PageContentSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    blocks: z.array(ContentBlockSchema),
  })),
  lastModified: z.string().datetime(),
  modifiedBy: z.string(),
})

// Schema para histórico
export const HistoryEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  user: z.string(),
  action: z.enum(["text_edit", "image_upload", "image_delete", "plan_update", "section_update"]),
  details: z.string(),
  blockId: z.string().optional(),
  sectionId: z.string().optional(),
  oldValue: z.any().optional(),
  newValue: z.any().optional(),
})

// Schema para plano (vindo do sistema)
export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  features: z.array(z.string()),
  isActive: z.boolean(),
})

// Tipos TypeScript derivados dos schemas
export type TextBlock = z.infer<typeof TextBlockSchema>
export type ImageBlock = z.infer<typeof ImageBlockSchema>
export type PlansBlock = z.infer<typeof PlansBlockSchema>
export type ContentBlock = z.infer<typeof ContentBlockSchema>
export type PageContent = z.infer<typeof PageContentSchema>
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>
export type Plan = z.infer<typeof PlanSchema>

// Interface para seção editável
export interface EditableSection {
  id: string
  title: string
  blocks: ContentBlock[]
  isEditing?: boolean
}

// Interface para estado do editor
export interface EditorState {
  content: PageContent
  isDirty: boolean
  isSaving: boolean
  isPreview: boolean
  selectedBlockId: string | null
  history: HistoryEntry[]
}

// Dados mock para desenvolvimento
export const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Plano Básico",
    price: 99.90,
    features: ["5 usuários", "10 processos/mês", "Suporte por email"],
    isActive: true,
  },
  {
    id: "2",
    name: "Plano Profissional",
    price: 199.90,
    features: ["15 usuários", "50 processos/mês", "Suporte prioritário", "Relatórios avançados"],
    isActive: true,
  },
  {
    id: "3",
    name: "Plano Empresarial",
    price: 499.90,
    features: ["Usuários ilimitados", "Processos ilimitados", "Suporte 24/7", "API completa", "Personalização"],
    isActive: true,
  },
]

// Template inicial da landing page
export const initialPageContent: PageContent = {
  sections: [
    {
      id: "hero",
      title: "Hero Section",
      blocks: [
        {
          id: "hero-title",
          type: "text",
          content: "Callistra - Sistema Jurídico Completo",
          placeholder: "Título principal",
        },
        {
          id: "hero-subtitle",
          type: "text",
          content: "Otimize a gestão do seu escritório com nossa plataforma SaaS completa",
          placeholder: "Subtítulo",
        },
        {
          id: "hero-image",
          type: "image",
          src: null,
          alt: "Imagem principal",
        },
      ],
    },
    {
      id: "features",
      title: "Funcionalidades",
      blocks: [
        {
          id: "features-title",
          type: "text",
          content: "Recursos Poderosos para seu Escritório",
          placeholder: "Título da seção",
        },
        {
          id: "features-list",
          type: "text",
          content: "• Gestão completa de processos\n• Controle financeiro integrado\n• Agenda e compromissos\n• Chat com clientes\n• Relatórios automáticos",
          placeholder: "Lista de funcionalidades",
        },
      ],
    },
    {
      id: "plans",
      title: "Planos e Preços",
      blocks: [
        {
          id: "plans-title",
          type: "text",
          content: "Escolha o Plano Ideal",
          placeholder: "Título da seção de planos",
        },
        {
          id: "plans-selector",
          type: "plans",
          selectedPlanIds: ["1", "2", "3"],
        },
      ],
    },
  ],
  lastModified: new Date().toISOString(),
  modifiedBy: "Admin",
}
