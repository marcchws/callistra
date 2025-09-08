"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  Target,
  Loader2,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AnalisePrevia() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)

  const startAnalysis = () => {
    setPaymentStep(true)
  }

  const processPayment = () => {
    setPaymentStep(false)
    setIsAnalyzing(true)
    
    // Simular análise da IA
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      toast.success("Análise concluída! Recurso viável identificado.")
    }, 4000)
  }

  // Dados simulados baseados na reunião
  const analysisData = {
    viabilidade: "VIÁVEL",
    percentualSuccesso: 75,
    pontuacaoAtual: 42,
    pontuacaoNecessaria: 60,
    pontosPerdidos: 18,
    pontosRecuperaveis: 22
  }

  const itemsAnalise = [
    {
      item: "Questão 1 - Direito Civil",
      pontuacaoObtida: 8,
      pontuacaoMaxima: 20,
      status: "parcial",
      problemasIdentificados: [
        "Termo técnico 'doação inoficiosa' não foi reconhecido pelo corretor",
        "Conceito estava correto mas precisava ser explicado por extenso"
      ],
      recuperavel: 8
    },
    {
      item: "Questão 2 - Direito Processual",
      pontuacaoObtida: 12,
      pontuacaoMaxima: 20,
      status: "parcial", 
      problemasIdentificados: [
        "Citação de artigo correto mas formatação não seguiu padrão exigido",
        "Fundamentação estava presente mas não foi identificada"
      ],
      recuperavel: 6
    },
    {
      item: "Questão 3 - Direito Constitucional",
      pontuacaoObtida: 15,
      pontuacaoMaxima: 20,
      status: "boa",
      problemasIdentificados: [
        "Resposta substancialmente correta, pequenos ajustes de forma"
      ],
      recuperavel: 3
    },
    {
      item: "Peça Prática",
      pontuacaoObtida: 7,
      pontuacaoMaxima: 40,
      status: "critico",
      problemasIdentificados: [
        "Estrutura correta não foi reconhecida",
        "Pedidos estavam adequados mas formatação divergiu do padrão",
        "Fundamentação jurídica sólida mas linguagem muito técnica"
      ],
      recuperavel: 12
    }
  ]

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Link href="/demo-oab-recurso/upload" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Upload
              </Link>
              <Badge variant="secondary" className="mb-2">
                DEMO - Análise Prévia IA
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Análise de Viabilidade do Recurso
              </h1>
              <p className="text-muted-foreground">
                Nossa IA analisa sua prova comparando com o espelho de gabarito oficial
              </p>
            </div>

            {/* Contexto da Funcionalidade */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-blue-800">
                  Como Funciona a Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 space-y-2">
                <p className="text-sm">
                  • <strong>Comparação automática:</strong> IA compara sua resposta com o espelho oficial da FGV
                </p>
                <p className="text-sm">
                  • <strong>Identificação de problemas:</strong> Detecta casos onde termos técnicos corretos não foram reconhecidos
                </p>
                <p className="text-sm">
                  • <strong>Cálculo de viabilidade:</strong> Estima probabilidade de sucesso baseada em padrões históricos
                </p>
                <p className="text-sm">
                  • <strong>Investimento inicial:</strong> R$ 50 para análise prévia (mencionado na reunião)
                </p>
              </CardContent>
            </Card>

            {/* Pagamento da Análise */}
            {!paymentStep && !isAnalyzing && !analysisComplete && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-amber-800">
                    Análise Prévia - R$ 50
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Descubra se vale a pena investir no recurso completo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Análise de viabilidade completa</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-800">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Percentual de chance de sucesso</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-800">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Relatório detalhado por questão</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-800">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Valor descontado do recurso final</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startAnalysis}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    size="lg"
                  >
                    Pagar Análise Prévia - R$ 50
                    <CreditCard className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Simulação de Pagamento */}
            {paymentStep && (
              <Card className="border-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    Processamento do Pagamento
                  </CardTitle>
                  <CardDescription>
                    Gateway internacional - Empresa Pivot (Holanda)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Simulação:</strong> Em produção, aqui seria integrado um gateway internacional 
                      que aceita pagamentos em Real convertendo para EUR (conforme discutido na reunião).
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-2">Detalhes do Pagamento</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Análise Prévia IA:</span>
                        <span>R$ 50,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa Gateway:</span>
                        <span>R$ 2,50</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>R$ 52,50</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={processPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Confirmar Pagamento
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Processamento da Análise */}
            {isAnalyzing && (
              <Card className="border-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    IA Analisando sua Prova
                  </CardTitle>
                  <CardDescription>
                    Comparando suas respostas com o espelho oficial da FGV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <Brain className="h-16 w-16 text-blue-500 mx-auto animate-pulse" />
                    <div className="space-y-2">
                      <p className="font-medium">Análise em andamento...</p>
                      <Progress value={67} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        Processando questões e identificando oportunidades de recurso
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resultado da Análise */}
            {analysisComplete && (
              <>
                {/* Resumo Geral */}
                <Card className="border-green-500 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <CardTitle className="text-xl font-semibold text-green-800">
                        Recurso VIÁVEL - {analysisData.percentualSuccesso}% de Chance de Sucesso
                      </CardTitle>
                    </div>
                    <CardDescription className="text-green-700">
                      Análise identificou oportunidades significativas de recuperação de pontos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{analysisData.pontuacaoAtual}</div>
                        <p className="text-sm text-muted-foreground">Pontuação Atual</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analysisData.pontuacaoNecessaria}</div>
                        <p className="text-sm text-muted-foreground">Necessária</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">{analysisData.pontosPerdidos}</div>
                        <p className="text-sm text-muted-foreground">Pontos Perdidos</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analysisData.pontosRecuperaveis}</div>
                        <p className="text-sm text-muted-foreground">Recuperáveis</p>
                      </div>
                    </div>

                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recomendação:</strong> Com {analysisData.pontosRecuperaveis} pontos recuperáveis, 
                        você pode atingir {analysisData.pontuacaoAtual + analysisData.pontosRecuperaveis} pontos, 
                        superando os {analysisData.pontuacaoNecessaria} necessários para aprovação.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Análise Detalhada */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Análise Detalhada por Questão
                    </CardTitle>
                    <CardDescription>
                      Problemas identificados e pontos recuperáveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Pontuação</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Recuperável</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemsAnalise.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{item.item}</p>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  {item.problemasIdentificados.map((problema, i) => (
                                    <p key={i}>• {problema}</p>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <span className="text-lg font-bold">{item.pontuacaoObtida}</span>
                                <span className="text-muted-foreground">/{item.pontuacaoMaxima}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  item.status === 'boa' ? 'default' : 
                                  item.status === 'parcial' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {item.status === 'boa' ? 'Boa' : 
                                 item.status === 'parcial' ? 'Parcial' : 
                                 'Crítico'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <span className="text-lg font-bold text-green-600">+{item.recuperavel}</span>
                                <p className="text-xs text-muted-foreground">pontos</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* CTA para Recurso Completo */}
                <Card className="border-blue-500 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-blue-800">
                      Prosseguir com Recurso Completo
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      Análise positiva! Recomendamos prosseguir com o recurso completo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Recurso Completo:</span>
                        <span className="line-through text-muted-foreground">R$ 300,00</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Desconto análise prévia:</span>
                        <span className="text-green-600">-R$ 50,00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-medium text-lg">
                        <span>Valor final:</span>
                        <span className="text-blue-600">R$ 250,00</span>
                      </div>
                    </div>

                    <Link href="/demo-oab-recurso/recurso">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        Gerar Recurso Completo - R$ 250
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}