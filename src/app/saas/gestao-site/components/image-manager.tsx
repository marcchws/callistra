"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImageBlock } from "../types"
import { toast } from "sonner"

interface ImageManagerProps {
  block: ImageBlock
  isEditing: boolean
  onUpdate: (updates: Partial<ImageBlock>) => void
  onStartEdit: () => void
  onEndEdit: () => void
  onUpload: (file: File) => Promise<string>
}

export function ImageManager({
  block,
  isEditing,
  onUpdate,
  onStartEdit,
  onEndEdit,
  onUpload,
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Formato de arquivo inválido. Use: JPG, PNG, GIF ou WebP", {
        duration: 3000,
        position: "bottom-right",
      })
      return
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5MB", {
        duration: 3000,
        position: "bottom-right",
      })
      return
    }

    setIsUploading(true)

    try {
      // Preview local imediato
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload
      const uploadedUrl = await onUpload(file)
      
      onUpdate({
        src: uploadedUrl,
        alt: block.alt || file.name,
      })

      toast.success("Imagem carregada com sucesso!", {
        duration: 2000,
        position: "bottom-right",
      })

      onEndEdit()
    } catch (error) {
      toast.error("Erro ao carregar imagem", {
        duration: 3000,
        position: "bottom-right",
      })
      console.error("Erro no upload:", error)
    } finally {
      setIsUploading(false)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    onUpdate({ src: null })
    toast.info("Imagem removida", {
      duration: 2000,
      position: "bottom-right",
    })
    onEndEdit()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      // Criar um evento sintético para reutilizar handleFileSelect
      const syntheticEvent = {
        target: {
          files: [file],
        },
      } as React.ChangeEvent<HTMLInputElement>
      
      handleFileSelect(syntheticEvent)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (!isEditing) {
    return (
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden",
          "border-2 border-dashed border-transparent",
          "hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer",
          "transition-all duration-200"
        )}
        onClick={onStartEdit}
      >
        {block.src ? (
          <div className="relative">
            <img
              src={block.src}
              alt={block.alt}
              className="w-full h-auto max-h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Clique para editar</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-3" />
            <p className="text-sm font-medium">Nenhuma imagem</p>
            <p className="text-xs mt-1">Clique para adicionar</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50/30 space-y-4">
      {/* Área de upload/preview */}
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed border-gray-300",
          "hover:border-blue-400 transition-colors",
          "bg-white"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl || block.src ? (
          <div className="relative">
            <img
              src={previewUrl || block.src || ""}
              alt={block.alt}
              className="w-full h-auto max-h-[300px] object-contain rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                  <p className="text-sm mt-2">Carregando...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, GIF ou WebP - Máx 5MB
            </p>
          </div>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {block.src ? "Substituir" : "Carregar"} Imagem
        </Button>
        
        {block.src && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Botão cancelar */}
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onEndEdit}
        disabled={isUploading}
      >
        Cancelar
      </Button>
    </div>
  )
}
