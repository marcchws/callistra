"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react"
import { toast } from 'sonner'
import { DocumentoAnexo, UploadFile } from './types'

interface UploadComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuarioId: string
  onUploadComplete: (documento: DocumentoAnexo) => void
}

export function UploadComponent({
  open,
  onOpenChange,
  usuarioId,
  onUploadComplete
}: UploadComponentProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = [
    'application/pdf',
    'image/png', 
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = []
    
    Array.from(fileList).forEach(file => {
      // Verificar tipo de arquivo
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`Tipo de arquivo não suportado: ${file.name}`, {
          duration: 3000,
          position: "bottom-right"
        })
        return
      }

      // Verificar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Arquivo muito grande: ${file.name}`, {
          duration: 3000,
          position: "bottom-right"
        })
        return
      }

      newFiles.push({
        file,
        tipo: 'termo-confidencialidade' as DocumentoAnexo['tipo']
      })
    })

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles)
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const updateFileType = (index: number, tipo: DocumentoAnexo['tipo']) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, tipo } : file
    ))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadFile = files[i]
        
        // Simular upload
        await new Promise(resolve => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            setUploadProgress((prevProgress) => {
              const newProgress = (i / files.length * 100) + (progress / files.length)
              return Math.min(newProgress, 100)
            })
            
            if (progress >= 100) {
              clearInterval(interval)
              resolve(true)
            }
          }, 100)
        })

        // Criar documento mock
        const novoDocumento: DocumentoAnexo = {
          id: Date.now().toString() + i,
          nome: uploadFile.file.name,
          tipo: uploadFile.tipo,
          url: URL.createObjectURL(uploadFile.file), // Em produção seria a URL real
          uploadEm: new Date(),
          uploadPor: 'Usuário Atual'
        }

        onUploadComplete(novoDocumento)
      }

      toast.success(`${files.length} arquivo(s) enviado(s) com sucesso`, {
        duration: 2000,
        position: "bottom-right"
      })

      setFiles([])
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao enviar arquivos', {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getTipoLabel = (tipo: DocumentoAnexo['tipo']) => {
    const labels = {
      'termo-confidencialidade': 'Termo de Confidencialidade',
      'rg-cpf': 'RG/CPF',
      'passaporte': 'Passaporte'
    }
    return labels[tipo]
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enviar Documentos</DialogTitle>
          <DialogDescription>
            Envie documentos como Termo de Confidencialidade, RG/CPF ou Passaporte
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input file hidden */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Área de Drop */}
          <Card>
            <CardContent className="pt-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                {isDragOver ? (
                  <p className="text-blue-600">Solte os arquivos aqui...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Arraste arquivos para cá ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF, DOC, DOCX, PNG, JPG até 10MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de arquivos */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Arquivos Selecionados</CardTitle>
                <CardDescription>
                  Configure o tipo de cada documento antes de enviar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {files.map((uploadFile, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                    </div>

                    <Select
                      value={uploadFile.tipo}
                      onValueChange={(value) => updateFileType(index, value as DocumentoAnexo['tipo'])}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="termo-confidencialidade">
                          Termo de Confidencialidade
                        </SelectItem>
                        <SelectItem value="rg-cpf">
                          RG/CPF
                        </SelectItem>
                        <SelectItem value="passaporte">
                          Passaporte
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Progress bar durante upload */}
          {uploading && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enviando arquivos...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enviar {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
