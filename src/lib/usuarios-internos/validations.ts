// Validações Zod para Usuários Internos
// Atende todos os critérios de aceite do PRD

import { z } from "zod"

// Regex para validação de telefone DDI+DDD+NÚMERO
const phoneRegex = /^\+\d{1,3}\s?\d{2}\s?\d{4,5}-?\d{4}$/

// Schema principal do usuário
export const usuarioSchema = z.object({
  nome: z.string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  cargo: z.string()
    .min(1, "Cargo é obrigatório"),
  
  telefone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(phoneRegex, "Formato inválido. Use: +55 11 98765-4321"),
  
  email: z.string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  
  perfilAcesso: z.string()
    .min(1, "Perfil de acesso é obrigatório"),
  
  status: z.enum(["ativo", "inativo"])
    .default("ativo"),
  
  // Campos opcionais
  salario: z.coerce.number()
    .positive("Salário deve ser positivo")
    .optional()
    .or(z.literal("")),
  
  banco: z.string()
    .max(50, "Nome do banco muito longo")
    .optional(),
  
  agencia: z.string()
    .max(10, "Agência deve ter no máximo 10 caracteres")
    .optional(),
  
  contaCorrente: z.string()
    .max(20, "Conta corrente deve ter no máximo 20 caracteres")
    .optional(),
  
  chavePix: z.string()
    .max(100, "Chave PIX muito longa")
    .optional(),
  
  observacao: z.string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional()
})

// Schema para criação (todos os campos obrigatórios devem estar presentes)
export const criarUsuarioSchema = usuarioSchema

// Schema para edição (permite campos parciais)
export const editarUsuarioSchema = usuarioSchema.partial().extend({
  id: z.string(),
  // Garante que pelo menos um campo seja fornecido
}).refine(data => Object.keys(data).length > 1, {
  message: "Pelo menos um campo deve ser alterado"
})

// Schema para upload de foto
export const uploadFotoSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Arquivo deve ter no máximo 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      "Formato inválido. Use: JPG, PNG ou WEBP"
    )
})

// Schema para upload de documentos
export const uploadDocumentoSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Arquivo deve ter no máximo 10MB")
    .refine(
      (file) => [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type),
      "Formato inválido. Use: PDF, JPG, PNG, DOC ou DOCX"
    ),
  tipo: z.enum(['termo_confidencialidade', 'rg_cpf', 'passaporte', 'outro'])
})

// Schema para filtros de busca
export const filtrosSchema = z.object({
  busca: z.string().optional(),
  status: z.enum(['todos', 'ativo', 'inativo']).optional(),
  cargo: z.string().optional(),
  perfilAcesso: z.string().optional()
})

// Schema para alteração de status
export const alterarStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['ativo', 'inativo']),
  motivo: z.string().optional()
})

// Tipos inferidos dos schemas
export type UsuarioFormData = z.infer<typeof usuarioSchema>
export type CriarUsuarioData = z.infer<typeof criarUsuarioSchema>
export type EditarUsuarioData = z.infer<typeof editarUsuarioSchema>
export type FiltrosData = z.infer<typeof filtrosSchema>
export type AlterarStatusData = z.infer<typeof alterarStatusSchema>