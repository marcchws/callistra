import { z } from "zod"

// Tipos baseados EXATAMENTE nos campos especificados no PRD
export interface Plano {
  id: string                          // Campo obrigatório de identificação
  nome: string                        // Campo Obrigatório 
  status: "ativo" | "inativo"         // Campo para dizer se um plano está ativo ou inativo
  vigencia?: Date                     // Data em que o plano irá vencer/expirar (opcional)
  valor: number                       // Campo obrigatório com o valor pago pelo plano
  formaPagamento: string              // Campo obrigatório exibindo a forma de pagamento
  descricao: string                   // Campo com descrição do que foi adquirido
  periodoFree: number                 // Campo para inclusão de dias gratuitos
  quantidadeUsuarios: number          // Campo para inclusão de limite máximo de usuários
  quantidadeProcessos: number         // Campo para inclusão de limite máximo de processos
  quantidadeTokensMensais: number     // Campo para inclusão de limite de tokens mensais IA
  diasInadimplencia: number           // Campo para limite de dias após vencimento antes de inadimplência
  diasBloqueio: number                // Campo para limite de dias inadimplente antes de bloquear acesso
  visivelSite: boolean                // Campo para verificar se plano deverá ser visível no site
  planoRecomendado: boolean           // Campo para informação visual de "plano recomendado"
  valorComDesconto?: number           // Possibilidade de desconto do valor final
  createdAt: Date
  updatedAt: Date
}

// Schema de validação baseado nos critérios de aceite
export const PlanoFormSchema = z.object({
  nome: z.string()
    .min(1, "Nome do plano é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  status: z.enum(["ativo", "inativo"], {
    required_error: "Status é obrigatório"
  }),
  
  vigencia: z.date().optional(),
  
  valor: z.number()
    .min(0, "Valor deve ser positivo")
    .refine((val) => val > 0, "Valor do plano é obrigatório"),
  
  formaPagamento: z.string()
    .min(1, "Forma de pagamento é obrigatória")
    .max(200, "Forma de pagamento deve ter no máximo 200 caracteres"),
  
  descricao: z.string()
    .min(1, "Descrição do plano é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  
  periodoFree: z.number()
    .min(0, "Período free deve ser positivo ou zero")
    .int("Período free deve ser um número inteiro"),
  
  quantidadeUsuarios: z.number()
    .min(1, "Quantidade de usuários deve ser no mínimo 1")
    .int("Quantidade de usuários deve ser um número inteiro"),
  
  quantidadeProcessos: z.number()
    .min(1, "Quantidade de processos deve ser no mínimo 1")
    .int("Quantidade de processos deve ser um número inteiro"),
  
  quantidadeTokensMensais: z.number()
    .min(0, "Quantidade de tokens deve ser positiva ou zero")
    .int("Quantidade de tokens deve ser um número inteiro"),
  
  diasInadimplencia: z.number()
    .min(0, "Dias para inadimplência deve ser positivo ou zero")
    .max(90, "Dias para inadimplência deve ser no máximo 90")
    .int("Dias para inadimplência deve ser um número inteiro"),
  
  diasBloqueio: z.number()
    .min(0, "Dias para bloqueio deve ser positivo ou zero")
    .max(365, "Dias para bloqueio deve ser no máximo 365")
    .int("Dias para bloqueio deve ser um número inteiro"),
  
  visivelSite: z.boolean().default(true),
  
  planoRecomendado: z.boolean().default(false),
  
  valorComDesconto: z.number()
    .min(0, "Valor com desconto deve ser positivo")
    .optional()
})

export type PlanoFormData = z.infer<typeof PlanoFormSchema>

// Tipos para filtros baseados nos critérios de aceite
export interface PlanoFilters {
  nome?: string                       // Filtro por nome do plano
  status?: "todos" | "ativo" | "inativo"  // Filtro por status do plano
  vigencia?: "vigente" | "expirado" | "todos"  // Filtro por vigência do plano
}

// Estados para gerenciamento da funcionalidade
export interface PlanoState {
  planos: Plano[]
  loading: boolean
  error: string | null
  filters: PlanoFilters
  selectedPlano: Plano | null
  showForm: boolean
  showDeleteDialog: boolean
}
