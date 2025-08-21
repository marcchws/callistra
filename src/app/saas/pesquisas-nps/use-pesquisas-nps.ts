"use client"

import { useState, useCallback, useMemo } from "react"
import { 
  Pesquisa, 
  Resposta, 
  PesquisaFilters, 
  RespostaFilters,
  StatusPesquisa,
  Periodicidade,
  TipoPergunta,
  PerfilUsuario,
  Usuario
} from "./types"

// Mock data - Em produção viria de API
const mockPerfis: PerfilUsuario[] = [
  { id: "1", nome: "Administrador", descricao: "Acesso total ao sistema" },
  { id: "2", nome: "Escritório", descricao: "Cliente escritório" },
  { id: "3", nome: "Advogado", descricao: "Advogado associado" },
  { id: "4", nome: "Cliente", descricao: "Cliente do escritório" },
]

const mockUsuarios: Usuario[] = [
  { id: "1", nome: "João Silva", email: "joao@example.com", perfil: mockPerfis[0] },
  { id: "2", nome: "Maria Santos", email: "maria@example.com", perfil: mockPerfis[1] },
  { id: "3", nome: "Pedro Oliveira", email: "pedro@example.com", perfil: mockPerfis[2] },
  { id: "4", nome: "Ana Costa", email: "ana@example.com", perfil: mockPerfis[3] },
  { id: "5", nome: "Carlos Ferreira", email: "carlos@example.com", perfil: mockPerfis[1] },
]

const mockPesquisas: Pesquisa[] = [
  {
    id: "1",
    nome: "Pesquisa de Satisfação Q1 2024",
    descricao: "Avaliação trimestral de satisfação dos clientes",
    perguntas: [
      {
        id: "p1",
        texto: "Como você avalia nosso atendimento?",
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcoes: ["Excelente", "Bom", "Regular", "Ruim"],
        obrigatoria: true,
        ordem: 1
      },
      {
        id: "p2",
        texto: "Você recomendaria nossos serviços?",
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcoes: ["Sim", "Não", "Talvez"],
        obrigatoria: true,
        ordem: 2
      },
      {
        id: "p3",
        texto: "Deixe seu feedback detalhado",
        tipo: TipoPergunta.DISCURSIVA,
        obrigatoria: false,
        ordem: 3
      }
    ],
    periodicidade: Periodicidade.RECORRENTE,
    intervaloMeses: 3,
    perfisAlvo: ["2", "3"],
    dataInicio: new Date(2024, 0, 1),
    dataTermino: new Date(2024, 11, 31),
    status: StatusPesquisa.ATIVA,
    totalRespostas: 45,
    dataCriacao: new Date(2023, 11, 15),
    dataAtualizacao: new Date(2024, 0, 1)
  },
  {
    id: "2",
    nome: "NPS - Novos Clientes",
    descricao: "Pesquisa para novos clientes após primeiro mês",
    perguntas: [
      {
        id: "p4",
        texto: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos serviços?",
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcoes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        obrigatoria: true,
        ordem: 1
      },
      {
        id: "p5",
        texto: "O que mais você gostou em nossos serviços?",
        tipo: TipoPergunta.DISCURSIVA,
        obrigatoria: false,
        ordem: 2
      }
    ],
    periodicidade: Periodicidade.UNICA,
    perfisAlvo: ["4"],
    dataInicio: new Date(2024, 0, 1),
    status: StatusPesquisa.ATIVA,
    totalRespostas: 12,
    dataCriacao: new Date(2024, 0, 1),
    dataAtualizacao: new Date(2024, 0, 1)
  },
  {
    id: "3",
    nome: "Feedback Pós-Login",
    descricao: "Pesquisa rápida após login no sistema",
    perguntas: [
      {
        id: "p6",
        texto: "Como está sua experiência com o sistema hoje?",
        tipo: TipoPergunta.MULTIPLA_ESCOLHA,
        opcoes: ["😊 Ótima", "😐 Normal", "😞 Ruim"],
        obrigatoria: true,
        ordem: 1
      }
    ],
    periodicidade: Periodicidade.POR_LOGIN,
    perfisAlvo: ["2", "3", "4"],
    dataInicio: new Date(2024, 0, 1),
    status: StatusPesquisa.INATIVA,
    totalRespostas: 234,
    dataCriacao: new Date(2023, 11, 1),
    dataAtualizacao: new Date(2024, 0, 15)
  }
]

const mockRespostas: Resposta[] = [
  {
    id: "r1",
    pesquisaId: "1",
    usuarioId: "2",
    usuario: mockUsuarios[1],
    perguntaId: "p1",
    resposta: "Excelente",
    dataResposta: new Date(2024, 0, 5)
  },
  {
    id: "r2",
    pesquisaId: "1",
    usuarioId: "2",
    usuario: mockUsuarios[1],
    perguntaId: "p2",
    resposta: "Sim",
    dataResposta: new Date(2024, 0, 5)
  },
  {
    id: "r3",
    pesquisaId: "1",
    usuarioId: "2",
    usuario: mockUsuarios[1],
    perguntaId: "p3",
    resposta: "O atendimento foi excepcional, muito profissional e ágil.",
    dataResposta: new Date(2024, 0, 5)
  },
  {
    id: "r4",
    pesquisaId: "1",
    usuarioId: "3",
    usuario: mockUsuarios[2],
    perguntaId: "p1",
    resposta: "Bom",
    dataResposta: new Date(2024, 0, 6)
  },
  {
    id: "r5",
    pesquisaId: "1",
    usuarioId: "3",
    usuario: mockUsuarios[2],
    perguntaId: "p2",
    resposta: "Sim",
    dataResposta: new Date(2024, 0, 6)
  }
]

export function usePesquisasNPS() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>(mockPesquisas)
  const [respostas, setRespostas] = useState<Resposta[]>(mockRespostas)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<PesquisaFilters>({})
  const [respostaFilters, setRespostaFilters] = useState<RespostaFilters>({})

  // Dados auxiliares
  const perfis = mockPerfis
  const usuarios = mockUsuarios

  // Filtrar pesquisas
  const filteredPesquisas = useMemo(() => {
    return pesquisas.filter(pesquisa => {
      if (filters.status && pesquisa.status !== filters.status) return false
      if (filters.nome && !pesquisa.nome.toLowerCase().includes(filters.nome.toLowerCase())) return false
      if (filters.perfil && !pesquisa.perfisAlvo.includes(filters.perfil)) return false
      if (filters.periodo) {
        const criacao = new Date(pesquisa.dataCriacao)
        if (criacao < filters.periodo.inicio || criacao > filters.periodo.fim) return false
      }
      return true
    })
  }, [pesquisas, filters])

  // Filtrar respostas
  const filteredRespostas = useMemo(() => {
    return respostas.filter(resposta => {
      if (respostaFilters.usuarioId && resposta.usuarioId !== respostaFilters.usuarioId) return false
      if (respostaFilters.perfilId && resposta.usuario.perfil.id !== respostaFilters.perfilId) return false
      if (respostaFilters.periodo) {
        const data = new Date(resposta.dataResposta)
        if (data < respostaFilters.periodo.inicio || data > respostaFilters.periodo.fim) return false
      }
      return true
    })
  }, [respostas, respostaFilters])

  // Criar pesquisa
  const createPesquisa = useCallback(async (data: Omit<Pesquisa, 'id' | 'totalRespostas' | 'dataCriacao' | 'dataAtualizacao'>) => {
    setLoading(true)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const novaPesquisa: Pesquisa = {
        ...data,
        id: String(Date.now()),
        totalRespostas: 0,
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      }
      
      setPesquisas(prev => [...prev, novaPesquisa])
      return novaPesquisa
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar pesquisa
  const updatePesquisa = useCallback(async (id: string, data: Partial<Pesquisa>) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPesquisas(prev => prev.map(p => 
        p.id === id 
          ? { ...p, ...data, dataAtualizacao: new Date() }
          : p
      ))
      
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  // Deletar pesquisa
  const deletePesquisa = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPesquisas(prev => prev.filter(p => p.id !== id))
      setRespostas(prev => prev.filter(r => r.pesquisaId !== id))
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  // Ativar/Desativar pesquisa
  const toggleStatus = useCallback(async (id: string) => {
    const pesquisa = pesquisas.find(p => p.id === id)
    if (!pesquisa) return false
    
    const novoStatus = pesquisa.status === StatusPesquisa.ATIVA 
      ? StatusPesquisa.INATIVA 
      : StatusPesquisa.ATIVA
    
    return updatePesquisa(id, { status: novoStatus })
  }, [pesquisas, updatePesquisa])

  // Obter respostas de uma pesquisa
  const getRespostasPorPesquisa = useCallback((pesquisaId: string) => {
    return respostas.filter(r => r.pesquisaId === pesquisaId)
  }, [respostas])

  // Obter estatísticas de uma pesquisa
  const getEstatisticas = useCallback((pesquisaId: string) => {
    const pesquisa = pesquisas.find(p => p.id === pesquisaId)
    if (!pesquisa) return null

    const respostasPesquisa = getRespostasPorPesquisa(pesquisaId)
    
    // Agrupar respostas por pergunta
    const estatisticasPorPergunta = pesquisa.perguntas.map(pergunta => {
      const respostasPergunta = respostasPesquisa.filter(r => r.perguntaId === pergunta.id)
      
      if (pergunta.tipo === TipoPergunta.MULTIPLA_ESCOLHA) {
        const contagem = pergunta.opcoes?.reduce((acc, opcao) => {
          acc[opcao] = respostasPergunta.filter(r => r.resposta === opcao).length
          return acc
        }, {} as Record<string, number>) || {}
        
        return {
          perguntaId: pergunta.id,
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          totalRespostas: respostasPergunta.length,
          distribuicao: contagem
        }
      } else {
        return {
          perguntaId: pergunta.id,
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          totalRespostas: respostasPergunta.length,
          respostas: respostasPergunta.map(r => r.resposta as string)
        }
      }
    })

    return {
      pesquisaId,
      totalRespostas: respostasPesquisa.length,
      taxaResposta: (respostasPesquisa.length / pesquisa.usuariosEspecificos?.length || 1) * 100,
      estatisticasPorPergunta
    }
  }, [pesquisas, getRespostasPorPesquisa])

  // Exportar dados
  const exportarDados = useCallback(async (pesquisaId: string, formato: 'pdf' | 'excel') => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Em produção, faria download real do arquivo
      console.log(`Exportando pesquisa ${pesquisaId} em formato ${formato}`)
      
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar usuários por nome
  const searchUsuarios = useCallback((termo: string) => {
    if (!termo) return usuarios
    return usuarios.filter(u => 
      u.nome.toLowerCase().includes(termo.toLowerCase()) ||
      u.email.toLowerCase().includes(termo.toLowerCase())
    )
  }, [])

  return {
    // Dados
    pesquisas: filteredPesquisas,
    respostas: filteredRespostas,
    perfis,
    usuarios,
    loading,
    
    // Filtros
    filters,
    setFilters,
    respostaFilters,
    setRespostaFilters,
    
    // Ações
    createPesquisa,
    updatePesquisa,
    deletePesquisa,
    toggleStatus,
    
    // Consultas
    getRespostasPorPesquisa,
    getEstatisticas,
    searchUsuarios,
    exportarDados
  }
}