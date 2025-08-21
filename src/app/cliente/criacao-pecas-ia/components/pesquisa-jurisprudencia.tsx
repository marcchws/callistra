"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, BookOpen, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PesquisaJurisprudenciaProps {
  promptPadrao: string
  promptEditado: string
  setPromptEditado: (prompt: string) => void
  onEnviarParaIA: (prompt: string) => Promise<void>
  loading: boolean
  resultadoPesquisa?: {
    conteudo: string
    fontes?: string[]
    data_pesquisa: Date
  } | null
}

export function PesquisaJurisprudencia({
  promptPadrao,
  promptEditado,
  setPromptEditado,
  onEnviarParaIA,
  loading,
  resultadoPesquisa
}: PesquisaJurisprudenciaProps) {
  const [promptAtual, setPromptAtual] = useState(promptEditado || promptPadrao)

  const handleEnviar = async () => {
    if (!promptAtual.trim()) {
      toast.error("O prompt não pode estar vazio", { duration: 3000, position: "bottom-right" })
      return
    }

    setPromptEditado(promptAtual)
    await onEnviarParaIA(promptAtual)
  }

  const resetarPrompt = () => {
    setPromptAtual(promptPadrao)
    setPromptEditado("")
  }

  return (
    <div className="space-y-6">
      {/* Configuração da Pesquisa */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Configuração da Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-pesquisa" className="text-sm font-medium">
              Tema ou pergunta para pesquisa <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt-pesquisa"
              placeholder="Ex: Jurisprudência sobre responsabilidade civil em acidentes de trânsito..."
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 mb-1">Dica para melhores resultados:</div>
            <div className="text-xs text-blue-600">
              Seja específico sobre o tema, área do direito e tipo de decisão desejada (STJ, STF, tribunais regionais, etc.)
            </div>
          </div>

          <Button
            onClick={handleEnviar}
            disabled={loading || !promptAtual.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Pesquisando..." : "Buscar Jurisprudência"}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados da Pesquisa */}
      {resultadoPesquisa && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Resultados da Pesquisa
              </CardTitle>
              <Badge variant="outline">
                {resultadoPesquisa.data_pesquisa.toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Conteúdo da pesquisa */}
            <div className="space-y-3">
              <div className="font-medium text-sm">Resumo Executivo:</div>
              <ScrollArea className="h-[300px] w-full border rounded-lg p-4">
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {resultadoPesquisa.conteudo}
                </div>
              </ScrollArea>
            </div>

            {/* Fontes */}
            {resultadoPesquisa.fontes && resultadoPesquisa.fontes.length > 0 && (
              <div className="space-y-3">
                <div className="font-medium text-sm">Fontes e Precedentes:</div>
                <div className="space-y-2">
                  {resultadoPesquisa.fontes.map((fonte, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{fonte}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Em implementação real, abrir link para o julgado
                          toast.info("Redirecionando para a fonte...", { duration: 2000, position: "bottom-right" })
                        }}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(resultadoPesquisa.conteudo)
                  toast.success("Conteúdo copiado para a área de transferência!", { duration: 2000, position: "bottom-right" })
                }}
              >
                Copiar Conteúdo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const texto = `PESQUISA DE JURISPRUDÊNCIA

Data: ${resultadoPesquisa.data_pesquisa.toLocaleDateString('pt-BR')}

${resultadoPesquisa.conteudo}

FONTES:
${resultadoPesquisa.fontes?.join('\n') || 'Nenhuma fonte especificada'}`
                  
                  const blob = new Blob([texto], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `pesquisa_jurisprudencia_${new Date().toISOString().split('T')[0]}.txt`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                  
                  toast.success("Arquivo de pesquisa baixado!", { duration: 2000, position: "bottom-right" })
                }}
              >
                Baixar como TXT
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
