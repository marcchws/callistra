"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Loader2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import type { TipoPecaJuridica } from "../types"

interface CriacaoPecaJuridicaProps {
  promptPadrao: string
  promptEditado: string
  setPromptEditado: (prompt: string) => void
  tiposPecas: { value: TipoPecaJuridica; label: string }[]
  pecaSelecionada: TipoPecaJuridica | null
  setPecaSelecionada: (tipo: TipoPecaJuridica | null) => void
  onEnviarParaIA: (prompt: string) => Promise<void>
  loading: boolean
}

export function CriacaoPecaJuridica({
  promptPadrao,
  promptEditado,
  setPromptEditado,
  tiposPecas,
  pecaSelecionada,
  setPecaSelecionada,
  onEnviarParaIA,
  loading
}: CriacaoPecaJuridicaProps) {
  const [promptAtual, setPromptAtual] = useState(promptEditado || promptPadrao)
  const [promptPersonalizado, setPromptPersonalizado] = useState("")

  // Prompts específicos para cada tipo de peça
  const promptsEspecificos: Record<TipoPecaJuridica, string> = {
    petição_inicial: "Crie uma petição inicial bem estruturada com: qualificação das partes, dos fatos, do direito, dos pedidos e requerimentos finais. Use linguagem técnica adequada e fundamentos legais sólidos.",
    contestação: "Elabore uma contestação completa com preliminares quando cabíveis, impugnação aos fatos narrados, argumentação jurídica robusta e pedidos de improcedência. Observe os prazos e formalidades processuais.",
    recurso_apelação: "Redige um recurso de apelação fundamentado com conhecimento do mérito, razões recursais específicas, demonstração de erro de julgamento e pedidos de reforma. Estruture conforme CPC.",
    embargos_declaração: "Formule embargos de declaração apontando omissão, contradição ou obscuridade específicas na decisão, com argumentação clara e pedidos de esclarecimento conforme art. 1.022 do CPC.",
    agravo_instrumento: "Elabore agravo de instrumento contra decisão interlocutória, demonstrando presença dos pressupostos, fundamentação específica e urgência quando aplicável.",
    mandado_segurança: "Redija mandado de segurança com demonstração de direito líquido e certo, ato coator identificado, autoridade competente e fundamentação constitucional adequada.",
    habeas_corpus: "Prepare habeas corpus com identificação precisa da coação ou ameaça, fundamentação constitucional, demonstração de ilegalidade e pedidos específicos de concessão.",
    ação_trabalhista: "Elabore reclamação trabalhista com qualificação adequada, narrativa factual detalhada, fundamentos na CLT e CF/88, cálculos quando aplicáveis e pedidos específicos.",
    defesa_trabalhista: "Formule defesa trabalhista com impugnações específicas aos fatos e pedidos, argumentação baseada na CLT, apresentação de documentos e preliminares quando cabíveis.",
    recurso_trabalhista: "Redija recurso trabalhista ordinário ou revista conforme o caso, com fundamentação específica, demonstração de violação legal e pedidos de reforma da decisão."
  }

  const handleTipoPecaChange = (tipo: TipoPecaJuridica) => {
    setPecaSelecionada(tipo)
    const promptEspecifico = promptsEspecificos[tipo]
    setPromptAtual(promptEspecifico)
    setPromptPersonalizado(promptEspecifico)
  }

  const handleEnviar = async () => {
    if (!pecaSelecionada) {
      toast.error("Selecione o tipo de peça jurídica", { duration: 3000, position: "bottom-right" })
      return
    }

    if (!promptAtual.trim()) {
      toast.error("O prompt não pode estar vazio", { duration: 3000, position: "bottom-right" })
      return
    }

    setPromptEditado(promptAtual)
    await onEnviarParaIA(promptAtual)
  }

  const resetarPrompt = () => {
    if (pecaSelecionada) {
      const promptEspecifico = promptsEspecificos[pecaSelecionada]
      setPromptAtual(promptEspecifico)
      setPromptPersonalizado(promptEspecifico)
    } else {
      setPromptAtual(promptPadrao)
      setPromptPersonalizado("")
    }
    setPromptEditado("")
  }

  return (
    <div className="space-y-6">
      {/* Seleção do Tipo de Peça */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            Tipo de Peça Jurídica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo-peca" className="text-sm font-medium">
              Selecione o tipo de peça <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={pecaSelecionada || ""} 
              onValueChange={(value) => handleTipoPecaChange(value as TipoPecaJuridica)}
              disabled={loading}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Escolha o tipo de peça jurídica" />
              </SelectTrigger>
              <SelectContent>
                {tiposPecas.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {pecaSelecionada && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {tiposPecas.find(t => t.value === pecaSelecionada)?.label}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuração do Prompt */}
      {pecaSelecionada && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Configuração da Peça
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-peca" className="text-sm font-medium">
                Instruções específicas para a IA <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="prompt-peca"
                placeholder="Personalize as instruções conforme suas necessidades..."
                value={promptAtual}
                onChange={(e) => {
                  setPromptAtual(e.target.value)
                  setPromptPersonalizado(e.target.value)
                }}
                className="min-h-[150px] focus:ring-blue-500"
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

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-sm font-medium text-amber-800 mb-1">Dicas para melhor resultado:</div>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Inclua detalhes específicos do caso quando possível</li>
                <li>• Mencione a legislação aplicável se conhecida</li>
                <li>• Especifique se há particularidades processuais</li>
                <li>• Indique o foro competente se relevante</li>
              </ul>
            </div>

            <Button
              onClick={handleEnviar}
              disabled={loading || !promptAtual.trim() || !pecaSelecionada}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Criando peça..." : "Gerar Peça Jurídica"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
