"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Brain, Send, CheckCircle, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DemoOABRecursoPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header da Demo */}
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">
                DEMO COMERCIAL - Baseado na Reunião de 29/08/2025
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                IA para Recursos Administrativos - Segunda Fase OAB
              </h1>
              <p className="text-muted-foreground">
                Automatize a criação de recursos administrativos da segunda fase da OAB com Inteligência Artificial. 
                Reduza custos de R$ 600-700 para R$ 300 e atenda o prazo recursal de 3 dias.
              </p>
            </div>

            {/* Problema Identificado */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-amber-800">
                  Problema Identificado na Reunião
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Dor relatada por João - sócio da Pivot (Holanda)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-amber-800">
                  <p className="mb-2">
                    <strong>Situação:</strong> João reprovou na segunda fase da OAB e precisou pagar R$ 600-700 
                    para um advogado fazer o recurso administrativo.
                  </p>
                  <p className="mb-2">
                    <strong>Insight:</strong> "Cara, isso aqui é muito simples. Isso aqui eu faria" - 
                    após receber o trabalho do advogado.
                  </p>
                  <p>
                    <strong>Oportunidade:</strong> Automatizar processo com IA, operando da Holanda 
                    para benefícios fiscais.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Mercado */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Mercado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">30.000</div>
                  <p className="text-sm text-muted-foreground">recursos/ano</p>
                  <p className="text-xs mt-1">3 provas × 10.000 recursos cada</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Taxa de Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">3-9%</div>
                  <p className="text-sm text-muted-foreground">aprovação FGV</p>
                  <p className="text-xs mt-1">Dados mencionados na reunião</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Prazo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3 dias</div>
                  <p className="text-sm text-muted-foreground">prazo recursal</p>
                  <p className="text-xs mt-1">Após resultado preliminar</p>
                </CardContent>
              </Card>
            </div>

            {/* Fluxo da Solução */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold">
                  Fluxo da Solução Proposta
                </CardTitle>
                <CardDescription>
                  Baseado nas funcionalidades discutidas na reunião
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <Upload className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">1. Upload de Documentos</h3>
                      <p className="text-sm text-muted-foreground">
                        Prova manuscrita + espelho de gabarito
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <FileText className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">2. OCR + Correção</h3>
                      <p className="text-sm text-muted-foreground">
                        Leitura do manuscrito com correção manual
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <Brain className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">3. Análise Prévia</h3>
                      <p className="text-sm text-muted-foreground">
                        IA analisa viabilidade (serviço pago)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <DollarSign className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">4. Pagamento</h3>
                      <p className="text-sm text-muted-foreground">
                        Gateway internacional (Holanda)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <FileText className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">5. Geração do Recurso</h3>
                      <p className="text-sm text-muted-foreground">
                        IA gera recurso automaticamente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <Send className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">6. Envio + Instruções</h3>
                      <p className="text-sm text-muted-foreground">
                        Email com recurso + como protocolar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vantagem Competitiva */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-green-800">
                  Vantagem Competitiva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-green-800">
                      <Clock className="h-5 w-5 inline mr-2" />
                      <strong>Velocidade:</strong> Quase instantâneo vs dias
                    </div>
                    <div className="text-green-800">
                      <DollarSign className="h-5 w-5 inline mr-2" />
                      <strong>Preço:</strong> R$ 300 vs R$ 600-700
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-green-800">
                      <CheckCircle className="h-5 w-5 inline mr-2" />
                      <strong>Disponibilidade:</strong> 24/7 vs limitado
                    </div>
                    <div className="text-green-800">
                      <Brain className="h-5 w-5 inline mr-2" />
                      <strong>Consistência:</strong> IA treinada vs subjetividade
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTAs para Demo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/demo-oab-recurso/upload">
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                  Upload de Prova
                </Button>
              </Link>
              <Link href="/demo-oab-recurso/analise">
                <Button variant="outline" className="w-full h-12">
                  Análise Prévia
                </Button>
              </Link>
              <Link href="/demo-oab-recurso/recurso">
                <Button variant="outline" className="w-full h-12">
                  Recurso Gerado
                </Button>
              </Link>
              <Link href="/demo-oab-recurso/admin">
                <Button variant="outline" className="w-full h-12">
                  Painel Admin
                </Button>
              </Link>
            </div>

            {/* Footer da Demo */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center text-blue-800">
                  <p className="text-sm">
                    <strong>Demo baseada na reunião comercial de 29/08/2025</strong>
                  </p>
                  <p className="text-xs mt-1">
                    João Paula & Pedro Moretto (Pivot - Holanda) + Otávio Codato (Dev.io)
                  </p>
                  <p className="text-xs mt-1">
                    Implementação: PRD-to-Prototype Intelligence Framework
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}