import { z } from "zod"

// Enums
export const TipoFuncionalidadeEnum = z.enum([
  "revisao_ortografica",
  "pesquisa_jurisprudencia", 
  "criacao_peca"
])

export const StatusPecaEnum = z.enum([
  "em_processamento",
  "concluida",
  "erro",
  "compartilhada"
])

export const TipoPecaJuridicaEnum = z.enum([
  "peticao_inicial",
  "contestacao",
  "recurso_apelacao",
  "recurso_especial",
  "recurso_extraordinario",
  "agravo_instrumento",
  "embargos_declaracao",
  "habeas_corpus",
  "mandado_seguranca",
  "acao_cautelar",
  "contrato_prestacao_servicos",
  "contrato_locacao",
  "procuracao",
  "notificacao_extrajudicial",
  "parecer_juridico"
])

// Schemas de validação
export const UploadArquivoSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    "Arquivo deve ter no máximo 10MB"
  ).refine(
    (file) => ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
    "Apenas arquivos PDF ou DOCX são permitidos"
  )
})

export const PromptSchema = z.object({
  prompt: z.string().min(10, "Prompt deve ter no mínimo 10 caracteres").max(5000, "Prompt deve ter no máximo 5000 caracteres"),
  tipoFuncionalidade: TipoFuncionalidadeEnum,
  tipoPeca: TipoPecaJuridicaEnum.optional()
})

export const CompartilhamentoSchema = z.object({
  pecaId: z.string(),
  usuarioDestinoId: z.string(),
  permissoes: z.object({
    podeExportar: z.boolean().default(true),
    podeIntegrarCliente: z.boolean().default(true)
  })
})

export const IntegracaoClienteSchema = z.object({
  pecaId: z.string(),
  clienteId: z.string()
})

// Types
export type TipoFuncionalidade = z.infer<typeof TipoFuncionalidadeEnum>
export type StatusPeca = z.infer<typeof StatusPecaEnum>
export type TipoPecaJuridica = z.infer<typeof TipoPecaJuridicaEnum>

export interface PecaJuridica {
  id: string
  tipo: TipoFuncionalidade
  tipoPeca?: TipoPecaJuridica
  titulo: string
  conteudo: string
  promptUtilizado: string
  status: StatusPeca
  tokensUtilizados: number
  usuarioCriadorId: string
  usuarioCriadorNome: string
  dataCriacao: Date
  dataUltimaModificacao: Date
  arquivoOriginal?: {
    nome: string
    tipo: string
    tamanho: number
  }
  arquivoProcessado?: {
    nome: string
    url: string
  }
  compartilhamentos: Compartilhamento[]
}

export interface Compartilhamento {
  id: string
  usuarioDestinoId: string
  usuarioDestinoNome: string
  dataCompartilhamento: Date
  permissoes: {
    podeExportar: boolean
    podeIntegrarCliente: boolean
  }
}

export interface Cliente {
  id: string
  nome: string
  cpfCnpj: string
  email: string
  telefone: string
  endereco: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
}

export interface PlanoTokens {
  planoId: string
  planoNome: string
  tokensTotal: number
  tokensUtilizados: number
  tokensRestantes: number
  dataRenovacao: Date
}

export interface ResultadoPesquisa {
  id: string
  titulo: string
  tribunal: string
  relator: string
  dataJulgamento: Date
  ementa: string
  link?: string
}

// Prompts pré-configurados
export const PROMPTS_PADRAO = {
  revisao_ortografica: `Por favor, revise ortograficamente o documento jurídico anexado, corrigindo:
- Erros de ortografia e gramática
- Concordância verbal e nominal
- Pontuação
- Formatação de citações jurídicas
- Padronização de termos técnicos

Mantenha o conteúdo e estrutura originais, fazendo apenas correções ortográficas e gramaticais.`,

  pesquisa_jurisprudencia: `Pesquise jurisprudências relevantes sobre o tema:
[DESCREVA O TEMA OU QUESTÃO JURÍDICA]

Por favor, forneça:
- Tribunal e número do processo
- Data do julgamento
- Relator
- Ementa
- Principais argumentos utilizados
- Link para o inteiro teor (se disponível)

Priorize decisões dos tribunais superiores (STF, STJ) e dos últimos 5 anos.`,

  peticao_inicial: `Crie uma petição inicial com base nas seguintes informações:

PARTES:
- Autor: [NOME DO AUTOR]
- Réu: [NOME DO RÉU]

FATOS:
[DESCREVA OS FATOS RELEVANTES]

FUNDAMENTOS JURÍDICOS:
[INDIQUE AS BASES LEGAIS]

PEDIDOS:
[LISTE OS PEDIDOS]

A petição deve seguir a estrutura formal: endereçamento, qualificação das partes, dos fatos, do direito, dos pedidos e requerimentos finais.`,

  contestacao: `Elabore uma contestação com base nas seguintes informações:

PROCESSO: [NÚMERO DO PROCESSO]
AUTOR: [NOME DO AUTOR]
RÉU: [NOME DO RÉU]

PRELIMINARES (se houver):
[DESCREVA AS PRELIMINARES]

MÉRITO:
[APRESENTE A DEFESA DE MÉRITO]

A contestação deve impugnar especificamente os fatos narrados na inicial e apresentar a versão do réu.`,

  recurso_apelacao: `Elabore um recurso de apelação considerando:

SENTENÇA RECORRIDA:
[RESUMO DA SENTENÇA]

FUNDAMENTOS DO RECURSO:
[RAZÕES PARA REFORMA DA SENTENÇA]

O recurso deve demonstrar o erro da decisão e requerer sua reforma ou anulação.`
}

// Tipos de peças com descrições
export const TIPOS_PECAS_INFO = {
  peticao_inicial: {
    label: "Petição Inicial",
    descricao: "Peça que dá início ao processo judicial"
  },
  contestacao: {
    label: "Contestação", 
    descricao: "Resposta do réu à petição inicial"
  },
  recurso_apelacao: {
    label: "Recurso de Apelação",
    descricao: "Recurso contra sentença de primeiro grau"
  },
  recurso_especial: {
    label: "Recurso Especial",
    descricao: "Recurso ao STJ por violação de lei federal"
  },
  recurso_extraordinario: {
    label: "Recurso Extraordinário",
    descricao: "Recurso ao STF por questão constitucional"
  },
  agravo_instrumento: {
    label: "Agravo de Instrumento",
    descricao: "Recurso contra decisão interlocutória"
  },
  embargos_declaracao: {
    label: "Embargos de Declaração",
    descricao: "Recurso para esclarecer obscuridade, contradição ou omissão"
  },
  habeas_corpus: {
    label: "Habeas Corpus",
    descricao: "Remédio constitucional contra prisão ilegal"
  },
  mandado_seguranca: {
    label: "Mandado de Segurança",
    descricao: "Ação contra ato de autoridade"
  },
  acao_cautelar: {
    label: "Ação Cautelar",
    descricao: "Medida urgente para assegurar direito"
  },
  contrato_prestacao_servicos: {
    label: "Contrato de Prestação de Serviços",
    descricao: "Contrato de serviços advocatícios"
  },
  contrato_locacao: {
    label: "Contrato de Locação",
    descricao: "Contrato de locação de imóvel"
  },
  procuracao: {
    label: "Procuração",
    descricao: "Instrumento de mandato judicial"
  },
  notificacao_extrajudicial: {
    label: "Notificação Extrajudicial",
    descricao: "Comunicação formal extrajudicial"
  },
  parecer_juridico: {
    label: "Parecer Jurídico",
    descricao: "Opinião técnica sobre questão jurídica"
  }
}