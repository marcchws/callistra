"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

// Componente Hero Section - Primeira seção da landing page
export function HeroSection() {
  const benefits = [
    "Gestão completa de processos jurídicos",
    "Controle financeiro integrado",
    "Comunicação centralizada com clientes",
    "Conformidade total com LGPD",
  ]

  // Scroll suave para seção de contato (Cenário 3)
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Principal */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Transforme a gestão do seu{" "}
                <span className="text-blue-600">escritório de advocacia</span>
              </h1>
              <p className="text-lg text-gray-600">
                O Callistra é a plataforma completa para automatizar processos,
                gerenciar clientes e aumentar a produtividade do seu escritório
                jurídico.
              </p>
            </div>

            {/* Lista de Benefícios */}
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={scrollToContact}
              >
                Solicitar demonstração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const servicesSection = document.getElementById("services")
                  servicesSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Conhecer planos
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-600">
                Mais de <strong>500 escritórios</strong> já confiam no Callistra
              </p>
            </div>
          </div>

          {/* Imagem/Ilustração */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
              {/* Placeholder para imagem */}
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">C</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Sistema Callistra
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Gestão jurídica inteligente
                </p>
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
