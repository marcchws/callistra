"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  CheckCircle, 
  Clock, 
  FileText,
  Copy,
  ExternalLink,
  AlertCircle,
  Calendar,
  User,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function RecursoGerado() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [recursoCompleto, setRecursoCompleto] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Simular geração do recurso
  useState(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false)
      setRecursoCompleto(true)
    }, 3000)
    return () => clearTimeout(timer)
  })

  const sendEmail = () => {
    setEmailSent(true)
    toast.success("Recurso enviado para seu email com instruções de protocolo!")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recursoTexto)
    toast.success("Recurso copiado para área de transferência!")
  }

  const downloadPDF = () => {
    toast.success("Download do PDF iniciado!")
  }

  // Dados do processo (baseados na reunião)
  const processoData = {
    candidato: "João Paulo Silva",
    cpf: "123.456.789-00",
    prova: "Segunda Fase OAB XXXVII",
    data: "15 de agosto de 2025",
    prazoRecurso: "18 de agosto de 2025 (23:59h)",
    protocolo: "REC-2025-089456"
  }

  const recursoTexto = `RECURSO ADMINISTRATIVO
Segunda Fase do Exame de Ordem XXXVII

À
FUNDAÇÃO GETÚLIO VARGAS - FGV
Coordenação do Exame de Ordem

O(A) candidato(a) JOÃO PAULO SILVA, CPF nº 123.456.789-00, inscrito(a) no Exame de Ordem dos Advogados do Brasil - Segunda Fase, vem, respeitosamente, perante Vossa Senhoria, interpor RECURSO ADMINISTRATIVO contra a correção de sua prova, com fundamento no que segue:

I - DOS FATOS

O requerente submeteu-se à Segunda Fase do Exame de Ordem XXXVII, realizada em 15 de agosto de 2025, tendo obtido pontuação insuficiente para aprovação.

Após minuciosa análise comparativa entre as respostas apresentadas e o espelho de correção divulgado, verificou-se que houve equívocos na avaliação, os quais prejudicaram injustamente a pontuação do candidato.

II - DO DIREITO E FUNDAMENTAÇÃO

1. QUESTÃO 1 - DIREITO CIVIL (Recuperação de 8 pontos)

O candidato utilizou corretamente o termo técnico "doação inoficiosa", conceito previsto no art. 549 do Código Civil, que define as doações que ultrapassam a parte disponível do patrimônio.

ERRO DE CORREÇÃO IDENTIFICADO: O corretor não reconheceu o termo técnico "doação inoficiosa", exigindo conceituação por extenso. Contudo, o uso de terminologia jurídica precisa demonstra conhecimento técnico e deve ser valorizado, não penalizado.

FUNDAMENTAÇÃO LEGAL: O termo "doação inoficiosa" é consagrado na doutrina civilista e amplamente utilizado pelos Tribunais Superiores. Sua aplicação correta demonstra domínio da matéria.

PEDIDO: Atribuição de 8 (oito) pontos adicionais pela correta aplicação do instituto jurídico.

2. QUESTÃO 2 - DIREITO PROCESSUAL CIVIL (Recuperação de 6 pontos)

O candidato citou corretamente os dispositivos legais aplicáveis, apresentando fundamentação jurídica sólida e pertinente ao caso concreto.

ERRO DE CORREÇÃO IDENTIFICADO: A formatação da citação legal seguiu padrão técnico adequado, mas divergiu minimamente do modelo esperado pelo corretor, gerando perda de pontos injustificada.

FUNDAMENTAÇÃO: A forma de citação utilizada está em conformidade com as normas da ABNT e práticas forenses consolidadas.

PEDIDO: Reconhecimento da correção material da resposta e atribuição de 6 (seis) pontos adicionais.

3. QUESTÃO 3 - DIREITO CONSTITUCIONAL (Recuperação de 3 pontos)

A resposta demonstrou conhecimento constitucional adequado, com aplicação correta dos princípios constitucionais ao caso apresentado.

ERRO DE CORREÇÃO IDENTIFICADO: Aspectos meramente formais foram supervalorizados em detrimento do conteúdo jurídico substancial apresentado.

PEDIDO: Reavaliação focada no mérito da resposta, com atribuição de 3 (três) pontos adicionais.

4. PEÇA PRÁTICA (Recuperação de 12 pontos)

A peça apresentou estrutura processual adequada, com pedidos juridicamente fundamentados e em conformidade com a legislação aplicável.

ERROS DE CORREÇÃO IDENTIFICADOS:
- A estrutura da peça seguiu padrão técnico correto (preâmbulo, fatos, direito, pedidos)
- Os pedidos formulados eram adequados e juridicamente possíveis
- A fundamentação jurídica demonstrou conhecimento técnico sólido
- A linguagem técnica utilizada é apropriada para peças jurídicas

FUNDAMENTAÇÃO: A peça atendeu aos requisitos legais e processuais, apresentando fundamentação doutrinária e legal consistente.

PEDIDO: Reavaliação integral da peça com atribuição de 12 (doze) pontos adicionais.

III - DOS PEDIDOS

Ante o exposto, requer-se:

a) O deferimento do presente recurso administrativo;

b) A reavaliação das questões e peça prática indicadas, com a correção dos equívocos apontados;

c) A atribuição da pontuação adicional de 29 (vinte e nove) pontos, totalizando 71 (setenta e um) pontos, resultado suficiente para aprovação;

d) A alteração do resultado para "APROVADO" no sistema da FGV.

Termos em que pede deferimento.

São Paulo, 18 de agosto de 2025.

_______________________________
(Assinatura do Candidato)
JOÃO PAULO SILVA
CPF: 123.456.789-00`

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Link href="/demo-oab-recurso/analise" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Análise
              </Link>
              <Badge variant="secondary" className="mb-2">
                DEMO - Recurso Gerado pela IA
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Recurso Administrativo Gerado
              </h1>
              <p className="text-muted-foreground">
                Seu recurso foi criado automaticamente pela IA baseado na análise da sua prova
              </p>
            </div>

            {/* Geração em Progresso */}
            {isGenerating && (
              <Card className="border-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    IA Gerando seu Recurso...
                  </CardTitle>
                  <CardDescription>
                    Criando documento personalizado baseado na análise da sua prova
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
                    <div className="space-y-2">
                      <p className="font-medium">Processando argumentos jurídicos...</p>
                      <p className="text-sm text-muted-foreground">
                        Aplicando fundamentação legal específica para cada questão identificada
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recurso Completo */}
            {recursoCompleto && (
              <>
                {/* Status e Info */}
                <Card className="border-green-500 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <CardTitle className="text-xl font-semibold text-green-800">
                        Recurso Gerado com Sucesso!
                      </CardTitle>
                    </div>
                    <CardDescription className="text-green-700">
                      Documento profissional pronto para protocolo na FGV
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-800">
                          <User className="h-4 w-4" />
                          <span className="text-sm"><strong>Candidato:</strong> {processoData.candidato}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-800">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm"><strong>Prova:</strong> {processoData.prova}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-800">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm"><strong>Data da Prova:</strong> {processoData.data}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-800">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm"><strong>Prazo:</strong> {processoData.prazoRecurso}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-800">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm"><strong>Protocolo:</strong> {processoData.protocolo}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Alertas Importantes */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Prazo Crítico:</strong> Você tem até {processoData.prazoRecurso} para protocolar 
                    o recurso na FGV. Não perca o prazo de 3 dias!
                  </AlertDescription>
                </Alert>

                {/* Ações */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Button 
                    onClick={sendEmail}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={emailSent}
                  >
                    {emailSent ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enviado!
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar por Email
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={downloadPDF}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Texto
                  </Button>
                </div>

                {/* Conteúdo do Recurso */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Recurso Administrativo - Visualização
                    </CardTitle>
                    <CardDescription>
                      Documento gerado pela IA com argumentação jurídica fundamentada
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea 
                        value={recursoTexto}
                        readOnly
                        rows={25}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Documento de {recursoTexto.length.toLocaleString()} caracteres
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Instruções de Protocolo */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-amber-800">
                      Instruções para Protocolo na FGV
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Passos para submeter seu recurso administrativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-amber-800">
                    <div className="space-y-2">
                      <p className="font-medium">1. Acesse o sistema FGV Projetos:</p>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm">• Entre em: <strong>www.fgv.br/oab</strong></p>
                        <p className="text-sm">• Faça login com seus dados de candidato</p>
                        <p className="text-sm">• Acesse "Recursos" → "Segunda Fase"</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">2. Submissão do Recurso:</p>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm">• Cole o texto gerado no campo "Argumentação"</p>
                        <p className="text-sm">• NÃO se identifique no texto (conforme edital)</p>
                        <p className="text-sm">• Confirme os dados antes de submeter</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">3. Finalização:</p>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm">• Salve o número de protocolo</p>
                        <p className="text-sm">• Prazo limite: <strong>{processoData.prazoRecurso}</strong></p>
                        <p className="text-sm">• Aguarde o resultado em até 15 dias úteis</p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => window.open('https://www.fgv.br/oab', '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Acessar Site da FGV
                    </Button>
                  </CardContent>
                </Card>

                {/* Próximos Passos */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-blue-800">
                      Próximos Passos e Suporte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-blue-800">
                    <div className="space-y-2">
                      <p className="text-sm">
                        • <strong>Acompanhamento:</strong> Monitore o resultado do recurso pelo sistema FGV
                      </p>
                      <p className="text-sm">
                        • <strong>Expansão:</strong> Nosso serviço pode ser usado para outros concursos federais/estaduais
                      </p>
                      <p className="text-sm">
                        • <strong>Suporte:</strong> Qualquer dúvida sobre o processo, entre em contato
                      </p>
                      <p className="text-sm">
                        • <strong>Feedback:</strong> Nos informe o resultado para melhorar nossa IA
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/demo-oab-recurso/admin">
                        <Button variant="outline" size="sm">
                          Ver Painel Administrativo
                        </Button>
                      </Link>
                    </div>
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