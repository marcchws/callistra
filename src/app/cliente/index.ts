// Exportação de tipos e utilidades do módulo de clientes
// Para uso em outros módulos do sistema

export type { 
  Cliente, 
  ClienteFormData, 
  ClienteFilters,
  Anexo,
  TransacaoFinanceira,
  TipoCliente,
  StatusCliente
} from './cadastro/types'

export { 
  formatarCpfCnpj, 
  formatarTelefone, 
  formatarCep,
  TipoCliente as TipoClienteEnum,
  StatusCliente as StatusClienteEnum,
  clienteFormSchema,
  clientePFSchema,
  clientePJSchema
} from './cadastro/types'

export { useClientes } from './cadastro/use-clientes'