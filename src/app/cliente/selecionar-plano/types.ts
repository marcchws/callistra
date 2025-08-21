import { z } from "zod"

// Enum para tipos de plano (AC1, AC2)
export enum TipoPlano {
  FREE = "free",
  STANDARD = "standard", 
  PREMIUM = "premium",
  ENTERPRISE = "enterprise"
}

// Enum para formas de pagamento (AC4)
export enum FormaPagamento {
  CARTAO = "cartao",
  PIX = "pix", 
  BOLETO = "boleto"
}

// Enum para status de pagamento (AC5)
export enum StatusPagamento {
  EM_ANALISE = "em_analise",
  APROVADO = "aprovado",
  RECUSADO = "recusado"
}

// Schema para dados básicos do escritório (AC3, AC11)
export const dadosEscritorioSchema = z.object({
  nomeEscritorio: z
    .string()
    .min(1, "Nome do escritório é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  
  nomeContratante: z
    .string()
    .min(1, "Nome do contratante é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  emailContratante: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail deve ter um formato válido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato 00.000.000/0000-00"),
  
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\+\d{2}\s\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone deve estar no formato +55 (00) 00000-0000"),
  
  senha: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Senha deve conter letras, números e caracteres especiais")
})

// Schema para dados de cartão de crédito (AC4)
export const dadosCartaoSchema = z.object({
  numeroCartao: z
    .string()
    .min(1, "Número do cartão é obrigatório")
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Número deve estar no formato 0000 0000 0000 0000"),
  
  validadeCartao: z
    .string()
    .min(1, "Validade é obrigatória")
    .regex(/^\d{2}\/\d{2}$/, "Validade deve estar no formato MM/AA"),
  
  cvv: z
    .string()
    .min(3, "CVV deve ter 3 ou 4 dígitos")
    .max(4, "CVV deve ter 3 ou 4 dígitos")
    .regex(/^\d{3,4}$/, "CVV deve conter apenas números"),
  
  nomeTitular: z
    .string()
    .min(1, "Nome do titular é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  parcelas: z
    .number()
    .min(1, "Mínimo 1 parcela")
    .max(12, "Máximo 12 parcelas"),
  
  cpfCnpjTitular: z
    .string()
    .min(1, "CPF/CNPJ do titular é obrigatório")
    .refine((doc) => {
      const numbers = doc.replace(/\D/g, '')
      return numbers.length === 11 || numbers.length === 14
    }, "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"),
  
  endereco: z
    .string()
    .min(1, "Endereço é obrigatório")
    .min(10, "Endereço deve ter pelo menos 10 caracteres")
    .max(300, "Endereço deve ter no máximo 300 caracteres")
})

// Schema completo de assinatura
export const assinaturaSchema = z.object({
  planoSelecionado: z.nativeEnum(TipoPlano),
  formaPagamento: z.nativeEnum(FormaPagamento),
  dadosEscritorio: dadosEscritorioSchema,
  dadosCartao: dadosCartaoSchema.optional(),
})

// Tipos derivados dos schemas
export type DadosEscritorio = z.infer<typeof dadosEscritorioSchema>
export type DadosCartao = z.infer<typeof dadosCartaoSchema>
export type AssinaturaData = z.infer<typeof assinaturaSchema>

// Interface para planos disponíveis
export interface PlanoInfo {
  id: TipoPlano
  nome: string
  preco: number
  precoAnual?: number
  descricao: string
  recursos: string[]
  recomendado?: boolean
  customizado?: boolean
  usuariosInclusos: number
  processosInclusos: number
}

// Interface para assinatura completa
export interface Assinatura {
  id: string // ID gerado automaticamente
  planoSelecionado: TipoPlano
  nomeEscritorio: string
  nomeContratante: string
  emailContratante: string
  cnpj: string
  telefone: string
  formaPagamento: FormaPagamento
  statusPagamento: StatusPagamento
  dadosCartao?: DadosCartao
  dataCriacao: Date
  dataVencimento?: Date
  valorTotal: number
  ativo: boolean
}

// Interface para upgrade/downgrade
export interface CalculoUpgrade {
  planoAtual: TipoPlano
  planoNovo: TipoPlano
  valorAtual: number
  valorNovo: number
  diasRestantes: number
  valorProporcional: number
  valorTotal: number
  acessoImediato: boolean
}

// Interface para respostas de API
export interface PagamentoResponse {
  success: boolean
  message: string
  assinaturaId?: string
  boleto?: {
    url: string
    codigoBarras: string
    dataVencimento: string
  }
  pix?: {
    qrCode: string
    chave: string
    valor: number
  }
  error?: {
    code: string
    details?: string
  }
}

// Estados do checkout
export interface CheckoutState {
  etapaAtual: 'plano' | 'dados' | 'pagamento' | 'confirmacao'
  loading: boolean
  errors: Record<string, string>
  planoSelecionado?: TipoPlano
  assinaturaAtual?: Assinatura
}

// Dados dos planos (baseado nos requisitos SaaS)
export const PLANOS_DISPONIVEIS: PlanoInfo[] = [
  {
    id: TipoPlano.FREE,
    nome: "Gratuito",
    preco: 0,
    descricao: "Ideal para testar a plataforma",
    recursos: [
      "1 usuário",
      "10 processos",
      "Funcionalidades básicas",
      "Suporte por e-mail"
    ],
    usuariosInclusos: 1,
    processosInclusos: 10
  },
  {
    id: TipoPlano.STANDARD,
    nome: "Standard",
    preco: 199,
    precoAnual: 1990,
    descricao: "Para escritórios pequenos",
    recursos: [
      "5 usuários",
      "100 processos",
      "Todas as funcionalidades",
      "Suporte por chat",
      "Backup diário"
    ],
    usuariosInclusos: 5,
    processosInclusos: 100
  },
  {
    id: TipoPlano.PREMIUM,
    nome: "Premium",
    preco: 399,
    precoAnual: 3990,
    descricao: "Para escritórios médios",
    recursos: [
      "15 usuários",
      "500 processos", 
      "Todas as funcionalidades",
      "Suporte prioritário",
      "Backup em tempo real",
      "Relatórios avançados"
    ],
    recomendado: true,
    usuariosInclusos: 15,
    processosInclusos: 500
  },
  {
    id: TipoPlano.ENTERPRISE,
    nome: "Enterprise",
    preco: 0,
    descricao: "Solução customizada para grandes escritórios",
    recursos: [
      "Usuários ilimitados",
      "Processos ilimitados",
      "Funcionalidades customizadas",
      "Suporte dedicado",
      "Treinamento incluso",
      "Integração personalizada"
    ],
    customizado: true,
    usuariosInclusos: -1, // Ilimitado
    processosInclusos: -1 // Ilimitado
  }
]
