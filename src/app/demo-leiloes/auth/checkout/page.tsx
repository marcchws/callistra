"use client"

import { useState, useEffect } from "react"
import { CreditCard, Lock, ArrowLeft, Check, Gift, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface PlanoDetalhes {
  id: string
  nome: string
  preco: number
  precoAnual?: number
  descricao: string
}

const planosDisponiveis: Record<string, PlanoDetalhes> = {
  basico: {
    id: "basico",
    nome: "Básico",
    preco: 29.90,
    precoAnual: 299,
    descricao: "Para compradores iniciantes"
  },
  premium: {
    id: "premium",
    nome: "Premium",
    preco: 49.90,
    precoAnual: 499,
    descricao: "Para profissionais do ramo"
  },
  empresarial: {
    id: "empresarial",
    nome: "Empresarial",
    preco: 99.90,
    precoAnual: 999,
    descricao: "Para revendedoras e empresas"
  }
}

export default function CheckoutPage() {
  const [formaPagamento, setFormaPagamento] = useState("cartao")
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: ""
  })
  const [dadosPessoais, setDadosPessoais] = useState({
    cpf: "",
    telefone: ""
  })
  const [loading, setLoading] = useState(false)
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoDetalhes | null>(null)
  const [periodoAnual, setPeriodoAnual] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const planoId = searchParams.get("plano")
    const periodo = searchParams.get("periodo")
    
    if (planoId && planosDisponiveis[planoId]) {
      setPlanoSelecionado(planosDisponiveis[planoId])
      setPeriodoAnual(periodo === "anual")
    }
  }, [searchParams])

  const calcularPrecoFinal = () => {
    if (!planoSelecionado) return 0
    
    let preco = periodoAnual && planoSelecionado.precoAnual ? 
      planoSelecionado.precoAnual : planoSelecionado.preco
    
    // Desconto PIX
    if (formaPagamento === "pix") {
      preco = preco * 0.95 // 5% desconto
    }
    
    return preco
  }

  const calcularDesconto = () => {
    if (!planoSelecionado || !periodoAnual || !planoSelecionado.precoAnual) return 0
    const precoMensalAnual = planoSelecionado.preco * 12
    return precoMensalAnual - planoSelecionado.precoAnual
  }

  const handlePagamento = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de processamento de pagamento
    setTimeout(() => {
      // Salvar dados da assinatura no localStorage (mock)
      const userData = {
        email: "usuario@demo.com",
        nome: dadosCartao.nome || "Usuário Demo",
        plano: planoSelecionado?.id,
        planoPeriodo: periodoAnual ? "anual" : "mensal",
        dataAssinatura: new Date().toISOString(),
        diasRestantes: periodoAnual ? 365 : 30,
        ativo: true,
        valorPago: calcularPrecoFinal(),
        formaPagamento: formaPagamento
      }
      localStorage.setItem("maxleilao_user", JSON.stringify(userData))
      
      toast.success("Pagamento processado com sucesso!")
      router.push("/demo-leiloes?welcome=true")
      setLoading(false)
    }, 2000)
  }

  if (!planoSelecionado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Plano não encontrado</p>
            <Link href="/demo-leiloes/auth/planos">
              <Button>Voltar para planos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes/auth/planos">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para planos
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Pagamento Seguro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Forma de Pagamento */}
                <div>
                  <Label className="text-base font-medium">Forma de pagamento</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <Button
                      variant={formaPagamento === "cartao" ? "default" : "outline"}
                      onClick={() => setFormaPagamento("cartao")}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs">Cartão</span>
                    </Button>
                    <Button
                      variant={formaPagamento === "pix" ? "default" : "outline"}
                      onClick={() => setFormaPagamento("pix")}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-xs">PIX -5%</span>
                    </Button>
                    <Button
                      variant={formaPagamento === "boleto" ? "default" : "outline"}
                      onClick={() => setFormaPagamento("boleto")}
                      className="h-12 flex flex-col items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span className="text-xs">Boleto</span>
                    </Button>
                  </div>
                </div>

                <form onSubmit={handlePagamento} className="space-y-4">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Dados pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={dadosPessoais.cpf}
                          onChange={(e) => setDadosPessoais(prev => ({ ...prev, cpf: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(11) 99999-9999"
                          value={dadosPessoais.telefone}
                          onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados do Cartão (se cartão selecionado) */}
                  {formaPagamento === "cartao" && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Dados do cartão</h3>
                      <div>
                        <Label htmlFor="numero">Número do cartão</Label>
                        <Input
                          id="numero"
                          placeholder="0000 0000 0000 0000"
                          value={dadosCartao.numero}
                          onChange={(e) => setDadosCartao(prev => ({ ...prev, numero: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nome">Nome no cartão</Label>
                        <Input
                          id="nome"
                          placeholder="Nome como no cartão"
                          value={dadosCartao.nome}
                          onChange={(e) => setDadosCartao(prev => ({ ...prev, nome: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="validade">Validade</Label>
                          <Input
                            id="validade"
                            placeholder="MM/AA"
                            value={dadosCartao.validade}
                            onChange={(e) => setDadosCartao(prev => ({ ...prev, validade: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="000"
                            value={dadosCartao.cvv}
                            onChange={(e) => setDadosCartao(prev => ({ ...prev, cvv: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PIX */}
                  {formaPagamento === "pix" && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span className="font-medium text-green-900">Pagamento via PIX</span>
                        <Badge className="bg-green-600 text-white">5% OFF</Badge>
                      </div>
                      <p className="text-sm text-green-800">
                        Após confirmar, você receberá o código PIX para pagamento instantâneo.
                      </p>
                    </div>
                  )}

                  {/* Boleto */}
                  {formaPagamento === "boleto" && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-orange-600 rounded"></div>
                        <span className="font-medium text-orange-900">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-orange-800">
                        O boleto será gerado após a confirmação. Prazo de 3 dias úteis para pagamento.
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Processando..." : `Finalizar pagamento - R$ ${calcularPrecoFinal().toFixed(2).replace('.', ',')}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Plano {planoSelecionado.nome}</span>
                    <span className="text-gray-600">{periodoAnual ? "Anual" : "Mensal"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Valor do plano</span>
                    <span>R$ {(periodoAnual && planoSelecionado.precoAnual ? planoSelecionado.precoAnual : planoSelecionado.preco).toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  {periodoAnual && calcularDesconto() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto anual</span>
                      <span>-R$ {calcularDesconto().toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  {formaPagamento === "pix" && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>-R$ {(calcularPrecoFinal() * 0.05).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>R$ {calcularPrecoFinal().toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Incluído no seu plano:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Acesso a todos os leilões</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Calculadora de investimento</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Alertas por WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Suporte especializado</span>
                    </li>
                  </ul>
                </div>

                {/* Garantia */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Garantia de 7 dias</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Não ficou satisfeito? Cancele em até 7 dias e receba 100% do valor de volta.
                  </p>
                </div>

                {/* Suporte */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Suporte WhatsApp</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Dúvidas? Entre em contato: (11) 99999-9999
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Segurança */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Pagamento seguro com criptografia SSL 256 bits</span>
          </div>
        </div>
      </div>
    </div>
  )
}
