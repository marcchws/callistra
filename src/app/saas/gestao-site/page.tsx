"use client"

import { Sidebar } from "@/components/sidebar"
import { ContentEditor } from "./components/content-editor"
import { useSiteContent } from "./use-site-content"

export default function GestaoSitePage() {
  const {
    content,
    isDirty,
    isSaving,
    isPreview,
    selectedBlockId,
    history,
    plans,
    setSelectedBlockId,
    updateBlock,
    saveContent,
    discardChanges,
    uploadImage,
    togglePreview,
  } = useSiteContent()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Gestão do Site: Edição de Conteúdo
              </h1>
              <p className="text-muted-foreground">
                Editor simplificado para alteração do conteúdo da Landing Page com formatação básica e gestão de imagens
              </p>
            </div>

            {/* Editor de conteúdo */}
            <ContentEditor
              sections={content.sections}
              selectedBlockId={selectedBlockId}
              isPreview={isPreview}
              isDirty={isDirty}
              isSaving={isSaving}
              plans={plans}
              history={history}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlock={updateBlock}
              onSave={saveContent}
              onDiscard={discardChanges}
              onTogglePreview={togglePreview}
              onUploadImage={uploadImage}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
