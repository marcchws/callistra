import { z } from 'zod'

// Enums para melhor type safety
export enum TipoCliente {
  PESSOA_FISICA = 'pessoa_fisica',
  PESSOA_JURIDICA = 'pessoa_juridica'
}

export enum StatusCliente {
  ATIVO = 'ativo',
  INATIVO = 'inativo'
}

// Schema base para validação
const ClienteBaseSchema = z.object({
  // Campos comuns
  id: z.string().optional(),
  tipoCliente: z.nativeEnum(TipoCliente, {
    required_error: "Tipo de cliente é obrigatório"
  }),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  
  // Dados bancários (opcionais)
  banco: z.string().optional(),
  agencia: z.string().optional(),
  contaCorrente: z.string().optional(),
  chavePix: z.string().optional(),
  
  // Endereço (obrigatório)
  cep: z.string().min(8, "CEP é obrigatório").max(9),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório").max(2),
  
  // Controle
  confidencial: z.boolean().default(false),
  status: z.nativeEnum(StatusCliente).default(StatusCliente.ATIVO),
  
  // Autenticação do cliente
  login: z.string().min(1, "Login é obrigatório"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().optional(),
  
  // Anexos
  anexos: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.string(),
    url: z.string(),
    dataUpload: z.date()
  })).default([])
})

// Schema para Pessoa Física
export const PessoaFisicaSchema = ClienteBaseSchema.extend({
  tipoCliente: z.literal(TipoCliente.PESSOA_FISICA),
  nome: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório").max(14),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  // Campos específicos de PJ ficam opcionais/undefined
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
  responsavel: z.string().optional()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"]
})

// Schema para Pessoa Jurídica  
export const PessoaJuridicaSchema = ClienteBaseSchema.extend({
  tipoCliente: z.literal(TipoCliente.PESSOA_JURIDICA),
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  cnpj: z.string().min(14, "CNPJ é obrigatório").max(18),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  // Campos específicos de PF ficam opcionais/undefined
  nome: z.string().optional(),
  cpf: z.string().optional(),
  dataNascimento: z.string().optional()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não conferem", 
  path: ["confirmarSenha"]
})

// Union type para o schema completo
export const ClienteSchema = z.discriminatedUnion("tipoCliente", [
  PessoaFisicaSchema,
  PessoaJuridicaSchema
])

// Types derivados dos schemas
export type Cliente = z.infer<typeof ClienteSchema>
export type PessoaFisica = z.infer<typeof PessoaFisicaSchema>
export type PessoaJuridica = z.infer<typeof PessoaJuridicaSchema>

// Type para formulário (inclui confirmarSenha)
export type ClienteFormData = Cliente & {
  confirmarSenha: string
}

// Type para anexos
export interface Anexo {
  id: string
  nome: string
  tipo: string
  url: string
  dataUpload: Date
}

// Type para histórico financeiro
export interface HistoricoFinanceiro {
  id: string
  tipo: 'receber' | 'pagar'
  descricao: string
  valor: number
  dataVencimento: Date
  dataPagamento?: Date
  status: 'pendente' | 'pago' | 'atrasado'
  observacoes?: string
}

// Type para filtros de busca
export interface FiltrosCliente {
  termo?: string
  tipoCliente?: TipoCliente | 'todos'
  status?: StatusCliente | 'todos'
  confidencial?: boolean | 'todos'
}

// Type para paginação
export interface PaginacaoCliente {
  página: number
  itensPorPagina: number
  total: number
  totalPaginas: number
}

// Type para resposta da API
export interface RespostaClientesAPI {
  clientes: Cliente[]
  paginacao: PaginacaoCliente
}

// Type para ações da tabela
export interface AcaoCliente {
  tipo: 'visualizar' | 'editar' | 'excluir' | 'historico'
  cliente: Cliente
}

// Type para alertas de confidencialidade
export interface AlertaConfidencialidade {
  clienteId: string
  clienteNome: string
  usuarioId: string
  usuarioNome: string
  dataAlteracao: Date
  acao: 'adicionou' | 'removeu'
}