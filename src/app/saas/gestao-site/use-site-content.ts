"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import {
  PageContent,
  ContentBlock,
  HistoryEntry,
  Plan,
  mockPlans,
  initialPageContent,
} from "./types"

export function useSiteContent() {
  // Estados principais
  const [content, setContent] = useState<PageContent>(initialPageContent)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [plans, setPlans] = useState<Plan[]>(mockPlans)

  // Carregar conteúdo salvo do localStorage (simulando API)
  useEffect(() => {
    const savedContent = localStorage.getItem("callistra-landing-content")
    const savedHistory = localStorage.getItem("callistra-landing-history")
    
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent))
      } catch (error) {
        console.error("Erro ao carregar conteúdo:", error)
      }
    }
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Erro ao carregar histórico:", error)
      }
    }
  }, [])

  // Adicionar entrada no histórico
  const addHistoryEntry = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `history-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    
    setHistory(prev => [newEntry, ...prev])
    
    // Salvar histórico no localStorage
    const updatedHistory = [newEntry, ...history]
    localStorage.setItem("callistra-landing-history", JSON.stringify(updatedHistory.slice(0, 100))) // Manter apenas últimas 100 entradas
  }, [history])

  // Atualizar bloco de conteúdo
  const updateBlock = useCallback((sectionId: string, blockId: string, updates: Partial<ContentBlock>) => {
    setContent(prev => {
      const newContent = { ...prev }
      const section = newContent.sections.find(s => s.id === sectionId)
      
      if (section) {
        const blockIndex = section.blocks.findIndex(b => b.id === blockId)
        if (blockIndex !== -1) {
          const oldBlock = section.blocks[blockIndex]
          section.blocks[blockIndex] = { ...oldBlock, ...updates } as ContentBlock
          
          // Registrar no histórico
          let action: HistoryEntry["action"] = "text_edit"
          let details = "Conteúdo atualizado"
          
          if (oldBlock.type === "image") {
            action = updates.src ? "image_upload" : "image_delete"
            details = updates.src ? "Nova imagem carregada" : "Imagem removida"
          } else if (oldBlock.type === "plans") {
            action = "plan_update"
            details = "Planos atualizados"
          }
          
          addHistoryEntry({
            user: "Admin",
            action,
            details,
            blockId,
            sectionId,
            oldValue: oldBlock,
            newValue: section.blocks[blockIndex],
          })
        }
      }
      
      newContent.lastModified = new Date().toISOString()
      newContent.modifiedBy = "Admin"
      
      return newContent
    })
    
    setIsDirty(true)
  }, [addHistoryEntry])

  // Salvar conteúdo
  const saveContent = useCallback(async () => {
    setIsSaving(true)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Salvar no localStorage (simulando API)
      localStorage.setItem("callistra-landing-content", JSON.stringify(content))
      
      setIsDirty(false)
      toast.success("Alterações salvas com sucesso!", {
        duration: 2000,
        position: "bottom-right",
      })
      
      addHistoryEntry({
        user: "Admin",
        action: "section_update",
        details: "Conteúdo da landing page atualizado",
      })
    } catch (error) {
      toast.error("Erro ao salvar alterações", {
        duration: 3000,
        position: "bottom-right",
      })
      console.error("Erro ao salvar:", error)
    } finally {
      setIsSaving(false)
    }
  }, [content, addHistoryEntry])

  // Descartar alterações
  const discardChanges = useCallback(() => {
    const savedContent = localStorage.getItem("callistra-landing-content")
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    } else {
      setContent(initialPageContent)
    }
    setIsDirty(false)
    setSelectedBlockId(null)
    toast.info("Alterações descartadas", {
      duration: 2000,
      position: "bottom-right",
    })
  }, [])

  // Upload de imagem
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    // Simular upload (em produção seria para API/S3)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        resolve(result)
      }
      
      reader.onerror = () => {
        reject(new Error("Falha ao ler arquivo"))
      }
      
      reader.readAsDataURL(file)
    })
  }, [])

  // Alternar modo preview
  const togglePreview = useCallback(() => {
    setIsPreview(prev => !prev)
    setSelectedBlockId(null)
  }, [])

  return {
    // Estados
    content,
    isDirty,
    isSaving,
    isPreview,
    selectedBlockId,
    history,
    plans,
    
    // Ações
    setSelectedBlockId,
    updateBlock,
    saveContent,
    discardChanges,
    uploadImage,
    togglePreview,
  }
}
