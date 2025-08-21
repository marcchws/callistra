"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import { ServicePlan } from "../types"

// Componente Services Section - Seção "Serviços e Planos"
// Atende ao Requisito: Critério 5 (Página Serviços e Planos)
export function ServicesSection() {
  const plans: ServicePlan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Ideal para advogados autônomos e pequenos escritórios",
      price: "R$ 97/mês",
      features: [
        "Até 3 usuários",
        "50 processos ativos",
        "Gestão de clientes",
        "Agenda integrada",
        "Chat interno",
        "Suporte por email",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      description: "Para escritórios em crescimento que precisam de mais recursos",
      price: "R$ 297/mês",
      recommended: true,
      features: [
        "Até 10 usuários",
        "Processos ilimitados",
        "Gestão financeira completa",
        "Contratos e procurações",
        "Relatórios avançados",
        "API de integração",
        "Suporte prioritário",
        "Backup diário",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Solução completa para grandes escritórios e bancas",
      price: "Sob consulta",
      features: [
        "Usuários ilimitados",
        "Processos ilimitados",
        "Personalização completa",
        "IA para criação de peças",
        "Múltiplas filiais",
        "Servidor dedicado",
        "Suporte 24/7",
        "Treinamento incluído",
        "SLA garantido",
      ],
    },
  ]

  // Scroll para contato
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Título da Seção */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Planos e Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu escritório. Todos incluem atualizações
            gratuitas e conformidade com LGPD.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.recommended
                  ? "border-blue-600 shadow-lg scale-105"
                  : "hover:shadow-md"
              } transition-all`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.recommended
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }`}
                  variant={plan.recommended ? "default" : "outline"}
                  onClick={scrollToContact}
                >
                  {plan.id === "enterprise" ? "Falar com consultor" : "Começar agora"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Serviços Adicionais */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Serviços Inclusos em Todos os Planos
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Migração Assistida",
                description: "Ajudamos na migração dos seus dados do sistema atual",
              },
              {
                title: "Treinamento Inicial",
                description: "Capacitação completa da equipe para uso do sistema",
              },
              {
                title: "Atualizações Gratuitas",
                description: "Novas funcionalidades sem custo adicional",
              },
              {
                title: "Conformidade LGPD",
                description: "Sistema totalmente adequado à legislação de proteção de dados",
              },
              {
                title: "Backup Automático",
                description: "Seus dados sempre seguros e disponíveis",
              },
              {
                title: "Suporte Técnico",
                description: "Equipe especializada para ajudar quando precisar",
              },
            ].map((service, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold text-gray-900">{service.title}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Não encontrou o plano ideal? Podemos criar uma solução personalizada.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={scrollToContact}
          >
            Falar com especialista
          </Button>
        </div>
      </div>
    </section>
  )
}
