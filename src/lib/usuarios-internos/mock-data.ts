// Mock data para desenvolvimento e testes
// Atende todos os cenários de uso especificados no PRD

import { UsuarioInterno, HistoricoAlteracao } from './types'

export const mockUsuarios: UsuarioInterno[] = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Administrador',
    telefone: '+55 11 98765-4321',
    email: 'joao.silva@callistra.com.br',
    perfilAcesso: '1', // Admin
    status: 'ativo',
    salario: 8500,
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    contaCorrente: '98765-4',
    chavePix: 'joao.silva@callistra.com.br',
    observacao: 'Responsável geral pelo sistema',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    documentosAnexos: [
      {
        id: 'doc1',
        nome: 'Termo de Confidencialidade.pdf',
        tipo: 'termo_confidencialidade',
        url: '/docs/termo-joao.pdf',
        tamanho: 245000,
        uploadEm: new Date('2024-01-15'),
        uploadPor: 'Sistema'
      },
      {
        id: 'doc2',
        nome: 'RG e CPF.pdf',
        tipo: 'rg_cpf',
        url: '/docs/rg-joao.pdf',
        tamanho: 1850000,
        uploadEm: new Date('2024-01-15'),
        uploadPor: 'Sistema'
      }
    ],
    criadoPor: 'Sistema',
    criadoEm: new Date('2024-01-01'),
    modificadoPor: 'Admin',
    modificadoEm: new Date('2024-01-20')
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cargo: 'Gerente de Contas',
    telefone: '+55 21 98888-7777',
    email: 'maria.santos@callistra.com.br',
    perfilAcesso: '2', // Gerente
    status: 'ativo',
    salario: 6500,
    banco: 'Itaú',
    agencia: '0001',
    contaCorrente: '12345-6',
    chavePix: '123.456.789-00',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    documentosAnexos: [
      {
        id: 'doc3',
        nome: 'Termo de Confidencialidade.pdf',
        tipo: 'termo_confidencialidade',
        url: '/docs/termo-maria.pdf',
        tamanho: 245000,
        uploadEm: new Date('2024-02-01'),
        uploadPor: 'João Silva'
      }
    ],
    criadoPor: 'João Silva',
    criadoEm: new Date('2024-02-01'),
    modificadoPor: 'João Silva',
    modificadoEm: new Date('2024-02-15')
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cargo: 'Analista de Suporte',
    telefone: '+55 11 95555-3333',
    email: 'pedro.oliveira@callistra.com.br',
    perfilAcesso: '3', // Suporte
    status: 'ativo',
    salario: 4500,
    banco: 'Bradesco',
    agencia: '3456',
    contaCorrente: '78901-2',
    chavePix: 'pedro.oliveira@callistra.com.br',
    observacao: 'Atende clientes do plano Premium',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    documentosAnexos: [],
    criadoPor: 'Maria Santos',
    criadoEm: new Date('2024-03-01')
  },
  {
    id: '4',
    nome: 'Ana Costa',
    cargo: 'Desenvolvedor',
    telefone: '+55 31 97777-5555',
    email: 'ana.costa@callistra.com.br',
    perfilAcesso: '1', // Admin
    status: 'ativo',
    salario: 9500,
    banco: 'Nubank',
    agencia: '0001',
    contaCorrente: '1234567-8',
    chavePix: 'ana.costa@callistra.com.br',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    documentosAnexos: [
      {
        id: 'doc4',
        nome: 'Passaporte.pdf',
        tipo: 'passaporte',
        url: '/docs/passaporte-ana.pdf',
        tamanho: 3200000,
        uploadEm: new Date('2024-03-15'),
        uploadPor: 'João Silva'
      }
    ],
    criadoPor: 'João Silva',
    criadoEm: new Date('2024-03-10')
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    cargo: 'Analista Financeiro',
    telefone: '+55 41 96666-4444',
    email: 'carlos.ferreira@callistra.com.br',
    perfilAcesso: '4', // Visualizador
    status: 'inativo',
    salario: 5000,
    banco: 'Caixa Econômica',
    agencia: '1234',
    contaCorrente: '00123-4',
    observacao: 'Desligado em 01/11/2024',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    documentosAnexos: [],
    criadoPor: 'Maria Santos',
    criadoEm: new Date('2024-01-15'),
    modificadoPor: 'João Silva',
    modificadoEm: new Date('2024-11-01')
  },
  {
    id: '6',
    nome: 'Beatriz Lima',
    cargo: 'Designer',
    telefone: '+55 11 94444-2222',
    email: 'beatriz.lima@callistra.com.br',
    perfilAcesso: '4', // Visualizador
    status: 'ativo',
    salario: 5500,
    chavePix: '987.654.321-00',
    fotoPerfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz',
    documentosAnexos: [],
    criadoPor: 'Ana Costa',
    criadoEm: new Date('2024-04-01')
  }
]

export const mockHistorico: HistoricoAlteracao[] = [
  {
    id: 'h1',
    usuarioId: '1',
    acao: 'criacao',
    realizadoPor: 'Sistema',
    realizadoEm: new Date('2024-01-01'),
    detalhes: 'Usuário criado no sistema'
  },
  {
    id: 'h2',
    usuarioId: '1',
    acao: 'edicao',
    campoAlterado: 'salario',
    valorAnterior: '7500',
    valorNovo: '8500',
    realizadoPor: 'Admin',
    realizadoEm: new Date('2024-01-20'),
    detalhes: 'Ajuste salarial'
  },
  {
    id: 'h3',
    usuarioId: '2',
    acao: 'criacao',
    realizadoPor: 'João Silva',
    realizadoEm: new Date('2024-02-01'),
    detalhes: 'Novo colaborador contratado'
  },
  {
    id: 'h4',
    usuarioId: '5',
    acao: 'desativacao',
    realizadoPor: 'João Silva',
    realizadoEm: new Date('2024-11-01'),
    detalhes: 'Colaborador desligado da empresa'
  },
  {
    id: 'h5',
    usuarioId: '3',
    acao: 'edicao',
    campoAlterado: 'perfilAcesso',
    valorAnterior: 'Visualizador',
    valorNovo: 'Suporte',
    realizadoPor: 'Maria Santos',
    realizadoEm: new Date('2024-03-15'),
    detalhes: 'Promoção para analista de suporte'
  }
]

// Função para simular busca de usuários
export const buscarUsuarios = (filtros: {
  busca?: string
  status?: string
  cargo?: string
  perfilAcesso?: string
}) => {
  let resultado = [...mockUsuarios]
  
  if (filtros.busca) {
    const termo = filtros.busca.toLowerCase()
    resultado = resultado.filter(u => 
      u.nome.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo) ||
      u.cargo.toLowerCase().includes(termo)
    )
  }
  
  if (filtros.status && filtros.status !== 'todos') {
    resultado = resultado.filter(u => u.status === filtros.status)
  }
  
  if (filtros.cargo) {
    resultado = resultado.filter(u => u.cargo === filtros.cargo)
  }
  
  if (filtros.perfilAcesso) {
    resultado = resultado.filter(u => u.perfilAcesso === filtros.perfilAcesso)
  }
  
  return resultado
}

// Função para simular histórico de um usuário
export const buscarHistorico = (usuarioId: string) => {
  return mockHistorico.filter(h => h.usuarioId === usuarioId)
}

// Função para verificar e-mail duplicado
export const emailJaCadastrado = (email: string, excluirId?: string) => {
  return mockUsuarios.some(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.id !== excluirId
  )
}