import { z } from "zod"

// Enums para tipos e status
export type DocumentType = "contrato" | "procuracao"
export type PaymentStatus = "pendente" | "pago" | "inadimplente"
export type PaymentFormat = "a_vista" | "parcelado" | "mensal" | "trimestral" | "customizado"

// Interface para Assinatura (versão simplificada)
export interface Signature {
  id: string
  nome: string
  tipo: "cliente" | "advogado" | "terceiro"
  status: "pendente" | "assinado"
  ordem: number
}

// Schema de validação para o formulário
export const ContractSchema = z.object({
  id: z.string().optional(),
  tipoDocumento: z.enum(["contrato", "procuracao"], {
    required_error: "Tipo de documento é obrigatório"
  }),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  modeloCustomizado: z.any().optional(), // Para upload de arquivo
  cliente: z.string().min(1, "Cliente é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  oab: z.string().optional(),
  enderecoComercial: z.string().optional(),
  valorNegociado: z.number().min(0, "Valor negociado é obrigatório"),
  formatoPagamento: z.enum(["a_vista", "parcelado", "mensal", "trimestral", "customizado"], {
    required_error: "Formato de pagamento é obrigatório"
  }),
  parcelas: z.number().optional(),
  valorParcela: z.number().optional(),
  dataInicio: z.date({
    required_error: "Data de início é obrigatória"
  }),
  dataTermino: z.date().optional(),
  statusPagamento: z.enum(["pendente", "pago", "inadimplente"]).default("pendente"),
  assinaturas: z.array(z.object({
    id: z.string(),
    nome: z.string().min(1, "Nome é obrigatório"),
    tipo: z.enum(["cliente", "advogado", "terceiro"]),
    status: z.enum(["pendente", "assinado"]).default("pendente"),
    ordem: z.number().min(1)
  })).min(1, "Pelo menos uma assinatura é obrigatória"),
  anexos: z.array(z.any()).optional(),
  observacoes: z.string().optional(),
  conteudoDocumento: z.string().optional(), // Conteúdo editável do documento
})

export type ContractFormData = z.infer<typeof ContractSchema>

// Interface completa do Contrato/Procuração
export interface Contract {
  id: string
  tipoDocumento: DocumentType
  modelo: string
  modeloCustomizado?: File | null
  cliente: string
  clienteId?: string
  responsavel: string
  oab?: string
  enderecoComercial?: string
  valorNegociado: number
  formatoPagamento: PaymentFormat
  parcelas?: number
  valorParcela?: number
  dataInicio: Date
  dataTermino?: Date
  statusPagamento: PaymentStatus
  renegociacoes: Renegotiation[]
  assinaturas: Signature[] // Mudança de string[] para Signature[]
  anexos?: Attachment[]
  observacoes?: string
  conteudoDocumento?: string
  // Integração com contas a receber
  contasReceberId?: string
  valorPago?: number
  dataPagamento?: Date
  // Metadados
  dataCriacao: Date
  ultimaAtualizacao: Date
  criadoPor?: string
}

// Interface para Renegociação
export interface Renegotiation {
  id: string
  data: Date
  descricao: string
  valorAnterior: number
  novoValor: number
  motivoRenegociacao: string
  responsavel: string
}

// Interface para Anexos
export interface Attachment {
  id: string
  nome: string
  tipo: string
  tamanho: number
  url: string
  dataUpload: Date
}

// Interface para filtros de busca
export interface ContractFilters {
  cliente?: string
  tipoDocumento?: DocumentType
  statusPagamento?: PaymentStatus
  dataInicio?: Date
  dataFim?: Date
  valorMin?: number
  valorMax?: number
}

// Modelos de sistema predefinidos
export const SYSTEM_TEMPLATES = [
  { value: "contrato_prestacao_servico", label: "Contrato de Prestação de Serviços" },
  { value: "contrato_honorarios", label: "Contrato de Honorários Advocatícios" },
  { value: "procuracao_geral", label: "Procuração Geral" },
  { value: "procuracao_judicial", label: "Procuração ad Judicia" },
  { value: "procuracao_extrajudicial", label: "Procuração Extrajudicial" },
  { value: "contrato_parceria", label: "Contrato de Parceria" },
  { value: "customizado", label: "Modelo Customizado (Upload)" },
]

// Mock de dados para demonstração
export const mockContracts: Contract[] = [
  {
    id: "1",
    tipoDocumento: "contrato",
    modelo: "contrato_honorarios",
    cliente: "João Silva",
    clienteId: "client1",
    responsavel: "Dr. Carlos Oliveira",
    oab: "123456/SP",
    enderecoComercial: "Rua das Flores, 123",
    valorNegociado: 5000,
    formatoPagamento: "parcelado",
    parcelas: 5,
    valorParcela: 1000,
    dataInicio: new Date("2024-01-15"),
    dataTermino: new Date("2024-06-15"),
    statusPagamento: "pago",
    renegociacoes: [],
    assinaturas: [
      {
        id: "sig1",
        nome: "João Silva",
        tipo: "cliente",
        status: "assinado",
        ordem: 1
      },
      {
        id: "sig2",
        nome: "Dr. Carlos Oliveira",
        tipo: "advogado",
        status: "assinado",
        ordem: 2
      }
    ],
    observacoes: "Contrato de honorários para processo trabalhista",
    contasReceberId: "rec1",
    valorPago: 5000,
    dataPagamento: new Date("2024-06-10"),
    dataCriacao: new Date("2024-01-15"),
    ultimaAtualizacao: new Date("2024-06-10"),
  },
  {
    id: "2",
    tipoDocumento: "procuracao",
    modelo: "procuracao_judicial",
    cliente: "Maria Santos",
    clienteId: "client2",
    responsavel: "Dra. Ana Costa",
    oab: "789012/RJ",
    valorNegociado: 0,
    formatoPagamento: "a_vista",
    dataInicio: new Date("2024-02-01"),
    statusPagamento: "pendente",
    renegociacoes: [],
    assinaturas: [
      {
        id: "sig3",
        nome: "Maria Santos",
        tipo: "cliente",
        status: "pendente",
        ordem: 1
      },
      {
        id: "sig4",
        nome: "Dra. Ana Costa",
        tipo: "advogado",
        status: "pendente",
        ordem: 2
      }
    ],
    dataCriacao: new Date("2024-02-01"),
    ultimaAtualizacao: new Date("2024-02-01"),
  },
  {
    id: "3",
    tipoDocumento: "contrato",
    modelo: "contrato_prestacao_servico",
    cliente: "Empresa XYZ Ltda",
    clienteId: "client3",
    responsavel: "Dr. Pedro Almeida",
    oab: "345678/MG",
    enderecoComercial: "Av. Principal, 456",
    valorNegociado: 15000,
    formatoPagamento: "mensal",
    valorParcela: 2500,
    parcelas: 6,
    dataInicio: new Date("2024-03-01"),
    dataTermino: new Date("2024-08-31"),
    statusPagamento: "inadimplente",
    renegociacoes: [
      {
        id: "reneg1",
        data: new Date("2024-05-15"),
        descricao: "Redução de parcela mensal",
        valorAnterior: 2500,
        novoValor: 2000,
        motivoRenegociacao: "Dificuldades financeiras do cliente",
        responsavel: "Dr. Pedro Almeida"
      }
    ],
    assinaturas: [
      {
        id: "sig5",
        nome: "Empresa XYZ Ltda",
        tipo: "cliente",
        status: "assinado",
        ordem: 1
      },
      {
        id: "sig6",
        nome: "Dr. Pedro Almeida",
        tipo: "advogado",
        status: "assinado",
        ordem: 2
      }
    ],
    observacoes: "Consultoria jurídica mensal",
    dataCriacao: new Date("2024-03-01"),
    ultimaAtualizacao: new Date("2024-05-15"),
  }
]
