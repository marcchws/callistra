"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Crown, Star, Zap, ArrowRight, Phone } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { TipoPlano, PLANOS_DISPONIVEIS, PlanoInfo } from "./types"
import { formatarMoeda, calcularDescontoAnual } from "./utils"

// Icons para cada tipo de plano
const PLANO_ICONS = {
  [TipoPlano.FREE]: Zap,
  [TipoPlano.STANDARD]: Check,
  [TipoPlano.PREMIUM]: Star,
  [TipoPlano.ENTERPRISE]: Crown
}

// Interface para props do componente de plano
interface PlanoCardProps {
  plano: PlanoInfo
  planoAtual?: TipoPlano
  onSelect: (plano: TipoPlano) => void
  loading?: boolean
}

// Componente individual do cartão de plano
function PlanoCard({ plano, planoAtual, onSelect, loading }: PlanoCardProps) {
  const Icon = PLANO_ICONS[plano.id]
  const isAtual = planoAtual === plano.id
  const isRecomendado = plano.recomendado
  const isCustomizado = plano.customizado
  const descontoAnual = plano.precoAnual && plano.preco > 0 
    ? calcularDescontoAnual(plano.preco, plano.precoAnual)
    : 0

  return (
    <Card className={`relative h-full flex flex-col ${
      isAtual 
        ? "border-blue-600 bg-blue-50" 
        : isRecomendado 
        ? "border-blue-300 shadow-lg" 
        : "border-gray-200"
    }`}>
      {/* Badge para plano recomendado */}
      {isRecomendado && !isAtual && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white">
            Mais Popular
          </Badge>
        </div>
      )}
      
      {/* Badge para plano atual */}
      {isAtual && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-600 text-white">
            Plano Atual
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold">{plano.nome}</CardTitle>
        <CardDescription className="text-sm">{plano.descricao}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Preço */}
        <div className="text-center">
          {plano.preco === 0 ? (
            <div className="text-3xl font-bold text-gray-900">Gratuito</div>
          ) : isCustomizado ? (
            <div className="text-3xl font-bold text-gray-900">Personalizado</div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">
                {formatarMoeda(plano.preco)}
                <span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              {plano.precoAnual && (
                <div className="text-sm text-green-600">
                  ou {formatarMoeda(plano.precoAnual)}/ano ({descontoAnual}% off)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recursos */}
        <div className="space-y-2">
          {plano.recursos.map((recurso, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{recurso}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {isCustomizado ? (
          // Scenario 13: Plano enterprise → Direcionado para consultor
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              toast.success("Entrando em contato com nosso consultor...", {
                duration: 3000,
                position: "bottom-right"
              })
              // Simular redirecionamento para consultor
              setTimeout(() => {
                window.open("https://wa.me/5511999999999?text=Olá, gostaria de conhecer o plano Enterprise do Callistra", "_blank")
              }, 1000)
            }}
            disabled={loading}
          >
            <Phone className="mr-2 h-4 w-4" />
            Falar com Consultor
          </Button>
        ) : isAtual ? (
          <Button 
            variant="outline" 
            className="w-full"
            disabled
          >
            Plano Atual
          </Button>
        ) : (
          <Button 
            className={`w-full ${
              isRecomendado 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-900 hover:bg-gray-800"
            }`}
            onClick={() => onSelect(plano.id)}
            disabled={loading}
          >
            {plano.preco === 0 ? "Começar Grátis" : "Selecionar Plano"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function SelecionarPlanoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [planoAtual, setPlanoAtual] = useState<TipoPlano>() // Simulação do plano atual do usuário

  // Simular carregamento do plano atual do usuário
  // Em implementação real, viria do contexto/API
  
  // AC2: Possibilitar seleção de novo plano
  const handleSelecionarPlano = async (plano: TipoPlano) => {
    try {
      setLoading(true)
      
      // Scenario 1: Selecionar plano free → Acesso liberado após cadastro
      if (plano === TipoPlano.FREE) {
        toast.success("Redirecionando para cadastro gratuito...", {
          duration: 2000,
          position: "bottom-right"
        })
        
        setTimeout(() => {
          router.push(`/cliente/selecionar-plano/checkout?plano=${plano}`)
        }, 1000)
        return
      }
      
      // Scenario 2: Selecionar plano pago → Direcionamento para pagamento
      if (plano === TipoPlano.STANDARD || plano === TipoPlano.PREMIUM) {
        toast.success("Redirecionando para checkout...", {
          duration: 2000,
          position: "bottom-right"
        })
        
        setTimeout(() => {
          router.push(`/cliente/selecionar-plano/checkout?plano=${plano}`)
        }, 1000)
        return
      }
      
    } catch (error) {
      toast.error("Erro ao selecionar plano. Tente novamente.", {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header seguindo typography hierarchy corporativa */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Escolha Seu Plano</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Selecione o plano ideal para seu escritório. Você pode alterar ou cancelar a qualquer momento.
        </p>
      </div>

      {/* AC1: Visualizar planos disponíveis com diferenciação visual */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANOS_DISPONIVEIS.map((plano) => (
          <PlanoCard
            key={plano.id}
            plano={plano}
            planoAtual={planoAtual}
            onSelect={handleSelecionarPlano}
            loading={loading}
          />
        ))}
      </div>

      {/* Seção de comparação detalhada */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-xl font-semibold">Compare os Planos</CardTitle>
          <CardDescription>
            Veja em detalhes o que está incluído em cada plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Recursos</th>
                  {PLANOS_DISPONIVEIS.filter(p => !p.customizado).map(plano => (
                    <th key={plano.id} className="text-center py-3 px-4 font-medium">
                      {plano.nome}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Usuários inclusos</td>
                  {PLANOS_DISPONIVEIS.filter(p => !p.customizado).map(plano => (
                    <td key={plano.id} className="text-center py-3 px-4">
                      {plano.usuariosInclusos === -1 ? "Ilimitado" : plano.usuariosInclusos}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Processos inclusos</td>
                  {PLANOS_DISPONIVEIS.filter(p => !p.customizado).map(plano => (
                    <td key={plano.id} className="text-center py-3 px-4">
                      {plano.processosInclusos === -1 ? "Ilimitado" : plano.processosInclusos}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Backup</td>
                  {PLANOS_DISPONIVEIS.filter(p => !p.customizado).map(plano => (
                    <td key={plano.id} className="text-center py-3 px-4">
                      {plano.id === TipoPlano.FREE ? "Manual" : 
                       plano.id === TipoPlano.STANDARD ? "Diário" : "Tempo Real"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4">Suporte</td>
                  {PLANOS_DISPONIVEIS.filter(p => !p.customizado).map(plano => (
                    <td key={plano.id} className="text-center py-3 px-4">
                      {plano.id === TipoPlano.FREE ? "E-mail" :
                       plano.id === TipoPlano.STANDARD ? "Chat" : "Prioritário"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ e informações adicionais */}
      <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 mt-1">
                <span className="text-sm font-bold text-white">?</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Dúvidas sobre os planos?
                </p>
                <p className="text-sm text-blue-700">
                  Você pode fazer upgrade ou downgrade a qualquer momento. 
                  No upgrade, o acesso às novas funcionalidades é imediato. 
                  No downgrade, as alterações são aplicadas no próximo ciclo de cobrança.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
