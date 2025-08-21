"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  UsuarioInterno, 
  UsuariosInternosState, 
  FiltrosUsuarios, 
  CreateUsuarioRequest, 
  UpdateUsuarioRequest,
  HistoricoAuditoria,
  DocumentoAnexo,
  UploadResponse,
  mockEspecialidades,
  mockCargos,
  mockPerfisAcesso
} from "./types"

const MOCK_USUARIOS: UsuarioInterno[] = [
  {
    id: "1",
    nome: "Dr. João Silva Santos",
    cargo: "Advogado Sênior",
    telefone: "+5511987654321",
    email: "joao.silva@escritorio.com",
    perfilAcesso: "Advogado Senior",
    status: "ATIVO",
    especialidades: ["Direito Civil", "Direito Empresarial"],
    tipoHonorario: "Por hora",
    banco: "Banco do Brasil",
    agencia: "1234-5",
    contaCorrente: "12345-6",
    chavePix: "joao.silva@escritorio.com",
    observacao: "Responsável por casos empresariais complexos",
    fotoPerfil: "/placeholder-avatar.jpg",
    documentos: [
      {
        id: "doc1",
        tipo: "OAB",
        nomeArquivo: "oab-joao-silva.pdf",
        url: "/docs/oab-joao-silva.pdf",
        uploadedAt: new Date("2024-01-15"),
        uploadedBy: "Admin"
      }
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    createdBy: "Admin Master",
    updatedBy: "Admin Master"
  },
  {
    id: "2",
    nome: "Dra. Maria Oliveira",
    cargo: "Advogada Plena",
    telefone: "+5511876543210",
    email: "maria.oliveira@escritorio.com",
    perfilAcesso: "Advogado Senior",
    status: "ATIVO",
    especialidades: ["Direito Trabalhista", "Direito Previdenciário"],
    documentos: [],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    createdBy: "Admin Master",
    updatedBy: "Admin Master"
  },
  {
    id: "3",
    nome: "Carlos Eduardo Lima",
    cargo: "Estagiário",
    telefone: "+5511765432109",
    email: "carlos.lima@escritorio.com",
    perfilAcesso: "Estagiário",
    status: "INATIVO",
    especialidades: ["Direito Civil"],
    observacao: "Desativado por término do contrato de estágio",
    documentos: [],
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-31"),
    createdBy: "Admin Master",
    updatedBy: "Admin Master"
  }
]

const MOCK_HISTORICO: HistoricoAuditoria[] = [
  {
    id: "hist1",
    usuarioId: "3",
    acao: "DESATIVACAO",
    dadosAnteriores: { status: "ATIVO" },
    dadosNovos: { status: "INATIVO" },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-31T14:30:00"),
    observacoes: "Término do contrato de estágio"
  },
  {
    id: "hist2",
    usuarioId: "1",
    acao: "EDICAO",
    dadosAnteriores: { especialidades: ["Direito Civil"] },
    dadosNovos: { especialidades: ["Direito Civil", "Direito Empresarial"] },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-15T10:15:00"),
    observacoes: "Adicionada especialidade em Direito Empresarial"
  },
  {
    id: "hist3",
    usuarioId: "1",
    acao: "CRIACAO",
    dadosNovos: { 
      nome: "Dr. João Silva",
      email: "joao.silva@escritorio.com",
      cargo: "Advogado Sênior",
      status: "ATIVO"
    },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-01T09:00:00"),
    observacoes: "Usuário criado conforme solicitação do RH"
  },
  {
    id: "hist4",
    usuarioId: "2",
    acao: "CRIACAO",
    dadosNovos: { 
      nome: "Dra. Maria Santos",
      email: "maria.santos@escritorio.com",
      cargo: "Advogada Plena",
      status: "ATIVO"
    },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-05T14:30:00"),
    observacoes: "Contratação de nova advogada"
  },
  {
    id: "hist5",
    usuarioId: "2",
    acao: "EDICAO",
    dadosAnteriores: { cargo: "Advogada Júnior" },
    dadosNovos: { cargo: "Advogada Plena" },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-20T11:15:00"),
    observacoes: "Promoção para Advogada Plena"
  },
  {
    id: "hist6",
    usuarioId: "4",
    acao: "CRIACAO",
    dadosNovos: { 
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@escritorio.com",
      cargo: "Estagiário",
      status: "ATIVO"
    },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-10T08:45:00"),
    observacoes: "Início do estágio"
  },
  {
    id: "hist7",
    usuarioId: "5",
    acao: "CRIACAO",
    dadosNovos: { 
      nome: "Ana Costa",
      email: "ana.costa@escritorio.com",
      cargo: "Paralegal",
      status: "ATIVO"
    },
    realizadoPor: "Admin Master",
    realizadoEm: new Date("2024-01-12T16:20:00"),
    observacoes: "Contratação de paralegal"
  }
]

export function useUsuariosInternos() {
  const [state, setState] = useState<UsuariosInternosState>({
    usuarios: [],
    loading: false,
    error: null,
    filtros: {
      busca: "",
      status: "TODOS",
      cargo: "",
      perfilAcesso: "",
      especialidade: ""
    },
    paginacao: {
      pagina: 1,
      itensPorPagina: 10,
      total: 0
    },
    modalAberto: null,
    usuarioSelecionado: null,
    historicoAberto: false
  })

  // Carregar usuários (simula API call)
  const carregarUsuarios = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let usuariosFiltrados = [...MOCK_USUARIOS]
      
      // Aplicar filtros conforme Requirements
      if (state.filtros.busca) {
        const busca = state.filtros.busca.toLowerCase()
        usuariosFiltrados = usuariosFiltrados.filter(usuario =>
          usuario.nome.toLowerCase().includes(busca) ||
          usuario.cargo.toLowerCase().includes(busca) ||
          usuario.email.toLowerCase().includes(busca)
        )
      }
      
      if (state.filtros.status && state.filtros.status !== "TODOS") {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          usuario.status === state.filtros.status
        )
      }
      
      if (state.filtros.cargo) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          usuario.cargo === state.filtros.cargo
        )
      }
      
      if (state.filtros.perfilAcesso) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          usuario.perfilAcesso === state.filtros.perfilAcesso
        )
      }
      
      if (state.filtros.especialidade) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          usuario.especialidades.includes(state.filtros.especialidade)
        )
      }
      
      setState(prev => ({
        ...prev,
        usuarios: usuariosFiltrados,
        loading: false,
        paginacao: {
          ...prev.paginacao,
          total: usuariosFiltrados.length
        }
      }))
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao carregar usuários"
      }))
      toast.error("Erro ao carregar usuários", {
        position: "bottom-right",
        duration: 3000
      })
    }
  }, [state.filtros])

  // Criar novo usuário - Cenário 1, 2, 3
  const criarUsuario = async (request: CreateUsuarioRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Validação: E-mail duplicado (Cenário 3)
      const emailExiste = MOCK_USUARIOS.some(usuario => 
        usuario.email === request.dados.email
      )
      
      if (emailExiste) {
        toast.error("E-mail já cadastrado no sistema", {
          position: "bottom-right",
          duration: 3000
        })
        setState(prev => ({ ...prev, loading: false }))
        return false
      }
      
      // Simula upload de arquivos
      let fotoPerfil: string | undefined
      let documentos: DocumentoAnexo[] = []
      
      if (request.fotoPerfil) {
        // Simula upload da foto
        await new Promise(resolve => setTimeout(resolve, 1000))
        fotoPerfil = `/uploads/perfil-${Date.now()}.jpg`
      }
      
      if (request.documentos) {
        // Simula upload dos documentos
        await new Promise(resolve => setTimeout(resolve, 1500))
        documentos = request.documentos.map((doc, index) => ({
          id: `doc-${Date.now()}-${index}`,
          tipo: doc.tipo,
          nomeArquivo: doc.arquivo.name,
          url: `/uploads/docs/${doc.arquivo.name}`,
          uploadedAt: new Date(),
          uploadedBy: "Admin Atual"
        }))
      }
      
      const novoUsuario: UsuarioInterno = {
        id: `user-${Date.now()}`,
        ...request.dados,
        especialidades: request.dados.especialidades || [],
        fotoPerfil,
        documentos,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "Admin Atual",
        updatedBy: "Admin Atual"
      }
      
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      MOCK_USUARIOS.push(novoUsuario)
      
      // Recarregar lista
      await carregarUsuarios()
      
      toast.success("Usuário criado com sucesso", {
        position: "bottom-right",
        duration: 2000
      })
      
      setState(prev => ({ ...prev, loading: false, modalAberto: null }))
      return true
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao criar usuário"
      }))
      toast.error("Erro ao criar usuário", {
        position: "bottom-right",
        duration: 3000
      })
      return false
    }
  }

  // Editar usuário - Cenário 4
  const editarUsuario = async (request: UpdateUsuarioRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Validação: E-mail duplicado em outros usuários
      const emailExiste = MOCK_USUARIOS.some(usuario => 
        usuario.email === request.dados.email && usuario.id !== request.id
      )
      
      if (emailExiste) {
        toast.error("E-mail já cadastrado no sistema", {
          position: "bottom-right",
          duration: 3000
        })
        setState(prev => ({ ...prev, loading: false }))
        return false
      }
      
      const usuarioIndex = MOCK_USUARIOS.findIndex(u => u.id === request.id)
      if (usuarioIndex === -1) {
        throw new Error("Usuário não encontrado")
      }
      
      // Simula upload de novos arquivos se houver
      let fotoPerfil = MOCK_USUARIOS[usuarioIndex].fotoPerfil
      let documentos = [...MOCK_USUARIOS[usuarioIndex].documentos]
      
      if (request.fotoPerfil) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        fotoPerfil = `/uploads/perfil-${Date.now()}.jpg`
      }
      
      if (request.documentos) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const novosDocumentos = request.documentos.map((doc, index) => ({
          id: `doc-${Date.now()}-${index}`,
          tipo: doc.tipo,
          nomeArquivo: doc.arquivo.name,
          url: `/uploads/docs/${doc.arquivo.name}`,
          uploadedAt: new Date(),
          uploadedBy: "Admin Atual"
        }))
        documentos = [...documentos, ...novosDocumentos]
      }
      
      // Atualizar usuário
      MOCK_USUARIOS[usuarioIndex] = {
        ...MOCK_USUARIOS[usuarioIndex],
        ...request.dados,
        especialidades: request.dados.especialidades || [],
        fotoPerfil,
        documentos,
        updatedAt: new Date(),
        updatedBy: "Admin Atual"
      }
      
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Recarregar lista
      await carregarUsuarios()
      
      toast.success("Dados atualizados com sucesso", {
        position: "bottom-right",
        duration: 2000
      })
      
      setState(prev => ({ ...prev, loading: false, modalAberto: null }))
      return true
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao editar usuário"
      }))
      toast.error("Erro ao editar usuário", {
        position: "bottom-right",
        duration: 3000
      })
      return false
    }
  }

  // Desativar usuário - Cenário 5
  const desativarUsuario = async (usuarioId: string, motivo?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const usuarioIndex = MOCK_USUARIOS.findIndex(u => u.id === usuarioId)
      if (usuarioIndex === -1) {
        throw new Error("Usuário não encontrado")
      }
      
      // Simula transferência de atividades para Admin Master
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const dadosAnteriores = { status: MOCK_USUARIOS[usuarioIndex].status }
      
      // Atualizar status
      MOCK_USUARIOS[usuarioIndex].status = "INATIVO"
      MOCK_USUARIOS[usuarioIndex].updatedAt = new Date()
      MOCK_USUARIOS[usuarioIndex].updatedBy = "Admin Atual"
      
      // Adicionar ao histórico
      MOCK_HISTORICO.push({
        id: `hist-${Date.now()}`,
        usuarioId,
        acao: "DESATIVACAO",
        dadosAnteriores,
        dadosNovos: { status: "INATIVO" },
        realizadoPor: "Admin Atual",
        realizadoEm: new Date(),
        observacoes: motivo
      })
      
      // Recarregar lista
      await carregarUsuarios()
      
      toast.success("Usuário desativado com sucesso", {
        position: "bottom-right",
        duration: 2000
      })
      
      setState(prev => ({ ...prev, loading: false, modalAberto: null }))
      return true
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao desativar usuário"
      }))
      toast.error("Erro ao desativar usuário", {
        position: "bottom-right",
        duration: 3000
      })
      return false
    }
  }

  // Ativar usuário
  const ativarUsuario = async (usuarioId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const usuarioIndex = MOCK_USUARIOS.findIndex(u => u.id === usuarioId)
      if (usuarioIndex === -1) {
        throw new Error("Usuário não encontrado")
      }
      
      const dadosAnteriores = { status: MOCK_USUARIOS[usuarioIndex].status }
      
      // Atualizar status
      MOCK_USUARIOS[usuarioIndex].status = "ATIVO"
      MOCK_USUARIOS[usuarioIndex].updatedAt = new Date()
      MOCK_USUARIOS[usuarioIndex].updatedBy = "Admin Atual"
      
      // Adicionar ao histórico
      MOCK_HISTORICO.push({
        id: `hist-${Date.now()}`,
        usuarioId,
        acao: "ATIVACAO",
        dadosAnteriores,
        dadosNovos: { status: "ATIVO" },
        realizadoPor: "Admin Atual",
        realizadoEm: new Date()
      })
      
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Recarregar lista
      await carregarUsuarios()
      
      toast.success("Usuário ativado com sucesso", {
        position: "bottom-right",
        duration: 2000
      })
      
      setState(prev => ({ ...prev, loading: false }))
      return true
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao ativar usuário"
      }))
      toast.error("Erro ao ativar usuário", {
        position: "bottom-right",
        duration: 3000
      })
      return false
    }
  }

  // Buscar histórico de auditoria
  const buscarHistorico = useCallback(async (usuarioId: string): Promise<HistoricoAuditoria[]> => {
    try {
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const historicoFiltrado = MOCK_HISTORICO.filter(item => item.usuarioId === usuarioId)
      const historicoOrdenado = historicoFiltrado.sort((a, b) => b.realizadoEm.getTime() - a.realizadoEm.getTime())
      
      return historicoOrdenado
      
    } catch (error) {
      toast.error("Erro ao carregar histórico", {
        position: "bottom-right",
        duration: 3000
      })
      return []
    }
  }, [])

  // Upload de arquivo
  const uploadArquivo = async (arquivo: File): Promise<UploadResponse | null> => {
    try {
      // Validações básicas
      const tamanhoMaximo = 5 * 1024 * 1024 // 5MB
      if (arquivo.size > tamanhoMaximo) {
        toast.error("Arquivo muito grande. Máximo 5MB", {
          position: "bottom-right",
          duration: 3000
        })
        return null
      }
      
      // Simula upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return {
        url: `/uploads/${arquivo.name}`,
        nomeArquivo: arquivo.name,
        tamanho: arquivo.size,
        tipo: arquivo.type
      }
      
    } catch (error) {
      toast.error("Erro ao fazer upload do arquivo", {
        position: "bottom-right",
        duration: 3000
      })
      return null
    }
  }

  // Remover documento
  const removerDocumento = async (usuarioId: string, documentoId: string): Promise<boolean> => {
    try {
      const usuarioIndex = MOCK_USUARIOS.findIndex(u => u.id === usuarioId)
      if (usuarioIndex === -1) {
        throw new Error("Usuário não encontrado")
      }
      
      MOCK_USUARIOS[usuarioIndex].documentos = MOCK_USUARIOS[usuarioIndex].documentos
        .filter(doc => doc.id !== documentoId)
      
      MOCK_USUARIOS[usuarioIndex].updatedAt = new Date()
      MOCK_USUARIOS[usuarioIndex].updatedBy = "Admin Atual"
      
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success("Documento removido com sucesso", {
        position: "bottom-right",
        duration: 2000
      })
      
      return true
      
    } catch (error) {
      toast.error("Erro ao remover documento", {
        position: "bottom-right",
        duration: 3000
      })
      return false
    }
  }

  // Funções de controle da UI
  const atualizarFiltros = (novosFiltros: Partial<FiltrosUsuarios>) => {
    setState(prev => ({
      ...prev,
      filtros: { ...prev.filtros, ...novosFiltros },
      paginacao: { ...prev.paginacao, pagina: 1 }
    }))
  }

  const abrirModal = (tipo: NonNullable<UsuariosInternosState["modalAberto"]>, usuario?: UsuarioInterno) => {
    setState(prev => ({
      ...prev,
      modalAberto: tipo,
      usuarioSelecionado: usuario || null
    }))
  }

  const fecharModal = () => {
    setState(prev => ({
      ...prev,
      modalAberto: null,
      usuarioSelecionado: null
    }))
  }

  const abrirHistorico = (usuario: UsuarioInterno) => {
    setState(prev => ({
      ...prev,
      usuarioSelecionado: usuario,
      historicoAberto: true
    }))
  }

  const fecharHistorico = () => {
    setState(prev => ({
      ...prev,
      historicoAberto: false,
      usuarioSelecionado: null
    }))
  }

  // Carregar dados iniciais
  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  // Dados de apoio (mock)
  const dadosApoio = {
    especialidades: mockEspecialidades,
    cargos: mockCargos,
    perfisAcesso: mockPerfisAcesso
  }

  return {
    // Estado
    ...state,
    
    // Ações CRUD
    criarUsuario,
    editarUsuario,
    desativarUsuario,
    ativarUsuario,
    
    // Busca e filtros
    carregarUsuarios,
    atualizarFiltros,
    
    // Histórico
    buscarHistorico,
    
    // Upload e documentos
    uploadArquivo,
    removerDocumento,
    
    // Controle da UI
    abrirModal,
    fecharModal,
    abrirHistorico,
    fecharHistorico,
    
    // Dados de apoio
    dadosApoio
  }
}