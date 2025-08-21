"use client"

import { useState } from "react"
import { Eye, EyeOff, Save, RotateCcw, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { TextBlockEditor } from "./text-block-editor"
import { ImageManager } from "./image-manager"
import { PlansSelector } from "./plans-selector"
import { HistoryDialog } from "./history-dialog"
import { ContentBlock, EditableSection } from "../types"

interface ContentEditorProps {
  sections: EditableSection[]
  selectedBlockId: string | null
  isPreview: boolean
  isDirty: boolean
  isSaving: boolean
  plans: any[]
  history: any[]
  onSelectBlock: (blockId: string | null) => void
  onUpdateBlock: (sectionId: string, blockId: string, updates: Partial<ContentBlock>) => void
  onSave: () => void
  onDiscard: () => void
  onTogglePreview: () => void
  onUploadImage: (file: File) => Promise<string>
}

export function ContentEditor({
  sections,
  selectedBlockId,
  isPreview,
  isDirty,
  isSaving,
  plans,
  history,
  onSelectBlock,
  onUpdateBlock,
  onSave,
  onDiscard,
  onTogglePreview,
  onUploadImage,
}: ContentEditorProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  // Renderizar bloco baseado no tipo
  const renderBlock = (section: EditableSection, block: ContentBlock) => {
    const isEditing = selectedBlockId === block.id && !isPreview

    switch (block.type) {
      case "text":
        return (
          <TextBlockEditor
            key={block.id}
            block={block}
            isEditing={isEditing}
            onUpdate={(updates) => onUpdateBlock(section.id, block.id, updates)}
            onStartEdit={() => onSelectBlock(block.id)}
            onEndEdit={() => onSelectBlock(null)}
          />
        )

      case "image":
        return (
          <ImageManager
            key={block.id}
            block={block}
            isEditing={isEditing}
            onUpdate={(updates) => onUpdateBlock(section.id, block.id, updates)}
            onStartEdit={() => onSelectBlock(block.id)}
            onEndEdit={() => onSelectBlock(null)}
            onUpload={onUploadImage}
          />
        )

      case "plans":
        return (
          <PlansSelector
            key={block.id}
            block={block}
            plans={plans}
            isEditing={isEditing}
            onUpdate={(updates) => onUpdateBlock(section.id, block.id, updates)}
            onStartEdit={() => onSelectBlock(block.id)}
            onEndEdit={() => onSelectBlock(null)}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Barra de ferramentas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">Editor de Conteúdo</CardTitle>
                {isDirty && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Alterações não salvas
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                  className="gap-2"
                >
                  <History className="h-4 w-4" />
                  Histórico
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTogglePreview}
                  className={cn(
                    "gap-2",
                    isPreview && "bg-blue-50 text-blue-600 border-blue-200"
                  )}
                >
                  {isPreview ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Editar
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </>
                  )}
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDiscard}
                  disabled={!isDirty || isSaving}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Descartar
                </Button>

                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={!isDirty || isSaving}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Editor principal */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <div className="border-b px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hero">Hero Section</TabsTrigger>
                  <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                  <TabsTrigger value="plans">Planos e Preços</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[600px]">
                {sections.map((section) => (
                  <TabsContent
                    key={section.id}
                    value={section.id}
                    className="p-6 space-y-4"
                  >
                    {/* Indicador de modo */}
                    {isPreview && (
                      <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Eye className="h-4 w-4 mr-2 text-blue-600" />
                        <p className="text-sm text-blue-700">
                          Modo de visualização - Clique em "Editar" para fazer alterações
                        </p>
                      </div>
                    )}

                    {/* Dica de edição */}
                    {!isPreview && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          💡 <strong>Dica:</strong> Clique em qualquer bloco abaixo para editá-lo. 
                          As alterações são visualizadas em tempo real.
                        </p>
                      </div>
                    )}

                    {/* Blocos da seção */}
                    <div className="space-y-4">
                      {section.blocks.map((block) => (
                        <div
                          key={block.id}
                          className={cn(
                            "transition-all duration-200",
                            isPreview && "pointer-events-none opacity-90"
                          )}
                        >
                          {renderBlock(section, block)}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informação adicional */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm">ℹ️</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Editor simplificado estilo Google Sites
                </p>
                <p className="text-sm text-blue-700">
                  • Clique em qualquer bloco para editá-lo<br />
                  • Use as ferramentas de formatação para textos (negrito, itálico, listas)<br />
                  • Arraste e solte imagens ou clique para fazer upload<br />
                  • Selecione quais planos devem aparecer na landing page<br />
                  • Todas as alterações são registradas no histórico
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de histórico */}
      <HistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />
    </>
  )
}
