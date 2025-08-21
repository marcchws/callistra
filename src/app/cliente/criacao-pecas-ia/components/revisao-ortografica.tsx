"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RevisaoOrtograficaProps {
  promptPadrao: string
  promptEditado: string
  setPromptEditado: (prompt: string) => void
  arquivoUpload: File | null
  setArquivoUpload: (arquivo: File | null) => void
  onEnviarParaIA: (prompt: string, arquivo?: File) => Promise<void>
  loading: boolean
  arquivoRevisado?: {
    nome: string
    url: string
    tipo: "pdf" | "docx"
    data_revisao: Date
  } | null
  onDownload: (url: string, nome: string) => Promise<void>
  loadingDownload: boolean
}

export function RevisaoOrtografica({
  promptPadrao,
  promptEditado,
  setPromptEditado,
  arquivoUpload,
  setArquivoUpload,
  onEnviarParaIA,
  loading,
  arquivoRevisado,
  onDownload,
  loadingDownload
}: RevisaoOrtograficaProps) {
  const [promptAtual, setPromptAtual] = useState(promptEditado || promptPadrao)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const tiposPermitidos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!tiposPermitidos.includes(file.type)) {
        toast.error("Apenas arquivos PDF ou DOCX são permitidos", { duration: 3000, position: "bottom-right" })
        return
      }
      
      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo deve ter no máximo 10MB", { duration: 3000, position: "bottom-right" })
        return
      }
      
      setArquivoUpload(file)
      toast.success("Arquivo carregado com sucesso!", { duration: 2000, position: "bottom-right" })
    }
  }

  const handleEnviar = async () => {
    if (!promptAtual.trim()) {
      toast.error("O prompt não pode estar vazio", { duration: 3000, position: "bottom-right" })
      return
    }

    if (!arquivoUpload) {
      toast.error("Selecione um arquivo para revisão", { duration: 3000, position: "bottom-right" })
      return
    }

    setPromptEditado(promptAtual)
    await onEnviarParaIA(promptAtual, arquivoUpload)
  }

  const resetarPrompt = () => {
    setPromptAtual(promptPadrao)
    setPromptEditado("")
  }

  return (
    <div className="space-y-6">
      {/* Configuração do Prompt */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Configuração da Revisão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-revisao" className="text-sm font-medium">
              Instruções para a IA <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt-revisao"
              placeholder="Digite as instruções para revisão ortográfica..."
              value={promptAtual}
              onChange={(e) => setPromptAtual(e.target.value)}
              className="min-h-[120px] focus:ring-blue-500"
              disabled={loading}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {promptAtual.length} caracteres
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetarPrompt}
                disabled={loading}
              >
                Restaurar padrão
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arquivo-upload" className="text-sm font-medium">
              Arquivo para revisão <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="arquivo-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="flex-1 focus:ring-blue-500"
                disabled={loading}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                PDF ou DOCX
              </div>
            </div>
            {arquivoUpload && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {arquivoUpload.name} ({(arquivoUpload.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <Button
            onClick={handleEnviar}
            disabled={loading || !promptAtual.trim() || !arquivoUpload}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processando com IA..." : "Enviar para Revisão"}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado da Revisão */}
      {arquivoRevisado && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Arquivo Revisado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-800">
                    {arquivoRevisado.nome}
                  </div>
                  <div className="text-sm text-green-600">
                    Revisado em {arquivoRevisado.data_revisao.toLocaleDateString('pt-BR')} às {arquivoRevisado.data_revisao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <Button
                  onClick={() => onDownload(arquivoRevisado.url, arquivoRevisado.nome)}
                  disabled={loadingDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loadingDownload && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingDownload ? "Baixando..." : "Download"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
