import { z } from "zod"

// Enums para campos específicos
export const QualificacaoEnum = z.enum([
  "autor",
  "reu",
  "testemunha",
  "terceiro_interessado",
  "assistente",
  "denunciante",
  "denunciado",
  "reclamante",
  "reclamado"
])

export const InstanciaEnum = z.enum([
  "1_grau",
  "2_grau",
  "superior",
  "supremo"
])

export const NivelAcessoEnum = z.enum([
  "publico",
  "privado",
  "envolvidos"
])

export const TribunalEnum = z.enum([
  "tjsp",
  "tjrj",
  "tjmg",
  "tjrs",
  "tjpr",
  "tjsc",
  "tjba",
  "tjpe",
  "tjce",
  "tjgo",
  "tjdf",
  "tjma",
  "tjpb",
  "tjpa",
  "tjmt",
  "tjms",
  "tjes",
  "tjrn",
  "tjal",
  "tjse",
  "tjpi",
  "tjro",
  "tjac",
  "tjam",
  "tjrr",
  "tjap",
  "tjto",
  "trf1",
  "trf2",
  "trf3",
  "trf4",
  "trf5",
  "trf6",
  "stj",
  "stf",
  "tst",
  "tse"
])

export const HonorariosEnum = z.enum([
  "contratual_fixo",
  "contratual_percentual",
  "sucumbencia",
  "arbitrado",
  "acordo",
  "dativos",
  "assistencia_judiciaria"
])

// Schema do Processo
export const ProcessoSchema = z.object({
  id: z.string().optional(),
  pasta: z.string().min(1, "Pasta é obrigatória"),
  nomeCliente: z.string().min(1, "Nome do Cliente é obrigatório"),
  qualificacaoCliente: QualificacaoEnum,
  outrosEnvolvidos: z.string().min(1, "Outros envolvidos é obrigatório"),
  qualificacaoOutros: QualificacaoEnum,
  titulo: z.string().optional(),
  instancia: InstanciaEnum.optional(),
  numero: z.string().optional(),
  juizo: z.string().optional(),
  vara: z.string().optional(),
  foro: z.string().optional(),
  acao: z.string().optional(),
  tribunal: TribunalEnum.optional(),
  linkTribunal: z.string().url().optional().or(z.literal("")),
  objeto: z.string().optional(),
  valorCausa: z.string().optional(),
  distribuidoEm: z.string().optional(),
  valorCondenacao: z.string().optional(),
  observacoes: z.string().optional(),
  dataModificacao: z.string().optional(),
  observacaoModificacao: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  honorarios: z.array(HonorariosEnum).optional(),
  acesso: NivelAcessoEnum,
  // Campos de auditoria
  criadoEm: z.string().optional(),
  criadoPor: z.string().optional(),
  atualizadoEm: z.string().optional(),
  atualizadoPor: z.string().optional()
})

export type Processo = z.infer<typeof ProcessoSchema>

// Schema para filtros de busca
export const ProcessoFilterSchema = z.object({
  searchTerm: z.string().optional(),
  campo: z.enum([
    "todos",
    "pasta",
    "nomeCliente",
    "outrosEnvolvidos",
    "vara",
    "foro",
    "acao",
    "responsavel"
  ]).optional(),
  instancia: InstanciaEnum.optional().or(z.literal("")),
  tribunal: TribunalEnum.optional().or(z.literal("")),
  acesso: NivelAcessoEnum.optional().or(z.literal("")),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional()
})

export type ProcessoFilter = z.infer<typeof ProcessoFilterSchema>

// Schema para histórico de alterações
export const HistoricoAlteracaoSchema = z.object({
  id: z.string(),
  processoId: z.string(),
  acao: z.enum(["criacao", "edicao", "exclusao", "visualizacao", "alteracao_acesso"]),
  usuario: z.string(),
  dataHora: z.string(),
  detalhes: z.string().optional(),
  camposAlterados: z.array(z.object({
    campo: z.string(),
    valorAnterior: z.string().optional(),
    valorNovo: z.string().optional()
  })).optional()
})

export type HistoricoAlteracao = z.infer<typeof HistoricoAlteracaoSchema>

// Mapas para exibição
export const QualificacaoLabels: Record<string, string> = {
  autor: "Autor",
  reu: "Réu",
  testemunha: "Testemunha",
  terceiro_interessado: "Terceiro Interessado",
  assistente: "Assistente",
  denunciante: "Denunciante",
  denunciado: "Denunciado",
  reclamante: "Reclamante",
  reclamado: "Reclamado"
}

export const InstanciaLabels: Record<string, string> = {
  "1_grau": "1º Grau",
  "2_grau": "2º Grau",
  "superior": "Superior",
  "supremo": "Supremo"
}

export const NivelAcessoLabels: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  envolvidos: "Envolvidos"
}

export const TribunalLabels: Record<string, string> = {
  tjsp: "TJ-SP - Tribunal de Justiça de São Paulo",
  tjrj: "TJ-RJ - Tribunal de Justiça do Rio de Janeiro",
  tjmg: "TJ-MG - Tribunal de Justiça de Minas Gerais",
  tjrs: "TJ-RS - Tribunal de Justiça do Rio Grande do Sul",
  tjpr: "TJ-PR - Tribunal de Justiça do Paraná",
  tjsc: "TJ-SC - Tribunal de Justiça de Santa Catarina",
  tjba: "TJ-BA - Tribunal de Justiça da Bahia",
  tjpe: "TJ-PE - Tribunal de Justiça de Pernambuco",
  tjce: "TJ-CE - Tribunal de Justiça do Ceará",
  tjgo: "TJ-GO - Tribunal de Justiça de Goiás",
  tjdf: "TJ-DF - Tribunal de Justiça do Distrito Federal",
  tjma: "TJ-MA - Tribunal de Justiça do Maranhão",
  tjpb: "TJ-PB - Tribunal de Justiça da Paraíba",
  tjpa: "TJ-PA - Tribunal de Justiça do Pará",
  tjmt: "TJ-MT - Tribunal de Justiça de Mato Grosso",
  tjms: "TJ-MS - Tribunal de Justiça de Mato Grosso do Sul",
  tjes: "TJ-ES - Tribunal de Justiça do Espírito Santo",
  tjrn: "TJ-RN - Tribunal de Justiça do Rio Grande do Norte",
  tjal: "TJ-AL - Tribunal de Justiça de Alagoas",
  tjse: "TJ-SE - Tribunal de Justiça de Sergipe",
  tjpi: "TJ-PI - Tribunal de Justiça do Piauí",
  tjro: "TJ-RO - Tribunal de Justiça de Rondônia",
  tjac: "TJ-AC - Tribunal de Justiça do Acre",
  tjam: "TJ-AM - Tribunal de Justiça do Amazonas",
  tjrr: "TJ-RR - Tribunal de Justiça de Roraima",
  tjap: "TJ-AP - Tribunal de Justiça do Amapá",
  tjto: "TJ-TO - Tribunal de Justiça de Tocantins",
  trf1: "TRF-1 - Tribunal Regional Federal da 1ª Região",
  trf2: "TRF-2 - Tribunal Regional Federal da 2ª Região",
  trf3: "TRF-3 - Tribunal Regional Federal da 3ª Região",
  trf4: "TRF-4 - Tribunal Regional Federal da 4ª Região",
  trf5: "TRF-5 - Tribunal Regional Federal da 5ª Região",
  trf6: "TRF-6 - Tribunal Regional Federal da 6ª Região",
  stj: "STJ - Superior Tribunal de Justiça",
  stf: "STF - Supremo Tribunal Federal",
  tst: "TST - Tribunal Superior do Trabalho",
  tse: "TSE - Tribunal Superior Eleitoral"
}

export const HonorariosLabels: Record<string, string> = {
  contratual_fixo: "Contratual Fixo",
  contratual_percentual: "Contratual Percentual",
  sucumbencia: "Sucumbência",
  arbitrado: "Arbitrado",
  acordo: "Acordo",
  dativos: "Dativos",
  assistencia_judiciaria: "Assistência Judiciária"
}

// URLs dos tribunais
export const TribunalUrls: Record<string, string> = {
  tjsp: "https://esaj.tjsp.jus.br",
  tjrj: "http://www4.tjrj.jus.br",
  tjmg: "https://www.tjmg.jus.br",
  tjrs: "https://www.tjrs.jus.br",
  tjpr: "https://www.tjpr.jus.br",
  tjsc: "https://www.tjsc.jus.br",
  tjba: "http://esaj.tjba.jus.br",
  tjpe: "https://www.tjpe.jus.br",
  tjce: "https://www.tjce.jus.br",
  tjgo: "https://www.tjgo.jus.br",
  tjdf: "https://www.tjdft.jus.br",
  tjma: "https://www.tjma.jus.br",
  tjpb: "https://www.tjpb.jus.br",
  tjpa: "http://www.tjpa.jus.br",
  tjmt: "http://www.tjmt.jus.br",
  tjms: "https://www.tjms.jus.br",
  tjes: "http://www.tjes.jus.br",
  tjrn: "https://www.tjrn.jus.br",
  tjal: "https://www.tjal.jus.br",
  tjse: "http://www.tjse.jus.br",
  tjpi: "http://www.tjpi.jus.br",
  tjro: "https://www.tjro.jus.br",
  tjac: "https://www.tjac.jus.br",
  tjam: "https://www.tjam.jus.br",
  tjrr: "http://www.tjrr.jus.br",
  tjap: "https://www.tjap.jus.br",
  tjto: "http://www.tjto.jus.br",
  trf1: "https://www.trf1.jus.br",
  trf2: "https://www.trf2.jus.br",
  trf3: "https://www.trf3.jus.br",
  trf4: "https://www.trf4.jus.br",
  trf5: "https://www.trf5.jus.br",
  trf6: "https://www.trf6.jus.br",
  stj: "https://www.stj.jus.br",
  stf: "https://www.stf.jus.br",
  tst: "https://www.tst.jus.br",
  tse: "https://www.tse.jus.br"
}