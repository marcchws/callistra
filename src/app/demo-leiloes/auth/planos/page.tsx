"use client"

import { useState } from "react"
import { Check, Crown, Star, ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Plano {
  id: string
  nome: string
  preco: number
  precoAnual?: number
  descricao: string
  recursos: string[]
  popular?: boolean
  trial?: boolean
}

const planos: Plano[] = [
  {
    id: "trial",
    nome: "Trial Gratuito",
    preco: 0,
    descricao: "Experimente por 7 dias",
    trial: true,
    recursos: [
      "Acesso a todos os leilões",
      "Calculadora de investimento",
      "Sistema de favoritos",
      "Filtros avançados",
      "Suporte básico"
    ]
  },
  {
    id: "basico",
    nome: "Básico",
    preco: 29.90,
    precoAnual: 299,
    descricao: "Para compradores iniciantes",
    recursos: [
      "Tudo do trial gratuito",
      "Atualizações 2x por dia",
      "Alertas por WhatsApp",
      "Histórico de leilões",
      "Suporte prioritário"
    ]
  },
  {
    id: "premium",
    nome: "Premium",
    preco: 49.90,
    precoAnual: 499,
    descricao: "Para profissionais do ramo",
    popular: true,
    recursos: [
      "Tudo do plano Básico",
      "Análises de mercado",
      "Relatórios personalizados",
      "API para integração",
      "Consultoria especializada",
      "Suporte 24/7"
    ]
  },
  {
    id: "empresarial",
    nome: "Empresarial",
    preco: 99.90,
    precoAnual: 999,
    descricao: "Para revendedoras e empresas",
    recursos: [
      "Tudo do plano Premium",
      "Múltiplos usuários (até 10)",
      "Dashboard empresarial",
      "Métricas avançadas",
      "Gerente de conta dedicado",
      "Integração WhatsApp Business",
      "Treinamento da equipe"
    ]
  }
]

export default function PlanosPage() {
  const [periodoAnual, setPeriodoAnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSelecionarPlano = (plano: Plano) => {
    setLoading(plano.id)
    
    setTimeout(() => {
      if (plano.id === "trial") {
        // Ativar trial gratuito
        const userData = {
          email: "usuario@demo.com",
          nome: "Usuário Demo",
          plano: "trial",
          dataAssinatura: new Date().toISOString(),
          diasRestantes: 7,
          ativo: true
        }
        localStorage.setItem("maxleilao_user", JSON.stringify(userData))
        toast.success("Trial de 7 dias ativado!")
        router.push("/demo-leiloes")
      } else {
        // Redirecionar para checkout
        router.push(`/demo-leiloes/auth/checkout?plano=${plano.id}&periodo=${periodoAnual ? 'anual' : 'mensal'}`)
      }
      setLoading(null)
    }, 1000)
  }

  const calcularDesconto = (precoMensal: number, precoAnual: number) => {
    const precoMensalAnual = precoMensal * 12
    const desconto = ((precoMensalAnual - precoAnual) / precoMensalAnual) * 100
    return Math.round(desconto)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes/auth/registro">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Centralize todos os leilões do Brasil em uma plataforma
          </p>
          
          {/* Toggle Período */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!periodoAnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setPeriodoAnual(!periodoAnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                periodoAnual ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  periodoAnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${periodoAnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Anual
            </span>
            {periodoAnual && (
              <Badge className="bg-green-500 text-white">
                Até 17% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planos.map((plano) => {
            const precoExibir = periodoAnual && plano.precoAnual ? plano.precoAnual : plano.preco
            const isCarregando = loading === plano.id

            return (
              <Card 
                key={plano.id} 
                className={`relative hover:shadow-lg transition-shadow ${
                  plano.popular ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                } ${plano.trial ? 'border-green-500 border-2' : ''}`}
              >
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                {plano.trial && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">
                      Grátis por 7 dias
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plano.nome}</CardTitle>
                  <p className="text-gray-600 text-sm">{plano.descricao}</p>
                  
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      R$ {precoExibir.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plano.preco === 0 ? "por 7 dias" : periodoAnual ? "por ano" : "por mês"}
                    </div>
                    
                    {periodoAnual && plano.precoAnual && plano.preco > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Economize {calcularDesconto(plano.preco, plano.precoAnual)}%
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plano.recursos.map((recurso, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recurso}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSelecionarPlano(plano)}
                    disabled={isCarregando}
                    className={`w-full ${
                      plano.popular ? 'bg-purple-600 hover:bg-purple-700' : 
                      plano.trial ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                    variant={plano.popular || plano.trial ? 'default' : 'outline'}
                  >
                    {isCarregando ? "Processando..." : 
                     plano.trial ? "Começar grátis" : 
                     "Selecionar plano"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-lg">Pagamento Seguro</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cartão de crédito ou débito</li>
                <li>• PIX com desconto de 5%</li>
                <li>• Boleto bancário</li>
                <li>• Cancelamento a qualquer momento</li>
                <li>• Sem taxas escondidas</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-lg">Suporte Completo</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Notificações por WhatsApp</li>
                <li>• Suporte técnico especializado</li>
                <li>• Tutoriais em vídeo</li>
                <li>• Base de conhecimento</li>
                <li>• Comunidade exclusiva</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Perguntas Frequentes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Posso cancelar a qualquer momento?</p>
              <p className="text-blue-700">Sim, cancele sem burocracias pelo painel de usuário.</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Os preços incluem todos os recursos?</p>
              <p className="text-blue-700">Sim, sem taxas adicionais ou recursos escondidos.</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Quantos sites de leilão são monitorados?</p>
              <p className="text-blue-700">Atualmente 14 sites, com novos sendo adicionados mensalmente.</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Há limite de pesquisas?</p>
              <p className="text-blue-700">Não, use quantas vezes quiser dentro do seu plano.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
