import { z } from "zod"

// Schema de validação do formulário de contato (Requisito: Critério 6)
export const contactFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string()
    .min(10, "Telefone inválido")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  company: z.string().min(1, "Nome do escritório é obrigatório"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos",
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Configurações da empresa (Requisito: Critérios 7, 8, 9, 10)
export interface CompanyConfig {
  phone: string
  whatsapp: string
  email: string
  address: string
  socialMedia: {
    linkedin?: string
    instagram?: string
    facebook?: string
    twitter?: string
  }
}

// Scripts externos (Requisito: Critério 11)
export interface ExternalScript {
  id: string
  type: 'pixel' | 'chat' | 'analytics' | 'tag'
  src?: string
  innerHTML?: string
  async?: boolean
  defer?: boolean
}

// Cookie preferences (Requisito: Critério 2 - LGPD)
export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

// Seções da landing page (Requisito: Critério 5)
export type LandingSection = 'hero' | 'about' | 'services' | 'contact' | 'footer'

// Planos de serviço
export interface ServicePlan {
  id: string
  name: string
  description: string
  features: string[]
  price?: string
  recommended?: boolean
}

// Estados do formulário
export interface FormState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
