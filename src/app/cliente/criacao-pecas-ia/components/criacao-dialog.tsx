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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { 
  FileText, 
  Loader2,
  AlertCircle,
  ChevronRight,
  Download,
  Users,
  Sparkles
} from "lucide-react"
import { 
  PROMPTS_PADRAO, 
  TIPOS_PECAS_INFO, 
  TipoPecaJuridica,
  Cliente,
  PecaJuridica
} from "../types"
import { toast } from "sonner"

interface CriacaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (prompt: string, tipoPeca: TipoPecaJuridica) => Promise<PecaJuridica | null>
  onIntegrarCliente: (pecaId: string, clienteId: string) => Promise<string | null>
  clientes: Cliente[]
  processando?: boolean
}

export function CriacaoDialog({ 
  open, 
  onOpenChange,
  onSubmit,
  onIntegrarCliente,
  clientes,
  processando = false
}: CriacaoDialogProps) {
  const [tipoPeca, setTipoPeca] = useState<TipoPecaJuridica>("peticao_inicial")
  const [prompt, setPrompt] = useState(PROMPTS_PADRAO.peticao_inicial)
  const [pecaCriada, setPecaCriada] = useState<PecaJuridica | null>(null)
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("")
  const [integrandoCliente, setIntegrandoCliente] = useState(false)
  const [step, setStep] = useState<"criar" | "resultado">("criar")

  const handleTipoPecaChange = (tipo: TipoPecaJuridica) => {
    setTipoPeca(tipo)
    // Atualizar prompt padrão baseado no tipo selecionado
    const promptKey = tipo as keyof typeof PROMPTS_PADRAO
    if (PROMPTS_PADRAO[promptKey]) {
      setPrompt(PROMPTS_PADRAO[promptKey])
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, forneça as instruções para criação da peça")
      return
    }
    
    const result = await onSubmit(prompt, tipoPeca)
    if (result) {
      setPecaCriada(result)
      setStep("resultado")
    }
  }

  const handleIntegrarCliente = async () => {
    if (!clienteSelecionado || !pecaCriada) {
      toast.error("Selecione um cliente para integração")
      return
    }
    
    setIntegrandoCliente(true)
    const url = await onIntegrarCliente(pecaCriada.id, clienteSelecionado)
    setIntegrandoCliente(false)
    
    if (url) {
      // Simular download
      const link = document.createElement('a')
      link.href = url
      link.download = `${TIPOS_PECAS_INFO[tipoPeca].label}_${clienteSelecionado}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep("criar")
    setPecaCriada(null)
    setClienteSelecionado("")
    setTipoPeca("peticao_inicial")
    setPrompt(PROMPTS_PADRAO.peticao_inicial)
  }

  const handleNovaPeca = () => {
    setStep("criar")
    setPecaCriada(null)
    setClienteSelecionado("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {step === "criar" ? "Criar Peça Jurídica" : "Peça Criada com Sucesso"}
          </DialogTitle>
          <DialogDescription>
            {step === "criar" 
              ? "Selecione o tipo de peça e forneça as informações necessárias"
              : "Visualize o resultado e integre com dados do cliente se necessário"}
          </DialogDescription>
        </DialogHeader>
        
        {step === "criar" ? (
          <div className="space-y-4 py-4">
            {/* Seleção do tipo de peça */}
            <div className="space-y-2">
              <Label htmlFor="tipo-peca">Tipo de peça jurídica *</Label>
              <Select value={tipoPeca} onValueChange={handleTipoPecaChange}>
                <SelectTrigger id="tipo-peca">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPOS_PECAS_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{info.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {info.descricao}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prompt editável */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Instruções para criação da peça *</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Forneça as informações necessárias para criar a peça..."
                className="min-h-[250px] resize-none"
                disabled={processando}
              />
              <p className="text-xs text-muted-foreground">
                Personalize as instruções com os dados específicos do caso
              </p>
            </div>

            {/* Aviso sobre tokens */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta operação utilizará aproximadamente <strong>1500 tokens</strong> do seu plano.
                A peça será gerada e você poderá integrá-la com dados de clientes.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 py-4">
              {/* Preview da peça criada */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{pecaCriada?.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {TIPOS_PECAS_INFO[tipoPeca].label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Sparkles className="h-4 w-4" />
                      <span>Criada com sucesso</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <Label className="text-sm">Conteúdo da peça:</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm whitespace-pre-line">
                        {pecaCriada?.conteudo}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Integração com cliente */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <Label>Integrar com dados do cliente (opcional)</Label>
                  </div>
                  
                  <Select value={clienteSelecionado} onValueChange={setClienteSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          <div className="flex flex-col">
                            <span>{cliente.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {cliente.cpfCnpj} • {cliente.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {clienteSelecionado && (
                    <Button
                      onClick={handleIntegrarCliente}
                      disabled={integrandoCliente}
                      className="w-full"
                      variant="outline"
                    >
                      {integrandoCliente ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Integrando...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar com dados do cliente
                        </>
                      )}
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Os dados do cliente serão preenchidos no documento sem serem salvos no chat
                  </p>
                </div>
              </Card>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          {step === "criar" ? (
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
                    Criando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Criar Peça
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleNovaPeca}
              >
                Criar Nova Peça
              </Button>
              <Button 
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Concluir
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}