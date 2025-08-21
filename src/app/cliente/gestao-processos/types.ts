import { z } from "zod"

// Tipos baseados EXCLUSIVAMENTE nos campos especificados no PRD
export interface Processo {
  id: string
  pasta?: string
  nomeCliente: string // Obrigatório
  qualificacaoCliente: string // Obrigatório  
  outrosEnvolvidos: string // Obrigatório
  qualificacaoEnvolvidos: string // Obrigatório
  tituloProcesso?: string
  instancia?: string
  numero?: string
  juizo?: string
  vara?: string
  foro?: string
  acao?: string
  tribunal?: string
  linkTribunal?: string
  objeto?: string
  valorCausa?: number
  distribuidoEm?: Date
  valorCondenacao?: number
  observacoes?: string
  dataModificacao?: Date
  observacaoModificacao?: string
  responsavel: string // Obrigatório
  honorarios?: string[]
  acesso: 'publico' | 'privado' | 'envolvidos'
  criadoEm: Date
  atualizadoEm: Date
  criadoPor: string
  atualizadoPor: string
}

// Esquema de validação Zod baseado nos campos obrigatórios especificados
export const ProcessoSchema = z.object({
  pasta: z.string().optional(),
  nomeCliente: z.string().min(1, "Nome do Cliente é obrigatório"),
  qualificacaoCliente: z.string().min(1, "Qualificação do cliente é obrigatória"),
  outrosEnvolvidos: z.string().min(1, "Outros envolvidos é obrigatório"),
  qualificacaoEnvolvidos: z.string().min(1, "Qualificação é obrigatória"),
  tituloProcesso: z.string().optional(),
  instancia: z.string().optional(),
  numero: z.string().optional(),
  juizo: z.string().optional(),
  vara: z.string().optional(),
  foro: z.string().optional(),
  acao: z.string().optional(),
  tribunal: z.string().optional(),
  linkTribunal: z.string().optional(),
  objeto: z.string().optional(),
  valorCausa: z.number().optional(),
  distribuidoEm: z.date().optional(),
  valorCondenacao: z.number().optional(),
  observacoes: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  honorarios: z.array(z.string()).optional().default([]),
  acesso: z.enum(['publico', 'privado', 'envolvidos']).default('publico')
})

export type ProcessoFormData = z.infer<typeof ProcessoSchema>

// Tipos para filtros de busca baseados nos campos pesquisáveis especificados
export interface ProcessoFilters {
  pasta?: string
  nomeCliente?: string
  outrosEnvolvidos?: string
  vara?: string
  foro?: string
  acao?: string
  responsavel?: string
  acesso?: 'publico' | 'privado' | 'envolvidos' | 'todos'
  instancia?: string
  tribunal?: string
}

// Tipos para histórico de alterações (auditoria)
export interface ProcessoHistorico {
  id: string
  processoId: string
  acao: 'criacao' | 'edicao' | 'exclusao'
  camposAlterados?: string[]
  valoresAnteriores?: Partial<Processo>
  valoresNovos?: Partial<Processo>
  usuario: string
  dataHora: Date
  observacoes?: string
}

// Opções para campos select
export const QUALIFICACOES_OPTIONS = [
  { value: 'autor', label: 'Autor' },
  { value: 'reu', label: 'Réu' },
  { value: 'testemunha', label: 'Testemunha' },
  { value: 'assistente', label: 'Assistente' },
  { value: 'opoente', label: 'Opoente' },
  { value: 'terceiro', label: 'Terceiro Interessado' }
]

export const INSTANCIAS_OPTIONS = [
  { value: '1-grau', label: '1º Grau' },
  { value: '2-grau', label: '2º Grau' },
  { value: 'superior', label: 'Tribunal Superior' },
  { value: 'supremo', label: 'Supremo Tribunal' }
]

export const TRIBUNAIS_OPTIONS = [
  { value: 'tjsp', label: 'TJSP - Tribunal de Justiça de São Paulo' },
  { value: 'tjrj', label: 'TJRJ - Tribunal de Justiça do Rio de Janeiro' },
  { value: 'tjmg', label: 'TJMG - Tribunal de Justiça de Minas Gerais' },
  { value: 'trf3', label: 'TRF3 - Tribunal Regional Federal da 3ª Região' },
  { value: 'tst', label: 'TST - Tribunal Superior do Trabalho' },
  { value: 'stj', label: 'STJ - Superior Tribunal de Justiça' },
  { value: 'stf', label: 'STF - Supremo Tribunal Federal' }
]

export const ACESSO_OPTIONS = [
  { value: 'publico', label: 'Público' },
  { value: 'privado', label: 'Privado' },
  { value: 'envolvidos', label: 'Restrito aos Envolvidos' }
]

// Estados para controle da UI
export interface ProcessosState {
  processos: Processo[]
  filtros: ProcessoFilters
  loading: boolean
  error: string | null
  processoSelecionado: Processo | null
  modalAberto: boolean
  modoEdicao: boolean
  historicoAberto: boolean
}
