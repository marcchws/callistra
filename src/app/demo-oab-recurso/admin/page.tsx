"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Target,
  AlertCircle,
  BarChart3,
  Calendar,
  Download
} from "lucide-react"
import Link from "next/link"

export default function AdminPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  // Dados simulados baseados na reunião
  const kpis = {
    totalRecursos: 1247,
    analisesPrevias: 2156,
    taxaConversao: 58, // % que vai de análise prévia para recurso completo
    taxaAprovacao: 23, // % de recursos aprovados pela FGV
    faturamentoMensal: 187500,
    ticketMedio: 275
  }

  const casosRecentes = [
    {
      id: "REC-2025-089456",
      candidato: "João P. S.",
      prova: "OAB XXXVII",
      status: "enviado",
      dataSubmissao: "18/08/2025",
      valorPago: "R$ 300",
      probabilidade: 75,
      resultado: "pendente"
    },
    {
      id: "REC-2025-089455", 
      candidato: "Maria L. O.",
      prova: "OAB XXXVII",
      status: "aprovado",
      dataSubmissao: "17/08/2025", 
      valorPago: "R$ 300",
      probabilidade: 82,
      resultado: "aprovado"
    },
    {
      id: "REC-2025-089454",
      candidato: "Carlos M. R.",
      prova: "OAB XXXVII", 
      status: "negado",
      dataSubmissao: "16/08/2025",
      valorPago: "R$ 300",
      probabilidade: 45,
      resultado: "negado"
    },
    {
      id: "REC-2025-089453",
      candidato: "Ana P. F.",
      prova: "OAB XXXVII",
      status: "enviado", 
      dataSubmissao: "18/08/2025",
      valorPago: "R$ 300",
      probabilidade: 88,
      resultado: "pendente"
    },
    {
      id: "REC-2025-089452",
      candidato: "Pedro H. S.",
      prova: "OAB XXXVII",
      status: "aprovado",
      dataSubmissao: "15/08/2025",
      valorPago: "R$ 300", 
      probabilidade: 69,
      resultado: "aprovado"
    }
  ]

  const estatisticasIA = {
    precisaoOCR: 94.5,
    tempoMedioAnalise: "2.3 min",
    acuracia: 87.2,
    melhoriaMensal: 5.8
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
                DEMO - Painel Administrativo
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard - Recursos OAB IA
              </h1>
              <p className="text-muted-foreground">
                Visão gerencial da operação Pivot (Holanda) - Recursos Administrativos OAB
              </p>
            </div>

            {/* Context da Reunião */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-blue-800">
                  Visão Estratégica - Baseada na Reunião
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 space-y-2">
                <p className="text-sm">
                  • <strong>Mercado Total:</strong> ~30.000 recursos/ano (3 provas × 10.000 recursos)
                </p>
                <p className="text-sm">
                  • <strong>Market Share Atual:</strong> 5% do mercado (~1.500 recursos/ano)
                </p>
                <p className="text-sm">
                  • <strong>Operação:</strong> Empresa na Holanda (benefícios fiscais + proteção jurídica)
                </p>
                <p className="text-sm">
                  • <strong>Expansão Planejada:</strong> Outros concursos federais/estaduais + medicina (CRM)
                </p>
              </CardContent>
            </Card>

            {/* KPIs Principais */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{kpis.totalRecursos.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+12% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Análises Prévias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{kpis.analisesPrevias.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">R$ 50 cada</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{kpis.taxaConversao}%</div>
                  <p className="text-sm text-muted-foreground">análise → recurso</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Taxa Aprovação FGV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{kpis.taxaAprovacao}%</div>
                  <p className="text-sm text-muted-foreground">vs 3-9% mercado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {(kpis.faturamentoMensal / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-muted-foreground">EUR/mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">R$ {kpis.ticketMedio}</div>
                  <p className="text-sm text-muted-foreground">por recurso</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="casos" className="space-y-4">
              <TabsList>
                <TabsTrigger value="casos">Casos Recentes</TabsTrigger>
                <TabsTrigger value="ia">Performance IA</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="expansao">Expansão</TabsTrigger>
              </TabsList>

              {/* Tab: Casos Recentes */}
              <TabsContent value="casos">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-medium">Casos Processados</CardTitle>
                        <CardDescription>Recursos enviados nos últimos 7 dias</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID do Caso</TableHead>
                          <TableHead>Candidato</TableHead>
                          <TableHead>Prova</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Prob. IA</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Resultado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {casosRecentes.map((caso) => (
                          <TableRow key={caso.id}>
                            <TableCell className="font-mono text-sm">{caso.id}</TableCell>
                            <TableCell>{caso.candidato}</TableCell>
                            <TableCell>{caso.prova}</TableCell>
                            <TableCell>{caso.dataSubmissao}</TableCell>
                            <TableCell>{caso.valorPago}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium">{caso.probabilidade}%</div>
                                <div 
                                  className={`h-2 w-8 rounded-full ${
                                    caso.probabilidade >= 70 ? 'bg-green-500' :
                                    caso.probabilidade >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  caso.status === 'aprovado' ? 'default' :
                                  caso.status === 'enviado' ? 'secondary' : 'destructive'
                                }
                              >
                                {caso.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {caso.resultado === 'aprovado' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {caso.resultado === 'negado' && <XCircle className="h-4 w-4 text-red-500" />}
                              {caso.resultado === 'pendente' && <Clock className="h-4 w-4 text-amber-500" />}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Performance IA */}
              <TabsContent value="ia">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Métricas da IA</CardTitle>
                      <CardDescription>Performance técnica do sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Precisão OCR</span>
                          <span className="text-sm font-medium">{estatisticasIA.precisaoOCR}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${estatisticasIA.precisaoOCR}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Acurácia Análise</span>
                          <span className="text-sm font-medium">{estatisticasIA.acuracia}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${estatisticasIA.acuracia}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tempo Médio</span>
                          <span className="text-sm font-medium">{estatisticasIA.tempoMedioAnalise}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Melhoria Mensal</span>
                          <span className="text-sm font-medium text-green-600">+{estatisticasIA.melhoriaMensal}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Feedback Loop</CardTitle>
                      <CardDescription>Aprendizado contínuo da IA</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">782 casos confirmados para treinamento</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Precisão melhorou 15% em 3 meses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Taxa de aprovação 2.5x melhor que mercado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">34 casos para revisão manual</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Financeiro */}
              <TabsContent value="financeiro">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Receita por Serviço</CardTitle>
                      <CardDescription>Breakdown de faturamento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recursos Completos (R$ 300)</span>
                          <span className="font-medium">R$ 374.100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Análises Prévias (R$ 50)</span>
                          <span className="font-medium">R$ 107.800</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="text-sm">(-) Gateway Fees</span>
                          <span className="font-medium">-R$ 24.095</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="text-sm">(-) Custos OCR/IA</span>
                          <span className="font-medium">-R$ 12.400</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between items-center font-medium text-lg">
                          <span>Receita Líquida</span>
                          <span className="text-green-600">R$ 445.405</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Projeções</CardTitle>
                      <CardDescription>Cenários de crescimento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Market Share 10%</span>
                            <span className="font-medium">R$ 900K/mês</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Dobrando o market share atual</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">+ Medicina (CRM)</span>
                            <span className="font-medium">R$ 1.2M/mês</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Expansão para medicina conforme reunião</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">+ Outros Concursos</span>
                            <span className="font-medium">R$ 2.1M/mês</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Federais + estaduais (segunda fase escrita)</p>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center font-medium">
                            <span className="text-sm">Potencial 18 meses</span>
                            <span className="text-green-600">R$ 2.1M/mês</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Expansão */}
              <TabsContent value="expansao">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Roadmap de Expansão</CardTitle>
                    <CardDescription>Planos baseados na discussão da reunião</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-blue-800">Q4 2025 - Consolidação OAB</h3>
                        <p className="text-sm text-muted-foreground">
                          Otimizar IA, aumentar market share para 10%, melhorar precisão para 95%
                        </p>
                        <p className="text-xs mt-1 text-blue-600">Meta: 3.000 recursos/ano</p>
                      </div>

                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-green-800">Q1 2026 - Medicina (CRM)</h3>
                        <p className="text-sm text-muted-foreground">
                          Adaptar IA para prova do CRM (mencionado na reunião como próximo passo)
                        </p>
                        <p className="text-xs mt-1 text-green-600">Estimativa: +50% receita</p>
                      </div>

                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-medium text-purple-800">Q2 2026 - Concursos Federais</h3>
                        <p className="text-sm text-muted-foreground">
                          Expansão para concursos federais com segunda fase escrita (magistratura, MP, etc.)
                        </p>
                        <p className="text-xs mt-1 text-purple-600">Mercado potencial: 100K+ candidatos/ano</p>
                      </div>

                      <div className="border-l-4 border-amber-500 pl-4">
                        <h3 className="font-medium text-amber-800">Q3 2026 - Concursos Estaduais</h3>
                        <p className="text-sm text-muted-foreground">
                          Adaptar para concursos estaduais específicos de cada estado
                        </p>
                        <p className="text-xs mt-1 text-amber-600">Customização por estado</p>
                      </div>
                    </div>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-6">
                        <h4 className="font-medium text-blue-800 mb-2">Vantagens Competitivas</h4>
                        <div className="space-y-1 text-sm text-blue-700">
                          <p>• Operação na Holanda: proteção jurídica + benefícios fiscais</p>
                          <p>• IA proprietária: alimentada com dados reais de aprovação</p>
                          <p>• Velocidade: 3 minutos vs 3 dias de advogados</p>
                          <p>• Custo: R$ 300 vs R$ 600-700 do mercado</p>
                          <p>• Disponibilidade: 24/7 durante janela de recurso</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}