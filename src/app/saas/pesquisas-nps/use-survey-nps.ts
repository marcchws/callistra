"use client"

import { useState, useCallback, useEffect } from "react"
import { Survey, Response, SurveyFilters, ResponseFilters, User, UserProfile, ExportFormat } from "./types"
import { toast } from "sonner"

// Mock data - substituir por API real
const mockProfiles: UserProfile[] = [
  { id: "1", name: "Administrador", description: "Acesso total ao sistema" },
  { id: "2", name: "Advogado", description: "Acesso aos processos" },
  { id: "3", name: "Cliente", description: "Acesso limitado" },
  { id: "4", name: "Secretário", description: "Suporte administrativo" }
]

const mockUsers: User[] = [
  { id: "1", name: "João Silva", email: "joao@escritorio.com", profile: "1" },
  { id: "2", name: "Maria Santos", email: "maria@escritorio.com", profile: "2" },
  { id: "3", name: "Pedro Costa", email: "pedro@cliente.com", profile: "3" },
  { id: "4", name: "Ana Oliveira", email: "ana@escritorio.com", profile: "2" },
  { id: "5", name: "Carlos Ferreira", email: "carlos@escritorio.com", profile: "4" }
]

const mockSurveys: Survey[] = [
  {
    id: "1",
    name: "Pesquisa de Satisfação Q1 2025",
    questions: [
      {
        id: "q1",
        text: "Como você avalia nosso sistema?",
        type: "multiple_choice",
        options: ["Excelente", "Bom", "Regular", "Ruim"],
        required: true,
        order: 1
      },
      {
        id: "q2",
        text: "Qual funcionalidade você mais utiliza?",
        type: "text",
        required: true,
        order: 2
      }
    ],
    periodicity: "once",
    targetProfiles: ["2", "3"],
    targetUsers: ["1", "2"],
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    status: "active",
    createdAt: "2025-01-10T10:00:00",
    updatedAt: "2025-01-10T10:00:00"
  }
]

const mockResponses: Response[] = [
  {
    id: "r1",
    surveyId: "1",
    userId: "2",
    userName: "Maria Santos",
    userProfile: "2",
    answers: [
      { questionId: "q1", answer: "Excelente" },
      { questionId: "q2", answer: "Gestão de Processos" }
    ],
    respondedAt: "2025-01-16T14:30:00"
  },
  {
    id: "r2",
    surveyId: "1",
    userId: "3",
    userName: "Pedro Costa",
    userProfile: "3",
    answers: [
      { questionId: "q1", answer: "Bom" },
      { questionId: "q2", answer: "Chat com advogado" }
    ],
    respondedAt: "2025-01-17T09:15:00"
  }
]

export function useSurveyNPS() {
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
  const [responses, setResponses] = useState<Response[]>(mockResponses)
  const [profiles, setProfiles] = useState<UserProfile[]>(mockProfiles)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SurveyFilters>({})
  const [responseFilters, setResponseFilters] = useState<ResponseFilters>({})

  // Create Survey
  const createSurvey = useCallback(async (survey: Survey) => {
    setLoading(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newSurvey = {
        ...survey,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setSurveys(prev => [...prev, newSurvey])
      toast.success("Pesquisa criada com sucesso!")
      return newSurvey
    } catch (error) {
      toast.error("Erro ao criar pesquisa")
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Update Survey
  const updateSurvey = useCallback(async (id: string, survey: Partial<Survey>) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSurveys(prev => prev.map(s => 
        s.id === id 
          ? { ...s, ...survey, updatedAt: new Date().toISOString() }
          : s
      ))
      
      toast.success("Pesquisa atualizada com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar pesquisa")
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete Survey
  const deleteSurvey = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSurveys(prev => prev.filter(s => s.id !== id))
      setResponses(prev => prev.filter(r => r.surveyId !== id))
      
      toast.success("Pesquisa excluída com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir pesquisa")
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Toggle Survey Status
  const toggleSurveyStatus = useCallback(async (id: string) => {
    const survey = surveys.find(s => s.id === id)
    if (!survey) return

    const newStatus = survey.status === "active" ? "inactive" : "active"
    await updateSurvey(id, { status: newStatus })
  }, [surveys, updateSurvey])

  // Search Users
  const searchUsers = useCallback((query: string) => {
    if (!query) return users
    
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    )
  }, [users])

  // Filter Users by Profile
  const filterUsersByProfile = useCallback((profileIds: string[]) => {
    if (!profileIds || profileIds.length === 0) return users
    
    return users.filter(user => profileIds.includes(user.profile))
  }, [users])

  // Get Survey Responses
  const getSurveyResponses = useCallback((surveyId: string) => {
    return responses.filter(r => r.surveyId === surveyId)
  }, [responses])

  // Filter Responses
  const filterResponses = useCallback((surveyId: string, filters: ResponseFilters) => {
    let filtered = responses.filter(r => r.surveyId === surveyId)

    if (filters.userId) {
      filtered = filtered.filter(r => r.userId === filters.userId)
    }

    if (filters.userProfile) {
      filtered = filtered.filter(r => r.userProfile === filters.userProfile)
    }

    if (filters.period?.start && filters.period?.end) {
      filtered = filtered.filter(r => {
        const responseDate = new Date(r.respondedAt)
        const startDate = new Date(filters.period!.start)
        const endDate = new Date(filters.period!.end)
        return responseDate >= startDate && responseDate <= endDate
      })
    }

    return filtered
  }, [responses])

  // Export Results
  const exportResults = useCallback(async (surveyId: string, format: ExportFormat) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular download
      const survey = surveys.find(s => s.id === surveyId)
      const surveyResponses = getSurveyResponses(surveyId)
      
      toast.success(`Resultados exportados em ${format.toUpperCase()}`)
      
      // Em produção, retornaria URL do arquivo ou iniciaria download
      console.log(`Exportando pesquisa "${survey?.name}" com ${surveyResponses.length} respostas`)
    } catch (error) {
      toast.error("Erro ao exportar resultados")
      throw error
    } finally {
      setLoading(false)
    }
  }, [surveys, getSurveyResponses])

  // Calculate Response Stats
  const calculateStats = useCallback((surveyId: string) => {
    const surveyResponses = getSurveyResponses(surveyId)
    const survey = surveys.find(s => s.id === surveyId)
    
    if (!survey) return null

    const stats = {
      totalResponses: surveyResponses.length,
      responseRate: 0,
      questionStats: {} as Record<string, any>
    }

    // Calculate response rate
    const totalTargets = (survey.targetUsers?.length || 0) + 
      filterUsersByProfile(survey.targetProfiles).length
    stats.responseRate = totalTargets > 0 
      ? Math.round((surveyResponses.length / totalTargets) * 100)
      : 0

    // Calculate stats per question
    survey.questions.forEach(question => {
      if (question.type === "multiple_choice") {
        const answers = surveyResponses.map(r => 
          r.answers.find(a => a.questionId === question.id)?.answer
        ).filter(Boolean)

        const counts: Record<string, number> = {}
        question.options?.forEach(opt => counts[opt] = 0)
        
        answers.forEach(answer => {
          if (typeof answer === "string" && counts[answer] !== undefined) {
            counts[answer]++
          }
        })

        stats.questionStats[question.id] = {
          type: "multiple_choice",
          counts,
          total: answers.length
        }
      } else {
        stats.questionStats[question.id] = {
          type: "text",
          responses: surveyResponses.map(r => 
            r.answers.find(a => a.questionId === question.id)?.answer
          ).filter(Boolean)
        }
      }
    })

    return stats
  }, [surveys, getSurveyResponses, filterUsersByProfile])

  return {
    // Data
    surveys,
    responses,
    profiles,
    users,
    loading,
    
    // Actions
    createSurvey,
    updateSurvey,
    deleteSurvey,
    toggleSurveyStatus,
    
    // Search & Filter
    searchUsers,
    filterUsersByProfile,
    getSurveyResponses,
    filterResponses,
    
    // Export & Stats
    exportResults,
    calculateStats,
    
    // Filters
    filters,
    setFilters,
    responseFilters,
    setResponseFilters
  }
}
