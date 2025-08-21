import { z } from "zod"

// Tipos baseados EXATAMENTE nos campos especificados no PRD
export type TipoLancamento = "receita" | "despesa"
export type StatusLancamento = "pendente" | "historico"

// Categorias baseadas no link fornecido - implementação com categorias padrão
export const categoriasReceitas = [
  "Honorários Advocatícios",
  "Taxas e Custas Processuais",
  "Consultorias",
  "Pareceres Jurídicos",
  "Contratos",
  "Outras Receitas"
] as const

export const categoriasDespesas = [
  "Material de Escritório",
  "Taxas e Custas Judiciais",
  "Despesas com Pessoal",
  "Infraestrutura",
  "Marketing",
  "Outras Despesas"
] as const

export const subcategoriasReceitas = {
  "Honorários Advocatícios": ["Sucesso", "Contrato", "Dativo", "Pro Labore"],
  "Taxas e Custas Processuais": ["Custas Judiciais", "Despesas Cartoriais", "Perícias"],
  "Consultorias": ["Consultoria Empresarial", "Consultoria Tributária", "Consultoria Trabalhista"],
  "Pareceres Jurídicos": ["Parecer Cível", "Parecer Tributário", "Parecer Trabalhista"],
  "Contratos": ["Elaboração", "Revisão", "Aditivos"],
  "Outras Receitas": ["Reembolsos", "Juros", "Diversas"]
} as const

export const subcategoriasDespesas = {
  "Material de Escritório": ["Papelaria", "Informática", "Móveis"],
  "Taxas e Custas Judiciais": ["Custas Processuais", "Cartório", "Perícias"],
  "Despesas com Pessoal": ["Salários", "Encargos", "Benefícios"],
  "Infraestrutura": ["Aluguel", "Energia", "Internet", "Telefone"],
  "Marketing": ["Publicidade", "Site", "Material Gráfico"],
  "Outras Despesas": ["Combustível", "Manutenção", "Diversas"]
} as const

export interface Anexo {
  id: string
  nome: string
  url: string
  tipo: string
  tamanho: number
  dataUpload: Date
}

export interface Renegociacao {
  id: string
  dataRenegociacao: Date
  valorOriginal: number
  novoValor: number
  jurosAplicados: number
  observacoes?: string
  usuarioResponsavel: string
}

export interface LancamentoFinanceiro {
  id: string
  tipo: TipoLancamento
  categoria: string
  subcategoria: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: StatusLancamento
  processo?: string
  beneficiario?: string
  anexos?: Anexo[]
  renegociacoes?: Renegociacao[]
  observacoes?: string
  // Campos de auditoria
  criadoPor: string
  criadoEm: Date
  modificadoPor?: string
  modificadoEm?: Date
}

// Schema de validação baseado nos critérios de aceite
export const LancamentoFinanceiroSchema = z.object({
  tipo: z.enum(["receita", "despesa"], {
    required_error: "Tipo é obrigatório"
  }),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  subcategoria: z.string().min(1, "Subcategoria é obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  dataVencimento: z.date({
    required_error: "Data de vencimento é obrigatória"
  }),
  dataPagamento: z.date().optional(),
  processo: z.string().optional(),
  beneficiario: z.string().optional(),
  observacoes: z.string().optional()
})

export type LancamentoFinanceiroForm = z.infer<typeof LancamentoFinanceiroSchema>

// Schema para renegociação
export const RenegociacaoSchema = z.object({
  novoValor: z.number().positive("Novo valor deve ser positivo"),
  jurosAplicados: z.number().min(0, "Juros não podem ser negativos"),
  observacoes: z.string().optional()
})

export type RenegociacaoForm = z.infer<typeof RenegociacaoSchema>

// Filtros para busca conforme critérios de aceite
export interface FiltrosLancamento {
  tipo?: TipoLancamento
  categoria?: string
  status?: StatusLancamento
  processo?: string
  beneficiario?: string
  dataInicio?: Date
  dataFim?: Date
  valorMinimo?: number
  valorMaximo?: number
}

// Agrupamento conforme especificado
export type TipoAgrupamento = "processo" | "beneficiario" | "nenhum"

export interface LancamentoAgrupado {
  chave: string
  lancamentos: LancamentoFinanceiro[]
  totalReceitas: number
  totalDespesas: number
  saldo: number
}
