import { z } from "zod"

// Schema de validação baseado nos Acceptance Criteria AC1-AC6
export const registroEscritorioSchema = z.object({
  razaoSocial: z
    .string()
    .min(1, "Razão social é obrigatória")
    .min(3, "Razão social deve ter pelo menos 3 caracteres")
    .max(200, "Razão social deve ter no máximo 200 caracteres"),
  
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato 00.000.000/0000-00")
    .refine((cnpj) => {
      // Validação básica de CNPJ (AC5)
      const numbers = cnpj.replace(/\D/g, '')
      return numbers.length === 14
    }, "CNPJ deve ter 14 dígitos"),
  
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail deve ter um formato válido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000")
})

export type RegistroEscritorioData = z.infer<typeof registroEscritorioSchema>

// Estados do formulário
export interface RegistroFormState {
  loading: boolean
  errors: Record<string, string>
  success: boolean
}

// Response do backend (simulado)
export interface RegistroResponse {
  success: boolean
  message: string
  escritorioId?: string
  error?: {
    code: string
    details?: string
  }
}
