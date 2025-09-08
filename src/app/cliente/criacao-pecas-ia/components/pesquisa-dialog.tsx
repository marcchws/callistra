"use client"

import { useState } from "react"
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
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Gavel,
  Building
} from "lucide-react"
import { PROMPTS_PADRAO, ResultadoPesquisa } from "../types"
import { toast } from "sonner"

interface PesquisaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (prompt: string) => Promise<ResultadoPesquisa[]>
  processando?: boolean
}

export function PesquisaDialog({ 
  open, 
  onOpenChange,
  onSubmit,
  processando = false
}: PesquisaDialogProps) {
  const [prompt, setPrompt] = useState(PROMPTS_PADRAO.pesquisa_jurisprudencia)
  const [resultados, setResultados] = useState<ResultadoPesquisa[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, descreva o tema ou questão jurídica para pesquisa")
      return
    }
    
    const results = await onSubmit(prompt)
    if (results && results.length > 0) {
      setResultados(results)
      setMostrarResultados(true)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setMostrarResultados(false)
    setResultados([])
    setPrompt(PROMPTS_PADRAO.pesquisa_jurisprudencia)
  }

  const handleNovaConsulta = () => {
    setMostrarResultados(false)
    setResultados([])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Pesquisa de Jurisprudência
          </DialogTitle>
          <DialogDescription>
            {mostrarResultados 
              ? "Resultados encontrados para sua pesquisa"
              : "Pesquise jurisprudências relevantes sobre temas específicos"}
          </DialogDescription>
        </DialogHeader>
        
        {!mostrarResultados ? (
          <div className="space-y-4 py-4">
            {/* Prompt de pesquisa */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Descreva o tema ou questão jurídica *</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Responsabilidade civil por danos morais em relações de consumo..."
                className="min-h-[200px] resize-none"
                disabled={processando}
              />
              <p className="text-xs text-muted-foreground">
                Seja específico sobre o tema, área do direito e tipo de decisão que procura
              </p>
            </div>

            {/* Aviso sobre tokens */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta pesquisa utilizará aproximadamente <strong>1000 tokens</strong> do seu plano.
                A IA buscará jurisprudências relevantes dos tribunais superiores.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 py-4">
              {resultados.map((resultado) => (
                <Card key={resultado.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-base">{resultado.titulo}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{resultado.tribunal}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gavel className="h-3 w-3" />
                            <span>{resultado.relator}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {resultado.dataJulgamento.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      {resultado.link && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(resultado.link, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm leading-relaxed text-gray-700">
                        <strong>Ementa:</strong> {resultado.ementa}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          {mostrarResultados ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleNovaConsulta}
              >
                Nova Consulta
              </Button>
              <Button 
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Fechar
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={processando}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!prompt.trim() || processando}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pesquisando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Pesquisar
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}