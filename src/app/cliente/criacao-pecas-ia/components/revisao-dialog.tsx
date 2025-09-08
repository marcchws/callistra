"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileEdit, 
  Upload, 
  FileText, 
  Loader2,
  AlertCircle,
  Download
} from "lucide-react"
import { PROMPTS_PADRAO } from "../types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface RevisaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (prompt: string, arquivo?: File) => Promise<any>
  processando?: boolean
}

export function RevisaoDialog({ 
  open, 
  onOpenChange,
  onSubmit,
  processando = false
}: RevisaoDialogProps) {
  const [prompt, setPrompt] = useState(PROMPTS_PADRAO.revisao_ortografica)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    
    if (!validTypes.includes(file.type)) {
      toast.error("Apenas arquivos PDF ou DOCX são permitidos")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 10MB")
      return
    }
    
    setArquivo(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!arquivo) {
      toast.error("Por favor, selecione um arquivo para revisar")
      return
    }
    
    const result = await onSubmit(prompt, arquivo)
    if (result) {
      onOpenChange(false)
      setArquivo(null)
      setPrompt(PROMPTS_PADRAO.revisao_ortografica)
    }
  }

  const handleRemoveFile = () => {
    setArquivo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-blue-600" />
            Revisão Ortográfica
          </DialogTitle>
          <DialogDescription>
            Faça upload de um documento para revisão ortográfica e gramatical
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label>Documento para revisão *</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400",
                arquivo && "bg-gray-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                disabled={processando}
              />
              
              {arquivo ? (
                <div className="space-y-2">
                  <FileText className="h-10 w-10 mx-auto text-blue-600" />
                  <div>
                    <p className="font-medium">{arquivo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    disabled={processando}
                  >
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <div>
                    <p className="font-medium">Clique ou arraste o arquivo aqui</p>
                    <p className="text-sm text-muted-foreground">
                      PDF ou DOCX (máx. 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt editável */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Instruções para revisão</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite as instruções para a revisão..."
              className="min-h-[150px] resize-none"
              disabled={processando}
            />
            <p className="text-xs text-muted-foreground">
              Você pode personalizar as instruções de revisão conforme necessário
            </p>
          </div>

          {/* Aviso sobre tokens */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta operação utilizará aproximadamente <strong>500 tokens</strong> do seu plano.
              Após o processamento, você poderá baixar o arquivo revisado.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={processando}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!arquivo || processando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Revisando...
              </>
            ) : (
              <>
                <FileEdit className="mr-2 h-4 w-4" />
                Revisar Documento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}