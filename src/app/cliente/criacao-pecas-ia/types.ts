import { z } from "zod"

// Tipos baseados EXATAMENTE nos campos especificados no PRD

export type TipoFuncionalidade = "revisao_ortografica" | "pesquisa_jurisprudencia" | "criacao_peca_juridica"

export type TipoPecaJuridica = 
  | "petição_inicial"
  | "contestação"
  | "recurso_apelação"
  | "embargos_declaração"
  | "agravo_instrumento"
  | "mandado_segurança"
  | "habeas_corpus"
  | "ação_trabalhista"
  | "defesa_trabalhista"
  | "recurso_trabalhista"

export interface PecaDocumento {
  id: string // ID da peça/documento - identificador único gerado automaticamente
  tipo_funcionalidade: TipoFuncionalidade // Tipo de funcionalidade
  lista_pecas_juridicas?: TipoPecaJuridica // Relação de tipos de peças disponíveis
  prompt_preconfigurado: string // Texto inicial sugerido pelo sistema, editável
  chat_peca_juridica: MensagemChat[] // Interface de conversa com IA, sem dados sensíveis
  dados_cliente_integrado?: DadosClienteIntegrado // Dados do cliente para integração (não salvos no chat)
  arquivo_exportado?: ArquivoExportado // Documento DOCX gerado com dados do cliente
  arquivo_revisado?: ArquivoRevisado // Documento corrigido ortograficamente
  resultado_pesquisa?: ResultadoPesquisa // Informações de jurisprudência retornadas
  compartilhamento: Compartilhamento[] // Controle de compartilhamento
  usuario_criador: string // Usuário responsável pela criação
  tokens_utilizados: number // Quantidade de tokens consumidos
  data_criacao: Date // Data e hora de criação
}

export interface MensagemChat {
  id: string
  tipo: "user" | "assistant"
  conteudo: string
  timestamp: Date
  tokens_consumidos?: number
}

export interface DadosClienteIntegrado {
  id: string
  nome: string
  documento: string
  endereco?: string
  telefone?: string
  email?: string
  // Outros dados necessários para preenchimento da peça (sem dados sensíveis salvos no chat)
}

export interface ArquivoExportado {
  nome: string
  url: string
  tipo: "docx"
  data_geracao: Date
}

export interface ArquivoRevisado {
  nome: string
  url: string
  tipo: "pdf" | "docx"
  data_revisao: Date
}

export interface ResultadoPesquisa {
  conteudo: string
  fontes?: string[]
  data_pesquisa: Date
}

export interface Compartilhamento {
  id: string
  usuario_destinatario: string
  data_compartilhamento: Date
  pode_integrar_cliente: boolean
  pode_exportar: boolean
}

export interface ControleTokens {
  plano_atual: string
  tokens_disponiveis: number
  tokens_utilizados_mes: number
  limite_mensal: number
  data_renovacao: Date
}

// Schemas de validação ZOD
export const PromptSchema = z.object({
  conteudo: z.string().min(10, "Prompt deve ter pelo menos 10 caracteres"),
  tipo_funcionalidade: z.enum(["revisao_ortografica", "pesquisa_jurisprudencia", "criacao_peca_juridica"]),
  tipo_peca: z.enum([
    "petição_inicial", "contestação", "recurso_apelação", "embargos_declaração",
    "agravo_instrumento", "mandado_segurança", "habeas_corpus", "ação_trabalhista",
    "defesa_trabalhista", "recurso_trabalhista"
  ]).optional()
})

export const CompartilhamentoSchema = z.object({
  usuario_destinatario: z.string().min(1, "Usuário destinatário é obrigatório"),
  pode_integrar_cliente: z.boolean().default(true),
  pode_exportar: z.boolean().default(true)
})

export const ArquivoUploadSchema = z.object({
  arquivo: z.instanceof(File).refine(
    (file) => file.type === "application/pdf" || 
             file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Apenas arquivos PDF ou DOCX são permitidos"
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    "Arquivo deve ter no máximo 10MB"
  )
})

// Estados de loading específicos para cada operação
export interface LoadingStates {
  enviando_ia: boolean
  integrando_cliente: boolean
  exportando_arquivo: boolean
  compartilhando: boolean
  excluindo: boolean
  carregando_historico: boolean
}

export type PecaAction = 
  | { type: "SET_LOADING"; payload: { key: keyof LoadingStates; value: boolean } }
  | { type: "SET_PECA"; payload: PecaDocumento }
  | { type: "ADD_MENSAGEM"; payload: MensagemChat }
  | { type: "SET_TOKENS"; payload: ControleTokens }
  | { type: "SET_ERROR"; payload: string | null }
