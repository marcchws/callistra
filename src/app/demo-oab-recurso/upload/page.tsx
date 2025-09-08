"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Edit,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{
    prova?: File
    espelho?: File
  }>({})
  const [ocrText, setOcrText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrComplete, setOcrComplete] = useState(false)

  const totalSteps = 4

  const handleFileUpload = (type: 'prova' | 'espelho', file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }))
    toast.success(`${type === 'prova' ? 'Prova manuscrita' : 'Espelho de gabarito'} enviado com sucesso!`)
  }

  const processOCR = () => {
    setIsProcessing(true)
    // Simulação de OCR
    setTimeout(() => {
      setOcrText(`PEÇA PRÁTICA - DIREITO CIVIL

1. DOS FATOS:
Maria da Silva, viúva, brasileira, aposentada, portadora do CPF nº 123.456.789-00, residente e domiciliada na Rua das Flores, nº 123, Centro, São Paulo/SP, vem respeitosamente perante Vossa Excelência, por meio de seu advogado que esta subscreve, expor e requerer o que segue:

A requerente é proprietária de imóvel urbano localizado na Rua das Pedras, nº 456, Bairro Vila Nova, São Paulo/SP, conforme matrícula nº 12.345 do 5º Cartório de Registro de Imóveis da Capital.

2. DO DIREITO:
O art. 1.228 do Código Civil assegura ao proprietário o direito de usar, gozar e dispor da coisa, e o direito de reavê-la do poder de quem quer que injustamente a possua ou detenha.

A doação inoficiosa configura-se quando ultrapassa a parte disponível do patrimônio do doador, conforme dispõe o art. 549 do CC/2002.

3. DOS PEDIDOS:
Ante o exposto, requer-se:
a) A procedência do pedido de redução da doação inoficiosa;
b) A determinação judicial para que seja restituída à legítima herdeira a quantia correspondente;
c) Os benefícios da justiça gratuita.`)
      setIsProcessing(false)
      setOcrComplete(true)
      setCurrentStep(3)
    }, 3000)
  }

  const confirmOCR = () => {
    setCurrentStep(4)
    toast.success("Texto confirmado! Prosseguindo para análise prévia...")
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Link href="/demo-oab-recurso" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Demo Principal
              </Link>
              <Badge variant="secondary" className="mb-2">
                DEMO - Upload de Prova
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Upload e Processamento da Prova
              </h1>
              <p className="text-muted-foreground">
                Envie sua prova manuscrita e espelho de gabarito para análise da IA
              </p>
            </div>

            {/* Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    Progresso: Etapa {currentStep} de {totalSteps}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((currentStep / totalSteps) * 100)}%
                  </span>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
              </CardHeader>
            </Card>

            {/* Step 1: Upload de Arquivos */}
            {currentStep >= 1 && (
              <Card className={currentStep === 1 ? "border-blue-500" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {currentStep > 1 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                    )}
                    <CardTitle className="text-lg font-medium">Upload de Documentos</CardTitle>
                  </div>
                  <CardDescription>
                    Envie sua prova manuscrita e o espelho de gabarito (arquivos PDF ou JPG)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Upload Prova */}
                    <div className="space-y-2">
                      <Label>Prova Manuscrita</Label>
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                        <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {uploadedFiles.prova ? uploadedFiles.prova.name : "Clique para enviar prova"}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF ou JPG até 10MB</p>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload('prova', file)
                          }}
                        />
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => document.querySelector('input[type="file"]')?.click()}
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>

                    {/* Upload Espelho */}
                    <div className="space-y-2">
                      <Label>Espelho de Gabarito</Label>
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                        <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {uploadedFiles.espelho ? uploadedFiles.espelho.name : "Clique para enviar espelho"}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF ou JPG até 5MB</p>
                        <Button size="sm" className="mt-2" variant="outline">
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {uploadedFiles.prova && uploadedFiles.espelho && currentStep === 1 && (
                    <Button 
                      onClick={() => setCurrentStep(2)} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continuar para OCR
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: OCR Processing */}
            {currentStep >= 2 && (
              <Card className={currentStep === 2 ? "border-blue-500" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {currentStep > 2 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                    )}
                    <CardTitle className="text-lg font-medium">Processamento OCR</CardTitle>
                  </div>
                  <CardDescription>
                    Convertendo texto manuscrito para digital
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isProcessing && !ocrComplete && currentStep === 2 && (
                    <div className="text-center space-y-4">
                      <div className="p-6 border rounded-lg bg-blue-50">
                        <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="font-medium mb-2">Pronto para processar</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Nosso OCR irá converter sua prova manuscrita em texto digital. 
                          O processo pode levar alguns minutos.
                        </p>
                        <Button 
                          onClick={processOCR}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Iniciar Processamento OCR
                        </Button>
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center space-y-4">
                      <div className="p-6 border rounded-lg">
                        <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-spin" />
                        <h3 className="font-medium mb-2">Processando...</h3>
                        <p className="text-sm text-muted-foreground">
                          Analisando texto manuscrito com IA avançada
                        </p>
                        <Progress value={65} className="w-full mt-4" />
                      </div>
                    </div>
                  )}

                  {ocrComplete && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        OCR concluído com sucesso! Texto extraído e pronto para revisão.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: OCR Review */}
            {currentStep >= 3 && (
              <Card className={currentStep === 3 ? "border-blue-500" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {currentStep > 3 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                    )}
                    <CardTitle className="text-lg font-medium">Revisão do Texto</CardTitle>
                  </div>
                  <CardDescription>
                    Revise e corrija o texto extraído da sua prova manuscrita
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> Verifique se o texto está correto. 
                      Uma vírgula a mais ou a menos pode mudar totalmente o sentido da frase.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Texto Extraído (editável)</Label>
                      <Badge variant="secondary">
                        <Edit className="h-3 w-3 mr-1" />
                        Editável
                      </Badge>
                    </div>
                    <Textarea 
                      value={ocrText}
                      onChange={(e) => setOcrText(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="O texto extraído aparecerá aqui..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Caracteres: {ocrText.length}
                    </p>
                  </div>

                  {currentStep === 3 && ocrText && (
                    <Button 
                      onClick={confirmOCR} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Confirmar Texto e Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Ready for Analysis */}
            {currentStep >= 4 && (
              <Card className="border-green-500 bg-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg font-medium text-green-800">
                      Pronto para Análise
                    </CardTitle>
                  </div>
                  <CardDescription className="text-green-700">
                    Documentos processados com sucesso. Prossiga para análise prévia.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Prova manuscrita processada</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Espelho de gabarito analisado</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">OCR concluído e revisado</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Pronto para análise IA</span>
                    </div>
                  </div>

                  <Link href="/demo-oab-recurso/analise">
                    <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">
                      Iniciar Análise Prévia (R$ 50)
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}