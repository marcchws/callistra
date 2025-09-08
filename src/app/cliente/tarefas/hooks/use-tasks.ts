"use client"

import { useState, useCallback } from "react"
import { Task, TaskFormData, TaskFilters, TaskHistory } from "../types"
import { toast } from "sonner"

// Mock de tarefas para desenvolvimento
const generateMockTasks = (): Task[] => {
  return [
    {
      id: "1",
      tipoAtividade: "juridica",
      nomeAtividade: "Elaboração de Petição Inicial",
      responsavel: "adv1",
      prioridade: "alta",
      status: "em_andamento",
      etiquetas: ["urgente", "trabalhista"],
      dataInicio: "2025-08-25", // Tarefa atrasada - deveria ter sido concluída antes de 01/09/2025
      horaInicio: "09:00",
      dataFim: "2025-08-30", // Prazo vencido
      horaFim: "18:00",
      descricao: "Elaborar petição inicial para ação trabalhista do cliente João Silva",
      cliente: "cliente1",
      processo: "processo1",
      atividade: "ativ1",
      subAtividade: "sub1",
      valor: 5000,
      tipoSegmento: "seg1",
      observacoes: "Cliente solicitou urgência no processo",
      criadoEm: new Date("2025-08-20"),
      atualizadoEm: new Date("2025-08-28"),
      criadoPor: "admin",
      atualizadoPor: "admin",
      anexos: [
        {
          id: "a1",
          nome: "contrato_trabalho.pdf",
          url: "/files/contrato_trabalho.pdf",
          tamanho: 256000,
          tipo: "application/pdf",
          uploadedAt: new Date("2024-03-10"),
          uploadedBy: "admin"
        }
      ],
      historico: [
        {
          id: "h1",
          acao: "criacao",
          descricao: "Tarefa criada",
          usuario: "admin",
          data: new Date("2025-08-20")
        },
        {
          id: "h2",
          acao: "status_change",
          descricao: "Status alterado de 'Não iniciada' para 'Em andamento'",
          usuario: "admin",
          data: new Date("2025-08-28"),
          dadosAnteriores: { status: "nao_iniciada" },
          dadosNovos: { status: "em_andamento" }
        }
      ]
    },
    {
      id: "2",
      tipoAtividade: "administrativa",
      nomeAtividade: "Protocolo de Documentos",
      responsavel: "adv2",
      prioridade: "media",
      status: "nao_iniciada",
      etiquetas: ["protocolo"],
      dataInicio: "2025-09-02", // Tarefa em dia - prazo futuro próximo
      horaInicio: "14:00",
      dataFim: "2025-09-02", // Prazo em dia
      horaFim: "16:00",
      descricao: "Protocolar contestação no processo da empresa ABC",
      cliente: "cliente3",
      processo: "processo2",
      atividade: "ativ5",
      tipoSegmento: "seg2",
      criadoEm: new Date("2025-08-28"),
      atualizadoEm: new Date("2025-08-28"),
      criadoPor: "admin",
      atualizadoPor: "admin"
    },
    {
      id: "3",
      tipoAtividade: "atendimento",
      nomeAtividade: "Reunião com Cliente",
      responsavel: "adv3",
      prioridade: "baixa",
      status: "concluida",
      etiquetas: ["reunião", "estratégia"],
      dataInicio: "2025-08-28", // Tarefa concluída recentemente
      horaInicio: "10:00",
      dataFim: "2025-08-28", // Concluída no prazo
      horaFim: "11:30",
      descricao: "Reunião para alinhamento de estratégia processual",
      cliente: "cliente2",
      processo: "processo3",
      atividade: "ativ3",
      valor: 500,
      tipoSegmento: "seg3",
      observacoes: "Cliente apresentou novos documentos",
      criadoEm: new Date("2025-08-25"),
      atualizadoEm: new Date("2025-08-28"),
      criadoPor: "admin",
      atualizadoPor: "admin",
      historico: [
        {
          id: "h3",
          acao: "criacao",
          descricao: "Tarefa criada",
          usuario: "admin",
          data: new Date("2025-08-25")
        },
        {
          id: "h4",
          acao: "status_change",
          descricao: "Status alterado de 'Em andamento' para 'Concluída'",
          usuario: "admin",
          data: new Date("2025-08-28"),
          dadosAnteriores: { status: "em_andamento" },
          dadosNovos: { status: "concluida" }
        }
      ]
    },
    {
      id: "4",
      tipoAtividade: "juridica",
      nomeAtividade: "Audiência Trabalhista Urgente",
      responsavel: "adv1",
      prioridade: "alta",
      status: "em_andamento",
      etiquetas: ["urgente", "audiencia", "trabalhista"],
      dataInicio: "2025-09-01", // Tarefa para hoje - urgente
      horaInicio: "09:00",
      dataFim: "2025-09-01", // Prazo hoje
      horaFim: "12:00",
      descricao: "Audiência trabalhista urgente - cliente solicitou presença",
      cliente: "cliente4",
      processo: "processo4",
      atividade: "ativ6",
      valor: 8000,
      tipoSegmento: "seg1",
      observacoes: "Audiência marcada às 10:00 - chegar com 1h de antecedência",
      criadoEm: new Date("2025-08-30"),
      atualizadoEm: new Date("2025-08-31"),
      criadoPor: "admin",
      atualizadoPor: "admin",
      historico: [
        {
          id: "h5",
          acao: "criacao",
          descricao: "Tarefa criada",
          usuario: "admin",
          data: new Date("2025-08-30")
        },
        {
          id: "h6",
          acao: "status_change",
          descricao: "Status alterado de 'Não iniciada' para 'Em andamento'",
          usuario: "admin",
          data: new Date("2025-08-31"),
          dadosAnteriores: { status: "nao_iniciada" },
          dadosNovos: { status: "em_andamento" }
        }
      ]
    },
    {
      id: "5",
      tipoAtividade: "administrativa",
      nomeAtividade: "Preparar Relatório Mensal",
      responsavel: "adv2",
      prioridade: "media",
      status: "nao_iniciada",
      etiquetas: ["relatorio", "mensal"],
      dataInicio: "2025-09-05", // Tarefa futura - prazo confortável
      horaInicio: "14:00",
      dataFim: "2025-09-05", // Prazo futuro
      horaFim: "17:00",
      descricao: "Elaborar relatório mensal de atividades para diretoria",
      cliente: "interno",
      processo: "interno",
      atividade: "ativ7",
      valor: 0,
      tipoSegmento: "seg2",
      observacoes: "Incluir estatísticas de processos e faturamento",
      criadoEm: new Date("2025-08-29"),
      atualizadoEm: new Date("2025-08-29"),
      criadoPor: "admin",
      atualizadoPor: "admin",
      historico: [
        {
          id: "h7",
          acao: "criacao",
          descricao: "Tarefa criada",
          usuario: "admin",
          data: new Date("2025-08-29")
        }
      ]
    }
  ]
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Criar nova tarefa
  const createTask = useCallback(async (data: TaskFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        criadoPor: "admin",
        atualizadoPor: "admin",
        anexos: [],
        historico: [
          {
            id: Date.now().toString(),
            acao: "criacao",
            descricao: "Tarefa criada",
            usuario: "admin",
            data: new Date()
          }
        ]
      }
      
      setTasks(prev => [newTask, ...prev])
      toast.success("Tarefa criada com sucesso!", { duration: 2000 })
      return newTask
    } catch (err) {
      const errorMessage = "Erro ao criar tarefa"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar tarefa
  const updateTask = useCallback(async (id: string, data: Partial<TaskFormData>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const updatedTask = {
            ...task,
            ...data,
            atualizadoEm: new Date(),
            atualizadoPor: "admin",
            historico: [
              ...(task.historico || []),
              {
                id: Date.now().toString(),
                acao: "edicao" as const,
                descricao: "Tarefa atualizada",
                usuario: "admin",
                data: new Date(),
                dadosAnteriores: task,
                dadosNovos: data
              }
            ]
          }
          return updatedTask
        }
        return task
      }))
      
      toast.success("Tarefa atualizada com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao atualizar tarefa"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover tarefa
  const deleteTask = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTasks(prev => prev.filter(task => task.id !== id))
      toast.success("Tarefa removida com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao remover tarefa"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar anexo
  const addAttachment = useCallback(async (taskId: string, file: File) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const attachment = {
        id: Date.now().toString(),
        nome: file.name,
        url: URL.createObjectURL(file),
        tamanho: file.size,
        tipo: file.type,
        uploadedAt: new Date(),
        uploadedBy: "admin"
      }
      
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            anexos: [...(task.anexos || []), attachment],
            historico: [
              ...(task.historico || []),
              {
                id: Date.now().toString(),
                acao: "anexo_adicionado" as const,
                descricao: `Anexo "${file.name}" adicionado`,
                usuario: "admin",
                data: new Date()
              }
            ]
          }
        }
        return task
      }))
      
      toast.success("Anexo adicionado com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao adicionar anexo"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover anexo
  const removeAttachment = useCallback(async (taskId: string, attachmentId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          const anexo = task.anexos?.find(a => a.id === attachmentId)
          return {
            ...task,
            anexos: task.anexos?.filter(a => a.id !== attachmentId),
            historico: [
              ...(task.historico || []),
              {
                id: Date.now().toString(),
                acao: "anexo_removido" as const,
                descricao: `Anexo "${anexo?.nome}" removido`,
                usuario: "admin",
                data: new Date()
              }
            ]
          }
        }
        return task
      }))
      
      toast.success("Anexo removido com sucesso!", { duration: 2000 })
    } catch (err) {
      const errorMessage = "Erro ao remover anexo"
      setError(errorMessage)
      toast.error(errorMessage, { duration: 3000 })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar tarefas
  const filterTasks = useCallback((filters: TaskFilters) => {
    let filtered = [...generateMockTasks()]
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.nomeAtividade.toLowerCase().includes(searchLower) ||
        task.descricao.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters.responsavel) {
      filtered = filtered.filter(task => task.responsavel === filters.responsavel)
    }
    
    if (filters.cliente) {
      filtered = filtered.filter(task => task.cliente === filters.cliente)
    }
    
    if (filters.processo) {
      filtered = filtered.filter(task => task.processo === filters.processo)
    }
    
    if (filters.prioridade) {
      filtered = filtered.filter(task => task.prioridade === filters.prioridade)
    }
    
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status)
    }
    
    if (filters.tipoAtividade) {
      filtered = filtered.filter(task => task.tipoAtividade === filters.tipoAtividade)
    }
    
    setTasks(filtered)
  }, [])

  // Buscar tarefa por ID
  const getTaskById = useCallback((id: string) => {
    return tasks.find(task => task.id === id)
  }, [tasks])

  // Verificar permissão (mock)
  const checkPermission = useCallback((action: "edit" | "delete") => {
    // Mock: sempre retorna true para admin
    // Em produção, verificaria as permissões reais do usuário
    const userRole = "admin"
    
    if (userRole === "admin") return true
    if (userRole === "editor" && action === "edit") return true
    
    return false
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    addAttachment,
    removeAttachment,
    filterTasks,
    getTaskById,
    checkPermission
  }
}
