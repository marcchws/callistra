"use client"

import { useState, useRef } from "react"
import { FileText, Upload, Download, Trash2, Eye, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Anexo, Cliente } from "../types"
import { toast } from "sonner"

interface ClienteDocumentsProps {
  cliente: Cliente
  onUpload: (clienteId: string, file: File) => Promise<Anexo>
  onDelete?: (clienteId: string, anexoId: string) => Promise<void>
  onClose?: () => void
}

export function ClienteDocuments({ cliente, onUpload, onDelete, onClose }: ClienteDocumentsProps) {
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 10MB")
      return
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use PDF, imagens ou documentos Word.")
      return
    }

    try {
      setUploading(true)
      await onUpload(cliente.id, file)
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId || !onDelete) return

    try {
      await onDelete(cliente.id, deleteId)
      setDeleteId(null)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word')) return '📝'
    return '📎'
  }

  const anexos = cliente.anexos || []

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Documentos do Cliente</CardTitle>
              <CardDescription>
                {cliente.nome} - {anexos.length} documento(s) anexado(s)
              </CardDescription>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload de arquivo */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              disabled={uploading}
            />
            
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer"
            >
              <div className="space-y-2">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Upload className="h-12 w-12" />
                </div>
                <div className="text-sm">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Clique para selecionar
                  </span>
                  <span className="text-gray-600"> ou arraste um arquivo</span>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG ou Word até 10MB
                </p>
              </div>
            </Label>

            {uploading && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
              </div>
            )}
          </div>

          {/* Lista de documentos */}
          {anexos.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Documentos anexados</h4>
              <div className="grid gap-2">
                {anexos.map((anexo) => (
                  <div 
                    key={anexo.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(anexo.tipo)}</span>
                      <div>
                        <p className="text-sm font-medium">{anexo.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(anexo.tamanho)} • {new Date(anexo.dataUpload).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewUrl(anexo.url)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <a href={anexo.url} download={anexo.nome}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(anexo.id)}
                          className="h-8 w-8 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum documento anexado ainda
              </p>
            </div>
          )}

          {/* Tipos de documentos sugeridos */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Documentos sugeridos</h4>
            <div className="flex flex-wrap gap-2">
              {cliente.tipo === "pessoa_fisica" ? (
                <>
                  <Badge variant="outline">RG/CNH</Badge>
                  <Badge variant="outline">CPF</Badge>
                  <Badge variant="outline">Comprovante de Residência</Badge>
                  <Badge variant="outline">Procuração</Badge>
                  <Badge variant="outline">Contrato de Honorários</Badge>
                </>
              ) : (
                <>
                  <Badge variant="outline">Contrato Social</Badge>
                  <Badge variant="outline">CNPJ</Badge>
                  <Badge variant="outline">Procuração</Badge>
                  <Badge variant="outline">Contrato de Honorários</Badge>
                  <Badge variant="outline">Alvará</Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de preview (simplificado) */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
            <DialogDescription>
              Preview do documento anexado
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {previewUrl && (
              <div className="text-center p-8 bg-gray-50 rounded">
                <FileText className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Preview completo seria implementado com biblioteca específica
                </p>
                <Button 
                  asChild 
                  className="mt-4"
                  variant="outline"
                >
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    Abrir em nova aba
                  </a>
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewUrl(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}